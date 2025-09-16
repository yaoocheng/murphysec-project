<template>
    <div class="main-content">
        <div class="h-12 mb-2 bg-white py-[10px] px-6 flex items-center justify-between">
            <Input class="base-input" v-model:value="sca_name" placeholder="搜索安全能力名称" />

            <a-button class="base-button" type="primary" @click="openSecAbilityModal = true;editData = null">新增</a-button>
        </div>

        <div class="h-calc56 px-6 py-4 bg-white overflow-auto">
            <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }" :columns="columns"
                     :scroll="{ x: '100%' }" :data-source="TableData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, text ,record }">
                    <template v-if="column.dataIndex === 'capability_name'
                        || column.dataIndex === 'capability_desc' ">
                        <template v-if="text">
                            <a-tooltip arrowPointAtCenter>
                                <template #title>{{ text }}</template>
                                <span v-if="text==='墨菲安全情报'" class="ellipsis flex items-center">
                                    {{ text }}
                                    <Tag class="ml-1" v-if="text==='墨菲安全情报'" :cssClass="{backgroundColor: '#E5EAFF',color: '#0025CC'}" text="默认" />
                                </span>
                                <span v-else class="ellipsis">
                                    {{ text }}
                                </span>
                            </a-tooltip>
                        </template>
                        <template v-else>
                            <span>-</span>
                        </template>
                    </template>

                    <template v-else-if="column.dataIndex === 'capability_type'">
                        <a-tooltip v-if="text" arrowPointAtCenter>
                            <template #title>{{ getSecurityCapabilityName(text) }}</template>
                            <span class="max-w-full ellipsis">
                                {{ getSecurityCapabilityName(text) || '-' }}
                            </span>
                        </a-tooltip>

                        <span v-else>-</span>
                    </template>

                    <template v-else-if="column.dataIndex === 'operate' && record.is_built_in === false">
                        <span @click="handleEdit(record)"  class="cursor-pointer text-primary mr-4">编辑</span>

                        <a-popover :overlayStyle="{ zIndex: 500 }"
                                   :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft" :arrow="false">
                            <template #content>
                                <div class="cursor-pointer">
                                    <div @click="turnOnLog(record.security_capability_id)" class="table-operation-item px-6 py-2">
                                        <span>操作日志</span>
                                    </div>

                                    <div @click="canDeleteSecAbility(record)"  class="table-operation-item text-error px-6 py-2" >
                                        <span>删除</span>
                                    </div>

                                </div>

                            </template>
                            <span class="icon-hover hover:bg-[#E5EAFF] py-1 cursor-pointer">
                                <EllipsisOutlined class="text-primary text-base" />
                            </span>
                        </a-popover>
                    </template>

                    <template v-else>
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span class="max-w-full ellipsis">
                                {{ text || '-' }}
                            </span>
                        </a-tooltip>
                    </template>
                </template>
            </a-table>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
        <SecAbilityModal v-model:open="openSecAbilityModal" v-if="openSecAbilityModal" :editData="editData" @updateList="getData"/>
    </div>
</template>

<script setup>
import {
    ref, reactive, computed, h,
} from 'vue';
import { getSecAbleListApi, delSecAbleApi } from 'api/app';
import { indicator } from 'utils';
import { judgeSecurityCapabilityApi } from 'api/delete';
import { Modal } from 'ant-design-vue';
import { usePageList } from '@/hooks';
import SecAbilityModal from './SecAbilityModal.vue';
import { getSecurityCapabilityName } from '@/constants/safetyCapabilities';

import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

const sca_name = ref('');
const openSecAbilityModal = ref(false);
const editData = ref(null);
const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'SecurityCapability',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = (security_capability_id) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(security_capability_id);
};

const filters = reactive({
    limit: 1000,
});

const {
    listData,
    loading,
    getData,
} = usePageList(getSecAbleListApi, filters);

const TableData = computed(() => listData.value.filter((item) => item.capability_name.includes(sca_name.value)));

const columns = ref([
    {
        title: '安全能力名称',
        dataIndex: 'capability_name',
        width: 280,
    },
    {
        title: '安全能力标识',
        dataIndex: 'capability_unique_id',
        width: 178,
        ellipsis: true,
        flex: 'left',
    },
    {
        title: '安全能力类型',
        dataIndex: 'capability_type',
        width: 280,
    },
    {
        title: '安全能力的描述',
        dataIndex: 'capability_desc',
    },
    {
        title: '操作',
        dataIndex: 'operate',
        fixed: 'right',
        width: 120,
    },
]);

const handleEdit = (record) => {
    editData.value = record;
    openSecAbilityModal.value = true;
};

// 判断能否删除安全能力
const canDeleteSecAbility = async (record) => {
    const { data } = await judgeSecurityCapabilityApi(record.security_capability_id);

    if (!data.data) {
        Modal.confirm({
            class: 'delete-confirm-modal',
            title: '确认删除此数据吗？',
            icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                h('img', { src: warningIcon, alt: '信息图标' }),
            ]),
            content: '数据删除后将不可恢复，请谨慎操作！',
            async onOk() {
                try {
                    console.log('删除', record);
                    await delSecAbleApi({
                        id: record.security_capability_id,
                    });
                } catch {
                    return console.log('Oops errors!');
                } finally {
                    getData();
                }
            },
            onCancel() {

            },
        });
    } else {
        Modal.confirm({
            class: 'delete-confirm-modal',
            title: '无法删除',
            icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                h('img', { src: warningIcon, alt: '信息图标' }),
            ]),
            content: '该安全能力下关联了其他数据，请解除关联后再删除',
            okCancel: false, // ✅ 去掉取消按钮
            okText: '确定',
            async onOk() {
                console.log('确定删除');
            },
            onCancel() {},
        });
    }
};
</script>
