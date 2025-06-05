import Access from './access.ts'
import * as THREE from 'three'
import { createWaterCube } from './water.ts'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export default class {
    pmremGenerator?: THREE.PMREMGenerator

    constructor() {
        Access.scene = new THREE.Scene()
        this.initScene()
    }

    initScene() {
        // const g = new THREE.BoxGeometry()
        // const m = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        // const o = new THREE.Mesh(g, m)
        // Access.scene!.add(o)

        const water = createWaterCube()
        Access.scene!.add(water)
        this.initLights()

    }

    initLights() {
        this.pmremGenerator = new THREE.PMREMGenerator(Access.renderer!)
        Access.scene!.background = new THREE.Color(0x444444)
        Access.scene!.environment = this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04 ).texture
    }

    dispose() {
        if (!Access.scene) return
        this.pmremGenerator?.dispose()
        Access.clear(Access.scene)
        Access.scene = undefined
    }
}
