<template>
    <div class="g-f-14" style="padding: 16px 14px;width: 372px;height: 460px;">
        <div class="g-f-16 g-fw-500 g-color-3 g-mb-24">
            整体耗时 <span class="g-mr-16" :style="{ color: typeof timeOver.totalTime === 'number' ? '#6C87FF' : '#858585' }">{{
                typeof timeOver.totalTime === 'number' ? `${timeOver.totalTime.toFixed(3)}s` : '-' }}</span>
            检测耗时 <span :style="{ color: typeof timeOver.detectTime === 'number' ? '#6C87FF' : '#858585' }">{{ typeof
                timeOver.detectTime === 'number' ? `${timeOver.detectTime.toFixed(3)}s` : '-' }}</span>
        </div>

        <el-timeline>
            <el-timeline-item>
                <div>
                    <div class="g-f-14 g-color-1 g-fw-500 g-mb-4">
                        任务开始
                    </div>
                    <div class="g-f-12 g-color-3 g-fw-400">
                        {{ timeOver.created_at? formatDate(timeOver.created_at):'-' }}
                    </div>
                </div>
            </el-timeline-item>

            <el-timeline-item v-for="(item, index) in timeData" :key="index">
                <div :class="{ 'opacity': typeof item.time !== 'number' }">
                    <div class="g-f-14 g-color-1 g-fw-500 g-mb-4">
                        {{ item.step }}
                        <span class="g-color-5 g-ml-4" v-if="typeof item.time === 'number'">{{ (item.time).toFixed(3) }}s</span>
                        <span v-else>-</span>
                    </div>
                    <div class="g-f-12 g-color-3 g-fw-400">
                        {{ item.desc }}
                    </div>
                </div>
            </el-timeline-item>

            <el-timeline-item>
                <div v-if="status===1||status===2">
                    <div style="opacity: .2;"
                        class="g-f-14 g-color-1 g-fw-500 g-mb-4">
                        任务结束
                    </div>
                    <div style="opacity: .2;" class="g-f-12 g-color-3 g-fw-400">
                       -
                    </div>
                </div>

                <div v-else>
                    <div :style="{ color: status !== 3 ? '#F34D3D' : '#3c3c3c' }"
                        class="g-f-14 g-color-1 g-fw-500 g-mb-4">
                        {{ status === 3 ? '任务结束' : '任务终止' }}
                    </div>
                    <div :style="{ color: status !== 3 ? '#F34D3D' : '#858585' }" class="g-f-12 g-color-3 g-fw-400">
                        {{ status === 3 ? (timeOver.subtask_end_at ? formatDate(timeOver.subtask_end_at) : '-') :
                (timeOver.cancel_at?formatDate(timeOver.cancel_at):'-') }}
                    </div>
                </div>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue';
import { getConsumeTimeApi } from 'api/project';
import { formatDate } from 'util/tools';

const { sid } = defineProps(['sid', 'status']);

const timeData = ref<any>([]);
const timeOver = ref<any>({});

onBeforeMount(async () => {
    try {
        const { data } = await getConsumeTimeApi(sid);

        timeData.value = [
            // {
            //     step: '任务开始',
            //     desc: data.created_at && formatDate(data.created_at),
            // },
            {
                step: '获取检测相关内容',
                desc: '拉取代码或等待 CLI 客户端执行完成',
                time: data.sca_file_pull_at && data.sca_start_at && ((new Date(data.sca_file_pull_at).getTime() - new Date(data.sca_start_at).getTime()) / 1000),
            },
            {
                step: '队列等待',
                desc: '并发任务较多时，等待任务处理的时间会增加',
                time: data.sca_scan_start_at && data.platform_at && ((new Date(data.sca_scan_start_at).getTime() - new Date(data.platform_at).getTime()) / 1000),
            },
            {
                step: '检测执行',
                desc: '此环节执行所有的检测逻辑，由检测引擎驱动',
                time: data.sca_scan_start_at && data.sca_scan_end_at && ((new Date(data.sca_scan_end_at).getTime() - new Date(data.sca_scan_start_at).getTime()) / 1000),
            },
            {
                step: '处理并存储检测结果',
                desc: '分析处理检测结果，并存储结果',
                time: data.subtask_end_at && data.sca_scan_end_at && ((new Date(data.subtask_end_at).getTime() - new Date(data.sca_scan_end_at).getTime()) / 1000),
            },
            // {
            //     step: '任务结束',
            //     desc: data.subtask_end_at && formatDate(data.subtask_end_at),
            //     time: '',
            // },
        ];

        timeOver.value = {
            cancel_at: data.cancel_at,
            subtask_end_at: data.subtask_end_at,
            created_at: data.created_at,
            totalTime: null,
            detectTime: data.sca_scan_start_at && data.sca_scan_end_at && ((new Date(data.sca_scan_end_at).getTime() - new Date(data.sca_scan_start_at).getTime()) / 1000),
        };

        timeData.value.forEach((item: any) => {
            timeOver.value.totalTime += item.time;
        });
    } catch (error) {
        console.log(error);
    }
});

</script>

<style scoped lang='less'>
.opacity {
    opacity: .2;
}
</style>
