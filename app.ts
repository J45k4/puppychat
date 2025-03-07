import { chatView } from "./chat"
import { musicView } from "./music"
import { routes } from "./router"

function urlBase64ToUint8Array(base64String: string) {
	return btoa(base64String)
    // const padding = "=".repeat((4 - base64String.length % 4) % 4)
    // const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    // const rawData = atob(base64)
	// return rawData
    // const outputArray = new Uint8Array(rawData.length)
    // for(let i = 0; i < rawData.length; i++){
    //     outputArray[i] = rawData.charCodeAt(i)
    // }
    // return outputArray
}


window.onload = () => {
	const body = document.body
	if (!body) return

	routes({
		"/music": () => musicView(body),
		"/": () => chatView(body)
	})

	// const chatForm = document.getElementById("chatForm")
	// if (!chatForm) return
	// chatForm.addEventListener("submit", e => {
	// 	e.preventDefault()
	// 	const chatInput = document.getElementById("chatInput") as HTMLInputElement
	// 	if (!chatInput) return
	// 	const message = chatInput.value
	// 	fetch("/chat", {
	// 		method: "POST",
	// 		headers: {"Content-Type": "application/json"},
	// 		body: JSON.stringify({message: message})
	// 	}).then(() => {
	// 		chatInput.value = ""
	// 	})
	// })
	// console.log("fetch /vapidPublicKey")

	// Notification.requestPermission().then(permission => {
	// 	if(permission === "granted") {
	// 		new Notification("Notifications enabled")
	// 		fetch("/vapidPublicKey").then(res => res.text()).then(publicKey => {
	// 			console.log("received vapidPublicKey", publicKey)
	// 			const applicationServerKey = urlBase64ToUint8Array(publicKey)
	// 			console.log("applicationServerKey", applicationServerKey)
	// 			navigator.serviceWorker.register("sw.js").then(reg => {
	// 				reg.pushManager.getSubscription().then(sub => {
	// 					if(sub)return sub
	// 					return reg.pushManager.subscribe({
	// 						userVisibleOnly: true,
	// 						applicationServerKey
	// 					})
	// 				}).then(sub => {
	// 					fetch("/subscribe", {
	// 						method: "POST",
	// 						headers: {"Content-Type": "application/json"},
	// 						body: JSON.stringify(sub)
	// 					})
	// 				}).catch(err => {
	// 					console.error("failed to subscribe", err)
	// 				})
	// 			})
	// 		})
	// 	}
	// })

	// if(navigator.serviceWorker){
	// 	console.log("trying to register service worker")
	// 	navigator.serviceWorker.register("sw.js").then(reg=>{
	// 		console.log("Service Worker registered")
	// 	}).catch(err=>{
	// 		console.error(err)
	// 	})
	// }
}