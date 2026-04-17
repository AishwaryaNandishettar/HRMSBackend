import React, { useState } from "react";

/**
 * Debug Login Page
 * Use this to test your API connection and login flow
 * Access at: /debug-login
 */
const DebugLogin = () => {
  const [email, setEmail] = useState("aishwarya@company.com");
  const [password, setPassword] = useState("password123");
  const [logs, setLogs] = useState([]);
  const [response, setResponse] = useState(null);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, message, type }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const testEnvironmentVariables = () => {
    addLog("=== Testing Environment Variables ===", "info");
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const turnUsername = import.meta.env.VITE_TURN_USERNAME;
    const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;

    addLog(`VITE_API_BASE_URL: ${apiBaseUrl || "❌ NOT SET"}`, apiBaseUrl ? "success" : "error");
    addLog(`VITE_TURN_USERNAME: ${turnUsername ? "✅ SET" : "❌ NOT SET"}`, turnUsername ? "success" : "error");
    addLog(`VITE_TURN_CREDENTIAL: ${turnCredential ? "✅ SET" : "❌ NOT SET"}`, turnCredential ? "success" : "error");

    if (!apiBaseUrl) {
      addLog("⚠️ API Base URL is not configured!", "error");
      addLog("Make sure you set VITE_API_BASE_URL in Vercel Dashboard", "error");
    }
  };

  const testBackendConnection = async () => {
    addLog("=== Testing Backend Connection ===", "info");
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (!apiBaseUrl) {
      addLog("❌ Cannot test - API Base URL not configured", "error");
      return;
    }

    try {
      addLog(`Attempting to connect to: ${apiBaseUrl}`, "info");
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "OPTIONS",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      addLog(`✅ Backend is reachable (Status: ${response.status})`, "success");
      addLog(`CORS headers present: ${response.headers.get("access-control-allow-origin") ? "✅ Yes" : "❌ No"}`, 
        response.headers.get("access-control-allow-origin") ? "success" : "warning");
      
    } catch (error) {
      if (error.name === "AbortError") {
        addLog("❌ Connection timeout - Backend not responding", "error");
      } else {
        addLog(`❌ Connection failed: ${error.message}`, "error");
      }
      addLog("Possible issues:", "warning");
      addLog("  1. Backend is not running", "warning");
      addLog("  2. ngrok URL has expired", "warning");
      addLog("  3. CORS is blocking the request", "warning");
      addLog("  4. Network/firewall issue", "warning");
    }
  };

  const testLogin = async () => {
    addLog("=== Testing Login ===", "info");
    setResponse(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!apiBaseUrl) {
      addLog("❌ Cannot login - API Base URL not configured", "error");
      return;
    }

    if (!email || !password) {
      addLog("❌ Email and password are required", "error");
      return;
    }

    try {
      addLog(`Sending login request to: ${apiBaseUrl}/api/auth/login`, "info");
      addLog(`Email: ${email}`, "info");
      addLog(`Password: ${"*".repeat(password.length)}`, "info");

      const startTime = Date.now();

      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const duration = Date.now() - startTime;
      addLog(`Response received in ${duration}ms`, "info");
      addLog(`Status: ${res.status} ${res.statusText}`, res.ok ? "success" : "error");

      const contentType = res.headers.get("content-type");
      addLog(`Content-Type: ${contentType}`, "info");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({ status: res.status, data });

      if (res.ok) {
        addLog("✅ Login successful!", "success");
        addLog(`Response data: ${JSON.stringify(data, null, 2)}`, "success");
        
        // Check if token is present
        if (data.token) {
          addLog("✅ Token received", "success");
          addLog(`Token: ${data.token.substring(0, 20)}...`, "info");
        } else {
          addLog("⚠️ No token in response", "warning");
        }

        // Check user data
        if (data.email) addLog(`✅ Email: ${data.email}`, "success");
        if (data.name) addLog(`✅ Name: ${data.name}`, "success");
        if (data.role) addLog(`✅ Role: ${data.role}`, "success");
        if (data.empId) addLog(`✅ Employee ID: ${data.empId}`, "success");

      } else {
        addLog(`❌ Login failed: ${typeof data === 'string' ? data : JSON.stringify(data)}`, "error");
      }

    } catch (error) {
      addLog(`❌ Request failed: ${error.message}`, "error");
      
      if (error.message.includes("Failed to fetch")) {
        addLog("This usually means:", "warning");
        addLog("  1. Backend is not running", "warning");
        addLog("  2. CORS is blocking the request", "warning");
        addLog("  3. Network error", "warning");
      }
    }
  };

  const testLocalStorage = () => {
    addLog("=== Testing LocalStorage ===", "info");
    
    const token = localStorage.getItem("token");
    const loggedUser = localStorage.getItem("loggedUser");
    const role = localStorage.getItem("role");

    addLog(`Token: ${token ? "✅ Present" : "❌ Not found"}`, token ? "success" : "warning");
    addLog(`Logged User: ${loggedUser ? "✅ Present" : "❌ Not found"}`, loggedUser ? "success" : "warning");
    addLog(`Role: ${role ? "✅ Present" : "❌ Not found"}`, role ? "success" : "warning");

    if (loggedUser) {
      try {
        const parsed = JSON.parse(loggedUser);
        addLog(`User data: ${JSON.stringify(parsed, null, 2)}`, "info");
      } catch (e) {
        addLog("❌ Failed to parse user data", "error");
      }
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setResponse(null);
  };

  const runAllTests = async () => {
    clearLogs();
    testEnvironmentVariables();
    await testBackendConnection();
    testLocalStorage();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🔍 HRMS Login Debug Tool</h1>
        <p>Use this page to diagnose login issues</p>
      </div>

      <div style={styles.section}>
        <h2>Test Credentials</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={runAllTests} style={styles.button}>
          🔍 Run All Tests
        </button>
        <button onClick={testEnvironmentVariables} style={styles.button}>
          🔧 Test Env Variables
        </button>
        <button onClick={testBackendConnection} style={styles.button}>
          🌐 Test Backend Connection
        </button>
        <button onClick={testLogin} style={styles.button}>
          🔐 Test Login
        </button>
        <button onClick={testLocalStorage} style={styles.button}>
          💾 Check LocalStorage
        </button>
        <button onClick={clearLogs} style={{ ...styles.button, ...styles.clearButton }}>
          🗑️ Clear Logs
        </button>
      </div>

      {response && (
        <div style={styles.responseSection}>
          <h3>Response Data:</h3>
          <pre style={styles.pre}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div style={styles.logsSection}>
        <h3>Logs:</h3>
        <div style={styles.logs}>
          {logs.length === 0 ? (
            <p style={styles.noLogs}>No logs yet. Click a test button to start.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={getLogStyle(log.type)}>
                <span style={styles.timestamp}>[{log.timestamp}]</span>
                <span style={styles.logMessage}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <p>💡 Tip: Open browser DevTools (F12) → Console tab for more details</p>
      </div>
    </div>
  );
};

const getLogStyle = (type) => {
  const baseStyle = { ...styles.logEntry };
  
  switch (type) {
    case "success":
      return { ...baseStyle, color: "#10b981" };
    case "error":
      return { ...baseStyle, color: "#ef4444" };
    case "warning":
      return { ...baseStyle, color: "#f59e0b" };
    default:
      return { ...baseStyle, color: "#6b7280" };
  }
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "monospace",
    backgroundColor: "#1f2937",
    minHeight: "100vh",
    color: "#f3f4f6",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#374151",
    borderRadius: "8px",
  },
  section: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#374151",
    borderRadius: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #4b5563",
    backgroundColor: "#1f2937",
    color: "#f3f4f6",
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "14px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  clearButton: {
    backgroundColor: "#ef4444",
  },
  responseSection: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#374151",
    borderRadius: "8px",
  },
  pre: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "4px",
    overflow: "auto",
    fontSize: "12px",
    border: "1px solid #4b5563",
  },
  logsSection: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#374151",
    borderRadius: "8px",
  },
  logs: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "4px",
    maxHeight: "400px",
    overflow: "auto",
    fontSize: "12px",
    border: "1px solid #4b5563",
  },
  noLogs: {
    color: "#9ca3af",
    textAlign: "center",
    padding: "20px",
  },
  logEntry: {
    padding: "5px 0",
    borderBottom: "1px solid #374151",
  },
  timestamp: {
    color: "#9ca3af",
    marginRight: "10px",
  },
  logMessage: {
    fontFamily: "monospace",
  },
  footer: {
    textAlign: "center",
    padding: "20px",
    color: "#9ca3af",
  },
};

export default DebugLogin;
