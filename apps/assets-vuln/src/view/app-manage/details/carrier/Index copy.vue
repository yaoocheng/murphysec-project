<template>
    <!-- <div class="pl-6 pt-2 bg-white">
        <a-checkable-tag class="mr-3" v-for="(tag, index) in tagsData" :key="tag" v-model:checked="selectTags[index]"
                         @change="checked => handleChange(index)">
            {{ tag }}
        </a-checkable-tag>
    </div>

    <CodeRepo v-if="selectTags[2]" />

    <Products v-else-if="selectTags[1]" />

    <ServerAddr v-else-if="selectTags[0]" /> -->
    <CodeRepo />
</template>

<script setup>
// import { reactive, ref } from 'vue';
import CodeRepo from './CodeRepo.vue';
// import Products from './Products.vue';
// import ServerAddr from './ServerAddr.vue';

// const tagsData = reactive(['服务地址', '制品', '代码仓库']);
// const selectTags = ref([true, false, false]);

// const handleChange = (index) => {
//     selectTags.value = selectTags.value.map((item, i) => index === i);
// };
</script>
