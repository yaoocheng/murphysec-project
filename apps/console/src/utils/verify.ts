import store from './store';

// 正则表达式常量
const REGEX = {
    // eslint-disable-next-line no-control-regex
    EMAIL: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    PHONE: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    SPECIAL_CHAR: /[!@#~$%^&*()+|_?.,<>="':;{}-]{1}$/,
    GIT_URL: /https{0,1}:\/\/([\w.]+\/?)\S*/,
};

// 公共验证函数
const validateRequired = (value: string, errorMsg = '此项不能为空') => {
    if (!value?.trim()) {
        return errorMsg;
    }
    return '';
};

/**
 * 团队名称校验
 */
export default function validateTeamValue(rule: any, value: any, callback: any) {
    const requiredError = validateRequired(value);
    if (requiredError) {
        return callback(requiredError);
    }

    if (value.length < 2 || value.length > 12) {
        return callback('团队名称需在2-12字符之间');
    }
}

/**
 * 邮箱校验
 */
export function validateEmail(rule: any, value: any, callback: any) {
    const requiredError = validateRequired(value);
    if (requiredError) {
        return callback(requiredError);
    }

    if (!REGEX.EMAIL.test(value.trim())) {
        return callback('邮箱格式不正确');
    }
}

/**
 * 手机校验
 */
export function validatePhone(rule: any, value: any, callback: any) {
    const requiredError = validateRequired(value);
    if (requiredError) {
        return callback(requiredError);
    }

    if (!REGEX.PHONE.test(value.trim())) {
        return callback('手机格式不正确');
    }
}

/**
 * 密码校验
 */
export function validatePassword(rule: any, value: any, callback: any) {
    const requiredError = validateRequired(value);
    if (requiredError) {
        return callback(requiredError);
    }

    if (!REGEX.SPECIAL_CHAR.test(value.trim()) && (value.length < 8 || value.length > 20)) {
        return callback('密码须8-20位，含至少一个特殊字符');
    }
}

/**
 * 账号邀请判定
 */
export function validateAccount(rule: any, value: string, callback: Function) {
    const requiredError = validateRequired(value, '最少输入3个字符');
    if (requiredError) {
        return callback(requiredError);
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length < 3) {
        return callback('最少输入3个字符');
    }

    if (store.envInfo.type === 'private' || trimmedValue.includes('@')) {
        if (!REGEX.EMAIL.test(trimmedValue)) {
            return callback('邮箱格式不正确');
        }
    } else if (!REGEX.PHONE.test(trimmedValue)) {
        return callback('手机格式不正确');
    }

    callback('');
}

/**
 * git url校验
 */
export function validateGitUrl(rule: any, value: string, callback: Function) {
    if (!REGEX.GIT_URL.test(value)) {
        return callback('地址格式不正确');
    }
}
