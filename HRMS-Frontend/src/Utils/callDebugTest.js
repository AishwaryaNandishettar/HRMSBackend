/**
 * Call System Debug Test Utilities
 * Use these functions in browser console to test the call system
 */

// Test WebSocket connection
window.testWebSocketConnection = () => {
  console.log('🧪 Testing WebSocket Connection...');
  
  const result = {
    stompClient: !!window.stompClient,
    connected: window.stompClient?.connected || false,
    state: window.stompClient?.state || 'unknown',
    subscriptions: Object.keys(window.stompClient?.subscriptions || {}),
    currentUser: window.getCurrentUser?.() || 'Not available'
  };
  
  console.table(result);
  return result;
};

// Test call signal flow
window.testCallFlow = (fromEmail, toEmail) => {
  console.log('🧪 Testing Call Flow...');
  console.log('From:', fromEmail);
  console.log('To:', toEmail);
  
  if (!window.stompClient?.connected) {
    console.error('❌ WebSocket not connected');
    return false;
  }
  
  const testSignal = {
    fromEmail: fromEmail.trim().toLowerCase(),
    toEmail: toEmail.trim().toLowerCase(),
    type: 'VIDEO',
    action: 'CALL',
    callId: `test_${Date.now()}`,
    timestamp: Date.now()
  };
  
  console.log('📞 Sending test call signal:', testSignal);
  
  try {
    window.stompClient.publish({
      destination: "/app/call.signal",
      body: JSON.stringify(testSignal)
    });
    console.log('✅ Test call signal sent');
    return true;
  } catch (error) {
    console.error('❌ Failed to send test call signal:', error);
    return false;
  }
};

// Monitor call signals
window.startCallMonitoring = () => {
  console.log('🔍 Starting call signal monitoring...');
  
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'call_signal') {
      console.log('📞 Call signal listener added');
      
      // Wrap the listener to log calls
      const wrappedListener = function(event) {
        console.log('📞 Call signal received:', {
          timestamp: new Date().toISOString(),
          data: event.detail,
          currentUser: window.getCurrentUser?.()?.email
        });
        return listener.call(this, event);
      };
      
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  console.log('✅ Call monitoring started');
};

// Check notification permissions
window.checkNotificationPermissions = () => {
  console.log('🔔 Checking notification permissions...');
  
  const result = {
    supported: 'Notification' in window,
    permission: window.Notification?.permission || 'not-supported',
    canRequest: window.Notification?.requestPermission !== undefined
  };
  
  console.table(result);
  
  if (result.permission === 'default' && result.canRequest) {
    console.log('🔔 Requesting notification permission...');
    window.Notification.requestPermission().then(permission => {
      console.log('🔔 Permission result:', permission);
    });
  }
  
  return result;
};

// Test complete call scenario
window.testCompleteCallScenario = async (adminEmail, employeeEmail) => {
  console.log('🧪 Testing Complete Call Scenario...');
  console.log('Admin:', adminEmail);
  console.log('Employee:', employeeEmail);
  
  // Step 1: Check WebSocket
  const wsTest = window.testWebSocketConnection();
  if (!wsTest.connected) {
    console.error('❌ WebSocket not connected - cannot proceed');
    return false;
  }
  
  // Step 2: Check notifications
  window.checkNotificationPermissions();
  
  // Step 3: Start monitoring
  window.startCallMonitoring();
  
  // Step 4: Send test call
  const callSent = window.testCallFlow(employeeEmail, adminEmail);
  
  if (callSent) {
    console.log('✅ Test call sent - check if admin receives notification');
    console.log('⏰ Waiting 5 seconds for response...');
    
    setTimeout(() => {
      console.log('🔍 Check browser console for call signal reception');
    }, 5000);
  }
  
  return callSent;
};

// Auto-start monitoring when script loads
if (typeof window !== 'undefined') {
  console.log('📞 Call debug utilities loaded');
  console.log('Available functions:');
  console.log('- window.testWebSocketConnection()');
  console.log('- window.testCallFlow(fromEmail, toEmail)');
  console.log('- window.startCallMonitoring()');
  console.log('- window.checkNotificationPermissions()');
  console.log('- window.testCompleteCallScenario(adminEmail, employeeEmail)');
}

export default {
  testWebSocketConnection: window.testWebSocketConnection,
  testCallFlow: window.testCallFlow,
  startCallMonitoring: window.startCallMonitoring,
  checkNotificationPermissions: window.checkNotificationPermissions,
  testCompleteCallScenario: window.testCompleteCallScenario
};