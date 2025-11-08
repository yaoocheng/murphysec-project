import { fileURLToPath, URL } from 'node:url'
import externalCDNPlugin from './vite-plugin/vite-plugin-external-cdn'
import commonjs from '@rollup/plugin-commonjs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    cacheDir: 'node_modules/.vite_cache', // 开发模式的依赖构建缓存目录
    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
        commonjs(),
        externalCDNPlugin([
            { name: 'vue', global: 'Vue', path: 'https://unpkg.com/vue@3/dist/vue.global.prod.js' },
            { name: 'vue-router', global: 'VueRouter', path: 'https://unpkg.com/vue-router@4/dist/vue-router.global.prod.js' }
        ])
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },

})
