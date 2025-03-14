import { Chatroom } from "./chat"

export class Context {
	chatrooms: Map<string, Chatroom>

	constructor(args: {
		chatrooms: Map<string, Chatroom>
	}) {
		this.chatrooms = args.chatrooms
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