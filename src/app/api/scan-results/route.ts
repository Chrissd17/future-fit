import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Mock database - in production, replace with actual PostgreSQL
let mockScanResults: any[] = [];

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

    // Filter results for the user and sort by timestamp
    const userResults = mockScanResults
      .filter(result => result.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(userResults);
  } catch (error) {
    console.error('Error fetching scan results:', error);
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
    const { bodyFatPercentage, frontPhoto, sidePhoto, timestamp } = body;

    // Validate required fields
    if (!bodyFatPercentage || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new scan result
    const newResult = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      bodyFatPercentage: parseFloat(bodyFatPercentage),
      frontPhoto,
      sidePhoto,
      timestamp: new Date(timestamp).toISOString(),
      createdAt: new Date().toISOString()
    };

    // Add to mock database
    mockScanResults.push(newResult);

    return NextResponse.json(newResult, { status: 201 });
  } catch (error) {
    console.error('Error saving scan result:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
