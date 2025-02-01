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

interface RoomState {
  roomId: string;
  players: Player[];
  problems: any[];
  startTime: number;
  endTime: number | null;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
}

interface GameState extends RoomState {
  scores: { [playerId: string]: number };
  submissions: { [playerId: string]: any[] };
  timeLeft: number;
}

class SocketService {
  private socket: Socket | null = null;
  private eventListeners: { [key: string]: ((data: any) => void)[] } = {};
  private currentRoomId: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(token: string) {
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

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO Connected');
      this.notifyListeners('connect', {});
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`❌ Socket.IO Disconnected: ${reason}`);
      this.notifyListeners('disconnect', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO Connection Error:', error);
      if (error.message === 'Invalid token') {
        this.notifyListeners('auth_error', { message: 'Invalid token' });
      }
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket.IO Error:', error);
      this.notifyListeners('error', { message: error.message });
    });
  }

  private notifyListeners(event: string, data: any) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`❌ Error in listener for ${event}:`, error);
        }
      });
    }
  }

  // Matchmaking methods
  joinMatchmaking(mode: GameMode) {
    if (!this.socket?.connected) {
      console.error('❌ Cannot join matchmaking: Socket not connected');
      return;
    }
    console.log('🎮 Joining matchmaking queue:', mode);
    this.socket.emit('join_matchmaking', { mode });
  }

  leaveMatchmaking() {
    if (this.socket?.connected) {
      console.log('🚪 Leaving matchmaking queue');
      this.socket.emit('leave_matchmaking', {});
    }
  }

  // Room methods
  joinRoom(roomId: string) {
    if (!this.socket?.connected) return;
    console.log('🎯 Joining room:', roomId);
    this.currentRoomId = roomId;
    this.socket.emit('join_room', { roomId });
  }

  startGame(roomId: string) {
    if (!this.socket?.connected) return;
    console.log('🎬 Starting game:', roomId);
    this.socket.emit('start_game', { roomId });
  }

  getGameState(roomId: string) {
    if (!this.socket?.connected) return;
    console.log('📊 Getting game state:', roomId);
    this.socket.emit('get_game_state', { roomId });
  }

  rejoinRoom(roomId: string) {
    if (!this.socket?.connected) return;
    console.log('🔄 Rejoining room:', roomId);
    this.socket.emit('rejoin_room', { roomId });
  }

  // Base Socket.IO methods
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting Socket.IO...');
      this.socket.disconnect();
      this.socket = null;
      this.currentRoomId = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);

    // If it's a custom event (not a Socket.IO built-in event), register it with Socket.IO
    if (!['connect', 'disconnect', 'connect_error', 'error'].includes(event) && this.socket) {
      this.socket.on(event, (data) => {
        console.log(`📨 ${event}:`, data);
        this.notifyListeners(event, data);
      });
    }
  }

  off(event: string, callback: (data: any) => void) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        listener => listener !== callback
      );
    }
    // Remove Socket.IO listener if no more callbacks for this event
    if (this.eventListeners[event]?.length === 0 && this.socket) {
      this.socket.off(event);
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      console.log(`📤 Emitting ${event}:`, data);
      this.socket.emit(event, data);
    } else {
      console.error('❌ Cannot emit event: Socket not connected');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService(); 