import indexHtml from "./index.html"
import webpush from "web-push"
import { extname, join } from "path"

const vapidKeys = webpush.generateVAPIDKeys()

const serveFile = (path: string, mimeType: string) => {
	return async () => {
		console.log("serveFile", path, mimeType)
		const text = await Bun.file(path).text()
		return new Response(text, { headers: { "Content-Type": mimeType } })
	}
}

const mimeTypes: Record<string, string> = {
	".html": "text/html",
	".css": "text/css",
	".js": "text/javascript",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".gif": "image/gif",
	".mp3": "audio/mpeg",
}

const serveDirectory = (directory: string, routePrefix: string) => {
	return async (req: Request) => {
		try {
			const url = new URL(req.url)
			let pathname = url.pathname

			// Remove the route prefix from the pathname
			if (pathname.startsWith(routePrefix)) {
				pathname = pathname.slice(routePrefix.length)
			}

			// If no file is specified, default to index.html
			if (pathname === "" || pathname.endsWith("/")) {
				pathname += "index.html"
			}

			const filePath = join(directory, pathname)
			const file = Bun.file(filePath)
			const fileContent = await file.arrayBuffer()
			const ext = extname(filePath)
			const mimeType = mimeTypes[ext] || "application/octet-stream"
			return new Response(fileContent, {
				headers: { "Content-Type": mimeType },
			})
		} catch (error) {
			console.error("Error serving file:", error)
			return new Response("Not found", { status: 404 })
		}
	}
}

const db = await Bun.file("./workdir/db.json").json()

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
			return new Response("OK", { status: 200 })
		},
		"/subscribe": async (req) => {
			const body = await req.json()
			console.log("body", body)
			subs.push(body)
			return new Response("{}", { status: 200 })
		},
		"/vapidPublicKey": () => new Response(vapidKeys.publicKey),
		"/api/songs": async () => {
			return new Response(JSON.stringify(db.songs), { headers: { "Content-Type": "application/json" } })
		},
		"/music": serveFile("./index.html", "text/html"),
		"/music/*": serveDirectory("./workdir", "/workdir"),
		"/": serveFile("./index.html", "text/html"),
	},
})