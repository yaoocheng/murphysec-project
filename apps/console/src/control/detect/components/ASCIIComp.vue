<template>
    <div v-infinite-scroll="loadMoreData1" :infinite-scroll-distance="150" infinite-scroll-immediate
        class="g-bg-f7 g-bdr-6 g-p-16 g-border-box" style="height: 65vh;width: 100%;overflow: auto;">
        <!-- <SearchComp class="g-mb-16" clearable placeholder="搜索ASCII字符串" /> -->
        <div class="g-w-100" v-for="item in renderASCII" :key="item">
            <div class="g-w-100 g-border-box g-p-12 g-bg-ff g-bdr-6 g-mb-8 ellipsis">
                {{ item }}
            </div>
        </div>
        <NoData v-if="!ASCIIList.length" />
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import NoData from '@/components/NoData.vue';

const props = defineProps<{sid: string, fileParams:any, reqFunc:Function}>();

const route = useRoute();
const renderASCII = ref<Array<string>>([]);
const ASCIIList = ref<Array<string>>([]);

const loadMoreData1 = () => {
    renderASCII.value.push(...ASCIIList.value.splice(0, 20));
};

onBeforeMount(async () => {
    try {
        const { data } = await props.reqFunc({
            team_id: store.teamInfo.team_id,
            subtask_id: props.sid,
            project_id: route.params.tid || undefined,
            ...props.fileParams,
        });
        ASCIIList.value = [...data];
        renderASCII.value = ASCIIList.value.splice(0, 20);
    } catch (error) {
        console.log(error);
    }
});
</script>

<style lang='less' scoped></style>
