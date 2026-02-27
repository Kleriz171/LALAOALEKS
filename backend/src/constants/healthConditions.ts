/**
 * Health Conditions Constants
 *
 * Master lists for physical limitations, medical conditions, food allergies,
 * and dietary preferences with their respective restrictions and recommendations.
 */

// ========== PHYSICAL LIMITATIONS ==========

export interface PhysicalLimitation {
  id: string;
  name: string;
  description: string;
  contraindicatedExercises: string[];
  modifyExercises: string[];
  safeAlternatives: { [exercise: string]: string[] };
  warnings: string[];
}

export const PHYSICAL_LIMITATIONS: PhysicalLimitation[] = [
  {
    id: 'lower_back_injury',
    name: 'Lower Back Injury',
    description: 'Pain or injury in the lumbar region',
    contraindicatedExercises: [
      'Deadlift', 'Conventional Deadlift', 'Romanian Deadlift',
      'Barbell Row', 'Bent-Over Barbell Row', 'Bent-Over Row',
      'Good Mornings', 'Hyperextensions'
    ],
    modifyExercises: [
      'Barbell Squat', 'Back Squat', 'Barbell Back Squat',
      'Leg Press', 'Overhead Press'
    ],
    safeAlternatives: {
      'Deadlift': ['Trap Bar Deadlift (lighter)', 'Hip Thrusts', 'Glute Bridge'],
      'Barbell Row': ['Chest-Supported Row', 'Cable Rows', 'Seated Cable Row'],
      'Barbell Squat': ['Leg Press', 'Goblet Squat', 'Bulgarian Split Squat']
    },
    warnings: ['Avoid spinal flexion under load', 'Use a lifting belt for support', 'Focus on core stability']
  },
  {
    id: 'upper_back_injury',
    name: 'Upper Back Injury',
    description: 'Pain or injury in the thoracic region',
    contraindicatedExercises: [
      'Barbell Row', 'Bent-Over Row', 'Pull-Ups', 'Lat Pulldown'
    ],
    modifyExercises: [
      'Overhead Press', 'Bench Press', 'Dumbbell Rows'
    ],
    safeAlternatives: {
      'Pull-Ups': ['Lat Pulldown (light)', 'Straight Arm Pulldown'],
      'Barbell Row': ['Chest-Supported Row', 'Machine Row']
    },
    warnings: ['Avoid heavy pulling movements', 'Focus on posture correction']
  },
  {
    id: 'neck_injury',
    name: 'Neck Injury',
    description: 'Pain or injury in the cervical spine',
    contraindicatedExercises: [
      'Overhead Press', 'Barbell Shrugs', 'Upright Rows',
      'Behind-the-Neck Press', 'Neck Curls'
    ],
    modifyExercises: [
      'Bench Press', 'Shoulder Press', 'Lat Pulldown'
    ],
    safeAlternatives: {
      'Overhead Press': ['Landmine Press', 'Machine Shoulder Press'],
      'Shrugs': ['Face Pulls', 'Rear Delt Flyes']
    },
    warnings: ['Avoid neck hyperextension', 'Keep head in neutral position']
  },
  {
    id: 'knee_injury',
    name: 'Knee Injury',
    description: 'Pain or injury in the knee joint',
    contraindicatedExercises: [
      'Barbell Squat', 'Back Squat', 'Front Squat',
      'Leg Extension', 'Deep Lunges', 'Box Jumps', 'Depth Jumps',
      'Bulgarian Split Squat'
    ],
    modifyExercises: [
      'Leg Press', 'Walking Lunges', 'Step-Ups'
    ],
    safeAlternatives: {
      'Barbell Squat': ['Box Squat (above parallel)', 'Leg Press (limited ROM)'],
      'Lunges': ['Hip Hinge movements', 'Romanian Deadlift'],
      'Leg Extension': ['Terminal Knee Extension (TKE)']
    },
    warnings: ['Avoid deep knee flexion', 'Control eccentric movements', 'Avoid impact exercises']
  },
  {
    id: 'hip_injury',
    name: 'Hip Injury',
    description: 'Pain or injury in the hip joint',
    contraindicatedExercises: [
      'Barbell Squat', 'Sumo Deadlift', 'Wide-Stance Squat',
      'Lateral Lunges', 'Hip Abduction Machine'
    ],
    modifyExercises: [
      'Romanian Deadlift', 'Lunges', 'Step-Ups'
    ],
    safeAlternatives: {
      'Barbell Squat': ['Leg Press (neutral foot position)', 'Goblet Squat'],
      'Sumo Deadlift': ['Conventional Deadlift', 'Trap Bar Deadlift']
    },
    warnings: ['Avoid extreme hip rotation', 'Maintain neutral hip alignment']
  },
  {
    id: 'ankle_injury',
    name: 'Ankle Injury',
    description: 'Pain or injury in the ankle joint',
    contraindicatedExercises: [
      'Calf Raises', 'Box Jumps', 'Jump Squats', 'Running',
      'Sprints', 'Depth Jumps', 'Lateral Bounds'
    ],
    modifyExercises: [
      'Barbell Squat', 'Lunges', 'Step-Ups'
    ],
    safeAlternatives: {
      'Calf Raises': ['Seated Calf Raise', 'Toe Press on Leg Press'],
      'Box Jumps': ['Step-Ups', 'Glute Bridges']
    },
    warnings: ['Avoid impact exercises', 'Use heel lifts if needed for squats']
  },
  {
    id: 'shoulder_injury',
    name: 'Shoulder Injury',
    description: 'General shoulder pain or injury',
    contraindicatedExercises: [
      'Overhead Press', 'Barbell Bench Press', 'Dips',
      'Upright Rows', 'Behind-the-Neck Press', 'Lateral Raises (heavy)'
    ],
    modifyExercises: [
      'Incline Press', 'Dumbbell Press', 'Chest Flyes'
    ],
    safeAlternatives: {
      'Overhead Press': ['Landmine Press', 'High Incline Press'],
      'Bench Press': ['Floor Press', 'Neutral Grip Dumbbell Press'],
      'Dips': ['Close-Grip Push-Ups', 'Tricep Pushdowns']
    },
    warnings: ['Avoid overhead movements', 'Keep arms below shoulder height when possible']
  },
  {
    id: 'shoulder_impingement',
    name: 'Shoulder Impingement',
    description: 'Rotator cuff impingement syndrome',
    contraindicatedExercises: [
      'Upright Rows', 'Behind-the-Neck Press', 'Behind-the-Neck Pulldown',
      'Wide Grip Bench Press', 'Overhead Press'
    ],
    modifyExercises: [
      'Lateral Raises', 'Front Raises', 'Pull-Ups'
    ],
    safeAlternatives: {
      'Upright Rows': ['Face Pulls', 'High Pulls with external rotation'],
      'Lateral Raises': ['Scaption (raising at 30-degree angle)'],
      'Overhead Press': ['Landmine Press', 'Z Press']
    },
    warnings: ['Avoid internal rotation under load', 'Strengthen rotator cuff']
  },
  {
    id: 'wrist_injury',
    name: 'Wrist Injury',
    description: 'Pain or injury in the wrist',
    contraindicatedExercises: [
      'Barbell Curl', 'Front Squat', 'Clean', 'Push-Ups (standard)',
      'Wrist Curls', 'Reverse Curls'
    ],
    modifyExercises: [
      'Bench Press', 'Overhead Press', 'Deadlift'
    ],
    safeAlternatives: {
      'Barbell Curl': ['Hammer Curls', 'Cable Curls with rope'],
      'Push-Ups': ['Push-Ups on handles', 'Push-Ups on fists'],
      'Front Squat': ['Goblet Squat', 'Safety Bar Squat']
    },
    warnings: ['Use wrist wraps for support', 'Maintain neutral wrist position']
  },
  {
    id: 'elbow_injury',
    name: 'Elbow Injury',
    description: 'Pain or injury in the elbow (tennis/golfer\'s elbow)',
    contraindicatedExercises: [
      'Skull Crushers', 'Tricep Extensions', 'Preacher Curls',
      'Barbell Curl', 'Chin-Ups (supinated grip)'
    ],
    modifyExercises: [
      'Bench Press', 'Pull-Ups', 'Rows'
    ],
    safeAlternatives: {
      'Skull Crushers': ['Tricep Pushdowns', 'Close-Grip Bench Press'],
      'Barbell Curl': ['Hammer Curls', 'Cable Curls'],
      'Chin-Ups': ['Neutral Grip Pull-Ups', 'Lat Pulldown (neutral grip)']
    },
    warnings: ['Avoid extreme elbow flexion/extension under load', 'Reduce grip intensity']
  },
  {
    id: 'wheelchair_user',
    name: 'Wheelchair User',
    description: 'Limited or no lower body mobility',
    contraindicatedExercises: [
      'Barbell Squat', 'Deadlift', 'Lunges', 'Running', 'Calf Raises',
      'Leg Press', 'Leg Extension', 'Leg Curl', 'Box Jumps'
    ],
    modifyExercises: [],
    safeAlternatives: {
      'Full Body': ['Upper Body Focus Program'],
      'Cardio': ['Arm Ergometer', 'Seated Boxing', 'Battle Ropes (seated)']
    },
    warnings: ['Focus on upper body and core', 'Include rotator cuff and postural exercises']
  },
  {
    id: 'limited_mobility',
    name: 'Limited Mobility',
    description: 'General movement restrictions',
    contraindicatedExercises: [
      'Box Jumps', 'Burpees', 'Mountain Climbers', 'Sprints'
    ],
    modifyExercises: [
      'All exercises - use machines when possible'
    ],
    safeAlternatives: {
      'Free Weights': ['Machine equivalents', 'Cable exercises'],
      'Cardio': ['Stationary Bike', 'Elliptical', 'Swimming']
    },
    warnings: ['Progress slowly', 'Prioritize safety and stability']
  }
];

// ========== MEDICAL CONDITIONS ==========

export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  exerciseRestrictions: {
    avoid: string[];
    caution: string[];
    recommended: string[];
    maxIntensity?: string; // "low", "moderate", "high"
    warnings: string[];
  };
  nutritionAdjustments: {
    restrictions: { nutrient: string; limit?: number; increase?: boolean; reason: string }[];
    recommendations: string[];
    focusNutrients: string[];
  };
}

export const MEDICAL_CONDITIONS: MedicalCondition[] = [
  {
    id: 'heart_disease',
    name: 'Heart Disease',
    description: 'Cardiovascular disease or history of heart problems',
    exerciseRestrictions: {
      avoid: ['Heavy Deadlifts', 'Heavy Squats', 'Valsalva-heavy exercises'],
      caution: ['All resistance training - monitor heart rate'],
      recommended: ['Walking', 'Light Cardio', 'Yoga', 'Swimming'],
      maxIntensity: 'moderate',
      warnings: [
        'Avoid Valsalva maneuver (breath holding under strain)',
        'Keep heart rate below prescribed limit',
        'Stop immediately if chest pain or dizziness occurs'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'saturatedFat', limit: 10, reason: 'Keep saturated fat under 10% of calories' },
        { nutrient: 'cholesterol', limit: 200, reason: 'Limit cholesterol to 200mg/day' },
        { nutrient: 'sodium', limit: 1500, reason: 'Reduce sodium for blood pressure control' },
        { nutrient: 'transFat', limit: 0, reason: 'Avoid trans fats completely' }
      ],
      recommendations: [
        'Increase omega-3 fatty acids',
        'Emphasize fiber-rich foods',
        'Choose lean proteins'
      ],
      focusNutrients: ['omega3', 'fiber', 'potassium', 'magnesium']
    }
  },
  {
    id: 'hypertension',
    name: 'Hypertension (High Blood Pressure)',
    description: 'Chronically elevated blood pressure',
    exerciseRestrictions: {
      avoid: ['Isometric holds (heavy)', 'Overhead pressing (very heavy)'],
      caution: ['Heavy resistance training', 'High-intensity intervals'],
      recommended: ['Moderate cardio', 'Walking', 'Swimming', 'Cycling'],
      maxIntensity: 'moderate',
      warnings: [
        'Avoid holding breath during exercises',
        'Keep rest periods adequate',
        'Monitor blood pressure before and after exercise'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'sodium', limit: 1500, reason: 'Strict sodium limit for blood pressure control' }
      ],
      recommendations: [
        'Follow DASH diet principles',
        'Increase potassium-rich foods',
        'Limit alcohol and caffeine'
      ],
      focusNutrients: ['potassium', 'magnesium', 'calcium', 'fiber']
    }
  },
  {
    id: 'high_cholesterol',
    name: 'High Cholesterol',
    description: 'Elevated LDL cholesterol levels',
    exerciseRestrictions: {
      avoid: [],
      caution: [],
      recommended: ['Regular cardio', 'Resistance training', 'HIIT'],
      warnings: ['Exercise helps improve cholesterol - aim for 150+ min/week']
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'saturatedFat', limit: 7, reason: 'Limit saturated fat to 7% of calories' },
        { nutrient: 'cholesterol', limit: 200, reason: 'Limit dietary cholesterol' },
        { nutrient: 'transFat', limit: 0, reason: 'Eliminate trans fats' }
      ],
      recommendations: [
        'Increase soluble fiber intake',
        'Add plant sterols/stanols',
        'Choose healthy fats (olive oil, avocado, nuts)'
      ],
      focusNutrients: ['fiber', 'omega3', 'plantSterols']
    }
  },
  {
    id: 'diabetes_type_1',
    name: 'Type 1 Diabetes',
    description: 'Insulin-dependent diabetes mellitus',
    exerciseRestrictions: {
      avoid: [],
      caution: ['High-intensity exercise without carb management'],
      recommended: ['Regular exercise with blood sugar monitoring'],
      warnings: [
        'Check blood sugar before, during, and after exercise',
        'Have fast-acting carbs available',
        'Be aware of hypoglycemia symptoms',
        'Coordinate exercise with insulin timing'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'carbs', limit: 45, reason: 'Limit carbs to 45% of calories, spread throughout day' },
        { nutrient: 'sugar', limit: 25, reason: 'Minimize added sugars' }
      ],
      recommendations: [
        'Choose low glycemic index foods',
        'Consistent carb intake at meals',
        'Include fiber with carbs to slow absorption',
        'Coordinate carb intake with insulin'
      ],
      focusNutrients: ['fiber', 'protein', 'chromium']
    }
  },
  {
    id: 'diabetes_type_2',
    name: 'Type 2 Diabetes',
    description: 'Non-insulin dependent diabetes mellitus',
    exerciseRestrictions: {
      avoid: [],
      caution: [],
      recommended: ['Resistance training', 'Moderate cardio', 'Walking after meals'],
      warnings: [
        'Exercise improves insulin sensitivity',
        'Monitor blood sugar levels',
        'Stay hydrated'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'carbs', limit: 40, reason: 'Limit carbs to 40% of calories' },
        { nutrient: 'sugar', limit: 20, reason: 'Minimize added sugars' }
      ],
      recommendations: [
        'Choose low GI foods (GI < 55)',
        'Increase fiber to 30g+ per day',
        'Include protein with each meal',
        'Time carbs around exercise'
      ],
      focusNutrients: ['fiber', 'protein', 'chromium', 'magnesium']
    }
  },
  {
    id: 'thyroid_disorder',
    name: 'Thyroid Disorder',
    description: 'Hypo or hyperthyroidism',
    exerciseRestrictions: {
      avoid: [],
      caution: ['High-intensity exercise if hyperthyroid'],
      recommended: ['Moderate exercise as tolerated'],
      warnings: [
        'Adjust intensity based on symptoms',
        'Be aware of fatigue and heart rate changes'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Ensure adequate iodine intake',
        'Include selenium-rich foods',
        'Avoid excessive goitrogenic foods if hypothyroid'
      ],
      focusNutrients: ['iodine', 'selenium', 'zinc']
    }
  },
  {
    id: 'asthma',
    name: 'Asthma',
    description: 'Chronic respiratory condition',
    exerciseRestrictions: {
      avoid: ['Cold weather outdoor exercise without preparation'],
      caution: ['High-intensity intervals', 'Endurance events'],
      recommended: ['Swimming', 'Walking', 'Yoga', 'Interval training (with proper warm-up)'],
      warnings: [
        'Always have rescue inhaler available',
        'Proper warm-up is essential',
        'Avoid triggers (pollen, cold air, pollution)'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Anti-inflammatory diet may help',
        'Include omega-3 rich foods',
        'Stay well hydrated'
      ],
      focusNutrients: ['omega3', 'vitaminD', 'magnesium']
    }
  },
  {
    id: 'copd',
    name: 'COPD',
    description: 'Chronic obstructive pulmonary disease',
    exerciseRestrictions: {
      avoid: ['Very high intensity exercise'],
      caution: ['All exercise - start slow, monitor oxygen'],
      recommended: ['Walking', 'Stationary cycling', 'Light resistance training', 'Breathing exercises'],
      maxIntensity: 'low',
      warnings: [
        'Exercise helps improve lung function',
        'Use supplemental oxygen if prescribed',
        'Monitor oxygen saturation'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Adequate protein for muscle maintenance',
        'Smaller, more frequent meals',
        'Stay well hydrated'
      ],
      focusNutrients: ['protein', 'vitaminD', 'calcium']
    }
  },
  {
    id: 'kidney_disease',
    name: 'Kidney Disease',
    description: 'Chronic kidney disease or impaired kidney function',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Very high intensity exercise'],
      recommended: ['Moderate exercise as tolerated'],
      warnings: ['Stay hydrated but follow fluid restrictions if prescribed']
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'protein', limit: 0.8, reason: 'Limit protein to 0.8g/kg body weight' },
        { nutrient: 'potassium', limit: 2000, reason: 'May need to limit potassium' },
        { nutrient: 'phosphorus', limit: 800, reason: 'May need to limit phosphorus' },
        { nutrient: 'sodium', limit: 2000, reason: 'Limit sodium intake' }
      ],
      recommendations: [
        'Work with a renal dietitian',
        'Choose high-quality proteins',
        'Monitor fluid intake'
      ],
      focusNutrients: []
    }
  },
  {
    id: 'osteoporosis',
    name: 'Osteoporosis',
    description: 'Low bone density',
    exerciseRestrictions: {
      avoid: [
        'High-impact jumping', 'Box Jumps', 'Depth Jumps',
        'Forward bending under load', 'Twisting movements under load'
      ],
      caution: ['Heavy deadlifts', 'Barbell rows'],
      recommended: ['Weight-bearing exercise', 'Resistance training', 'Walking', 'Tai Chi'],
      warnings: [
        'Avoid spinal flexion under load',
        'Focus on posture and balance',
        'Resistance training helps build bone'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Calcium intake 1200mg+ daily',
        'Vitamin D 800-1000 IU daily',
        'Adequate protein for bone health',
        'Limit alcohol and caffeine'
      ],
      focusNutrients: ['calcium', 'vitaminD', 'protein', 'magnesium', 'vitaminK']
    }
  },
  {
    id: 'osteoarthritis',
    name: 'Osteoarthritis',
    description: 'Degenerative joint disease',
    exerciseRestrictions: {
      avoid: ['High-impact activities', 'Deep squats', 'Heavy weights on affected joints'],
      caution: ['All weight-bearing exercises on affected joints'],
      recommended: ['Swimming', 'Cycling', 'Elliptical', 'Range of motion exercises'],
      warnings: [
        'Low-impact exercise helps maintain joint health',
        'Strengthen muscles around affected joints',
        'Use appropriate range of motion'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Anti-inflammatory diet',
        'Omega-3 fatty acids',
        'Maintain healthy weight',
        'Glucosamine/chondroitin may help'
      ],
      focusNutrients: ['omega3', 'vitaminD', 'vitaminC']
    }
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy',
    description: 'Currently pregnant',
    exerciseRestrictions: {
      avoid: [
        'Contact sports', 'High fall risk activities',
        'Supine exercises after 1st trimester', 'Hot yoga',
        'Scuba diving', 'Heavy lifting'
      ],
      caution: ['All exercises - modify as needed'],
      recommended: ['Walking', 'Swimming', 'Prenatal yoga', 'Light resistance training'],
      warnings: [
        'Stay well hydrated',
        'Avoid overheating',
        'Stop if experiencing pain, bleeding, or dizziness',
        'Consult healthcare provider'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'caffeine', limit: 200, reason: 'Limit caffeine to 200mg/day' }
      ],
      recommendations: [
        'Adequate folate/folic acid',
        'Iron supplementation often needed',
        'Adequate calcium and vitamin D',
        'Additional 300-500 calories in 2nd/3rd trimester'
      ],
      focusNutrients: ['folate', 'iron', 'calcium', 'vitaminD', 'omega3', 'protein']
    }
  },
  {
    id: 'depression',
    name: 'Depression',
    description: 'Clinical depression or major depressive disorder',
    exerciseRestrictions: {
      avoid: [],
      caution: [],
      recommended: ['Walking', 'Swimming', 'Yoga', 'Light Cardio', 'Group Fitness', 'Outdoor Activities'],
      warnings: [
        'Exercise is proven to help improve mood',
        'Start with short, achievable goals',
        'Outdoor exercise provides additional benefits',
        'Social exercise can help with motivation'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Omega-3 fatty acids support brain health',
        'Adequate vitamin D (often low in depression)',
        'B vitamins support nervous system',
        'Limit alcohol and caffeine',
        'Regular meal timing helps regulate mood'
      ],
      focusNutrients: ['omega3', 'vitaminD', 'vitaminB12', 'folate', 'magnesium', 'zinc']
    }
  },
  {
    id: 'anxiety',
    name: 'Anxiety Disorder',
    description: 'Generalized anxiety, panic disorder, or social anxiety',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Very high intensity exercise may trigger panic in some'],
      recommended: ['Yoga', 'Walking', 'Swimming', 'Tai Chi', 'Moderate Cardio', 'Breathing Exercises'],
      warnings: [
        'Exercise helps reduce anxiety long-term',
        'Avoid exercising close to bedtime',
        'Focus on rhythmic, repetitive exercises',
        'Include relaxation and stretching'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'caffeine', limit: 100, reason: 'Limit caffeine as it can worsen anxiety' }
      ],
      recommendations: [
        'Limit caffeine and stimulants',
        'Avoid alcohol',
        'Magnesium helps with relaxation',
        'Regular meal timing prevents blood sugar crashes'
      ],
      focusNutrients: ['magnesium', 'omega3', 'vitaminB6', 'zinc', 'probiotics']
    }
  },
  {
    id: 'chronic_fatigue',
    name: 'Chronic Fatigue Syndrome',
    description: 'ME/CFS - extreme fatigue not improved by rest',
    exerciseRestrictions: {
      avoid: ['High-intensity exercise', 'Long duration cardio', 'Heavy weightlifting'],
      caution: ['All exercise - must pace carefully'],
      recommended: ['Gentle stretching', 'Short walks', 'Swimming (low intensity)', 'Yoga (restorative)'],
      maxIntensity: 'low',
      warnings: [
        'Post-exertional malaise is common - pace yourself',
        'Start extremely slowly (5-10 minutes)',
        'Rest between activity bouts',
        'Stop before feeling exhausted',
        'Activity should not worsen symptoms next day'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Anti-inflammatory diet may help',
        'Small, frequent meals to maintain energy',
        'Adequate protein for muscle maintenance',
        'Stay well hydrated',
        'Consider CoQ10 and B vitamins'
      ],
      focusNutrients: ['vitaminB12', 'vitaminD', 'magnesium', 'coQ10', 'iron']
    }
  },
  {
    id: 'fibromyalgia',
    name: 'Fibromyalgia',
    description: 'Chronic widespread pain and fatigue',
    exerciseRestrictions: {
      avoid: ['High-impact exercises', 'Heavy lifting', 'Intense exercise'],
      caution: ['All resistance training - start very light'],
      recommended: ['Water aerobics', 'Walking', 'Gentle yoga', 'Tai Chi', 'Stretching', 'Swimming'],
      maxIntensity: 'moderate',
      warnings: [
        'Start low and go slow',
        'Warm water exercise is especially beneficial',
        'Regular gentle movement helps reduce pain',
        'Listen to your body and rest when needed',
        'Consistency is more important than intensity'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Anti-inflammatory diet',
        'Adequate vitamin D',
        'Magnesium for muscle relaxation',
        'Limit processed foods and sugar',
        'Stay well hydrated'
      ],
      focusNutrients: ['vitaminD', 'magnesium', 'omega3', 'vitaminB12']
    }
  },
  {
    id: 'multiple_sclerosis',
    name: 'Multiple Sclerosis',
    description: 'Autoimmune disease affecting the nervous system',
    exerciseRestrictions: {
      avoid: ['Hot yoga', 'Outdoor exercise in heat', 'Very high intensity'],
      caution: ['Balance exercises - use support', 'Fatigue management essential'],
      recommended: ['Swimming', 'Water aerobics', 'Recumbent cycling', 'Yoga (cool room)', 'Resistance bands'],
      maxIntensity: 'moderate',
      warnings: [
        'Avoid overheating - exercise in cool environments',
        'Rest between sets and exercises',
        'Exercise during cooler parts of day',
        'Stop if symptoms worsen',
        'Cooling vests can help during exercise'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Vitamin D is especially important',
        'Anti-inflammatory omega-3 fatty acids',
        'Adequate fiber for bowel function',
        'Stay well hydrated'
      ],
      focusNutrients: ['vitaminD', 'omega3', 'vitaminB12', 'fiber', 'calcium']
    }
  },
  {
    id: 'parkinsons',
    name: "Parkinson's Disease",
    description: 'Progressive nervous system disorder affecting movement',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Balance exercises - use support', 'Quick movements'],
      recommended: ['Walking', 'Dancing', 'Tai Chi', 'Boxing (non-contact)', 'Cycling', 'Swimming', 'Stretching'],
      warnings: [
        'Exercise is highly beneficial for Parkinsons',
        'Focus on large, exaggerated movements',
        'Balance training is important',
        'Rhythm-based exercise helps with gait',
        'Dual-task training (exercise + cognitive) is beneficial'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'protein', reason: 'Time protein intake around medication (can interfere with levodopa)' }
      ],
      recommendations: [
        'Adequate fiber for constipation',
        'Stay well hydrated',
        'Time protein away from levodopa medication',
        'Antioxidant-rich foods'
      ],
      focusNutrients: ['fiber', 'omega3', 'vitaminD', 'coQ10']
    }
  },
  {
    id: 'epilepsy',
    name: 'Epilepsy',
    description: 'Seizure disorder',
    exerciseRestrictions: {
      avoid: ['Scuba diving', 'Rock climbing (unsupervised)', 'Swimming alone'],
      caution: ['Exercise in water - always with supervision', 'Heights', 'Cycling on roads'],
      recommended: ['Walking', 'Gym machines', 'Group fitness', 'Team sports with awareness'],
      warnings: [
        'Exercise generally does not trigger seizures',
        'Never exercise alone in water',
        'Wear medical ID',
        'Inform exercise partners about seizure first aid',
        'Avoid flashing lights in gyms if photosensitive'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Some benefit from ketogenic diet (under medical supervision)',
        'Avoid alcohol',
        'Maintain regular meal times',
        'Stay hydrated'
      ],
      focusNutrients: ['magnesium', 'vitaminB6', 'omega3']
    }
  },
  {
    id: 'arthritis_rheumatoid',
    name: 'Rheumatoid Arthritis',
    description: 'Autoimmune inflammatory arthritis',
    exerciseRestrictions: {
      avoid: ['High-impact during flares', 'Heavy weights during flares'],
      caution: ['All exercise during active flares'],
      recommended: ['Swimming', 'Water aerobics', 'Gentle yoga', 'Range of motion exercises', 'Walking', 'Cycling'],
      warnings: [
        'Exercise during remission, rest during flares',
        'Low-impact exercise protects joints',
        'Morning stiffness may require warm-up time',
        'Strengthen muscles to support joints'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Anti-inflammatory diet is essential',
        'High omega-3 intake',
        'Limit processed foods and sugar',
        'Consider Mediterranean diet pattern'
      ],
      focusNutrients: ['omega3', 'vitaminD', 'calcium', 'antioxidants']
    }
  },
  {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome',
    description: 'Chronic digestive disorder with pain and altered bowel habits',
    exerciseRestrictions: {
      avoid: [],
      caution: ['High-intensity exercise may trigger symptoms in some'],
      recommended: ['Walking', 'Yoga', 'Swimming', 'Moderate cardio', 'Stress-reducing activities'],
      warnings: [
        'Exercise helps regulate bowel function',
        'Avoid eating immediately before exercise',
        'Know bathroom locations when exercising outdoors',
        'Stress-reducing exercise particularly beneficial'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Low FODMAP diet may help identify triggers',
        'Adequate fiber (increase slowly)',
        'Probiotics may help',
        'Identify and avoid trigger foods',
        'Regular meal times'
      ],
      focusNutrients: ['fiber', 'probiotics', 'peppermint']
    }
  },
  {
    id: 'crohns_disease',
    name: "Crohn's Disease",
    description: 'Inflammatory bowel disease affecting digestive tract',
    exerciseRestrictions: {
      avoid: ['High-intensity during flares'],
      caution: ['All exercise during active flares'],
      recommended: ['Walking', 'Swimming', 'Yoga', 'Low-impact activities'],
      warnings: [
        'Exercise during remission',
        'Rest during active flares',
        'Stay well hydrated',
        'Know bathroom locations'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'fiber', reason: 'May need to limit fiber during flares' }
      ],
      recommendations: [
        'Small, frequent meals',
        'Adequate protein for healing',
        'May need vitamin/mineral supplements due to malabsorption',
        'Low-residue diet during flares'
      ],
      focusNutrients: ['vitaminB12', 'iron', 'vitaminD', 'calcium', 'zinc', 'folate']
    }
  },
  {
    id: 'celiac_disease',
    name: 'Celiac Disease',
    description: 'Autoimmune reaction to gluten damaging the small intestine',
    exerciseRestrictions: {
      avoid: [],
      caution: [],
      recommended: ['All exercise types once gluten-free diet established'],
      warnings: [
        'Ensure sports nutrition products are gluten-free',
        'Watch for hidden gluten in supplements',
        'May have nutrient deficiencies initially'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'gluten', limit: 0, reason: 'Strict gluten-free diet required - zero tolerance' }
      ],
      recommendations: [
        'Strict gluten-free diet is essential',
        'Check all supplements and medications for gluten',
        'May need iron, calcium, vitamin D supplementation initially',
        'Read all food labels carefully'
      ],
      focusNutrients: ['iron', 'calcium', 'vitaminD', 'vitaminB12', 'folate', 'fiber']
    }
  },
  {
    id: 'hearing_impairment',
    name: 'Hearing Impairment',
    description: 'Partial or complete hearing loss',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Group classes without visual cues'],
      recommended: ['All exercise types with appropriate accommodations'],
      warnings: [
        'Choose gyms with good visual cues',
        'Inform instructors of hearing impairment',
        'Use mirrors to follow along in classes',
        'Consider one-on-one training initially'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'No specific dietary modifications needed',
        'Standard healthy eating guidelines apply'
      ],
      focusNutrients: []
    }
  },
  {
    id: 'visual_impairment',
    name: 'Visual Impairment',
    description: 'Partial or complete vision loss',
    exerciseRestrictions: {
      avoid: ['Unfamiliar environments without guidance'],
      caution: ['New exercises - learn with assistance first'],
      recommended: ['Tandem cycling', 'Swimming with lane ropes', 'Treadmill (once familiar)', 'Rowing', 'Strength training (machines)'],
      warnings: [
        'Familiarize with gym layout with assistance',
        'Use consistent equipment placement',
        'Strength machines safer than free weights initially',
        'Consider guide runners for outdoor cardio'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'No specific dietary modifications needed',
        'Standard healthy eating guidelines apply'
      ],
      focusNutrients: ['vitaminA', 'omega3', 'zinc']
    }
  },
  {
    id: 'autism',
    name: 'Autism Spectrum',
    description: 'Neurodevelopmental condition affecting social interaction and sensory processing',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Crowded, noisy gyms may be overwhelming'],
      recommended: ['Swimming', 'Running', 'Cycling', 'Martial arts', 'Individual sports', 'Yoga'],
      warnings: [
        'Consider sensory environment (noise, lights, crowds)',
        'Routine and predictability important',
        'May prefer individual over team sports',
        'Allow for special interests in exercise choice'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Respect food preferences and sensory sensitivities',
        'Gradual introduction of new foods',
        'Routine meal times beneficial',
        'May benefit from omega-3 supplementation'
      ],
      focusNutrients: ['omega3', 'vitaminD', 'magnesium', 'zinc']
    }
  },
  {
    id: 'adhd',
    name: 'ADHD',
    description: 'Attention deficit hyperactivity disorder',
    exerciseRestrictions: {
      avoid: [],
      caution: [],
      recommended: ['Martial arts', 'Swimming', 'Team sports', 'Running', 'Cycling', 'Dance', 'High-intensity activities'],
      warnings: [
        'Exercise significantly helps ADHD symptoms',
        'Morning exercise can improve focus all day',
        'Complex motor activities are especially beneficial',
        'Short, varied workouts may work better than long sessions'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Protein at breakfast helps focus',
        'Omega-3 fatty acids support brain function',
        'Limit sugar and processed foods',
        'Regular meal times help with routine'
      ],
      focusNutrients: ['omega3', 'protein', 'iron', 'zinc', 'magnesium']
    }
  },
  {
    id: 'ptsd',
    name: 'PTSD',
    description: 'Post-traumatic stress disorder',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Environments that may trigger symptoms'],
      recommended: ['Yoga', 'Walking in nature', 'Swimming', 'Martial arts', 'Team sports (for connection)'],
      warnings: [
        'Exercise helps regulate nervous system',
        'Mind-body exercises particularly beneficial',
        'Choose safe, comfortable environments',
        'Grounding exercises can help if triggered'
      ]
    },
    nutritionAdjustments: {
      restrictions: [
        { nutrient: 'caffeine', limit: 200, reason: 'Limit caffeine as it can worsen anxiety symptoms' }
      ],
      recommendations: [
        'Limit caffeine and alcohol',
        'Anti-inflammatory diet supports healing',
        'Regular meals help regulate nervous system',
        'Omega-3s support brain health'
      ],
      focusNutrients: ['omega3', 'magnesium', 'vitaminD', 'vitaminB12']
    }
  },
  {
    id: 'bipolar',
    name: 'Bipolar Disorder',
    description: 'Mood disorder with episodes of mania and depression',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Very high intensity during manic episodes may worsen symptoms'],
      recommended: ['Walking', 'Swimming', 'Yoga', 'Regular moderate cardio', 'Strength training'],
      warnings: [
        'Regular exercise helps mood stability',
        'Maintain consistent exercise routine',
        'Avoid overexercising during manic episodes',
        'Morning exercise helps regulate sleep-wake cycle'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Regular meal times support mood stability',
        'Omega-3 fatty acids',
        'Limit caffeine and alcohol',
        'Avoid extreme diets'
      ],
      focusNutrients: ['omega3', 'vitaminD', 'magnesium', 'vitaminB12']
    }
  },
  {
    id: 'eating_disorder_recovery',
    name: 'Eating Disorder Recovery',
    description: 'In recovery from anorexia, bulimia, or binge eating disorder',
    exerciseRestrictions: {
      avoid: ['Compulsive exercise patterns', 'Excessive cardio', 'Calorie-counting devices during early recovery'],
      caution: ['All exercise should be approved by treatment team'],
      recommended: ['Yoga', 'Walking', 'Gentle movement', 'Intuitive movement'],
      maxIntensity: 'moderate',
      warnings: [
        'Exercise should be approved by treatment team',
        'Focus on joyful movement, not calories burned',
        'Avoid exercise if medically compromised',
        'Monitor for return of compulsive patterns'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Follow meal plan from treatment team',
        'Do not restrict or count calories unless directed',
        'Regular meals and snacks',
        'Work with eating disorder dietitian'
      ],
      focusNutrients: ['calcium', 'vitaminD', 'iron', 'vitaminB12', 'zinc']
    }
  },
  {
    id: 'amputation',
    name: 'Limb Amputation',
    description: 'Upper or lower limb amputation',
    exerciseRestrictions: {
      avoid: [],
      caution: ['Exercises requiring affected limb - modify appropriately'],
      recommended: ['Adapted exercises', 'Swimming', 'Seated exercises', 'Resistance training'],
      warnings: [
        'Work with physical therapist for appropriate modifications',
        'Prosthetic users should ensure proper fit before exercise',
        'Skin care around residual limb is important',
        'Many exercises can be adapted for single limb use'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Adequate protein for tissue health',
        'No specific restrictions'
      ],
      focusNutrients: ['protein', 'vitaminC', 'zinc']
    }
  },
  {
    id: 'spinal_cord_injury',
    name: 'Spinal Cord Injury',
    description: 'Complete or incomplete spinal cord injury',
    exerciseRestrictions: {
      avoid: ['Exercises below level of injury without proper support/equipment'],
      caution: ['Autonomic dysreflexia risk in high-level injuries', 'Thermoregulation issues'],
      recommended: ['Upper body exercises', 'Wheelchair sports', 'Swimming with support', 'Handcycling', 'Resistance training'],
      warnings: [
        'Know signs of autonomic dysreflexia',
        'Monitor skin for pressure areas',
        'Thermoregulation may be impaired',
        'Work with SCI-experienced trainer or PT'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Adequate fiber and fluid for bowel management',
        'Calcium and vitamin D for bone health',
        'May need fewer calories due to reduced muscle mass'
      ],
      focusNutrients: ['fiber', 'calcium', 'vitaminD', 'protein']
    }
  },
  {
    id: 'cerebral_palsy',
    name: 'Cerebral Palsy',
    description: 'Group of disorders affecting movement and muscle tone',
    exerciseRestrictions: {
      avoid: [],
      caution: ['High-impact exercises', 'Exercises requiring fine motor control'],
      recommended: ['Swimming', 'Cycling (adapted)', 'Strength training', 'Stretching', 'Yoga'],
      warnings: [
        'Focus on flexibility alongside strength',
        'Use adapted equipment as needed',
        'Fatigue management important',
        'Work with PT for appropriate program'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Texture-modified foods if swallowing difficulties',
        'Adequate calcium for bone health',
        'Small frequent meals if eating is tiring'
      ],
      focusNutrients: ['calcium', 'vitaminD', 'protein']
    }
  },
  {
    id: 'down_syndrome',
    name: 'Down Syndrome',
    description: 'Genetic condition causing developmental and intellectual delays',
    exerciseRestrictions: {
      avoid: ['Contact sports if atlantoaxial instability present'],
      caution: ['Neck-straining exercises', 'High-impact if heart condition present'],
      recommended: ['Swimming', 'Walking', 'Dance', 'Special Olympics sports', 'Strength training'],
      warnings: [
        'Screen for atlantoaxial instability before contact sports',
        'May have associated heart conditions - get clearance',
        'Focus on enjoyment and social aspects',
        'Keep instructions simple and demonstrate'
      ]
    },
    nutritionAdjustments: {
      restrictions: [],
      recommendations: [
        'Higher rate of celiac disease - consider screening',
        'Monitor for thyroid issues',
        'Healthy weight maintenance important'
      ],
      focusNutrients: ['fiber', 'calcium', 'vitaminD']
    }
  }
];

// ========== FOOD ALLERGIES ==========

export interface FoodAllergy {
  id: string;
  name: string;
  description: string;
  commonNames: string[];
  hiddenSources: string[];
  severity: 'high' | 'moderate' | 'low';
}

export const FOOD_ALLERGIES: FoodAllergy[] = [
  {
    id: 'peanuts',
    name: 'Peanuts',
    description: 'Peanut allergy - can cause severe anaphylaxis',
    commonNames: ['peanut', 'groundnut', 'arachis oil'],
    hiddenSources: ['Asian cuisine', 'Candy', 'Baked goods', 'Some protein bars'],
    severity: 'high'
  },
  {
    id: 'tree_nuts',
    name: 'Tree Nuts',
    description: 'Allergy to tree nuts (almonds, walnuts, cashews, etc.)',
    commonNames: ['almond', 'walnut', 'cashew', 'pistachio', 'pecan', 'macadamia', 'hazelnut', 'brazil nut'],
    hiddenSources: ['Baked goods', 'Cereals', 'Candy', 'Nut butters', 'Pesto'],
    severity: 'high'
  },
  {
    id: 'dairy',
    name: 'Dairy',
    description: 'Allergy to milk and dairy products',
    commonNames: ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein', 'lactose'],
    hiddenSources: ['Baked goods', 'Processed foods', 'Some medications', 'Protein powders'],
    severity: 'moderate'
  },
  {
    id: 'eggs',
    name: 'Eggs',
    description: 'Egg allergy',
    commonNames: ['egg', 'albumin', 'globulin', 'lysozyme', 'mayonnaise'],
    hiddenSources: ['Baked goods', 'Pasta', 'Some vaccines', 'Foam on drinks'],
    severity: 'moderate'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    description: 'Wheat allergy (different from celiac disease)',
    commonNames: ['wheat', 'flour', 'bread', 'pasta', 'semolina', 'spelt', 'durum'],
    hiddenSources: ['Soy sauce', 'Beer', 'Processed meats', 'Gravies'],
    severity: 'moderate'
  },
  {
    id: 'gluten',
    name: 'Gluten',
    description: 'Celiac disease or gluten sensitivity',
    commonNames: ['gluten', 'wheat', 'barley', 'rye', 'triticale'],
    hiddenSources: ['Soy sauce', 'Beer', 'Oats (cross-contamination)', 'Processed foods'],
    severity: 'moderate'
  },
  {
    id: 'soy',
    name: 'Soy',
    description: 'Soy allergy',
    commonNames: ['soy', 'soya', 'edamame', 'tofu', 'tempeh', 'miso'],
    hiddenSources: ['Processed foods', 'Asian cuisine', 'Vegetable oil', 'Protein bars'],
    severity: 'moderate'
  },
  {
    id: 'fish',
    name: 'Fish',
    description: 'Allergy to finned fish',
    commonNames: ['fish', 'salmon', 'tuna', 'cod', 'anchovies'],
    hiddenSources: ['Caesar dressing', 'Worcestershire sauce', 'Asian dishes'],
    severity: 'high'
  },
  {
    id: 'shellfish',
    name: 'Shellfish',
    description: 'Allergy to shellfish (crustaceans and/or mollusks)',
    commonNames: ['shrimp', 'crab', 'lobster', 'clam', 'oyster', 'mussel', 'scallop'],
    hiddenSources: ['Asian cuisine', 'Seafood restaurants', 'Glucosamine supplements'],
    severity: 'high'
  },
  {
    id: 'sesame',
    name: 'Sesame',
    description: 'Sesame allergy',
    commonNames: ['sesame', 'tahini', 'hummus', 'sesame oil'],
    hiddenSources: ['Bread', 'Middle Eastern food', 'Asian cuisine', 'Cosmetics'],
    severity: 'high'
  },
  {
    id: 'lactose',
    name: 'Lactose Intolerance',
    description: 'Inability to digest lactose (not an allergy)',
    commonNames: ['milk', 'lactose', 'whey', 'cream'],
    hiddenSources: ['Processed foods', 'Some medications', 'Baked goods'],
    severity: 'low'
  },
  {
    id: 'fructose',
    name: 'Fructose Intolerance',
    description: 'Difficulty absorbing fructose',
    commonNames: ['fructose', 'high fructose corn syrup', 'honey', 'agave'],
    hiddenSources: ['Processed foods', 'Soft drinks', 'Many fruits'],
    severity: 'low'
  }
];

// ========== DIETARY PREFERENCES ==========

export interface DietaryPreference {
  id: string;
  name: string;
  description: string;
  foodRestrictions: string[];
  allowedFoods: string[];
  nutritionConsiderations: string[];
}

export const DIETARY_PREFERENCES: DietaryPreference[] = [
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'No meat or fish, but allows dairy and eggs',
    foodRestrictions: ['meat', 'poultry', 'fish', 'seafood'],
    allowedFoods: ['dairy', 'eggs', 'vegetables', 'fruits', 'grains', 'legumes', 'nuts'],
    nutritionConsiderations: [
      'Ensure adequate protein from varied sources',
      'May need B12 supplementation',
      'Include iron-rich plant foods with vitamin C'
    ]
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products of any kind',
    foodRestrictions: ['meat', 'poultry', 'fish', 'seafood', 'dairy', 'eggs', 'honey'],
    allowedFoods: ['vegetables', 'fruits', 'grains', 'legumes', 'nuts', 'seeds', 'plant milks'],
    nutritionConsiderations: [
      'B12 supplementation essential',
      'Combine proteins for complete amino acids',
      'May need vitamin D, omega-3, iron, zinc supplements',
      'Include calcium-fortified foods'
    ]
  },
  {
    id: 'pescatarian',
    name: 'Pescatarian',
    description: 'Vegetarian plus fish and seafood',
    foodRestrictions: ['meat', 'poultry'],
    allowedFoods: ['fish', 'seafood', 'dairy', 'eggs', 'vegetables', 'fruits', 'grains', 'legumes'],
    nutritionConsiderations: [
      'Good source of omega-3 from fish',
      'Generally nutritionally complete',
      'Watch mercury levels in large fish'
    ]
  },
  {
    id: 'halal',
    name: 'Halal',
    description: 'Islamic dietary laws',
    foodRestrictions: ['pork', 'alcohol', 'non-halal meat', 'blood products'],
    allowedFoods: ['halal meat', 'fish', 'vegetables', 'fruits', 'grains', 'dairy'],
    nutritionConsiderations: [
      'Nutritionally complete with halal protein sources',
      'Be aware of hidden alcohol in foods'
    ]
  },
  {
    id: 'kosher',
    name: 'Kosher',
    description: 'Jewish dietary laws',
    foodRestrictions: ['pork', 'shellfish', 'mixing meat and dairy', 'non-kosher meat'],
    allowedFoods: ['kosher meat', 'fish with fins and scales', 'vegetables', 'fruits', 'grains'],
    nutritionConsiderations: [
      'Nutritionally complete',
      'Meal planning needed for meat/dairy separation'
    ]
  },
  {
    id: 'keto',
    name: 'Keto',
    description: 'Very low carbohydrate, high fat diet',
    foodRestrictions: ['grains', 'sugar', 'most fruits', 'starchy vegetables', 'legumes'],
    allowedFoods: ['meat', 'fish', 'eggs', 'cheese', 'nuts', 'seeds', 'low-carb vegetables', 'oils'],
    nutritionConsiderations: [
      'Carbs limited to ~10% of calories (20-50g/day)',
      'Fat at ~70% of calories',
      'May need electrolyte supplementation',
      'Initial adaptation period common',
      'Monitor cholesterol levels'
    ]
  },
  {
    id: 'paleo',
    name: 'Paleo',
    description: 'Based on foods available to Paleolithic humans',
    foodRestrictions: ['grains', 'legumes', 'dairy', 'refined sugar', 'processed foods'],
    allowedFoods: ['meat', 'fish', 'eggs', 'vegetables', 'fruits', 'nuts', 'seeds'],
    nutritionConsiderations: [
      'Generally nutrient-dense',
      'May need calcium from non-dairy sources',
      'Higher protein intake typical'
    ]
  },
  {
    id: 'low_fodmap',
    name: 'Low FODMAP',
    description: 'For IBS and digestive issues',
    foodRestrictions: ['wheat', 'onions', 'garlic', 'many fruits', 'dairy', 'legumes'],
    allowedFoods: ['meat', 'fish', 'eggs', 'rice', 'oats', 'selected vegetables', 'selected fruits'],
    nutritionConsiderations: [
      'Work with dietitian for proper implementation',
      'Elimination then reintroduction phases',
      'Ensure adequate fiber intake'
    ]
  }
];

// ========== HELPER FUNCTIONS ==========

export function getPhysicalLimitation(id: string): PhysicalLimitation | undefined {
  return PHYSICAL_LIMITATIONS.find(l => l.id === id);
}

export function getMedicalCondition(id: string): MedicalCondition | undefined {
  return MEDICAL_CONDITIONS.find(c => c.id === id);
}

export function getFoodAllergy(id: string): FoodAllergy | undefined {
  return FOOD_ALLERGIES.find(a => a.id === id);
}

export function getDietaryPreference(id: string): DietaryPreference | undefined {
  return DIETARY_PREFERENCES.find(p => p.id === id);
}

export function getAllHealthConditionOptions() {
  return {
    physicalLimitations: PHYSICAL_LIMITATIONS.map(l => ({ id: l.id, name: l.name, description: l.description })),
    medicalConditions: MEDICAL_CONDITIONS.map(c => ({ id: c.id, name: c.name, description: c.description })),
    foodAllergies: FOOD_ALLERGIES.map(a => ({ id: a.id, name: a.name, description: a.description, severity: a.severity })),
    dietaryPreferences: DIETARY_PREFERENCES.map(p => ({ id: p.id, name: p.name, description: p.description }))
  };
}
