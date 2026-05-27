import type { Server } from 'http';
import type { Duplex } from 'stream';
import { WebSocketServer } from 'ws';
import { authenticateDeliverySocket } from './delivery-realtime.auth';
import { addDriverSocket } from './delivery-realtime.registry';

const DELIVERY_SOCKET_PATH = '/ws/delivery';

function getUpgradePath(reqUrl: string | undefined, host: string | undefined) {
  return new URL(reqUrl || '/', `http://${host || 'localhost'}`).pathname;
}

function rejectUpgrade(socket: Duplex) {
  socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  socket.destroy();
}

export function attachDeliveryRealtimeServer(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', async (req, socket, head) => {
    if (getUpgradePath(req.url, req.headers.host) !== DELIVERY_SOCKET_PATH) return;

    const context = await authenticateDeliverySocket(req).catch(() => null);
    if (!context) {
      rejectUpgrade(socket);
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      addDriverSocket(context.schemaName, context.driverId, ws);
      ws.send(JSON.stringify({ type: 'CONNECTED' }));
    });
  });
}
