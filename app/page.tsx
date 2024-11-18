'use client';
import { useState } from "react";
import Image from "next/image";

interface GenerateResponse {
  images: Array<{
    url: string;
  }>;
  message?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          image_size: "1024x1024"
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', data);
        throw new Error(data.message || 'Failed to generate image');
      }

      if (!data.images?.[0]?.url) {
        throw new Error('No image URL in response');
      }

      setImageUrl(data.images[0].url);
    } catch (err: unknown) {
      console.error('Client Error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">AI Image Generator</h1>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full p-4 border rounded-lg h-32"
          />
          
          <button
            onClick={generateImage}
            disabled={loading || !prompt}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="aspect-square relative">
            <Image
              src={imageUrl}
              alt="Generated image"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}
      </main>
    </div>
  );
}
