import Access from './access.ts'
import Renderer from './renderer.ts'
import Scene from './scene.ts'
import Camera from './camera.ts'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class World {
    scene: Scene
    renderer: Renderer
    camera: Camera

    constructor(output: HTMLElement) {
        Access.outputContainer = output
        this.camera = new Camera()
        this.scene = new Scene()
        this.renderer = new Renderer()
        Access.outputContainer.appendChild(Access.renderer.domElement)
    }
}
