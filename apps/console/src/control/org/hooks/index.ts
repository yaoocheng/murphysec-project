import { getOrgTreeApi, getTeamInfoApi, getUserAuthApi } from 'api/org';
import { ref, watch } from 'vue';
import {
    getUserInfo, localStorageUtil, encrypt,
} from 'util/tools';
import store from 'util/store';

export const curOrgInfo = ref<any>({
    id: 2,
    path: '1,2,',
});

// 懒加载树
export const loadTreeNode = async (node: any, resolve: Function) => {
    const { data } = await getOrgTreeApi({
        org_id: node.data?.id || 1,
    });
    resolve(data);
};

// 点击组织
export const treeNodeClick = (data: any) => {
    curOrgInfo.value = data;
};

export const orgHooks = (reqFn: Function = () => { }, reqBody: any = null) => {
    // 总数
    const total = ref<number>(0);
    // 当前页
    const curPage = ref<number>(1);
    // 列表数据
    const listData = ref<Array<any>>([]);
    // 是否无值
    const isHaveData = ref<boolean>(true);

    // 获取数据
    const getData = async () => {
        try {
            const res = await reqFn({
                page: curPage.value,
                limit: 10,
                ...reqBody.value,
            });

            listData.value = Object.values(res.data?.list || res.data || []);
            total.value = res.data?.total || 0;
            isHaveData.value = listData.value.length > 0;
        } catch (error) {
            console.log(error);
        }
    };
    if (reqBody) {
        getData();

        // 分页监听
        watch(curPage, () => {
            getData();
        });

        // 监听组织变化
        watch(curOrgInfo, (newVal) => {
            Object.assign(reqBody.value, {
                org_id: newVal.id,
                org_path: newVal.path,
            });
        });

        // 参数监听
        watch(reqBody.value, () => {
            curPage.value = 1;
            getData();
        });
    }
    return {
        total,
        curPage,
        listData,
        isHaveData,
        getData,
        treeNodeClick,
    };
};

// 当前团队信息
export const getCurTeamInfo = (teamId: string) => {
    const curTeamInfo = ref<any>({});

    const excReqApi = async () => {
        try {
            const { data } = await getTeamInfoApi({ team_id: teamId });
            curTeamInfo.value = data;
        } catch (error) {
            console.log(error);
        }
    };
    excReqApi();

    return curTeamInfo;
};

// 获取登录用户角色
export const getCurRole = (orgList: number[] = [], teamList: string[] = []) => {
    const userInfo = getUserInfo() || {};

    if (userInfo?.role_id > 0 && userInfo?.is_sys === 1 && userInfo?.is_all_menu === 1) {
        return 'SA'; // 超管
    }
    if (userInfo?.role_id > 0 && userInfo?.is_sys === 1 && userInfo?.is_all_menu === -1) {
        return 'SM'; // 安全管理员
    }
    if (userInfo?.role_id > 0 && userInfo?.is_sys === 1 && userInfo?.is_all_menu === 0) {
        return 'SAU'; // 安全审计
    }
    if (userInfo?.is_sys !== 1 && userInfo?.role_id > 1) {
        return 'Custom'; // 自定义
    }
    if (orgList.includes(store.teamInfo?.org_id)) {
        return 'GA'; // 组织管
    }
    if (teamList.includes(store.teamInfo?.team_id)) {
        return 'TA'; // 团队管
    }
    return 'Normal'; // 普通
};

// 获取权限信息进行判断
export const getOrgAuthInfo = () => {
    const ownerOrgIDList = ref<number[]>([]);
    const ownerTeamIDList = ref<string[]>([]);
    const normalTeamAuth = ref<boolean>(true);
    const isUserSpace = ref<boolean>(true);
    const userRole = ref<any>('');
    const orgManage = ref();
    const teamManage = ref();

    const ownerAllTeamIDList = ref<string[]>([]);
    // const getUserTeamAndOrgList = async () => {
    const userInfo = getUserInfo() || {};
    // const { data } = await getUserAuthApi();
    ownerAllTeamIDList.value = Object.keys(userInfo?.team_list || {});

    // ownerOrgIDList.value.length = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in userInfo?.org_list) {
        if (userInfo?.org_list[key]) {
            ownerOrgIDList.value.push(Number(key));
        }
    }

    // ownerTeamIDList.value.length = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in userInfo?.team_list) {
        if (userInfo?.team_list[key]) {
            ownerTeamIDList.value.push(key);
        }
    }

    userRole.value = getCurRole(ownerOrgIDList.value, ownerTeamIDList.value);

    // 普通团队权限
    normalTeamAuth.value = (!store.isAllTeam) && (userRole.value === 'SA' || ownerOrgIDList.value.includes(store.teamInfo?.org_id) || ownerTeamIDList.value.includes(store.teamInfo?.team_id));

    // 组织负责人
    orgManage.value = ownerOrgIDList.value.includes(store.teamInfo?.org_id);

    // 团队负责人
    teamManage.value = ownerTeamIDList.value.includes(store.teamInfo?.team_id);
    // };
    // getUserTeamAndOrgList();

    isUserSpace.value = getUserInfo()?.private_team_id === (localStorageUtil('get', 'g-t'))?.team_id;

    return {
        ownerOrgIDList, // 负责的组织
        ownerTeamIDList, // 负责的团队
        normalTeamAuth, // 普通团队权限
        isUserSpace, // 个人空间
        userRole, // 用户角色
        orgManage,
        teamManage,
        ownerAllTeamIDList,
    };
};

export const updateUserManage = async () => {
    try {
        const { data } = await getUserAuthApi();
        const info = {
            ...getUserInfo(),
            org_list: data?.organize_list,
            team_list: data?.team_list,
        };
        localStorageUtil('set', 'g-u', encrypt(info));
        store.userInfo = info;
    } catch (error) {
        console.log(error);
    }
};
