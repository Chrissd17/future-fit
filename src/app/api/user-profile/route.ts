import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Mock database - in production, replace with actual PostgreSQL
let mockUserProfiles: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');

    if (userIdParam !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Find user profile
    const userProfile = mockUserProfiles.find(profile => profile.userId === userId);

    if (!userProfile) {
      return NextResponse.json(null);
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { height, weight, age, sex, goal } = body;

    // Validate required fields
    if (!height || !weight || !age || !sex || !goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate values
    if (height < 100 || height > 250) {
      return NextResponse.json({ error: 'Invalid height' }, { status: 400 });
    }
    if (weight < 30 || weight > 300) {
      return NextResponse.json({ error: 'Invalid weight' }, { status: 400 });
    }
    if (age < 10 || age > 100) {
      return NextResponse.json({ error: 'Invalid age' }, { status: 400 });
    }
    if (!['male', 'female'].includes(sex)) {
      return NextResponse.json({ error: 'Invalid sex' }, { status: 400 });
    }
    if (!['lose_fat', 'gain_muscle', 'maintain'].includes(goal)) {
      return NextResponse.json({ error: 'Invalid goal' }, { status: 400 });
    }

    // Check if profile exists
    const existingProfileIndex = mockUserProfiles.findIndex(profile => profile.userId === userId);

    const profileData = {
      userId,
      height: parseInt(height),
      weight: parseInt(weight),
      age: parseInt(age),
      sex,
      goal,
      updatedAt: new Date().toISOString()
    };

    if (existingProfileIndex >= 0) {
      // Update existing profile
      mockUserProfiles[existingProfileIndex] = {
        ...mockUserProfiles[existingProfileIndex],
        ...profileData
      };
    } else {
      // Create new profile
      mockUserProfiles.push({
        ...profileData,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
