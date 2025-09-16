<template>
    <div class="title">
        全局配置
    </div>
    <div class="desc">
        针对全部团队的全局性配置
    </div>

    <div class="g-bg-f7 g-p-24 g-bdr-6">
        <div class="title">
            同源性分析阈值配置
        </div>
        <div class="desc" style="margin-bottom: 16px;">
            设置代码同源性分析的阈值，来优化相似开源项目的识别精度
        </div>

        <div class="g-bg-ff g-p-24 g-bdr-6" style="padding-bottom: 8px;">
            <el-form ref="formRef" :show-message="false" :model="form" label-position="top" :rules="formRules"
                label-width="auto">
                <el-form-item class="g-mb-24" prop="match_min_feature_file_num">
                    <div>
                        <div class="g-f-14 g-color-1">
                            开源项目最小相似文件数
                            <el-input-number v-if="isEdit" style="width: 200px;" class="g-mr-8 g-ml-8"
                                v-model="form.match_min_feature_file_num" :min="0" />
                            <span v-else>{{ form.match_min_feature_file_num }}</span> 个
                        </div>
                        <div class="g-f-12 g-color-3">
                            当一个开源项目与被检测项目至少有 X 个文件相似时，该开源项目才会在同源性分析的检测结果中展示
                        </div>
                    </div>

                </el-form-item>

                <!-- <el-form-item class="g-mb-24" prop="match_min_projects_ratio">
                    <div>
                        <div class="g-f-14 g-color-1">
                            开源项目代码最小相似比例
                            <el-input-number v-if="isEdit" style="width: 120px;" class="g-mr-8 g-ml-8"
                                v-model="form.match_min_projects_ratio" :min="1" :max="100" />
                            <span v-else>{{ form.match_min_projects_ratio }}</span> %
                        </div>
                        <div class="g-f-12 g-color-3 g-mt-8">
                            当一个开源项目中至少有 X% 的代码与被检测项目相似，该开源项目才会在同源性分析的检测结果中展示
                        </div>
                    </div>

                </el-form-item> -->

                <el-form-item prop="match_min_ratio">
                    <div>
                        <div class="g-f-14 g-color-1">
                            检测项目代码最小相似比例
                            <el-input-number v-if="isEdit" style="width: 200px;" class="g-mr-8 g-ml-8"
                                v-model="form.match_min_ratio" :min="0" :max="100" />
                            <span v-else>{{ form.match_min_ratio }}</span> %
                        </div>
                        <div class="g-f-12 g-color-3 g-mt-8">
                            当一个开源项目与被检测项目中至少 X% 的文件相似时，该开源项目才会在同源性分析的检测结果中展示
                        </div>
                    </div>

                </el-form-item>
            </el-form>
        </div>

        <div v-if="isEdit" class="group-btn g-mt-24">
            <el-button @click="getInfo(); isEdit = false">取消</el-button>
            <el-button class="minor_btn" @click="saveHandle(formRef)">保存</el-button>
        </div>

        <div v-else class="group-btn g-mt-24">
            <el-button style="display: none;"></el-button>
            <el-button @click="isEdit = true">修改</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {
    ref, reactive,
} from 'vue';
import { getGlobalSetApi, saveGlobalSetApi } from 'api/set';
import { showMessage } from '@/utils/tools';

const isEdit = ref(false);
const formRef = ref();
const form = reactive({
    org_id: 2,
    match_min_feature_file_num: 3, // 开源项目最小相似文件数
    match_min_projects_ratio: 60, // 开源项目代码最小相似比例
    match_min_ratio: 20, //  检测项目最小匹配度
});

const formRules = reactive({
    match_min_feature_file_num: [{ required: true, trigger: 'blur' }],
    match_min_projects_ratio: [{ required: true, trigger: 'blur' }],
    match_min_ratio: [{ required: true, trigger: 'blur' }],
});

const getInfo = async () => {
    try {
        const { data } = await getGlobalSetApi({ org_id: 2 });
        form.match_min_feature_file_num = data.match_min_feature_file_num;
        form.match_min_projects_ratio = data.match_min_projects_ratio;
        form.match_min_ratio = data.match_min_ratio;
    } catch (error) {
        console.log(error);
    }
};
getInfo();

const saveHandle = async (formEl: any) => {
    try {
        const isValid = await formEl.validate((valid: any) => valid);
        if (isValid) {
            await saveGlobalSetApi(form);
            showMessage('保存成功', 'success');
            isEdit.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped lang='less'>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 24px;
}

.group-btn .minor_btn {
    &:hover {
        background-color: #6C87FF1A !important;
        color: #6C87FF !important;
    }

    background: #FFFFFF !important;
    border: 1px solid #6C87FF !important;
    border-radius: 6px;
    color: #6C87FF !important;
}
</style>
