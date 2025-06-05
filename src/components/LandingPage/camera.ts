import Access from './access.ts'
import * as THREE from 'three'

export default class {
    constructor() {
        Access.camera = new THREE.PerspectiveCamera(75)
        this.initCamera()
    }

    initCamera() {
        Access.camera!.position.set(0, 0, 5.)
        Access.camera!.lookAt(0, 0, 0)
    }

    dispose() {
        if (Access.camera) {
            Access.camera = undefined
        }
    }
}
