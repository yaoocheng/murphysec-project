<template>
    <el-dialog width="840" @close="emits('update:modelValue', false)" title="组件用法校准">
        <el-form class="pointer-events" :model="form" label-position="top">
            <el-form-item label="组件名称">
                <div class="mt-[-8px]">{{ form.comp_name }}</div>
            </el-form-item>

            <el-form-item label="组件版本">
                <div class="mt-[-8px]">{{ form.comp_version }}</div>
            </el-form-item>

            <el-form-item v-if="!isSinglePath" label="应用文件" :rules="{ required: true, message: '必填项不能为空' }" required>
                <template #label>
                    <div class="pointer-events-auto inline-block">
                        <span class="mr-1">应用文件</span>
                        <TipsComp placement="right" content="以下为系统识别的原组件来源文件，请选择此次校准将应用的文件" />
                    </div>
                </template>
                <el-select @change="changeFiles" :filter-method="filterHandle" filterable v-model="form.module_key"
                           popper-class="eloption" multiple placeholder="请搜索并选择组件来源文件">
                    <template #header>
                        <el-checkbox class="ml-3" v-model="checkAll" :indeterminate="indeterminate"
                                     @change="handleCheckAll">
                            全选
                        </el-checkbox>
                    </template>
                    <el-option :disabled="disabledUseOption(item)" v-for="item in options" :key="item.module_key"
                               :label="item.file_name" :value="item.path">
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

                                <span class="ml-2"></span>
                            </div>
                            <div class="text-xs text-85 font-normal mb-1">
                                文件路径：{{ item.path }}
                            </div>
                            <div class="text-xs text-85 font-normal">
                                组件用法：{{ USEMAP[item.way_of_use] }}
                            </div>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-else label="应用文件">
                <div class="bg-[#EBEBEB80] rounded-md px-6 py-4 w-full">
                    <div class="flex items-center leading-normal mb-1">
                        <img class="w-5 mr-1.5" src="~ast/fileImg/file_type_binary.svg" alt="">
                        <span class="inline-block">{{ adjustComp.comp_name }}</span>
                        <TagComp v-if="options[0]?.evidence_accuracy === 'Inaccuracy'" content="模糊" c="#525252"
                                 bgc="#EBEBEB" />
                        <TagComp v-if="options[0]?.evidence_accuracy === 'Accuracy'" class="ml-1" content="精准"
                                 c="#6425D0" bgc="#7F3BF533" />
                        <TagComp v-if="options[0]?.evidence_accuracy === 'Adjusted'" class="ml-1" content="校准"
                                 c="#B220B2" bgc="#D136D133" />
                    </div>
                    <div class="text-xs text-85 mb-1">文件路径：<span>{{ options[0]?.path }}</span></div>
                    <div class="text-xs text-85">组件用法：{{ USEMAP[options[0]?.comp_way_of_use] }}</div>
                </div>
            </el-form-item>

            <el-form-item label="组件用法" prop="way_of_use" :rules="{ required: true, message: '必选项不能为空' }" required>
                <template #label>
                    <div class="pointer-events-auto inline-block">
                        <span class="mr-1">组件用法</span>
                        <TipsComp placement="right" content="请根据来源文件校准组件用法" />
                    </div>
                </template>
                <SelectComp v-model="form.way_of_use" placeholder="请选择校准后的组件用法" :options="USEOP" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="mt-[-24px]">
                <el-button @click="emits('update:modelValue', false)" class="minor_btn h-auto w-20">取消</el-button>
                <Tooltip v-if="temporaryStorageSnip.length > 0 || temporaryStorageComp.length > 0"
                         :disabled="!temporaryStorageSnip.length && !temporaryStorageComp.length"
                         content="当前正在进行「同源性分析来源校准」或「组件校准」,请先提交同源性分析来源校准或组件校准的数据后再进行「组件用法校准」" width="328">
                    <el-button @click="confimHandle"
                               :disabled="temporaryStorageSnip.length > 0 || temporaryStorageComp.length > 0"
                               class="w-20">暂存</el-button>
                </Tooltip>
                <el-button v-else @click="confimHandle" class="w-20" :disabled="disabled">暂存</el-button>
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
import { USEOP, USEMAP } from '../../constants/constants';
import { temporaryStorageUseComp, isSinglePath } from './business';
import TipsComp from '@/components/TipsComp.vue';
import { showMessage } from '@/utils/tools';

const emits = defineEmits(['update:modelValue']);
const { adjustComp, editPath, clickPath } = defineProps(['adjustComp', 'clickPath', 'editPath']);
const checkAll = ref(false);
const indeterminate = ref(false);
const route = useRoute();

const form = reactive({
    comp_name: '',
    comp_version: '',
    way_of_use: '',
    repository: '',
    ecosystem: '',
    module_key: [],
});
const options = ref([]);
const cacheOptions = ref([]);
const disabled = computed(() => (isSinglePath.value && !form.way_of_use) || (!isSinglePath.value && (!form.module_key.length || !form.way_of_use)));
const disabledUseOption = (optionsItem) => {
    const findData = temporaryStorageUseComp.find((item) => (item.comp_name === adjustComp.comp_name) && (item.comp_version === adjustComp.comp_version) && (item.repository === adjustComp.repository) && (item.ecosystem === adjustComp.ecosystem));
    return findData?.module_list.some((ele) => ele.path === optionsItem.path) || false;
};

onBeforeMount(async () => {
    if (editPath) {
        options.value = adjustComp.module_list.filter((file) => editPath === file.path);
        form.way_of_use = options.value[0]?.target_way_of_use;
    } else {
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
            data.forEach((element) => {
                element.comp_way_of_use = element.way_of_use;
            });
            options.value = data;
            cacheOptions.value = [...data];
        } catch (error) {
            console.error(error);
        }
    }
    form.comp_name = adjustComp.comp_name;
    form.comp_version = adjustComp.comp_version;
    form.repository = adjustComp.repository;
    form.ecosystem = adjustComp.ecosystem;
    form.key = `${adjustComp.comp_name}_${adjustComp.comp_version}_${adjustComp.ecosystem}`;

    // 判断是否单条路径或点击路径显示单个组件路径
    isSinglePath.value = options.value?.length < 2 || clickPath;

    if (clickPath && options.value.some((a) => a.path === clickPath)) {
        form.module_key.push(clickPath);
        // eslint-disable-next-line no-use-before-define
        // changeFiles(form.module_key);
    } else if (options.value?.length < 2) {
        form.module_key.push(options.value[0]?.path);
    }
});

const filterHandle = (val) => {
    if (val) {
        options.value = cacheOptions.value.filter((item) => item.path.includes(val));
    } else {
        options.value = cacheOptions.value;
    }
};

const confimHandle = () => {
    const findDataIndex = temporaryStorageUseComp.findIndex((item) => (item.comp_name === adjustComp.comp_name) && (item.comp_version === adjustComp.comp_version) && (item.repository === adjustComp.repository) && (item.ecosystem === adjustComp.ecosystem));
    // 编辑或购物车已有
    if (findDataIndex !== -1) {
        if (editPath) {
            temporaryStorageUseComp[findDataIndex].module_list.forEach((item) => {
                if (item.path === editPath) {
                    item.target_way_of_use = form.way_of_use;
                }
            });
        } else {
            const module_list = options.value.filter((item) => form.module_key.some((ele) => ele === item.path));
            temporaryStorageUseComp[findDataIndex].module_list.push(...module_list.map((_) => ({
                ..._,
                target_way_of_use: form.way_of_use,
            })));
        }
    } else {
        // 当前组件首次暂存
        const module_list = options.value.filter((item) => form.module_key.some((ele) => ele === item.path));
        temporaryStorageUseComp.push({
            ...form,
            module_list: module_list.map((_) => ({
                ..._,
                target_way_of_use: form.way_of_use,
            })),
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
        form.module_key = options.value.map((_) => _.path);
    } else {
        form.module_key = [];
    }
};
</script>

<style lang="less">
.eloption .el-select-dropdown__item {
    height: 72px;
    line-height: 72px;
}
</style>
