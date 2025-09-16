<template>
    <div class="permission-panel">
        <!-- 顶部全选 -->
        <div class="row header">
            <a-checkbox class="mr-2" :disabled="disabled" :checked="isAllChecked" :indeterminate="isPartiallyChecked"
                        @change="toggleAll" />
            <span class="col-1">功能点</span>
        </div>

        <!-- 功能点行 -->
        <div class="row" v-for="(func) in functions" :key="func.name">
            <!-- 功能点 checkbox -->
            <a-checkbox :disabled="disabled" class="role_disabled_checked" :checked="checkedSet.has(func.name)"
                        @change="toggleItem(func.name)">
                <!-- {{ func.label }} -->
                <span class="col-1 role_text">
                    {{ func.label }}
                    <TextPopover v-if="func.name === 'openApiAccess'" placement="right"
                                 :text="'勾选后，该角色有权限调用 OpenAPl，如“接入数据”等;在「个人中心-访问令牌」中复制访问令牌进行授权即可'">
                        <Svg name="icon_tip" class="ml-1" style="width:16px;height:16px;"></Svg>
                    </TextPopover>
                </span>
            </a-checkbox>

            <!-- <span class="col-1">
                {{ func.label }}
                <TextPopover v-if="func.name === 'openApiAccess'" placement="right" :text="'勾选后，该角色有权限调用 OpenAPI ，如“接入数据”等 ；在「设置-访问令牌」中复制访问令牌进行授权即可'">
                    <Svg name="icon_tip" class="ml-1" style="width:16px;height:16px;"></Svg>
                </TextPopover>
            </span> -->
        </div>
    </div>
</template>

<script setup>
import {
    ref, computed, watch,
} from 'vue';
import { Checkbox as ACheckbox } from 'ant-design-vue';

const props = defineProps({
    selectedFunctions: {
        type: Array,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['updateFunction']);

const functions = [
    { name: 'openApiAccess', label: 'OpenAPI 调用权限' },
];

const checkedSet = ref(new Set());

watch(() => props.selectedFunctions, (newVal) => {
    checkedSet.value = new Set(newVal);
});

// 当前已选中功能点名称 Set

// // 初始化选中状态
// const initializeCheckedSet = () => {
//     checkedSet.value = new Set();
// };

// // 组件挂载时初始化
// onMounted(() => {
//     initializeCheckedSet();
// });

// // 监听 props.selectedFunctions 变化
// watch(() => props.selectedFunctions, () => {
//     initializeCheckedSet();
// }, { deep: true });

// 所有可以被选中的功能点名称
const allSelectable = computed(() => functions.map((f) => f.name));

// 全选相关状态
const isAllChecked = computed(() => checkedSet.value.size === allSelectable.value.length);
const isPartiallyChecked = computed(
    () => checkedSet.value.size > 0 && !isAllChecked.value,
);

// 单个功能点 toggle
const toggleItem = (name) => {
    // eslint-disable-next-line no-unused-expressions
    checkedSet.value.has(name)
        ? checkedSet.value.delete(name)
        : checkedSet.value.add(name);
};

// 全选 toggle
const toggleAll = () => {
    if (isAllChecked.value) {
        checkedSet.value.clear();
    } else {
        checkedSet.value = new Set(allSelectable.value);
    }
};

// 每次变化后返回当前选中的功能点名称
watch(checkedSet, () => {
    const selectedFunctions = Array.from(checkedSet.value);
    emits('updateFunction', selectedFunctions);
    // console.log('当前选中的功能点：', selectedFunctions);
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
    /* width: 120px; */
    margin-left: 8px;
    display: flex;
    align-items: center;
}

.header {
    background-color: #F2F2F2;
    font-weight: bold;
    border-radius: 4px;
    padding: 11px 12px;
    font-weight: 500;
}
</style>
