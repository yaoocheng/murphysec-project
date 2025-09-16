<template>
    <el-dialog width="840" @close="emits('update:modelValue', false)" title="同源性分析来源校准">
        <template #header>
            <div class="text-3c font-medium text-base">
                待应用的校准
            </div>
        </template>

        <div class="text-85 mb-3">
            共 <span class="text-3c font-medium">{{ temporaryStorageSnip.length }}</span> 条数据
        </div>

        <el-table v-if="temporaryStorageSnip.length" class="mb-6" height="324" :show-header="false" :data="temporaryStorageSnip"
                  style="width: 100%">
            <el-table-column type="expand" width="26">
                <template #default="{ row }">
                    <div class="rounded-md flex flex-wrap bg-f7 text-85 p-4 mb-2 leading-7">
                        <div class="w-1/3 ellipsis line-through">开源项目：{{ row.old_match.target_project_name }}</div>
                        <div class="w-1/3 ellipsis line-through">项目版本：{{ row.old_match.version }}</div>
                        <div class="w-1/3 ellipsis line-through">项目许可证：<span
                            v-for="(ele, i) in row.old_match.target_project_spdx" :key="ele.name">
                            {{ ele.name }}<span v-if="i !== row.old_match.target_project_spdx.length - 1">、</span>
                        </span>
                        </div>
                        <div class="w-1/3 ellipsis line-through">开源文件：{{ row.old_match.path }}</div>
                        <div class="w-1/3 ellipsis line-through">文件许可证：<span v-for="ele in row.old_match.spdx_id"
                                                                             :key="ele.name">{{ ele.name }}<span v-if="i !== row.old_match.spdx_id.length - 1">、</span></span></div>
                        <div v-if="row.data_type==='fragmented'" class="w-1/3 ellipsis line-through">片段行号：{{
                            row.old_match.target_fragmented?.first_line_range }} - {{
                            row.old_match.target_fragmented?.last_line_range }}</div>
                    </div>
                    <div class="rounded-md flex flex-wrap bg-f7 text-85 p-4 leading-7">
                        <div class="w-1/3 ellipsis">开源项目：{{ row.new_match.target_project_name }}</div>
                        <div class="w-1/3 ellipsis">项目版本：{{ row.new_match.version }}</div>
                        <div class="w-1/3 ellipsis">项目许可证：<span v-for="(ele, i) in row.new_match.target_project_spdx"
                                                                :key="ele.name">
                            {{ ele.name }}<span v-if="i !== row.new_match.target_project_spdx.length - 1">、</span>
                        </span>
                        </div>
                        <div class="w-1/3 ellipsis">开源文件：{{ row.new_match.path }}</div>
                        <div class="w-1/3 ellipsis">文件许可证：<span v-for="(ele,i) in row.new_match.spdx_id" :key="ele.name">{{
                            ele.name }}<span v-if="i !== row.new_match.spdx_id.length - 1">、</span></span>
                        </div>
                        <div v-if="row.data_type==='fragmented'" class="w-1/3 ellipsis">片段行号：{{
                            row.new_match.target_fragmented?.first_line_range }} - {{
                            row.new_match.target_fragmented?.last_line_range }}</div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column>
                <template #default="{ row }">
                    <div class="flex items-center">
                        检测项目文件：<span class="max-w-[200px] ellipsis">{{ row.file_path }}</span>
                        <TagComp class="ml-2 mr-4" :content="`${row.data_type === 'file' ? '文件精准匹配' : '代码片段匹配'}`"
                                 c="#646A73" bgc="#1F23291A" />
                        <span v-if="row.data_type==='fragmented'">
                            片段行号：{{ row.source_fragmented?.first_line_range }} - {{ row.source_fragmented?.last_line_range
                            }}
                        </span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column width="100">
                <template #default="{ row }">
                    <span @click="midInfo = row; moreModal = true" class="mr-4 text-primary cursor-pointer">编辑</span>
                    <el-popconfirm placement="left" icon="" width="240" @confirm="delConfirm"
                                   popper-class="cancle-popper confirm-popper" title="此操作将彻底删除项目来源的校准记录">
                        <template #reference>
                            <span class="text-err cursor-pointer">删除</span>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <NoData v-else />

        <template #footer>
            <div class="mt-[-24px]">
                <el-button @click="emits('update:modelValue', false)" class="minor_btn h-auto w-20">取消</el-button>
                <el-button :disabled="!temporaryStorageSnip.length" @click="confirmHandle" class="w-20">应用校准</el-button>
            </div>
        </template>

        <MoreMatchFile v-if="moreModal" v-model="moreModal" />
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { startAdjustSnipApi } from 'api/detail';
import MoreMatchFile from './MoreMatchFile.vue';
import { temporaryStorageSnip, midInfo, snippetModal } from './business';
import { getAdjustDetect, isAdjustDetect } from '../../business';

const route = useRoute();
const moreModal = ref(false);
const emits = defineEmits(['update:modelValue']);

const delConfirm = (row) => {
    const findIndex = temporaryStorageSnip.findIndex((item) => item.file_id === row.file_id);
    temporaryStorageSnip.splice(findIndex, 1);
};

const confirmHandle = async () => {
    try {
        await startAdjustSnipApi({
            subtask_id: route.params.sid,
            data: temporaryStorageSnip,
        });
        temporaryStorageSnip.length = 0;
        isAdjustDetect.value = true;
        snippetModal.value = false;
        emits('update:modelValue', false);
        getAdjustDetect(route.params.sid);
    } catch (error) {
        console.log(error);
    }
};
</script>
