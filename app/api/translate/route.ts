import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface RequestBody {
  text: string;
}

const APPID = 'e98e8cd5';
const API_SECRET = 'MDY4OWZlOGJiZGEwMjg1ZWFhMzRlNDIy';
const API_KEY = '4bf2c99c4f5bdf04f56b0b2912269e88';
const API_URL = 'wss://spark-api.xf-yun.com/v3.1/chat';

// 生成鉴权url
function getAuthUrl() {
  const host = 'spark-api.xf-yun.com';
  const path = '/v3.1/chat';
  const date = new Date().toUTCString();
  const algorithm = 'hmac-sha256';
  const headers = 'host date request-line';
  const requestLine = `GET ${path} HTTP/1.1`;
  const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;
  const signature = crypto.createHmac('sha256', API_SECRET)
    .update(signatureOrigin)
    .digest('base64');
  const authorizationOrigin = `api_key="${API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
  const authorization = Buffer.from(authorizationOrigin).toString('base64');

  return `${API_URL}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { text } = await request.json() as RequestBody;
    
    // 创建WebSocket连接
    const ws = new WebSocket(getAuthUrl());
    
    return new Promise<Response>((resolve, reject) => {
      ws.onopen = () => {
        // 发送翻译请求
        ws.send(JSON.stringify({
          header: {
            app_id: APPID,
          },
          parameter: {
            chat: {
              domain: "generalv3",
              temperature: 0.5,
              max_tokens: 1024,
            }
          },
          payload: {
            message: {
              text: [
                { role: "user", content: `请将以下文本翻译成英文：${text}` }
              ]
            }
          }
        }));
      };

      let translatedText = '';

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.header.code === 0) {
          const content = response.payload.choices.text[0].content;
          translatedText += content;
          
          if (response.header.status === 2) {
            ws.close();
            resolve(NextResponse.json({ translatedText }));
          }
        }
      };

      ws.onerror = (error) => {
        reject(NextResponse.json(
          { message: 'Translation failed' },
          { status: 500 }
        ));
      };
    });
  } catch (error) {
    console.error('Translation Error:', error);
    return NextResponse.json(
      { message: 'Translation failed' },
      { status: 500 }
    );
  }
} 