import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        component: () => import('../layout/index.vue'),
        children: [
            {
                path: 'calc',
                component: () => import('../accounts/index.vue')
            },
            {
                path: 'mine',
                component: () => import("../jsGame/minegame/Mine.vue")
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
