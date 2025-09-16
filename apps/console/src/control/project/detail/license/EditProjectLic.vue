<template>
    <el-dialog width="calc(100% - 80px)" title="编辑项目许可证" align-center>
        <div class="text-sm text-85 font-normal mb-6 mt-[-16px]">项目许可证发生变更将影响许可证兼容性分析的结果</div>

        <div v-if="listData.length">
            <div class="g-mb-12 g-color-3 g-f-14 flex items-center justify-between">
                <div>
                    共 <span class="g-color-1">{{ total }}</span> 条数据
                </div>
                <el-button class="minor_btn h-8 w-20" @click="showAddDialog = true">添加</el-button>
            </div>

            <TableComp class="custom-table" height="calc(100vh - 300px)" :row-class-name="getRowClassName" :data="listData" row-key="id">
                <el-table-column width="30" type="expand">
                    <template #default="scope">
                        <div class="p-6 bg-f7 rounded-lg">
                            <div class="text-sm font-medium mb-2">声明内容：</div>
                            <pre>{{ scope.row.license_text || '-' }}</pre>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="license_name" label="许可证名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="license_family_name" label="许可证类型" width="130">
                    <template #default="scope">
                        <div>
                            {{ scope.row.license_family_name || '-' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="source" label="来源" width="130">
                    <template #default="scope">
                        <div>
                            {{ scope.row.source === 'system' ? '系统识别' : '手动添加' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="300" prop="license_path" label="文件路径" show-overflow-tooltip>
                    <template #default="scope">
                        <div>
                            {{ scope.row.license_path || '-' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="60">
                    <template #default="scope">
                        <el-popconfirm placement="left" popper-class="cancle-popper confirm-popper" title="确认删除该许可证？" @confirm="handleDelete(scope.row)">
                            <template #reference>
                                <span class="button-text-red">删除</span>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </TableComp>

            <PageComp v-model:currentPage="curPage" :total="total" :page-size="10" />
        </div>

        <div v-else class="flex flex-col items-center">
            <NoData description="暂未识别到项目许可证" />
            <p class="text-sm text-85 font-normal mt-[-12px]">若项目存在许可证但未被识别，可自行添加项目许可证</p>
            <el-button @click="showAddDialog = true" class="mt-4 w-20">添加</el-button>
        </div>

        <el-dialog v-model="showAddDialog" @close="selectedLicenses = [{ name: '' }]" width="800px" title="添加项目许可证" align-center>
            <span class="button-text-blue mb-2" @click="addNewLicense">
                <i class="murphy icon-jia"></i>
                新增
            </span>
            <div class="license-add-container max-h-[calc(100vh-270px)] overflow-auto">
                <div class="license-list">
                    <div v-for="(item, index) in selectedLicenses" :key="index" class="license-item">
                        <el-select-v2 v-model="item.name" :filter-method="filterMethod" placeholder="请搜索并选择许可证名称" class="w-full" filterable :options="licenseOptions" />

                        <div v-if="index === 0" class="w-[25px] opacity-0"></div>

                        <span v-if="index !== 0" @click="removeLicense(index)"
                              class="button-icon-grey box-border close">
                            <i class="murphy icon-cuo g-cursor-pointer font-bold text-85" />
                        </span>
                    </div>
                </div>
            </div>

            <template #footer>
                <el-button class="minor_white_btn h-8 w-20"
                           @click="showAddDialog = false; selectedLicenses = [{ name: '' }]">取消</el-button>
                <el-button class="w-20" type="primary" :disabled="isDisabled" @click="handleConfirm">确定</el-button>
            </template>
        </el-dialog>

    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
    getProjectLicenseListApi, saveProjectLicenseApi, deleteProjectLicenseApi, getCustomerLicenseListApi,
} from 'api/detail';
import bus, { showMessage } from '@/utils/tools';
import useList from '@/utils/hook';
import store from '@/utils/store';

const route = useRoute();
const {
    listData, curPage, total, getData,
} = useList(getProjectLicenseListApi, ref({
    subtask_id: route.params.sid,
    limit: 10,
}));

// 给不允许展开的行加一个 class
const getRowClassName = ({ row }: any) => (row.source !== 'system' ? 'disabled-expand-row' : '');

const handleDelete = async (row: any) => {
    try {
        await deleteProjectLicenseApi({
            subtask_id: route.params.sid as string,
            ids: [row.id],
        });
        getData();
        showMessage('删除成功', 'success');
        bus.emit('refreshLicense');
    } catch (error) {
        console.error('删除许可证失败:', error);
    }
};

const showAddDialog = ref(false);
const selectedLicenses = ref([{ name: '' }]);
const licenseOptions = ref<any[]>([]);
const cacheOptinos = ref<any[]>([]);

const getLicenseOptions = async () => {
    try {
        const res = await getCustomerLicenseListApi({
            team_id: store.teamInfo.team_id,
            is_only_builtin: false,
        });
        licenseOptions.value = res.data.map((item: any) => ({
            value: item.license_name,
            label: item.license_name,
        }));
        cacheOptinos.value = [...licenseOptions.value];
    } catch (error) {
        console.error('获取许可证列表失败:', error);
    }
};

getLicenseOptions();

const filterMethod = (val:string) => {
    if (!val) {
        licenseOptions.value = [...cacheOptinos.value];
        return;
    }

    licenseOptions.value = cacheOptinos.value.filter((item) => item.label.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 20);
};

const addNewLicense = () => {
    selectedLicenses.value.push({ name: '' });
};

const removeLicense = (index: number) => {
    selectedLicenses.value.splice(index, 1);
    if (selectedLicenses.value.length === 0) {
        selectedLicenses.value.push({ name: '' });
    }
};

const handleConfirm = async () => {
    try {
        await saveProjectLicenseApi({
            subtask_id: route.params.sid,
            license_name: selectedLicenses.value.map((item) => item.name),
        });
        getData();
        showAddDialog.value = false;
        selectedLicenses.value = [{ name: '' }];
        showMessage('保存成功', 'success');
        bus.emit('refreshLicense');
    } catch (error) {
        console.error('保存许可证失败:', error);
    }
};
const isDisabled = computed(() => selectedLicenses.value.some((license) => !license.name));
</script>

<style scoped>
.license-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.license-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.add-btn {
    margin-top: 16px;
    display: flex;
    align-items: center;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.button-icon-grey.close i {
    color: #858585 !important;
}

:deep(.disabled-expand-row.el-table__row) .el-table__expand-icon {
    display: none !important;
}
</style>
