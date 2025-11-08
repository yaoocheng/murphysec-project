import * as babelParser from '@babel/parser'
import { simHashSlice } from '../utils'
import JSZip from 'jszip'
import { parser as pythonParser } from '@lezer/python'
import { parser as javaParser } from '@lezer/java'
import { parser as goParser } from '@lezer/go'
import { parser as cppParser } from '@lezer/cpp'
import { parser as rustParser } from '@lezer/rust'
import { parser as phpParser } from '@lezer/php'

const lezerParsers = {
    java: javaParser,
    py: pythonParser,
    go: goParser,
    cpp: cppParser,
    rs: rustParser,
    php: phpParser,
}

// 监听主线程消息
self.addEventListener('message', async (event) => {
    const zipFile = event.data;

    if (zipFile) {
        const result = await generateFingerprints(zipFile);
        // 将处理结果发送回主线程
        self.postMessage({ type: 'result', data: result });
    }
});


// 生成文件片段指纹
const generateFingerprints = async (zipFile) => {
    const fileEntries = await parseZip(zipFile); // 解析 ZIP 文件，获取所有文件内容

    const astList = parseAST(fileEntries); // 解析文件生成 AST 树

    const tokenList = traverseASTtokens(astList); // 遍历 AST 树，提取文件所有语法节点类型

    const slicedTokenList = sliceTokens(tokenList); // 对所有文件 tokens 进行切片

    const fingerprintList = genFingerprint(slicedTokenList); // 每个文件 tokens 数组的每个切片生成指纹

    return {
        fingerprintList,
        fileEntries,
    };
};

const parseZip = async (zipFile) => {
    // 解析 ZIP
    const zip = await JSZip.loadAsync(zipFile)
    const fileEntries = [];

    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        // 忽略文件夹和非源码文件
        if (
            zipEntry.dir ||
            relativePath.startsWith('__MACOSX') ||
            relativePath.startsWith('.') ||
            !/\.(js|ts|jsx|tsx|java|py|go|cpp|rs|php)$/.test(relativePath)
        ) {
            continue;
        }

        try {
            const content = await zipEntry.async('string')
            fileEntries.push({
                path: relativePath,
                name: relativePath.split('/').pop(),
                content
            })
        } catch (err) {
            console.warn(`⚠️ 无法读取 ${relativePath}`, err)
        }
    }
    return fileEntries
}


// 解析文件的 AST
const parseAST = (fileCodeList) => {
    return fileCodeList.map(({ path, content }) => {
        const ext = path.split('.').pop();
        const plugins = [];
        let codeToParse = content;

        if (ext === 'ts' || ext === 'tsx') plugins.push('typescript');
        if (ext === 'jsx' || ext === 'tsx') plugins.push('jsx');

        // JS / TS 文件，使用 Babel
        if (['js', 'ts', 'jsx', 'tsx'].includes(ext)) {
            try {
                return babelParser.parse(codeToParse, {
                    sourceType: 'module',
                    plugins: [...plugins, 'classProperties', 'decorators-legacy', 'optionalChaining', 'nullishCoalescingOperator', 'topLevelAwait']
                });
            } catch (err) {
                console.warn(`[worker] babel parse failed for ${path}:`, err.message);
                // 返回空 Program AST 占位，避免后续报错
                return { type: 'File', program: { type: 'Program', body: [], sourceType: 'module' } };
            }
        }

        // 其他文件类型，使用 Lezer
        const parser = lezerParsers[ext];
        if (parser) {
            return parser.parse(content).topNode;
        }


        return null;
    });
};
// 遍历 AST 树，生成所有 tokens（兼容 Babel + Lezer）
const traverseASTtokens = (astList) => {
    return astList.map(ast => {
        const tokens = [];
        if (!ast) return tokens;

        // ✅ Lezer AST: 通过 cursor 遍历
        if (typeof ast.cursor === 'function') {
            const cursor = ast.cursor();
            do {
                tokens.push(cursor.name);
            } while (cursor.next());
            return tokens;
        }

        // ✅ Babel AST: 递归遍历所有节点
        function walk(node) {
            if (!node) return;

            if (typeof node.type === 'string') {
                tokens.push(node.type);
            }

            for (const key in node) {
                if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
                const val = node[key];
                if (Array.isArray(val)) {
                    val.forEach(item => {
                        if (item && typeof item === 'object') walk(item);
                    });
                } else if (val && typeof val === 'object' && val.type) {
                    walk(val);
                }
            }
        }

        if (ast.program) walk(ast.program);
        else walk(ast);

        return tokens;
    });
};


// 对 tokens 进行切片，每个切片包含 100 个 tokens，步长为 50
const sliceTokens = (tokenList) => {
    const SLICE_SIZE = 100;
    const STEP = 50
    return tokenList.map(tokens => {
        const slices = [];
        for (let i = 0; i < tokens.length; i += STEP) {
            slices.push(tokens.slice(i, i + SLICE_SIZE));
        }
        return slices;
    });
}

/**
 * 对片段做指纹 给后端去计算汉明距离
 * const dist = simhash.hammingDistance(hash1, hash2);
 * const similarity = 1 - dist / 64;
 * */
const genFingerprint = (slicedTokenList) => {
    return slicedTokenList.map(slices => {
        return slices.map(slice => simHashSlice(slice))
    })
}



