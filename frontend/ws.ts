import type { MsgToServer } from "../global-types";

let websocket: WebSocket
const onConnectedListeners: (() => void)[] = []
const onMsgListeners = new Set<(msg: MsgToServer) => void>()

const connect = () => {
	const ws = location.protocol === "https:" ? "wss" : "ws"
	const domain = location.hostname
	const port = location.port
	const url = `${ws}://${domain}:${port}/ws`
	console.log("connecting to", url)
	websocket = new WebSocket(url)
	websocket.onopen = () => {
		console.log("connected")
		onConnectedListeners.forEach(listener => listener())
	}
	websocket.onmessage = (event) => {
		const msg = JSON.parse(event.data)
		onMsgListeners.forEach(listener => listener(msg))
	}
	websocket.onclose = () => {
		console.log("disconnected")
		setTimeout(connect, 2000)
	}
}

connect()

export const ws = {
	send: (msg: MsgToServer) => {
		websocket.send(JSON.stringify(msg))
	},
	onConnected: (cb: () => void) => {
		onConnectedListeners.push(cb)
	},
	onMsg: (cb: (msg: MsgToServer) => void) => {
		onMsgListeners.add(cb)
		return () => onMsgListeners.delete(cb)
	}
}