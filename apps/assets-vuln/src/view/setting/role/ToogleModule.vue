<template>
    <div class="permission-panel">
        <!-- 顶部全选 -->
        <div class="row header">
            <a-checkbox :checked="isAllChecked" :disabled="disabled" :indeterminate="isPartiallyChecked"
                        @change="toggleAll" />
            <span class="col-1">一级模块</span>
            <span class="col-2">二级模块</span>
        </div>

        <!-- 模块行 -->
        <div class="row" v-for="(module) in modules" :key="module.name">
            <!-- 一级模块 checkbox -->
            <a-checkbox class="w-[145px] role_disabled_checked" :disabled="disabled"
                        :checked="getModuleCheckedState(module)" :indeterminate="isModuleIndeterminate(module)"
                        @change="toggleModule(module)">
                <div class="flex items-center role_text">
                    {{ module.label }}
                    <TextPopover v-if="['vulnIntel','data','secAbility','set'].includes(module.name)" placement="right"
                                 :text="'本模块下属二级功能均为全局性功能，不区分数据隔离权限;勾选后该角色将获得对应功能的全部数据访问与操作权限，请谨慎分配'">
                        <Svg name="icon_tip" class="ml-1" style="width:16px;height:16px;"></Svg>
                    </TextPopover>
                </div>
            </a-checkbox>

            <!-- <span class="col-1">
                {{ module.label }}
            </span> -->

            <!-- 二级模块 -->
            <div class="col-2">
                <template v-if="module.children?.length">
                    <a-checkbox v-for="child in module.children" :disabled="disabled" class="role_disabled_checked"
                                :key="child.name" :checked="checkedSet.has(child.name)" @change="toggleItem(child.name)">
                        <span class="role_text">
                            {{ child.label }}
                        </span>
                    </a-checkbox>
                </template>
                <template v-else> - </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref, computed, watch,
} from 'vue';
import { Checkbox as ACheckbox } from 'ant-design-vue';

const props = defineProps({
    selectedModules: {
        type: Array,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['updateModule']);

// 当前已选中模块名称 Set
const checkedSet = ref(new Set());

watch(() => props.selectedModules, (newVal) => {
    if (newVal.length === 18) {
        checkedSet.value = new Set([...newVal, 'set', 'data', 'asset', 'secIssueGroup']);
    } else {
        checkedSet.value = new Set(newVal);
    }
});

const modules = [
    { name: 'dashboard', label: '驾驶舱' },
    {
        name: 'asset',
        label: '资产',
        children: [
            { name: 'businessManage', label: '业务系统' },
            { name: 'appManage', label: '应用管理' },
            { name: 'appVector', label: '应用载体' },
            { name: 'softwareComponent', label: '软件成分' },
        ],
    },
    {
        name: 'secIssueGroup',
        label: '问题处置',
        children: [
            { name: 'secIssue', label: '安全问题' },
            { name: 'riskTask', label: '处置任务' },
        ],
    },
    { name: 'vulnIntel', label: '漏洞情报' },
    {
        name: 'data',
        label: '数据接入',
        children: [
            { name: 'taskManage', label: '任务管理' },
            { name: 'pluginMarket', label: '插件管理' },
            { name: 'contractInput', label: '合同录入' },
            { name: 'dataReview', label: '数据预审' },
        ],
    },
    { name: 'secAbility', label: '安全能力' },
    {
        name: 'set',
        label: '设置',
        children: [
            { name: 'org', label: '组织与成员' },
            { name: 'roleSetting', label: '角色管理' },
            { name: 'notifySetting', label: '通知设置' },
            { name: 'aiSetting', label: 'AI模型配置' },
            { name: 'AccessToken', label: '访问令牌' },
        ],
    },
];

// 所有可以被选中的模块名称
const allSelectable = computed(() => modules.flatMap((m) => (m.children?.length
    ? [m.name, ...m.children.map((c) => c.name)]
    : [m.name])));

// 全选相关状态
const isAllChecked = computed(() => checkedSet.value.size === allSelectable.value.length);
const isPartiallyChecked = computed(
    () => checkedSet.value.size > 0 && !isAllChecked.value,
);

// 获取一级模块的选中状态
const getModuleCheckedState = (module) => {
    if (!module.children?.length) {
        // 没有子模块的情况，直接返回一级模块是否被选中
        return checkedSet.value.has(module.name);
    }
    // 有子模块的情况，只有当所有子模块都被选中时才返回true
    return module.children.every((c) => checkedSet.value.has(c.name));
};

// 子模块是否部分选中
const isModuleIndeterminate = (module) => {
    if (!module.children?.length) return false;

    const selectedCount = module.children.filter((c) => checkedSet.value.has(c.name)).length;
    // 部分选中：有子模块被选中，但不是全部
    return selectedCount > 0 && selectedCount < module.children.length;
};

// 单个模块 toggle
const toggleItem = (name) => {
    // eslint-disable-next-line no-unused-expressions
    checkedSet.value.has(name)
        ? checkedSet.value.delete(name)
        : checkedSet.value.add(name);
};

// 一级模块 toggle
const toggleModule = (module) => {
    if (module.children?.length) {
        const fullyChecked = getModuleCheckedState(module);
        module.children.forEach((c) => {
            // eslint-disable-next-line no-unused-expressions
            fullyChecked
                ? checkedSet.value.delete(c.name)
                : checkedSet.value.add(c.name);
        });
    } else {
        // 无子项时，直接切换一级模块自身状态
        // eslint-disable-next-line no-unused-expressions
        checkedSet.value.has(module.name)
            ? checkedSet.value.delete(module.name)
            : checkedSet.value.add(module.name);
    }
};

// 全选 toggle
const toggleAll = () => {
    if (isAllChecked.value) {
        checkedSet.value.clear();
    } else {
        checkedSet.value = new Set(allSelectable.value);
    }
};

// 每次变化后返回当前选中的模块名称
watch(checkedSet, () => {
    const selectedModules = Array.from(checkedSet.value);
    emits('updateModule', selectedModules.filter((item) => item !== 'asset' && item !== 'set' && item !== 'data' && item !== 'secIssueGroup'));
}, { deep: true });
</script>

<style scoped>
.role_disabled_checked.ant-checkbox-wrapper-disabled .role_text {
    color: #3c3c3c !important;
}

.permission-panel {
    border: 1px solid #f0f0f0;
    border-radius: 6px;
}

.row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 11px 12px;
}

.row:last-child {
    border-bottom: none;
}

.col-1 {
    width: 120px;
    margin-left: 8px;
    display: flex;
    align-items: center;
}

.col-2 {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.header {
    background-color: #F2F2F2;
    font-weight: bold;
    border-radius: 4px;
    padding: 11px 12px;
    font-weight: 500;
}
</style>
