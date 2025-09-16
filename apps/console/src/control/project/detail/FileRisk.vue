<template>
    <div v-loading="loading">
        <div class="g-color-3 g-fw-400 g-f-14 g-mb-12">
            共 <span class="g-color-1 g-fw-500">{{ listData?.length }}</span> 条数据
        </div>

        <div v-for="item in listData" :key="item.file_name"
             class="g-mb-8 g-bg-f7 g-bdr-6 g-p-16 g-f-14 g-color-1 g-flex g-align-center">
            <div class="item" style="width: 25%;">
                <span class="g-f-12 g-color-3 g-mr-4">文件名</span>
                <el-tooltip placement="top" :content="item.file_name">
                    {{ item.file_name }}
                </el-tooltip>
            </div>

            <div class="item" style="width: 10%;">
                <span class="g-f-12 g-color-3">文件类型</span>
                {{ item.file_type }}
            </div>

            <div class="item" style="width: 10%;">
                <span class="g-f-12 g-color-3">组件总数</span>
                {{ item.comp_count }}
            </div>

            <div class="item g-flex g-align-center" style="width: 20%;">
                <span class="g-f-12 g-color-3">缺陷组件</span>
                <div style="width: 12%;margin-left: 4px;">
                    <el-tooltip placement="top" content="强烈建议修复">
                        <span class="tag" :class="{ 'tag-disabled': !item.strong_num }"
                              style="background: #f54a4533;color: #D83931;">{{ item.strong_num }}</span>
                    </el-tooltip>
                    <el-tooltip placement="top" content="建议修复">
                        <span class="tag" :class="{ 'tag-disabled': !item.recommend_num }"
                              style="background: #ff880033;color: #DE7802;">{{ item.recommend_num }}</span>
                    </el-tooltip>
                    <el-tooltip placement="top" content="可选修复">
                        <span class="tag" :class="{ 'tag-disabled': !item.optional_num }"
                              style="background: #1f23291a;color: #646A73;">{{ item.optional_num }}</span>
                    </el-tooltip>
                </div>
            </div>

            <div class="item g-flex g-align-center">
                <span class="g-f-12 g-color-3">漏洞数</span>
                <span class="mr-2 ml-2">{{ item.critical_num + item.high_num + item.medium_num + item.low_num }}</span>
                <span class="num">
                    <span
                        :style="{ 'background-color': item.critical_num === 0 ? '#EBEBEB' : '#F34D3D', 'color': '#fff' }">C</span>
                    <span
                        :style="{ 'background-color': item.critical_num === 0 ? '#C7C7C733' : 'rgba(245, 74, 69, 0.2)', 'color': item.critical_num === 0 ? '#C7C7C7' : '#F34D3D' }">{{
                        item.critical_num
                    }}</span>
                </span>
                <span class="num">
                    <span
                        :style="{ 'background-color': item.high_num === 0 ? '#EBEBEB' : '#FF9940', 'color': '#fff' }">H</span>
                    <span
                        :style="{ 'background-color': item.high_num === 0 ? '#C7C7C733' : 'rgba(255, 153, 64, 0.2)', 'color': item.high_num === 0 ? '#C7C7C7' : '#FF9940' }">{{
                        item.high_num
                    }}</span>
                </span>
                <span class="num">
                    <span
                        :style="{ 'background-color': item.medium_num === 0 ? '#EBEBEB' : '#FCBE03', 'color': '#fff' }">M</span>
                    <span
                        :style="{ 'background-color': item.medium_num === 0 ? '#C7C7C733' : 'rgba(255, 204, 51, 0.2)', 'color': item.medium_num === 0 ? '#C7C7C7' : '#FCBE03' }">{{
                        item.medium_num
                    }}</span>
                </span>
                <span class="num">
                    <span
                        :style="{ 'background-color': item.low_num === 0 ? '#EBEBEB' : '#A7AECC', 'color': '#fff' }">L</span>
                    <span
                        :style="{ 'background-color': item.low_num === 0 ? '#C7C7C733' : 'rgba(167, 174, 204, 0.2)', 'color': item.low_num === 0 ? '#C7C7C7' : '#A7AECC' }">{{
                        item.low_num
                    }}</span>
                </span>
            </div>
        </div>

        <NoData v-if="!listData?.length" />
    </div>

</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import { getRiskFileApi } from 'api/asset';
import NoData from 'comp/NoData.vue';

const route = useRoute();
const listData = ref<any[]>([]);
const loading = ref(false);

onBeforeMount(async () => {
    loading.value = true;
    const { data } = await getRiskFileApi({
        project_id: route.params.tid,
        subtask_id: route.params.sid,
    });
    loading.value = false;
    listData.value = data?.file_info_list;
});
</script>

<style lang='less' scoped>
.item {
    margin-right: 20px;
    .ellipsis();

    .tag-disabled {
        background-color: #EBEBEB !important;
        color: #c7c7c7 !important;
    }

    .tag {
        transform: scale(1);
        margin-right: 4px;
    }

    .num {
        display: inline-block;
        border-radius: 4px;
        margin-right: 8px;
        font-size: 12px;

        span {
            &:nth-of-type(1) {
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }

            &:nth-of-type(2) {
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                padding: 3px 5px;
            }

            display: inline-block;
            padding: 3px 5px;
        }
    }
}
</style>
