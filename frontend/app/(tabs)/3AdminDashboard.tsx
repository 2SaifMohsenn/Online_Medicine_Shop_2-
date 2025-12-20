// import { Link } from 'expo-router';
// import React from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// export default function AdminDashboard() {
//   // Temporary placeholder data
//   const totalUsers = 120;
//   const totalOrdersToday = 35;
//   const totalRevenue = 1250;
//   const lowStockMedicines = 5;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header with profile */}
//       <View style={styles.headerRow}>
//         <Text style={styles.header}>Dashboard</Text>

//         <Link href="/3AdminProfile" asChild>
//           <TouchableOpacity style={styles.profileButton}>
//             <Text style={styles.profileText}>Admin</Text>
//           </TouchableOpacity>
//         </Link>
//       </View>

//       {/* Top Quick Access Bar */}
//       <View style={styles.topBar}>
//         <Link href="/3ProductMangment" asChild>
//           <TouchableOpacity style={styles.topBarButton}>
//             <Text style={styles.topBarText}>Products</Text>
//           </TouchableOpacity>
//         </Link>

//         <Link href="/3Orders" asChild>
//           <TouchableOpacity style={styles.topBarButton}>
//             <Text style={styles.topBarText}>Orders</Text>
//           </TouchableOpacity>
//         </Link>

//         <Link href="/3Users" asChild>
//           <TouchableOpacity style={styles.topBarButton}>
//             <Text style={styles.topBarText}>Users</Text>
//           </TouchableOpacity>
//         </Link>
//       </View>

//       {/* Dashboard summary cards */}
//       <View style={styles.cardsRow}>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Users</Text>
//           <Text style={styles.cardValue}>{totalUsers}</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Orders Today</Text>
//           <Text style={styles.cardValue}>{totalOrdersToday}</Text>
//         </View>
//       </View>

//       <View style={styles.cardsRow}>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Revenue</Text>
//           <Text style={styles.cardValue}>${totalRevenue}</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Low Stock</Text>
//           <Text style={[styles.cardValue, { color: '#E57373' }]}>
//             {lowStockMedicines}
//           </Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//     padding: 20,
//   },

//   /* Header */
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#2E8BC0',
//     letterSpacing: 0.5,
//   },
//   profileButton: {
//     backgroundColor: '#E3F2FD',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//   },
//   profileText: {
//     color: '#2E8BC0',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },

//   /* Top bar */
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     padding: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   topBarButton: {
//     flex: 1,
//     marginHorizontal: 4,
//     backgroundColor: '#2E8BC0',
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   topBarText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },

//   /* Cards */
//   cardsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 6,
//     borderRadius: 16,
//     paddingVertical: 18,
//     paddingHorizontal: 14,
//     alignItems: 'center',
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 15,
//     color: '#555555',
//     marginBottom: 6,
//   },
//   cardValue: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#2E8BC0',
//   },
// });


import { Link } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdminDashboard() {
  // Temporary placeholder data
  const totalUsers = 120;
  const totalOrdersToday = 35;
  const totalRevenue = 1250;
  const lowStockMedicines = 5;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with profile */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Dashboard</Text>

        <Link href="/3AdminProfile" asChild>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileText}>Admin</Text>
          </TouchableOpacity>
        </Link>
        
      </View>

      {/* Top Quick Access Bar */}
      <View style={styles.topBar}>
        <Link href="/3ProductMangment" asChild>
          <TouchableOpacity style={styles.topBarButton}>
            <Text style={styles.topBarText}>Products</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/3Orders" asChild>
          <TouchableOpacity style={styles.topBarButton}>
            <Text style={styles.topBarText}>Orders</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/3Users" asChild>
          <TouchableOpacity style={styles.topBarButton}>
            <Text style={styles.topBarText}>Users</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Centered Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.cardsRow}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Users</Text>
            <Text style={styles.cardValue}>{totalUsers}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Orders Today</Text>
            <Text style={styles.cardValue}>{totalOrdersToday}</Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Revenue</Text>
            <Text style={styles.cardValue}>${totalRevenue}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Low Stock</Text>
            <Text style={[styles.cardValue, { color: '#E57373' }]}>
              {lowStockMedicines}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3F8',
    padding: 20,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E8BC0',
    letterSpacing: 0.5,
  },
  profileButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  profileText: {
    color: '#2E8BC0',
    fontWeight: 'bold',
    fontSize: 14,
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  topBarButton: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#2E8BC0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  topBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Stats Section */
  statsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 14,

    // Android shadow
    elevation: 10,
  },
  cardTitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
});
