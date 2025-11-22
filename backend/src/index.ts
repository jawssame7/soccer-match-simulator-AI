import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MatchSimulator } from './matchSimulator';
import type { SimulateMatchRequest } from './types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // CORSヘッダー
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // OPTIONSリクエスト（プリフライト）への対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // POSTメソッドのみ許可
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Gemini API keyの取得
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // リクエストボディのパース
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const requestBody: SimulateMatchRequest = JSON.parse(event.body);

    // バリデーション
    if (!requestBody.homeTeam || !requestBody.awayTeam) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'homeTeam and awayTeam are required' }),
      };
    }

    // 試合シミュレーションの実行
    const simulator = new MatchSimulator(geminiApiKey);
    const result = await simulator.simulate(requestBody.homeTeam, requestBody.awayTeam);

    // 成功レスポンス
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // エラーレスポンス
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: errorMessage,
      }),
    };
  }
};
