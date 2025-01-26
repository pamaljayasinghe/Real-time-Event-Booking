import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useLogWebSocket from "./useLogWebSocket";
import { useTicketSystem } from "./useTicketSystem";
import "./App.css";

const App = () => {
  const {
    systemStatus,
    startSystem,
    stopSystem,
    addVendor,
    removeVendor,
    addCustomer,
    removeCustomer,
  } = useTicketSystem();

  const [config, setConfig] = useState({
    vendors: 5,
    customers: 3,
    totalTickets: 107,
    ticketReleaseRate: 4,
    ticketPurchaseRate: 3,
    maxTicketTotal: 150,
  });

  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [analyticsData, setAnalyticsData] = useState([
    { time: "60s", tickets: 0 },
    { time: "50s", tickets: 0 },
    { time: "40s", tickets: 0 },
    { time: "30s", tickets: 0 },
    { time: "20s", tickets: 0 },
    { time: "10s", tickets: 0 },
    { time: "Now", tickets: 0 },
  ]);

  // WebSocket log handler
  const handleLogMessage = useCallback((message) => {
    console.log("Received log message:", message);
    setLogs((prevLogs) => [message, ...prevLogs.slice(0, 99)]);
  }, []);

  useLogWebSocket(handleLogMessage);

  const handleVendorChange = async (operation) => {
    setIsLoading(true);
    try {
      if (operation === "+") {
        await addVendor();
      } else {
        await removeVendor();
      }
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerChange = async (operation) => {
    setIsLoading(true);
    try {
      if (operation === "+") {
        await addCustomer();
      } else {
        await removeCustomer();
      }
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigSubmit = async () => {
    setIsLoading(true);
    try {
      await startSystem({
        maxTickets: config.maxTicketTotal,
        releaseRate: config.ticketReleaseRate,
        purchaseRate: config.ticketPurchaseRate,
        vendors: config.vendors,
        customers: config.customers,
      });
      setNotification("Configuration applied successfully");
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSystem = async () => {
    setIsLoading(true);
    try {
      if (systemStatus.running) {
        await stopSystem();
      } else {
        await handleConfigSubmit();
      }
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (systemStatus.running) {
      setAnalyticsData((prevData) => {
        const newData = prevData.slice(1);
        return [
          ...newData,
          {
            time: "Now",
            tickets: systemStatus.currentTickets,
          },
        ].map((item, index) => ({
          ...item,
          time: index === 6 ? "Now" : `${(6 - index) * 10}s`,
        }));
      });
    }
  }, [systemStatus.currentTickets, systemStatus.running]);

  return (
    <div className="app">
      {notification && (
        <div className="notification success">{notification}</div>
      )}

      <header className="header">
        <h1>TICKETING SYSTEM</h1>
        <div className="system-controls">
          <button
            className={`control-button ${
              systemStatus.running ? "stop" : "start"
            }`}
            onClick={toggleSystem}
            disabled={isLoading}
          >
            {systemStatus.running ? "Stop" : "Start"}
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="grid-container">
          {/* Vendors Section */}
          <div className="card">
            <h2>VENDORS</h2>
            <div className="counter-controls">
              <button
                onClick={() => handleVendorChange("-")}
                disabled={!systemStatus.running || isLoading}
              >
                -
              </button>
              <input type="text" value={systemStatus.vendors} readOnly />
              <button
                onClick={() => handleVendorChange("+")}
                disabled={!systemStatus.running || isLoading}
              >
                +
              </button>
            </div>
          </div>

          {/* Customers Section */}
          <div className="card">
            <h2>CUSTOMERS</h2>
            <div className="counter-controls">
              <button
                onClick={() => handleCustomerChange("-")}
                disabled={!systemStatus.running || isLoading}
              >
                -
              </button>
              <input type="text" value={systemStatus.customers} readOnly />
              <button
                onClick={() => handleCustomerChange("+")}
                disabled={!systemStatus.running || isLoading}
              >
                +
              </button>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="card">
            <h2>CONFIGURATION</h2>
            <div className="config-form">
              <div className="form-group">
                <label>Total Ticket Count:</label>
                <input
                  type="number"
                  value={config.totalTickets}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      totalTickets: parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={systemStatus.running}
                />
              </div>
              <div className="form-group">
                <label>Ticket Release Rate:</label>
                <input
                  type="number"
                  value={config.ticketReleaseRate}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ticketReleaseRate: parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={systemStatus.running}
                />
              </div>
              <div className="form-group">
                <label>Ticket Purchase Rate:</label>
                <input
                  type="number"
                  value={config.ticketPurchaseRate}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ticketPurchaseRate: parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={systemStatus.running}
                />
              </div>
              <div className="form-group">
                <label>Max Ticket Total:</label>
                <input
                  type="number"
                  value={config.maxTicketTotal}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      maxTicketTotal: parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={systemStatus.running}
                />
              </div>
              <button
                className="submit-button"
                onClick={handleConfigSubmit}
                disabled={systemStatus.running || isLoading}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Ticket Pool Progress */}
        <div className="card progress-card">
          <h2>TICKET POOL PROGRESS</h2>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${
                  (systemStatus.currentTickets / systemStatus.maxTickets) * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="progress-text">
            {systemStatus.currentTickets} / {systemStatus.maxTickets} tickets
          </div>
        </div>

        {/* Real-time Analytics Chart */}
        <div className="card analytics-card">
          <h2>REAL-TIME ANALYTICS</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="time" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Bar
                  dataKey="tickets"
                  fill="#0066ff"
                  name="Tickets"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Logs */}
        <div className="card logs-card">
          <h2>SYSTEM LOGS</h2>
          <div className="logs-container">
            {logs.length === 0 ? (
              <div className="log-entry">No logs available...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
