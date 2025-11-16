// ===================================
// Generic WebSocket Manager - Broker Agnostic
// ===================================
// This service provides a unified interface for WebSocket connections
// that works with multiple providers (Socket.IO, native WebSocket, etc.)
// and includes exponential backoff reconnection logic

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

class WebSocketManager {
  constructor() {
    this.connection = null;
    this.provider = null; // 'socketio', 'native', or 'mock'
    this.url = null;
    this.eventHandlers = new Map();

    // Reconnection state
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.baseReconnectDelay = 1000; // 1 second
    this.maxReconnectDelay = 30000; // 30 seconds
    this.reconnectTimer = null;
    this.isReconnecting = false;
    this.manualDisconnect = false;

    // Mock update state
    this.mockUpdateInterval = null;
    this.mockGenerators = new Map();

    // Connection state callbacks
    this.onConnectedCallbacks = [];
    this.onDisconnectedCallbacks = [];
    this.onErrorCallbacks = [];
  }

  // ===================================
  // Provider Detection and Initialization
  // ===================================

  async connect(url, options = {}) {
    this.url = url;
    this.manualDisconnect = false;

    const {
      provider = 'auto', // 'auto', 'socketio', 'native', 'mock'
      mockMode = false,
      mockUpdateInterval = 3000,
      ...providerOptions
    } = options;

    // Force mock mode if specified
    if (mockMode) {
      return this.connectMock(mockUpdateInterval);
    }

    // Auto-detect provider
    if (provider === 'auto') {
      this.provider = this.detectProvider(url);
    } else {
      this.provider = provider;
    }

    if (DEBUG_MODE) {
      console.log(`🔌 WebSocketManager: Connecting with provider: ${this.provider}`);
    }

    // Connect based on provider
    switch (this.provider) {
      case 'socketio':
        return this.connectSocketIO(url, providerOptions);
      case 'native':
        return this.connectNative(url, providerOptions);
      case 'mock':
        return this.connectMock(mockUpdateInterval);
      default:
        throw new Error(`Unknown WebSocket provider: ${this.provider}`);
    }
  }

  detectProvider(url) {
    // Check if Socket.IO is available
    if (typeof window !== 'undefined' && window.io) {
      return 'socketio';
    }

    // Check if native WebSocket is available
    if (typeof WebSocket !== 'undefined') {
      return 'native';
    }

    // Fallback to mock
    console.warn('⚠️ No WebSocket provider available, using mock mode');
    return 'mock';
  }

  // ===================================
  // Socket.IO Provider
  // ===================================

  async connectSocketIO(url, options = {}) {
    try {
      // Dynamic import of Socket.IO
      const { io } = await import('socket.io-client');

      this.connection = io(url, {
        transports: ['websocket'],
        reconnection: false, // We'll handle reconnection ourselves
        autoConnect: false,
        ...options,
      });

      this.setupSocketIOListeners();
      this.connection.connect();

      if (DEBUG_MODE) {
        console.log('🔌 Socket.IO: Connection initiated');
      }
    } catch (error) {
      console.error('❌ Failed to connect with Socket.IO:', error);
      this.handleConnectionError(error);
    }
  }

  setupSocketIOListeners() {
    this.connection.on('connect', () => {
      if (DEBUG_MODE) {
        console.log('✅ Socket.IO: Connected');
      }
      this.onConnected();
    });

    this.connection.on('disconnect', (reason) => {
      if (DEBUG_MODE) {
        console.log('❌ Socket.IO: Disconnected -', reason);
      }
      this.onDisconnected(reason);
    });

    this.connection.on('connect_error', (error) => {
      if (DEBUG_MODE) {
        console.warn('⚠️ Socket.IO: Connection error', error.message);
      }
      this.handleConnectionError(error);
    });

    this.connection.on('error', (error) => {
      if (DEBUG_MODE) {
        console.error('❌ Socket.IO: Error', error);
      }
      this.onError(error);
    });
  }

  // ===================================
  // Native WebSocket Provider
  // ===================================

  connectNative(url, options = {}) {
    try {
      this.connection = new WebSocket(url);

      this.connection.onopen = () => {
        if (DEBUG_MODE) {
          console.log('✅ Native WebSocket: Connected');
        }
        this.onConnected();
      };

      this.connection.onclose = (event) => {
        if (DEBUG_MODE) {
          console.log('❌ Native WebSocket: Disconnected', event.code, event.reason);
        }
        this.onDisconnected(event.reason || 'Connection closed');
      };

      this.connection.onerror = (error) => {
        if (DEBUG_MODE) {
          console.error('❌ Native WebSocket: Error', error);
        }
        this.handleConnectionError(error);
      };

      this.connection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;

          if (type) {
            this.triggerEvent(type, payload);
          }
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('❌ Failed to create native WebSocket:', error);
      this.handleConnectionError(error);
    }
  }

  // ===================================
  // Mock Provider (for development/testing)
  // ===================================

  connectMock(updateInterval = 3000) {
    this.provider = 'mock';

    if (DEBUG_MODE) {
      console.log('🔌 Mock WebSocket: Starting with', updateInterval, 'ms interval');
    }

    // Simulate connection
    setTimeout(() => {
      this.onConnected();
      this.startMockUpdates(updateInterval);
    }, 100);

    return Promise.resolve();
  }

  startMockUpdates(interval) {
    if (this.mockUpdateInterval) {
      clearInterval(this.mockUpdateInterval);
    }

    this.mockUpdateInterval = setInterval(() => {
      // Trigger mock updates for all registered generators
      this.mockGenerators.forEach((generator, eventName) => {
        try {
          const mockData = generator();
          this.triggerEvent(eventName, mockData);
        } catch (error) {
          console.error(`❌ Error in mock generator for ${eventName}:`, error);
        }
      });
    }, interval);
  }

  stopMockUpdates() {
    if (this.mockUpdateInterval) {
      clearInterval(this.mockUpdateInterval);
      this.mockUpdateInterval = null;
    }
  }

  // Register a mock data generator for an event
  registerMockGenerator(eventName, generator) {
    this.mockGenerators.set(eventName, generator);
  }

  // ===================================
  // Reconnection Logic with Exponential Backoff
  // ===================================

  onDisconnected(reason) {
    this.notifyDisconnected(reason);

    // Don't reconnect if manually disconnected
    if (this.manualDisconnect) {
      if (DEBUG_MODE) {
        console.log('🔌 Manual disconnect - not reconnecting');
      }
      return;
    }

    // Don't reconnect in mock mode
    if (this.provider === 'mock') {
      return;
    }

    // Start reconnection process
    this.scheduleReconnect();
  }

  scheduleReconnect() {
    if (this.isReconnecting) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.onError(new Error('Max reconnection attempts reached'));
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    // Calculate delay with exponential backoff: delay = baseDelay * 2^attempts
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    if (DEBUG_MODE) {
      console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    }

    this.reconnectTimer = setTimeout(() => {
      this.attemptReconnect();
    }, delay);
  }

  async attemptReconnect() {
    if (this.manualDisconnect) {
      this.isReconnecting = false;
      return;
    }

    if (DEBUG_MODE) {
      console.log(`🔄 Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    }

    try {
      // Close existing connection if any
      this.closeConnection();

      // Attempt to reconnect
      await this.connect(this.url, { provider: this.provider });

      // Success - reset reconnection state
      this.reconnectAttempts = 0;
      this.isReconnecting = false;

      if (DEBUG_MODE) {
        console.log('✅ Reconnection successful');
      }
    } catch (error) {
      console.error('❌ Reconnection failed:', error);
      this.isReconnecting = false;

      // Schedule next attempt
      this.scheduleReconnect();
    }
  }

  cancelReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
  }

  // ===================================
  // Event Management
  // ===================================

  on(eventName, handler) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }

    const handlers = this.eventHandlers.get(eventName);
    handlers.push(handler);

    if (DEBUG_MODE) {
      console.log(`📡 Subscribed to ${eventName} (${handlers.length} handlers)`);
    }

    // Return unsubscribe function
    return () => this.off(eventName, handler);
  }

  off(eventName, handler) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);

        if (DEBUG_MODE) {
          console.log(`📡 Unsubscribed from ${eventName}`);
        }
      }
    }
  }

  triggerEvent(eventName, data) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers && handlers.length > 0) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`❌ Error in ${eventName} handler:`, error);
        }
      });
    }
  }

  // ===================================
  // Outgoing Messages
  // ===================================

  emit(eventName, data) {
    if (this.provider === 'mock') {
      if (DEBUG_MODE) {
        console.log('📤 Mock emit:', eventName, data);
      }
      return;
    }

    if (!this.isConnected()) {
      console.warn('⚠️ WebSocket not connected. Message not sent:', eventName);
      return;
    }

    try {
      if (this.provider === 'socketio') {
        this.connection.emit(eventName, data);
      } else if (this.provider === 'native') {
        this.connection.send(JSON.stringify({ type: eventName, payload: data }));
      }

      if (DEBUG_MODE) {
        console.log('📤 Sent:', eventName, data);
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      this.onError(error);
    }
  }

  // ===================================
  // Connection State Management
  // ===================================

  isConnected() {
    if (this.provider === 'mock') {
      return this.mockUpdateInterval !== null;
    }

    if (this.provider === 'socketio') {
      return this.connection?.connected || false;
    }

    if (this.provider === 'native') {
      return this.connection?.readyState === WebSocket.OPEN;
    }

    return false;
  }

  disconnect() {
    this.manualDisconnect = true;
    this.cancelReconnect();

    if (this.provider === 'mock') {
      this.stopMockUpdates();
    } else {
      this.closeConnection();
    }

    if (DEBUG_MODE) {
      console.log('🔌 WebSocket: Manually disconnected');
    }
  }

  closeConnection() {
    if (this.connection) {
      try {
        if (this.provider === 'socketio') {
          this.connection.disconnect();
        } else if (this.provider === 'native') {
          this.connection.close();
        }
      } catch (error) {
        console.error('❌ Error closing connection:', error);
      }
      this.connection = null;
    }
  }

  // ===================================
  // Connection State Callbacks
  // ===================================

  onConnected() {
    this.reconnectAttempts = 0; // Reset on successful connection
    this.notifyConnected();
  }

  handleConnectionError(error) {
    this.onError(error);

    // If not manually disconnected and not already reconnecting, start reconnection
    if (!this.manualDisconnect && !this.isReconnecting) {
      this.scheduleReconnect();
    }
  }

  onConnectionStateChange(callback) {
    this.onConnectedCallbacks.push(callback);
    return () => {
      const index = this.onConnectedCallbacks.indexOf(callback);
      if (index > -1) {
        this.onConnectedCallbacks.splice(index, 1);
      }
    };
  }

  onConnectionError(callback) {
    this.onErrorCallbacks.push(callback);
    return () => {
      const index = this.onErrorCallbacks.indexOf(callback);
      if (index > -1) {
        this.onErrorCallbacks.splice(index, 1);
      }
    };
  }

  notifyConnected() {
    this.onConnectedCallbacks.forEach((callback) => {
      try {
        callback({ connected: true });
      } catch (error) {
        console.error('❌ Error in connection callback:', error);
      }
    });
  }

  notifyDisconnected(reason) {
    this.onDisconnectedCallbacks.forEach((callback) => {
      try {
        callback({ connected: false, reason });
      } catch (error) {
        console.error('❌ Error in disconnection callback:', error);
      }
    });
  }

  onError(error) {
    this.onErrorCallbacks.forEach((callback) => {
      try {
        callback(error);
      } catch (err) {
        console.error('❌ Error in error callback:', err);
      }
    });
  }

  // ===================================
  // Status Information
  // ===================================

  getStatus() {
    return {
      connected: this.isConnected(),
      provider: this.provider,
      url: this.url,
      reconnectAttempts: this.reconnectAttempts,
      isReconnecting: this.isReconnecting,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }
}

// ===================================
// Singleton Instance
// ===================================
const websocketManager = new WebSocketManager();

export default websocketManager;
export { WebSocketManager };
