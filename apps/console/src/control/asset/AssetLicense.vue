<template>
    <div class="g-mb-16 g-p-24 g-bdr-6 g-bg-ff g-flex g-align-center">
        <div class="card g-mr-24" style="width: 18%;">
            <div class="name">许可证数量</div>
            <div class="num">{{ totalNum }}</div>
        </div>
        <div class="card" style="width: 80%;">
            <div class="g-f-16 g-mb-16">许可证使用TOP5</div>

            <div class="g-flex g-justify-between" style="width: 100%;">
                <div v-for="item in top5Data" :key="item" class="g-flex" style="width:18%;">
                    <el-tooltip :content="item.license_name" placement="top">
                        <div style="max-width: 80%;margin-right: 8px;" class="ellipsis">{{ item.license_name }}
                        </div>
                    </el-tooltip>
                    <div class="g-f-14 g-color-5 g-fw-600">{{ item.project_num }}</div>
                </div>
            </div>
        </div>
    </div>
    <!-- <LicenseOverview v-if="totalNum" :top5Data="top5Data" :totalNum="totalNum" /> -->

    <div class="g-bdr-6 g-bg-ff g-p-16 g-mb-16 g-flex">
        <SearchComp v-model="filterOptions.keyword" style="width: 240px;" clearable placeholder="请搜索许可证名称" />
        <!-- <el-button @click="filterOptions.keyword = ''" class="minor_btn" style="height: 32px;">重置</el-button> -->
        <!-- <el-select v-model="filterOptions.license_family_id" clearable class="w-[140px]" placeholder="许可证类型">
            <el-option v-for="item in listType" :key="item.id" :label="item.license_family_name" :value="item.id" />
        </el-select> -->
    </div>

    <div class="g-bdr-6 g-bg-ff g-p-16">
        <div class="g-mb-16 g-color-3 g-f-14">共 <span class="g-color-1">{{ total }}</span> 条数据</div>
        <TableComp :data="listData">
            <el-table-column prop="license_name" label="许可证名称" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="store.isLic" prop="license_family_name" label="最新许可证类型">
                <template #default="{row}">
                    <span v-if="row.license_name==='NOASSERTION'">未知</span>
                    <span v-else>{{ row.license_family_name || '-' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="project_num" label="相关项目"></el-table-column>
            <el-table-column label="操作" width="60">
                <template #default="scope">
                    <span @click.stop="isShowLicenseInfo = true; licType = scope.row.license_family_name;
                                       licSource = scope.row.license_type_source; licenseName = scope.row.license_name;"
                          class="button-text-blue">
                        <!-- class="g-color-5 g-cursor-pointer"> -->
                        详情
                    </span>
                </template>
            </el-table-column>
        </TableComp>

        <PageComp v-model:currentPage="curPage" :total="total" :page-size="20" />

        <LicenseInfoModal v-model="isShowLicenseInfo" :licenseName="licenseName" :licType="licType" :licSource="licSource"
                          v-if="isShowLicenseInfo" />
    </div>
</template>

<script setup lang='ts'>
import SearchComp from 'comp/SearchComp.vue';
import { getLicenseListApi } from 'api/asset';
// import { getLicenseListApi as getLicenseTypeApi } from 'api/set';
import useList from 'util/hook';
import { ref, watch } from 'vue';
import store from 'util/store';
import PageComp from 'comp/PageComp.vue';
import LicenseInfoModal from '../project/detail/license/LicenseInfoModal.vue';
import TableComp from '@/components/TableComp.vue';
// import LicenseOverview from './license/LicenseOverview.vue';
// import { useRoute, useRouter } from 'vue-router';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
const isShowLicenseInfo = ref<boolean>(false);
const licenseName = ref<string>('');
const top5Data = ref<any[]>([]);
const totalNum = ref<number>(0);
const licType = ref();
const licSource = ref();

const filterOptions = ref({
    team_id: store.teamInfo.team_id,
    license_family_id: undefined,
    keyword: '',
});

const {
    total, curPage, listData,
} = useList(getLicenseListApi, filterOptions);

// const typefilters = ref({
//     team_id: store.teamInfo.team_id,
// });

// const {
//     listData: listType,
// } = useList(getLicenseTypeApi, typefilters);

watch(listData, (newVal:any[]) => {
    if (newVal?.length && !top5Data.value.length) {
        top5Data.value = newVal.slice(0, 5);
    }
});

watch(total, (newVal:number) => {
    if (newVal && !totalNum.value) {
        totalNum.value = newVal;
    }
});

// onBeforeMount(() => {
// })

// onMounted(() => {
// })
</script>

<style scoped lang='less'>
.card {
    font-size: 14px;
    background: #FFFFFF;
    border: 1px solid rgba(108, 135, 255, 0.657);
    border-radius: 6px;
    background: #6C87FF0D;
    padding: 24px;
    box-sizing: border-box;
    color: #3c3c3c;
    height: 110px;

    .name {
        font-size: 14px;
    }

    .num {
        margin-top: 16px;
        font-size: 20px;
        font-weight: 500;
        color: #6C87FF
    }

}
</style>
