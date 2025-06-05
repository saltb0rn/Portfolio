import { defineComponent, h, type VNode } from 'vue'
import './index.css'

const traverse = (nodes: VNode[]) => {
    nodes.map((node: VNode, index: number) => {
        if (node.type === Symbol.for('v-txt') ||
            (typeof node.children === 'string' && node.type !== Symbol.for('v-cmt'))) {
            if (typeof node.children !== 'string') return // Make typescript silent
            const slices: VNode[] = []
            node.children.split('').map(c => {
                if (c.trim()) slices.push(h('span', c))
            })
            if (node.type === Symbol.for('v-txt')) {
                nodes[index] = h('div', { class: 'lettering' }, slices)
            } else {
                nodes[index] = h(node.type as string, { class: 'lettering' }, slices)
            }
        } else if (Array.isArray(node.children)) {
            traverse(node.children as VNode[])
        }
    })
}

export default defineComponent({

    setup(_, ctx) {
        /* When using templates with Composition API,
           the return value of the setup() hook is used to expose data to the template.
           When using render functions, however, we can directly return the render function instead.

           3.3+ required
        */
        return () => {
            let children: VNode[] = []
            if (ctx.slots.default) {
                children = ctx.slots.default()
                traverse(children)
            }
            return h('div', children)
        }
    }
})
