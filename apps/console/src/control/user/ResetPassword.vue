<template>
    <el-dialog title="密码设置" :close-on-click-modal="false" width="450px" @close="emits('update:modelValue', false)">
        <div class="bind_wrap">
            <FormComp :rules="rules" :model="formData">
                <el-form-item prop="password">
                    <div class="item">
                        <el-input v-model="formData.password" type="password" show-password
                            placeholder="请输入（密码须8-20位，含至少一个特殊字符）"></el-input>
                    </div>
                </el-form-item>
                <el-form-item prop="password2">
                    <div class="item">
                        <el-input v-model="formData.password2" type="password" show-password placeholder="请再次输入">
                        </el-input>
                    </div>
                </el-form-item>
            </FormComp>

            <div class="btns item">
                <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
                <el-button @click="confirmBindHandle">确认</el-button>
            </div>
        </div>
    </el-dialog>

</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import { validatePassword } from 'util/verify';
import { updateUserInfoHandle, showMessage } from 'util/tools';
import { setPwd } from '@/api/user';
import FormComp from '@/components/FormComp.vue';

const emits = defineEmits(['update:modelValue']);

interface formDataType {
    password: string,
    password2: string,
}
const formData = reactive<formDataType>({
    password: '',
    password2: '',
});
const rules = reactive({
    password: [{ validator: validatePassword }],
    password2: [{ validator: validatePassword }],
});

// 确认
const confirmBindHandle = async () => {
    const res = await setPwd(formData);
    if (res.data.code === 200) {
        await updateUserInfoHandle();
        emits('update:modelValue', false);
        formData.password = '';
        formData.password2 = '';
        showMessage('设置成功', 'success');
    }
};
</script>

<style lang='less' scoped>
.item {
    width: 100%;
}

.btns {
    margin-left: 67%;
}
</style>
