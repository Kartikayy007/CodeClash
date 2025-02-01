// // Types for events
// type GameMode = 'CLASSIC' | 'BLITZ';

// interface Player {
//   id: string;
//   name: string;
//   rating: number;
//   isConnected: boolean;
//   isReady: boolean;
// }

// interface RoomState {
//   roomId: string;
//   players: Player[];
//   problems: any[];
//   startTime: number;
//   endTime: number | null;
//   status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
// }

// interface GameState extends RoomState {
//   scores: { [playerId: string]: number };
//   submissions: { [playerId: string]: any[] };
//   timeLeft: number;
// }

// class WebSocketService {
//   private socket: WebSocket | null = null;
//   private eventListeners: { [key: string]: ((data: any) => void)[] } = {};
//   private isConnecting: boolean = false;
//   private currentRoomId: string | null = null;
//   private reconnectAttempts: number = 0;
//   private maxReconnectAttempts: number = 5;
//   private pingInterval: NodeJS.Timeout | null = null;
//   private isProbeCompleted: boolean = false;
//   private sessionId: string | null = null;
//   private shouldReconnect: boolean = true;
//   private authToken: string | null = null;

//   connect(token: string) {
//     this.authToken = token;
//     if (this.isConnecting) return;
    
//     this.isConnecting = true;
//     this.isProbeCompleted = false;
//     this.shouldReconnect = true;

//     const wsUrl = `wss://goyalshivansh.me/socket/?token=${token}&EIO=4&transport=websocket`;
//     this.socket = new WebSocket(wsUrl);

//     this.socket.onopen = () => this.handleOpen();
//     this.socket.onmessage = (e) => this.handleMessage(e);
//     this.socket.onerror = (e) => this.handleError(e);
//     this.socket.onclose = (e) => this.handleClose(e);
//   }

//   private handleOpen() {
//     console.log('🔌 WebSocket opened');
//   }

//   private handleMessage(event: MessageEvent) {
//     const msg = event.data.toString();
    
//     // Engine.IO handshake
//     if (msg.startsWith('0')) {
//       try {
//         const handshake = JSON.parse(msg.slice(1));
//         console.log('🤝 Handshake:', handshake);
//         this.sessionId = handshake.sid;
//         this.setupPingInterval(handshake.pingInterval);
//         this.sendProbe();
//       } catch (error) {
//         console.error('❌ Handshake error:', error);
//       }
//       return;
//     }

//     // Probe response
//     if (msg === '3probe') {
//       console.log('✅ Probe confirmed');
//       this.isProbeCompleted = true;
//       this.completeTransportUpgrade();
//       return;
//     }

//     // Socket.IO namespace connection
//     if (msg === '40') {
//       console.log('✅ Namespace connected');
//       this.notifyListeners('connect', {});
//       return;
//     }

//     // Regular messages
//     if (msg.startsWith('42')) {
//       try {
//         const [eventName, data] = JSON.parse(msg.slice(2));
//         console.log(`📨 ${eventName}:`, data);
//         this.notifyListeners(eventName, data);
//       } catch (error) {
//         console.error('❌ Message parse error:', error);
//       }
//     }

//     // Ping/pong handling
//     if (msg === '2') this.socket?.send('3');
//   }

//   private handleError(error: Event) {
//     console.error('❌ WebSocket error:', error);
//     this.handleCleanup();
//   }

//   private handleClose(event: CloseEvent) {
//     console.log(`🔌 Closed (${event.code})${event.reason ? ': ' + event.reason : ''}`);
    
//     if (event.code === 4001) {
//       this.shouldReconnect = false;
//       this.notifyListeners('auth_error', { message: 'Invalid token' });
//     }

//     this.handleCleanup();
    
//     if (this.shouldReconnect && this.authToken) {
//       this.scheduleReconnect(this.authToken);
//     }
//   }

//   private sendProbe() {
//     setTimeout(() => {
//       if (this.socket?.readyState === WebSocket.OPEN) {
//         console.log('📤 Sending probe');
//         this.socket.send('2probe');
//       }
//     }, 100);
//   }

//   private completeTransportUpgrade() {
//     console.log('⚡ Upgrading transport');
//     this.socket?.send('5');
    
//     setTimeout(() => {
//       console.log('🔗 Connecting to namespace');
//       this.socket?.send('40');
//     }, 50);
//   }

//   private handleCleanup() {
//     this.isConnecting = false;
//     this.isProbeCompleted = false;
//     this.clearPingInterval();
//     this.sessionId = null;
//     this.currentRoomId = null;
//   }

//   private scheduleReconnect(token: string) {
//     if (this.reconnectAttempts < this.maxReconnectAttempts) {
//       const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
//       this.reconnectAttempts++;
//       setTimeout(() => this.connect(token), delay);
//     } else {
//       console.error('❌ Max reconnection attempts reached');
//     }
//   }

//   private setupPingInterval(interval: number) {
//     this.clearPingInterval();
    
//     // Setup regular ping interval
//     this.pingInterval = setInterval(() => {
//       if (this.socket?.readyState === WebSocket.OPEN) {
//         // console.log('📤 Sending ping');
//         this.socket.send('2');
//       }
//     }, interval);
//   }

//   private clearPingInterval() {
//     if (this.pingInterval) {
//       clearInterval(this.pingInterval);
//       this.pingInterval = null;
//     }
//   }

//   private notifyListeners(event: string, data: any) {
//     if (this.eventListeners[event]) {
//       this.eventListeners[event].forEach(listener => {
//         try {
//           listener(data);
//         } catch (error) {
//           console.error(`❌ Error in listener for ${event}:`, error);
//         }
//       });
//     }
//   }

//   // Matchmaking methods
//   joinMatchmaking(mode: GameMode) {
//     if (!this.isProbeCompleted) {
//       console.error('❌ Cannot join matchmaking: WebSocket not fully connected');
//       return;
//     }
//     console.log('🎮 Joining matchmaking queue:', mode);
//     this.emit('join_matchmaking', { mode });
//   }

//   leaveMatchmaking() {
//     if (this.isProbeCompleted) {
//       console.log('🚪 Leaving matchmaking queue');
//       this.emit('leave_matchmaking', {});
//     }
//   }

//   // Room methods
//   joinRoom(roomId: string) {
//     if (!this.isProbeCompleted) return;
//     console.log('🎯 Joining room:', roomId);
//     this.currentRoomId = roomId;
//     this.emit('join_room', { roomId });
//   }

//   startGame(roomId: string) {
//     if (!this.isProbeCompleted) return;
//     console.log('🎬 Starting game:', roomId);
//     this.emit('start_game', { roomId });
//   }

//   getGameState(roomId: string) {
//     if (!this.isProbeCompleted) return;
//     console.log('📊 Getting game state:', roomId);
//     this.emit('get_game_state', { roomId });
//   }

//   rejoinRoom(roomId: string) {
//     if (!this.isProbeCompleted) return;
//     console.log('🔄 Rejoining room:', roomId);
//     this.emit('rejoin_room', { roomId });
//   }

//   // Base WebSocket methods
//   disconnect() {
//     if (this.socket) {
//       console.log('🔌 Disconnecting WebSocket...');
//       this.socket.close();
//       this.socket = null;
//       this.handleCleanup();
//     }
//   }

//   on(event: string, callback: (data: any) => void) {
//     if (!this.eventListeners[event]) {
//       this.eventListeners[event] = [];
//     }
//     this.eventListeners[event].push(callback);
//   }

//   off(event: string, callback: (data: any) => void) {
//     if (this.eventListeners[event]) {
//       this.eventListeners[event] = this.eventListeners[event].filter(
//         listener => listener !== callback
//       );
//     }
//   }

//   emit(event: string, data: any) {
//     if (this.socket?.readyState === WebSocket.OPEN && this.isProbeCompleted) {
//       const message = `42${JSON.stringify([event, data])}`;
//       console.log(`📤 Emitting ${event}:`, data);
//       this.socket.send(message);
//     } else {
//       console.error('❌ Cannot emit event: WebSocket not fully connected');
//     }
//   }

//   isConnected(): boolean {
//     return this.socket?.readyState === WebSocket.OPEN && this.isProbeCompleted;
//   }
// }

// export const webSocketService = new WebSocketService(); 