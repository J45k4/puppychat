import { chatIcon, nextIcon, pauseIcon, playIcon, prevIcon } from "./icons";
import { navigate } from "./router";
import { state } from "./state";

const musicListItem = (args: { id: string, title: string; duration: number }) => {
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

	musicItem.onclick = () => {
		let audio = state.currentAudio.get()
		if (audio) {
			audio.pause()
		}
		state.playing.set(false)
		state.selectedSong.set(args.title)
		const newAudio = new Audio(`./api/music/${args.id}`)
		newAudio.preload = "auto"
		newAudio.onloadedmetadata = () => {
			state.currentAudio.set(newAudio)
		}
	}

	const musicTitle = document.createElement("div")
	musicTitle.textContent = args.title

	const musicDuration = document.createElement("div")
	musicDuration.textContent = args.duration + "s"

	musicItem.append(musicTitle, musicDuration)
	return musicItem
}

const timelineControls = () => {
	const timelineContainer = document.createElement("div")
	timelineContainer.style.position = "fixed"
	timelineContainer.style.bottom = "40px"
	timelineContainer.style.left = "0"
	timelineContainer.style.right = "0"
	timelineContainer.style.padding = "10px"
	timelineContainer.style.backgroundColor = "#fff"
	timelineContainer.style.borderTop = "1px solid #ccc"
	timelineContainer.style.display = "flex"
	timelineContainer.style.alignItems = "center"

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
	controlsContainer.style.position = "fixed"
	controlsContainer.style.bottom = "0"
	controlsContainer.style.left = "0"
	controlsContainer.style.right = "0"
	controlsContainer.style.backgroundColor = "#fff"
	controlsContainer.style.borderTop = "1px solid #ccc"
	controlsContainer.style.display = "flex"
	controlsContainer.style.justifyContent = "space-around"
	controlsContainer.style.alignItems = "center"
	controlsContainer.style.padding = "10px"

	const currentSong = document.createElement("span")
	currentSong.textContent = ""
	// state.selectedSong.onChange(selectedSong => {
	// 	currentSong.textContent = selectedSong || ""
	// 	const audio = new Audio(`./music/${selectedSong}`)
	// 	audio.preload = "auto"
	// 	audio.onloadedmetadata = () => {
	// 		console.log("audio metdata loaded", audio.duration)
	// 		state.currentAudio.set(audio)
	// 	}
	// })

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

function debounce(func, delay) {
	let timeoutId;
	return (...args) => {
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
				duration: 0
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
	root.appendChild(timelineControls())
	root.appendChild(playControls())
}