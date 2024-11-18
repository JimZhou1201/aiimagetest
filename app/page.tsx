'use client';
import { useState } from "react";
import Image from "next/image";
import SparklesText from "@/components/ui/sparkles-text";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

// 图片尺寸选项
const IMAGE_SIZES = [
  { label: "1024 x 1024", value: "1024x1024" },
  { label: "512 x 1024", value: "512x1024" },
  { label: "768 x 512", value: "768x512" },
  { label: "768 x 1024", value: "768x1024" },
  { label: "1024 x 576", value: "1024x576" },
  { label: "576 x 1024", value: "576x1024" },
];

// 常用提示词配置
const PROMPT_TAGS = [
  { label: "高清", value: "高清写实" },
  { label: "油画", value: "油画风格" },
  { label: "水彩", value: "水彩画风格" },
  { label: "动漫", value: "动漫风格" },
  { label: "素描", value: "素描风格" },
  { label: "大师作品", value: "大师级作品" },
  { label: "梦幻", value: "梦幻风格" },
  { label: "未来", value: "未来科技风" },
  { label: "复古", value: "复古风格" },
  { label: "极简", value: "简约风格" },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [steps, setSteps] = useState(20);
  const [guidance, setGuidance] = useState(7.5);
  const [seed, setSeed] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 添加提示词
  const addPromptTag = (tagValue: string) => {
    if (!prompt.trim()) {
      setPrompt(tagValue);
      return;
    }
    const needsComma = ![',', '，', '.', '。'].some(char => prompt.trim().endsWith(char));
    const separator = needsComma ? '，' : '';
    setPrompt(`${prompt.trim()}${separator}${tagValue}`);
  };

  // 生成图片
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
          image_size: imageSize,
          num_inference_steps: steps,
          guidance_scale: guidance,
          ...(seed !== undefined && { seed })
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate image');
      }

      setImageUrl(data.images[0].url);
      
      // 如果API返回了实际使用的seed，更新UI
      if (data.seed) {
        setSeed(data.seed);
      }
      
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
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-transparent backdrop-blur-[1px]" />
        <div className="relative z-10 flex items-center justify-center px-4 md:px-6 h-20">
          <div 
            className="text-xl tracking-[0.01em] font-light animate-gradient"
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #a78bfa 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AI智研君
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 
              className="text-4xl font-bold mb-4"
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #a78bfa 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent'
              }}
            >
              搭载热门FLUX模型
            </h1>
            <p className="text-gray-600">
              让你的AI绘图更生动逼真
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* 提示词输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述你想要的图片
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border"
                placeholder="例如：一只可爱的猫咪坐在窗台上..."
              />
              
              {/* 提示词标签 */}
              <div className="mt-3 flex flex-wrap gap-2">
                {PROMPT_TAGS.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => addPromptTag(tag.value)}
                    className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-100/50 text-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-sm"
                  >
                    + {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 图片尺寸选择 */}
            <div>
              <label className="block text-sm font-medium mb-2"
                style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                图片尺寸
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {IMAGE_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setImageSize(size.value)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      imageSize === size.value
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-purple-200"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 参数控制 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 生成步数 */}
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #a78bfa 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  生成步数 (1-50)
                </label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>

              {/* 提示词偏向 */}
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #a78bfa 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  提示词偏向 (1-20)
                </label>
                <input
                  type="number"
                  value={guidance}
                  onChange={(e) => setGuidance(Number(e.target.value))}
                  step={0.1}
                  min={1}
                  max={20}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>

              {/* Seed */}
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #a78bfa 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Seed (可选)
                </label>
                <input
                  type="number"
                  value={seed || ''}
                  onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2 rounded-lg border"
                  placeholder="随机种子"
                />
              </div>
            </div>

            {/* 生成按钮 */}
            <div className="flex justify-center">
              <button
                onClick={generateImage}
                disabled={loading || !prompt.trim()}
                className={`px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 w-40 ${
                  loading || !prompt.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 text-purple-700 hover:from-purple-100 hover:via-pink-100 hover:to-blue-100 border border-purple-200"
                }`}
              >
                {loading ? "生成中..." : "生成图片"}
              </button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* 图片预览 */}
            {imageUrl && (
              <div className="relative group">
                <Image
                  src={imageUrl}
                  alt="Generated image"
                  width={1024}
                  height={1024}
                  className="w-full rounded-lg"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-white/90 hover:bg-white shadow-lg hover:shadow-xl text-gray-800 font-medium transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm hover:scale-105"
                  >
                    保存图片
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
