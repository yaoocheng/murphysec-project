<template>
    <el-dialog width="630px" :title="teamType === 'edit' ? '编辑团队' : '创建团队'" @closed=" emits('update:modelValue', false)"
        :close-on-click-modal="false">
        <div class="max-h-[584px] overflow-auto">
            <FormComp class="create-org-form" label-position="top" :hide-required-asterisk="false">
                <el-form-item label="团队名称" :required="true">
                    <div style="width: 100%;">
                        <el-input v-model.trim="formData.team_name" placeholder="请输入团队名称" maxlength="30"
                            show-word-limit></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="所属组织" :required="true">
                    <div style="width: 100%;">
                        <el-cascader :disabled="teamType === 'edit'" v-model="formData.org_id" :props="props"
                            class="g-w-100" />
                    </div>
                </el-form-item>

                <el-form-item label="团队负责人" :required="true">
                    <div style="width: 100%;">
                        <SelectMember v-model="formData.owner_user_id" class="g-w-100" />
                    </div>
                </el-form-item>

                <el-form-item label="描述">
                    <div style="width: 100%;">
                        <el-input v-model="formData.team_description" placeholder="请输入描述" type="textarea"
                            maxlength="200" show-word-limit></el-input>
                    </div>
                </el-form-item>

                <div v-if="store.conf.is_open_team_ext" @click="expand = !expand" class="cursor-pointer flex items-center mb-4 text-sm text-85">更多信息配置
                    <ExpandIcon :type="'t'" :expand="expand" />
                </div>

                <div v-if="expand&&store.conf.is_open_team_ext">
                    <el-form-item label="团队编号">
                        <el-input v-model.trim="moreinfo.team_serial_name" placeholder="请输入团队编号" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="团队中文简称">
                        <el-input v-model.trim="moreinfo.team_zh_short_name" placeholder="请输入团队中文简称" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="团队英文简称">
                        <el-input v-model.trim="moreinfo.team_en_short_name" placeholder="请输入团队英文简称" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="团队状态">
                        <el-input v-model.trim="moreinfo.team_status" placeholder="请输入团队状态" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="团队重要性等级">
                        <el-input v-model.trim="moreinfo.team_importance" placeholder="请输入团队重要性等级" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="恢复优先级">
                        <el-input v-model.trim="moreinfo.recovery_priority" placeholder="请输入恢复优先级" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="安全风险等级">
                        <el-input v-model.trim="moreinfo.security_risk_level" placeholder="请输入安全风险等级" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="安全保护等级">
                        <el-input v-model.trim="moreinfo.security_protection_level" placeholder="请输入安全保护等级" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="开发语言">
                        <el-input v-model.trim="moreinfo.program_language" placeholder="请输入开发语言" maxlength="30"
                            show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="开发厂商信息">
                        <el-input v-model.trim="moreinfo.program_company" placeholder="请输入开发厂商信息" maxlength="100"
                            show-word-limit></el-input>
                    </el-form-item>
                </div>
            </FormComp>
        </div>

        <template #footer>
            <div class="group-btn">
                <el-button @click=" emits('update:modelValue', false)">取消</el-button>
                <el-button :disabled="!formData.team_name || !formData.org_id.length || !formData.owner_user_id.length"
                    @click="confirm">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import FormComp from 'comp/FormComp.vue';
import type { CascaderProps } from 'element-plus';
import store from 'util/store';
import { loadTreeNode, curOrgInfo } from './hooks';
import SelectMember from './component/SelectMember.vue';
// import { showMessage } from '@/utils/tools';
import ExpandIcon from '@/components/ExpandIcon.vue';
// import { useRoute, useRouter } from 'vue-router';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
const emits = defineEmits(['update:modelValue', 'createTeam', 'editTeam']);
const prop = defineProps(['teamType', 'teamInfo']);
const expand = ref<boolean>(false);

const formData = ref<any>({
    team_name: '',
    team_description: '',
    owner_user_id: [],
    org_id: curOrgInfo.value.path.split(',').map(((item: any) => Number(item))).filter((item: any) => item && item !== 1),
});

const moreinfo = ref<any>({
    team_id: prop.teamInfo.id,
    team_serial_name: '',
    team_zh_short_name: '',
    team_en_short_name: '',
    team_status: '',
    team_importance: '',
    recovery_priority: '',
    security_risk_level: '',
    security_protection_level: '',
    program_language: '',
    program_company: '',
});

if (prop.teamType === 'edit') {
    formData.value = prop.teamInfo;
    moreinfo.value = prop.teamInfo.team_ext;
    // formData.value.owner_user_id = prop.teamInfo?.owner_list|| [];
    // formData.value.select_org_ids = prop.teamInfo?.select_org_ids || [];
}

const props: CascaderProps = {
    lazy: true,
    label: 'name',
    value: 'id',
    checkStrictly: true,
    lazyLoad: loadTreeNode,
};

const confirm = () => {
    if (prop.teamType === 'edit') {
        // if (!formData.value.team_name || !formData.value.owner_user_id?.length) {
        //     showMessage('必填项不能为空', 'warning');
        //     return;
        // }
        formData.value.team_ext = moreinfo.value;
        emits('editTeam', formData.value);
    } else {
        formData.value.team_ext = moreinfo.value;
        emits('createTeam', formData.value);

        // if (!formData.value.team_name || !formData.value.owner_user_id?.length || !formData.value.org_id?.length) {
        //     showMessage('必填项不能为空', 'warning');
        //     return;
        // }
    }
};

// onMounted(() => {
// })
</script>

<style scoped>
.create-org-form .el-form-item .el-form-item__label {
    pointer-events: none;
}
</style>
