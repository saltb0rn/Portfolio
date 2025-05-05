import * as THREE from 'three'

enum State {
    STOPED,
    PAUSED,
    PLAYING
}


export default class {
    listener: THREE.AudioListener
    sound: THREE.Audio
    loader: THREE.AudioLoader
    analyser: THREE.AudioAnalyser
    state: State = 0
    private isReady: boolean = false

    constructor() {

        this.listener = new THREE.AudioListener()

        this.sound = new THREE.Audio(this.listener)
        this.sound.onEnded = () => {
            this.sound.stop()
            this.state = 0
        }
        this.loader = new THREE.AudioLoader()

        this.analyser = new THREE.AudioAnalyser(this.sound, 32)

    }

    load(path: string) {
        this.isReady = false
        this.loader.load(path, (buffer) => {
            this.sound.setBuffer(buffer)
            this.sound.setLoop(false)
            this.sound.setVolume(.5)
            this.isReady = true
        })
    }

    play() {
        if (this.isReady && this.state < State.PLAYING) {
            this.sound.play()
            this.state = State.PLAYING
        }
    }

    pause() {
        if (this.isReady && this.state > State.PAUSED) {
            this.sound.pause()
            this.state = State.PAUSED
        }
    }

    stop() {
        if (this.isReady && this.state != State.STOPED) {
            this.sound.stop()
            this.state = State.STOPED
        }
    }

    getFrequency() {
        const freq = Math.max(this.analyser.getAverageFrequency() - 100.0, 0) / 50
        return freq
    }
}
