import * as THREE from 'three'

import Access from './access.ts'
import { drawMap, disposeMap, initMapSetup } from './map.ts'

export default class Scene {
    constructor() {
        Access.scene = new THREE.Scene()
        this.initScene()
    }

    initScene() {
        // this.initLight()
        initMapSetup()
        drawMap()
    }

    initLight() {
        const light = new THREE.DirectionalLight(0xffffff, 1.5)
        light.position.set(0, -5, 30)
        Access.scene!.add(light)
    }

    dispose() {
        if (!Access.scene) return
        Access.clear(Access.scene)
        disposeMap()
        Access.scene = undefined
    }
}
