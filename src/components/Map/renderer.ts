import * as THREE from 'three'
import Access from './access.ts'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class {

    constructor() {
        Access.clock = new THREE.Clock()
        Access.renderer = new THREE.WebGLRenderer({ antialias: true })
        Access.cssRenderer = new CSS2DRenderer()
        Access.cssRenderer.domElement.style.position = 'absolute'
        Access.cssRenderer.domElement.style.top = '0px'
        Access.cssRenderer.domElement.style.left = '0px'
        Access.cssRenderer.domElement.style.zIndex = '0'
        Access.renderer.shadowMap.enabled = true
        Access.outputContainer!.style.position = 'relative'
        Access.outputContainer!.appendChild(Access.renderer!.domElement)
        Access.outputContainer!.appendChild(Access.cssRenderer!.domElement)
        this.initAnimationLoop()

        // Comment this to disable camera controller
        if (Access.cssRenderer) {
            Access.cameraCtl = new OrbitControls(Access.camera!, Access.cssRenderer.domElement)
        } else {
            Access.cameraCtl = new OrbitControls(Access.camera!, Access.renderer.domElement)
        }
        // Access.cameraCtl.enableZoom = false

    }

    protected initAnimationLoop() {
        Access.renderer!.setAnimationLoop((timeStamp) => {
            const isResized = this.respondToRendererSize()
            const events = Access.getEvents()
            events.forEach(callback => {
                Access.trigger(callback, [timeStamp, Access.clock?.getDelta(), isResized])
            })
            if (Access.postProcesser) {
                Access.postProcesser!.render()
            } else {
                // Access.renderer!.autoClear = false
                Access.renderer!.render(Access.scene!, Access.camera!)
                Access.cssRenderer!.render(Access.scene!, Access.camera!)
            }

            if (Access.cameraCtl) {
                Access.cameraCtl.update()
            }

        })
    }

    protected respondToRendererSize(): boolean {
        const pixelRatio = Math.min(window.devicePixelRatio, 1)
        const width = Math.floor(Access.outputContainer!.clientWidth * pixelRatio)
        const height = Math.floor(Access.outputContainer!.clientHeight * pixelRatio)
        const canvas = Access.renderer!.domElement
        let isResized = false
        if (width != canvas.width || height != canvas.height) {
            Access.camera!.aspect = width / height
            Access.camera!.updateProjectionMatrix()
            Access.renderer!.setSize(width, height, false)
            Access.cssRenderer!.setSize(width, height)
            isResized = true
        }
        return isResized
    }

    dispose() {
        if (!Access.renderer) return
        Access.renderer.renderLists.dispose()
        Access.renderer.dispose()
        Access.renderer = undefined
    }
}
