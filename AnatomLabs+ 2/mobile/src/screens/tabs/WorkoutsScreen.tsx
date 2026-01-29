import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import { WorkoutPlan, GenerateWorkoutRequest } from '../../types';

export default function WorkoutsScreen() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generator form state
  const [goal, setGoal] = useState<any>('muscle_gain');
  const [experienceLevel, setExperienceLevel] = useState<any>('intermediate');
  const [frequency, setFrequency] = useState(4);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const plans = await api.getWorkoutPlans();
      setWorkoutPlans(plans);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWorkout = async () => {
    try {
      setIsGenerating(true);
      const request: GenerateWorkoutRequest = {
        goal,
        experienceLevel,
        frequency,
        availableEquipment: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'],
      };
      const plan = await api.generateWorkout(request);
      setWorkoutPlans([plan, ...workoutPlans]);
      setSelectedPlan(plan);
      setShowGenerator(false);
      Alert.alert('Success', 'Workout plan generated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate workout');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => setShowGenerator(true)}
        >
          <Text style={styles.generateButtonText}>+ Generate New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
        </View>
      ) : workoutPlans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No workout plans yet</Text>
          <Text style={styles.emptySubtext}>
            Generate a science-based workout plan
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.plansContainer}>
          {workoutPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.planCard}
              onPress={() => setSelectedPlan(plan)}
            >
              <Text style={styles.planName}>{plan.name || 'Workout Plan'}</Text>
              <Text style={styles.planDetails}>
                {plan.daysPerWeek || plan.frequency || 0} days/week
              </Text>
              <Text style={styles.planGoal}>
                Goal: {(plan.goal || 'general').replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Generator Modal */}
      <Modal
        visible={showGenerator}
        animationType="slide"
        onRequestClose={() => setShowGenerator(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Generate Workout Plan</Text>
            <TouchableOpacity onPress={() => setShowGenerator(false)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Goal</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={goal}
                  onValueChange={setGoal}
                  style={styles.picker}
                >
                  <Picker.Item label="Muscle Gain" value="muscle_gain" />
                  <Picker.Item label="Fat Loss" value="fat_loss" />
                  <Picker.Item label="Strength" value="strength" />
                  <Picker.Item label="Endurance" value="endurance" />
                </Picker>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Experience Level</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={experienceLevel}
                  onValueChange={setExperienceLevel}
                  style={styles.picker}
                >
                  <Picker.Item label="Beginner" value="beginner" />
                  <Picker.Item label="Intermediate" value="intermediate" />
                  <Picker.Item label="Advanced" value="advanced" />
                </Picker>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Frequency (days/week)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={frequency}
                  onValueChange={setFrequency}
                  style={styles.picker}
                >
                  {[2, 3, 4, 5, 6].map(n => (
                    <Picker.Item key={n} label={`${n} days`} value={n} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Science-Based Approach</Text>
              <Text style={styles.infoText}>
                Your workout will be generated using BuiltWithScience 2025 principles:
                {'\n\n'}• Optimal volume (10-20 sets/muscle/week)
                {'\n'}• Progressive overload framework
                {'\n'}• Exercise selection for max activation
                {'\n'}• Proper recovery timing
                {'\n\n'}No AI - pure algorithmic logic for transparency
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isGenerating && styles.submitButtonDisabled]}
              onPress={generateWorkout}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Generate Plan</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Plan Detail Modal */}
      <Modal
        visible={!!selectedPlan}
        animationType="slide"
        onRequestClose={() => setSelectedPlan(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedPlan?.name}</Text>
            <TouchableOpacity onPress={() => setSelectedPlan(null)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailContainer}>
            {selectedPlan?.workouts?.map((workout: any, index: number) => (
              <View key={index} style={styles.workoutDay}>
                <Text style={styles.workoutDayTitle}>
                  Day {workout.dayOfWeek || workout.day || index + 1}: {workout.dayName || workout.name || 'Workout'}
                </Text>
                <Text style={styles.workoutFocus}>
                  Focus: {workout.focus || workout.split || 'Full Body'}
                </Text>

                {workout.exercises?.map((exercise: any, exIndex: number) => (
                  <View key={exIndex} style={styles.exerciseItem}>
                    <Text style={styles.exerciseName}>{exercise.exerciseName || exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.rest && ` • ${exercise.rest}s rest`}
                    </Text>
                    {exercise.targetMuscles && (
                      <Text style={styles.exerciseDifficulty}>
                        Targets: {Array.isArray(exercise.targetMuscles) ? exercise.targetMuscles.join(', ') : exercise.targetMuscles}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  plansContainer: {
    flex: 1,
    padding: 20,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  planDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  planGoal: {
    fontSize: 13,
    color: '#e74c3c',
    textTransform: 'capitalize',
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
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#e74c3c',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  workoutDay: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  workoutDayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  workoutFocus: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  workoutDuration: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  exerciseItem: {
    backgroundColor: '#0a0a0a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 4,
  },
  exerciseDifficulty: {
    fontSize: 12,
    color: '#888',
    textTransform: 'capitalize',
  },
});
