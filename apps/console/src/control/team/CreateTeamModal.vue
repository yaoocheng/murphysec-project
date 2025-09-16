<template>
    <el-dialog title="创建团队" width="402px" @close="emits('update:modelValue', false)" :close-on-click-modal="false">
        <FormComp :rules="rules" :model="formData">
            <el-form-item prop="teamValue" label-position="top" @keydown.enter.prevent="confirmHandle" label="给你的团队取个名字" :required="true">
                <div class="form_item">
                    <!-- <div class="name">给你的团队起个名字</div> -->
                    <div>
                        <el-input style="width: 340px;" v-model="formData.teamValue" />
                    </div>
                </div>
            </el-form-item>
        </FormComp>

        <div class="btns">
            <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
            <el-button @click="confirmHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import validateTeamValue from 'util/verify';
import FormComp from 'comp/FormComp.vue';
import { createTeamApi, getTeamListApi } from 'api/team';
import { showMessage, localStorageUtil } from 'util/tools';

const emits = defineEmits(['update:modelValue']);
interface formDataType {
    teamValue: string,
}
const formData = reactive<formDataType>({
    teamValue: '',
});

const rules = reactive({
    teamValue: [{ validator: validateTeamValue }],
});

const confirmHandle = async () => {
    if (!formData.teamValue) return;
    await createTeamApi({ team_name: formData.teamValue });
    const res = await getTeamListApi();
    localStorageUtil('set', 'g-t', res.data[0]);

    showMessage('创建成功', 'success');
    emits('update:modelValue', false);
    window.location.reload();
};
</script>

<style lang="less" scoped>
.form_item .name {
    margin-bottom: 8px;
    color: #858585;
}

.btns {
    margin-top: 30px;
    margin-left: 61.5%;
}
</style>
