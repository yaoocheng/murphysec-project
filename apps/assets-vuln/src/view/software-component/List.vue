<template>
    <div class="main-content">
        <a-tabs v-model:activeKey="activeKey" class="bg-white overflow-auto software-component-tabs">
            <a-tab-pane key="1" tab="软件成分">
                <SoftwareList />
            </a-tab-pane>
            <a-tab-pane key="2" tab="合同识别">
                <ContractList />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SoftwareList from './list-tabs/SoftwareList.vue';
import ContractList from './list-tabs/ContractList.vue';

const activeKey = ref('1');

</script>

<style>
.software-component-tabs {
    background-color: #fff;
    height: 100%;
    .ant-tabs-nav-wrap {
        padding: 0 24px;
    }

    .ant-tabs-nav {
        margin-bottom: 0;
    }

}
</style>
