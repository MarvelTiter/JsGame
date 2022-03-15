import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
    },
    {
        path: '/calc',
        component: () => import('@/calculator/index.vue')
    },
    {
        path: '/account',
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
    },
    {
        path: '/tank',
        component: () => import("@/jsGame/tank/index.vue")
    },
    {
        path: '/plane',
        component: () => import("@/jsGame/plane/index.vue")
    },
    {
        path: '/vxplane',
        component: () => import("@/jsGame/vxplane/index.vue")
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
