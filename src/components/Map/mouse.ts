import * as THREE from 'three'
import Access from './access'
import { drawMap, goBack } from './map.ts'

const FAR_DISTANCE = -100000

export default class Mouse {

    private raycaster = new THREE.Raycaster()
    private pickPosition = new THREE.Vector2(FAR_DISTANCE, FAR_DISTANCE)
    private intersected?: any

    constructor() {
        this.initMouseSetup()
    }

    initMouseSetup() {

        Access.on('listenMouse', () => {
            this.raycaster.setFromCamera(this.pickPosition!, Access.camera!)
            const map = Access.scene!.getObjectByName('3dmap')
            if (map) {
                const hit = this.raycaster.intersectObjects(map.children)
                const result = hit.find((item: any) => item.object.userData.isUnit)
                if (result) {
                    if (this.intersected != result.object) {
                        if (this.intersected) {
                            this.intersected.material[0].uniforms.isHover.value = false
                        }
                        this.intersected = result.object
                        this.intersected.material[0].uniforms.isHover.value = true
                    }
                    document.body.style.cursor = 'pointer'                    
                } else {
                    if (this.intersected) {
                        this.intersected.material[0].uniforms.isHover.value = false
                        this.intersected = undefined
                    }
                    document.body.style.cursor = 'auto'
                }

            } else {
                if (this.intersected) {
                    this.intersected.material[0].uniforms.isHover.value = false
                    this.intersected = null
                }
                document.body.style.cursor = 'auto'
            }
        })

        document.addEventListener('mousemove', this.setPickPosition.bind(this))
        document.addEventListener('mouseout', this.clearPickPosition.bind(this))
        document.addEventListener('mouseleave', this.clearPickPosition.bind(this))
        document.addEventListener('mousedown', this.onClickEvt.bind(this))
    }

    getRelativeCoords(event: MouseEvent) {
        const canvas = Access.renderer!.domElement
        const rect = canvas.getBoundingClientRect()
        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height
        }
    }

    setPickPosition(event: MouseEvent) {
        if (!Access.renderer) return
        const canvas = Access.renderer!.domElement
        const pos = this.getRelativeCoords(event)
        this.pickPosition!.x = (pos.x / canvas.width) * 2 - 1
        this.pickPosition!.y = (pos.y / canvas.height) * -2 + 1
    }

    clearPickPosition() {
        this.pickPosition!.x = FAR_DISTANCE
        this.pickPosition!.y = FAR_DISTANCE
    }

    onClickEvt(event: MouseEvent) {
        if (0 === event.button) {
            if (this.intersected) {
                const { adcode, centroid } = this.intersected.parent.customProperties
                drawMap(adcode, centroid)
            }
        } else if (2 === event.button) {
            goBack()
        }
    }

    dispose() {
        document.removeEventListener('mousemove', this.setPickPosition.bind(this))
        document.removeEventListener('mouseout', this.clearPickPosition.bind(this))
        document.removeEventListener('mouseleave', this.clearPickPosition.bind(this))
        document.removeEventListener('mousedown', this.onClickEvt.bind(this))
    }
}
