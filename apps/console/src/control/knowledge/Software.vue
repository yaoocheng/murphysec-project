<template>
    <div class="flex items-center mb-6">
        <el-input @keydown.enter.prevent="enterCompData" v-model="filters.keyword" clearable placeholder="请搜索软件包名称"
                  class="mr-2 flex-1 h-10">
            <template #prefix>
                <i class="murphy icon-sousuo1"></i>
            </template>
        </el-input>

        <el-select v-model="filters.ecosystem" multiple placeholder="生态系统类型" :collapse-tags="true" large size="large"
                   clearable class="mr-6 w-[144px]">
            <el-option v-for="(item, key) in ecosystem" :key="key" :label="item.name" :value="key" />
        </el-select>

        <el-button @click="filters.page = 1;getCompData()" :disabled="!filters.ecosystem.length && !filters.keyword" size="large"
                   class="w-20 text-base">查询</el-button>
    </div>

    <div v-if="!isClick" class="text-xs text-3c mb-3">
        目前开源软件知识库收集 {{ cardsList.total_components }} 个软件包， {{ cardsList.total_component_versions }} 个版本，涉及 {{
            cardsList.total_ecosystems }} 个生态系统类型
    </div>

    <div v-if="!isClick" style="max-height: calc(100vh - 240px);" class="wrap w-full overflow-auto flex flex-wrap">
        <div class="card flex items-start" @click="filters.ecosystem.push(item.ecosystem); getCompData()"
             v-for="(item, i) in cardsList.distribution_summary" :key="i">
            <img class="w-8 mr-2" :src="ecosystem[item.ecosystem]?.img" alt="">

            <!-- <Tooltip width="400" :content="ecosystem[item.ecosystem]?.description">
                <SvgIcon class="top-2 right-2 absolute tips" name="tips" color="#858585"
                         style="width: 16px; height: 16px" />
            </Tooltip> -->
            <Tooltip width="400" :content="ecosystem[item.ecosystem]?.description">
                <div class="button-icon-grey top-2 right-2 absolute tips" >
                    <SvgIcon style="width: 16px; height: 16px" name="tips"/>
                </div>

            </Tooltip>

            <div class="flex-1 w-0 text-3c">
                <div class="font-medium text-lg mb-2 name ellipsis">{{ ecosystem[item.ecosystem]?.name }}</div>
                <div class="mb-2 text-xs text-85">软件包：{{ item.total_components }}</div>
                <div class="mb-2 text-xs text-85">版本：{{ item.total_component_versions }}</div>
            </div>
        </div>
    </div>

    <div v-loading="loading" v-else style="height: calc(100vh - 210px);"
         class="w-full flex justify-center bg-ff rounded p-6 box-border">
        <div class="w-full" v-if="listData.length">
            <div class="text-sm text-85 mb-3">
                <span class="mr-1">共 <span class="g-color-1">{{ total }}</span> 条数据</span>
                <TipsComp content="最多展示 100 条" />
            </div>

            <div style="height: calc(100% - 80px);">
                <el-table :data="listData" height="100%" class="rounded no_tr_hover"
                          :cell-style="{ padding: '12px 0', color: '#3c3c3c' }"
                          :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }">
                    <el-table-column prop="name" label="软件包名称" show-overflow-tooltip>
                        <template #default="{ row }">
                            <div class="flex items-center">
                                <img class="w-5 mr-2" :src="ecosystem[row.ecosystem]?.img" alt="">
                                <span @click="openDetail(row)"
                                      class="hover:underline hover:text-primary cursor-pointer">{{
                                          row.name
                                      }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ecosystem" label="生态系统类型" width="180">
                        <template #default="{ row }">
                            <span>{{ ecosystem[row.ecosystem]?.name }}<span v-if="row.ecosystem !== row.repository">（{{
                                row.repository
                            }}）</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="version_total" label="版本数量" width="100">
                        <template #default="{ row }">
                            <span @click="openDetail(row)" class="hover:underline hover:text-primary cursor-pointer">{{
                                row.version_total
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="project_total" label="使用项目数" width="120">
                        <template #default="{ row }">
                            <span @click="openDetail(row, 1)"
                                  class="hover:underline hover:text-primary cursor-pointer">{{
                                      row.project_total
                                  }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="lastUpdateTime" label="最近更新时间" width="110">
                        <template #default="{ row }">
                            {{ (row.time) }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <PageComp @change="getCompData" v-model:currentPage="filters.page" :total="total" :page-size="10" />
        </div>

        <div v-if="!total && !loading" class="self-center">
            <NoData description="未查询到结果" />
            <p class="font-normal mt-[-12px] text-sm text-85 text-center">您可以通过更改搜索词或筛选条件重新查询所需的内容</p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { queryCompListApi, getSoftwareKnowledgeListApi } from 'api/knowledge';
import store from 'util/store';
import { ecosystem } from '@/constants';
import TipsComp from '@/components/TipsComp.vue';
// import { formatDate } from '@/utils/tools';

const loading = ref(false);
const total = ref(0);
const isClick = ref(false);
const listData = ref([]);
const cardsList = ref([]);
const filters = ref({
    team_id: store.teamInfo.team_id,
    keyword: '',
    ecosystem: [],
    limit: 10,
    page: 1,
});

onBeforeMount(async () => {
    try {
        const { data } = await getSoftwareKnowledgeListApi();
        cardsList.value = data;
    } catch (error) {
        console.log(error);
    }
});

watch(filters.value, (newVal) => {
    if (!newVal.ecosystem.length && !newVal.keyword) {
        isClick.value = false;
        listData.value.length = 0;
        total.value = 0;
        filters.value.page = 1;
    }
});

const getCompData = async () => {
    loading.value = true;
    isClick.value = true;
    try {
        const { data } = await queryCompListApi(filters.value);
        loading.value = false;
        total.value = data.total;
        listData.value = data.list || [];
    } catch (error) {
        loading.value = false;
        console.log(error);
    }
};

const enterCompData = async () => {
    if (filters.value.keyword) {
        filters.value.page = 1;
        getCompData();
    }
};

const openDetail = (row, use) => {
    window.open(`/console/software-detail?name=${row.name}&ecosystem=${row.ecosystem}&repository=${row.repository}&use=${use || ''}`, '_blank');

    // router.push({
    //     path: '/software-detail',
    //     query: {
    //         name: row.name, ecosystem: row.ecosystem, repository: row.repository, use: use || undefined,
    //     },
    // });
};
</script>

<style lang="less" scoped>
.card {
    cursor: pointer;
    border: 1px solid #EBEBEB;
    border-radius: 8px;
    width: calc((100% - 72px) / 4);
    height: 117px;
    padding: 20px 24px;
    background-color: #fff;
    box-sizing: border-box;
    margin-right: 24px;
    margin-bottom: 16px;
    position: relative;

    .tips {
        display: none;
    }

    &:hover {
        .name {
            color: @primary;
        }

        .tips {
            display: flex;
            // display: block;
        }

        box-shadow: 0px 4px 20px -8px #2a2b3245;
    }
}

.card:nth-child(4n) {
    margin-right: 0;
}
</style>
