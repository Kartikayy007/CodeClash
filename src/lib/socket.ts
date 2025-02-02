import router from 'next/router';
import { io, Socket } from 'socket.io-client';

// Types for events
type GameMode = 'STANDARD' | 'BLITZ';

interface Player {
  id: string;
  name: string;
  rating: number;
  isConnected: boolean;
  isReady: boolean;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  testCases: Array<{ input: string; output: string }>;
}

interface RoomState {
  matchId: string;
  players: Player[];
  problems: Problem[];
  startTime: number;
  endTime: number | null;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
}

type SocketEventCallback<T> = (data: T) => void;

interface EventData {
  // Matchmaking events
  match_found: { matchId: string; players: string[] };
  matchmaking_error: { message: string };
  matchmaking_timeout: Record<string, never>;

  // Match events
  match_state: {
    matchId: string;
    players: Player[];
    status: RoomState['status'];
    problems?: Problem[];
  };
  match_error: { message: string };
  match_aborted: { message: string };

  // Game events
  game_start: { 
    matchId: string; 
    player1: Player; 
    player2: Player; 
    problems: Problem[] 
  };
  game_error: { message: string };
  game_state: { 
    timeLeft: number; 
    status: RoomState['status'] 
  };
  game_state_update: { 
    timeLeft: number; 
    player1: Player; 
    player2: Player 
  };
  game_end: { 
    player1: Player; 
    player2: Player 
  };

  // Other events
  player_disconnected: { playerId: string };
  code_update: { matchId: string; playerId?: string; code?: string; language?: string };
  code_result: { playerId: string; output: string; error: string };
  connect: Record<string, never>;
  disconnect: { reason: string };
  error: { message: string };
  auth_error: { message: string };
}

class SocketService {
  private socket: Socket | null = null;
  private eventListeners: Map<keyof EventData, Set<(data: any) => void>> = new Map();
  private currentmatchId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string): void {
    if (this.socket?.connected) return;

    console.log('🔌 Connecting to Socket.IO server...');
    
    this.socket = io('https://goyalshivansh.me', {
      path: '/socket/',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      query: {
        token,
        EIO: '4',
        transport: 'websocket'
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO Connected');
      this.notifyListeners('connect', {});
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`❌ Socket.IO Disconnected: ${reason}`);
      this.notifyListeners('disconnect', { reason });
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ Socket.IO Connection Error:', error);
      if (error.message === 'Invalid token') {
        this.notifyListeners('auth_error', { message: 'Invalid token' });
      }
    });

    this.socket.on('error', (error: Error) => {
      console.error('❌ Socket.IO Error:', error);
      this.notifyListeners('error', { message: error.message });
    });
  }

  private notifyListeners<K extends keyof EventData>(event: K, data: EventData[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`❌ Error in listener for ${event}:`, error);
        }
      });
    }
  }

  joinMatchmaking(mode: GameMode): void {
    if (!this.socket?.connected) {
      console.error('❌ Cannot join matchmaking: Socket not connected');
      return;
    }
    console.log('🎮 Joining matchmaking queue:', mode);
    this.socket.emit('join_matchmaking', { mode });
    this.on('match_found', (data) => {
      console.log('🎮 Match found:', data);
    });
  }

  leaveMatchmaking(): void {
    if (this.socket?.connected) {
      console.log('🚪 Leaving matchmaking queue');
      this.socket.emit('leave_matchmaking', {});
    }
  }

  joinRoom(matchId: string): void {
    if (!this.socket?.connected) {
      console.error('❌ Cannot join room: Socket not connected');
      return;
    }
    console.log('🎯 Joining match:', matchId);
    this.currentmatchId = matchId;
    this.socket.emit('join_match', matchId);

    this.socket.on('match_state', (response) => {
      console.log('📨 Join match response:', response);
      if (response.status === true) {
        this.startGame(matchId);
        window.location.href = `/battle/${matchId}`;
      } else {
        console.log('kartikay2');
      }
    });
  }

  startGame(matchId: string): void {
    if (!this.socket?.connected) {
      console.error('❌ Cannot start game: Socket not connected');
      return;
    }
    console.log('🎬 Starting game:', matchId);
    this.socket.emit('start_game', matchId);
  }

  getGameState(matchId: string): void {
    if (!this.socket?.connected) return;
    console.log('📊 Getting game state:', matchId);
    this.socket.emit('get_game_state', { matchId });
  }

  rejoinRoom(matchId: string): void {
    if (!this.socket?.connected) return;
    console.log('🔄 Rejoining room:', matchId);
    this.socket.emit('rejoin_room', { matchId });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting Socket.IO...');
      this.socket.disconnect();
      this.socket = null;
      this.currentmatchId = null;
    }
  }

  on<K extends keyof EventData>(event: K, callback: SocketEventCallback<EventData[K]>): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);

    // If it's a custom event (not a Socket.IO built-in event), register it with Socket.IO
    if (!['connect', 'disconnect', 'connect_error', 'error'].includes(event) && this.socket) {
      this.socket.on(event as string, (data) => {
        console.log(`📨 Received ${event} event:`, data);
        this.notifyListeners(event, data as EventData[K]);
      });
    }
  }

  off<K extends keyof EventData>(event: K, callback: SocketEventCallback<EventData[K]>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      
      if (listeners.size === 0 && this.socket) {
        this.socket.off(event as string);
      }
    }
  }

  emit<K extends keyof EventData>(event: K, data: EventData[K]): void {
      if (this.socket?.connected) {
      if (event === 'code_update' && 'roomId' in data) {
        const { roomId, ...rest } = data as any;
        const transformedData = { matchId: roomId, ...rest };
        console.log(`📤 Emitting ${event}:`, transformedData);
        this.socket.emit(event as string, transformedData);
      } else {
        console.log(`📤 Emitting ${event}:`, data);
        this.socket.emit(event as string, data);
      }
    } else {
      console.error('❌ Cannot emit event: Socket not connected');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService(); 