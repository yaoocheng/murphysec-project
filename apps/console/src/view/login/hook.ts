import { encrypt, localStorageUtil } from 'util/tools';
import { getUserAuthApi, editInfoOrgApi } from 'api/org';
import store, { detectInfo } from '@/utils/store';
import { loginApi } from '@/api/team';

// 用户信息接口定义
interface UserInfo {
    token: string;
    user_info?: {
        private_team_id?: string;
    };
    organize_list: Record<string, boolean>;
    team_list: Record<string, boolean>;
}

// 团队信息接口定义
interface TeamInfo {
    team_id: string;
    org_id: number;
}

/**
 * 处理团队和组织ID的逻辑
 * @param authData 用户认证数据
 * @returns 返回团队信息或标记无团队
 */
const processTeamInfo = async (authData: UserInfo): Promise<true | TeamInfo> => {
    // 开启个人空间
    if (authData.user_info?.private_team_id) {
        return {
            team_id: authData.user_info.private_team_id,
            org_id: 1,
        };
    }
    // 非个人空间但加入团队
    if (Object.keys(authData.team_list || {}).length) {
        const teamarr = Object.keys(authData.team_list).sort();
        return {
            team_id: teamarr[0],
            org_id: 1,
        };
    }
    // 非个人空间非加入团队 但组织负责人
    if (Object.keys(authData.organize_list || {}).length) {
        const orgValues = Object.values(authData.organize_list);
        const isGA = orgValues.some((item: any) => item);

        if (isGA) {
            store.isAllTeam = true;
            let findKey:number;
            // eslint-disable-next-line no-restricted-syntax
            for (const key in authData.organize_list) {
                if (authData.organize_list[key]) {
                    findKey = Number(key);
                    break;
                }
            }
            const { data } = await editInfoOrgApi(findKey);
            localStorageUtil('set', 'cur-click-org-name', data.name);
            localStorageUtil('set', 'cur-click-path', data.path);

            return {
                team_id: '-1',
                org_id: findKey,
            };
        }
    }

    return true;
};

/**
 * 获取并处理组织用户信息
 * @param ticket 登录票据
 * @returns 如果用户没有团队返回true，否则返回undefined
 */
// eslint-disable-next-line import/prefer-default-export
export const getOrgUserInfo = async (ticket: string): Promise<boolean | void> => {
    try {
        // 获取登录token
        const res = await loginApi({ ticket });
        const data = { token: res.data.token };

        localStorageUtil('set', 'enforce_password_changed', res.data.user?.enforce_password_changed);

        // 存储初始用户信息
        localStorageUtil('set', 'g-u', encrypt(data));
        store.userInfo = data;

        // 获取用户权限信息
        const { data: authData } = await getUserAuthApi();

        const info = {
            ...data,
            ...authData.user_info,
            org_list: authData.organize_list,
            team_list: authData.team_list,
        };

        // 更新存储的用户信息
        localStorageUtil('set', 'g-u', encrypt(info));
        store.userInfo = info;

        // 处理团队信息
        const teamInfo = await processTeamInfo(authData);
        if (teamInfo === true) {
            return true;
        }

        // 存储团队信息
        localStorageUtil('set', 'g-t', teamInfo);
        store.teamInfo = teamInfo;
        detectInfo.team_id = teamInfo.team_id;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('获取组织用户信息失败:', error);
        throw error; // 向上传递错误，由调用方统一处理
    }
};
