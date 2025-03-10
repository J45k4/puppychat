import indexHtml from "./index.html"
import webpush from "web-push"
import { extname, join } from "path"
import { spawn } from "bun"

const vapidKeys = webpush.generateVAPIDKeys()

const serveFile = (path: string, mimeType: string) => {
	return async () => {
		console.log("serveFile", path, mimeType)
		const file = Bun.file(path)
		const fileContent = await file.arrayBuffer()
		return new Response(fileContent, { headers: { "Content-Type": mimeType } })
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

const API_KEY = Bun.env["YOUTUBE_API_KEY"]

function searchYouTube(query: string, maxResults = 10) {
	const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
	return fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`Network response was not ok (${response.statusText})`)
			}
			return response.json()
		})
}

const exec = async (cmd: string[]) => {
	console.log("running cmd:", cmd.join(" "))
	const proc = await spawn(cmd)
	const text = await new Response(proc.stdout).text()
	return text
}

const downloadYoutubeVideo = async (videoId: string) => {
	const url = `https://www.youtube.com/watch?v=${videoId}`
	console.log("downloading", url)
	await exec(["yt-dlp", "-x", "--audio-format", "mp3", "-i", url, "-o", `workdir/cache/${videoId}.%(ext)s`])
}

const db = await Bun.file("./workdir/db.json").json()
const cacheDir = "./workdir/cache"

const subs: any[] = []
Bun.serve({
	port: 5477,
	routes: {
		"/favicon.ico": serveFile("./assets/favicon.ico", "image/x-icon"),
		"/favicon-512x512.png": serveFile("./assets/favicon-512x512.png", "image/png"),
		"/manifest.json": serveFile("./assets/manifest.json", "application/json"),
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
		"/api/search": async (req) => {
			const url = new URL(req.url)
			const query = url.searchParams.get("query")
			if (!query) {
				return new Response("Missing query parameter", { status: 400 })
			}
			const results = await searchYouTube(query)
			console.log("resulsts", results)
			const items = results["items"]

			const metadatas = items.map((p: any) => {
				const videoId = p.id.videoId
				const title = p.snippet.title
				const thumbnail = p.snippet.thumbnails.default.url
				return { id: videoId, title, thumbnail }
			})

			return new Response(JSON.stringify(metadatas), { headers: { "Content-Type": "application/json" } })
		},
		"/api/music/:id": async (req) => {
			const id = req.params.id;
			console.log(`get music ${id}`);
			const path = join(cacheDir, `${id}.mp3`);

			// Check for file existence using Bun.file().exists()
			const exists = await Bun.file(path).exists();
			if (!exists) {
				console.log(`File does not exist in cache: ${path}`);
				await downloadYoutubeVideo(id);

				// Optionally, retry checking the file after download.
				let attempts = 5;
				while (attempts-- > 0) {
					if (await Bun.file(path).exists()) {
						break; // file exists, exit loop
					}
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			}

			// Once confirmed the file exists, serve it.
			const file = Bun.file(path);
			return new Response(file);
		},
		"/music": serveFile("./index.html", "text/html"),
		"/": serveFile("./index.html", "text/html"),
	},
})