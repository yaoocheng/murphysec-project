<template>
    <div class="main-content flex flex-col gap-[8px] overflow-auto">
        <!-- 基本信息 -->
        <div class="basic_information flex flex-col gap-[24px] p-[24px] bg-white">
            <div class="flex items-center gap-[12px]">
                <span class="title">{{ ChainComponentDetail.component_name || '-' }}</span>
            </div>

            <div class="flex flex-col gap-[8px]">
                <div class="flex items-center">
                    <span style="font-size: 14px; color: #3C3C3C; font-weight: 500; line-height: 22px;">基本信息</span>
                    <a-tooltip placement="right">
                        <template #title>
                            {{ isExpand ? '收起' : '展开' }}
                        </template>
                        <div :class="isExpand ? 'expand-icon expanded' : 'expand-icon' " @click="isExpand = !isExpand">
                            <Svg width="12px" height="12px" name="icon_right-bold_outlined" color="#6C87FF" > </Svg>
                        </div>
                    </a-tooltip>
                </div>

                <div :class="isExpand ? 'base_info expanded' : 'base_info'">
                    <div class="info_list">
                        <div class="info_item">
                            <span class="label">成分类型</span>

                            <span class="value">{{ ChainComponentDetail.component_type || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">成分版本</span>

                            <span class="value">{{ ChainComponentDetail.component_version || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">许可证类型</span>

                            <span class="value">{{ ChainComponentDetail.license?.[0]?.name || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">依赖类型</span>

                            <span class="value">{{ ChainComponentDetail.dependency_type || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">包管理器类型</span>

                            <span class="value">{{ ChainComponentDetail.package_type || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">生态</span>

                            <span class="value">{{ ChainComponentDetail.ecosystem || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">仓库</span>

                            <span class="value">{{ ChainComponentDetail.repository || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">创建时间</span>

                            <span class="value">{{ formatDate(ChainComponentDetail.created_at) || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">PURL</span>

                            <span class="value">{{ ChainComponentDetail.package_url || '-' }}</span>
                        </div>

                        <div class="info_item">
                            <span class="label">主页</span>

                            <span class="value">{{ ChainComponentDetail.component_homepage || '-' }}</span>
                        </div>

                        <div class="info_item" style="width: 100%;">
                            <span class="label">漏洞描述</span>

                            <span class="value">{{ ChainComponentDetail.component_desc || '-' }}</span>
                        </div>

                    </div>

                </div>

            </div>
        </div>

        <div class="flex  border-b w-full justify-between" >
            <a-tabs v-model:activeKey="activeKey" class="w-full">

                <a-tab-pane key="1" tab="安全问题">
                    <SecQuestion :component_id/>
                </a-tab-pane>
                <a-tab-pane key="2" tab="所属应用" force-render>
                    <Apps :component_id/>
                </a-tab-pane>

            </a-tabs>
        </div>
    </div>

</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getChainComponentDetailApi } from 'api/app';
import { formatDate } from 'utils';
import SecQuestion from './tag-pages/SecQuestion.vue';
import Apps from './tag-pages/Apps.vue';

const ChainComponentDetail = ref({});

const isExpand = ref(false);

const activeKey = ref('1');

const route = useRoute(); // 获取当前路由信息
const component_id = route.params.id; // 获取路由中的component_id

// 获取供应链成分详情
const getChainComponentDetail = async () => {
    const response = await getChainComponentDetailApi(component_id);
    ChainComponentDetail.value = response.data.data;
};

onMounted(() => {
    getChainComponentDetail();
});

</script>

<style scoped>

.title {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    color: #3C3C3C;
}

.base_info {
    /* margin-top: 32px; */
    height: 48px;
    overflow: hidden;
}

.base_info.expanded {
    height: auto;
}

.info_list{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .info_item {
        /* width: 219.6px; */
        width: 20%;
        height: 48px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
            font-size: 12px;
            color: #999999;
            font-weight: 400;
            line-height: 20px;
            display: flex;
            gap: 4px;
        }

        .value {
            font-size: 14px;
            color: #3C3C3C;
            font-weight: 400;
            line-height: 22px;
            padding: 1px 0px;
            gap: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}

</style>

<style>
.base-info-popover {
    .ant-popover-content{
        width:52px !important;
        height: 38px !important;
        padding: 0px !important;

        border-radius: 4px !important;
        .ant-popover-inner{

            .ant-popover-inner-content{
                color:#ffffff !important;
                font-size: 14px !important;
                line-height: 22px !important;
            }
        }
    }
}
.main-content{
    .ant-tabs-nav{
        background-color: #ffffff;
        padding: 0px 24px;
        margin-bottom: 8px !important;
        color: #999999;
    }

    .ant-tabs-content-holder{
        background-color: #ffffff;
        padding: 16px 24px;
    }
}
</style>
