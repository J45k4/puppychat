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
		console.log(`broadcasting ${msg.type} to ${this.clients.size} clients`)
		for (const ws of this.clients) {
			ws.send(JSON.stringify(msg))
		}
	}
	public addClient(client: WebSocket) {
		this.clients.add(client)
		console.log(`clients count ${this.clients.size}`)
	}

	public removeClient(client: WebSocket) {
		this.clients.delete(client)
		console.log(`clients count ${this.clients.size}`)
	}
}