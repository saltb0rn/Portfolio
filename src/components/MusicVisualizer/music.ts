import * as THREE from 'three'
import { parseBuffer } from 'music-metadata'
import { State } from './typed.ts'


export default class {
    listener?: THREE.AudioListener
    sound?: THREE.Audio
    loader?: THREE.AudioLoader
    analyser?: THREE.AudioAnalyser
    state: State = 0
    coverUrl?: string
    private isReady: boolean = false

    constructor() {
        THREE.Cache.enabled = true
        this.listener = new THREE.AudioListener()

        this.sound = new THREE.Audio(this.listener)
        this.sound.onEnded = () => {
            this.sound!.stop()
            this.state = 0
        }
        this.loader = new THREE.AudioLoader()

        this.analyser = new THREE.AudioAnalyser(this.sound, 32)

    }

    load(path: string) {
        this.isReady = false
        if (this.coverUrl) {
            URL.revokeObjectURL(this.coverUrl)
            this.coverUrl = undefined
        }
        this.loader!.load(path, (buffer) => {
            const loader = new THREE.FileLoader()
            loader.setResponseType('arraybuffer')
            loader.load(path, async (buffer) => {
                const bufferCopy = buffer.slice(0)
                const metadata = await parseBuffer(new Uint8Array(bufferCopy as ArrayBuffer))
                if (metadata.common.picture) {
                    const { data, format } = metadata.common.picture[0]
                    const blob = new Blob([data], { type: format })
                    this.coverUrl = URL.createObjectURL(blob)
                }
            })
            this.sound!.setBuffer(buffer)
            this.sound!.setLoop(false)
            this.sound!.setVolume(.5)
            this.isReady = true
        })
    }

    play() {
        if (this.isReady && this.state < State.PLAYING) {
            this.sound!.play()
            this.state = State.PLAYING
        }
    }

    pause() {
        if (this.isReady && this.state > State.PAUSED) {
            this.sound!.pause()
            this.state = State.PAUSED
        }
    }

    stop() {
        if (this.isReady && this.state != State.STOPED) {
            this.sound!.stop()
            this.state = State.STOPED
        }
    }

    getFrequency() {
        const freq = Math.max(this.analyser!.getAverageFrequency() - 100.0, 0) / 50
        return freq
    }

    getCover() {
        return this.coverUrl
    }

    dispose() {
        this.stop()
        if (this.coverUrl) {
            URL.revokeObjectURL(this.coverUrl)
        }
        this.coverUrl = undefined
        this.listener = undefined
        this.sound = undefined
        this.loader = undefined
        this.analyser = undefined
    }
}
