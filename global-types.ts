
export type Play = {
	type: "play"
	chatId: string
	songId: string
}

export type Pause = {
	type: "pause"
	chatId: string
}

export type Resume = {
	type: "resume"
	chatId: string
}

export type Stop = {
	type: "stop"
	chatId: string
}

export type JoinChat = {
	type: "joinChat"
	chatId: string
}

export type MsgToServer = Play | Pause | Stop | JoinChat
export type MsgToClient = Play | Pause | Stop