/**
 * Clinic FHIR Gateway API Client
 * -------------------------------------------------------
 * This module is used by the PharMe pharmacy app to query
 * the Dental Clinic (NU-HOSPITAL) FHIR R4 gateway under
 * the patient's active dual-layer consent rules.
 *
 * Security model:
 *   - Layer 1: Clinic backend checks for an ACTIVE Consent record
 *              before serving any data. Returns 403 if absent.
 *   - Layer 2: Backend dynamically strips resources not permitted
 *              by the patient's per-field visibility settings.
 *
 * Credentials here match the PharmacyIntegration record registered
 * in the clinic database (client_id + hashed token).
 */

// Clinic backend base URL (running on port 8001)
export const CLINIC_BASE_URL = 'http://127.0.0.1:8001';

// Pharmacy credentials registered inside the Clinic admin panel
const PHARMACY_CLIENT_ID = 'test-pharmacy-client';
const PHARMACY_TOKEN = 'carerx_secure_access_token_value_321';

// ---------- FHIR R4 Resource Types ----------

export interface FhirPatient {
  resourceType: 'Patient';
  id: string;
  name: Array<{ text: string }>;
  gender: string;
  birthDate: string;
}

export interface FhirMedicationRequest {
  resourceType: 'MedicationRequest';
  id: string;
  status: string;
  intent: string;
  medicationCodeableConcept: {
    text: string;
    coding?: Array<{ system: string; code: string; display: string }>;
  };
  subject: { reference: string; display?: string };
  authoredOn: string;
  dosageInstruction?: Array<{
    text?: string;
    timing?: { code: { text: string } };
    doseAndRate?: Array<{ doseQuantity: { value: string } }>;
  }>;
}

export interface FhirAllergyIntolerance {
  resourceType: 'AllergyIntolerance';
  clinicalStatus: { text: string };
  code: { text: string };
  patient: { reference: string };
}

export interface FhirMedicationStatement {
  resourceType: 'MedicationStatement';
  status: string;
  medicationCodeableConcept: { text: string };
  subject: { reference: string };
}

export type FhirResource =
  | FhirPatient
  | FhirMedicationRequest
  | FhirAllergyIntolerance
  | FhirMedicationStatement;

export interface FhirBundle {
  resourceType: 'Bundle';
  type: string;
  entry: Array<{ resource: FhirResource }>;
}

// ---------- Consent Status Response ----------

export type ConsentStatus =
  | 'active'       // Patient has enabled sharing
  | 'inactive'     // Patient has turned sharing OFF
  | 'blocked'      // No consent record found at all
  | 'unknown';     // Any other error

export interface PrescriptionFhirResult {
  consentStatus: ConsentStatus;
  bundle: FhirBundle | null;
  errorMessage: string | null;
}

export interface EmrFhirResult {
  consentStatus: ConsentStatus;
  bundle: FhirBundle | null;
  errorMessage: string | null;
  patientInfo: FhirPatient | null;
  medications: FhirMedicationStatement[];
  allergies: FhirAllergyIntolerance[];
}

// ---------- FHIR API Calls ----------

const pharmacyHeaders = {
  'Content-Type': 'application/json',
  'X-Pharmacy-Client': PHARMACY_CLIENT_ID,
  'X-Pharmacy-Token': PHARMACY_TOKEN,
};

/**
 * Fetch a patient's prescription as a FHIR MedicationRequest Bundle.
 * Returns consent-blocked status if the patient has not enabled sharing.
 */
export async function fetchPrescriptionBundle(
  prescriptionId: string
): Promise<PrescriptionFhirResult> {
  const url = `${CLINIC_BASE_URL}/api/v1/fhir/pharmacy/prescriptions/${prescriptionId}/`;
  try {
    const response = await fetch(url, { headers: pharmacyHeaders });

    if (response.status === 403) {
      const data = await response.json().catch(() => ({}));
      const msg: string = data?.detail || 'Patient has not authorized data sharing.';
      const isNoConsent = msg.toLowerCase().includes('consent');
      return {
        consentStatus: isNoConsent ? 'blocked' : 'inactive',
        bundle: null,
        errorMessage: msg,
      };
    }

    if (!response.ok) {
      return {
        consentStatus: 'unknown',
        bundle: null,
        errorMessage: `Clinic gateway error: HTTP ${response.status}`,
      };
    }

    const bundle: FhirBundle = await response.json();
    return { consentStatus: 'active', bundle, errorMessage: null };
  } catch (e) {
    return {
      consentStatus: 'unknown',
      bundle: null,
      errorMessage: 'Could not reach the Clinic system. Is the server running?',
    };
  }
}

/**
 * Fetch a patient's limited EMR summary as a FHIR Bundle.
 * The clinic backend enforces Layer 1 + Layer 2 consent filtering automatically.
 */
export async function fetchPatientEmrBundle(
  patientId: string
): Promise<EmrFhirResult> {
  const url = `${CLINIC_BASE_URL}/api/v1/fhir/pharmacy/patients/${patientId}/emr/`;
  try {
    const response = await fetch(url, { headers: pharmacyHeaders });

    if (response.status === 403) {
      const data = await response.json().catch(() => ({}));
      const msg: string = data?.detail || 'Patient has not authorized data sharing.';
      const isNoConsent = msg.toLowerCase().includes('consent');
      return {
        consentStatus: isNoConsent ? 'blocked' : 'inactive',
        bundle: null,
        errorMessage: msg,
        patientInfo: null,
        medications: [],
        allergies: [],
      };
    }

    if (!response.ok) {
      return {
        consentStatus: 'unknown',
        bundle: null,
        errorMessage: `Clinic gateway error: HTTP ${response.status}`,
        patientInfo: null,
        medications: [],
        allergies: [],
      };
    }

    const bundle: FhirBundle = await response.json();

    // Parse typed resources out of the bundle entries
    const entries = bundle.entry || [];
    const patientInfo = entries
      .map((e) => e.resource)
      .find((r): r is FhirPatient => r.resourceType === 'Patient') ?? null;

    const medications = entries
      .map((e) => e.resource)
      .filter((r): r is FhirMedicationStatement => r.resourceType === 'MedicationStatement');

    const allergies = entries
      .map((e) => e.resource)
      .filter((r): r is FhirAllergyIntolerance => r.resourceType === 'AllergyIntolerance');

    return {
      consentStatus: 'active',
      bundle,
      errorMessage: null,
      patientInfo,
      medications,
      allergies,
    };
  } catch (e) {
    return {
      consentStatus: 'unknown',
      bundle: null,
      errorMessage: 'Could not reach the Clinic system. Is the server running?',
      patientInfo: null,
      medications: [],
      allergies: [],
    };
  }
}
