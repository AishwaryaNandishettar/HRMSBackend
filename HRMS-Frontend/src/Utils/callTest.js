/**
 * Call Testing Utility
 * Use this to test WebSocket connections and call functionality
 */

// Test WebSocket connection status
export const testWebSocketConnection = () => {
  console.log('🔍 Testing WebSocket Connection...');
  
  // Check if WebSocket is connected
  const wsConnected = window.stompClient?.connected || false;
  console.log('WebSocket Connected:', wsConnected);
  
  // Check subscriptions
  if (window.stompClient?.subscriptions) {
    console.log('Active Subscriptions:', Object.keys(window.stompClient.subscriptions));
  }
  
  return wsConnected;
};

// Test call signal sending
export const testCallSignal = (fromEmail, toEmail) => {
  console.log('🔍 Testing Call Signal...');
  console.log('From:', fromEmail);
  console.log('To:', toEmail);
  
  if (!window.stompClient?.connected) {
    console.error('❌ WebSocket not connected!');
    return false;
  }
  
  try {
    const testSignal = {
      fromEmail,
      toEmail,
      type: 'VIDEO',
      action: 'CALL',
      callId: `test_${Date.now()}`,
      timestamp: Date.now()
    };
    
    console.log('📞 Sending test call signal:', testSignal);
    
    window.stompClient.publish({
      destination: "/app/call.signal",
      body: JSON.stringify(testSignal),
    });
    
    console.log('✅ Test call signal sent');
    return true;
  } catch (error) {
    console.error('❌ Failed to send test call signal:', error);
    return false;
  }
};

// Add to window for easy testing in console
if (typeof window !== 'undefined') {
  window.testWebSocket = testWebSocketConnection;
  window.testCall = testCallSignal;
  
  console.log('🧪 Call testing utilities loaded:');
  console.log('- window.testWebSocket() - Test WebSocket connection');
  console.log('- window.testCall(fromEmail, toEmail) - Test call signal');
}

export default {
  testWebSocketConnection,
  testCallSignal
};