export default class GameAudio {
    constructor(src) {
        this.audio = new Audio()
        this.audio.src = src
    }

    setVolume(vol) {
        vol = Math.min(vol, 1)
        this.audio.volume = parseFloat(vol)
    }

    setLooping(b) {
        this.audio.loop = b
    }

    play() {
        this.audio.play()
    }
}
