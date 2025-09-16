<template>
    <el-dialog width="1012px" title="项目已命中策略" align-center :close-on-click-modal="false">
        <div style="height: 600px;">
            <TableComp :data="list" height="100%">
                <el-table-column width="300" label="策略名称" prop="name"></el-table-column>
                <el-table-column label="策略说明" prop="desc">
                    <template #default="scope">
                        <div class="desc">
                            {{ scope.row.desc || '-' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="80" label="操作">
                    <template #default="scope">
                        <div @click="showStrategyInfoModal = true; checkItemInfo = scope.row"
                            class="g-color-5 g-f-14 g-fw-400 g-cursor-pointer">
                            查看
                        </div>
                    </template>
                </el-table-column>
            </TableComp>

            <NoData v-if="!list?.length" />
        </div>

        <StrategyInfoModal v-model="showStrategyInfoModal" v-if="showStrategyInfoModal" :editData="checkItemInfo" />
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import NoData from 'comp/NoData.vue';
import StrategyInfoModal from './StrategyInfoModal.vue';
import TableComp from '@/components/TableComp.vue';

defineProps(['list']);

const checkItemInfo = ref({});
const showStrategyInfoModal = ref<boolean>(false);
</script>

<style scoped lang='less'>
.desc {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>
