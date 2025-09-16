<template>
    <a-select @popupScroll="handleScroll" @search="handleSearch" @change="handleChange" :allowClear="true" :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
              :loading="loading || searchLoading" :popupClassName="popupClassName" :filterOption="false" placeholder="请输入用户名搜索">
        <a-select-option v-for="item in userList?.map(item => ({
            label: item.organize_nick_name,
            value: item.organize_user_id,
            email: item.organize_user_enterprise_email,
            organize_name: item.organize_name
        }))" :key="item.value" :value="item.value" :disabled="item.disabled" :label="item.label">
            <div class="flex items-center justify-between">
                <div class="choice flex items-center flex-row">
                    <a-avatar :size=32 class="mr-3">
                        {{ item.label.charAt(0) }}
                    </a-avatar>
                    <div class="flex justify-center flex-col">
                        <span>
                            {{ item.label }} （{{ item.email }}）
                        </span>
                        <span class="text-gary-400">
                            {{ Array.isArray(item.organize_name) ? (item.organize_name[0] || '-') :  item.organize_name }}
                        </span>
                    </div>
                </div>

                <span class="value">
                    {{ item.label }}
                </span>

                <Svg class="check-icon" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
            </div>
        </a-select-option>
        <template #suffixIcon>
            <Svg :height="iconSize" :width="iconSize" name="select-suffix" color="#999999"></Svg>
        </template>
    </a-select>
</template>

<script setup>
import { onBeforeMount, ref, computed } from 'vue';
import { getUserListApi, getContractUserListApi } from 'api/org';
import { useRoute } from 'vue-router';
// import { globalState } from '@/store';

const route = useRoute();
const isInviteCollaboration = computed(() => route.path.includes('/invite-collaboration'));

const {
    iconSize, popupClassName, editShowName, userid,
} = defineProps({
    iconSize: {
        type: String,
        default: '12px',
    },
    popupClassName: {
        type: String,
        default: '',
    },
    editShowName: {
        type: Object,
        default: null,
    },
    userid: {
        type: String,
        default: null,
    },
});
console.log(userid, '213123');
const page = ref(1);
// const pageSize = 50;
const loading = ref(false);
const eidtUser = ref({});
const userList = ref([]);
const searchKeyword = ref('');
const searchLoading = ref(false);

const getUserList = async (isSearch = false, keyword = '') => {
    if (isSearch) {
        searchLoading.value = true;
    } else {
        loading.value = true;
    }

    try {
        const params = {
            page: isSearch ? 1 : page.value,
            limit: 50,
        };

        if (keyword) {
            params.user_name = keyword;
        }

        // 根据路由判断使用不同的API
        if (isInviteCollaboration.value && route.params.id) {
            params.id = route.params.id;
        }

        const apiFunction = isInviteCollaboration.value ? getContractUserListApi : getUserListApi;
        const { data } = await apiFunction(params);
        let filterData = [];
        // const filterData = data.data?.filter((item) => ((item.organize_user_id !== editShowName?.organize_user_id && item.organize_user_id !== userid))) || [];

        if (isSearch) {
            // userList.value = editShowName ? [editShowName, ...filterData] : filterData;
            userList.value = data.data;
            page.value = 2; // 重置分页
        } else {
            filterData = data.data?.filter((item) => ((item.organize_user_id !== eidtUser.value?.organize_user_id))) || [];
            userList.value.push(...filterData);
            page.value++;
        }

        if (isSearch) {
            searchLoading.value = false;
        } else {
            loading.value = false;
        }
    } catch (error) {
        console.log(error);
        if (isSearch) {
            searchLoading.value = false;
        } else {
            loading.value = false;
        }
    }
};

const handleScroll = (e) => {
    const { target } = e;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10 && !loading.value && !searchLoading.value) {
        getUserList(false, searchKeyword.value);
    }
};

const handleChange = () => {
    userList.value = [];
    page.value = 1;
    getUserList();
};

// 搜索防抖
let searchTimer = null;
const handleSearch = (value) => {
    searchKeyword.value = value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        getUserList(true, value);
    }, 300);
};

// ID查询编辑的人
const queryEditUser = async () => {
    if (editShowName?.organize_user_id || userid) {
        try {
            const params = {
                page: 1,
                limit: 10,
                organize_user_id: editShowName?.organize_user_id || userid,
            };

            // 根据路由判断使用不同的API
            if (isInviteCollaboration.value && route.params.id) {
                params.id = route.params.id;
            }

            const apiFunction = isInviteCollaboration.value ? getContractUserListApi : getUserListApi;
            const { data } = await apiFunction(params);
            [eidtUser.value] = data.data;
            userList.value.push(eidtUser.value);
            getUserList();
        } catch (error) {
            console.log(error);
        }
    } else {
        getUserList();
    }
};

onBeforeMount(async () => {
    queryEditUser();
});

</script>
