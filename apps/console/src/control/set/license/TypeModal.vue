<template>
    <el-dialog width="840px" @close="emits('update:modelValue', false);" align-center title="添加许可证类型">
        <template #header>
            <div>
                <span v-if="modalType === 'new'">添加许可证类型</span>
                <span v-if="modalType === 'edit'">编辑许可证类型</span>
                <span v-if="modalType === 'check'">{{ formData.license_family_name }}</span>
            </div>
        </template>
        <div style="max-height: calc(100vh - 240px);" class="overflow-auto">
            <el-form :model="formData" label-position="top">
                <el-form-item v-if="modalType !== 'check'" :required="true" label="类型名称">
                    <el-input v-model="formData.license_family_name" maxlength="30" show-word-limit
                        placeholder="请输入类型名称"></el-input>
                </el-form-item>

                <el-form-item label="类型说明">
                    <el-input v-if="modalType !== 'check'" v-model="formData.license_desc" type="textarea"
                        maxlength="500" show-word-limit placeholder="请输入类型说明"></el-input>
                    <span class="leading-6" v-else>{{ formData.license_desc }}</span>
                </el-form-item>

                <el-form-item>
                    <template #label>
                        <div class="text-base text-3c font-medium flex items-center">
                            <span class="mr-1">许可证风险配置</span>

                            <TipsComp width="344" content="许可证风险等级根据组件用法和分发场景来配置风险，您可以选择复用现有的许可证类型并进行更改" />
                        </div>
                    </template>
                    <el-select v-if="modalType !== 'check'" @change="changeTypeHandle" v-model="selectId" filter
                        placeholder="请输入并选择许可证风险配置" class="w-full mb-4">
                        <el-option v-for="item in listData" :key="item.id" :label="item.license_family_name"
                            :value="item.id" />
                    </el-select>

                    <el-table class="xx_table" :data="formData.license_rule"
                        :header-cell-style="{ padding: '12px 8px', background: '#EBEBEB50', color: '#3c3c3c', fontWeight: 500 }">
                        <el-table-column prop="name" label="组件用法" />
                        <el-table-column align="center" label="项目分发场景">
                            <el-table-column prop="name" label="外部" width="128">
                                <template #default="{ row }">
                                    <el-select v-if="modalType !== 'check'" v-model="row.external">
                                        <el-option v-for="item in compUseOption" :key="item.value" :label="item.label"
                                            :value="item.value">
                                            <span class="font-normal"
                                                :style="{ color: compUseOption.find(ele => ele.value === item.value)?.color }">
                                                {{ compUseOption.find(ele => ele.value === item.value)?.label }}
                                            </span>
                                        </el-option>
                                    </el-select>
                                    <!-- <SelectComp v-if="modalType !== 'check'" v-model="row.external"
                                        :options="compUseOption" /> -->
                                    <span :style="{color:compUseOption.find(ele => ele.value === row.external)?.color}" v-else>{{ compUseOption.find(item => item.value === row.external)?.label
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="Saas" width="128">
                                <template #default="{ row }">
                                    <!-- <SelectComp v-if="modalType !== 'check'" v-model="row.saas"
                                        :options="compUseOption" /> -->
                                    <el-select v-if="modalType !== 'check'" v-model="row.saas">
                                        <el-option v-for="item in compUseOption" :key="item.value" :label="item.label"
                                            :value="item.value">
                                            <span class="font-normal"
                                                :style="{ color: compUseOption.find(ele => ele.value === item.value)?.color }">
                                                {{ compUseOption.find(ele => ele.value === item.value)?.label }}
                                            </span>
                                        </el-option>
                                    </el-select>
                                    <span :style="{color:compUseOption.find(ele => ele.value === row.saas)?.color}" v-else>{{ compUseOption.find(item => item.value === row.saas)?.label }}</span>

                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="内部" width="128">
                                <template #default="{ row }">
                                    <el-select v-if="modalType !== 'check'" v-model="row.internal">
                                        <el-option v-for="item in compUseOption" :key="item.value" :label="item.label"
                                            :value="item.value">
                                            <span class="font-normal"
                                                :style="{ color: compUseOption.find(ele => ele.value === item.value)?.color }">
                                                {{ compUseOption.find(ele => ele.value === item.value)?.label }}
                                            </span>
                                        </el-option>
                                    </el-select>
                                    <!-- <SelectComp v-if="modalType !== 'check'" v-model="row.internal"
                                        :options="compUseOption" /> -->
                                    <span :style="{color:compUseOption.find(ele => ele.value === row.internal)?.color}"  v-else>{{ compUseOption.find(item => item.value === row.internal)?.label
                                        }}</span>

                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="开源" width="128">
                                <template #default="{ row }">
                                    <el-select v-if="modalType !== 'check'" v-model="row.open_source">
                                        <el-option v-for="item in compUseOption" :key="item.value" :label="item.label"
                                            :value="item.value">
                                            <span class="font-normal"
                                                :style="{ color: compUseOption.find(ele => ele.value === item.value)?.color }">
                                                {{ compUseOption.find(ele => ele.value === item.value)?.label }}
                                            </span>
                                        </el-option>
                                    </el-select>
                                    <!-- <SelectComp v-if="modalType !== 'check'" v-model="row.open_source"
                                        :options="compUseOption" /> -->
                                    <span :style="{color:compUseOption.find(ele => ele.value === row.open_source)?.color}" v-else>{{ compUseOption.find(item => item.value === row.open_source)?.label
                                        }}</span>

                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </div>

        <template v-if="modalType !== 'check'" #footer>
            <el-button @click="emits('update:modelValue', false);" class="minor_white_btn h-8 w-20">取消</el-button>
            <el-button @click="confirmHandle" :disabled="!formData.license_family_name" class="w-20">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { addLinTypeApi, updateLinTypeApi } from 'api/set';
import { compUseOption, createFormData } from './store';
// import SelectComp from '@/components/SelectComp.vue';

const { listData, editItem } = defineProps(['listData', 'modalType', 'editItem']);
const emits = defineEmits(['update:modelValue', 'updateData']);

const selectId = ref('');
const formData = reactive(createFormData());

if (editItem) {
    Object.assign(formData, editItem);
}

const changeTypeHandle = (val) => {
    formData.license_rule = listData.find((item) => item.id === val)?.license_rule;
};

const confirmHandle = async () => {
    const obj = {};
    formData.license_rule.forEach((item) => {
        obj[item.type] = {
            ...item,
        };
    });
    // formData.license_rule = obj;
    try {
        if (formData.id) {
            await updateLinTypeApi({
                ...formData,
                license_rule: obj,
            });
        } else {
            await addLinTypeApi({
                ...formData,
                license_rule: obj,
            });
        }
        emits('update:modelValue', false);
        emits('updateData');
    } catch (error) {
        console.log(error);
    }
};
</script>

<style>
.xx_table .el-table .el-table__row:hover td {
    background-color: transparent !important;
}
</style>
