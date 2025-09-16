<template>
    <el-dialog width="600px" title="变更组织" @closed="emits('update:modelValue', false)" :close-on-click-modal="false">
        <div class="change-org-content">
            <el-tree class="flow-tree" node-key="id" :default-expanded-keys="[1, 2]" :default-checked-keys="curMember.org_ids" @check-change="handleCheckChange" :check-strictly="true" show-checkbox :load="loadTreeNode" lazy>
                <template #default="{ data }">
                    <div class="tree_content g-flex g-align-center g-justify-between">
                        <div class="g-mr-8">
                            {{ data.name }}
                        </div>
                    </div>
                </template>
            </el-tree>
        </div>

        <div class="group-btn">
            <el-button @click="emits('update:modelValue', false)">取消</el-button>
            <el-button :loading="changeOrgLoading" @click="emits('changeMemberOrg', selectData)">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
import { loadTreeNode } from './hooks';

let selectData:number[] = [];
const props = defineProps(['curMember', 'changeOrgLoading']);
const emits = defineEmits(['update:modelValue', 'changeMemberOrg']);

selectData.push(...props.curMember.org_ids);

const handleCheckChange = (
    data: any,
    checked: boolean,
) => {
    if (checked) {
        selectData.push(data.id);
    } else {
        selectData = selectData.filter((item) => item !== data.id);
    }
};
</script>

<style scoped lang='less'>
.change-org-content {
    border: 1px solid var(--005, #EBEBEB);
    border-radius: 4px;
    width: 100%;
    height: 360px;
    margin-bottom: 24px;
    padding: 16px;
    box-sizing: border-box;
    overflow: auto;
}
</style>
