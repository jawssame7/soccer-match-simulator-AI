import type { Player } from './player';

// チームの型定義
export interface Team {
  name: string;
  manager: string;
  formation: string;
  players: Player[];
}
