<template>
    <CommonHead>
        <div class="common_bread">
            <img @click="openDetail({ name: $route.query.name, ecosystem: $route.query.ecosystem, repository: $route.query.repository })"
                class="shrink" src="~ast/img/back.png" alt="">
            <span>软件包版本详情</span>
        </div>
    </CommonHead>

    <div style="height: calc(100% - 56px);" class="bg-f7 p-6 box-border">
        <div class="flex items-center py-4 px-6 mb-2 bg-white border rounded-md">
            <img class="w-[62px] mr-2" :src="ecosystem[$route.query.ecosystem]?.img" alt="">
            <div class="flex flex-col">
                <span class="text-2xl mb-[6px] text-3c font-medium flex items-center">
                    <span
                        @click="openDetail({ name: $route.query.name, ecosystem: $route.query.ecosystem, repository: $route.query.repository })"
                        class="hover:text-primary hover:underline cursor-pointer">{{
                            $route.query.name }}</span>
                    <i class="murphy icon-youjiantou11" style="font-size: 24px;font-weight: bold;"></i>
                    {{ $route.query.version }}
                </span>
                <div class="flex items-center text-85 text-xs">
                    <span>版本数量：
                        <span class="hover:text-primary hover:underline cursor-pointer"
                            @click="openDetail({ name: $route.query.name, ecosystem: $route.query.ecosystem, repository: $route.query.repository })">
                            {{ versionInfo.version_total }}
                        </span>
                    </span>
                    <el-divider direction="vertical" class="mx-2" />
                    <span>生态系统类型：{{ ecosystem[$route.query.ecosystem].name }}</span>
                </div>
            </div>
        </div>

        <div style="height: calc(100% - 98px);" class="flex text-3c bg-ff p-6 pt-3 box-border rounded-md">
            <div class="flex-1 pr-6 w-0" style="border-right: 1px solid #2A2B321A;">
                <el-tabs v-model="activeTab">
                    <el-tab-pane :lazy="true" label="项目使用列表" name="1">
                        <ProjectUse />
                    </el-tab-pane>
                    <el-tab-pane :lazy="true" label="漏洞列表" name="2">
                        <VulnInfo />
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!-- right -->
            <div class="w-[354px] overflow-auto pl-6 pt-3 text-3c font-normal">
                <el-tooltip effect="light" placement="top">
                    <div class="h-10 flex mb-4">
                        <div :style="{ backgroundColor: getRepaireLevelTool(versionInfo.suggest).color }"
                            class="w-[68px] text-center leading-[40px]">
                            <i v-if="versionInfo.suggest >= 2" class="murphy icon-jinggao1 text-ff"
                                style="font-size: 22px;"></i>
                            <i v-else class="murphy icon-anquan3 text-ff" style="font-size: 20px;"></i>
                        </div>
                        <div :style="{ backgroundColor: getRepaireLevelTool(versionInfo.suggest).bgc, color: getRepaireLevelTool(versionInfo.suggest).color }"
                            class="font-semibold flex-1 text-center leading-[40px]">
                            {{ getRepaireLevelTool(versionInfo.suggest).text }}
                        </div>
                    </div>

                    <template #content>
                        <SuggestTips :text="getRepaireLevelTool(versionInfo.suggest).text" />
                    </template>
                </el-tooltip>

                <div class="severity-container mb-8">
                    <div class="severity-item severity-critical">
                        <span class="label" :style="{ backgroundColor: versionInfo.vuln_total?.critical_vulns > 0 ? '#F34D3D' : '#EBEBEB' }">C</span>
                        <span class="value" :style="{ backgroundColor: versionInfo.vuln_total?.critical_vulns > 0 ? '#F54A4533' : '#C7C7C733', color: versionInfo.vuln_total?.critical_vulns > 0 ? '#F34D3D' : '#C7C7C7' }">{{ versionInfo.vuln_total?.critical_vulns || 0 }}</span>
                    </div>
                    <div class="severity-item severity-high">
                        <span class="label" :style="{ backgroundColor: versionInfo.vuln_total?.high_vulns > 0 ? '#ff9800' : '#EBEBEB' }">H</span>
                        <span class="value" :style="{ backgroundColor: versionInfo.vuln_total?.high_vulns > 0 ? '#FF994033' : '#C7C7C733', color: versionInfo.vuln_total?.high_vulns > 0 ? '#ff9800' : '#C7C7C7' }">{{ versionInfo.vuln_total?.high_vulns || 0 }}</span>
                    </div>
                    <div class="severity-item severity-medium">
                        <span class="label" :style="{ backgroundColor: versionInfo.vuln_total?.medium_vulns > 0 ? '#ffc107' : '#EBEBEB' }">M</span>
                        <span class="value" :style="{ backgroundColor: versionInfo.vuln_total?.medium_vulns > 0 ? '#FFCC3333' : '#C7C7C733', color: versionInfo.vuln_total?.medium_vulns > 0 ? '#ffc107' : '#C7C7C7' }">{{ versionInfo.vuln_total?.medium_vulns || 0 }}</span>
                    </div>
                    <div class="severity-item severity-low">
                        <span class="label" :style="{ backgroundColor: versionInfo.vuln_total?.low_vulns > 0 ? '#A7AECC' : '#EBEBEB' }">L</span>
                        <span class="value" :style="{ backgroundColor: versionInfo.vuln_total?.low_vulns > 0 ? '#A7AECC33' : '#C7C7C733', color: versionInfo.vuln_total?.low_vulns > 0 ? '#A7AECC' : '#C7C7C7' }">{{ versionInfo.vuln_total?.low_vulns || 0 }}</span>
                    </div>
                </div>

                <div class="mb-4">
                    基本信息
                </div>
                <div class="text-sm mb-3">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">许可证</p>
                    <p>
                        <span v-for="(item, i) in versionInfo.licenses" :key="item">
                            {{ item }}<span v-if="i !== versionInfo.licenses?.length - 1">、</span>
                        </span>
                        <span v-if="!versionInfo.licenses?.length">-</span>
                    </p>
                </div>
                <div class="text-sm mb-3">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">PURL</p>
                    <p v-if="versionInfo.purl" class="flex items-center link h-5">
                        <span class=" text-3c ellipsis">{{ versionInfo.purl }}</span>
                        <span id="copy_url" @click="copyFunc('#copy_url')" :data-clipboard-text="versionInfo.purl"
                            class="hover_icon px-[4px] py-[2px]">
                            <i class="murphy icon-fuzhi1 text-3c cursor-pointer text-xs"></i>
                        </span>
                    </p>
                    <p v-else>-</p>
                </div>
                <div class="text-sm mb-3">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">软件包官方地址</p>
                    <p v-if="versionInfo.url" class="flex items-center link h-5">
                        <a target="_blank" class=" text-3c ellipsis" :href="versionInfo.url">{{ versionInfo.url }}</a>
                        <span id="copy_url" @click="copyFunc('#copy_url')" :data-clipboard-text="versionInfo.url"
                            class="hover_icon px-[4px] py-[2px]">
                            <i class="murphy icon-fuzhi1 text-3c cursor-pointer text-xs"></i>
                        </span>
                    </p>
                    <p v-else>-</p>

                </div>
                <div class="text-sm mb-3">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">软件包下载地址</p>
                    <p v-if="versionInfo.down_url" class="flex items-center link h-5">
                        <a target="_blank" class=" text-3c ellipsis" :href="versionInfo.down_url">{{
                            versionInfo.down_url }}</a>
                        <span id="copy_url" @click="copyFunc('#copy_url')" :data-clipboard-text="versionInfo.down_url"
                            class="hover_icon px-[4px] py-[2px]">
                            <i class="murphy icon-fuzhi1 text-3c cursor-pointer text-xs"></i>
                        </span>
                    </p>
                    <p v-else>-</p>

                </div>
                <div class="text-sm mb-3">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">发布时间</p>
                    <p>{{ versionInfo.time || '-' }}</p>
                </div>
                <div class="text-sm">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">说明</p>
                    <p class="leading-6 break-all">
                        {{ versionInfo.description || '暂无说明' }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getCompVersionDetailApi } from 'api/knowledge';
import store from 'util/store';
import { useRoute, useRouter } from 'vue-router';
import { ecosystem } from '@/constants';
import { copyFunc, getRepaireLevelTool } from '@/utils/tools';
import ProjectUse from './components/ProjectUse.vue';
import VulnInfo from './components/VulnInfo.vue';

const activeTab = ref('1');
const versionInfo = ref({});
const route = useRoute();
const router = useRouter();

onBeforeMount(async () => {
    try {
        const { data } = await getCompVersionDetailApi({
            team_id: store.teamInfo.team_id,
            name: route.query.name,
            ecosystem: route.query.ecosystem,
            repository: route.query.repository,
            version: route.query.version,
        });
        versionInfo.value = data;
    } catch (error) {
        console.log(error);
    }
});

const openDetail = (row) => {
    router.push({
        path: '/software-detail',
        query: {
            name: row.name, ecosystem: row.ecosystem, repository: row.repository,
        },
    });
};
</script>

<style scoped lang='less'>
.shrink {
    width: 32px;
    vertical-align: -10px;
    cursor: pointer;
}

.hover_icon {
    display: none;
    margin-left: 4px;
}

.link:hover .hover_icon {
    display: block;
}

.link:hover a {
    text-decoration: underline;
    color: @primary;
}

.num {
    display: inline-block;
    border-radius: 4px;
    margin-right: 6px;

    span {
        &:nth-of-type(1) {
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        &:nth-of-type(2) {
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            padding: 0 6px;
        }

        display: inline-block;
        padding: 0 6px;
    }
}

/* 容器样式 */
.severity-container {
    display: flex;
    gap: 8px;
    /* 设置每个元素之间的间距 */
}

/* 公共样式 */
.severity-item {
    display: flex;
    align-items: center;
    justify-content: center;
    /* 每个元素的宽度 */
    flex: 1;
    height: 32px;
    /* 每个元素的高度 */
    border-radius: 2px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    /* 默认文字颜色为白色 */
    overflow: hidden;
}

.severity-item .label {
    width: 36px;
    text-align: center;
    height: 100%;
    line-height: 32px;
}

.severity-item .value {
    flex: 1;
    height: 100%;
    padding: 0 6px;
    line-height: 32px;
    background-color: rgba(255, 255, 255, 0.4);
    color: inherit;
    font-weight: 400;
}

/* 不同严重程度的样式 */
.severity-critical {
    .label {
        background-color: #F34D3D;
    }

    .value {
        background-color: #F54A4533;
        color: #F34D3D;
    }

    /* 红色 */
}

.severity-high {
    .label {
        background-color: #ff9800;
    }

    .value {
        background-color: #FF994033;
        color: #ff9800;
    }

    /* 橙色 */
}

.severity-medium {
    .label {
        background-color: #ffc107;
    }

    .value {
        background-color: #FFCC3333;
        color: #ffc107;
    }

    /* 黄色 */
}

.severity-low {
    .label {
        background-color: #A7AECC;
    }

    .value {
        background-color: #A7AECC33;
        color: #A7AECC;
    }
}
</style>
