<template>
    <el-dialog width="840" align-center>
        <template #header>
            <div class="text-3c font-medium text-base">
                {{ !sid ? '组件校准规则' : '组件校准记录' }}
            </div>
            <div v-if="!sid" class="text-85 font-normal text-sm mt-2">
                新建检测任务会复用所有组件校准规则，若检测任务中组件及来源文件与校准规则一致，则执行该校准规则
            </div>
        </template>

        <el-tabs class="mt-[-8px]" v-model="activeName">
            <el-tab-pane label="组件版本校准" name="first">
                <div style="max-height: calc(100vh - 300px);">
                    <div class="text-85 mb-3">
                        共 <span class="text-3c font-medium">{{ adjustVersionList.length }}</span> 条数据
                    </div>

                    <el-table v-if="adjustVersionList.length" height="100%" :show-header="false"
                              :data="adjustVersionList" style="width: 100%">
                        <el-table-column type="expand" width="26">
                            <template #default="{ row }">
                                <div v-for="item in row.module_list" :key="item.path" class="p-4 py-[14px] mb-2 rounded-md bg-f7">
                                    <div class="flex items-center mb-1">
                                        <img class="w-5 mr-1.5" src="~ast/fileImg/file_type_binary.svg" alt="">
                                        {{ item.path.split('/').pop() }}
                                        <span class="ml-1.5 text-xs text-85">{{ item.path }}</span>
                                        <span class="text-85 ml-4">版本：</span>
                                        <span class="mr-3 line-through text-85">{{ item.comp_version
                                        }}</span>
                                        {{ item.target_version }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column>
                            <template #default="{ row }">
                                <div>
                                    组件名：{{ row.comp_name }}
                                </div>
                                <div>
                                    <span class="text-85">版本：</span>{{ row.comp_version }}
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column v-if="!sid&&!store.isAllTeam" width="60">
                            <template #default="{ row }">
                                <el-popconfirm placement="left" icon="" width="240"
                                               @confirm="delVersionRule(row.module_list)"
                                               popper-class="cancle-popper confirm-popper" title="此操作将彻底删除组件的校准规则">
                                    <template #reference>
                                        <span class="text-err cursor-pointer">删除</span>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>

                    <NoData v-else />
                </div>
            </el-tab-pane>
            <el-tab-pane label="组件用法校准" name="second">
                <div style="max-height: calc(100vh - 300px);">
                    <div class="text-85 mb-3">
                        共 <span class="text-3c font-medium">{{ adjustUseList.length }}</span> 条数据
                    </div>
                    <el-table v-if="adjustUseList.length" height="100%" :show-header="false" :data="adjustUseList"
                              style="width: 100%">
                        <el-table-column type="expand" width="26">
                            <template #default="{ row }">
                                <div v-for="item in row.module_list" :key="item.path"
                                     class="px-4 py-[14px] mb-2 rounded-md bg-f7">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="flex items-center mb-2">
                                                <img class="w-5 mr-1.5" src="~ast/fileImg/file_type_binary.svg" alt="">
                                                <span class="inline-block"> {{ item.path.split('/').pop() }}</span>
                                                <span class="ml-1 text-xs text-85 mr-2 inline-block">{{ item.path
                                                }}</span>
                                            </div>
                                            <div>
                                                <span class="text-85">组件用法：</span><span class="mr-1 line-through text-85">{{ USEMAP[item.comp_way_of_use]}}</span>{{ USEMAP[item.target_way_of_use] }}
                                            </div>
                                        </div>

                                        <el-popconfirm v-if="!sid&&!store.isAllTeam" placement="left" icon="" width="240"
                                                       @confirm="delUseRule(row.module_list, item)"
                                                       popper-class="cancle-popper confirm-popper" title="确定删除当前路径？">
                                            <template #reference>
                                                <span class="text-err cursor-pointer">删除</span>
                                            </template>
                                        </el-popconfirm>
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

                        <el-table-column v-if="!sid&&!store.isAllTeam" width="50">
                            <template #default="{ row }">
                                <el-popconfirm placement="left" icon="" width="240"
                                               @confirm="delUseRule(row.module_list)" popper-class="cancle-popper confirm-popper"
                                               title="此操作将彻底删除组件的校准记录">
                                    <template #reference>
                                        <span class="hover_icon py-0.5 inline-block">
                                            <i class="murphy icon-shanchu2 cursor-pointer"></i>
                                        </span>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>

                    <NoData v-else />
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup>
import store from 'util/store';
import {
    getVersionFixRuleListApi, getUseFixRuleListApi, delAdjustVersionRuleApi, delUseFixRuleApi, getUseFixRuleRecordApi, getAdjustVersionRecordApi,
} from 'api/project';
import { ref } from 'vue';
import { USEMAP } from './constants/constants';
import { showMessage } from '@/utils/tools';

const { pid, sid } = defineProps(['pid', 'sid']);
const adjustVersionList = ref([]); // 版本
const adjustUseList = ref([]); // 用法
const activeName = ref('first');

// 版本规则
const getVersionRuleList = async () => {
    try {
        const { data } = await getVersionFixRuleListApi({ project_id: pid });
        adjustVersionList.value = data.list || [];
    } catch (error) {
        console.log(error);
    }
};

// 用法规则
const getuseRuleList = async () => {
    try {
        const { data } = await getUseFixRuleListApi({ project_id: pid });
        adjustUseList.value = data.list || [];
    } catch (error) {
        console.log(error);
    }
};

// 版本校准记录
const getAdjustVersionRecordList = async () => {
    try {
        const { data } = await getAdjustVersionRecordApi({
            subtask_id: sid,
            project_id: pid,
        });
        adjustVersionList.value = data.list || [];
    } catch (error) {
        console.log(error);
    }
};

// 用法校准记录
const getUseFixRuleRecord = async () => {
    try {
        const { data } = await getUseFixRuleRecordApi({
            subtask_id: sid,
            project_id: pid,
        });
        adjustUseList.value = data.list || [];
    } catch (error) {
        console.log(error);
    }
};

if (sid) {
    getAdjustVersionRecordList();
    getUseFixRuleRecord();
} else {
    getVersionRuleList();
    getuseRuleList();
}

// 删除版本规则
const delVersionRule = async (list) => {
    try {
        await delAdjustVersionRuleApi({
            rule_ids: list.map((_) => _.rule_id),
            project_id: pid,
            team_id: store.teamInfo.team_id,
        });
        showMessage('删除成功', 'success');
        getVersionRuleList();
    } catch (error) {
        console.log(error);
    }
};

// 删除用法规则
const delUseRule = async (list, item) => {
    try {
        await delUseFixRuleApi({
            rule_ids: item ? [item.rule_id] : list.map((_) => _.rule_id),
            project_id: pid,
            team_id: store.teamInfo.team_id,
        });
        showMessage('删除成功', 'success');
        getuseRuleList();
    } catch (error) {
        console.log(error);
    }
};
</script>
