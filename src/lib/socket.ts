<<<<<<< HEAD
// import { updateProblemStatus } from '@/features/battle/slices/battleSlice';
// import router from 'next/router';
=======
>>>>>>> 26a6027df3179d0a43e8c917d430aab37cf0051e
import { io, Socket } from 'socket.io-client';

type GameMode = 'STANDARD' | 'SPEED' | 'ACCURACY';

interface Player {
  id: string;
  name: string;
  rating: number;
  isConnected: boolean;
  isReady: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testCases: Array<{ input: string; output: string }>;
  sampleInput?: string;
  sampleOutput?: string;
  rating: number;
  timeLimit: number;
  memoryLimit: number;
}

interface RoomState {
  matchId: string;
  players: Player[];
  problems: Problem[];
  startTime: number;
  endTime: number | null;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
}

// type SocketEventCallback<T> = (data: T) => void;

interface EventData {
  match_found: { matchId: string; players: string[] };
  matchmaking_error: { message: string };
  matchmaking_timeout: Record<string, never>;

  match_state: {
    matchId: string;
    players: Player[];
    status: RoomState['status'];
    problems?: Problem[];
  };
  match_error: { message: string };
  match_aborted: { message: string };

  game_start: { 
    problems: string[];
    gameState: Array<{
      userId: string;
      problemsSolved: number;
      solvedProblems: Record<string, {
        status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR';
        submittedAt: number;
      }>;
    }>;
  };
  game_error: { message: string };
  game_state: { 
    timeLeft: number; 
    status: RoomState['status'] 
  };
  game_state_update: { 
    userId: string;
    problemId: string;
    status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR';
  };
  game_end: { 
    player1: Player; 
    player2: Player 
  };

  player_disconnected: { playerId: string };
  code_update: { 
    matchId: string; 
    playerId: string | undefined; 
    code: string | undefined; 
    language: string | undefined;
  };
  code_result: { playerId: string; output: string; error: string };
  connect: Record<string, never>;
  disconnect: { reason: string };
  error: { message: string };
  auth_error: { message: string };
}

class SocketService {
  private socket: Socket | null = null;
  private eventListeners: Map<keyof EventData, Set<(data: EventData[keyof EventData]) => void>> = new Map();
  private currentmatchId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string): void {
    if (this.socket?.connected) {
       console.log("🔌 Socket already connected, skipping connection");
      return;
    }

<<<<<<< HEAD
     console.log("🔌 Connecting to Socket.IO server...");
=======
>>>>>>> 26a6027df3179d0a43e8c917d430aab37cf0051e
    
    this.socket = io('https://goyalshivansh.me', {
      path: '/socket/',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      query: {
        token,
        EIO: '4',
        transport: 'websocket'
      }
    });

    if (typeof window !== 'undefined') {
      (window as unknown as Window & { __socketInstance: Socket | null }).__socketInstance = this.socket;
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
       console.log("✅ Socket connected successfully");
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
       console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🚫 Max reconnection attempts reached');
        this.socket?.disconnect();
      }
    });

    // Game state update event
    this.socket.on('game_state_update', (data) => {
       console.log("🎮 Game state update received in socket:", data);
      const listeners = this.eventListeners.get('game_state_update');
      if (listeners) {
        listeners.forEach(listener => listener(data));
      }
    });

    // Handle other socket events
    this.socket.onAny((eventName, ...args) => {
       console.log("📡 Socket event received:", eventName, args);
      const listeners = this.eventListeners.get(eventName as keyof EventData);
      if (listeners) {
        listeners.forEach(listener => listener(args[0] as EventData[keyof EventData]));
      }
    });
  }

  on<K extends keyof EventData>(event: K, callback: (data: EventData[K]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    (this.eventListeners.get(event) as Set<(data: EventData[K]) => void>).add(callback);
  }

  off<K extends keyof EventData>(event: K, callback: (data: EventData[K]) => void): void {
    const listeners = this.eventListeners.get(event) as Set<(data: EventData[K]) => void>;
    if (listeners) {
      listeners.delete(callback);
    }
  }

  emit<K extends keyof EventData>(event: K, data: EventData[K]): void {
    if (!this.socket?.connected) {
      console.warn('⚠️ Socket not connected, cannot emit event:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.eventListeners.clear();
       console.log("🔌 Socket disconnected manually");
    }
  }

  joinMatchmaking(mode: GameMode): void {
    if (!this.socket?.connected) {
      console.error('❌ Cannot join matchmaking: Socket not connected');
      return;
    }
     console.log("🎮 Joining matchmaking queue:", mode);
    this.socket.emit('join_matchmaking', { mode });
    this.on('match_found', (data) => {
       console.log("🎮 Match found:", data);
    });
  }

  leaveMatchmaking(): void {
    if (this.socket?.connected) {
       console.log("🚪 Leaving matchmaking queue");
      this.socket.emit('leave_matchmaking', {});
    }
  }

  joinRoom(matchId: string): void {
    if (!this.socket?.connected) {
      console.error('❌ Cannot join room: Socket not connected');
      return;
    }
     console.log("🎯 Joining match:", matchId);
    this.currentmatchId = matchId;
    this.socket.emit('join_match', matchId);
  }

  startGame(matchId: string): void {
    if (!this.socket?.connected) {
      console.error('❌ Cannot start game: Socket not connected');
      return;
    }
    if (matchId !== this.currentmatchId) {
      console.error('❌ Match ID mismatch:', { current: this.currentmatchId, received: matchId });
      return;
    }
     console.log("🎬 Starting game:", matchId);
    this.socket.emit('start_game', matchId);
  }

  getGameState(matchId: string): void {
    if (!this.socket?.connected) return;
     console.log("📊 Getting game state:", matchId);
    this.socket.emit('get_game_state', { matchId });
  }

  rejoinRoom(matchId: string): void {
    if (!this.socket?.connected) return;
     console.log("🔄 Rejoining room:", matchId);
    this.socket.emit('rejoin_room', { matchId });
  }
}

export const socketService = new SocketService(); 