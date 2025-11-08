import type { Plugin } from 'vite'

interface ModuleOptions {
    name: string
    global: string
    path: string
}

export default function externalCDNPlugin(modules: ModuleOptions[] = []): Plugin {
    return {
        name: 'vite-plugin-external-cdn',
        config(config, { command }) {
            if (command === 'build') {
                const externals = modules.map(m => m.name)
                const globals = modules.reduce((acc, cur) => {
                    acc[cur.name] = cur.global
                    return acc
                }, {} as Record<string, string>)

                config.build = config.build || {}
                config.build.rollupOptions = config.build.rollupOptions || {}
                config.build.rollupOptions.external = externals
                config.build.rollupOptions.output = config.build.rollupOptions.output || {}
                    ; (config.build.rollupOptions.output as any).globals = globals
            }
        },

        transformIndexHtml(html) {
            // 生成 CDN 脚本
            const cdnScripts = modules.map(m => `<script src="${m.path}"></script>`).join('\n')

            // 1️⃣ 插入到 </head> 前
            html = html.replace(/(<\/head>)/, `${cdnScripts}\n$1`)

            // 2️⃣ 找到业务入口 <script type="module" src="..."> 标签
            const entryScriptMatch = html.match(/<script\s+type="module"[^>]*src="[^"]+"[^>]*><\/script>/)
            if (entryScriptMatch) {
                const entryScript = entryScriptMatch[0]
                // 先删除原来的业务入口
                html = html.replace(entryScript, '')
                // 再插入到 </body> 前
                html = html.replace(/(<\/body>)/, `${entryScript}\n$1`)
            }

            return html
        }
    }
}
