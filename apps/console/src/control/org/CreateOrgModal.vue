<template>
    <el-dialog width="630px" :title="modalType === 'edit' ? '编辑组织' : '创建组织'" @closed="emits('update:modelValue', false)"
        :close-on-click-modal="false">
        <FormComp class="create-org-form" label-position="top" :hide-required-asterisk="false">
            <el-form-item label="组织名称" :required="true">
                <div style="width: 100%;">
                    <el-input v-model="formData.org_name" placeholder="请输入组织名称" maxlength="30"
                        show-word-limit></el-input>
                </div>
            </el-form-item>

            <el-form-item label="组织负责人">
                <div style="width: 100%;">
                    <SelectMember v-model="formData.principal_users" placeholder="请搜索并选择组织负责人" />
                </div>
            </el-form-item>

            <el-form-item label="描述">
                <div style="width: 100%;">
                    <el-input v-model="formData.description" placeholder="请输入描述" type="textarea" maxlength="200"
                        show-word-limit></el-input>
                </div>
            </el-form-item>
        </FormComp>
        <div class="group-btn">
            <el-button @click="emits('update:modelValue', false);">取消</el-button>
            <el-button v-if="formData.org_name" @click="confirm">确认</el-button>
            <el-button disabled v-else>确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import FormComp from 'comp/FormComp.vue';
import { addOrgApi, editOrgApi, editInfoOrgApi } from 'api/org';
import { ref, onBeforeMount } from 'vue';
import { curOrgInfo } from './hooks';
import SelectMember from './component/SelectMember.vue';
import { showMessage } from '@/utils/tools';
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import store from 'util/store';

const emits = defineEmits(['update:modelValue', 'updateOrgTree']);
const props = defineProps(['modalType']);

const formData = ref({
    principal_users: [],
    org_name: '',
    description: '',
});

onBeforeMount(async () => {
    if (props.modalType === 'edit') {
        try {
            const { data } = await editInfoOrgApi(curOrgInfo.value.id);
            formData.value.description = data.description;
            formData.value.org_name = data.name;
            formData.value.principal_users = data.principal_users?.map((item: any) => item.id);
        } catch (error) {
            console.log(error);
        }
    }
});

const confirm = async () => {
    if (!formData.value.org_name) {
        showMessage('组织名称不能为空', 'warning');
        return;
    }
    if (props.modalType === 'edit') {
        try {
            await editOrgApi({
                org_id: curOrgInfo.value.id,
                ...formData.value,
            });
            emits('update:modelValue', false);
            emits('updateOrgTree');
            showMessage('操作成功', 'success');
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            await addOrgApi({
                pid: curOrgInfo.value.id,
                ...formData.value,
            });
            emits('update:modelValue', false);
            emits('updateOrgTree');
            showMessage('操作成功', 'success');
        } catch (error) {
            console.log(error);
        }
    }
};
</script>

<style lang='less'>
.create-org-form .el-form-item .el-form-item__label {
    pointer-events: none;
}
</style>
