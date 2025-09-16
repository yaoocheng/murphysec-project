<template>
    <div class="filter_wrap">
        <div>
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索MPS/CVE编号" />
            <SelectComp style="width: 140px;" v-model="filterOptions.level" :options="levelOption" placeholder="漏洞级别" />
            <el-button @click="resetHandle" class="minor_btn">重置</el-button>
        </div>

        <div v-if="userRole !== 'SAU'">
            <el-popconfirm popper-class="cancle-popper confirm-popper" v-if="selectData.length" title="确认删除？"
                           @confirm="deleteStrategyList(selectData.map((item) => item.id))">
                <template #reference>
                    <el-button style="width: 80px;" class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
            </el-popconfirm>
            <el-button class="main_btn" @click="isAddModal = true;">添加</el-button>
        </div>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap">
        <el-table :data="listData" height="100%" @selection-change="selectHandle" :cell-style="{ height: '48px' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column type="selection" width="30" />
            <el-table-column label="漏洞标题" prop="name" width="302" show-overflow-tooltip>
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
            <el-table-column v-if="userRole !== 'SAU'" fixed="right" label="操作" width="110">
                <template #default="scope">
                    <div class="edit flex">
                        <span v-if="scope.row.title" class="g-mr-8 g-color-5 button-text-blue">
                            <a :href="generateVulnLink(scope.row.mps_id, scope.row.cve_id)" target="_blank">查看</a>
                        </span>

                        <el-popconfirm popper-class="cancle-popper confirm-popper"
                                       @confirm="deleteStrategyList([scope.row.id])" :title="`确认删除?`">
                            <template #reference>
                                <span style="color: #F34D3D;" class="button-text-red">删除</span>
                            </template>
                        </el-popconfirm>
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

    <el-dialog v-model="isAddModal" @closed="formRef.resetFields()" width="664px" title="添加漏洞白名单">
        <el-form ref="formRef" :model="form" label-position="top" :rules="formRules" label-width="auto">
            <el-form-item class="g-mb-32" prop="vuln_no">
                <template #label>指定漏洞
                    <!-- <el-tooltip placement="right">
                        <template #content>
                            <div>
                                多个漏洞编号之间用回车隔开，例：<br>
                                CVE-2021-44906<br>
                                CVE-2023-45857<br>
                                CVE-2022-46175<br>
                            </div>
                        </template>
                        <span class="g-color-5">示例</span>
                    </el-tooltip> -->
                </template>
                <el-input type="textarea" :rows="6" v-model="form.vuln_no"
                          placeholder="请输入 CVE/MPS 漏洞编号，每行一个" />
            </el-form-item>

            <div class="group-btn">
                <el-button @click="isAddModal = false; formRef.resetFields()">取消</el-button>
                <el-button @click="confirmHandle(formRef)">确定</el-button>
            </div>
        </el-form>
    </el-dialog>

</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    formatDate, showMessage, getDangerLevel, generateVulnLink,
} from 'util/tools';
import { addVulnWhiteListApi, getVulnWhiteListApi, delVulnWhiteListApi } from 'api/set';
import UserComp from 'comp/UserComp.vue';
import SelectComp from 'comp/SelectComp.vue';
import { levelOption } from '../constants/constant';
import SearchComp from '@/components/SearchComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const selectData = ref<Array<any>>([]);
const { userRole } = getOrgAuthInfo();
const isAddModal = ref(false);

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    level: number | undefined,
    page: 1,
    limit: 1000,
    list_type: 'current_org',
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    level: undefined,
    page: 1,
    limit: 1000,
    list_type: 'current_org',
});
const {
    listData, getData,
} = useList(getVulnWhiteListApi, filterOptions);

const formRef = ref();
const form = reactive({
    vuln_no: '',
});

const vulnValid = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('请填写漏洞编号'));
    }
    if (value.split(/[\r\n\t]/).length > 100) {
        callback(new Error('最多填写100个漏洞编号'));
    }
    callback();
};
const formRules = reactive({
    vuln_no: [{
        required: true,
        validator: vulnValid,
        trigger: 'blur',
    }],
});

const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        level: undefined,
    });
};

const confirmHandle = async (formEl: any) => {
    if (form.vuln_no.split(/[\r\n\t]/).length > 100) {
        showMessage('最多填写100个漏洞编号', 'warning');
        return;
    }
    try {
        const isValid = await formEl.validate((valid:any) => valid);
        if (isValid) {
            await addVulnWhiteListApi({
                team_id: store.teamInfo.team_id, // 团
                vuln_no: form.vuln_no.split(/[\r\n\t]/)?.filter((item) => item),
            });
            isAddModal.value = false;
            formEl.resetFields();
            getData();
            showMessage('添加成功', 'success');
        }
    } catch (error) {
        console.log(error);
    }
};

// 删除策略
const deleteStrategyList = async (ids: Array<string>) => {
    if (ids.length) {
        await delVulnWhiteListApi({
            ids,
        });
        getData();
        showMessage('删除成功', 'success');
    }
};

// 多选
const selectHandle = (selection: any) => {
    selectData.value = selection;
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
