import { navigate } from "./router"

export const chatView = (root: HTMLElement) => {
	root.innerHTML = ""
	const container = document.createElement("div")
	container.className = "container"
	const header = document.createElement("div")
	header.className = "header"
	header.style.display = "flex"
	const headerText = document.createElement("h1")
	headerText.innerHTML = "🐶 PuppyChat"
	const musicButton = document.createElement("button")
	musicButton.innerHTML = "🎶"
	musicButton.style.height = "40px"
	musicButton.style.width = "40px"
	musicButton.onclick = () => {
		navigate("/music")
	}
	header.append(headerText, musicButton)
	// header.innerHTML = "🐶 PuppyChat <button>🎶</button>"
	container.appendChild(header)

	const messagesBox = document.createElement("div")
	messagesBox.className = "chat-box"
	container.appendChild(messagesBox)

	const inputBox = document.createElement("div")
	inputBox.className = "input-box"
	const chatInput = document.createElement("input")
	chatInput.style.borderTopRightRadius = "0"
	chatInput.style.borderBottomRightRadius = "0"
	const button = document.createElement("button")
	button.innerHTML = "Send"
	// button.className = "send-button"
	button.style.borderTopLeftRadius = "0"
	button.style.borderBottomLeftRadius = "0"
	inputBox.append(chatInput, button)
	container.appendChild(inputBox)
	
	root.appendChild(container)
}