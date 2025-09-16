<template>
    <el-dialog width="840" @close="emits('update:modelValue', false)" title="组件用法校准">
        <template #header>
            <div class="text-3c font-medium text-base mb-2">
                待应用的校准
            </div>
            <div class="text-85 text-sm">
                组件校准规则会应用于当前检测任务及项目的新增检测任务
            </div>
        </template>

        <div>
            <div class="text-85 mb-3">
                共 <span class="text-3c font-medium">{{ temporaryStorageUseComp.length }}</span> 条数据
            </div>
            <el-table v-if="temporaryStorageUseComp.length" row-key="key" class="mb-6" height="324" :show-header="false"
                      :data="temporaryStorageUseComp" style="width: 100%">
                <el-table-column type="expand" width="26">
                    <template #default="{ row }">
                        <div v-for="item in row.module_list" :key="item.module_key"
                             class=" py-[14px] px-4 mb-2 rounded-md bg-f7">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="flex items-center mb-2">
                                        <img class="w-5 mr-1.5" src="~ast/fileImg/file_type_binary.svg" alt="">
                                        <span class="inline-block">{{ item.file_name }}</span>
                                        <span class="ml-1 text-xs text-85 mr-2 inline-block">{{ item.path }}</span>
                                    </div>
                                    <div>
                                        <span class="text-85">组件用法：</span>
                                        <span class="mr-3 line-through text-85">{{ USEMAP[item.comp_way_of_use] }}</span>
                                        {{ USEMAP[item.target_way_of_use] }}
                                    </div>
                                </div>

                                <div>
                                    <span @click="adjustComp = row; isShowAdjustUseModal = true; editPath = item.path"
                                          class="text-primary mr-4 cursor-pointer">编辑</span>
                                    <el-popconfirm placement="left" icon="" width="240"
                                                   @confirm="delPathConfirm(row, item)" popper-class="cancle-popper confirm-popper"
                                                   title="确定删除该条待应用的校准？">
                                        <template #reference>
                                            <span class="text-err cursor-pointer">删除</span>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column>
                    <template #default="{ row }">
                        <div class="mb-1">
                            {{ row.comp_name }}
                        </div>
                        <div>
                            <span class="text-85">版本：</span>{{ row.comp_version }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column width="50">
                    <template #default="{ row }">
                        <!-- <span @click="adjustComp = row; isShowAdjustUseModal = true"
                            class="mr-4 text-primary cursor-pointer">编辑</span> -->
                        <el-popconfirm placement="left" icon="" width="240" @confirm="delConfirm(row)"
                                       popper-class="cancle-popper confirm-popper" title="此操作将彻底删除组件的校准记录">
                            <template #reference>
                                <i class="murphy icon-shanchu2 cursor-pointer"></i>
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
                <el-button @click="confirmHandle" :disabled="!temporaryStorageUseComp.length"
                           class="w-20">应用校准</el-button>
            </div>
        </template>

        <AdjustUseModal v-model="isShowAdjustUseModal" v-if="isShowAdjustUseModal" :adjustComp="adjustComp"
                        :editPath="editPath" />
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import store from 'util/store';
import { adjustCompUseApi } from 'api/project';
import { USEMAP } from '../../constants/constants';
import { temporaryStorageUseComp } from './business';
import { getAdjustDetect } from '../../business';
import AdjustUseModal from './AdjustUseModal.vue';

const route = useRoute();
const emits = defineEmits(['update:modelValue']);
const isShowAdjustUseModal = ref(false);
const adjustComp = ref({});
const editPath = ref('');

// 删除组件
const delConfirm = (row) => {
    const findIndex = temporaryStorageUseComp.findIndex((item) => (item.comp_name === row.comp_name) && (item.comp_version === row.comp_version) && (item.repository === row.repository) && (item.ecosystem === row.ecosystem));
    temporaryStorageUseComp.splice(findIndex, 1);
};

// 删除组件路径
const delPathConfirm = (row, item) => {
    const fileIndex = row.module_list.findIndex((file) => file.module_key === item.module_key);
    if (fileIndex > -1) {
        row.module_list.splice(fileIndex, 1);
        if (row.module_list.length === 0) {
            delConfirm(row);
        }
    }
};

const confirmHandle = async () => {
    try {
        await adjustCompUseApi(
            {
                project_id: route.params.tid,
                team_id: store.teamInfo.team_id,
                subtask_id: route.params.sid,
                data: temporaryStorageUseComp,
            },
        );
        emits('update:modelValue', false);
        temporaryStorageUseComp.length = 0;
        getAdjustDetect(route.params.sid);
    } catch (error) {
        console.log(error);
    }
};
</script>
