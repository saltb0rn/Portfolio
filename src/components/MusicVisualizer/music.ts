import * as THREE from 'three'
import Access from './access.ts'

export default class {
    listener: THREE.AudioListener
    sound: THREE.Audio
    loader: THREE.AudioLoader
    analyser: THREE.AudioAnalyser
    private isReady: boolean = false

    constructor() {

        this.listener = new THREE.AudioListener()

        this.sound = new THREE.Audio(this.listener)
        this.sound.onEnded = () => {
            this.isReady = true
        }
        this.loader = new THREE.AudioLoader()

        this.analyser = new THREE.AudioAnalyser(this.sound, 32)

    }

    load(path: string) {
        this.isReady = false
        this.loader.load(path, (buffer) => {
            this.sound.setBuffer(buffer)
            this.sound.setLoop(true)
            this.sound.setVolume(.5)
            this.isReady = true
        })
    }

    play() {
        if (this.isReady && !this.sound.isPlaying) {
            this.sound.play()
            this.isReady = false
        }
    }

    pause() {
        if (this.sound.isPlaying) {
            this.sound.pause()
            this.isReady = true
        }
    }

    stop() {
        if (this.sound.isPlaying) {
            this.sound.stop()
        }
    }

    getFrequency() {
        const freq = Math.max(this.analyser.getAverageFrequency() - 100.0, 0) / 50
        return freq
    }
}
