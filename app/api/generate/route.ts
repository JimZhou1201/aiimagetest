import { NextResponse } from 'next/server';

interface RequestBody {
  prompt: string;
  image_size?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
}

interface ApiResponse {
  images: Array<{
    url: string;
  }>;
  timings?: {
    inference: number;
  };
  seed?: number;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
      console.error('API Key not found in configuration');
      throw new Error('SILICONFLOW_API_KEY is not configured');
    }

    const body = await request.json() as RequestBody;
    
    console.log('Received request body:', body);

    // 构建API请求体
    const apiRequestBody = {
      model: "black-forest-labs/FLUX.1-schnell",
      prompt: body.prompt,
      image_size: body.image_size || "1024x1024",
      ...(body.num_inference_steps && { num_inference_steps: body.num_inference_steps }),
      ...(body.guidance_scale && { guidance_scale: body.guidance_scale }),
      ...(body.seed && { seed: body.seed })
    };

    console.log('Sending request to API:', apiRequestBody);
    
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody)
    });

    const data = await response.json() as ApiResponse;
    console.log('API Response:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.message || 'Failed to generate image');
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Server Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
} 