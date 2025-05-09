import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { EventEmitter } from '../../utils/eventEmitter'
import Disposer from '../../utils/disposer.ts'
import Music from './music.ts'

class Access extends EventEmitter {

    public camera?: THREE.PerspectiveCamera
    public renderer?: THREE.WebGLRenderer
    public scene?: THREE.Scene
    public postProcesser?: EffectComposer
    public outputContainer?: HTMLElement
    public musicMgr?: Music
    private disposer = new Disposer()
    private events: string[] = []

    private static instance = new Access()

    private constructor() {
        super()
    }

    static Instance(): Access {
        return Access.instance
    }

    on(_names: string, callback: Function): any {
        const res = super.on(_names, callback)
        if (res) {
            this.events.push(_names)
        }
    }

    off(_names: string): any {
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
}

export default Access.Instance()
