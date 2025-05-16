import { createRouter, /*createWebHistory,*/ createWebHashHistory } from 'vue-router'
import HomeView from '../views/LandPageView.vue'

const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(import.meta.env.BASE_URL),
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
        },
        {
            path: '/map',
            name: 'map',
            component: () => import('../views/MapView.vue')
        }
    ],
})

export default router
