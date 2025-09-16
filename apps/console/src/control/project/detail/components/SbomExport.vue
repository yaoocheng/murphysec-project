<template>
    <el-dialog width="420px" title="导出SBOM清单设置" @close="emits('update:modelValue', false)">
        <div class="mb-4">
            <div class="title">
                <span class="g-color-err">*</span>
                SBOM标准
            </div>
            <el-select @change="handleStandardChange" v-model="standard" class="w-full" placeholder="请选择SBOM标准">
                <el-option v-for="item in standardOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

        <div>
            <div class="title">
                <span class="g-color-err">*</span>
                导出格式
            </div>
            <el-select v-model="reqData.type" class="w-full" placeholder="请选择导出格式">
                <el-option v-for="item in formatOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

        <template #footer>
            <el-button class="minor_white_btn w-20 h-8" @click="emits('update:modelValue', false)">取消</el-button>
            <el-button class="w-20" :disabled="!isFormValid" @click="confirmHandle">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { exportSbomApi } from 'api/project';
import { useRoute } from 'vue-router';

const route = useRoute();
const emits = defineEmits(['update:modelValue']);
const standard = ref('SPDX 3.0');

const reqData = ref<any>({
    sid: route.params.sid,
    orgId: store.teamInfo.org_id,
    type: 2,
    type_version: '',
});

const standardOptions = [
    { label: 'SPDX 3.0', value: 'SPDX 3.0' },
    { label: 'SPDX 2.3', value: 'SPDX 2.3' },
    { label: 'SPDX 2.2', value: 'SPDX 2.2' },
    { label: 'CycloneDX 1.6', value: 'CycloneDX 1.6' },
    { label: 'CycloneDX 1.5', value: 'CycloneDX 1.5' },
    { label: 'CycloneDX 1.4', value: 'CycloneDX 1.4' },
    { label: 'CycloneDX 1.3', value: 'CycloneDX 1.3' },
    { label: 'SWID', value: 'SWID' },
    { label: '墨菲安全自有', value: '墨菲安全自有' },
];

// 定义常用的格式选项
const SPDX_FORMAT_OPTIONS = [
    { label: 'Tag-Value (.spdx)', value: 14 },
    { label: 'RDF (.rdf)', value: 11 },
    { label: 'JSON (.json)', value: 2 },
    { label: 'YAML (.yaml)', value: 10 },
];

const SPDX3_FORMAT_OPTIONS = [
    { label: 'JSON (.json)', value: 2 },
];

const CYCLONE_DX_FORMAT_OPTIONS = [
    { label: 'JSON (.json)', value: 3 },
    { label: 'XML (.xml)', value: 13 },
];

const formatOptions = computed(() => {
    if (standard.value.startsWith('SPDX 2')) {
        return SPDX_FORMAT_OPTIONS;
    }

    if (standard.value.startsWith('SPDX 3')) {
        return SPDX3_FORMAT_OPTIONS;
    }

    if (standard.value.startsWith('CycloneDX')) {
        return CYCLONE_DX_FORMAT_OPTIONS;
    }

    switch (standard.value) {
        case 'SWID':
            return [{ label: 'XML (.xml)', value: 4 }];
        case '墨菲安全自有':
            return [{ label: 'EXCEL（.xlsx）', value: 1 }];
        default:
            return [];
    }
});

const isFormValid = computed(() => standard.value && reqData.value.type !== undefined);

const handleStandardChange = () => {
    reqData.value.type = formatOptions.value[0]?.value;
};

const confirmHandle = () => {
    // 从standard中提取版本号
    const version = standard.value.match(/\d+\.\d+/)?.[0] || '';
    reqData.value.type_version = version;

    // 调用导出接口
    exportSbomApi(reqData.value).then(() => {
        showMessage('正在导出中，请在导出管理查看', 'success');
        emits('update:modelValue', false);
    });
};
</script>

<style lang="less" scoped>
.title {
    font-size: 14px;
    color: #3c3c3c;
    margin-bottom: 8px;
    font-weight: 500;
}
</style>
