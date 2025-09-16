<template>
    <div class="title">
        许可证类型
    </div>
    <div class="desc">
        <!-- xxxxxxxxxxxxxx -->
    </div>

    <div class="filter_wrap">
        <div class="flex">
            <SearchComp class="w-[240px]" v-model="filterOptions.keyword" clearable placeholder="请搜索许可证类型" />
            <SelectComp clearable class="w-[140px]" v-model="filterOptions.source" placeholder="来源"
                        :options="licenseSourceOp" />
        </div>

        <el-button class="main_btn" v-if="normalTeamAuth || isUserSpace"
                   @click="showModal = true; modalType = 'new'; editItem = null">添加</el-button>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ total }}</span> 条数据
    </div>

    <div style="height: calc(100% - 180px);">
        <TableComp :data="listData" height="100%">
            <el-table-column prop="license_family_name" label="许可证类型">
                <template #default="{ row }">
                    <span class="cursor-pointer">
                        {{ row.license_family_name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" width="90">
                <template #default="{ row }">
                    {{ licenseSourceOp.find(item => item.value === row.source)?.label }}
                </template>
            </el-table-column>

            <el-table-column label="最近操作人" width="140">
                <template #default="{row}">
                    <UserComp :name="row.updated_user_name||'-'" />
                </template>
            </el-table-column>

            <el-table-column label="最近操作时间" width="180">
                <template #default="scope">
                    {{ formatDate(scope.row.update_at) }}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="110" fixed="right">
                <template #default="scope">
                    <span @click="editItem = scope.row; modalType = 'check'; showModal = true"
                          v-if="scope.row.source === 'builtin'" class="button-text-blue">
                        <!-- v-if="scope.row.source === 'builtin'" class="g-color-5 g-cursor-pointer"> -->
                        查看
                    </span>
                    <span v-else class="g-cursor-pointer flex items-center">
                        <span @click="editItem = scope.row; modalType = 'edit'; showModal = true"
                              class="button-text-blue ">编辑</span>
                        <!-- class="g-color-5 g-mr-16">编辑</span> -->
                        <el-popconfirm width="200" popper-class="cancle-popper confirm-popper"
                                       title="此操作将彻底删除此许可证类型"
                                       @confirm="deleteStrategyList(scope.row.id)">
                            <template #reference>
                                <span class="button-text-red">删除</span>
                                <!-- <span class="g-color-err">删除</span> -->
                            </template>
                        </el-popconfirm>
                    </span>
                </template>
            </el-table-column>
        </TableComp>
    </div>

    <!-- <PageComp v-model:currentPage="curPage" :total="total" :page-size="20" /> -->

    <TypeModal v-model="showModal" @updateData="getData" v-if="showModal" :editItem="editItem" :modalType="modalType"
               :listData="listData" />
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import store from 'util/store';
import { getLicenseListApi, delLinTypeApi } from 'api/set';
import TableComp from 'comp/TableComp.vue';
import UserComp from 'comp/UserComp.vue';
import useList from 'util/hook';
import { licenseSourceOp, compUse } from './store';
import SearchComp from '@/components/SearchComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import { formatDate, showMessage } from '@/utils/tools';
import TypeModal from './TypeModal.vue';

const showModal = ref(false);
const modalType = ref('new');
const editItem = ref();
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    source: string | undefined,
    limit: undefined,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    source: undefined,
    limit: undefined,
});

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const {
    total, getData, listData,
} = useList(getLicenseListApi, filterOptions);

watch(listData, (newVal) => {
    if (newVal.length) {
        newVal.forEach((item) => {
            const arr = [];
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in item.license_rule) {
                arr.push({
                    type: key,
                    name: compUse[key],
                    ...item.license_rule[key],
                });
            }
            item.license_rule = arr;
        });
    }
});

// 删除
const deleteStrategyList = async (id: string) => {
    await delLinTypeApi({
        id,
    });
    getData();
    showMessage('删除成功', 'success');
};

</script>

<style scoped lang='less'>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 16px;
}

.filter_wrap {
    margin-bottom: 16px;
    .between();

    .minor_btn {
        height: 32px;
        width: auto;
    }
}

.num {
    display: inline;
    border-radius: 4px;
    margin-right: 15px;

    span {
        &:nth-of-type(1) {
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        &:nth-of-type(2) {
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            padding: 3px 6px;
        }

        display: inline;
        padding: 3px 5px;
    }
}
</style>
