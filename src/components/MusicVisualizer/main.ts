import Access from './access.ts'
import Renderer from './renderer.ts'
import Scene from './scene.ts'
import Camera from './camera.ts'
import PostProc from './postProc.ts'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class World {
    scene: Scene
    renderer: Renderer
    camera: Camera
    postProc: PostProc

    constructor(output: HTMLElement) {
        Access.outputContainer = output
        this.camera = new Camera()
        this.scene = new Scene()
        this.renderer = new Renderer()
        this.postProc = new PostProc()
        Access.outputContainer.appendChild(Access.renderer!.domElement)
    }

    get state () {
        if (!Access.musicMgr) {
            return 0
        }
        return Access.musicMgr!.state
    }

    play() {
        Access.musicMgr!.play()
    }

    pause() {
        Access.musicMgr!.pause()
    }

    stop() {
        Access.musicMgr!.stop()
    }

    dispose() {
        this.renderer.dispose()
        this.scene.dispose()
        this.postProc.dispose()
        this.camera.dispose()
    }
}
