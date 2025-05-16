// https://stackoverflow.com/a/78012267

import * as FS from 'node:fs'
import { Plugin } from 'vite'

const base64Loader: Plugin = {
    name: 'base64-loader',
    transform(_: any, id: string) {
        const [path, query] = id.split('?')
        if (query != 'base64') return null;
        const data = FS.readFileSync(path)
        const base64 = data.toString('base64')

        return `export default '${base64}'`
    }
}

export default base64Loader
