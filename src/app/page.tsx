import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, BarChart3, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FutureFit</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <SignedOut>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Body Composition Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Track your body fat percentage with just two photos. No expensive equipment needed.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to FutureFit
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Ready to analyze your body composition?
            </p>
            <Link href="/scan">
              <Button size="lg" className="text-lg px-8 py-6">
                <Camera className="mr-2 h-5 w-5" />
                Start New Scan
              </Button>
            </Link>
          </div>
        </SignedIn>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Photo Analysis</CardTitle>
              <CardDescription>
                Take front and side photos for AI-powered body composition analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your body fat percentage over time with detailed charts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Personalized Plans</CardTitle>
              <CardDescription>
                Get customized workout and nutrition plans based on your goals
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
