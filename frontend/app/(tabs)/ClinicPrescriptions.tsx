/**
 * ClinicPrescriptions.tsx
 * ---------------------------------------------------------------
 * Interoperability screen inside the PharMe Pharmacy App.
 *
 * This screen demonstrates the full HL7 FHIR R4 integration between
 * the Dental Clinic (NU-HOSPITAL) and the PharMe pharmacy system.
 *
 * Workflow:
 *  1. Pharmacy enters the Clinic Patient ID and Prescription ID.
 *  2. PharMe calls the Clinic FHIR gateway using its registered
 *     pharmacy credentials (X-Pharmacy-Client, X-Pharmacy-Token).
 *  3. The Clinic backend checks:
 *       - Layer 1: Is there an ACTIVE Consent record? (The Gate)
 *       - Layer 2: Which resource types did the patient allow? (The Filter)
 *  4. PharMe displays the dynamically filtered FHIR Bundle or
 *     a clear message explaining WHY data was blocked.
 *  5. Pharmacist can add the specific medicines to the patient's
 *     PharMe cart from within the prescription view.
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchPatientEmrBundle,
  fetchPrescriptionBundle,
  type EmrFhirResult,
  type FhirMedicationRequest,
  type PrescriptionFhirResult,
} from '@/constants/clinicFhirApi';
import { addToCart } from '@/constants/cartStorage';
import { API_BASE_URL } from '@/constants/api';

const showAlert = (title: string, msg: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${msg}`);
  } else {
    Alert.alert(title, msg);
  }
};

// -----------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------

function ConsentBlockedBanner({ status, message }: { status: string; message: string }) {
  const isBlocked = status === 'blocked';
  return (
    <View style={[bannerStyles.container, isBlocked ? bannerStyles.blocked : bannerStyles.inactive]}>
      <Ionicons
        name={isBlocked ? 'shield-outline' : 'lock-closed-outline'}
        size={26}
        color={isBlocked ? '#EF4444' : '#F59E0B'}
        style={{ marginBottom: 10 }}
      />
      <Text style={bannerStyles.title}>
        {isBlocked ? 'Data Sharing Not Authorized' : 'Patient Disabled Sharing'}
      </Text>
      <Text style={bannerStyles.message}>{message}</Text>
      <Text style={bannerStyles.hint}>
        {isBlocked
          ? 'The patient has not set up a consent agreement with this pharmacy. Ask them to open their Clinic Portal → Prescriptions → Consent Settings → Authorize Integration.'
          : 'The patient has toggled their sharing OFF. They can re-enable it from the Clinic Portal → Prescriptions → Authorize Integration.'}
      </Text>
    </View>
  );
}

function ConsentActiveBadge() {
  return (
    <View style={badgeStyles.container}>
      <Ionicons name="shield-checkmark" size={16} color="#10B981" />
      <Text style={badgeStyles.text}>Patient Consent Active — FHIR R4 Compliant</Text>
    </View>
  );
}

function PatientCard({ info }: { info: EmrFhirResult['patientInfo'] }) {
  if (!info) return null;
  return (
    <View style={cardStyles.section}>
      <Text style={cardStyles.sectionTitle}>
        <Ionicons name="person-outline" size={14} /> Patient Demographics
      </Text>
      <View style={cardStyles.row}>
        <Text style={cardStyles.label}>Name</Text>
        <Text style={cardStyles.value}>{info.name?.[0]?.text || 'N/A'}</Text>
      </View>
      <View style={cardStyles.row}>
        <Text style={cardStyles.label}>Gender</Text>
        <Text style={cardStyles.value}>{info.gender}</Text>
      </View>
      <View style={cardStyles.row}>
        <Text style={cardStyles.label}>Date of Birth</Text>
        <Text style={cardStyles.value}>{info.birthDate}</Text>
      </View>
      <View style={cardStyles.row}>
        <Text style={cardStyles.label}>Patient ID (FHIR)</Text>
        <Text style={[cardStyles.value, cardStyles.mono]}>{info.id}</Text>
      </View>
    </View>
  );
}

function MedicationCard({
  item,
  onAddToCart,
}: {
  item: FhirMedicationRequest;
  onAddToCart: (item: FhirMedicationRequest) => void;
}) {
  const name = item.medicationCodeableConcept?.text || 'Unknown Medication';
  const dosage = item.dosageInstruction?.[0];
  const timing = dosage?.timing?.code?.text || '—';
  const dose = dosage?.doseAndRate?.[0]?.doseQuantity?.value || '—';
  const instructions = dosage?.text || '—';

  return (
    <View style={medStyles.card}>
      <View style={medStyles.header}>
        <View style={medStyles.iconWrap}>
          <Ionicons name="medical" size={18} color="#2E8BC0" />
        </View>
        <Text style={medStyles.name}>{name}</Text>
        <Text style={[medStyles.badge, item.status === 'active' ? medStyles.activeStatus : medStyles.otherStatus]}>
          {item.status}
        </Text>
      </View>

      <View style={medStyles.details}>
        <View style={medStyles.detailRow}>
          <Text style={medStyles.detailLabel}>Frequency</Text>
          <Text style={medStyles.detailValue}>{timing}</Text>
        </View>
        <View style={medStyles.detailRow}>
          <Text style={medStyles.detailLabel}>Dose</Text>
          <Text style={medStyles.detailValue}>{dose}</Text>
        </View>
        {instructions !== '—' && (
          <View style={medStyles.detailRow}>
            <Text style={medStyles.detailLabel}>Instructions</Text>
            <Text style={medStyles.detailValue}>{instructions}</Text>
          </View>
        )}
        {item.authoredOn && (
          <View style={medStyles.detailRow}>
            <Text style={medStyles.detailLabel}>Prescribed On</Text>
            <Text style={medStyles.detailValue}>{new Date(item.authoredOn).toLocaleDateString()}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={medStyles.cartBtn} onPress={() => onAddToCart(item)}>
        <Ionicons name="cart-outline" size={16} color="#fff" />
        <Text style={medStyles.cartBtnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

function AllergyTag({ text }: { text: string }) {
  return (
    <View style={allergyStyles.tag}>
      <Ionicons name="warning-outline" size={12} color="#B45309" />
      <Text style={allergyStyles.text}>{text}</Text>
    </View>
  );
}

// -----------------------------------------------------------------
// Main Screen
// -----------------------------------------------------------------

export default function ClinicPrescriptionsScreen() {
  const router = useRouter();

  const [patientId, setPatientId] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [loading, setLoading] = useState(false);

  const [prescriptionResult, setPrescriptionResult] = useState<PrescriptionFhirResult | null>(null);
  const [emrResult, setEmrResult] = useState<EmrFhirResult | null>(null);

  const prescriptionItems = (prescriptionResult?.bundle?.entry || [])
    .map((e) => e.resource)
    .filter((r): r is FhirMedicationRequest => r.resourceType === 'MedicationRequest');

  const handleFetchFhir = async () => {
    if (!patientId.trim() || !prescriptionId.trim()) {
      showAlert('Missing Fields', 'Please enter both Patient ID and Prescription ID from the Clinic system.');
      return;
    }

    setLoading(true);
    setPrescriptionResult(null);
    setEmrResult(null);

    try {
      // Run both FHIR queries in parallel
      const [presResult, emrRes] = await Promise.all([
        fetchPrescriptionBundle(prescriptionId.trim()),
        fetchPatientEmrBundle(patientId.trim()),
      ]);
      setPrescriptionResult(presResult);
      setEmrResult(emrRes);
    } catch (e) {
      showAlert('Error', 'An unexpected error occurred. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: FhirMedicationRequest) => {
    const medName = item.medicationCodeableConcept?.text || 'Prescribed Medicine';
    
    try {
      // Proactively fetch current pharmacy medicines
      const response = await fetch(`${API_BASE_URL}/api/medicines/`);
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacy inventory');
      }
      
      const medicines = await response.json();
      
      // Perform case-insensitive search
      const matchedMed = medicines.find(
        (m: any) => m.name && m.name.toLowerCase().trim() === medName.toLowerCase().trim()
      );
      
      if (matchedMed) {
        // If stock is zero
        if (matchedMed.stock <= 0) {
          showAlert('Out of Stock', `Medicine "${medName}" is currently out of stock in the pharmacy.`);
          return;
        }
        
        addToCart({
          id: matchedMed.id,
          name: `[Rx] ${matchedMed.name}`,
          price: typeof matchedMed.price === 'string' ? parseFloat(matchedMed.price) : matchedMed.price,
          quantity: 1,
          image: matchedMed.image || null,
        });
        showAlert(
          'Added to Cart',
          `"${matchedMed.name}" (Prescription) has been added to your cart at its pharmacy price of ${matchedMed.price} EGP.`
        );
      } else {
        showAlert(
          'Medicine Not Available',
          `The prescription medicine "${medName}" is not available in our pharmacy system inventory.`
        );
      }
    } catch (error) {
      console.error('Error adding prescription medicine to cart:', error);
      // Fallback: if fetch/inventory fails, let's keep the user updated
      showAlert(
        'Inventory Check Error',
        `Could not verify availability of "${medName}" in the pharmacy inventory right now. Please try again.`
      );
    }
  };

  const isBlocked = prescriptionResult?.consentStatus === 'blocked' || prescriptionResult?.consentStatus === 'inactive';
  const isUnknownError = prescriptionResult?.consentStatus === 'unknown';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Clinic Prescriptions</Text>
          <Text style={styles.headerSubtitle}>HL7 FHIR R4 Interoperability Gateway</Text>
        </View>
      </View>

      {/* Explanation Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={18} color="#2E8BC0" />
        <Text style={styles.infoText}>
          Enter the Patient ID and Prescription ID from the Dental Clinic system. The clinic's secure
          gateway will verify patient consent before sharing any health data.
        </Text>
      </View>

      {/* Input Form */}
      <View style={styles.formCard}>
        <Text style={styles.formLabel}>
          <Ionicons name="person-circle-outline" size={14} /> Clinic Patient ID (UUID)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 582ed1d9-493c-460e-9960-c8e64add88d8"
          placeholderTextColor="#9CA3AF"
          value={patientId}
          onChangeText={setPatientId}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.formLabel}>
          <Ionicons name="document-text-outline" size={14} /> Prescription ID (UUID)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. a4c53f17-fb88-4b08-912b-8be2a0c399a5"
          placeholderTextColor="#9CA3AF"
          value={prescriptionId}
          onChangeText={setPrescriptionId}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.fetchBtn, loading && styles.fetchBtnDisabled]}
          onPress={handleFetchFhir}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-download-outline" size={18} color="#fff" />
              <Text style={styles.fetchBtnText}>Fetch from Clinic System</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      {prescriptionResult && (
        <View style={styles.resultsContainer}>

          {/* Consent Blocked State */}
          {isBlocked && (
            <ConsentBlockedBanner
              status={prescriptionResult.consentStatus}
              message={prescriptionResult.errorMessage || ''}
            />
          )}

          {/* Unknown Error State */}
          {isUnknownError && (
            <View style={[bannerStyles.container, bannerStyles.blocked]}>
              <Ionicons name="alert-circle-outline" size={26} color="#EF4444" style={{ marginBottom: 10 }} />
              <Text style={bannerStyles.title}>Error Fetching Prescription</Text>
              <Text style={bannerStyles.message}>{prescriptionResult.errorMessage || 'An unexpected error occurred.'}</Text>
            </View>
          )}

          {/* Success State */}
          {!isBlocked && !isUnknownError && (
            <>
              <ConsentActiveBadge />

              {/* Patient Demographics (from EMR bundle) */}
              {emrResult?.patientInfo && <PatientCard info={emrResult.patientInfo} />}

              {/* Allergies Warning Section */}
              {emrResult && emrResult.allergies.length > 0 && (
                <View style={cardStyles.section}>
                  <Text style={cardStyles.sectionTitle}>
                    <Ionicons name="warning-outline" size={14} color="#B45309" /> Drug Allergy Warnings
                  </Text>
                  <Text style={cardStyles.subNote}>
                    Patient has authorized sharing their allergy profile:
                  </Text>
                  <View style={allergyStyles.tagList}>
                    {emrResult.allergies.map((a, i) => (
                      <AllergyTag key={i} text={a.code.text} />
                    ))}
                  </View>
                </View>
              )}

              {/* Allergies Hidden */}
              {emrResult && emrResult.allergies.length === 0 && emrResult.consentStatus === 'active' && (
                <View style={cardStyles.section}>
                  <Text style={cardStyles.sectionTitle}>
                    <Ionicons name="lock-closed-outline" size={14} color="#6B7280" /> Drug Allergy History
                  </Text>
                  <Text style={cardStyles.mutedText}>
                    The patient has restricted access to their allergy and medication history.
                  </Text>
                </View>
              )}

              {/* Current Medications from EMR */}
              {emrResult && emrResult.medications.length > 0 && (
                <View style={cardStyles.section}>
                  <Text style={cardStyles.sectionTitle}>
                    <Ionicons name="medkit-outline" size={14} /> Ongoing Medications (EMR)
                  </Text>
                  {emrResult.medications.map((med, i) => (
                    <View key={i} style={cardStyles.listItem}>
                      <Ionicons name="ellipse" size={8} color="#2E8BC0" style={{ marginTop: 5, marginRight: 8 }} />
                      <Text style={cardStyles.listItemText}>{med.medicationCodeableConcept.text}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Prescription Items */}
              <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>
                  <Ionicons name="receipt-outline" size={14} /> Prescription (FHIR MedicationRequest)
                </Text>

                {prescriptionItems.length === 0 ? (
                  <View style={styles.emptyPrescription}>
                    <Ionicons name="lock-closed-outline" size={28} color="#9CA3AF" />
                    <Text style={styles.emptyText}>
                      The patient has disabled sharing of their prescriptions.
                    </Text>
                  </View>
                ) : (
                  prescriptionItems.map((item) => (
                    <MedicationCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                  ))
                )}
              </View>

              {/* FHIR Technical Details */}
              <View style={styles.technicalPanel}>
                <Text style={styles.technicalTitle}>Technical Details</Text>
                <View style={styles.techRow}>
                  <Text style={styles.techLabel}>Protocol</Text>
                  <Text style={styles.techValue}>HL7 FHIR R4</Text>
                </View>
                <View style={styles.techRow}>
                  <Text style={styles.techLabel}>Gateway</Text>
                  <Text style={styles.techValue}>/api/v1/fhir/pharmacy/</Text>
                </View>
                <View style={styles.techRow}>
                  <Text style={styles.techLabel}>Auth</Text>
                  <Text style={styles.techValue}>X-Pharmacy-Client / X-Pharmacy-Token</Text>
                </View>
                <View style={styles.techRow}>
                  <Text style={styles.techLabel}>Consent Layer 1</Text>
                  <Text style={[styles.techValue, { color: '#10B981' }]}>ACTIVE ✓</Text>
                </View>
                <View style={styles.techRow}>
                  <Text style={styles.techLabel}>Resources Shared</Text>
                  <Text style={styles.techValue}>
                    {[
                      prescriptionItems.length > 0 && 'MedicationRequest',
                      emrResult?.medications.length && emrResult.medications.length > 0 && 'MedicationStatement',
                      emrResult?.allergies.length && emrResult.allergies.length > 0 && 'AllergyIntolerance',
                      emrResult?.patientInfo && 'Patient',
                    ]
                      .filter(Boolean)
                      .join(', ') || 'None (filtered by patient)'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// -----------------------------------------------------------------
// Styles
// -----------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3F8',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  backBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  infoBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1D4ED8',
    lineHeight: 19,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    backgroundColor: '#F9FAFB',
    color: '#111827',
    marginBottom: 14,
    fontFamily: 'monospace',
  },
  fetchBtn: {
    backgroundColor: '#2E8BC0',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2E8BC0',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  fetchBtnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  fetchBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultsContainer: {
    gap: 14,
    marginBottom: 32,
  },
  emptyPrescription: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  technicalPanel: {
    backgroundColor: '#1F2937',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  technicalTitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  techLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
  techValue: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});

const bannerStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
  },
  blocked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  inactive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    padding: 10,
  },
});

const badgeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  text: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: '700',
  },
});

const cardStyles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
  },
  value: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '65%',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 11,
  },
  subNote: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  mutedText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listItemText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
});

const medStyles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconWrap: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 6,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  activeStatus: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  otherStatus: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF6FF',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  cartBtn: {
    backgroundColor: '#2E8BC0',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  cartBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

const allergyStyles = StyleSheet.create({
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
});
