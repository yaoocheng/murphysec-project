<template>
    <div class="table_wrap">
        <div class="thead">
            <div class="th" style="width:3%"></div>
            <div class="th" style="width:40%">文件</div>
            <div class="th">文件路径</div>
        </div>
        <div class="tbody" v-for="(item, index) in listData" :key="index">
            <div class="list_item">
                <div class="td" style="width:3%">
                    <span class="expand_icon" @click="item.expand=!item.expand">
                        <i class="murphy icon-youjiantou" style="font-size: 12px;" v-if="!item.expand"></i>
                        <i class="murphy icon-xiala1" v-else></i>
                    </span>
                </div>
                <div class="td" style="width:40%">
                    {{ item.filename }}
                </div>
                <div class="td">
                    {{ item.filepath }}
                </div>
            </div>

            <div class="expand_content" v-if="item.expand">
                <div v-for="(ele, i) in item?.homology_file_list" :key="i" class="history_item" style="height: 68px;">
                    <div class="td g-mr-12" style="width: 30%;">
                        <span class="g-color-3 g-f-12 g-mr-6">匹配文件</span>
                        {{ ele.filename }}
                    </div>
                    <div class="td g-mr-12" style="width: 10%;">
                        <span class="g-color-3 g-f-12 g-mr-6">版本</span>
                        {{ ele.version }}
                    </div>
                    <div class="td g-mr-12" style="width: 30%;">
                        <span class="g-color-3 g-f-12 g-mr-6">描述</span>
                        {{ ele.description }}
                    </div>
                    <div class="td g-mr-12" style="width: 30%;">
                        <span class="g-color-3 g-f-12 g-mr-6">官方地址</span>
                        <a :href="ele.url">{{ ele.url }}</a>
                    </div>
                    <div class="td g-mr-12" style="width: 12%;">
                        <span class="g-color-3 g-f-12 g-mr-6">相似度</span>
                        {{ Math.round(ele.similarity * 100) }}%
                    </div>
                </div>
                <NoData v-if="!item?.homology_file_list?.length" />
            </div>
        </div>
    </div>

    <!-- 分页 -->
    <!-- <PageComp v-model:currentPage="reqData.page" :total="total" /> -->

    <NoData v-if="!listData?.length" />
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
// import PageComp from 'comp/PageComp.vue';
import NoData from 'comp/NoData.vue';
import { getBinaryFileListApi } from 'api/asset';

const route = useRoute();
const listData = ref<Array<any>>([]);
const total = ref<number>(0);
const reqData = ref<{
    'project_id': string, // 项目ID
    'subtask_id': string, // 子任务ID
    // 'limit': number, // 分页，每页几条
    // 'page': number
}>({
    project_id: route.params.tid as string, // 项目ID
    subtask_id: route.params.sid as string, // 子任务ID
    // limit: 10, // 分页，每页几条
    // page: 1,
});
const getList = async () => {
    const { data } = await getBinaryFileListApi(reqData.value);
    total.value = data.file_info_num;
    listData.value = data.file_info_list || [];
    listData.value = listData.value.map((item) => {
        item.expand = false;
        return item;
    });
};
getList();

watch(reqData.value, () => {
    getList();
});
</script>

<style lang='less' scoped></style>
