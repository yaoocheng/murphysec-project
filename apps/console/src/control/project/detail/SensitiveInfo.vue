<template>
    <!-- <div v-if="data.total" class="g-p-16 g-mb-16 g-bdr-6 g-bg-f7 g-f-14 g-color-1 infos">
        <span>总数：{{ data.total }}</span>
        <span>高风险：{{ data.High }}</span>
        <span>中风险：{{ data.Medium }}</span>
        <span>低风险：{{ data.Low }}</span>

        <span class="sensitive_list_truncated g-color-3">
            <el-tooltip placement="top" content="为避免检测速度过慢，敏感信息列表数据超出100条后暂不展示">
                <i class="murphy icon-doc"></i>
            </el-tooltip>
        </span>
    </div> -->
    <div v-loading="loading">
        <div class="g-color-3 g-fw-400 g-f-14 g-mb-12">
            共 <span class="g-color-1 g-fw-500">{{ info?.length || 0 }}</span> 条数据
        </div>

        <el-table :data="info"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column prop="desc" label="敏感信息" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" label="策略类型"></el-table-column>
            <el-table-column prop="title" label="策略名称"></el-table-column>
            <el-table-column prop="file_path" label="所在文件" width="300" show-overflow-tooltip></el-table-column>
            <el-table-column prop="line" label="所在行"></el-table-column>
            <el-table-column label="风险级别">
                <template #default="scope">
                    <div class="g-pt-8 g-pb-8">
                        <span v-if="levelType(scope.row.type, scope.row.level) === 'high'"
                              :class="levelType(scope.row.type, scope.row.level)" class="level-tag">
                            <i class="murphy icon-gantanhao g-f-14"></i> 高风险
                        </span>
                        <span v-if="levelType(scope.row.type, scope.row.level) === 'mid'"
                              :class="levelType(scope.row.type, scope.row.level)" class="level-tag">
                            <i class="murphy icon-gantanhao g-f-14"></i> 中风险
                        </span>
                        <span v-if="levelType(scope.row.type, scope.row.level) === 'low'"
                              :class="levelType(scope.row.type, scope.row.level)" class="level-tag">
                            <i class="murphy icon-gantanhao g-f-14"></i> 低风险
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getSensitiveDataApi } from 'api/project';

const route = useRoute();
const info = ref<any>([]);
const loading = ref<boolean>(false);
// const data = ref<any>({});

onBeforeMount(async () => {
    loading.value = true;
    const res = await getSensitiveDataApi(route.params.sid);
    info.value = res.data;
    loading.value = false;
    // const res1 = await getsensitiveInfoApi(route.params.sid);
    // data.value = res1.data;
});

const levelType = (name: string, level: string) => {
    if (name === '手机号' || level === 'Medium') return 'mid';
    if (level === 'Low') return 'low';
    if (level === 'High' || (!level && name)) return 'high';
};
</script>

<style lang='less' scoped>
.infos span {
    margin-right: 16px;
}

.level-tag {
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    color: #D83931;
    padding: 5px 6px;
    background: var(--udtoken-tag-bg-red, rgba(245, 74, 69, 0.20));
}

.sensitive_list_truncated {
    float: right;
}

.level-tag.mid {
    color: #DE7802;
    background-color: #FF880033;
}

.level-tag.low {
    color: #646A73;
    background-color: #1F23291A;
}</style>
