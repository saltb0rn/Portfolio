import * as THREE from 'three'
import Access from './access.ts'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
// import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { SoftGlitchPass } from '../../utils/postprocessing/SoftGlitchPass.js'

export default class {

    private target?: THREE.WebGLRenderTarget
    constructor() {

        this.target = new THREE.WebGLRenderTarget(
            Access.renderer!.domElement.width,
            Access.renderer!.domElement.height,
            {
                samples: 8
            }
        )

        Access.postProcesser = new EffectComposer(Access.renderer!, this.target)


        const renderPass = new RenderPass(Access.scene!, Access.camera!)

        const savePass = new SavePass(
            new THREE.WebGLRenderTarget(
                Access.renderer!.domElement.width,
                Access.renderer!.domElement.height,
                {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    stencilBuffer: false
                }
            )
        )

        // const blendPass = new ShaderPass(BlendShader, 'tDiffuse1')
        // blendPass.uniforms['tDiffuse2'].value = savePass.renderTarget.texture
        // blendPass.uniforms['mixRatio'].value = .725

        const outputPass = new ShaderPass(CopyShader)
        outputPass.renderToScreen = true

        const glitchPass = new SoftGlitchPass()
        glitchPass.factor = 1.0

        Access.postProcesser.addPass(renderPass)
        // Access.postProcesser.addPass(blendPass)
        Access.postProcesser.addPass(savePass)
        Access.postProcesser.addPass(glitchPass)
        Access.postProcesser.addPass(outputPass)

        Access.on('postprocessing', (_1: number, _2: number, isResized: boolean) => {
            if (isResized) {
                Access.postProcesser!.setSize(
                    Access.renderer!.domElement.width,
                    Access.renderer!.domElement.height
                )
            }
            // glitchPass.factor = freq
        })
    }

    dispose() {
        if (!Access.postProcesser) return
        Access.off('postprocessing')
        for (let i = 0; i < Access.postProcesser!.passes.length; i++) {
            const pass = Access.postProcesser.passes[i]
            Access.postProcesser.removePass(pass)
            pass.dispose()
        }
        Access.postProcesser?.dispose()
        Access.postProcesser = undefined
        this.target!.dispose()
        this.target = undefined
    }
}
