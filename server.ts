import indexHtml from "./index.html";
import webpush from "web-push"

const vapidKeys = webpush.generateVAPIDKeys()

const serveFile = (path: string, mimeType: string) => {
	return async () => {
		const text = await Bun.file(path).text()
		return new Response(text, { headers: { "Content-Type": mimeType } })
	}
}

const subs: any[] = []
Bun.serve({
	port: 5477,
	routes: {
		"/sw.js": () => new Response(Bun.file("./sw.js")),
		"/puppychat.css": serveFile("./puppychat.css", "text/css"),
		"/puppychat.js": serveFile("./puppychat.js", "text/javascript"),
		"/send": () => {
			for (const sub of subs) {
				webpush.sendNotification(sub, JSON.stringify({ title: "New message", body: "You have a new message" }))
			}
			return new Response("OK", { status: 200 });
		},
		"/subscribe": async (req) => {
			const body = await req.json()
			console.log("body", body)
			subs.push(body)
			return new Response("{}", { status: 200 });
		},
		"/vapidPublicKey": () => new Response(vapidKeys.publicKey),
		"/": serveFile("./index.html", "text/html"),
	}
})