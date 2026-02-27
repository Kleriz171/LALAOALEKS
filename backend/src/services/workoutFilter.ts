import {
  PHYSICAL_LIMITATIONS,
  MEDICAL_CONDITIONS,
  getPhysicalLimitation,
  getMedicalCondition,
  PhysicalLimitation,
  MedicalCondition
} from '../constants/healthConditions';

export interface WorkoutExerciseTemplate {
  exerciseName: string;
  sets: number;
  reps: string;
  rest: number;
  notes: string;
  targetMuscles: string[];
}

export interface FilteredExercise extends WorkoutExerciseTemplate {
  wasModified: boolean;
  originalExercise?: string;
  modificationNotes?: string[];
  safetyNotes?: string[];
}

export interface UserHealthContext {
  physicalLimitations: string[];
  medicalConditions: string[];
}

export interface WorkoutFilterResult {
  exercises: FilteredExercise[];
  removedExercises: { name: string; reason: string }[];
  modifiedExercises: { original: string; replacement: string; reason: string }[];
  warnings: string[];
  recommendations: string[];
  healthModifications: {
    totalRemoved: number;
    totalModified: number;
    limitations: string[];
    conditions: string[];
  };
}

function buildContraindicationSet(healthContext: UserHealthContext): Set<string> {
  const contraindicated = new Set<string>();

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      limitation.contraindicatedExercises.forEach(ex =>
        contraindicated.add(ex.toLowerCase())
      );
    }
  }

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      condition.exerciseRestrictions.avoid.forEach(ex =>
        contraindicated.add(ex.toLowerCase())
      );
    }
  }

  return contraindicated;
}

function buildModificationSet(healthContext: UserHealthContext): Set<string> {
  const needsModification = new Set<string>();

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      limitation.modifyExercises.forEach(ex =>
        needsModification.add(ex.toLowerCase())
      );
    }
  }

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      condition.exerciseRestrictions.caution.forEach(ex =>
        needsModification.add(ex.toLowerCase())
      );
    }
  }

  return needsModification;
}

function getAlternativeExercise(
  exerciseName: string,
  healthContext: UserHealthContext,
  contraindicated: Set<string>
): { alternative: string | null; source: string } {
  const lowerName = exerciseName.toLowerCase();

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation && limitation.safeAlternatives) {
      for (const [key, alternatives] of Object.entries(limitation.safeAlternatives)) {
        if (lowerName.includes(key.toLowerCase())) {
          for (const alt of alternatives) {
            if (!contraindicated.has(alt.toLowerCase())) {
              return { alternative: alt, source: limitation.name };
            }
          }
        }
      }
    }
  }

  return { alternative: null, source: '' };
}

function collectWarnings(healthContext: UserHealthContext): string[] {
  const warnings: string[] = [];

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      warnings.push(...limitation.warnings);
    }
  }

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      warnings.push(...condition.exerciseRestrictions.warnings);
    }
  }

  return [...new Set(warnings)];
}

function collectRecommendations(healthContext: UserHealthContext): string[] {
  const recommendations: string[] = [];

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition && condition.exerciseRestrictions.recommended.length > 0) {
      recommendations.push(
        `Recommended for ${condition.name}: ${condition.exerciseRestrictions.recommended.join(', ')}`
      );
    }
  }

  return recommendations;
}

function matchesExerciseSet(exerciseName: string, exerciseSet: Set<string>): boolean {
  const lowerName = exerciseName.toLowerCase();

  if (exerciseSet.has(lowerName)) {
    return true;
  }

  for (const setItem of exerciseSet) {
    if (lowerName.includes(setItem) || setItem.includes(lowerName)) {
      return true;
    }
  }

  return false;
}

function getModificationNotes(
  exerciseName: string,
  healthContext: UserHealthContext
): string[] {
  const notes: string[] = [];
  const lowerName = exerciseName.toLowerCase();

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      for (const modEx of limitation.modifyExercises) {
        if (lowerName.includes(modEx.toLowerCase())) {
          notes.push(`Modified for ${limitation.name}: Use lighter weight and controlled movements`);
        }
      }
    }
  }

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      for (const cautionEx of condition.exerciseRestrictions.caution) {
        if (lowerName.includes(cautionEx.toLowerCase())) {
          notes.push(`Caution (${condition.name}): Monitor intensity and symptoms`);
        }
      }

      if (condition.exerciseRestrictions.maxIntensity) {
        notes.push(
          `Max intensity: ${condition.exerciseRestrictions.maxIntensity} (due to ${condition.name})`
        );
      }
    }
  }

  return notes;
}

export function filterWorkoutForHealth(
  exercises: WorkoutExerciseTemplate[],
  healthContext: UserHealthContext
): WorkoutFilterResult {
  if (
    healthContext.physicalLimitations.length === 0 &&
    healthContext.medicalConditions.length === 0
  ) {
    return {
      exercises: exercises.map(ex => ({
        ...ex,
        wasModified: false
      })),
      removedExercises: [],
      modifiedExercises: [],
      warnings: [],
      recommendations: [],
      healthModifications: {
        totalRemoved: 0,
        totalModified: 0,
        limitations: [],
        conditions: []
      }
    };
  }

  const contraindicated = buildContraindicationSet(healthContext);
  const needsModification = buildModificationSet(healthContext);
  const warnings = collectWarnings(healthContext);
  const recommendations = collectRecommendations(healthContext);

  const filteredExercises: FilteredExercise[] = [];
  const removedExercises: { name: string; reason: string }[] = [];
  const modifiedExercises: { original: string; replacement: string; reason: string }[] = [];

  for (const exercise of exercises) {
    const exerciseName = exercise.exerciseName;
    const isContraindicated = matchesExerciseSet(exerciseName, contraindicated);

    if (isContraindicated) {
      const { alternative, source } = getAlternativeExercise(
        exerciseName,
        healthContext,
        contraindicated
      );

      if (alternative) {
        filteredExercises.push({
          ...exercise,
          exerciseName: alternative,
          wasModified: true,
          originalExercise: exerciseName,
          modificationNotes: [`Replaced ${exerciseName} due to ${source}`],
          safetyNotes: getModificationNotes(alternative, healthContext)
        });

        modifiedExercises.push({
          original: exerciseName,
          replacement: alternative,
          reason: source
        });
      } else {
        removedExercises.push({
          name: exerciseName,
          reason: 'Contraindicated for your health conditions'
        });
      }
    } else if (matchesExerciseSet(exerciseName, needsModification)) {
      const modNotes = getModificationNotes(exerciseName, healthContext);

      filteredExercises.push({
        ...exercise,
        wasModified: modNotes.length > 0,
        modificationNotes: modNotes,
        safetyNotes: modNotes.length > 0 ? ['Use lighter weight', 'Focus on form'] : []
      });

      if (modNotes.length > 0) {
        modifiedExercises.push({
          original: exerciseName,
          replacement: exerciseName + ' (modified)',
          reason: 'Exercise modified for safety'
        });
      }
    } else {
      filteredExercises.push({
        ...exercise,
        wasModified: false
      });
    }
  }

  const limitationNames = healthContext.physicalLimitations
    .map(id => getPhysicalLimitation(id)?.name || id)
    .filter(Boolean);

  const conditionNames = healthContext.medicalConditions
    .map(id => getMedicalCondition(id)?.name || id)
    .filter(Boolean);

  return {
    exercises: filteredExercises,
    removedExercises,
    modifiedExercises,
    warnings,
    recommendations,
    healthModifications: {
      totalRemoved: removedExercises.length,
      totalModified: modifiedExercises.length,
      limitations: limitationNames,
      conditions: conditionNames
    }
  };
}

export function needsHealthFiltering(healthContext: UserHealthContext): boolean {
  return (
    healthContext.physicalLimitations.length > 0 ||
    healthContext.medicalConditions.length > 0
  );
}

export function getHealthFilterSummary(healthContext: UserHealthContext): string {
  if (!needsHealthFiltering(healthContext)) {
    return 'No health-based modifications needed.';
  }

  const parts: string[] = [];

  if (healthContext.physicalLimitations.length > 0) {
    const names = healthContext.physicalLimitations
      .map(id => getPhysicalLimitation(id)?.name)
      .filter(Boolean);
    parts.push(`Physical limitations: ${names.join(', ')}`);
  }

  if (healthContext.medicalConditions.length > 0) {
    const names = healthContext.medicalConditions
      .map(id => getMedicalCondition(id)?.name)
      .filter(Boolean);
    parts.push(`Medical conditions: ${names.join(', ')}`);
  }

  return `Workout modified for: ${parts.join('; ')}`;
}
