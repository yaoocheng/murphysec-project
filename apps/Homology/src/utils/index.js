/**
 * 简单哈希函数，将 token 字符串映射到整数
 */
function hashToken(token) {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
        hash = (hash << 5) - hash + token.charCodeAt(i);
        hash |= 0; // 保证是32位整数
    }
    return hash;
}

/**
 * 对单个 token slice 生成 SimHash 指纹
 * @param {string[]} sliceTokens - token 数组
 * @param {number} bits - 指纹位数，默认64
 * @returns {string} - 二进制字符串指纹
 */
export function simHashSlice(sliceTokens, bits = 64) {
    const vector = Array(bits).fill(0);

    sliceTokens.forEach(token => {
        const h = hashToken(token);
        for (let i = 0; i < bits; i++) {
            const bit = (h >> i) & 1;
            vector[i] += bit === 1 ? 1 : -1;
        }
    });

    // 转为二进制字符串
    return vector.map(v => (v > 0 ? '1' : '0')).join('');
}
