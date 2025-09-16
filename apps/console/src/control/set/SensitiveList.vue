<template>
    <div class="filter_wrap">
        <div>
            <SearchComp style="width: 240px" v-model="filterOptions.keyword" clearable placeholder="请搜索策略名称" />
            <SelectComp style="width: 130px;" v-model="filterOptions.ploy_type" :options="sensitiveType" placeholder="类型" />
            <SelectComp style="width: 130px;" v-model="filterOptions.level" :options="sensitiveLevel" placeholder="风险级别" />
            <el-button @click="resetHandle" class="minor_btn" style="height: 32px;">重置</el-button>
        </div>
        <el-button class="w-20" v-if="normalTeamAuth || isUserSpace" @click="isShowEdit = true">添加</el-button>
    </div>

    <div class="table_wrap">
        <el-table :data="listData" :cell-style="{ padding: '12px 0' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column label="策略名称" prop="title" show-overflow-tooltip />
            <el-table-column label="类型" prop="ploy_type" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="风险级别" prop="level" show-overflow-tooltip>
                <template #default="scope">
                    <div>
                        {{ sensitiveLevel.find(item => item.value === scope.row.level)?.label }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="策略开启" prop="is_open" show-overflow-tooltip>
                <template #default="scope">
                    <div>
                        {{ scope.row.is_open ? '是' : '否' }}
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip />

            <el-table-column label="所属团队" width="140" prop="team_name" show-overflow-tooltip /> -->
            <el-table-column label="最近操作人" width="150">
                <template #default="scope">
                    <span class="member">
                        <UserComp :name="scope.row.updated_user_name" />
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="最近操作时间" width="160">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column width="140" fixed="right" v-if="normalTeamAuth || isUserSpace" label="操作">
                <template #default="scope">
                    <div class="edit g-flex flex items-center">
                        <el-switch v-model="scope.row.is_open" @change="switchChange(scope.row.id)" class="g-mr-8"
                                   size="small"></el-switch>
                        <span @click="editHandle(scope.row)" class="button-text-blue">编辑</span>
                        <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认删除？" @confirm="deleteStrategyList([scope.row.id])">
                            <template #reference>
                                <span class="button-text-red">删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="total>0">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20" layout="total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </div>
    </div>

    <div class="sensitive-edit" v-if="isShowEdit">
        <div class="part_title">
            策略基本信息
        </div>
        <div class="part_content">
            <div class="form">
                <FormComp label-position="top" :hide-required-asterisk="false">
                    <el-form-item :required="true" label="策略名称">
                        <div class="g-w-100">
                            <el-input v-model="formData.title" maxlength="50" placeholder="请输入策略名称"></el-input>
                        </div>
                    </el-form-item>

                    <el-form-item :required="true" label="策略类型">
                        <div class="g-w-100">
                            <el-select class="g-w-100" v-model="formData.ploy_type" filterable allow-create
                                       default-first-option :reserve-keyword="false" placeholder="请添加/选择敏感信息策略的类型">
                                <el-option v-for="item in sensitiveType" :key="item.value" :label="item.label"
                                           :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item :required="true" label="风险级别">
                        <div class="g-w-100">
                            <el-select class="g-w-100" v-model="formData.level" :reserve-keyword="false"
                                       placeholder="请选择风险级别">
                                <el-option v-for="item in sensitiveLevel" :key="item.value" :label="item.label"
                                           :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item :required="true" label="正则表达式">
                        <div style="width: 100%;">
                            <el-input type="textarea" resize="none" :rows="4" @keydown.enter.native="stopEnter"
                                      v-model="formData.regular" placeholder="请输入正则表达式"></el-input>
                        </div>
                    </el-form-item>

                    <el-form-item label="策略说明">
                        <div style="width: 100%;">
                            <el-input type="textarea" resize="none" maxlength="200" :rows="4" v-model="formData.info"
                                      placeholder="请输入说明"></el-input>
                        </div>
                    </el-form-item>
                </FormComp>
            </div>
        </div>
        <div class="group-btn">
            <el-button @click="cancleHandle">取消</el-button>
            <el-button @click="confirm">保存</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    formatDate, showMessage,
} from 'util/tools';

import {
    getSensitiveListApi, deleteSensitiveInfoApi, switchSensitiveInfoApi, editSensitiveInfoApi, getSensitiveWordsPloyApi,
} from 'api/team';
import UserComp from 'comp/UserComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import { sensitiveType, sensitiveLevel } from './constants/constant';
import FormComp from '@/components/FormComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import SelectComp from '@/components/SelectComp.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

onBeforeMount(async () => {
    try {
        const { data } = await getSensitiveWordsPloyApi({
            team_id: store.teamInfo.team_id,
        });
        sensitiveType.value = data.list.map((item: any) => ({
            label: item,
            value: item,
        }));
    } catch (error) {
        console.log(error);
    }
});

const isShowEdit = ref<boolean>(false);
// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    ploy_type: string,
    level: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    ploy_type: '',
    level: '',
});

// 策略配置
const formData = ref<any>({
    id: undefined,
    team_id: store.teamInfo.team_id,
    title: '',
    ploy_type: '',
    level: '',
    regular: '',
    info: '',
});

const stopEnter = (e: any) => {
    if (e.keyCode === 13) {
        e.returnValue = false;
        return false;
    }
};

const {
    total, curPage, listData, getData,
} = useList(getSensitiveListApi, filterOptions);

// 删除
const deleteStrategyList = async (ids: Array<string>) => {
    await deleteSensitiveInfoApi({
        ids,
    });
    getData();
    showMessage('删除成功', 'success');
};

// 编辑
const editHandle = (row: any) => {
    isShowEdit.value = true;
    Object.assign(formData.value, row);
    formData.value.regular = formData.value.regular.replace(/\n/g, '\\n');
};

// 保存
const confirm = async () => {
    if (!formData.value.title || !formData.value.ploy_type || !formData.value.level || !formData.value.regular) {
        showMessage('请将信息填完整', 'warning');
        return;
    }
    formData.value.regular = formData.value.regular.replace(/\\n/g, '\n');

    await editSensitiveInfoApi(formData.value);
    getData();
    showMessage('保存成功', 'success');
    // eslint-disable-next-line no-use-before-define
    cancleHandle();
};

// 开关
const switchChange = async (id: string) => {
    await switchSensitiveInfoApi({ id });
    getData();
    showMessage('操作成功', 'success');
};

// 取消
const cancleHandle = () => {
    Object.assign(formData.value, {
        title: '',
        ploy_type: '',
        level: '',
        regular: '',
        info: '',
        id: undefined,
    });
    isShowEdit.value = false;
};

// 重置
const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        ploy_type: '',
        level: '',
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
    height: calc(100% - 68px);
    overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}

.sensitive-edit {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    z-index: 99;
    padding: 24px;
    box-sizing: border-box;

    .part_title {
        font-weight: 600;
        margin-bottom: 8px;
        color: @text-color;
    }

    .part_content {
        background: #F7F8FB;
        border-radius: 6px;
        padding: 24px;
        font-size: 14px;
        margin-bottom: 24px;
    }

    .form {
        background: #FFFFFF;
        border-radius: 6px;
        padding: 16px;

        .form_label {
            color: @text-color;
            font-weight: 500;
            margin-bottom: 8px;
        }
    }
}
</style>
