import type { MatchResult } from '../types/match';
import type { Team } from '../types/team';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

export interface SimulateMatchRequest {
  homeTeam: Team;
  awayTeam: Team;
}

export const simulateMatch = async (homeTeam: Team, awayTeam: Team): Promise<MatchResult> => {
  try {
    console.log('Sending request to:', `${API_ENDPOINT}/simulate-match`);
    console.log('Request payload:', { homeTeam, awayTeam });

    const response = await fetch(`${API_ENDPOINT}/simulate-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        homeTeam,
        awayTeam,
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // JSONパースに失敗した場合はステータスコードのみ表示
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const data: MatchResult = await response.json();
    console.log('Simulation result received:', data);
    return data;
  } catch (error) {
    console.error('Error simulating match:', error);
    if (error instanceof Error) {
      throw new Error(`シミュレーションエラー: ${error.message}`);
    }
    throw new Error('シミュレーション中に不明なエラーが発生しました');
  }
};
