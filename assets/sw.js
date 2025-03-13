self.addEventListener("push", event => {
    const data = event.data.json()
    event.waitUntil(self.registration.showNotification("New Message", {
        body: data.message,
        icon: "icon.png"
    }))
})