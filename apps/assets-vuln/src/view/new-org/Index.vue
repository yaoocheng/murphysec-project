<template>
    <div class="main-content">
        <a-tabs :destroyInactiveTabPane="true" v-model:activeKey="activeKey" class="base-tabs">
            <a-tab-pane key="1" tab="组织与成员">
                <OrgMember/>
            </a-tab-pane>
            <a-tab-pane key="2" tab="已离职成员">
                <DepartedMember />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import OrgMember from './org-member/Index.vue';
import DepartedMember from './departed-member/Index.vue';

const activeKey = ref('1');
</script>
