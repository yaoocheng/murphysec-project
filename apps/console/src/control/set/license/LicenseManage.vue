<template>
    <div class="filter_wrap">
        <SearchComp v-model="filterOptions.keyword" clearable placeholder="请搜索许可证名称" />
        <el-button class="main_btn" v-if="normalTeamAuth || isUserSpace"
                   @click="addCompModal = true; type = '添加'">添加</el-button>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ total }}</span> 条数据
    </div>

    <div class="table_wrap">
        <el-table height="100%" :data="listData" :cell-style="{ padding: '12px 8px' }"
                  :header-cell-style="{ padding: '15px 8px', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column label="许可证名称" prop="license_name" show-overflow-tooltip>
                <template #default="scope">
                    <div>
                        {{ scope.row.license_name }}
                        <el-tooltip v-if="scope.row.is_conflict" placement="top">
                            <template #content>
                                <div style="width: 344px;">
                                    系统许可证与自定义许可证中都存在此许可证，默认根据自定义许可证信息为最高优先级。为避免冲突和误解，建议删除自定义许可证
                                </div>
                            </template>
                            <span class="hover_icon">
                                <i class="murphy icon-gantanhao g-f-14" style="color: #FF9940;"></i>
                            </span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="许可证风险等级" width="120" prop="risk" show-overflow-tooltip>
                <template #default="scope">
                    <div :style="{ color: getLicenseLevelTool(scope.row.risk).color }">
                        {{ getLicenseLevelTool(scope.row.risk).text }}
                    </div>
                </template>
            </el-table-column>

            <!-- <el-table-column label="所属组织" width="100" prop="org_name" show-overflow-tooltip />

            <el-table-column label="所属团队" width="120" prop="team_name" show-overflow-tooltip /> -->

            <el-table-column label="最近操作人" width="120">
                <template #default="scope">
                    <span class="member">
                        <UserComp :name="scope.row.updated_user_name" />
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="最近操作时间" width="180">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>

            <el-table-column width="140" v-if="normalTeamAuth || isUserSpace" label="操作">
                <template #default="scope">
                    <div class="edit">
                        <span
                            @click="licenseRiskInfo = scope.row.risk; licenseName = scope.row.license_name; isShowLicenseInfo = true"
                            style="margin-right: 10px;">查看</span>
                        <span @click="editHandle(scope.row)" style="margin-right: 10px;">编辑</span>
                        <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认删除？" @confirm="deleteStrategyList([scope.row.id])">
                            <template #reference>
                                <span class="g-color-err">删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>
    </div>

    <el-dialog :title="`${type}自定义许可证`" width="600" v-model="addCompModal"
               @close="addForm.license_name = ''; addForm.risk = undefined; addForm.license_desc = ''">
        <div class="g-mb-16">
            <span class=g-color-err>*</span> 许可证名称
            <el-tooltip placement="right" effect="light">
                <template #content>
                    <div>
                        不知道许可证名称？参考 <a href="https://spdx.org/licenses/" target="_blank">SPDX许可证列表</a>
                    </div>
                </template>
                <i class="murphy icon-wenhaoxiao g-color-3 g-f-14"></i>
            </el-tooltip>

            <div class="g-mt-8">
                <el-input placeholder="请输入许可证名称 如：Apache-2.0" v-model="addForm.license_name"></el-input>
            </div>
        </div>

        <div class="g-mb-16">
            <span class=g-color-err>*</span> 默认风险等级
            <el-tooltip placement="right">
                <template #content>
                    <div style="width: 344px">
                        当项目未应用任何自定义许可证策略时，系统将自动应用许可证的默认风险等级
                    </div>
                </template>
                <i class="murphy icon-wenhaoxiao g-color-3 g-f-14"></i>
            </el-tooltip>
            <div class="g-mt-8">
                <SelectComp style="width: 100%;" v-model="addForm.risk" :options="licenseRisk" placeholder="许可证风险等级" />
            </div>
        </div>

        <div>
            <div class="g-mb-8">
                许可证说明
            </div>
            <el-input type="textarea" :rows="4" maxlength="500" show-word-limit placeholder="请输入许可证名说明"
                      v-model="addForm.license_desc"></el-input>
        </div>

        <div class="group-btn g-mt-24">
            <el-button @click="addCompModal=false; addForm = {
                risk: undefined,
                license_name: '',
                team_id: store.teamInfo.team_id,
                license_desc: '',
            }; addForm.license_desc = ''">取消</el-button>
            <el-button @click="confirm">确定</el-button>
        </div>
    </el-dialog>

    <LicenseInfoModal v-model="isShowLicenseInfo" :licenseName="licenseName" :licenseRisk="licenseRiskInfo"
                      v-if="isShowLicenseInfo" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    formatDate, showMessage, getLicenseLevelTool,
} from 'util/tools';
import {
    getLicenseApi, deleteLicenseApi, editLicenseApi,
} from 'api/team';
import UserComp from 'comp/UserComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import SearchComp from '@/components/SearchComp.vue';
import SelectComp from '@/components/SelectComp.vue';
import LicenseInfoModal from '@/control/project/detail/license/LicenseInfoModal.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();
const addCompModal = ref<boolean>(false);
const type = ref<string>('添加');
const isShowLicenseInfo = ref<boolean>(false);
const licenseName = ref<string>('');
const licenseRiskInfo = ref<string>('');

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
});

const addForm = ref<{
    team_id: string,
    risk: number | undefined,
    license_name: string,
    license_desc: string,
}>({
    risk: undefined,
    license_name: '',
    team_id: store.teamInfo.team_id,
    license_desc: '',
});

const {
    total, curPage, listData, getData,
} = useList(getLicenseApi, filterOptions);

const licenseRisk = [
    {
        value: 'High',
        label: '高风险',
    },
    {
        value: 'Medium',
        label: '中风险',
    },
    {
        value: 'Low',
        label: '低风险',
    },
    {
        value: 'Safe',
        label: '无风险',
    },
];

// 删除
const deleteStrategyList = async (ids: Array<string>) => {
    await deleteLicenseApi({
        ids,
    });
    getData();
    showMessage('删除成功', 'success');
};

// 编辑
const editHandle = (row: any) => {
    type.value = '编辑';
    addCompModal.value = true;
    Object.assign(addForm.value, row);
};

// 保存
const confirm = async () => {
    if (!addForm.value.license_name.trim() || !addForm.value.risk) {
        showMessage('请将信息填完整', 'warning');
        return;
    }
    if (addForm.value.license_name.trim().length > 50) {
        showMessage('许可证名称不得超过50个字符', 'warning');
        return;
    }
    await editLicenseApi(addForm.value);
    addCompModal.value = false;
    getData();
    showMessage('保存成功', 'success');
    addForm.value = {
        risk: undefined,
        license_name: '',
        team_id: store.teamInfo.team_id,
        license_desc: '',
    };
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
    height: calc(100% - 135px);

    .hover_icon:hover {
        background-color: #ff99403d;
    }

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
