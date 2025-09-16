import {
    setBindGithub, wechatSetBind, getVerifyCode, setBindGiteeApi,
} from '@/api/user';
import { updateUserInfoHandle, showMessage } from './tools';

/**
 * 跳转登录
 */
export function jumpLogin(callbackUrl: string) {
    let href = '';
    if (window.location.hostname.includes('test')) {
        href = 'https://login.test.murphysec.com';
    } else if (window.location.hostname.includes('murphysec')) {
        href = 'https://login.murphysec.com';
    } else {
        href = 'http://192.168.2.35:3003';
    }

    window.location.href = `${href}/login?href=${callbackUrl}&type=saas`;
}

/**
 * github认证  绑定GitHub 微信，跳第三方拿code返回进行绑定
 * toUrl 授权失效自动去授权
 */
export function githubVerify(isWrite: string = '', toUrl:string = '') {
    const authUri = 'https://github.com/login/oauth/authorize';
    const stateUrl = toUrl ? `${window.location.origin}${toUrl}` : `${window.location.origin}/console/detect-access?from=github`;

    let clientId: string = '';
    if (window.location.hostname.includes('test.murphysec')) {
        clientId = 'c16bab601fbe13a5e82b';
    } else if (window.location.hostname.includes('murphysec')) {
        clientId = 'd7e5b6d52371caa8b6c0';
    } else {
        clientId = '6b8ea853a176399dc388';
    }
    window.location.href = isWrite ? `${authUri}?client_id=${clientId}&scope=user:email%2Cpublic_repo&redirect_uri=&state=${stateUrl}` : `${authUri}?client_id=${clientId}&scope=user:email&redirect_uri=&state=${stateUrl}`;
}

/**
 * gitee认证
 */
export function giteeVerify(toUrl: string = '') {
    const authUri = 'https://gitee.com/oauth/authorize';
    const stateUrl = toUrl ? `${window.location.origin}${toUrl}` : `${window.location.origin}/console/detect-access?from=gitee`;

    let clientId = '';
    let redirectUri = ''; // 中间页

    if (window.location.hostname.includes('test.murphysec')) {
        redirectUri = 'https://login.test.murphysec.com/mid?type=saas';
        clientId = '9f2fa7ab146bdc300ee789c7a43bd11047f68e7223d33e3a7c8d02613f9e5840';
    } else if (window.location.hostname.includes('murphysec')) {
        redirectUri = 'https://login.murphysec.com/mid?type=saas';
        clientId = 'ca1793e95d038d568ddb3eb2d40b3866168564122a8659aff26a3fa25c7cceb1';
    } else {
        redirectUri = 'http://192.168.2.35:3003/mid?type=saas';
    }
    window.location.href = `${authUri}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${encodeURIComponent(stateUrl)}`;
}

/**
 * 微信认证  绑定GitHub 微信，跳第三方拿code返回进行绑定
 */
export function wechatVerify() {
    let redurl: string = '';
    if (window.location.hostname.includes('test.murphysec')) {
        redurl = 'https://login.test.murphysec.com/mid';
    } else if (window.location.hostname.includes('murphysec')) {
        redurl = 'https://login.murphysec.com/mid';
    }
    window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=wxd447c685077334b9&redirect_uri=${encodeURIComponent(redurl)}&response_type=code&scope=snsapi_login&state=${window.location.origin}${window.location.pathname}?from=wechat`;
}

/**
 * 绑定github
 */
export async function bindGithubHandle(code: string, githubAccess: string) {
    try {
        const res = await setBindGithub({ github_code: code, github_access: githubAccess });
        if (res.data.code === 200) {
            return await updateUserInfoHandle();
        }
    } catch (error) {
        // console.log(error);
    }
}

/**
 * 绑定gitee 授权后返回先绑定后更新用户信息
 */
export async function bindGiteeHandle(code: string) {
    try {
        let redirectUrl = ''; // 中间页
        if (window.location.hostname.includes('test.murphysec')) {
            redirectUrl = 'https://login.test.murphysec.com/mid?type=saas';
        } else if (window.location.hostname.includes('murphysec')) {
            redirectUrl = 'https://login.murphysec.com/mid?type=saas';
        } else {
            redirectUrl = 'http://192.168.2.35:3003/mid?type=saas';
        }
        const res = await setBindGiteeApi({
            gitee_code: code,
            redirect_type: 'saas',
            gitee_redirect_url: redirectUrl, // 固定值 gitee的链接
            redirect_url: window.location.href, // 中间页返回的值
        });
        if (res.data.code === 200) {
            return await updateUserInfoHandle();
        }
    } catch (error) {
        // console.log(error);
    }
}

/**
 * 绑定wechat
 */
export async function bindWechat(code: string) {
    try {
        const res = await wechatSetBind({ wechat_code: code });
        if (res.data.code === 200) {
            return await updateUserInfoHandle();
        }
    } catch (error) {
        // console.log(error);
    }
}

/**
 * 图像验证码 获取验证码
 */
export function openCaptcha(callback: any) {
    function loadErrorCallback() {
        showMessage('图形验证码加载错误，请稍后重试', 'error');
    }
    try {
        const captcha = new (window as any).TencentCaptcha('2079252434', callback);
        // 调用方法，显示验证码
        captcha.show();
    } catch (error) {
        // 加载异常，调用验证码js加载错误
        loadErrorCallback();
    }
}

/**
 * 获取验证码
 */
export function getVerifyCodeHandle(account: string, type: string, countDown: any) {
    openCaptcha(async (graphicsRes: any) => {
        try {
            const res = await getVerifyCode({
                account, // 账号 邮箱或手机号 后端判断
                type, // 类型 register-注册  forget-忘记密码  bind-绑定
                randstr: graphicsRes.randstr,
                ticket: graphicsRes.ticket,
            });
            if (res.data.code === 200) {
                showMessage('发送成功', 'success');
                // eslint-disable-next-line no-param-reassign
                countDown.value = 60;
                const timer = setInterval(() => {
                    if (countDown.value === 1) {
                        clearInterval(timer);
                    }
                    // eslint-disable-next-line no-param-reassign
                    countDown.value -= 1;
                }, 1000);
            }
        } catch (error) {
            // console.log(error);
        }
    });
}
