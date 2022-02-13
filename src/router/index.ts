import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
    },
    {
        path: '/calc',
        component: () => import('@/accounts/index.vue')
    },
    {
        path: '/mine',
        component: () => import("@/jsGame/minegame/index.vue")
    },
    {
        path: '/ball',
        component: () => import("@/jsGame/snowball/index.vue")
    },
    {
        path: '/debug',
        component: () => import("@/jsGame/debug/index.vue")
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
