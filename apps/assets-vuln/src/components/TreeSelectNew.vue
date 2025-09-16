<template>
    <a-tree-select :listHeight="listHeight" class="group">
        <template #suffixIcon>
            <Svg :height="suffixIconHeight" :class="isBus&&value?'group-hover:hidden':''" :width="suffixIconWidth" :name="suffixIconName" color="#999999"></Svg>
        </template>

        <template #title="{ organize_name ,business_system_name }">
            <div class="flex items-center justify-between">
                <span class="ellipsis">{{ organize_name || business_system_name}}</span>
                <Svg class="check-icon mr-2" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
            </div>
        </template>
    </a-tree-select>
</template>

<script setup>

defineProps({

    suffixIconName: {
        type: String,
        default: 'select-suffix',
    },
    suffixIconColor: {
        type: String,
        default: '#d9d9d9',
    },
    suffixIconHeight: {
        type: String,
        default: '6px',
    },
    suffixIconWidth: {
        type: String,
        default: '10px',
    },
    listHeight: {
        type: Number,
        default: 580,
    },
    isBus: {
        type: Boolean,
        default: false,
    },
});

</script>
