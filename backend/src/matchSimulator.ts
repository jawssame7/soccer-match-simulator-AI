import { GeminiService } from './geminiService';
import type { MatchResult, Team } from './types';

export class MatchSimulator {
  private geminiService: GeminiService;

  constructor(geminiApiKey: string) {
    this.geminiService = new GeminiService(geminiApiKey);
  }

  async simulate(homeTeam: Team, awayTeam: Team): Promise<MatchResult> {
    // 入力バリデーション
    this.validateTeam(homeTeam, 'ホームチーム');
    this.validateTeam(awayTeam, 'アウェイチーム');

    // Gemini APIを使用して試合をシミュレート
    const result = await this.geminiService.simulateMatch(homeTeam, awayTeam);

    // 結果のバリデーション
    this.validateResult(result);

    return result;
  }

  private validateTeam(team: Team, teamLabel: string): void {
    if (!team.name || team.name.trim() === '') {
      throw new Error(`${teamLabel}の名前が入力されていません`);
    }

    if (!team.manager || team.manager.trim() === '') {
      throw new Error(`${teamLabel}の監督名が入力されていません`);
    }

    if (!team.formation || team.formation.trim() === '') {
      throw new Error(`${teamLabel}のフォーメーションが入力されていません`);
    }

    if (!team.players || team.players.length === 0) {
      throw new Error(`${teamLabel}の選手が入力されていません`);
    }

    if (team.players.length !== 11) {
      throw new Error(
        `${teamLabel}の選手は11名である必要があります（現在: ${team.players.length}名）`
      );
    }

    // 選手名のチェック
    for (const player of team.players) {
      if (!player.name || player.name.trim() === '') {
        throw new Error(`${teamLabel}に名前が入力されていない選手がいます`);
      }
      if (!player.position || player.position.trim() === '') {
        throw new Error(`${teamLabel}にポジションが入力されていない選手がいます`);
      }
    }

    // ポジションのチェック（最低1人のGKが必要）
    const gkCount = team.players.filter((p) => p.position === 'GK').length;
    if (gkCount === 0) {
      throw new Error(`${teamLabel}にはGKが最低1名必要です`);
    }
  }

  private validateResult(result: MatchResult): void {
    if (!result.score) {
      throw new Error('試合結果にスコア情報がありません');
    }

    if (result.score.home < 0 || result.score.away < 0) {
      throw new Error('スコアが不正です');
    }

    if (!result.matchFlow) {
      throw new Error('試合結果に試合の流れ情報がありません');
    }

    if (!result.goals) {
      throw new Error('試合結果にゴール情報がありません');
    }

    if (!result.statistics) {
      throw new Error('試合結果に統計情報がありません');
    }

    if (!result.weather) {
      throw new Error('試合結果に天候情報がありません');
    }

    // ポゼッション率のチェック
    const totalPossession = result.statistics.possession.home + result.statistics.possession.away;
    if (Math.abs(totalPossession - 100) > 1) {
      // 許容誤差1%
      console.warn(`ポゼッション率の合計が100%ではありません: ${totalPossession}%`);
    }
  }
}
