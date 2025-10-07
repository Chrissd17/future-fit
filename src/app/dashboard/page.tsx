'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Camera, TrendingUp, Target, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

interface ScanResult {
  id: string;
  bodyFatPercentage: number;
  timestamp: string;
  frontPhoto?: string;
  sidePhoto?: string;
}

interface UserProfile {
  height: number;
  weight: number;
  age: number;
  sex: 'male' | 'female';
  goal: 'lose_fat' | 'gain_muscle' | 'maintain';
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData();
    }
  }, [isLoaded, user]);

  const loadUserData = async () => {
    try {
      // Load scan results
      const resultsResponse = await fetch(`/api/scan-results?userId=${user?.id}`);
      if (resultsResponse.ok) {
        const results = await resultsResponse.json();
        setScanResults(results);
      }

      // Load user profile
      const profileResponse = await fetch(`/api/user-profile?userId=${user?.id}`);
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setUserProfile(profile);
        
        // Generate workout plan if profile exists
        if (profile) {
          const plan = await getWorkoutPlan(profile);
          setWorkoutPlan(plan);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const latestResult = scanResults[0];
  const previousResult = scanResults[1];
  const bodyFatChange = latestResult && previousResult 
    ? latestResult.bodyFatPercentage - previousResult.bodyFatPercentage 
    : 0;

  const getGoalProgress = () => {
    if (!userProfile || !latestResult) return 0;
    
    const currentBF = latestResult.bodyFatPercentage;
    let targetBF = 0;
    
    switch (userProfile.goal) {
      case 'lose_fat':
        targetBF = userProfile.sex === 'male' ? 12 : 18;
        return Math.max(0, Math.min(100, ((25 - currentBF) / (25 - targetBF)) * 100));
      case 'gain_muscle':
        targetBF = userProfile.sex === 'male' ? 15 : 22;
        return Math.max(0, Math.min(100, ((currentBF - 10) / (targetBF - 10)) * 100));
      case 'maintain':
        return 50; // Neutral progress for maintenance
      default:
        return 0;
    }
  };

  const getWorkoutPlan = async (profile: UserProfile) => {
    if (!profile) return null;
    
    try {
      const { generateWorkoutPlan, generateNutritionPlan } = await import('@/lib/plans/workoutPlans');
      
      const workoutPlan = generateWorkoutPlan({
        ...profile,
        activityLevel: 'moderate' // Default activity level
      });
      
      const nutritionPlan = generateNutritionPlan({
        ...profile,
        activityLevel: 'moderate'
      });
      
      return {
        title: workoutPlan.title,
        workouts: workoutPlan.workouts.map(w => `${w.name}: ${w.duration} min`),
        nutrition: `${nutritionPlan.dailyCalories} kcal/day, ${nutritionPlan.macros.protein}g protein`
      };
    } catch (error) {
      console.error('Error generating plans:', error);
      // Fallback to simple plans
      const plans = {
        lose_fat: {
          title: "Fat Loss Program",
          workouts: [
            "Cardio: 30-45 min, 4x/week",
            "Strength: Full body, 3x/week", 
            "HIIT: 20 min, 2x/week"
          ],
          nutrition: "Caloric deficit: 300-500 kcal/day"
        },
        gain_muscle: {
          title: "Muscle Building Program", 
          workouts: [
            "Strength: Push/Pull/Legs, 6x/week",
            "Progressive overload focus",
            "Compound movements priority"
          ],
          nutrition: "Caloric surplus: 200-400 kcal/day, 1.6-2.2g protein/kg"
        },
        maintain: {
          title: "Maintenance Program",
          workouts: [
            "Strength: 3-4x/week",
            "Cardio: 2-3x/week",
            "Flexibility: Daily"
          ],
          nutrition: "Maintenance calories, balanced macros"
        }
      };
      
      return plans[profile.goal];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/scan">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Scan
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">Profile</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {scanResults.length === 0 ? (
          // Empty state
          <div className="text-center max-w-2xl mx-auto">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to FutureFit!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Take your first body composition scan to start tracking your progress.
            </p>
            <Link href="/scan">
              <Button size="lg" className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Take Your First Scan
              </Button>
            </Link>
          </div>
        ) : (
          // Dashboard content
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Body Fat</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{latestResult?.bodyFatPercentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {bodyFatChange > 0 ? '+' : ''}{bodyFatChange.toFixed(1)}% from last scan
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getGoalProgress().toFixed(0)}%</div>
                  <Progress value={getGoalProgress()} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scanResults.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Last scan: {new Date(latestResult?.timestamp || '').toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="progress" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="plan">Your Plan</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Body Fat Progress</CardTitle>
                    <CardDescription>
                      Track your body composition changes over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Chart visualization would go here</p>
                      {/* In a real implementation, you'd use Chart.js here */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="plan" className="space-y-6">
                {workoutPlan && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{workoutPlan.title}</CardTitle>
                        <CardDescription>Your personalized workout plan</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {workoutPlan.workouts.map((workout, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              {workout}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Nutrition Guidelines</CardTitle>
                        <CardDescription>Recommended nutrition approach</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{workoutPlan.nutrition}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scan History</CardTitle>
                    <CardDescription>Your previous body composition scans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scanResults.map((result, index) => (
                        <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-semibold">{result.bodyFatPercentage.toFixed(1)}%</div>
                            <div className="text-sm text-gray-500">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Scan #{scanResults.length - index}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
