import * as THREE from 'three'
import Access from './access.ts'

export default class {

    proxy: unknown
    private startup = 0

    constructor() {
        Access.renderer = new THREE.WebGLRenderer({ antialias: true })
        Access.renderer.setClearColor(0x000000)
        Access.renderer.shadowMap.enabled = true
        this.initAnimationLoop()
        this.proxy = new Proxy(this, {
            get (_, property) {
                if (property in this) {
                    return Reflect.get(this, property)
                }
                return Access.renderer[property]
            },

            set(_, property, value) {
                Access.renderer[property] = value
                return true
            }
        })
    }

    protected respondToRendererSize(): boolean {
        const pixelRatio = window.devicePixelRatio
        const width = Math.floor(Access.outputContainer.clientWidth * pixelRatio)
        const height = Math.floor(Access.outputContainer.clientHeight * pixelRatio)
        const canvas = Access.renderer.domElement
        let isResized = false
        if (width != canvas.width || height != canvas.height) {
            Access.camera.aspect = width / height
            Access.camera.updateProjectionMatrix()
            Access.renderer.setSize(width, height, false)
            isResized = true
        }
        return isResized
    }

    protected initAnimationLoop() {
        Access.renderer.setAnimationLoop((timeStamp) => {
            if (!this.startup) {
                this.startup = timeStamp
            }
            const timeDelta = timeStamp - this.startup
            this.startup = timeStamp
            const isResized = this.respondToRendererSize()
            const events = Access.getEvents()
            events.forEach(callback => {
                Access.trigger(callback, [timeStamp, timeDelta, isResized])
            })
            Access.renderer.render(Access.scene, Access.camera)
        })
    }
}
