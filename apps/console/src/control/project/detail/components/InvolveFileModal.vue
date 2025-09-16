<template>
    <el-dialog width="880px" title="涉及文件" :close-on-click-modal="false">
        <div class="g-f-14 g-color-3 g-mb-24">
            该漏洞涉及 <span class="g-color-1 g-fw-500">{{ fileInfo.file_count }}</span> 个文件， <span class="g-fw-500 g-color-1">{{ fileInfo.comp_count }}</span> 个缺陷组件
        </div>

        <div class="table-wrap">
            <TableComp :data="fileInfo.comp_file_list">
                <el-table-column width="200" show-overflow-tooltip label="组件名称" prop="comp_name">
                    <template #default="{row}">
                        <span class="link_text" @click="compJump({name: row?.comp_name,version: row?.comp_version, ecosystem: row?.ecosystem, repository: row?.repository})">
                            {{ row.comp_name }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="版本" show-overflow-tooltip prop="comp_version"></el-table-column>
                <el-table-column label="处置建议">
                    <template #default="scope">
                        <div>
                            {{ getRepaireLevelTool(scope.row.comp_suggest).text }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="文件名称" show-overflow-tooltip prop="file_name"></el-table-column>
                <el-table-column width="200" show-overflow-tooltip label="文件路径" prop="associated_file_path"></el-table-column>
            </TableComp>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { getRepaireLevelTool } from 'util/tools';
import TableComp from 'comp/TableComp.vue';
import { compJump } from '@/utils/hook';

defineProps<{fileInfo:any}>();
</script>

<style lang='less' scoped>
.table-wrap {
    height: 400px;
    overflow: auto;
}
</style>
