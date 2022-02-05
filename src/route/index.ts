import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        component: () => import('../layout/index.vue'),
    },
    {
        path: '/calc',
        component: () => import('../accounts/index.vue')
    },
    {
        path: '/mine',
        component: () => import("../jsGame/minegame/Mine.vue")
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
