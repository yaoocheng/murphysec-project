<template>
    <el-dialog width="840" @close="emits('update:modelValue', false)" title="组件版本校准">
        <el-form class="pointer-events" :model="form" label-position="top">
            <el-form-item label="组件名称">
                {{ form.comp_name }}
            </el-form-item>

            <el-form-item label="组件版本" prop="target_version" :rules="{ required: true, message: '必填项不能为空' }" required>
                <el-input v-model="form.target_version" maxlength="100" show-word-limit placeholder="请输入组件版本" />
            </el-form-item>

            <el-form-item label="应用文件" :rules="{ required: true, message: '必填项不能为空' }" required>
                <template #label>
                    <div class="pointer-events-auto inline-block">
                        <span class="mr-1">应用文件</span>
                        <TipsComp placement="right" content="以下为系统识别的原组件来源文件，请选择此次校准将应用的文件" />
                    </div>
                </template>
                <el-select @change="changeFiles" :filter-method="filterHandle" filterable v-model="form.module_list"
                           popper-class="versioneloption" multiple placeholder="请搜索并选择应用文件">
                    <template #header>
                        <el-checkbox class="ml-3" v-model="checkAll" :indeterminate="indeterminate"
                                     @change="handleCheckAll">
                            全选
                        </el-checkbox>
                    </template>
                    <el-option v-for="item in options" :key="item.module_key" :label="item.file_name"
                               :value="item.path">
                        <div class="leading-normal pt-1.5">
                            <div class="flex items-center mb-1">
                                <img class="w-5 mr-1" src="~ast/fileImg/file_type_binary.svg" alt="">
                                {{ item.file_name }}

                                <TagComp v-if="item.evidence_accuracy === 'Inaccuracy'" content="模糊" c="#525252"
                                         bgc="#EBEBEB" />

                                <TagComp v-if="item.evidence_accuracy === 'Accuracy'" class="ml-1" content="精准"
                                         c="#6425D0" bgc="#7F3BF533" />

                                <TagComp v-if="item.evidence_accuracy === 'Adjusted'" class="ml-1" content="校准"
                                         c="#B220B2" bgc="#D136D133" />
                            </div>
                            <div class="text-xs text-85 font-normal">
                                {{ item.path }}
                            </div>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="mt-[-24px]">
                <el-button @click="emits('update:modelValue', false)" class="minor_btn h-auto w-20">取消</el-button>
                <Tooltip v-if="temporaryStorageSnip.length>0||temporaryStorageUseComp.length>0" :disabled="!temporaryStorageSnip.length&&!temporaryStorageUseComp.length>0" content="当前正在进行「同源性分析来源校准」或「组件用法校准」,请先提交同源性分析来源校准或组件用法校准的数据后再进行「组件校准」"
                         width="328">
                    <el-button @click="confimHandle" :disabled="temporaryStorageSnip.length>0||temporaryStorageUseComp.length>0" class="w-20">暂存</el-button>
                </Tooltip>
                <el-button v-else @click="confimHandle" :disabled="disabled" class="w-20">暂存</el-button>

            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import {
    reactive, ref, onBeforeMount, computed,
} from 'vue';
import { useRoute } from 'vue-router';
import { getAssoFilesApi } from 'api/project';
import store from '@/utils/store';
import { temporaryStorageSnip } from '../snippet/business';
import { temporaryStorageComp } from '../../business';
import { temporaryStorageUseComp } from '../comp_use/business';
import TipsComp from '@/components/TipsComp.vue';
import { showMessage } from '@/utils/tools';

const emits = defineEmits(['update:modelValue']);
const { adjustComp, clickPath } = defineProps(['adjustComp', 'clickPath']);
const checkAll = ref(false);
const indeterminate = ref(false);
const route = useRoute();

const form = reactive({
    comp_name: '',
    comp_version: '',
    target_version: '',
    repository: '',
    ecosystem: '',
    module_list: [],
    showFileList: [],
});
const options = ref([]);
const cacheOptions = ref([]);

onBeforeMount(async () => {
    try {
        const { data } = await getAssoFilesApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
            comp_name: adjustComp.comp_name,
            repository: adjustComp.repository,
            ecosystem: adjustComp.ecosystem,
            comp_version: adjustComp.comp_version,
            org_id: store.teamInfo.org_id,
        });
        options.value = data;
        options.value = options.value.filter((_) => !_.path.includes('同源分析'));
        cacheOptions.value = [...options.value];
        // eslint-disable-next-line no-return-assign
        // options.value.forEach((item) => item.dealPath = item.path.replaceAll('!', '/'));

        // 当前组件已经暂存 直接回显
        const findData = temporaryStorageComp.find((item) => (item.comp_name === adjustComp.comp_name) && (item.comp_version === adjustComp.comp_version) && (item.repository === adjustComp.repository) && (item.ecosystem === adjustComp.ecosystem));
        if (findData) {
            // eslint-disable-next-line array-callback-return
            form.comp_name = findData.comp_name;
            form.comp_version = findData.comp_version;
            form.target_version = findData.target_version;
            form.repository = findData.repository;
            form.ecosystem = findData.ecosystem;
            form.module_list = findData.module_list;
            // 路径默认选中
            if (options.value.some((a) => a.path === clickPath) && !findData.module_list.includes(clickPath)) {
                form.module_list.push(clickPath);
            }

            // eslint-disable-next-line no-use-before-define
            changeFiles(form.module_list);
        } else {
            // 打开新的组件
            form.comp_name = adjustComp.comp_name;
            form.comp_version = adjustComp.comp_version;
            form.target_version = adjustComp.target_version || adjustComp.comp_version;
            form.repository = adjustComp.repository;
            form.ecosystem = adjustComp.ecosystem;

            // 路径默认选中
            if (options.value.some((a) => a.path === clickPath)) {
                form.module_list.push(clickPath);
            }
            // eslint-disable-next-line no-use-before-define
            changeFiles(form.module_list);
        }
    } catch (error) {
        console.log(error);
    }
});

const filterHandle = (val) => {
    if (val) {
        options.value = cacheOptions.value.filter((item) => item.path.includes(val));
    } else {
        options.value = cacheOptions.value;
    }
};

const disabled = computed(() => !form.target_version || !form.module_list.length);

const confimHandle = () => {
    const findIndex = temporaryStorageComp.findIndex((item) => (item.comp_name === form.comp_name) && (item.comp_version === form.comp_version) && (item.repository === form.repository) && (item.ecosystem === form.ecosystem));
    const showFileList = options.value.filter((item) => form.module_list.some((ele) => ele === item.path));

    if (findIndex === -1) {
        temporaryStorageComp.push({
            ...form,
            showFileList,
        });
    } else {
        temporaryStorageComp.splice(findIndex, 1, {
            ...form,
            showFileList,
        });
    }

    emits('update:modelValue', false);
    showMessage('暂存成功', 'success');
};

const changeFiles = (val) => {
    if (val.length === 0) {
        checkAll.value = false;
        indeterminate.value = false;
    } else if (val.length === options.value.length) {
        checkAll.value = true;
        indeterminate.value = false;
    } else {
        indeterminate.value = true;
    }
};

const handleCheckAll = (val) => {
    indeterminate.value = false;
    if (val) {
        form.module_list = options.value.map((_) => _.path);
    } else {
        form.module_list = [];
    }
};
</script>

<style lang="less">
.versioneloption .el-select-dropdown__item {
    height: 52px;
    line-height: 52px;
}
</style>
