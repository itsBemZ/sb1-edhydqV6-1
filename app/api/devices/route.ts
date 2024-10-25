import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/db/connect';
import Device from '@/lib/models/device';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const deviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['WAP', 'Server', 'Laptop', 'DPO']),
  status: z.enum(['Online', 'Offline']),
  ip: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP address'),
  mac: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address').optional(),
  location: z.string().optional(),
  profiles: z.array(z.string()).optional(),
  positions: z.record(z.string(), z.object({
    x: z.number(),
    y: z.number(),
  })).optional(),
  connections: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const devices = await Device.find({})
      .populate('profiles', 'name')
      .populate('connections', 'name type status');

    return NextResponse.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
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
    const validatedData = deviceSchema.parse(json);

    await dbConnect();
    const device = await Device.create(validatedData);
    
    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}