import { useState, useEffect } from 'react';

const WebSocketTest = ({ user }) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const checkConnection = () => {
      if (window.stompClient?.connected) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTestResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { 
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const testWebSocketConnection = () => {
    addTestResult('Testing WebSocket connection...', 'info');
    
    if (window.stompClient?.connected) {
      addTestResult('✅ WebSocket is connected', 'success');
      addTestResult(`Connected as: ${user?.email}`, 'info');
      
      // Check subscriptions
      if (window.stompClient.subscriptions) {
        const subs = Object.keys(window.stompClient.subscriptions);
        addTestResult(`Active subscriptions: ${subs.length}`, 'info');
        subs.forEach(sub => {
          addTestResult(`- ${sub}`, 'info');
        });
      }
    } else {
      addTestResult('❌ WebSocket is not connected', 'error');
      addTestResult('Please refresh the page and try again', 'warning');
    }
  };

  const testCallSignal = () => {
    addTestResult('Testing call signal...', 'info');
    
    if (!window.stompClient?.connected) {
      addTestResult('❌ Cannot test: WebSocket not connected', 'error');
      return;
    }

    try {
      const testSignal = {
        fromEmail: user?.email,
        toEmail: 'test@example.com',
        type: 'VIDEO',
        action: 'CALL',
        callId: `test_${Date.now()}`,
        timestamp: Date.now()
      };

      window.stompClient.publish({
        destination: "/app/call.signal",
        body: JSON.stringify(testSignal),
      });

      addTestResult('✅ Test call signal sent', 'success');
    } catch (error) {
      addTestResult(`❌ Failed to send test signal: ${error.message}`, 'error');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '15px', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>WebSocket Test Panel</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Status: </strong>
        <span style={{ 
          color: connectionStatus === 'connected' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {connectionStatus.toUpperCase()}
        </span>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={testWebSocketConnection} style={{ marginRight: '5px', fontSize: '11px' }}>
          Test Connection
        </button>
        <button onClick={testCallSignal} style={{ marginRight: '5px', fontSize: '11px' }}>
          Test Call Signal
        </button>
        <button onClick={clearResults} style={{ fontSize: '11px' }}>
          Clear
        </button>
      </div>

      <div style={{ 
        maxHeight: '300px', 
        overflow: 'auto', 
        border: '1px solid #eee', 
        padding: '5px',
        backgroundColor: '#f9f9f9'
      }}>
        {testResults.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Click "Test Connection" to start testing
          </div>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{ 
              marginBottom: '3px',
              color: result.type === 'error' ? 'red' : 
                     result.type === 'success' ? 'green' :
                     result.type === 'warning' ? 'orange' : 'black'
            }}>
              <span style={{ color: '#666' }}>[{result.timestamp}]</span> {result.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebSocketTest;