import Access from './access.ts'
import Scene from './scene.ts'
import Renderer from './renderer.ts'
import Camera from './camera.ts'
import Mouse from './mouse.ts'

export class World {
    camera: Camera
    scene: Scene
    renderer: Renderer
    mouse: Mouse
    constructor(output: HTMLElement) {
        Access.outputContainer = output
        this.camera = new Camera()
        this.scene = new Scene()
        this.renderer = new Renderer()
        this.mouse = new Mouse()
    }

    dispose() {
        this.renderer.dispose()
        this.scene.dispose()
        this.camera.dispose()
        this.mouse.dispose()
    }
}
