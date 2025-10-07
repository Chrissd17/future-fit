/**
 * Workout and Nutrition Plan Generator
 * Rules-based system for generating personalized plans
 */

export interface WorkoutPlan {
  title: string;
  description: string;
  workouts: Workout[];
  restDays: string[];
  duration: number; // weeks
}

export interface Workout {
  name: string;
  type: 'strength' | 'cardio' | 'hiit' | 'flexibility';
  duration: number; // minutes
  exercises: Exercise[];
  instructions: string[];
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: number; // for cardio
  rest?: number; // seconds
  notes?: string;
}

export interface NutritionPlan {
  title: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number; // grams
    carbs: number;   // grams
    fat: number;     // grams
  };
  mealPlan: MealPlan;
  guidelines: string[];
}

export interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  sex: 'male' | 'female';
  goal: 'lose_fat' | 'gain_muscle' | 'maintain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  bodyFatPercentage?: number;
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, sex } = profile;
  
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  return bmr * activityMultipliers[profile.activityLevel];
}

/**
 * Generate workout plan based on user profile
 */
export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const basePlan = getBaseWorkoutPlan(profile.goal);
  return customizeWorkoutPlan(basePlan, profile);
}

function getBaseWorkoutPlan(goal: 'lose_fat' | 'gain_muscle' | 'maintain'): WorkoutPlan {
  switch (goal) {
    case 'lose_fat':
      return {
        title: "Fat Loss Program",
        description: "High-intensity workouts focused on burning calories and preserving muscle",
        duration: 12,
        restDays: ['Sunday'],
        workouts: [
          {
            name: "Full Body Strength",
            type: "strength",
            duration: 45,
            exercises: [
              { name: "Squats", sets: 4, reps: "12-15", rest: 60 },
              { name: "Push-ups", sets: 3, reps: "10-15", rest: 45 },
              { name: "Bent-over Rows", sets: 3, reps: "10-12", rest: 60 },
              { name: "Lunges", sets: 3, reps: "12 each leg", rest: 45 },
              { name: "Plank", sets: 3, reps: "30-60 seconds", rest: 30 },
              { name: "Burpees", sets: 3, reps: "8-12", rest: 60 }
            ],
            instructions: [
              "Focus on compound movements",
              "Keep rest periods short",
              "Maintain proper form throughout"
            ]
          },
          {
            name: "HIIT Cardio",
            type: "hiit",
            duration: 25,
            exercises: [
              { name: "Jumping Jacks", duration: 30, rest: 30 },
              { name: "High Knees", duration: 30, rest: 30 },
              { name: "Mountain Climbers", duration: 30, rest: 30 },
              { name: "Burpees", duration: 30, rest: 30 },
              { name: "Jump Squats", duration: 30, rest: 30 }
            ],
            instructions: [
              "Perform each exercise for 30 seconds",
              "Rest for 30 seconds between exercises",
              "Complete 4-5 rounds"
            ]
          },
          {
            name: "Steady State Cardio",
            type: "cardio",
            duration: 30,
            exercises: [
              { name: "Running/Jogging", duration: 30, notes: "Maintain moderate pace" },
              { name: "Cycling", duration: 30, notes: "Indoor or outdoor cycling" },
              { name: "Swimming", duration: 30, notes: "Continuous laps" }
            ],
            instructions: [
              "Choose one cardio activity",
              "Maintain steady pace throughout",
              "Keep heart rate in fat-burning zone"
            ]
          }
        ]
      };

    case 'gain_muscle':
      return {
        title: "Muscle Building Program",
        description: "Progressive overload focused on building lean muscle mass",
        duration: 16,
        restDays: ['Wednesday', 'Sunday'],
        workouts: [
          {
            name: "Push Day",
            type: "strength",
            duration: 60,
            exercises: [
              { name: "Bench Press", sets: 4, reps: "6-8", rest: 120 },
              { name: "Overhead Press", sets: 4, reps: "6-8", rest: 120 },
              { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: 90 },
              { name: "Lateral Raises", sets: 3, reps: "12-15", rest: 60 },
              { name: "Tricep Dips", sets: 3, reps: "10-12", rest: 60 },
              { name: "Push-ups", sets: 3, reps: "15-20", rest: 60 }
            ],
            instructions: [
              "Focus on progressive overload",
              "Increase weight when you can complete all reps",
              "Maintain strict form"
            ]
          },
          {
            name: "Pull Day",
            type: "strength",
            duration: 60,
            exercises: [
              { name: "Deadlifts", sets: 4, reps: "5-6", rest: 180 },
              { name: "Pull-ups/Chin-ups", sets: 4, reps: "6-10", rest: 120 },
              { name: "Bent-over Rows", sets: 4, reps: "8-10", rest: 120 },
              { name: "Lat Pulldowns", sets: 3, reps: "10-12", rest: 90 },
              { name: "Bicep Curls", sets: 3, reps: "12-15", rest: 60 },
              { name: "Face Pulls", sets: 3, reps: "15-20", rest: 60 }
            ],
            instructions: [
              "Focus on back and bicep development",
              "Use full range of motion",
              "Control the weight on both phases"
            ]
          },
          {
            name: "Legs Day",
            type: "strength",
            duration: 60,
            exercises: [
              { name: "Squats", sets: 4, reps: "6-8", rest: 180 },
              { name: "Romanian Deadlifts", sets: 4, reps: "8-10", rest: 120 },
              { name: "Leg Press", sets: 3, reps: "12-15", rest: 90 },
              { name: "Walking Lunges", sets: 3, reps: "20 steps", rest: 90 },
              { name: "Calf Raises", sets: 4, reps: "15-20", rest: 60 },
              { name: "Leg Curls", sets: 3, reps: "12-15", rest: 60 }
            ],
            instructions: [
              "Focus on compound movements",
              "Don't skip leg day!",
              "Use proper depth on squats"
            ]
          }
        ]
      };

    case 'maintain':
      return {
        title: "Maintenance Program",
        description: "Balanced approach to maintain current fitness level",
        duration: 8,
        restDays: ['Wednesday', 'Sunday'],
        workouts: [
          {
            name: "Full Body Strength",
            type: "strength",
            duration: 45,
            exercises: [
              { name: "Squats", sets: 3, reps: "10-12", rest: 90 },
              { name: "Push-ups", sets: 3, reps: "12-15", rest: 60 },
              { name: "Bent-over Rows", sets: 3, reps: "10-12", rest: 90 },
              { name: "Lunges", sets: 3, reps: "10 each leg", rest: 60 },
              { name: "Plank", sets: 3, reps: "45-60 seconds", rest: 45 },
              { name: "Shoulder Press", sets: 3, reps: "10-12", rest: 60 }
            ],
            instructions: [
              "Maintain current strength levels",
              "Focus on form and consistency",
              "Adjust intensity as needed"
            ]
          },
          {
            name: "Cardio Session",
            type: "cardio",
            duration: 30,
            exercises: [
              { name: "Running/Jogging", duration: 30, notes: "Moderate pace" },
              { name: "Cycling", duration: 30, notes: "Steady state" },
              { name: "Swimming", duration: 30, notes: "Continuous laps" }
            ],
            instructions: [
              "Choose your preferred cardio",
              "Maintain conversational pace",
              "Enjoy the activity"
            ]
          },
          {
            name: "Flexibility & Mobility",
            type: "flexibility",
            duration: 20,
            exercises: [
              { name: "Dynamic Warm-up", duration: 5 },
              { name: "Static Stretching", duration: 10 },
              { name: "Foam Rolling", duration: 5 }
            ],
            instructions: [
              "Focus on major muscle groups",
              "Hold stretches for 30-60 seconds",
              "Don't bounce during stretches"
            ]
          }
        ]
      };

    default:
      throw new Error('Invalid goal specified');
  }
}

function customizeWorkoutPlan(basePlan: WorkoutPlan, profile: UserProfile): WorkoutPlan {
  // Customize based on user profile
  // This is a simplified version - in production, you'd have more sophisticated customization
  
  const customizedPlan = { ...basePlan };
  
  // Adjust for age
  if (profile.age > 50) {
    // Reduce intensity for older users
    customizedPlan.workouts = customizedPlan.workouts.map(workout => ({
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets ? Math.max(2, exercise.sets - 1) : exercise.sets,
        rest: exercise.rest ? exercise.rest + 30 : exercise.rest
      }))
    }));
  }
  
  // Adjust for beginners (simplified detection)
  if (profile.bodyFatPercentage && profile.bodyFatPercentage > 25) {
    // Reduce complexity for beginners
    customizedPlan.workouts = customizedPlan.workouts.map(workout => ({
      ...workout,
      exercises: workout.exercises.slice(0, 4) // Reduce number of exercises
    }));
  }
  
  return customizedPlan;
}

/**
 * Generate nutrition plan based on user profile
 */
export function generateNutritionPlan(profile: UserProfile): NutritionPlan {
  const tdee = calculateTDEE(profile);
  const { goal } = profile;
  
  let dailyCalories: number;
  let macros: { protein: number; carbs: number; fat: number };
  
  switch (goal) {
    case 'lose_fat':
      dailyCalories = tdee - 500; // 500 calorie deficit
      macros = {
        protein: profile.weight * 2.2, // High protein for muscle preservation
        carbs: (dailyCalories * 0.35) / 4, // 35% of calories from carbs
        fat: (dailyCalories * 0.25) / 9 // 25% of calories from fat
      };
      break;
      
    case 'gain_muscle':
      dailyCalories = tdee + 300; // 300 calorie surplus
      macros = {
        protein: profile.weight * 2.0, // High protein for muscle building
        carbs: (dailyCalories * 0.45) / 4, // 45% of calories from carbs
        fat: (dailyCalories * 0.25) / 9 // 25% of calories from fat
      };
      break;
      
    case 'maintain':
      dailyCalories = tdee; // Maintenance calories
      macros = {
        protein: profile.weight * 1.6, // Moderate protein
        carbs: (dailyCalories * 0.40) / 4, // 40% of calories from carbs
        fat: (dailyCalories * 0.30) / 9 // 30% of calories from fat
      };
      break;
      
    default:
      throw new Error('Invalid goal specified');
  }
  
  const mealPlan = generateMealPlan(dailyCalories, macros, goal);
  const guidelines = generateNutritionGuidelines(goal);
  
  return {
    title: `${goal.replace('_', ' ').toUpperCase()} Nutrition Plan`,
    description: `Personalized nutrition plan for ${goal.replace('_', ' ')} goals`,
    dailyCalories: Math.round(dailyCalories),
    macros: {
      protein: Math.round(macros.protein),
      carbs: Math.round(macros.carbs),
      fat: Math.round(macros.fat)
    },
    mealPlan,
    guidelines
  };
}

function generateMealPlan(calories: number, macros: any, goal: string): MealPlan {
  // Simplified meal plan - in production, you'd have a more comprehensive database
  return {
    breakfast: [
      "Oatmeal with berries and protein powder",
      "Greek yogurt with granola and fruit",
      "Scrambled eggs with whole grain toast",
      "Protein smoothie with banana and spinach"
    ],
    lunch: [
      "Grilled chicken salad with quinoa",
      "Turkey and avocado wrap",
      "Salmon with sweet potato and vegetables",
      "Lentil soup with whole grain bread"
    ],
    dinner: [
      "Lean beef with brown rice and broccoli",
      "Baked fish with quinoa and roasted vegetables",
      "Chicken stir-fry with vegetables",
      "Turkey meatballs with whole grain pasta"
    ],
    snacks: [
      "Apple with almond butter",
      "Greek yogurt with berries",
      "Protein bar",
      "Mixed nuts and dried fruit"
    ]
  };
}

function generateNutritionGuidelines(goal: string): string[] {
  switch (goal) {
    case 'lose_fat':
      return [
        "Eat protein with every meal to preserve muscle mass",
        "Focus on whole, unprocessed foods",
        "Stay hydrated - drink at least 8 glasses of water daily",
        "Eat plenty of vegetables for fiber and nutrients",
        "Limit processed foods and added sugars",
        "Consider intermittent fasting if it fits your lifestyle"
      ];
      
    case 'gain_muscle':
      return [
        "Eat protein within 30 minutes of workouts",
        "Consume complex carbs before and after training",
        "Eat frequent, smaller meals throughout the day",
        "Include healthy fats for hormone production",
        "Stay consistent with your eating schedule",
        "Consider a post-workout protein shake"
      ];
      
    case 'maintain':
      return [
        "Eat a balanced diet with all macronutrients",
        "Listen to your body's hunger and fullness cues",
        "Stay hydrated throughout the day",
        "Include a variety of colorful fruits and vegetables",
        "Moderate your intake of processed foods",
        "Enjoy treats in moderation"
      ];
      
    default:
      return [];
  }
}
