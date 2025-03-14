
export type Play = {
	type: "play"
	chatId: string
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

export type SelectSong = {
	type: "selectSong"
	songId: string
	chatId: string
}

export type SetProgress = {
	type: "setProgress"
	chatId: string
	progress: number
}

export type MsgToServer = Play | Pause | Stop | JoinChat | SelectSong | SetProgress
export type MsgToClient = Play | Pause | Stop | SelectSong | SetProgress