// ===================================
// WebSocket Service for Real-time Updates
// ===================================
// This service now uses the generic WebSocketManager under the hood
// for broker-agnostic connections with exponential backoff reconnection

import websocketManager from './websocketManager';
import { generateMockMarketUpdate } from '../data/mockData';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:5000';
// Force mock mode if env var is 'true' OR if undefined (safer default)
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== 'false';
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

// Log initialization for debugging
if (DEBUG_MODE) {
  console.log('🔌 WebSocket Service Init:', {
    MOCK_MODE,
    WEBSOCKET_URL,
    ENV_VAR: import.meta.env.VITE_MOCK_MODE,
  });
}

// Register mock data generators for different events
if (MOCK_MODE) {
  websocketManager.registerMockGenerator('market:update', generateMockMarketUpdate);

  // Register additional mock generators for other events
  websocketManager.registerMockGenerator('portfolio:update', () => ({
    timestamp: new Date().toISOString(),
    totalValue: Math.random() * 1000000 + 500000,
    dailyChange: (Math.random() - 0.5) * 10000,
  }));

  websocketManager.registerMockGenerator('trade:executed', () => ({
    id: `TRADE-${Date.now()}`,
    symbol: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'][Math.floor(Math.random() * 4)],
    type: Math.random() > 0.5 ? 'buy' : 'sell',
    quantity: Math.floor(Math.random() * 100) + 1,
    price: Math.random() * 200 + 50,
    timestamp: new Date().toISOString(),
  }));
}

// ===================================
// WebSocket Connection Management
// ===================================

export const connectWebSocket = async () => {
  try {
    await websocketManager.connect(WEBSOCKET_URL, {
      mockMode: MOCK_MODE,
      provider: 'socketio', // Can be 'socketio', 'native', or 'auto'
      mockUpdateInterval: 3000,
    });

    if (DEBUG_MODE) {
      console.log('🔌 WebSocket: Connected successfully');
      console.log('📊 Status:', websocketManager.getStatus());
    }

    // Setup event listeners for all WebSocket events
    setupEventListeners();
  } catch (error) {
    console.error('❌ WebSocket: Connection failed', error);
  }
};

export const disconnectWebSocket = () => {
  websocketManager.disconnect();

  if (DEBUG_MODE) {
    console.log('🔌 WebSocket: Disconnected');
  }
};

export const isConnected = () => {
  return websocketManager.isConnected();
};

export const getConnectionStatus = () => {
  return websocketManager.getStatus();
};

// ===================================
// Event Listeners Setup
// ===================================

const setupEventListeners = () => {
  // The manager automatically handles event distribution
  // Individual components can subscribe to events using the subscribe() function
};

// ===================================
// Event Subscription System
// ===================================

export const subscribe = (eventName, handler) => {
  return websocketManager.on(eventName, handler);
};

export const unsubscribe = (eventName, handler) => {
  websocketManager.off(eventName, handler);
};

// ===================================
// Connection State Monitoring
// ===================================

export const onConnectionChange = (callback) => {
  return websocketManager.onConnectionStateChange(callback);
};

export const onConnectionError = (callback) => {
  return websocketManager.onConnectionError(callback);
};

// ===================================
// Outgoing Messages (Client to Server)
// ===================================

export const sendMessage = (event, data) => {
  websocketManager.emit(event, data);
};

// ===================================
// Specific WebSocket Actions
// ===================================

export const subscribeToMarket = (symbols) => {
  sendMessage('market:subscribe', { symbols });
};

export const unsubscribeFromMarket = (symbols) => {
  sendMessage('market:unsubscribe', { symbols });
};

export const subscribeToPortfolio = () => {
  sendMessage('portfolio:subscribe', {});
};

export const unsubscribeFromPortfolio = () => {
  sendMessage('portfolio:unsubscribe', {});
};

export const placeOrder = (orderData) => {
  sendMessage('order:place', orderData);
};

export const cancelOrder = (orderId) => {
  sendMessage('order:cancel', { orderId });
};

export const updateStrategy = (strategyId, updates) => {
  sendMessage('strategy:update', { strategyId, updates });
};

// ===================================
// Export WebSocket Service
// ===================================
export default {
  connect: connectWebSocket,
  disconnect: disconnectWebSocket,
  isConnected,
  getStatus: getConnectionStatus,
  subscribe,
  unsubscribe,
  sendMessage,
  subscribeToMarket,
  unsubscribeFromMarket,
  subscribeToPortfolio,
  unsubscribeFromPortfolio,
  placeOrder,
  cancelOrder,
  updateStrategy,
  onConnectionChange,
  onConnectionError,
};
