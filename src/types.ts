import { Chatroom } from "./chat"

export class Context {
	chatrooms: Map<string, Chatroom>

	constructor() {
		this.chatrooms = new Map<string, Chatroom>();
	}

	getChatroom(chatId: string) {
		let chatroom = this.chatrooms.get(chatId)
		if (!chatroom) {
			chatroom = new Chatroom()
			this.chatrooms.set(chatId, chatroom)
		}
		return chatroom
	}
}