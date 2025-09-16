<template>
    <div class="filter_wrap">
        <div>
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索MPS/CVE编号" />
            <SelectComp style="width: 140px;" v-model="filterOptions.level" :options="levelOption" placeholder="漏洞级别" />
            <el-select filterable style="margin-right: 8px; width: 150px;" v-model="filterOptions.filter_org_id"
                       placeholder="所属组织">
                <el-option v-for="item in lowOrgList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-button @click="resetHandle" class="minor_btn">重置</el-button>
        </div>

        <!-- <div v-if="userRole !== 'SAU'">
            <el-popconfirm popper-class="cancle-popper confirm-popper" v-if="selectData.length" title="确认删除？"
                @confirm="deleteStrategyList(selectData.map((item) => item.id))">
                <template #reference>
                    <el-button class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
            </el-popconfirm>
            <el-button @click="isAddModal = true;">添加</el-button>
        </div> -->
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap">
        <el-table :data="listData" height="100%" :cell-style="{ height: '48px' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column label="漏洞标题" prop="name" width="302"  show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.title || '暂未收录该漏洞' }}
                </template>
            </el-table-column>

            <el-table-column label="漏洞级别">
                <template #default="scope">
                    <div v-if="scope.row.level" :style="{color: getDangerLevel(scope.row.level).color}">{{ getDangerLevel(scope.row.level).text }}</div>
                    <div v-else>暂无</div>
                </template>
            </el-table-column>
            <el-table-column label="CVE编号" width="160">
                <template #default="scope">
                    {{ scope.row.cve_id || '暂无'}}
                </template>
            </el-table-column>
            <el-table-column label="MPS编号" width="160">
                <template #default="scope">
                    {{ scope.row.mps_id || '暂无' }}
                </template>
            </el-table-column>
            <el-table-column label="漏洞类型" width="130">
                <template #default="scope">
                    {{ scope.row.kind || '暂无' }}
                </template>
            </el-table-column>
            <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip />
            <el-table-column label="最近操作人" width="130">
                <template #default="scope">
                    <UserComp :name="scope.row.updated_user_name" />
                </template>
            </el-table-column>
            <el-table-column label="最近操作时间" width="160">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="60">
                <template #default="scope">
                    <div class="edit">
                        <span v-if="scope.row.title" class="g-mr-8 g-color-5 button-text-blue">
                            <a :href="generateVulnLink(scope.row.mps_id, scope.row.cve_id)" target="_blank">查看</a>
                        </span>

                        <!-- <el-popconfirm popper-class="cancle-popper confirm-popper"
                            @confirm="deleteStrategyList([scope.row.id])" :title="`确认删除?`">
                            <template #reference>
                                <span style="color: #F34D3D;">删除</span>
                            </template>
                        </el-popconfirm> -->
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- <div class="pagination" v-if="total > 0">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div> -->
    </div>

    <!-- <el-dialog v-model="isAddModal" @closed="formRef.resetFields()" width="664px" title="添加漏洞白名单">
        <el-form ref="formRef" :model="form" label-position="top" :rules="formRules" label-width="auto">
            <el-form-item class="g-mb-32" prop="vuln_no">
                <template #label>指定漏洞
                    <el-tooltip placement="right">
                        <template #content>
                            <div>
                                多个漏洞编号之间用回车隔开，例：<br>
                                CVE-2021-44906<br>
                                CVE-2023-45857<br>
                                CVE-2022-46175<br>
                            </div>
                        </template>
                        <span class="g-color-5">示例</span>
                    </el-tooltip>
                </template>
                <el-input type="textarea" :rows="6" v-model="form.vuln_no"
                    placeholder="请输入 MPS/CVE 漏洞编号（按 Enter 键继续添加）" />
            </el-form-item>

            <div class="group-btn">
                <el-button @click="isAddModal = false; formRef.resetFields()">取消</el-button>
                <el-button @click="confirmHandle(formRef)">确定</el-button>
            </div>
        </el-form>
    </el-dialog> -->

</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    formatDate, getDangerLevel, generateVulnLink,
} from 'util/tools';
import { getVulnWhiteListApi } from 'api/set';
import { lowOrgListApi } from 'api/org';
import UserComp from 'comp/UserComp.vue';
import SelectComp from 'comp/SelectComp.vue';
import { levelOption } from '../constants/constant';
import SearchComp from '@/components/SearchComp.vue';
// import { getOrgAuthInfo } from '@/control/org/hooks';

// const { userRole } = getOrgAuthInfo();

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    org_id: number | undefined,
    level: number | undefined,
    page: 1,
    limit: 1000,
    filter_org_id: undefined | number,
    list_type: 'child_org',
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    level: undefined,
    org_id: Number(window.localStorage.getItem('stra-reset-org-id')) || store.teamInfo.org_id,
    page: 1,
    limit: 1000,
    filter_org_id: undefined,
    list_type: 'child_org',
});
const {
    listData,
} = useList(getVulnWhiteListApi, filterOptions);

const lowOrgList = ref<any[]>([]);
onBeforeMount(async () => {
    try {
        const { data } = await lowOrgListApi(Number(window.localStorage.getItem('stra-reset-org-id')) || store.teamInfo.org_id);
        lowOrgList.value = data;
    } catch (error) {
        console.log(error);
    }
});

const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        level: undefined,
        org_id: Number(window.localStorage.getItem('stra-reset-org-id')) || store.teamInfo.org_id,
        filter_org_id: undefined,
    });
};

</script>

<style lang='less' scoped>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 24px;
}

.filter_wrap {
    margin-bottom: 16px;
    .between();

    .minor_btn {
        height: 32px;
        width: auto;
    }
}

.table_wrap {
    height: calc(100% - 85px);
    // overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
