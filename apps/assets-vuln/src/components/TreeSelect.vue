<template>
    <a-tree-select :dropdown-style="{ maxHeight: '480px', overflow: 'auto' }">
        <template #suffixIcon>
            <Svg height="12px" width="12px" :name="suffixIconName" color="#999999"></Svg>
        </template>
    </a-tree-select>
</template>

<script>
export default {
    props: {
        suffixIconName: {
            type: String,
            default: 'select-suffix',
        },
        suffixIconColor: {
            type: String,
            default: '#d9d9d9',
        },
    },
};
</script>
