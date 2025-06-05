import Access from './access.ts'
import Camera from './camera.ts'
import Renderer from './renderer.ts'
import Scene from './scene.ts'

export class World {
    camera: Camera
    renderer: Renderer
    scene: Scene

    constructor(output: HTMLElement) {
        Access.outputContainer = output
        this.camera = new Camera()        
        this.renderer = new Renderer()
        this.scene = new Scene()

    }

    dispose() {
        this.renderer.dispose()
        this.camera.dispose()
        this.scene.dispose()
    }
}
