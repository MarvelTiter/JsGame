import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/index.css'
import '@/assets/global.scss'
import init, { hello } from 'MtPageRust'
init().then(()=>{
    hello('wasm test')
    let app = createApp(App)
    app.use(router)
    app.mount('#app')
})
