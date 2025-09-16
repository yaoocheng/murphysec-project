<template>
    <el-dialog width="840" @close="emits('update:modelValue', false)" title="组件校准">
        <template #header>
            <div class="text-3c font-medium text-base">
                待应用的校准
            </div>
            <!-- <div class="text-85 font-normal text-xs">
                组件校准规则会应用于当前检测任务及项目的新增检测任务
            </div> -->
        </template>

        <div>
            <div class="text-85 mb-3">
                共 <span class="text-3c font-medium">{{ temporaryStorageComp.length }}</span> 条数据
            </div>
            <el-table v-if="temporaryStorageComp.length" class="mb-6" height="324" :show-header="false"
                :data="temporaryStorageComp" style="width: 100%">
                <el-table-column type="expand" width="26">
                    <template #default="{ row }">
                        <div v-for="item in row.showFileList" :key="item.module_key"
                            class="flex items-center py-[14px] px-4 mb-2 rounded-md bg-f7">
                            <img class="w-5 mr-1.5" src="~ast/fileImg/file_type_binary.svg" alt="">
                            {{ item.file_name }}
                            <span class="ml-1.5 text-xs text-85">{{ item.path }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column>
                    <template #default="{ row }">
                        <div>
                            <div>
                                {{ row.comp_name }}
                            </div>
                            <div>
                                版本：<span class="mr-3 line-through text-85">{{ row.comp_version || '暂无版本' }}</span> {{
                                    row.target_version }}
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column width="100">
                    <template #default="{ row }">
                        <span @click="adjustComp = row; isShowAdjustModal = true"
                            class="mr-4 text-primary cursor-pointer">编辑</span>
                        <el-popconfirm placement="left" icon="" width="240" @confirm="delConfirm(row)"
                            popper-class="cancle-popper confirm-popper" title="此操作将彻底删除组件的校准记录">
                            <template #reference>
                                <span class="text-err cursor-pointer">删除</span>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <NoData v-else />
        </div>

        <template #footer>
            <div class="mt-[-24px]">
                <el-button @click="emits('update:modelValue', false)" class="minor_btn h-auto w-20">取消</el-button>
                <el-button @click="confirmHandle" :disabled="!temporaryStorageComp.length" class="w-20">应用校准</el-button>
            </div>
        </template>

        <AdjustModal v-model="isShowAdjustModal" v-if="isShowAdjustModal" :adjustComp="adjustComp" />

    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import store from 'util/store';
import { startAdjustApi } from 'api/project';
import { temporaryStorageComp, getAdjustDetect } from '../../business';
import AdjustModal from './AdjustModal.vue';

const route = useRoute();
const emits = defineEmits(['update:modelValue']);
const isShowAdjustModal = ref(false);
const adjustComp = ref({});

const delConfirm = (row) => {
    const findIndex = temporaryStorageComp.findIndex((item) => (item.comp_name === row.comp_name) && (item.comp_version === row.comp_version) && (item.repository === row.repository) && (item.ecosystem === row.ecosystem));
    temporaryStorageComp.splice(findIndex, 1);
};

const confirmHandle = async () => {
    temporaryStorageComp.forEach((item) => {
        item.module_list = item.showFileList;
    });
    try {
        await startAdjustApi(
            {
                project_id: route.params.tid,
                team_id: store.teamInfo.team_id,
                subtask_id: route.params.sid,
                comp_list: temporaryStorageComp,
            },
        );
        emits('update:modelValue', false);
        temporaryStorageComp.length = 0;
        getAdjustDetect(route.params.sid);
    } catch (error) {
        console.log(error);
    }
};
</script>
