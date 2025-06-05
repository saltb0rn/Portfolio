import { createRouter, /*createWebHistory,*/ createWebHashHistory } from 'vue-router'

const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/LandingPageView.vue')
        },
        {
            path: '/',
            component: () => import('../components/MainLayout.vue'),
            children: [
                {
                    path: '/music',
                    name: 'music',
                    component: () => import('../views/MusicVisualizerView.vue')
                },
                {
                    path: '/map',
                    name: 'map',
                    component: () => import('../views/MapView.vue')
                },
            ]

        },
        {
            path: '/resume',
            name: 'resume',
            component: () => import('../views/ResumeView.vue')
        }
    ],
})

export default router
