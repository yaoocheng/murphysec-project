<template>
    <el-dialog width="840px" :title="`${editData?.id ? '编辑' : '添加'}检测范围模版`">
        <el-form ref="formRef" :model="form" label-position="top" :rules="formRules" label-width="auto">
            <el-form-item class="g-mb-24" label="扫描语言" prop="lang">
                <template #label>
                    扫描语言
                    <TipsComp content="设置的扫描语言仅对源代码项目生效" placement="right" />
                </template>
                <div class="g-w-100">
                    <el-radio-group @change="form.lang = []; formRef.clearValidate('lang')" style="margin-top: -6px;"
                                    v-model="form.langType" class="ml-4">
                        <el-radio value="1" size="large">指定语言</el-radio>
                        <el-radio value="2" size="large">
                            <div>
                                全部语言
                                <TipsComp class="g-vertival--1" content="全部语言包含指定语言及其他开发语言" placement="right" />
                            </div>
                        </el-radio>
                    </el-radio-group>

                    <el-select v-if="form.langType === '1'" v-model="form.lang" placeholder="请选择语言" multiple>
                        <template #header>
                            <el-checkbox style="height: 20px;" v-model="checkAll" @change="handleCheckAll">
                                全选
                            </el-checkbox>
                        </template>
                        <el-option v-for="(item, i) in languageFileExtensions" :key="i" :label="item.label"
                                   :value="item.label" />
                    </el-select>
                </div>
            </el-form-item>

            <el-form-item class="g-mb-24" label="排除目录">
                <template #label>
                    <div>
                        排除目录
                        <TipsComp content="被排除的目录将不进行扫描" placement="right" />
                    </div>
                </template>

                <div class="g-w-100 g-flex g-mb-8" v-for="(item, i) in form.exclude_dir_regular" :key="i">
                    <el-input v-model="item.value" placeholder="请输入正则表达式 例：.*/test/.*"></el-input>
                    <i @click="delInput(form.exclude_dir_regular, i)"
                       class="murphy icon-shanchu2 g-color-3 g-ml-14 g-cursor-pointer g-f-14"></i>
                </div>

                <div style="margin-top: -4px;" @click="addInput(form.exclude_dir_regular)"
                     class="g-color-5 g-fw-400 g-cursor-pointer">
                    <i class="murphy icon-jia g-vertical--2 g-f-18"></i> 添加
                </div>
            </el-form-item>

            <el-form-item class="g-mb-24" label="扫描目录">
                <template #label>
                    <div>
                        扫描目录
                        <TipsComp content="除了指定扫描的目录，其他目录将不进行扫描" placement="right" />
                    </div>
                </template>
                <div class="g-w-100 g-flex g-mb-8" v-for="(item, i) in form.include_dir_regular" :key="i">
                    <el-input v-model="item.value" placeholder="请输入正则表达式 例：.*/test/.*"></el-input>
                    <i @click="delInput(form.include_dir_regular, i)"
                       class="murphy icon-shanchu2 g-color-3 g-ml-14 g-cursor-pointer g-f-14"></i>
                </div>

                <div style="margin-top: -4px;" @click="addInput(form.include_dir_regular)"
                     class="g-color-5 g-fw-400 g-cursor-pointer">
                    <i class="murphy icon-jia g-vertical--2 g-f-18"></i> 添加
                </div>
            </el-form-item>

            <el-form-item class="g-mb-24" label="模板名称" prop="name">
                <el-input v-model="form.name" :show-word-limit="true" :maxlength="30" placeholder="请输入模版名称"></el-input>
            </el-form-item>

            <el-form-item class="g-mb-24" label="模板描述">
                <el-input v-model="form.description" :show-word-limit="true" :maxlength="500" type="textarea" :rows="4"
                          placeholder="请输入模版描述"></el-input>
            </el-form-item>

            <div class="group-btn">
                <el-button @click="emits('triggerEdit')">取消</el-button>
                <el-button @click="confirmHandle(formRef)">确定</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import store from 'util/store';
import TipsComp from '@/components/TipsComp.vue';
import { languageFileExtensions } from '../constants/constant';
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import { } from 'api/project';

const emits = defineEmits(['triggerEdit']);
const { editData } = defineProps(['editData']);

const checkAll = ref(false);
const formRef = ref();
const form = reactive<any>({
    id: '0',
    team_id: store.teamInfo.team_id,
    langType: '1',
    name: '',
    description: '',
    lang: [],
    exclude_dir_regular: [{ value: '' }],
    include_dir_regular: [{ value: '' }],
});

const handleCheckAll = (val: boolean) => {
    if (val) {
        form.lang = languageFileExtensions.map((item) => item.label);
    } else {
        form.lang = [];
    }
};

if (editData) {
    Object.assign(form, editData);
    form.langType = form.info.language_filter?.length ? '1' : '2';
    form.lang = form.info.language_filter?.map((item: any) => item.language);
    form.exclude_dir_regular = form.info.exclude_dir_regular?.length ? form.info.exclude_dir_regular.map((item: any) => ({ value: item })) : [{ value: '' }];
    form.include_dir_regular = form.info.include_dir_regular?.length ? form.info.include_dir_regular.map((item: any) => ({ value: item })) : [{ value: '' }];
}

const langValid = (rule: any, value: any, callback: any) => {
    if (form.langType === '1' && !form.lang.length) {
        callback(new Error('请选择语言'));
    }
    callback();
};
const formRules = reactive({
    lang: [{ required: true, validator: langValid, trigger: 'blur' }],
    name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
});

const delInput = (list: any, index: number) => {
    list.splice(index, 1);
};
const addInput = (list: any) => {
    list.push({
        value: '',
    });
};

const confirmHandle = async (formEl: any) => {
    try {
        const isValid = await formEl.validate((valid: any) => valid);
        if (isValid) {
            const exclude_dir_regular = form.exclude_dir_regular.map((item: any) => item.value).filter((item: any) => item);
            const include_dir_regular = form.include_dir_regular.map((item: any) => item.value).filter((item: any) => item);
            const language_filter = form.lang.map((item: any) => languageFileExtensions.find((ele) => ele.label === item)?.value);
            form.info = {
                include_dir_regular,
                exclude_dir_regular,
                language_filter,
            };
            emits('triggerEdit', form);
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped lang='less'></style>
