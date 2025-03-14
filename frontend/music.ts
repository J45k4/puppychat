import { loaderIcon } from "./common";
import { chatIcon, nextIcon, pauseIcon, playIcon, prevIcon } from "./icons";
import { navigate } from "./router";
import { state } from "./state";
import { ws } from "./ws";

const musicListItem = (args: { id: string, title: string; duration: number, thumpnail: string }) => {
	const musicItem = document.createElement("div")
	musicItem.style.backgroundColor = "white"
	musicItem.style.display = "flex"
	musicItem.style.justifyContent = "space-between"
	musicItem.style.padding = "10px"
	musicItem.style.borderBottom = "1px solid #ccc"
	musicItem.style.cursor = "pointer"

	state.selectedSong.onChange(selectedSong => {
		if (selectedSong === args.title) {
			musicItem.style.backgroundColor = "lightgrey"
		} else {
			musicItem.style.backgroundColor = "white"
		}
	})

	const itemStatusContainer = document.createElement("div")

	musicItem.onclick = () => {
		let audio = state.currentAudio.get()
		if (audio) {
			audio.pause()
			state.currentAudio.set(null)
		}
		state.playing.set(false)
		state.selectedSong.set(args.title)
		const newAudio = new Audio(`./api/music/${args.id}`)
		newAudio.preload = "auto"
		const loader = loaderIcon({ width: 20, height: 20 })
		itemStatusContainer.innerHTML = loader.outerHTML
		newAudio.onloadedmetadata = () => {
			state.currentAudio.set(newAudio)
			const duration = document.createElement("div")
			duration.textContent = `${Math.floor(newAudio.duration / 60)}:${Math.floor(newAudio.duration % 60)}`
			itemStatusContainer.innerHTML = ""
			itemStatusContainer.appendChild(duration)
		}
		ws.send({ type: "play", songId: args.id, chatId: "1" })
	}

	const musicTitle = document.createElement("div")
	musicTitle.textContent = args.title

	const descriptionGroup = document.createElement("div")
	descriptionGroup.style.display = "flex"
	descriptionGroup.style.flexGrow = "1"
	const thumpnail = document.createElement("img")
	thumpnail.src = args.thumpnail
	thumpnail.style.width = "50px"
	thumpnail.style.height = "50px"
	descriptionGroup.append(thumpnail, musicTitle)
	musicItem.append(descriptionGroup, itemStatusContainer)
	return musicItem
}

const timelineControls = () => {
	const timelineContainer = document.createElement("div")
	timelineContainer.style.padding = "10px"
	timelineContainer.style.backgroundColor = "#fff"
	timelineContainer.style.display = "flex"

	const currentTime = document.createElement("span")
	currentTime.id = "currentTime"
	currentTime.textContent = "0:00"
	currentTime.style.marginRight = "10px"

	const progressSlider = document.createElement("input")
	progressSlider.id = "progressSlider"
	progressSlider.type = "range"
	progressSlider.min = "0"
	progressSlider.max = "100"
	progressSlider.value = "0"
	progressSlider.style.flexGrow = "1"

	const totalTime = document.createElement("span")
	totalTime.id = "totalTime"
	totalTime.textContent = ""
	totalTime.style.marginLeft = "10px"

	progressSlider.oninput = () => {
		const audio = state.currentAudio.get()
		if (!audio || !audio.duration) return
		const newTime = audio.duration * (Number(progressSlider.value) / 100)
		console.log("newTime", newTime)
		audio.currentTime = newTime
		audio.play()
	}

	state.currentAudio.onChange(audio => {
		if (!audio) return
		currentTime.textContent = "0:00"
		progressSlider.value = "0"
		if (!isNaN(audio.duration)) {
			totalTime.textContent = `${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60)}`
		}
		audio.ontimeupdate = () => {
			currentTime.textContent = `${Math.floor(audio.currentTime / 60)}:${Math.floor(audio.currentTime % 60)}`
			progressSlider.value = (audio.currentTime / audio.duration) * 100 + ""
		}
	})

	timelineContainer.append(currentTime, progressSlider, totalTime)
	return timelineContainer
}

const playControls = () => {
	const controlsContainer = document.createElement("div")
	controlsContainer.style.display = "flex"
	controlsContainer.style.padding = "10px"

	const currentSong = document.createElement("span")
	currentSong.textContent = ""

	const playPauseButton = document.createElement("button")
	playPauseButton.innerHTML = playIcon
	playPauseButton.onclick = () => {
		state.playing.set(!state.playing.get())
		const audio = state.currentAudio.get()
		if (!audio) return
		console.log("audio.currentTime", audio.currentTime)
		if (audio.paused) audio.play()
		else audio.pause()
	}
	state.playing.onChange(playing => {
		console.log("playing", playing)
		if (playing) {
			playPauseButton.innerHTML = pauseIcon
		} else {
			playPauseButton.innerHTML = playIcon
		}
	})

	controlsContainer.append(currentSong, playPauseButton)
	return controlsContainer
}

function debounce(func: any, delay: any) {
	let timeoutId: any;
	return (...args: any[]) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

export const musicView = async (root: HTMLElement) => {
	root.innerHTML = ""

	// Main container for the search input and song list
	const container = document.createElement("div")
	container.style.width = "100%"
	container.style.height = "100%"
	container.style.backgroundColor = "white"
	container.style.display = "flex"
	container.style.flexDirection = "column"
	container.style.transition = "transform 0.3s ease"

	const chatButton = document.createElement("button")
	chatButton.innerHTML = chatIcon
	chatButton.style.height = "40px"
	chatButton.style.width = "40px"
	chatButton.onclick = () => {
		navigate("/")
	}

	const musicList = document.createElement("div")

	// musicList.appendChild(
	// 	musicListItem({ id: "123456", title: "Song 1", duration: 180 })
	// )

	const searchInput = document.createElement("input")
	searchInput.style.borderRadius = "10px"
	searchInput.style.padding = "10px"
	searchInput.style.border = "1px solid #ccc"
	searchInput.placeholder = "Search for music"
	searchInput.style.flexGrow = "1"
	searchInput.oninput = debounce(async () => {
		musicList.innerHTML = ""
		const results = await fetch("/api/search?query=" + searchInput.value)
			.then(res => res.json())

		for (const result of results) {
			musicList.appendChild(musicListItem({
				id: result.id,
				title: result.title,
				duration: 0,
				thumpnail: result.thumbnail
			}))
		}
	}, 300)

	const inputContainer = document.createElement("div")
	inputContainer.style.display = "flex"
	inputContainer.style.flexDirection = "row"
	inputContainer.style.gap = "10px"
	inputContainer.style.margin = "5px"
	inputContainer.append(chatButton, searchInput)

	// const songs = await fetch("/api/songs").then(res => res.json())


	// for (const song of songs) {
	// 	musicList.appendChild(musicListItem({ title: song, duration: 180 }))
	// }

	const musicListContainer = document.createElement("div")
	musicListContainer.style.flexGrow = "1"
	musicListContainer.style.overflowY = "auto"
	musicListContainer.appendChild(musicList)

	container.append(inputContainer, musicListContainer)
	root.appendChild(container)

	const controlsArea = document.createElement("div")
	controlsArea.style.display = "flex"
	controlsArea.style.flexDirection = "row"
	controlsArea.style.position = "fixed"
	controlsArea.style.bottom = "0"
	controlsArea.style.left = "0"
	controlsArea.style.right = "0"
	controlsArea.style.backgroundColor = "white"
	controlsArea.style.borderTop = "1px solid #ccc"
	controlsArea.style.padding = "10px"
	root.appendChild(controlsArea)

	state.currentAudio.onChange(selectedSong => {
		if (!selectedSong) {
			controlsArea.innerHTML = ""
			return
		}
		controlsArea.innerHTML = ""
		const timeline = timelineControls()
		timeline.style.flexGrow = "1"
		controlsArea.appendChild(timeline)
		controlsArea.appendChild(playControls())
	})
	// root.appendChild(loaderIcon())
	// root.appendChild(timelineControls())
	// root.appendChild(playControls())
}