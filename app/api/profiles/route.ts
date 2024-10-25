import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/db/connect';
import Profile from '@/lib/models/profile';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  mapImage: z.string().optional(),
  devices: z.array(z.string()).optional(),
  config: z.object({
    layout: z.enum(['hierarchical', 'circular', 'grid']),
    autoArrange: z.boolean(),
    showLabels: z.boolean(),
    theme: z.enum(['system', 'light', 'dark']),
  }),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const profiles = await Profile.find({}).populate('devices', 'name type status');

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validatedData = profileSchema.parse(json);

    await dbConnect();
    const profile = await Profile.create(validatedData);
    
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}