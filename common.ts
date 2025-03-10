
export const loaderIcon = (args: {
	width: number
	height: number
}) => {
	const div = document.createElement("div")
	div.className = "loader"
	div.style.width = `${args.width}px`
	div.style.height = `${args.height}px`
	const container = document.createElement("div")
	container.appendChild(div)
	container.style.width = `${args.width + 8}px`
	container.style.height = `${args.height + 8}px`
	//container.style.padding = "20px"
	return container
}