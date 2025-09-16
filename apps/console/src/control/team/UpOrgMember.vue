<template>
    <div class="flex" style="height: calc(100% - 54px);flex-direction: column;">
        <div v-if="cacheData.length" class="g-p-16 g-mb-16 g-bg-ff g-bdr-6">
            <SearchComp @input="searchHandle" style="width: 240px;" v-model="filterOptions.keyword" clearable
                placeholder="请搜索昵称" />
        </div>

        <div class="content" style="flex: 1;">
            <TableComp v-if="tableData?.length" :data="tableData" height="100%">
                <el-table-column label="昵称">
                    <template #default="scope">
                        <div class="g-flex g-align-center">
                            <UserComp :name="scope.row.username" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column label="所属组织">
                    <template #default="scope">
                        <span v-for="(item, index) in scope.row.org_names" :key="item">{{ item }}<span v-if="index!==scope.row.org_names.length-1">；</span></span>
                    </template>
                </el-table-column>
            </TableComp>

            <NoData class="mt-20" description="暂无上级组织负责人" v-else />
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref } from 'vue';
import { upOrgManageListApi } from 'api/org';
import UserComp from 'comp/UserComp.vue';
import SearchComp from 'comp/SearchComp.vue';
import { getGruopListApi } from 'api/team';
import TableComp from '@/components/TableComp.vue';
import NoData from '@/components/NoData.vue';

const tableData = ref<Array<any>>([]);
const cacheData = ref<Array<any>>([]);
const filterOptions = ref<any>({
    keyword: '',
});

const getList = async () => {
    let groupId = '';
    try {
        const res = await getGruopListApi({ team_id: store.teamInfo.team_id });
        groupId = res.data[0].group_id;
    } catch (error) {
        console.log(error);
    }
    try {
        const res = await upOrgManageListApi({ team_id: store.teamInfo.team_id, group_id: groupId });
        tableData.value = res.data;
        cacheData.value = res.data;
    } catch (error) {
        console.log(error);
    }
};
getList();

const searchHandle = (val: string) => {
    tableData.value = cacheData.value.filter((item) => item.username.includes(val));
};

</script>

<style lang='less' scoped>
.content {
    box-sizing: border-box;
    overflow: auto;
    font-size: 14px;
    color: #3D3D3D;
    position: relative;
    background-color: #fff;
    padding: 16px;
    overflow: auto;
    border-radius: 6px;

    i {
        vertical-align: -2px;
    }

    img {
        width: 42px;
        height: 42px;
        vertical-align: middle;
        border-radius: 50%;
        display: inline-block;
    }

    .item {
        &:hover {
            background-color: #F6F9FD;
        }

        height: 74px;
        transition: all .2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F2F4F6;
        padding-left: 24px;
    }

    .info {
        display: flex;

        // .img_wrap {
        //     border: 1px solid #6C87FF;
        //     border-radius: 50%;
        //     width: 46px;
        //     height: 46px;
        //     line-height: 46px;
        //     text-align: center;
        //     margin-right: 30px;
        // }
        img {
            margin-right: 30px;
        }

        .name {
            font-size: 14px;
            font-weight: 600;
            color: #3D3D3D;
            margin-bottom: 5px;
        }

        .contact {
            font-size: 12px;
            color: #8C95A1;
        }
    }

    .num {
        display: inline-block;
        padding: 5px 10px;
        text-align: center;
        background: #6C87FF;
        border-radius: 13px;
        color: #fff;
    }

    .time {
        color: #A2A8B3;
    }

    .width:nth-of-type(1) {
        width: 50%;
    }

    .width:nth-of-type(2) {
        width: 30%;
    }
}
</style>
