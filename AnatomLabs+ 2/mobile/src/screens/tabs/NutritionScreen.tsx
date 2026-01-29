import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import api from '../../services/api';
import { NutritionPlan } from '../../types';

export default function NutritionScreen() {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);

  useEffect(() => {
    loadNutrition();
  }, []);

  const loadNutrition = async () => {
    try {
      setIsLoading(true);
      const plan = await api.getNutritionPlan();
      setNutritionPlan(plan);
    } catch (error) {
      console.error('Failed to load nutrition:', error);
      // Try to calculate if not exists
      try {
        const plan = await api.calculateNutrition();
        setNutritionPlan(plan);
      } catch (calcError) {
        console.error('Failed to calculate nutrition:', calcError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadNutrition();
    setIsRefreshing(false);
  };

  const recalculate = async () => {
    try {
      setIsLoading(true);
      const plan = await api.calculateNutrition();
      setNutritionPlan(plan);
    } catch (error) {
      console.error('Failed to recalculate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !nutritionPlan) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Calculating nutrition plan...</Text>
      </View>
    );
  }

  if (!nutritionPlan) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load nutrition plan</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadNutrition}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition Plan</Text>
        <TouchableOpacity onPress={recalculate} style={styles.recalcButton}>
          <Text style={styles.recalcText}>Recalculate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.caloriesSection}>
        <View style={styles.calorieCard}>
          <Text style={styles.calorieValue}>{Math.round(nutritionPlan.bmr)}</Text>
          <Text style={styles.calorieLabel}>BMR</Text>
          <Text style={styles.calorieSubtext}>Basal Metabolic Rate</Text>
          <Text style={styles.calorieDesc}>
            Calories burned at rest
          </Text>
        </View>

        <View style={styles.calorieCard}>
          <Text style={styles.calorieValue}>{Math.round(nutritionPlan.tdee)}</Text>
          <Text style={styles.calorieLabel}>TDEE</Text>
          <Text style={styles.calorieSubtext}>Total Daily Energy</Text>
          <Text style={styles.calorieDesc}>
            Maintenance calories
          </Text>
        </View>

        <View style={[styles.calorieCard, styles.targetCard]}>
          <Text style={[styles.calorieValue, styles.targetValue]}>
            {Math.round(nutritionPlan.targetCalories || 0)}
          </Text>
          <Text style={styles.calorieLabel}>TARGET</Text>
          <Text style={styles.calorieSubtext}>Daily Goal</Text>
          <Text style={styles.calorieDesc}>
            Based on your goal: {(nutritionPlan.goal || 'maintenance').replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.macrosSection}>
        <Text style={styles.sectionTitle}>Daily Macros</Text>

        <View style={styles.macroCard}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroName}>Protein</Text>
            <Text style={styles.macroAmount}>{Math.round(nutritionPlan.macros.protein)}g</Text>
          </View>
          <View style={styles.macroBar}>
            <View
              style={[
                styles.macroBarFill,
                {
                  width: `${(nutritionPlan.macros.proteinCalories / nutritionPlan.targetCalories) * 100}%`,
                  backgroundColor: '#e74c3c',
                },
              ]}
            />
          </View>
          <Text style={styles.macroCalories}>
            {Math.round(nutritionPlan.macros.proteinCalories)} kcal
          </Text>
        </View>

        <View style={styles.macroCard}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroName}>Carbs</Text>
            <Text style={styles.macroAmount}>{Math.round(nutritionPlan.macros.carbs)}g</Text>
          </View>
          <View style={styles.macroBar}>
            <View
              style={[
                styles.macroBarFill,
                {
                  width: `${(nutritionPlan.macros.carbsCalories / nutritionPlan.targetCalories) * 100}%`,
                  backgroundColor: '#3498db',
                },
              ]}
            />
          </View>
          <Text style={styles.macroCalories}>
            {Math.round(nutritionPlan.macros.carbsCalories)} kcal
          </Text>
        </View>

        <View style={styles.macroCard}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroName}>Fat</Text>
            <Text style={styles.macroAmount}>{Math.round(nutritionPlan.macros.fat)}g</Text>
          </View>
          <View style={styles.macroBar}>
            <View
              style={[
                styles.macroBarFill,
                {
                  width: `${(nutritionPlan.macros.fatCalories / nutritionPlan.targetCalories) * 100}%`,
                  backgroundColor: '#f39c12',
                },
              ]}
            />
          </View>
          <Text style={styles.macroCalories}>
            {Math.round(nutritionPlan.macros.fatCalories)} kcal
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.formulasToggle}
        onPress={() => setShowFormulas(!showFormulas)}
      >
        <Text style={styles.formulasToggleText}>
          {showFormulas ? 'Hide' : 'Show'} Scientific Formulas
        </Text>
      </TouchableOpacity>

      {showFormulas && nutritionPlan.calculation && (
        <View style={styles.formulasSection}>
          <Text style={styles.sectionTitle}>Calculations (Transparent Science)</Text>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>BMR (Mifflin-St Jeor Equation)</Text>
            <Text style={styles.formulaText}>{nutritionPlan.calculation.bmrFormula}</Text>
          </View>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>TDEE Calculation</Text>
            <Text style={styles.formulaText}>{nutritionPlan.calculation.tdeeFormula}</Text>
          </View>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>Protein Target</Text>
            <Text style={styles.formulaText}>{nutritionPlan.calculation.proteinFormula}</Text>
          </View>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>Fat Target</Text>
            <Text style={styles.formulaText}>{nutritionPlan.calculation.fatFormula}</Text>
          </View>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>Carbs Target</Text>
            <Text style={styles.formulaText}>{nutritionPlan.calculation.carbsFormula}</Text>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About These Numbers</Text>
        <Text style={styles.infoText}>
          All calculations use scientifically validated formulas:{'\n\n'}
          • BMR: Mifflin-St Jeor equation (most accurate for general population){'\n'}
          • TDEE: BMR × activity multiplier{'\n'}
          • Protein: 1.6-2.3g/kg based on goal{'\n'}
          • Fat: 20-30% of total calories{'\n'}
          • Carbs: Remaining calories
        </Text>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  recalcButton: {
    padding: 8,
  },
  recalcText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  caloriesSection: {
    padding: 20,
    gap: 12,
  },
  calorieCard: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  targetCard: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  calorieValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  targetValue: {
    color: '#e74c3c',
  },
  calorieLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    marginBottom: 4,
  },
  calorieSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calorieDesc: {
    fontSize: 13,
    color: '#aaa',
  },
  macrosSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  macroCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  macroAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  macroBar: {
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  macroBarFill: {
    height: '100%',
  },
  macroCalories: {
    fontSize: 13,
    color: '#888',
  },
  formulasToggle: {
    margin: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  formulasToggleText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  formulasSection: {
    padding: 20,
  },
  formulaCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 13,
    color: '#ccc',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  infoSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
  },
});
