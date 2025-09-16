<template>
    <div class="title">
        许可证策略
    </div>
    <div class="desc">
        设置许可证策略，为不同场景下的许可证自定义风险等级
    </div>

    <div class="filter_wrap">
        <SearchComp v-model="filterOptions.keyword" clearable placeholder="请搜索策略名称" />
        <el-button class="main_btn" v-if="normalTeamAuth || isUserSpace"
            @click="showModal = true; lincenseStore.type = 1">添加</el-button>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ total }}</span> 条数据
    </div>

    <div style="height: calc(100% - 216px);">
        <TableComp :data="listData" height="100%" >
            <el-table-column prop="name" label="策略名称" width="" show-overflow-tooltip></el-table-column>
            <el-table-column prop="desc" label="策略说明" width="" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column label="许可证风险等级" width="320">
                <template #default="scope">
                    <span class="info_item">
                        <span class="num">
                            <span style="background-color: #F34D3D;color: #fff;">H</span>
                            <span style="background-color: rgba(245, 74, 69, 0.2);color: #F34D3D;">{{
            scope.row.license_high_num
        }}</span>
                        </span>
                        <span class="num">
                            <span style="background-color: #FF9940;color: #fff;">M</span>
                            <span style="background-color: rgba(255, 153, 64, 0.2);color: #FF9940;">{{
                scope.row.license_medium_num
            }}</span>
                        </span>
                        <span class="num">
                            <span style="background-color: #FCBE03;color: #fff;">L</span>
                            <span style="background-color: rgba(255, 204, 51, 0.2);color: #FCBE03;">{{
                scope.row.license_low_num
            }}</span>
                        </span>
                        <span class="num">
                            <span style="background-color: #A7AECC;color: #fff;">N</span>
                            <span style="background-color: rgba(167, 174, 204, 0.2);color: #A7AECC;">{{
                scope.row.license_safe_num
            }}</span>
                        </span>
                    </span>
                </template>
            </el-table-column> -->
            <el-table-column label="状态" width="">
                <template #default="scope">
                    {{ scope.row.is_open === 1 ? '已开启' : '已关闭' }}
                </template>
            </el-table-column>

            <el-table-column label="最近操作人" width="140">
                <template #default="scope">
                    <UserComp :name="scope.row.updated_user_name" />
                </template>
            </el-table-column>

            <el-table-column label="最近操作时间" width="180">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                    <span v-if="scope.row.name==='系统默认许可证策略'" @click="showModal=true;Object.assign(lincenseStore, scope.row); lincenseStore.type=3" class="g-color-5 g-cursor-pointer">
                        查看
                    </span>
                    <span v-else class="g-cursor-pointer">
                        <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认禁用？" v-if="scope.row.is_open === 1" @confirm="changeStatus(scope.row.id, false)">
                            <template #reference>
                                <span class="g-color-err g-mr-16" >禁用</span>
                            </template>
                        </el-popconfirm>

                        <el-popconfirm title="确认开启？" v-else @confirm="changeStatus(scope.row.id, true)">
                            <template #reference>
                                <span class="g-color-5 g-mr-16">启用</span>
                            </template>
                        </el-popconfirm>

                        <span class="g-color-5 g-mr-16"
                            @click="Object.assign(lincenseStore, scope.row); lincenseStore.type=2;showModal=true;">编辑</span>
                        <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认删除？" @confirm="deleteStrategyList([scope.row.id])">
                            <template #reference>
                                <span class="g-color-err">删除</span>
                            </template>
                        </el-popconfirm>
                    </span>
                </template>
            </el-table-column>
        </TableComp>
    </div>

    <PageComp v-model:currentPage="curPage" :total="total" :page-size="20" />

    <AddLicenseStra v-if="showModal" v-model="showModal" @updateData="updateData" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { getLicenseStraListApi, delLicenseStraListApi, licenseStraStatusApi } from 'api/team';
import TableComp from 'comp/TableComp.vue';
import PageComp from 'comp/PageComp.vue';
import UserComp from 'comp/UserComp.vue';
import useList from 'util/hook';
import lincenseStore from './store';
import SearchComp from '@/components/SearchComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import AddLicenseStra from './AddLicenseStra.vue';
import { formatDate, showMessage } from '@/utils/tools';

const showModal = ref(false);
const filterOptions = ref<{
    team_id: string,
    keyword: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
});

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const {
    total, curPage, listData, getData,
} = useList(getLicenseStraListApi, filterOptions);

// 删除
const deleteStrategyList = async (ids: Array<string>) => {
    await delLicenseStraListApi({
        ids,
    });
    getData();
    showMessage('删除成功', 'success');
};

const updateData = (data: any) => {
    showModal.value = data;
    getData();
};

const changeStatus = async (id: string, isOpen: boolean) => {
    try {
        await licenseStraStatusApi({
            id, // 策略ID
            is_open: isOpen, // 是否开启
        });
        showMessage('操作成功', 'success');
        getData();
    } catch (error) {
        console.log(error);
    }
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
