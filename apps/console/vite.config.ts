import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default () => defineConfig({
    plugins: [vue(), viteCompression(), createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[name]',
    })],
    base: '/console/',
    // base: mode.includes('private') ? '' : '/console/', // 设置打包基本路径
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            ast: resolve(__dirname, 'src/assets'),
            view: resolve(__dirname, 'src/view'),
            comp: resolve(__dirname, 'src/components'),
            util: resolve(__dirname, 'src/utils'),
            page: resolve(__dirname, 'src/page'),
            api: resolve(__dirname, 'src/api'),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: {
                    hack: `true; @import (reference) "${path.resolve('src/styles/index.less')}"`,
                },
            },
        },
    },
    build: {
        cssCodeSplit: true,
        outDir: 'console',
        chunkSizeWarningLimit: 500,
        // 压缩
        minify: 'esbuild',
        // terserOptions: {
        //     compress: {
        //         drop_console: false, // 打包时删除console
        //         drop_debugger: true, // 打包时删除 debugger
        //         pure_funcs: ['console.log'],
        //     },
        //     output: {
        //         // 去掉注释内容
        //         comments: false,
        //     },
        // },

        // 拆分三方包
        rollupOptions: {
            output: {
                // 拆分第三方包为单独文件
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
            },
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3001,
        proxy: {
            '/api': {
                target: 'https://private-v3.murphysec.com/',
                // target: 'http://82.156.158.182/',
                changeOrigin: true, // 跨域设置
                secure: false,
                rewrite: (paths) => paths.replace(/^\/api/, '/'),
            },
        },
    },
});
