import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
    assetsInclude: ['**/*.png', '**/*.jpg'],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id, /*sed*/) {
                    if (id.includes('node_modules')) {
                        const moduleName = id.split('node_modules/')[1].split('/')[0].toString()
                        // if (moduleName == 'vue') {
                        //     console.log(sed.getModuleInfo(id))
                        // }
                        return moduleName
                    }
                    return null
                }
            }
        }
    },

    plugins: [
        vue(),
        // vueDevTools(),
        glsl()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'vue': 'vue/dist/vue.esm-bundler.js'
        },
    },
})
