<template>
    <div class="top_btn g-mb-24">
        <span class="top_btn_item" @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">代码同源性分析</span>
        <span class="top_btn_item" v-if="store.conf?.module_binary_analysis" @click="activeTab = 2"
            :class="{ 'active': activeTab === 2 }">二进制文件同源性分析</span>
    </div>

    <New v-if="activeTab === 1&&UI===2" />

    <Old v-if="activeTab === 1&&UI===1" />

    <BinaryTable v-if="activeTab === 2" />

</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { UI } from './snippet/business';
import New from './snippet/New.vue';
import Old from './snippet/Old.vue';
import BinaryTable from './components/BinaryTable.vue';

const activeTab = ref<number>(1);
</script>

<style lang='less' scoped>
.table_wrap .td {
    .ellipsis();
}

.code-dialog {
    position: relative;

    .progress {
        position: absolute;
        right: 0;
        top: 0
    }

    .title {
        .g-color-3();
        .g-line-height();
    }

    .content {
        .g-color-1();
        .g-line-height();
        margin-bottom: 12px;
        max-width: 620px;
        word-break: break-all;
    }

    .code {
        padding: 16px;
        background-color: #F7F8FB;
        line-height: 22px;
    }
}
</style>
