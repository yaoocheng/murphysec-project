<template>
    <div class="main-content flex flex-col">
        <a-tabs v-model:activeKey="activeKey" class="base-tabs">
            <a-tab-pane key="1" :tab="'业务系统' + ' ' +totals.BusinessSystem">
                <BusinessSystemData/>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="'应用' + ' ' + totals.App">
                <AppData/>
            </a-tab-pane>
            <a-tab-pane key="3" :tab="'应用载体' + ' ' + totals.AppVector">
                <AppVectorData/>
            </a-tab-pane>
            <a-tab-pane key="4" :tab="'安全问题'+' ' + totals.SecIssue">
                <SecIssueData />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {
    getPreparationAppListApi, getPreparationAppCarrierListApi,
    getDataPreparationBusinessSystemListApi, getPreparationSecurityQuestionListApi,
} from 'api/data';
import { emitter } from 'utils';
import SecIssueData from './SecurityIssuesData/Index.vue';
import AppVectorData from './AppVectorData/Index.vue';
import AppData from './AppData/Index.vue';
import BusinessSystemData from './BusinessSystemData/Index.vue';

const activeKey = ref('1');

const totals = reactive({
    BusinessSystem: 0,
    App: 0,
    AppVector: 0,
    SecIssue: 0,
});

const gettotal = async () => {
    try {
        const [res1, res2, res3, res4] = await Promise.all([
            getPreparationAppListApi(),
            getPreparationAppCarrierListApi(),
            getDataPreparationBusinessSystemListApi(),
            getPreparationSecurityQuestionListApi(),
        ]);

        totals.BusinessSystem = res3.data.data.total;
        totals.App = res1.data.data.total;
        totals.AppVector = res2.data.data.total;
        totals.SecIssue = res4.data.data.total;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

emitter.on('getdatareviewtotal', gettotal);

gettotal();

</script>
