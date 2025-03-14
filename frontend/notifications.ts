
const notificationsBox = document.createElement("div")
notificationsBox.style.position = "fixed"
notificationsBox.style.top = "0"
notificationsBox.style.right = "0"
notificationsBox.style.backgroundColor = "white"
notificationsBox.style.maxHeight = "40vh"

export const initNotifications = () => {
	document.body.appendChild(notificationsBox)
}

export const notify = (msg: string) => {
	const note = document.createElement("div")
	note.textContent = msg
	notificationsBox.appendChild(note)
	setTimeout(() => {
		notificationsBox.removeChild(note)
	}, 3000)
}