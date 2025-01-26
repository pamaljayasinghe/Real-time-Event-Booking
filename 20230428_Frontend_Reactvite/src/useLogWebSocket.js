import { useEffect, useCallback } from "react";

const WEBSOCKET_URL = "ws://localhost:8080/ws-logs";

const useLogWebSocket = (onMessageReceived) => {
  const connectWebSocket = useCallback(() => {
    let ws = null;
    try {
      ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        console.log("WebSocket Connected");
      };

      ws.onmessage = (event) => {
        console.log("WebSocket Message Received:", event.data);
        onMessageReceived(event.data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        // Attempt to reconnect after 2 seconds
        setTimeout(connectWebSocket, 2000);
      };
    } catch (error) {
      console.error("WebSocket Connection Error:", error);
      // Attempt to reconnect after 2 seconds
      setTimeout(connectWebSocket, 2000);
    }

    return ws;
  }, [onMessageReceived]);

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);
};

export default useLogWebSocket;
