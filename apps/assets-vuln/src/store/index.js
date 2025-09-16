import { createGlobalState, useStorage } from '@vueuse/core';
import { reactive } from 'vue';

const useState = createGlobalState(() => {
    const userInfo = reactive(useStorage('g-u', {}));
    const authModuleNavs = reactive(useStorage('g-m', []));

    const globalState = reactive({
        loading: false,
        userList: [],
        orgTree: [],
    });

    return { userInfo, globalState, authModuleNavs };
});

export const { userInfo, globalState, authModuleNavs } = useState();

// export const getUserList = async () => {
//     if (!globalState.userList.length) {
//         try {
//             const { data } = await getUserListApi({
//                 page: 1,
//                 limit: 100,
//             });
//             globalState.userList = [...data.data];
//         } catch (error) {
//             console.log(error);
//         }
//     }
// };

// export const getOrgTree = async () => {
//     if (!globalState.orgTree.length) {
//         try {
//             const { data } = await getOrgTreeSelectDataApi();
//             globalState.orgTree = data.data.data_list;
//         } catch (error) {
//             console.log(error);
//         }
//     }
// };
