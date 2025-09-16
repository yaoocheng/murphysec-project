<template>
    <el-dialog title="组件列表" align-center width="840px" :close-on-click-modal="false" @close="closeHandle">
        <div class="desc text-85 font-normal mt-[-16px] mb-6">组件之间为"或"的关系</div>
        <div class="add-btn flex items-center justify-center p-1 w-20 mb-2 hover_icon text-primary" @click="addComp">
            <i class="murphy icon-jia" /> 添加组件
        </div>

        <div class="comp-list" style="max-height: calc(100vh - 304px);overflow: auto;">
            <div v-for="(item, index) in compList" :key="index" class="flex items-center mb-2">
                <el-input v-model="item.comp_name" placeholder="请输入组件完整名称，如：com.alibaba:fastjson"
                          class="w-[521px] mr-2" />
                <el-select clearable v-model="item.ecosystem" placeholder="请选择生态仓库" style="width: 240px" filterable
                           allow-create>
                    <el-option v-for="option in ecosystemOptions" :key="option.value" :label="option.label"
                               :value="option.value" />
                </el-select>
                <div v-if="index === 0" class="w-6 opacity-0 ml-2"></div>
                <span v-if="index !== 0" class="button-icon-grey box-border close ml-2">
                    <i  class="murphy icon-cuo g-cursor-pointer font-bold text-85"
                        @click="deleteComp(index)" />
                </span>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button class="minor_btn h-8 w-20" @click="closeHandle">取消</el-button>
                <el-button class="w-20" type="primary" :disabled="isDisabled" @click="confirmHandle">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ecosystem } from '@/constants';

// 生态仓库选项
const ecosystemOptions = Object.keys(ecosystem).map((key) => ({
    label: ecosystem[key].name,
    value: key,
}));

const props = defineProps(['showData']);
const emits = defineEmits(['update:modelValue', 'confirm']);

// 组件列表数据
const compList = ref([{
    comp_name: '',
    ecosystem: '',
}]);

// 判断确定按钮是否禁用
const isDisabled = computed(() => {
    if (compList.value.length === 0) return true;
    return compList.value.some((item) => !item.comp_name);
});

// 监听showData变化
watch(() => props.showData, (newVal) => {
    if (newVal?.length) {
        compList.value = [...newVal];
    }
}, { immediate: true });

// 添加组件
const addComp = () => {
    compList.value.push({
        comp_name: '',
        ecosystem: '',
    });
};

// 删除组件
const deleteComp = (index: number) => {
    compList.value.splice(index, 1);
};

// 关闭弹框
const closeHandle = () => {
    compList.value = [{
        comp_name: '',
        ecosystem: '',
    }];
    emits('update:modelValue', false);
};

// 确认提交
const confirmHandle = () => {
    emits('confirm', compList.value);
    closeHandle();
};
</script>

<style lang="less" scoped>
.hover_icon:hover {
    background-color: #6C87FF1A;
}
.button-icon-grey.close i {
    color: #858585 !important;
}
</style>
