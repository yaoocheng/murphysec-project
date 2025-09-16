<template>
    <el-dialog width="640px" title="添加成员至团队" @closed="emits('update:modelValue', false)" :close-on-click-modal="false">
        <div class="change-org-content">
            <!-- <SearchComp style="width: 340px;" class="g-mb-16" v-model="filterOptions.keyword"
                @change="filterOptions.page = 1; listData = []; getData();" placeholder="回车搜索昵称/邮箱" /> -->

            <el-input style="width: 320px;" class="g-mb-16" v-model="filterOptions.keyword"
                      @change="filterOptions.page = 1; listData = []; getData();" :placeholder="filterOptions.keyword_type==='user'?'请搜索昵称/邮箱（回车搜索）':'请搜索组织名称（回车搜索）'">
                <template #prepend>
                    <el-select @change="filterOptions.keyword=''" v-model="filterOptions.keyword_type" style="width: 80px">
                        <el-option label="昵称" value="user" />
                        <el-option label="组织" value="org" />
                    </el-select>
                </template>
            </el-input>

            <el-table :data="listData" height="360" @selection-change="handleSelectionChange"
                      :cell-style="{ padding: '14px 0' }"
                      :header-cell-style="{ padding: '14px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }"
                      style="width: 100%">
                <el-table-column :selectable="selectable" type="selection" width="30" />
                <el-table-column label="昵称">
                    <template #default="scope">
                        <div class="g-flex g-align-center">
                            <UserComp :name="scope.row.nickname" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属组织" show-overflow-tooltip>
                    <template #default="scope">
                        <span v-for="(item, index) in scope.row.org_names" :key="item">{{ item }}<span
                            v-if="index !== scope.row.org_names.length - 1">；</span></span>
                    </template>
                </el-table-column>

                <!-- <template #append v-if="listData.length >= 30">
                    <div v-if="!isNoMoreData" @click="filterOptions.page++; getData()"
                         class="g-color-5 g-f-14 g-cursor-pointer g-ta-c g-pt-16 g-pb-16">
                        点击加载更多数据
                    </div>
                    <div class="g-f-14 g-color-f7 g-ta-c g-pt-16 g-pb-16" v-else>
                        无更多数据
                    </div>
                </template> -->
            </el-table>
        </div>

        <div class="flex justify-between items-center">
            <div class="text-85 text-sm font-normal">
                已选择 <span class="text-3c">{{ result.length }}</span> 个
            </div>

            <div class="group-btn">
                <el-button @click="emits('update:modelValue', false)">取消</el-button>
                <el-button @click="emits('addMember', result)">确认</el-button>
            </div>
        </div>

    </el-dialog>
</template>

<script setup lang='ts'>
// import SearchComp from 'comp/SearchComp.vue';
import UserComp from 'comp/UserComp.vue';
import { getOrgLongMemberApi, getTeamInfoApi } from 'api/org';
import { ref, onBeforeMount } from 'vue';
import store from 'util/store';
// import SearchComp from '@/components/SearchComp.vue';
// import TableComp from '@/components/TableComp.vue';
// import PageComp from '@/components/PageComp.vue';
// import { orgHooks } from '../org/hooks';

// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';

const emits = defineEmits(['addMember', 'update:modelValue']);
const props = defineProps(['memberData', 'curTid']);
const filterOptions = ref<any>({
    org_id: 2,
    keyword: '',
    keyword_type: 'user',
});
const listData = ref<any[]>([]);
const isNoMoreData = ref<boolean>(false);

// 获取数据
const getData = async () => {
    try {
        const { data } = await getOrgLongMemberApi(filterOptions.value);
        isNoMoreData.value = !data || !data.length;
        listData.value = data || [];
    } catch (error) {
        console.log(error);
    }
};

const selectable = (data: any) => !props.memberData.some((item: any) => item.user_id === data.user_id);

onBeforeMount(async () => {
    try {
        const { data } = await getTeamInfoApi({
            team_id: props.curTid || store.teamInfo.team_id,
        });
        filterOptions.value.org_id = data?.org_info?.id;
        getData();
    } catch (error) {
        console.log(error);
    }
});

const result = ref<any[]>([]);

const handleSelectionChange = (selectlist: any[]) => {
    result.value = selectlist;
};

// const selectable = (data: any) => !props.memberData.some((item: any) => item.user_id === data.user_id);
</script>

<style scoped lang='less'>
.change-org-content {
    width: 100%;
    // height: 360px;
    margin-bottom: 24px;
    box-sizing: border-box;
    overflow: auto;
}
</style>

<style lang="less">
.cell .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #cccccc63;
}
</style>
