import { buildDeliveryRealtimeUrl } from "./realtime-url";

const BASE_RECONNECT_MS = 1000;
const MAX_RECONNECT_MS = 10000;
const RECONNECT_BACKOFF_FACTOR = 2;

type RealtimeSocketOptions = {
  onMessage: (data: unknown) => void;
  onOpen?: () => void;
};

export function connectDeliveryRealtime({ onMessage, onOpen }: RealtimeSocketOptions) {
  let socket: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let retryCount = 0;
  let disposed = false;

  function clearRetry() {
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = null;
  }

  function closeSocket() {
    clearRetry();
    socket?.close();
    socket = null;
  }

  function scheduleReconnect() {
    if (disposed || document.visibilityState !== "visible") return;
    const delay = Math.min(
      BASE_RECONNECT_MS * RECONNECT_BACKOFF_FACTOR ** retryCount,
      MAX_RECONNECT_MS
    );
    retryCount += 1;
    retryTimer = setTimeout(connect, delay);
  }

  function connect() {
    clearRetry();
    if (document.visibilityState !== "visible") return;
    if (socket && socket.readyState <= WebSocket.OPEN) return;

    const url = buildDeliveryRealtimeUrl();
    if (!url) return;

    socket = new WebSocket(url);
    socket.onopen = () => {
      retryCount = 0;
      onOpen?.();
    };
    socket.onmessage = (event) => onMessage(event.data);
    socket.onclose = () => {
      socket = null;
      scheduleReconnect();
    };
    socket.onerror = () => socket?.close();
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") connect();
    else closeSocket();
  }

  connect();
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    disposed = true;
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    closeSocket();
  };
}
