import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  const medications = useSelector((state: RootState) => state.medications.list);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Morning!</Text>

      {medications.length === 0 ? (
        <View style={styles.emptyState}>
        <Ionicons name="medical" size={64} color="#CBD5E1" />
          <Text style={styles.emptyText}>No medications yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first medication to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.medId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.medicationCard}
              onPress={() =>
                navigation.navigate('MedicationDetail', {
                  medId: item.medId,
                })
              }
            >
              <View>
                <Text style={styles.medName}>{item.name}</Text>
                <Text style={styles.medDosage}>{item.dosage}</Text>
                <Text style={styles.medFreq}>{item.frequency}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  medDosage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  medFreq: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});