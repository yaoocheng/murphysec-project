<template>
    <a-drawer :headerStyle="{ display: 'none' }" :bodyStyle="{paddingBottom: 0}" :root-style="{
                  'z-index': '1001'
              }" placement="right" @close="$emit('update:open', false)" size="large"
              root-class-name="root-class-name member-drawer" :maskClosable="false">
        <div class="flex items-center justify-between mb-6">
            <div class="text-3c font-medium text-base">
                新增成员
            </div>
            <div class="flex items-center gap-1">
                <span @click="$emit('update:open', false)" class="text-button-gray w-6 h-6">
                    <Svg name="drawer_close" class="cursor-pointer" color="#999999"></Svg>
                </span>
            </div>
        </div>

        <div class="h-[calc(100%-50px)] flex rounded border border-solid border-[#E6E6E6]">
            <!-- 左侧候选列表 -->
            <div class="flex-1 h-full border border-gray-200 rounded">
                <div class="p-4">
                    <Input v-model:value="searchKeyword" placeholder="搜索姓名/邮箱" class="w-full base-input" @input="handleSearchInput" />
                </div>

                <div
                    ref="candidateListRef"
                    class="candidate-list max-h-[calc(100%-64px)] overflow-y-auto"
                    @scroll="handleScroll"
                >
                    <div
                        v-for="item in displayedCandidates"
                        :key="item.account_id"
                        class="flex items-center h-[50px] py-1 px-[10px] hover:bg-[#f2f2f2] cursor-pointer rounded"
                        @click="selectMember(item)"
                    >
                        <a-avatar class="w-8 h-8 mr-2">
                            {{ (item.nickname)?.slice(0, 1) }}
                        </a-avatar>
                        <div class="flex-1 w-0 text-3c ">
                            <div class="font-normal text-sm w-full truncate">{{ item.nickname }} ({{ item.email }})</div>
                            <div class="text-xs text-99 w-full truncate">
                                <span v-for="org in item.organizes" :key="org">{{ org.organize_name }}</span>
                                <span v-if="!item.organizes?.length">-</span>
                            </div>
                        </div>
                        <CheckOutlined v-if="isSelected(item.account_id)" class="text-primary ml-2" />
                    </div>

                    <!-- 加载状态提示 -->
                    <div v-if="loading" class="flex justify-center py-4">
                        <span class="text-99 text-sm">加载中...</span>
                    </div>

                    <!-- 没有更多数据提示 -->
                    <!-- <div v-if="!hasMoreData && candidateMembers.length > 0 && !loading" class="flex justify-center py-4">
                        <span class="text-99 text-sm">没有更多数据</span>
                    </div> -->

                    <!-- 暂无数据提示 -->
                    <div v-if="candidateMembers.length === 0 && !loading" class="flex justify-center py-8">
                        <span class="text-99 text-sm">没有找到相关的内容</span>
                    </div>
                </div>
            </div>

            <a-divider type="vertical" class="h-full mx-0" />

            <!-- 右侧已选列表 -->
            <div class="flex-1">
                <div class="flex items-center justify-between p-4 text-sm pt-5">
                    <span class="text-sm">已选: {{ selectedMembers.length }}人</span>
                    <div  v-if="selectedMembers.length > 0" class="text-button-blue"  @click="clearAll">
                        <span>全部清除</span>
                    </div>
                </div>

                <div class="selected-list max-h-[calc(100%-64px)] overflow-y-auto">
                    <div
                        v-for="item in selectedMembers"
                        :key="item.account_id"
                        class="flex items-center h-[50px] py-1 px-[10px] hover:bg-[#f2f2f2] cursor-pointer rounded"
                        @click="selectMember(item)"
                    >
                        <a-avatar class="w-8 h-8 mr-2">
                            {{ (item.nickname)?.slice(0, 1) }}
                        </a-avatar>
                        <div class="flex-1 w-0 text-3c">
                            <div class="font-normal text-sm w-full truncate">{{ item.nickname }} ({{ item.email }})</div>
                            <div class="text-xs text-99 w-full truncate">
                                <span v-for="org in item.organizes" :key="org">{{ org.organize_name }}</span>
                                <span v-if="!item.organizes?.length">-</span>
                            </div>
                        </div>
                        <span @click.stop="removeMember(item.account_id)" class="icon-hover h-6 hover:bg-[#E6E6E6] cursor-pointer">
                            <CloseOutlined class="text-99 text-base" />
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <a-button class="text-xs h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button :disabled="selectedMembers.length === 0" class="text-sm h-8 rounded-3 bg-primary text-white" @click="handleSave">保存</a-button>
            </div>
        </template>
    </a-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { getNotUserListApi, addRoleUserApi } from 'api/user';
import { message } from 'ant-design-vue';

const { roleId } = defineProps({
    roleId: {
        type: String,
        default: '',
    },
});
// Emits
const emit = defineEmits(['update:open', 'save']);

// 响应式数据
const searchKeyword = ref();
const selectedMembers = ref([]);
const candidateListRef = ref(null);
const loading = ref(false);
const pageSize = ref(50);
const page = ref(1);
const hasMoreData = ref(true);
const candidateMembers = ref([]);

// 当前显示的候选人列表（直接使用API返回的数据）
const displayedCandidates = computed(() => candidateMembers.value);

// 获取用户列表
const fetchUserList = async (isLoadMore = false) => {
    if (loading.value) return;

    loading.value = true;
    try {
        const { data } = await getNotUserListApi({
            page: page.value,
            limit: pageSize.value,
            name: searchKeyword.value,
            role_id: roleId,
        });

        if (data.data?.data_list) {
            const newUsers = data.data.data_list || [];

            if (isLoadMore) {
                candidateMembers.value = [...candidateMembers.value, ...newUsers];
            } else {
                candidateMembers.value = newUsers;
            }

            // 检查是否还有更多数据
            hasMoreData.value = newUsers.length === pageSize.value;
        }
    } catch (error) {
        console.error('获取用户列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 滚动加载处理
const handleScroll = async (event) => {
    const { target } = event;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // 当滚动到底部附近时加载更多
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreData.value && !loading.value) {
        page.value += 1;
        await fetchUserList(true);
    }
};

// 添加搜索输入处理
let searchTimer = null;
const handleSearchInput = async () => {
    // 清除之前的定时器
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    // 设置新的定时器，300ms后执行搜索
    searchTimer = setTimeout(async () => {
        // 搜索前清空候选列表
        candidateMembers.value = [];
        page.value = 1;
        hasMoreData.value = true;
        await fetchUserList(false);
    }, 150);
};

// 检查是否已选中
const isSelected = (memberId) => selectedMembers.value.find((item) => item.account_id === memberId);

const selectMember = (member) => {
    const existingIndex = selectedMembers.value.findIndex((item) => item.account_id === member.account_id);
    if (existingIndex === -1) {
        selectedMembers.value.push(member);
    } else {
        selectedMembers.value.splice(existingIndex, 1);
    }
};

const removeMember = (memberId) => {
    const index = selectedMembers.value.findIndex((item) => item.account_id === memberId);
    if (index > -1) {
        selectedMembers.value.splice(index, 1);
    }
};

const clearAll = () => {
    selectedMembers.value = [];
};

const handleSave = async () => {
    try {
        await addRoleUserApi({
            role_id: roleId,
            account_id: selectedMembers.value.map((item) => item.account_id),
        });
        emit('save');
        message.success('添加成功');
    } catch (error) {
        console.error(error);
    }
    emit('update:open', false);
};

// 组件挂载时获取初始数据
onMounted(() => {
    fetchUserList();
});

</script>

<style lang="less">
.root-class-name.member-drawer .ant-drawer-content-wrapper {
    width: 610px !important;
}
</style>
