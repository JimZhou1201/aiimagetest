import { NextResponse } from 'next/server';

interface RequestBody {
  prompt: string;
  image_size?: string;
}

interface ApiResponse {
  images: Array<{
    url: string;
  }>;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: body.prompt,
        image_size: body.image_size || "1024x1024",
      }),
    });

    const data = await response.json() as ApiResponse;

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate image');
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
} 