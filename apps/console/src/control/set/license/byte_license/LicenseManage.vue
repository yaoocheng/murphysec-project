<template>
    <div class="filter_wrap">
        <div class="flex">
            <SearchComp v-model="filterOptions.keyword" clearable placeholder="请搜索许可证名称" />
            <el-select v-model="filterOptions.license_family_id" clearable class="w-[140px]" placeholder="许可证类型">
                <el-option v-for="item in listType" :key="item.id" :label="item.license_family_name" :value="item.id" />
            </el-select>
        </div>
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
                        {{ scope.row.license_spdx_id }}
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

            <el-table-column label="许可证类型" width="160" prop="risk" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ row.license_family_name || '-' }}
                </template>
            </el-table-column>

            <!-- <el-table-column label="许可证风险等级" width="120" prop="risk" show-overflow-tooltip>
                <template #default="scope">
                    <div :style="{ color: getLicenseLevelTool(scope.row.risk).color }">
                        {{ getLicenseLevelTool(scope.row.risk).text }}
                    </div>
                </template>
            </el-table-column> -->

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
                    {{ formatDate(scope.row.update_at) }}
                </template>
            </el-table-column>

            <el-table-column width="140" v-if="normalTeamAuth || isUserSpace" label="操作">
                <template #default="scope">
                    <div class="edit flex items-center">
                        <!-- <span
                            @click="licenseRiskInfo = scope.row.risk; licenseName = scope.row.license_name; isShowLicenseInfo = true"
                            style="margin-right: 10px;">查看</span> -->
                        <span
                            @click.stop="isShowLicenseInfo = true; licType = scope.row.license_family_name; licSource = scope.row.source; licenseName = scope.row.license_spdx_id; licenseRiskInfo = scope.row.risk"
                            class="button-text-blue">查看</span>
                        <!-- <span @click="editItem = scope.row; modalType = 'check'; showModal = true"
                            class="g-color-5 g-cursor-pointer">
                            查看
                        </span> -->
                        <!-- <span @click="editHandle(scope.row)" style="margin-right: 10px;">编辑</span> -->
                        <span @click="editHandle(scope.row)" class="button-text-blue">编辑</span>
                        <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认删除？"
                                       @confirm="deleteStrategyList(scope.row.id)">
                            <template #reference>
                                <span class="button-text-red">删除</span>
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

    <el-dialog :title="`${type}自定义许可证`" @close="closeModal" width="600" v-model="addCompModal">
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
                <el-input placeholder="请输入许可证名称 如：Apache-2.0" maxlength="50" show-word-limit
                          v-model="addForm.license_spdx_id"></el-input>
            </div>
        </div>

        <div class="g-mb-16">
            <span class=g-color-err>*</span> 许可证类型

            <div class="g-mt-8">
                <el-select v-model="addForm.license_family_id" @change="changeFamily" clearable class="w-full"
                           placeholder="请选择许可证类型">
                    <el-option v-for="item in listType" :key="item.id" :label="item.license_family_name"
                               :value="item.id" />
                </el-select>
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
            <el-button @click="closeModal(); addCompModal = false">取消</el-button>
            <el-button :disabled="!addForm.license_spdx_id || !addForm.license_family_id"
                       @click="confirm">确定</el-button>
        </div>
    </el-dialog>

    <LicenseInfoModal v-model="isShowLicenseInfo" :licSource="licSource" :licType="licType" :licenseName="licenseName" :licenseRisk="licenseRiskInfo"
                      v-if="isShowLicenseInfo" />

    <TypeModal v-model="showModal" v-if="showModal" :editItem="editItem" :modalType="modalType" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    formatDate, showMessage,
} from 'util/tools';
import {
    getCustomLicApi, delCustomLicApi, addCustomLicApi, updateCustomLicApi, getLicenseListApi,
} from 'api/set';
import UserComp from 'comp/UserComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import SearchComp from '@/components/SearchComp.vue';
import TypeModal from '../TypeModal.vue';
import LicenseInfoModal from '@/control/project/detail/license/LicenseInfoModal.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();
const addCompModal = ref<boolean>(false);
const type = ref<string>('添加');
const isShowLicenseInfo = ref<boolean>(false);
const licenseName = ref<string>('');
const licenseRiskInfo = ref<string>('');
const showModal = ref<boolean>(false);
const modalType = ref('new');
const licType = ref();
const licSource = ref();
const editItem = ref();

const changeFamily = (val:string) => {
    // eslint-disable-next-line no-use-before-define
    addForm.value.license_family_name = listType.value.find((item) => item.id === val).license_family_name;
};

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    source: string,
    license_family_id: string | undefined
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    source: 'customize',
    license_family_id: undefined,
});

const addForm = ref<any>({
    license_spdx_id: '',
    license_family_id: '',
    license_family_name: '',
    team_id: store.teamInfo.team_id,
    license_desc: '',
});

const typefilters = ref({
    team_id: store.teamInfo.team_id,
});

const {
    listData: listType,
} = useList(getLicenseListApi, typefilters);

const {
    total, curPage, listData, getData,
} = useList(getCustomLicApi, filterOptions);

// 删除
const deleteStrategyList = async (id: string) => {
    await delCustomLicApi({
        id,
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

const closeModal = () => {
    addForm.value = {
        license_spdx_id: '',
        license_family_id: '',
        team_id: store.teamInfo.team_id,
        license_desc: '',
        license_family_name: '',
    };
};

// 保存
const confirm = async () => {
    if (addForm.value?.id) {
        await updateCustomLicApi(addForm.value);
    } else {
        await addCustomLicApi(addForm.value);
    }

    addCompModal.value = false;
    getData();
    showMessage('添加成功', 'success');
    closeModal();
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
