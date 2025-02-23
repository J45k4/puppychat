
function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for(let i = 0; i < rawData.length; i++){
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}


window.onload = () => {
	const chatForm = document.getElementById("chatForm")
	if (!chatForm) return
	chatForm.addEventListener("submit", e => {
		e.preventDefault()
		const chatInput = document.getElementById("chatInput") as HTMLInputElement
		if (!chatInput) return
		const message = chatInput.value
		fetch("/chat", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({message: message})
		}).then(() => {
			chatInput.value = ""
		})
	})
	console.log("fetch /vapidPublicKey")

	Notification.requestPermission().then(permission => {
		if(permission === "granted") {
			new Notification("Notifications enabled")
			fetch("/vapidPublicKey").then(res => res.text()).then(publicKey => {
				navigator.serviceWorker.register("sw.js").then(reg => {
					reg.pushManager.getSubscription().then(sub => {
						if(sub)return sub
						return reg.pushManager.subscribe({
							userVisibleOnly: true,
							applicationServerKey: urlBase64ToUint8Array(publicKey)
						})
					}).then(sub => {
						fetch("/subscribe", {
							method: "POST",
							headers: {"Content-Type": "application/json"},
							body: JSON.stringify(sub)
						})
					})
				})
			})
		}
	})
}