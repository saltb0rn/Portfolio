import * as THREE from 'three'
import Access from './access.ts'

export default class {
    proxy: unknown
    constructor () {
        Access.camera = new THREE.PerspectiveCamera(75)
    }

    initCamera() {
        Access.camera!.position.set(.0, 1., 3.)
        Access.camera!.lookAt(.0, .0, 0)
    }
}
