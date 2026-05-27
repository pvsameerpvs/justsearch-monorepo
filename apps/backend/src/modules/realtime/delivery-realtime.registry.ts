import { WebSocket } from 'ws';
import type { DriverRealtimeMessage } from './delivery-realtime.types';

const driverSockets = new Map<string, Set<WebSocket>>();

function getDriverKey(schemaName: string, driverId: string): string {
  return `${schemaName}:${driverId}`;
}

function removeSocket(key: string, socket: WebSocket) {
  const sockets = driverSockets.get(key);
  if (!sockets) return;
  sockets.delete(socket);
  if (sockets.size === 0) driverSockets.delete(key);
}

export function addDriverSocket(
  schemaName: string,
  driverId: string,
  socket: WebSocket
) {
  const key = getDriverKey(schemaName, driverId);
  const sockets = driverSockets.get(key) ?? new Set<WebSocket>();
  sockets.add(socket);
  driverSockets.set(key, sockets);

  const cleanup = () => removeSocket(key, socket);
  socket.on('close', cleanup);
  socket.on('error', cleanup);
}

export function broadcastDriverMessage(
  schemaName: string,
  driverId: string,
  message: DriverRealtimeMessage
): number {
  const sockets = driverSockets.get(getDriverKey(schemaName, driverId));
  if (!sockets) return 0;

  const payload = JSON.stringify(message);
  let sent = 0;

  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
      sent += 1;
    }
  }

  return sent;
}
