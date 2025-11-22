// 試合結果の型定義

export interface Score {
  home: number;
  away: number;
  halfTime: {
    home: number;
    away: number;
  };
}

export interface MatchFlow {
  firstHalf: string;
  secondHalf: string;
}

export interface Goal {
  minute: number;
  team: string;
  scorer: string;
  assist: string;
  description: string;
}

export interface Highlight {
  minute: number;
  description: string;
}

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

export interface Weather {
  condition: string;
  temperature: number;
  pitchCondition: string;
}

export interface MatchResult {
  score: Score;
  matchFlow: MatchFlow;
  goals: Goal[];
  highlights: Highlight[];
  statistics: Statistics;
  weather: Weather;
}
