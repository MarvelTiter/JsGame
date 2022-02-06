import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/index.css'
import '@/assets/global.scss'
let app = createApp(App)
app.use(router)
app.mount('#app')
