import type { MsgToClient } from "../global-types";

export class Client {
	ws: WebSocket

	public constructor(ws: WebSocket) {
		this.ws = ws
	}
}

export class Chatroom {
	private clients: Set<WebSocket> = new Set()

	public broadcast(msg: MsgToClient) {
		for (const ws of this.clients) {
			ws.send(JSON.stringify(msg))
		}
	}
	public addClient(client: WebSocket) {
		this.clients.add(client)
	}
}