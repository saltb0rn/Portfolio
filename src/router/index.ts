import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/LandPageView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/music',
            name: 'music',
            component: () => import('../views/MusicVisualizerView.vue')
        }
    ],
})

export default router
