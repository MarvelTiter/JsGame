import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

function pathResolve(dir: string) {
    return resolve(process.cwd(), ".", dir)
}
// const root = process.cwd();

//以下为vite-config 输出的配置

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        })
    ],
    resolve: {
        alias: {
            "@": "/src"
        }
    },
    server: {
        cors: true,
        proxy: {
            "/sprites": {
                target: "https://marveltiter.gitee.io",
                changeOrigin: true
            },
            "/local":{
                target: "http://localhost:8011",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/local/, '')
            },
        }
    }
})
