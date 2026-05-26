import type WebSocket from "ws";

const clients = new Set<WebSocket>();

export function addClient(client: WebSocket) {
  clients.add(client);
}

export function removeClient(client: WebSocket) {
  clients.delete(client);
}

export function broadcast(data: unknown) {
  const message = JSON.stringify(data);

  for (const client of clients) {
    try {
      client.send(message);
    } catch {}
  }
}