import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/index.css'
import '@/assets/global.scss'
// import init, { Vector2 } from 'mt_page_rust'
// init().then(()=>{
//     console.log(Vector2.new(1,1).multi(2))
// })
let app = createApp(App)
app.use(router)
app.mount('#app')
