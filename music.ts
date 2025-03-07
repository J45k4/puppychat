import { chatIcon, nextIcon, pauseIcon, playIcon, prevIcon } from "./icons";
import { navigate } from "./router";

const musicListItem = (args: { title: string; duration: number }) => {
	const musicItem = document.createElement("div")
	musicItem.style.display = "flex"
	musicItem.style.justifyContent = "space-between"
	musicItem.style.padding = "10px"
	musicItem.style.borderBottom = "1px solid #ccc"
	musicItem.style.cursor = "pointer"

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
	totalTime.textContent = "3:00"
	totalTime.style.marginLeft = "10px"

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

	const audio = new Audio("./music/30_years_old_cat.mp3")

	audio.ontimeupdate = () => {
		const currentTime = document.querySelector("#currentTime") as HTMLSpanElement
		currentTime.textContent = Math.floor(audio.currentTime / 60) + ":" + ("0" + Math.floor(audio.currentTime % 60)).slice(-2)
		const progressSlider = document.querySelector("#progressSlider") as HTMLInputElement
		progressSlider.value = (audio.currentTime / audio.duration * 100).toString()
		const totalTime = document.querySelector("#totalTime") as HTMLSpanElement
		totalTime.textContent = Math.floor(audio.duration / 60) + ":" + ("0" + Math.floor(audio.duration % 60)).slice(-2)
	}

	const prevButton = document.createElement("button")
	prevButton.innerHTML = prevIcon

	const playPauseButton = document.createElement("button")
	playPauseButton.innerHTML = playIcon
	playPauseButton.onclick = () => {
		if (audio.paused) {
			audio.play()
			playPauseButton.innerHTML = playIcon
		} else {
			audio.pause()
			playPauseButton.innerHTML = pauseIcon
		}
	}

	const nextButton = document.createElement("button")
	nextButton.innerHTML = nextIcon

	controlsContainer.append(prevButton, playPauseButton, nextButton)
	return controlsContainer
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
	// container.style.height = "100vh"
	container.style.transition = "transform 0.3s ease"

	// Arrow down button to hide the container
	// const hideButton = document.createElement("button")
	// hideButton.style.border = "none"
	// hideButton.style.background = "transparent"
	// hideButton.style.padding = "10px"
	// hideButton.style.width = "100%"
	// hideButton.style.display = "flex"
	// hideButton.style.justifyContent = "center"
	// hideButton.innerHTML = `
	//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" 
	// 	stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	// 	<polyline points="6 9 12 15 18 9"></polyline>
	//   </svg>
	// `
	// hideButton.addEventListener("click", () => {
	// 	container.style.transform = "translateY(100vh)"
	// })

	const chatButton = document.createElement("button")
	chatButton.innerHTML = chatIcon
	chatButton.style.height = "40px"
	chatButton.style.width = "40px"
	chatButton.onclick = () => {
		navigate("/")
	}

	const searchInput = document.createElement("input")
	searchInput.style.borderRadius = "10px"
	searchInput.style.padding = "10px"
	searchInput.style.border = "1px solid #ccc"
	searchInput.placeholder = "Search for music"

	const songs = await fetch("/api/songs").then(res => res.json())

	const musicList = document.createElement("div")
	for (const song of songs) {
		musicList.appendChild(musicListItem({ title: song, duration: 180 }))
	}

	const musicListContainer = document.createElement("div")
	musicListContainer.style.flexGrow = "1"
	musicListContainer.style.overflowY = "auto"
	musicListContainer.appendChild(musicList)

	container.append(chatButton, searchInput, musicListContainer)
	root.appendChild(container)
	root.appendChild(timelineControls())
	root.appendChild(playControls())
}