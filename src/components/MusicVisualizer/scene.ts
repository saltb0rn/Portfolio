import * as THREE from 'three'

import Access from './access.ts'
import Music from './music.ts'

import gsap from 'gsap'

import vertShader from './shaders/music.vert'
import fragShader from './shaders/music.frag'
import track from '../../assets/music/Mr-Top-Player.flac?url'
import { SoftGlitchPass } from '../../utils/postprocessing/SoftGlitchPass.js'


export default class Scene {
    proxy: unknown
    constructor() {
        Access.scene = new THREE.Scene()
        Access.musicMgr = new Music()
        this.initScene()
    }

    initScene() {
        const g = new THREE.SphereGeometry(1, 100, 100)
        const m = new THREE.ShaderMaterial({
            vertexShader: vertShader,
            fragmentShader: fragShader,
            uniforms: {
                uTime: { value: 0 },
                uAudioFreq: { value: 0 },
            },
        })
        const sphere = new THREE.Mesh(g, m)
        sphere.name = 'sphere'
        sphere.position.set(.0, .0, -5.)
        Access.scene!.add(sphere)

        const wireframe = new THREE.LineSegments(g, m)
        wireframe.scale.setScalar(1 + 0.015)
        wireframe.position.set(.0, .0, -5.)
        Access.scene!.add(wireframe)

        Access.musicMgr!.load(track)

        Access.on('musicUpdate', () => {
            // sphere.material.uniforms.uTime.value = timeStamp / 1000.0
            const softGlithPass = Access.postProcesser!.passes.find(
                (value) => value instanceof SoftGlitchPass)
            if (Access.musicMgr!.state < 2) {
                if (softGlithPass) (softGlithPass as any).factor = 0
                if (Access.musicMgr!.state < 1 &&
                    sphere.material.uniforms.uTime.value >= 0) {
                    sphere.material.uniforms.uTime.value %= Math.PI
                    gsap.to(
                        sphere.material.uniforms.uTime,
                        {
                            duration: 1.5,
                            ease: 'Slow.easeout',
                            value: 0
                        }
                    )
                }
                return
            }
            sphere.material.uniforms.uTime.value += Math.PI / 180
            const freq = Access.musicMgr!.getFrequency()
            gsap.to(
                sphere.material.uniforms.uAudioFreq,
                {
                    duration: 1.5,
                    ease: 'Slow.easeOut',
                    value: freq
                }
            )
            if (softGlithPass) (softGlithPass as any).factor = freq
        })

    }
}
