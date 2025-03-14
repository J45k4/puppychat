import type { MsgToServer } from "../global-types";
import type { Context } from "./types";

export const handleMsg = (msg: MsgToServer, ws: WebSocket, ctx: Context) => {
	console.log("handleMsg", msg)
	
	switch (msg.type) {
		case "joinChat":
			ctx.getChatroom(msg.chatId).addClient(ws)
			break
		case "play":
			ctx.getChatroom(msg.chatId).broadcast(msg)
			break
		case "pause":
			ctx.getChatroom(msg.chatId).broadcast(msg)
			break
		case "stop":
			ctx.getChatroom(msg.chatId).broadcast(msg)
			break
	}
}