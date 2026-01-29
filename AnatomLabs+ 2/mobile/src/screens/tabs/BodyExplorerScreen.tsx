import React, { useEffect, useState, Suspense } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import api from '../../services/api';

// Fallback component for 3D loading/errors
function Viewer3DFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
      <ActivityIndicator size="large" color="#e74c3c" />
      <Text style={{ color: '#888', marginTop: 16 }}>Loading 3D Viewer...</Text>
    </View>
  );
}

// Placeholder for 3D view - disabled due to Fabric compatibility issues
function BodyViewer3DPlaceholder({ onSwitchToList }: { onSwitchToList: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', padding: 20 }}>
      <Text style={{ color: '#e74c3c', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
        3D View Unavailable
      </Text>
      <Text style={{ color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 }}>
        3D rendering is temporarily disabled due to compatibility issues with React Native's new architecture.
      </Text>
      <TouchableOpacity
        style={{ backgroundColor: '#e74c3c', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
        onPress={onSwitchToList}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Use List View</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BodyExplorerScreen() {
  // Default to list view to avoid 3D crash issues on simulator
  const [viewMode, setViewMode] = useState<'3d' | 'list'>('list');
  const [muscles, setMuscles] = useState<any[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMuscles();
  }, []);

  const loadMuscles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getMuscles();
      // Add mock positions for 3D view
      const musclesWithPositions = (data || []).map((muscle: any, index: number) => ({
        ...muscle,
        position_x: Math.sin(index) * 3,
        position_y: 3 + Math.cos(index * 0.5) * 2,
        position_z: Math.cos(index) * 2,
        layer: 1,
      }));
      setMuscles(musclesWithPositions);
    } catch (err: any) {
      console.error('Failed to load muscles:', err);
      setError(err?.message || 'Failed to load anatomy data. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMusclePress = async (muscleId: string) => {
    try {
      const muscle = await api.getMuscle(muscleId);
      const exercises = await api.getExercises(muscleId);
      setSelectedMuscle({ ...muscle, exercises });
      setShowDetail(true);
    } catch (error) {
      console.error('Failed to load muscle details:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading anatomy data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: '#e74c3c', marginBottom: 16 }]}>Error</Text>
        <Text style={[styles.loadingText, { textAlign: 'center', paddingHorizontal: 20 }]}>{error}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#e74c3c', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 20 }}
          onPress={loadMuscles}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Body Explorer</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === '3d' && styles.toggleButtonActive]}
            onPress={() => setViewMode('3d')}
          >
            <Text style={[styles.toggleText, viewMode === '3d' && styles.toggleTextActive]}>
              3D View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
              List View
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === '3d' ? (
        <BodyViewer3DPlaceholder onSwitchToList={() => setViewMode('list')} />
      ) : (
        <ScrollView style={styles.listContainer}>
          {muscles.map((muscle) => (
            <TouchableOpacity
              key={muscle.id}
              style={styles.muscleCard}
              onPress={() => handleMusclePress(muscle.id)}
            >
              <Text style={styles.muscleName}>{muscle.name}</Text>
              <Text style={styles.muscleFunction} numberOfLines={2}>
                {muscle.function || 'Tap to learn more'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={showDetail}
        animationType="slide"
        onRequestClose={() => setShowDetail(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedMuscle?.name || 'Muscle Details'}
            </Text>
            <TouchableOpacity onPress={() => setShowDetail(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedMuscle && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Scientific Name</Text>
                  <Text style={styles.sectionText}>
                    {selectedMuscle.scientificName || 'N/A'}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Function</Text>
                  <Text style={styles.sectionText}>
                    {selectedMuscle.function || 'N/A'}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recovery Time</Text>
                  <Text style={styles.sectionText}>
                    {selectedMuscle.recoveryTime || 48} hours
                  </Text>
                </View>

                {selectedMuscle.exercises && selectedMuscle.exercises.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Best Exercises ({selectedMuscle.exercises.length})
                    </Text>
                    {selectedMuscle.exercises.slice(0, 5).map((exercise: any) => (
                      <View key={exercise.id} style={styles.exerciseCard}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseDifficulty}>
                          Difficulty: {exercise.difficulty}
                        </Text>
                        {exercise.activationRating && (
                          <Text style={styles.exerciseActivation}>
                            Activation: {exercise.activationRating}/100
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#e74c3c',
  },
  toggleText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  muscleCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  muscleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  muscleFunction: {
    fontSize: 14,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
  },
  exerciseCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  exerciseDifficulty: {
    fontSize: 13,
    color: '#888',
    textTransform: 'capitalize',
  },
  exerciseActivation: {
    fontSize: 13,
    color: '#e74c3c',
    marginTop: 4,
  },
});
