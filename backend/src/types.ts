// 選手の型定義
export interface Player {
  name: string;
  position: string;
}

// チームの型定義
export interface Team {
  name: string;
  manager: string;
  formation: string;
  players: Player[];
}

// スコアの型定義
export interface Score {
  home: number;
  away: number;
  halfTime: {
    home: number;
    away: number;
  };
}

// 試合の流れ
export interface MatchFlow {
  firstHalf: string;
  secondHalf: string;
}

// ゴール情報
export interface Goal {
  minute: number;
  team: string;
  scorer: string;
  assist: string;
  description: string;
}

// ハイライト
export interface Highlight {
  minute: number;
  description: string;
}

// 統計データ
export interface Statistics {
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  shotsOnTarget: {
    home: number;
    away: number;
  };
  corners: {
    home: number;
    away: number;
  };
  fouls: {
    home: number;
    away: number;
  };
  yellowCards: {
    home: number;
    away: number;
  };
  redCards: {
    home: number;
    away: number;
  };
}

// 天候情報
export interface Weather {
  condition: string;
  temperature: number;
  pitchCondition: string;
}

// 試合結果
export interface MatchResult {
  score: Score;
  matchFlow: MatchFlow;
  goals: Goal[];
  highlights: Highlight[];
  statistics: Statistics;
  weather: Weather;
}

// リクエストボディ
export interface SimulateMatchRequest {
  homeTeam: Team;
  awayTeam: Team;
}
