import * as THREE from 'three'
import Disposer from '../../utils/disposer.ts'
import { EventEmitter } from '../../utils/eventEmitter.ts'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class Access extends EventEmitter {
    public clock?: THREE.Clock
    public camera?: THREE.PerspectiveCamera
    public scene?: THREE.Scene
    public outputContainer?: HTMLElement
    public postProcesser?: EffectComposer
    public cameraCtl?: OrbitControls
    public renderer?: THREE.WebGLRenderer
    private disposer = new Disposer()
    private events: string[] = []
    
    private static instance = new Access()

    private constructor() {
        super()
    }

    on(_names: string, callback: Function): any {
        const res = super.on(_names, callback)
        if (res) {
            this.events.push(_names)
        }
    }

    off(_names: string):any {
        const res = super.off(_names)
        if (res) {
            this.events = this.events.filter(v => _names !== v)
        }
    }

    getEvents() {
        return this.events
    }

    clear(obj: THREE.Object3D) {
        this.disposer.disposeOnCascade(obj)
    }
    
    static Instance(): Access {
        return Access.instance
    }
}

export default Access.Instance()
