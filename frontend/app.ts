import { chatView } from "./chat"
import { musicPlayerControls, musicView } from "./music"
import { initNotifications, notify } from "./notifications"
import { routes } from "./router"
import { state } from "./state"
import { ws } from "./ws"

function urlBase64ToUint8Array(base64String: string) {
	return btoa(base64String)
}

window.onload = () => {
	const body = document.body
	if (!body) return

	ws.onConnected(() => {
		ws.send({ type: "joinChat", chatId: "1" })
	})

	initNotifications()

	ws.onMsg(msg => {
		if (msg.type !== "setProgress") notify(JSON.stringify(msg))
		console.log("received", msg)
		
		switch (msg.type) {
			case "play": 
				console.log("play")
				notify("play")
				state.playing.set(true)
				break
			case "pause": 
				console.log("pause")
				notify("pause")
				state.playing.set(false)
				break
			case "selectSong": {
				const audio = new Audio(`/api/music/${msg.songId}`)
				audio.onloadedmetadata = () => {
					console.log("metadata loaded for selected song")
					state.currentAudio.set(audio)
				}
				break
			}
			case "setProgress": {
				state.progress.set(msg.progress)
				break
			}
		}
	})

	state.playing.onChange(playing => {
		const audio = state.currentAudio.get()
		if (!audio) return
		notify(`playing: ${playing}`)
		if (playing) audio.play()
		else audio.pause()
	})

	state.progress.onChange(progress => {
		const audio = state.currentAudio.get()
		if (!audio) return
		audio.currentTime = progress
	})

	const pageContent = document.createElement("div")
	body.appendChild(pageContent)
	const controls = musicPlayerControls()
	body.appendChild(controls)

	routes({
		"/music": () => musicView(pageContent),
		"/": () => chatView(pageContent)
	})
}