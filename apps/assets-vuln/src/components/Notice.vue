<template>
    <a-drawer
        :closable="false"
        v-model:open="drawerOpen"
        class="custom-class"
        root-class-name="root-main-drawer"
        :root-style="{ color: 'blue' }"
        :maskStyle="{ background: 'transparent'}"
        style="color: red"
        placement="left"
        :forceRender="true"
        :getContainer='getMainContainer'
    >
        <div class="flex flex-col h-full"  @mouseenter="handleMouseEnter"
             @mouseleave="handleMouseLeave">
            <div class="w-full px-6 py-4 flex justify-between items-center border-bottom">
                <a-select @mouseenter="isHover = true" @mouseleave="isHover = false" :bordered="false" class="notify_select" :allowClear="false" v-model:value="notifySelectValue" :popupClassName="'notify_select_popup'"
                          @change="handleNotifySelectChange">
                    <a-select-option v-for="item in NOTIFY_SELECT_OPTION" :key="item.value" :value="item.value" :disabled="item.disabled">
                        <div class="flex items-center justify-between">
                            {{ item.label }}
                            <Svg class="check-icon" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
                        </div></a-select-option>
                    <template #suffixIcon>
                        <Svg class="normal" height="12px" width="12px" name="expand-down" :color="!isHover ? '#B3B3B3' : '#3C3C3C'"></Svg>
                    </template>
                </a-select>

                <div class="flex items-center gap-2">
                    <div @click="handleReadAll" class="text-button-blue px-1 py-0.5 hover:bg-[#E6E6E699]">全部已读</div>
                    <div class="icon-button-gray">
                        <Svg name="notice-setting_filled" width="14px" height="14px" color="#3C3C3C" @click="jumpToUrl('/notify-setting')"></Svg>
                    </div>
                </div>
            </div>
            <!-- 修改这个div的类名，使其填充剩余空间 -->
            <div v-if="!realEmpty" class="flex-1 w-full notice-scroll-container">
                <div v-for="(item, index) in noticeList" :key="index" class="px-6 py-4">
                    <div class="flex gap-2 flex-col">
                        <div class="flex gap-1.5 flex-row items-center h-6 cursor-pointer">
                            <Svg v-if="item.read" name="notice" width="20px" height="20px"></Svg>
                            <Svg v-else name="notice_unread" width="20px" height="20px"></Svg>
                            <div class="flex gap-1 items-center group">
                                <div class="shrink-0 text-[13px] font-medium leading-none tracking-[0px] align-middle text-gray-700">情报匹配到新安全风险通知</div>

                                <div class="truncate text-xs font-normal tracking-[0px] align-middle text-gary-300">{{'· ' + formatDate(item.created_at) }}</div>

                                <div v-if="!item.read" @click="handleReadSingle(item, index)" class="shrink-0 text-button-blue text-xs rounded-3 hidden group-hover:inline-flex">标为已读</div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1.5 p-4 bg-[#F2F2F280] rounded-[3px]">
                            <div v-for="content in CONTENT_LIST" :key="content.key" class="flex gap-1 text-xs ">
                                <span class="text-gray-700 whitespace-nowrap">
                                    {{ content.title }}：
                                </span>

                                <span v-if="content.title === '安全问题'" @click="jumpToUrl('/sec-issue/detail/' + getNestedValue(item, content.url_key))" class="text-purple-500 hover ellipsis">
                                    {{ getNestedValue(item, content.key) || '-' }}
                                </span>
                                <span v-else-if="content.title === '情报名称'" @click="jumpToUrl('/vuln-intel/detail/' + getNestedValue(item, content.url_key))" class="text-purple-500 hover ellipsis">
                                    {{ getNestedValue(item, content.key) || '-' }}
                                </span>
                                <span v-else-if="content.title === '安全问题所属应用'" class="text-gray-700">
                                    {{ getNestedValue(item, content.key) || '-' }}
                                    <span v-if="item.application.length > 1">
                                        <span class="text-gray-700">等{{ item.application.length }}个应用</span>
                                    </span>
                                </span>
                                <span v-else-if="content.title === '安全问题创建时间'" class="text-gray-700">
                                    {{ formatDate(getNestedValue(item, content.key)) || '-' }}
                                </span>
                                <span v-else-if="content.title === '安全问题级别'" class="text-gray-700">
                                    {{ SEC_LEVEL_OPTION.find((data) => data.value === getNestedValue(item, content.key))?.label || '-' }}
                                </span>
                                <span v-else class="text-gray-700">
                                    {{ getNestedValue(item, content.key) || '-' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div @click="getNoticeList(notice_params)" class="get-more-btn" :class="{ 'available': hasMore, 'unavailable': !hasMore }">
                    {{ hasMore ? '加载更多' : '没有更多了' }}
                </div>
            </div>
            <a-empty
                v-else
                class="flex-1 flex flex-col justify-center items-center text-[#2A2B32]"
                :image="simpleImage"
            />
        </div>

        <!-- 添加左侧连接区域，与NavDrawer一致 -->
        <div class="notice-connector"></div>
    </a-drawer>
</template>

<script setup>
import {
    ref, computed, onMounted, onBeforeUnmount,

    defineProps,
} from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { Empty } from 'ant-design-vue';
import { getNoticeListApi, readNoticeSingleApi, readNoticeBatchApi } from '@/api/notice';
import { formatDate, emitter } from '@/utils';
import { SEC_LEVEL_OPTION } from '@/constants/app.js';
import { navStore } from '@/view/navs/store';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const router = useRouter();
const props = defineProps(['open']);
const emit = defineEmits(['update:open']);

const hasMore = ref(true);

const noticeList = ref([]);

const isHover = ref(false);

const realEmpty = ref(false);

const NOTIFY_SELECT_OPTION = [
    {
        label: '全部通知',
        value: 'all',
    },
    {
        label: '仅三天内',
        value: 'three_days',
    },
];

// 近三天还是全部
const notifySelectValue = ref(NOTIFY_SELECT_OPTION[1].value);

// 获取通知列表的参数
const notice_params = ref({
    offset: computed(() => noticeList.value.length),
    limit: 15,
    since: computed(() => {
        if (notifySelectValue.value === 'three_days') {
            return dayjs().subtract(3, 'days').toDate();
        }
        return null;
    }),
});

const drawerOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value),
});

const CONTENT_LIST = [
    {
        key: 'issue.issue_title', // 访问issue对象下的issue_title
        url_key: 'issue.issue_id',
        title: '安全问题',
    },
    {
        key: 'issue.issue_level', // 访问issue对象下的issue_level
        title: '安全问题级别',
    },
    {
        key: 'issue.created_at', // 访问issue对象下的created_at
        title: '安全问题创建时间',

    },
    {
        key: 'application.0.application_name', // 访问application数组第一个元素的application_name
        title: '安全问题所属应用',
    },
    {
        key: 'vuln.title', // 访问vuln对象下的title
        url_key: 'vuln.vuln_uuid',
        title: '情报名称',
    },
    {
        key: 'vuln.vuln_uuid', // 访问vuln对象下的cve_id
        title: '情报编号',
    },
];

// 然后创建一个工具函数来访问这些嵌套属性
const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

const getMainContainer = () => document.querySelector('#main') || document.body;

const getNoticeList = async (params) => {
    const res = await getNoticeListApi(params);
    if (res.data.data.list.length === 0) {
        hasMore.value = false;
        if (noticeList.value.length === 0) {
            realEmpty.value = true;
        }
    } else {
        realEmpty.value = false;
        hasMore.value = true;
        noticeList.value = [...noticeList.value, ...res.data.data.list];
    }
};

const handleReadSingle = async (item, index) => {
    console.log(item, index);
    const res = await readNoticeSingleApi(item.id);
    console.log(res);
    if (res.data.code === 200) {
        noticeList.value[index].read = true;
    }
};

const jumpToUrl = (url) => {
    drawerOpen.value = false;
    router.push(url);
};

// 全部已读
const handleReadAll = async () => {
    const res = await readNoticeBatchApi({ since: notice_params.value.since });
    if (res.data.code === 200) {
        noticeList.value.forEach((item) => {
            item.read = true;
        });
    }
    emitter.emit('updateUnreadNoticeCount');
};

const handleNotifySelectChange = async () => {
    hasMore.value = true;
    if (notifySelectValue.value === 'three_days') {
        noticeList.value = noticeList.value.filter((item) => dayjs(item.created_at).isAfter(dayjs().subtract(3, 'days')));
    }
    await getNoticeList(notice_params.value);
};

// 添加鼠标悬停处理函数
const handleMouseEnter = () => {
    navStore.isHoveringDrawer = true;
    // 清除任何可能正在进行的关闭计时器
    if (navStore.closeTimer) {
        clearTimeout(navStore.closeTimer);
        navStore.closeTimer = null;
    }
};

// 鼠标离开处理函数
const handleMouseLeave = () => {
    navStore.isHoveringDrawer = false;
    // 添加延迟关闭
    navStore.closeTimer = setTimeout(() => {
        if (!navStore.isHoveringDrawer && !navStore.isHoveringNavItem) {
            navStore.noticeOpen = false;
        }
    }, 300);
};

let scrollTimer = null;
let handleScroll = null;

onMounted(async () => {
    await getNoticeList(notice_params.value);
    if (noticeList.value.length === 0) {
        notifySelectValue.value = NOTIFY_SELECT_OPTION[0].value;
        await getNoticeList(notice_params.value);
    }
    let container = null;
    try {
        container = document.querySelector('.notice-scroll-container');
    } catch (error) {
        console.log(error);
        console.log('绑定失败');
    }
    handleScroll = function handlescroll() {
        container.classList.add('notice-scrolling');
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            container.classList.remove('notice-scrolling');
        }, 800);
    };

    if (!container) {
        return;
    }
    console.log('绑定成功');
    container.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    const container = document.querySelector('.notice-scroll-container');
    if (container && handleScroll) {
        container.removeEventListener('scroll', handleScroll);
    }
});

</script>

<style>

.border-bottom{
    border-bottom: 1px solid #f2f2f2; /* 你可以根据需要调整颜色 */
}

.root-main-drawer {
    /* height: calc(100vh - 56px); */
    margin-top: auto;
    left: 64px !important;

    .ant-drawer-body {
        padding: 0;
    }

    /* 更精确地匹配二级菜单的阴影效果 */
    .ant-drawer-content-wrapper {
        box-shadow: none !important;
    }

    /* 完全移除左侧边框和阴影 */
    .ant-drawer-content {
        border-left: none;
        box-shadow: 8px 0px 36px rgba(31, 35, 41, 0.04),
                    8px 6px 24px rgba(31, 35, 41, 0.04) !important;
        border-radius: 0;
        overflow: hidden;
    }
}

/* 创建一个连接区域，扩大鼠标有效悬停范围 */
.notice-connector {
    position: absolute;
    left: -15px;
    top: 0;
    width: 15px;
    height: 100%;
    background-color: transparent;
    z-index: 1; /* 确保在内容上方 */
}

.notify_select {
    .ant-select-selector{
        background: none !important;
        padding: 0 !important;
        gap: 9px !important;
    }
}

.get-more-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 2px;
    color: #9CA3AF;
    font-weight: 400;
    font-size: 12px;
    margin-bottom: 16px;

    &.available {
        cursor: pointer;
    }

    &.unavailable {
        cursor: not-allowed;
    }
}

/* 你的滚动容器 */
.notice-scroll-container {
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.notice-scroll-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* 滚动时显示滚动条 */
.notice-scroll-container.notice-scrolling {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #bfbfbf #f2f2f2; /* Firefox */
}
.notice-scroll-container.notice-scrolling::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #f2f2f2;
}
.notice-scroll-container.notice-scrolling::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 4px;
}
</style>
