// 選手の型定義
export interface Player {
  name: string;
  position: string;
}

export type Position = 'GK' | 'DF' | 'MF' | 'FW';
