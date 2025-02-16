
const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

let socket: WebSocket | null = null;

export function getWebSocket(): WebSocket | null {
   
  if (typeof window === "undefined") {
    console.error("WebSocket is not available on the server.");
    return null;
  }
 
  if (!socket) {
    socket = new WebSocket(WS_URL);
    socket.onopen = () => {
      console.log("WebSocket connected to:", WS_URL);
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      socket = null;
    };
  }
  return socket;
}