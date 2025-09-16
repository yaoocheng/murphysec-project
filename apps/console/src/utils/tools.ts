// 第三方库
import { ElMessage, messageType } from 'element-plus';
import CryptoJS from 'crypto-js';
import mitt from 'mitt';
import Clipboard from 'clipboard';
import JSEncrypt from 'jsencrypt';
import { PUBLIC_KEY } from '@/constants';

// 内部依赖
import images from '@/constants/logo-imgs';
import store from './store';
import { getUserInfoApi } from '@/api/user';

/**
 * 事件总线
 * @description 全局事件总线，用于组件间通信
 */
export default mitt();

/**
 * 信息提示
 * @description 统一的消息提示函数
 * @param {string} text - 提示文本
 * @param {messageType} type - 提示类型
 * @param {number} [duration=3000] - 显示时长，默认3000ms
 * @returns {import('element-plus').MessageHandler} 消息实例
 */
export function showMessage(text: string, type: messageType, duration: number = 3000) {
    if (!text) return;

    return ElMessage({
        message: text,
        type,
        duration,
        // showClose: true,
    });
}

/**
 * toast提示延迟刷新
 * @description 显示提示信息后延迟刷新页面
 * @param {string} text - 提示文本
 * @param {MessageType} type - 提示类型
 * @param {number} [delay=600] - 刷新延迟时间，默认600ms
 */
export function delayReload(text: string, type: messageType, delay: number = 600) {
    if (!text) return;

    showMessage(text, type);
    const timer = window.setTimeout(() => {
        window.location.reload();
        window.clearTimeout(timer);
    }, delay);
}

// 对象key排序
export const sortObjectKeys:any = (obj:any) => {
    // 基本类型直接返回
    if (obj === null || typeof obj !== 'object') return obj;

    // 数组递归处理每个元素
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }

    // 对象处理：递归排序所有键
    return Object.keys(obj)
        .sort()
        .reduce((result:any, key) => {
            result[key] = sortObjectKeys(obj[key]);
            return result;
        }, {});
};

/**
 * 复制指定DOM元素的内容
 * @description 使用Clipboard.js实现复制功能，并显示成功提示
 * @param {string} domSelect - 目标DOM元素的选择器
 * @returns {Clipboard} 返回Clipboard实例，可用于后续清理
 */
export function copyFunc(domSelect: string): Clipboard {
    try {
        const clip = new Clipboard(domSelect);
        showMessage('复制成功', 'success');
        return clip;
    } catch (error) {
        showMessage('复制失败', 'error');
        throw error;
    }
}

/**
 * 函数防抖
 * @description 创建一个防抖函数，在延迟时间内多次调用只会执行最后一次
 * @template T 函数参数类型
 * @template R 函数返回值类型
 * @param {(...args: T[]) => R} fn - 需要防抖的函数
 * @param {number} delay - 防抖延迟时间(毫秒)
 * @returns {(...args: T[]) => void} 返回防抖处理后的函数
 */
export function debounce(fn: Function, delay: number): () => void {
    let timer: any = null;

    return () => {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn();
            timer = null;
        }, delay);
    };
}

/**
 * 格式化日期
 * @description 将日期字符串格式化为指定格式
 * @param {string | Date} date - 要格式化的日期
 * @param {boolean} [withTime=true] - 是否包含时间，默认为true
 * @returns {string} 格式化后的日期字符串
 * @throws {Error} 如果传入的日期无效
 */
export function formatDate(date: string | Date, withTime: boolean = true): string {
    try {
        const dat = date instanceof Date ? date : new Date(date);

        const year = dat.getFullYear();
        const month = (dat.getMonth() + 1).toString().padStart(2, '0');
        const day = dat.getDate().toString().padStart(2, '0');

        if (!withTime) {
            return `${year}-${month}-${day}`;
        }

        const hour = dat.getHours().toString().padStart(2, '0');
        const minute = dat.getMinutes().toString().padStart(2, '0');
        const second = dat.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    } catch (error) {
        console.error('Date formatting error:', error);
        return '';
    }
}

/**
 * 请使用 formatDate(date, false) 替代
 */
export function formatDate1(date: string): string {
    return formatDate(date, false);
}

/**
 * 本地存储操作类型
 */
type StorageType = 'get' | 'set' | 'remove' | 'clear';

/**
 * 操作本地存储信息
 * @description 统一的本地存储操作函数，支持获取、设置、删除和清空操作
 * @param {StorageType} type - 操作类型：get(获取)、set(设置)、remove(删除)、clear(清空)
 * @param {string} name - 存储项的键名
 * @param {unknown} data - 要存储的数据
 * @returns {unknown} 获取操作时返回存储的数据，其他操作返回undefined
 * @throws {Error} 当操作类型无效时抛出错误
 */
export function localStorageUtil(type: StorageType, name: string = '', data: unknown = ''): any {
    try {
        switch (type) {
            case 'get': {
                const value = window.localStorage.getItem(name);
                if (!value) return null;
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }
            case 'set': {
                const value = typeof data === 'object' ? JSON.stringify(data) : String(data);
                window.localStorage.setItem(name, value);
                return undefined;
            }
            case 'remove': {
                window.localStorage.removeItem(name);
                return undefined;
            }
            case 'clear': {
                window.localStorage.clear();
                return undefined;
            }
            default: {
                throw new Error(`无效的存储操作类型: ${type}`);
            }
        }
    } catch (error) {
        console.error('本地存储操作失败:', error);
        throw error;
    }
}

/**
 * 加密方法
 * @description 使用AES加密算法对数据进行加密
 * @param {unknown} data - 要加密的数据
 * @returns {string} 加密后的字符串
 * @throws {Error} 当加密过程出错时抛出错误
 */
export const encrypt = (data: unknown): string => {
    try {
        const serializedData = JSON.stringify(data);
        return CryptoJS.AES.encrypt(serializedData, '0123456789ABCDEF').toString();
    } catch (error) {
        console.error('数据加密失败:', error);
        throw error;
    }
};

/**
 * 解密方法
 * @description 使用AES解密算法对加密数据进行解密
 * @param {string} encryptedData - 加密的字符串
 * @returns {unknown} 解密后的数据
 * @throws {Error} 当解密过程出错时抛出错误
 */
export const decrypt = (encryptedData: string | any): any => {
    try {
        if (!encryptedData) return null;
        const bytes = CryptoJS.AES.decrypt(encryptedData, '0123456789ABCDEF');
        const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (error) {
        console.error('数据解密失败:', error);
        throw error;
    }
};

/**
 * AES加密密钥
 * @constant
 * @type {string}
 */
// const AES_KEY = '0123456789ABCDEF';

/**
 * 获取用户信息
 * @description 从本地存储中获取并解密用户信息
 * @returns {Record<string, any> | null} 解密后的用户信息对象，如果不存在或解密失败则返回null
 */
export function getUserInfo(): Record<string, any> | null {
    try {
        const encryptedData = window.localStorage.getItem('g-u');
        if (!encryptedData) return null;
        return decrypt(encryptedData) as Record<string, any> || null;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}

// 将 string 转为 Uint8Array
// const strToUint8 = (str: string): Uint8Array => new Uint8Array([...str].map((c) => c.charCodeAt(0)));

// 将 Uint8Array 转为 WordArray（CryptoJS 需要）
const uint8ToWordArray = (u8arr: Uint8Array): CryptoJS.lib.WordArray => CryptoJS.lib.WordArray.create(u8arr as any);

// PKCS#7 填充
const padPKCS7 = (data: Uint8Array, blockSize = 16): Uint8Array => {
    const padding = blockSize - (data.length % blockSize);
    const pad = new Uint8Array(padding).fill(padding);
    return new Uint8Array([...data, ...pad]);
};

// Base64 转 Uint8Array
const b64ToUint8Array = (b64: string): Uint8Array => {
    const binary = atob(b64);
    return new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
};

// AES CBC 加密
const aesCbcEncrypt = (plaintext: Uint8Array, key: CryptoJS.lib.WordArray, iv: Uint8Array): Uint8Array => {
    const encrypted = CryptoJS.AES.encrypt(uint8ToWordArray(plaintext), key, {
        iv: uint8ToWordArray(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.NoPadding, // 我们手动填充 PKCS#7
    });
    return b64ToUint8Array(encrypted.toString());
};

export const aes = (plaintext: string, pemPublicKey: string = PUBLIC_KEY): string => {
    const encoder = new TextEncoder();

    // 1. 随机盐 & keySeed
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const keySeed = window.crypto.getRandomValues(new Uint8Array(21));

    // 2. 衍生 256-bit AES 密钥（PBKDF2，100000次）
    const key = CryptoJS.PBKDF2(
        CryptoJS.enc.Base64.stringify(uint8ToWordArray(keySeed)),
        uint8ToWordArray(salt),
        { keySize: 256 / 32, iterations: 100000, hasher: CryptoJS.algo.SHA256 },
    );

    // 3. 用公钥加密 keySeed（RSA PKCS#1 v1.5）
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(pemPublicKey);
    const encryptedKeySeedB64 = encryptor.encrypt(btoa(String.fromCharCode(...keySeed)));
    if (!encryptedKeySeedB64) throw new Error('RSA 加密失败');

    const encryptedKeySeed = b64ToUint8Array(encryptedKeySeedB64);

    // 4. 生成随机 IV
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    // 5. 加密正文（手动做 PKCS#7）
    const paddedPlaintext = padPKCS7(encoder.encode(plaintext));
    const encryptedData = aesCbcEncrypt(paddedPlaintext, key, iv);

    // 6. 拼接结构：salt + encryptedKeySeed + iv + encryptedData
    const result = new Uint8Array([...salt, ...encryptedKeySeed, ...iv, ...encryptedData]);

    // 7. Base64 输出
    return btoa(String.fromCharCode(...result));
};

/**
 * 更新用户信息
 * @description 从API获取最新用户信息并更新到本地存储
 * @returns {Promise<boolean>} 更新成功返回true，失败返回false
 */
export async function updateUserInfoHandle(): Promise<boolean> {
    try {
        const currentUserInfo = getUserInfo() || {};
        const response = await getUserInfoApi();

        if (response?.data?.code !== 200) {
            throw new Error('获取用户信息接口返回错误');
        }

        const updatedUserInfo = {
            ...currentUserInfo,
            ...response.data.data,
        };

        window.localStorage.setItem('g-u', encrypt(updatedUserInfo));
        store.userInfo = updatedUserInfo;

        return true;
    } catch (error) {
        console.error('更新用户信息失败:', error);
        return false;
    }
}

/**
 * 接入图标
 */
export function getAccessImg(access: string): string | undefined {
    const accessMap: Record<string, string> = {
        gitlab: images.gitlab,
        gitlabwebhook: images.gitlab,
        github: images.github,
        coding: images.coding,
        bitbucket: images.bitbucket,
        idea: images.idea,
        cli: images.cli,
        git: images.git,
        gitee: images.gitee,
        upload: images.file,
        remote_url: images.file,
        harbor: images.harbor,
        nexus: images.nexus,
        jfrog: images.jfrog,
        ecr: images.ecr,
        svn: images.svn,
        docker: images.docker,
        comp: images.comp,
        gerrit: images.gerrit,
        eclipse: images.eclipse,
        vscode: images.vscode,
        jenkins: images.jenkins,
        binary: images.binary,
        folib: images.folib,
        '4a': images.host,
        ezone_code: images.ezone,
        ezone_package: images.ezone,
    };

    return accessMap[access];
}

/**
 * 获取检测方式的描述
 * @description 根据检测方式的类型编号返回对应的中文描述
 * @param {number} type - 检测方式的类型编号
 * @returns {string} 检测方式的中文描述
 */
export function getDetectTypeHandle(type: number): string {
    const typeMap: Record<number, string> = {
        1: 'GitLab全部仓库增量检测',
        2: 'GitLab全部仓库单次检测',
        3: 'GitLab指定仓库增量检测',
        4: 'GitLab指定仓库单次检测',
        5: 'IDEA插件检测',
        6: 'CLI检测',
        7: 'Git指定仓库检测',
        8: 'GitHub检测',
        9: '文件上传二进制检测',
        10: '文件上传源代码检测',
        14: 'GitHub持续监控',
    };

    return typeMap[type] || '未知检测方式';
}

/**
 * 获取检测范围的描述
 * @description 根据检测范围的编号返回对应的中文描述
 * @param {number} num - 检测范围的编号
 * @returns {string} 检测范围的中文描述
 */
export function getRangeHandle(num: number): string {
    const rangeMap: Record<number, string> = {
        1: '全部仓库',
        2: '指定仓库',
    };

    return rangeMap[num] || '未知范围';
}

/**
 * 文件下载函数
 * @description 通过API获取文件数据并触发浏览器下载
 * @param {(id: string) => Promise<{ data: Blob }>} api - 获取文件数据的API函数
 * @param {string} id - 文件标识符
 * @param {string} path - 文件路径，用于获取文件名
 * @returns {Promise<void>}
 * @throws {Error} 当API调用失败或文件下载过程出错时抛出错误
 */
export const downloadFile = async (
    api: Function,
    id: string | any,
    path: string,
): Promise<void> => {
    try {
        // 从路径中提取文件名
        const fileName = path.split('/').pop();
        if (!fileName) {
            throw new Error('无效的文件路径');
        }

        // 获取文件数据
        const { data } = await api(id);
        if (!(data instanceof Blob)) {
            throw new Error('API返回的数据格式不正确');
        }

        // 创建下载链接
        const downloadUrl = URL.createObjectURL(data);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = fileName;

        // 触发下载
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // 清理资源
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('文件下载失败:', error);
        showMessage('文件下载失败', 'error');
        throw error;
    }
};

/**
 * 检测模式映射
 */
const MODE_MAP = {
    1: '标准模式',
    2: '深度检测',
    3: '二进制检测',
    4: '固件检测',
    5: '容器镜像检测',
} as const;

/**
 * 获取检测模式名称
 * @param num 检测模式编号
 * @returns 检测模式名称
 */
export function getModeHandle(num: keyof typeof MODE_MAP): string {
    return MODE_MAP[num] || '';
}

/**
 * 检测状态映射
 */
const DETECT_STATUS_MAP = {
    1: '队列中',
    2: '运行中',
    3: '检测成功',
    4: '拉取失败',
    5: 'Scanner失败',
    6: 'Scanner超时',
    7: 'task超时',
    8: '取消',
    9: '数据操作异常',
    10: '产品许可证已过期',
    11: '项目点数已超过产品许可证限制',
} as const;

/**
 * 获取检测状态名称
 * @param num 检测状态编号
 * @returns 检测状态名称
 */
export function getDetectStatus(num: keyof typeof DETECT_STATUS_MAP): string {
    return DETECT_STATUS_MAP[num] || '';
}

/**
 * 检测状态样式映射
 */
interface StatusStyle {
    bg: string;
    c: string;
    text: string;
}

const DETECT_STATUS_STYLE_MAP: Record<number, StatusStyle> = {
    1: {
        bg: '#7F3BF533',
        c: '#6425D0',
        text: '队列中',
    },
    2: {
        bg: '#14C0FF33',
        c: '#049FD7',
        text: '运行中',
    },
    3: {
        bg: '#34c72433',
        c: '#2EA121',
        text: '检测成功',
    },
    8: {
        bg: '#1F23291A',
        c: '#646A73',
        text: '检测取消',
    },
};

const DEFAULT_STATUS_STYLE: StatusStyle = {
    bg: '#F54A4533',
    c: '#D83931',
    text: '检测失败',
};

/**
 * 获取检测状态样式信息
 * @param number 检测状态编号
 * @returns 状态样式对象
 */
export function getDetectStatusInfo(number: number): StatusStyle {
    return DETECT_STATUS_STYLE_MAP[number] || DEFAULT_STATUS_STYLE;
}

/**
 * 生成漏洞链接
 * @description 根据MPS ID或CVE ID生成漏洞详情页面的链接
 * @param {string | number | null} mpsId - MPS漏洞ID
 * @param {string | number | null} cveId - CVE漏洞ID
 * @returns {string} 漏洞详情页面的完整URL
 */
export const generateVulnLink = (mpsId: string | number | null, cveId: string | number | null): string => {
    const baseUrl = window.location.origin;
    const id = mpsId || cveId;
    return `${baseUrl}/hd/${id}`;
};

/**
 * 许可证风险等级信息
 */
interface LicenseLevel {
    color: string;
    text: string;
}

/**
 * 获取许可证风险等级信息
 * @description 根据风险等级标识返回对应的颜色和文本描述
 * @param {string} flag - 风险等级标识（High/Medium/Low/Safe）
 * @returns {LicenseLevel} 包含颜色和文本描述的风险等级信息
 */
export function getLicenseLevelTool(flag: string): LicenseLevel {
    const defaultLevel: LicenseLevel = {
        color: '#c7c7c780',
        text: '无风险',
    };

    const levelMap: Record<string, LicenseLevel> = {
        High: {
            color: 'rgb(243, 77, 61)',
            text: '高风险',
        },
        Medium: {
            color: 'rgb(255, 153, 64)',
            text: '中风险',
        },
        Low: {
            color: 'rgb(255, 204, 51)',
            text: '低风险',
        },
        Safe: {
            color: '#c7c7c7',
            text: '无风险',
        },
    };

    return levelMap[flag] || defaultLevel;
}

/**
 * 修复建议等级信息
 */
interface RepairLevel {
    color: string;
    bgc: string;
    text: string;
}

/**
 * 获取修复建议等级信息
 * @description 根据修复建议等级编号返回对应的样式和文本描述
 * @param {number} flag - 修复建议等级编号（2-4）
 * @returns {RepairLevel} 包含颜色、背景色和文本描述的修复建议信息
 */
export function getRepaireLevelTool(flag: number): RepairLevel {
    const defaultLevel: RepairLevel = {
        color: 'rgb(56, 199, 40)',
        bgc: '#4AC73C33',
        text: '无风险',
    };

    const levelMap: Record<number, RepairLevel> = {
        4: {
            color: '#D83931',
            bgc: '#F54A4533',
            text: '强烈建议修复',
        },
        3: {
            color: '#DE7802',
            bgc: '#FF880033',
            text: '建议修复',
        },
        2: {
            color: '#646A73',
            bgc: '#1F23291A',
            text: '可选修复',
        },
    };

    return levelMap[flag] || defaultLevel;
}

/**
 * 判断漏洞严重等级
 */
interface ColorResult {
    color: string;
    text: string;
    bgc: string;
}

interface LevelResult extends ColorResult {
    bgc: string;
}

/**
 * 修复建议等级颜色映射
 * @param flag 修复建议等级标识
 * @returns 包含颜色和文本的对象
 */
export function repaireChangeColor(flag: string): ColorResult {
    const colorMap: Record<string, ColorResult> = {
        StrongRecommend: { color: '#D83931', bgc: '#F54A4533', text: '强烈建议修复' },
        Recommend: { color: '#DE7802', bgc: '#FF880033', text: '建议修复' },
        Optional: { color: '#646A73', bgc: '#1F23291A', text: '可选修复' },
    };
    return colorMap[flag] || { color: '#06D7A1', bgc: '#4AC73C33', text: '无风险' };
}

/**
 * 危险等级判断
 * @param flag 危险等级标识（字符串或数字）
 * @returns 包含颜色、文本和背景色的对象
 */
export function getDangerLevel(flag: string | number): LevelResult {
    const defaultLevel: LevelResult = { color: '', text: '-', bgc: '' };

    const levelMap: Record<string | number, LevelResult> = {
        Critical: { color: '#F34D3D', text: '严重', bgc: '#F54A4533' },
        High: { color: '#FF9940', text: '高危', bgc: '#FF880033' },
        Medium: { color: '#FFCC33', text: '中危', bgc: '#FFC60A33' },
        Low: { color: '#D9D9D9', text: '低危', bgc: '#A3ACD633' },
        5: { color: '#F34D3D', text: '严重', bgc: '#F54A4533' },
        4: { color: '#FF9940', text: '高危', bgc: '#FF880033' },
        3: { color: '#FFCC33', text: '中危', bgc: '#FFC60A33' },
        2: { color: '#D9D9D9', text: '低危', bgc: '#A3ACD633' },
    };

    return levelMap[flag] || defaultLevel;
}

/**
 * 创建时间处理
 */
/**
 * 将时间转换为相对时间描述
 * @param time - ISO 8601格式的时间字符串或Date对象
 * @returns 相对时间描述字符串，如"3分钟"、"2小时"等
 */
export function transformTime(time: string | Date): string {
    try {
        const create = new Date(time).getTime() / 1000;
        const now = Date.now() / 1000;
        const diffTime = now - create;

        const timeUnits = [
            { threshold: 31536000, unit: '年', divisor: 31536000 },
            { threshold: 2592000, unit: '月', divisor: 2592000 },
            { threshold: 86400, unit: '天', divisor: 86400 },
            { threshold: 3600, unit: '小时', divisor: 3600 },
            { threshold: 60, unit: '分钟', divisor: 60 },
            { threshold: 0, unit: '秒', divisor: 1 },
        ];

        // eslint-disable-next-line no-restricted-syntax
        for (const { threshold, unit, divisor } of timeUnits) {
            if (diffTime >= threshold) {
                const value = Math.floor(diffTime / divisor);
                return `${value}${unit}`;
            }
        }

        return '刚刚';
    } catch (error) {
        console.error('Time transformation error:', error);
        return '';
    }
}
