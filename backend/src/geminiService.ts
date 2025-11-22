import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { MatchResult, Player, Team } from './types';

// Zod Schema Definitions matching types.ts

const scoreSchema = z.object({
  home: z.number().describe("ホームチームのスコア"),
  away: z.number().describe("アウェイチームのスコア"),
  halfTime: z.object({
    home: z.number().describe("ホームチームのハーフタイムスコア"),
    away: z.number().describe("アウェイチームのハーフタイムスコア"),
  }),
});

const matchFlowSchema = z.object({
  firstHalf: z.string().describe("前半の試合展開の詳細な説明（600-800文字）"),
  secondHalf: z.string().describe("後半の試合展開の詳細な説明（600-800文字）"),
});

const goalSchema = z.object({
  minute: z.number().describe("ゴールが決まった時間（分）"),
  team: z.string().describe("得点したチーム名"),
  scorer: z.string().describe("得点者の名前"),
  assist: z.string().describe("アシストした選手の名前（なければ空文字列）"),
  description: z.string().describe("ゴールシーンの詳細な説明（150-200文字）"),
});

const highlightSchema = z.object({
  minute: z.number().describe("ハイライトの時間（分）"),
  description: z.string().describe("ハイライトイベントの説明（100-150文字）"),
});

const statsDetailSchema = z.object({
  home: z.number(),
  away: z.number(),
});

const statisticsSchema = z.object({
  possession: statsDetailSchema.describe("ボール支配率（合計100になる必要がある）"),
  shots: statsDetailSchema,
  shotsOnTarget: statsDetailSchema,
  corners: statsDetailSchema,
  fouls: statsDetailSchema,
  yellowCards: statsDetailSchema,
  redCards: statsDetailSchema,
});

const weatherSchema = z.object({
  condition: z.string().describe("天候（例：晴れ、雨）"),
  temperature: z.number().describe("気温（摂氏）"),
  pitchCondition: z.string().describe("ピッチ状態（例：良好、湿っている）"),
});

const matchResultSchema = z.object({
  score: scoreSchema,
  matchFlow: matchFlowSchema,
  goals: z.array(goalSchema).describe("ゴールのリスト。最終スコアと一致する必要がある。"),
  highlights: z.array(highlightSchema).describe("主要なハイライトのリスト（6-10項目）"),
  statistics: statisticsSchema,
  weather: weatherSchema,
});

export class GeminiService {
  private genAI: GoogleGenAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async simulateMatch(homeTeam: Team, awayTeam: Team): Promise<MatchResult> {
    const prompt = this.buildPrompt(homeTeam, awayTeam);

    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: zodToJsonSchema(matchResultSchema as any) as any,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      console.log('Gemini API Response (first 500 chars):', text.substring(0, 500));

      // Parse the JSON response using Zod to ensure it matches the schema
      const matchResult = matchResultSchema.parse(JSON.parse(text));
      
      // Cast to MatchResult to satisfy TypeScript (Zod schema matches the interface)
      return matchResult as unknown as MatchResult;

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to simulate match');
    }
  }

  private buildPrompt(homeTeam: Team, awayTeam: Team): string {
    const homePlayersList = this.formatPlayersList(homeTeam.players);
    const awayPlayersList = this.formatPlayersList(awayTeam.players);

    return `あなたはサッカーの試合シミュレーターです。
以下の2チームの試合をシミュレートしてください。

【ホームチーム】
チーム名: ${homeTeam.name}
監督: ${homeTeam.manager}
フォーメーション: ${homeTeam.formation}
選手:
${homePlayersList}

【アウェイチーム】
チーム名: ${awayTeam.name}
監督: ${awayTeam.manager}
フォーメーション: ${awayTeam.formation}
選手:
${awayPlayersList}

【重要な考慮事項】
1. **監督の特徴を反映**:
   - 戦術哲学、プレススタイル、攻撃パターン
   - 選手起用法と試合運び

2. **リーグのトレンドを考慮**:
   - プレミアリーグ: ハイプレス、インテンシティ
   - ラ・リーガ: テクニカル、ポゼッション
   - セリエA: 戦術的、守備組織
   - ブンデスリーガ: 縦への速さ、トランジション

3. **シミュレーション条件**:
   - 天候とピッチ状態をランダムに決定
   - リアルな試合展開と統計を確保
   - 選手の能力とフォーメーションの相性を考慮

**重要: 必ず日本語で回答してください。**

提供されたスキーマに一致するJSON形式で詳細な試合レポートを生成してください。
「goals」リストが「score」の最終スコアと正確に一致することを確認してください。
「possession」の合計が100になることを確認してください。
試合展開とゴールについて詳細な説明を提供してください。
`;
  }

  private formatPlayersList(players: Player[]): string {
    const byPosition = players.reduce(
      (acc, player) => {
        if (!acc[player.position]) {
          acc[player.position] = [];
        }
        acc[player.position].push(player.name);
        return acc;
      },
      {} as Record<string, string[]>
    );

    let formatted = '';
    const positions = ['GK', 'DF', 'MF', 'FW'];

    for (const pos of positions) {
      if (byPosition[pos] && byPosition[pos].length > 0) {
        formatted += `- ${pos}: ${byPosition[pos].join(', ')}\n`;
      }
    }

    return formatted;
  }
}
