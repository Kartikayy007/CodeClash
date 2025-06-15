export interface Player {
  id: string;
  username: string;
}

export interface Match {
  id: string;
  mode: string;
  createdAt: string;
  duration: string;
  winnerId: string | null;
  players: Player[];
} 