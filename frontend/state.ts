
export class NotifyValue<T> {
	private value: T
	private listeners: ((value: T) => void)[] = []

	constructor(value: T) {
		this.value = value
	}

	get() {
		return this.value
	}

	set(value: T) {
		this.value = value
		this.listeners.forEach(listener => listener(value))
	}

	onChange(listener: (value: T) => void) {
		this.listeners.push(listener)
	}
}

export const state = {
	selectedSong: new NotifyValue<string | null>(null),
	playing: new NotifyValue<boolean>(false),
	currentAudio: new NotifyValue<HTMLAudioElement | null>(null),
	progress: new NotifyValue<number>(0)
}