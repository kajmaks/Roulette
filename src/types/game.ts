export interface Player {
  id: string;
  name: string;
  balance: number;
  isReady: boolean;
  currentBets: Bet[];
}

export interface Bet {
  type: BetType;
  amount: number;
  numbers: number[];
}

export type BetType = 
  | 'straight'
  | 'split'
  | 'street'
  | 'corner'
  | 'line'
  | 'dozen'
  | 'column'
  | 'red'
  | 'black'
  | 'even'
  | 'odd'
  | 'low'
  | 'high';

export interface Room {
  id: string;
  players: Player[];
  gameState: GameState;
  currentNumber: number | null;
  bettingOpen: boolean;
}

export type GameState = 'waiting' | 'betting' | 'spinning' | 'paying';