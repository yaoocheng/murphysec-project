<template>
    <el-dialog title="漏洞代码特征识别" @close="emits('update:modelValue', false)"
               width="calc(100% - 80px)" align-center :close-on-click-modal="false" class="issue-code-feature-modal">
        <div class="mt-6 mb-6 bg-f7 rounded-lg py-5 px-6 flex flex-wrap">
            <div class="w-1/2 mb-4 flex items-center">
                <div class="text-xs text-85 mr-1">组件名称</div>
                <div class="text-sm font-normal">{{ info.comp_name }}</div>
            </div>
            <div class="w-1/4 flex items-center">
                <div class="text-xs text-85 mr-1">组件版本</div>
                <div class="text-sm font-normal">{{ info.comp_version }}</div>
            </div>
            <div class="w-1/4 flex items-center">
                <div class="text-xs text-85 mr-1">生态仓库类型</div>
                <div class="text-sm font-normal">{{ info.ecosystem || info.comp_info?.repository }}</div>
            </div>
            <div class="w-1/4 flex items-center">
                <div class="text-xs text-85 mr-1">依赖类型</div>
                <div class="text-sm font-normal">{{ info.comp_info?.is_direct_dependency ? '直接依赖' : '间接依赖' }}</div>
            </div>
            <div class="w-1/4 flex items-center">
                <div class="text-xs text-85 mr-1">线上依赖</div>
                <div class="text-sm font-normal">{{ info.is_online?.is_online ? '是' : '否' }}</div>
            </div>
            <div class="w-1/4 flex items-center">
                <div class="text-xs text-85 mr-1">处置建议</div>
                <div class="text-sm font-normal">{{ getRepaireLevelTool(info.highest_suggest).text }}</div>
            </div>
            <div class="w-1/4 flex items-center">
                <div class="text-xs text-85 mr-1">修复状态</div>
                <div class="text-sm font-normal">{{ fixStatusMap[info.fix_status] }}</div>
            </div>
        </div>

        <div class="g-f-14 g-color-3 g-fw-400 mb-3">
            共 <span class="text-3c">{{ total }}</span> 条数据
        </div>

        <div v-loading="loading">
            <!-- table -->
            <el-table  style="height: calc(100vh - 380px);overflow: auto;"
                       :cell-style="{ padding: '2px 8px', color: '#3c3c3c' }"
                       :header-cell-style="{ padding: '12px 8px', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }"
                       :data="list" row-key="vuln_data.mps_id">
                <el-table-column type="expand" width="24">
                    <template #default="{ row }">
                        <div class="bg-f7 p-6 rounded-lg text-3c text-sm mb-[10px]">
                            <div class="mb-2">
                                漏洞补丁信息
                            </div>
                            <div>
                                官方补丁链接：<a class="text-3c hover_text" :href="row.vanir_data[0]?.patch" target="_lank">{{
                                    row.vanir_data[0]?.patch || '-' }}</a>
                            </div>
                        </div>
                        <div class="bg-f7 p-6 rounded-lg text-3c text-sm">
                            <div class="mb-4">
                                漏洞特征匹配片段
                            </div>

                            <div class="mt-4" v-for="itemCode in row.vanir_data" :key="itemCode.unpatched_code">
                                <div class="mb-3 flex items-start cursor-pointer unpatched_code"
                                     @click="itemCode.expand = !itemCode.expand">
                                    {{ itemCode.unpatched_code }}
                                    <ExpandIcon class="ml-2" type="t" :expand="itemCode.expand" />
                                </div>
                                <div v-show="itemCode.expand" class="bg-ff rounded-lg p-4 mb-2 leading-6"
                                     v-for="(value, i) in (itemCode.raw_blocks)" :key="i">
                                    <div v-for="(code, line) in value" :key="line">
                                        <div class="flex items-center">
                                            <div class="w-[50px] mr-4 text-right">
                                                {{ line }}
                                            </div>
                                            <div class="flex-1 code_wrap">
                                                <!-- <highlightjs autodetect :code="code" /> -->
                                                <pre>{{ code }}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <NoData class="w-" v-if="!row.vanir_data?.length" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="vuln_data.title" label="漏洞标题" />
                <el-table-column width="240" label="漏洞编号">
                    <template #default="{ row }">
                        <div>
                            {{ row.vuln_data?.cve_id }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100" prop="level" label="漏洞等级">
                    <template #default="{ row }">
                        <span :style="{ color: getDangerLevel(row.vuln_data?.level).color }">{{
                            getDangerLevel(row.vuln_data?.level).text }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="currentPage"
                    :page-size="pageSize"
                    :total="total"
                    background
                    small
                    layout="total, prev, pager, next"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>

    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getVanirDataApi } from 'api/detail';
import { getRepaireLevelTool, getDangerLevel } from 'util/tools';

const props = defineProps(['info']);
const emits = defineEmits(['update:modelValue']);
const loading = ref(false);
const list = ref([]);
const total = ref(0);
const pageSize = 10; // 每页显示10条数据
const currentPage = ref(1); // 当前页码

const getVanirData = async () => {
    loading.value = true;
    try {
        const { data } = await getVanirDataApi({
            security_id: props.info.id,
            page: currentPage.value,
            limit: pageSize,
        });
        console.log(data.list);

        if (data?.list?.length) {
            list.value = data?.list;
            // eslint-disable-next-line no-use-before-define
            openHandle();
            total.value = data.total;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

// 初始加载数据
onMounted(() => {
    getVanirData();
});

// 处理页码变化
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    getVanirData();
};

const fixStatusMap: any = {
    1: '待修复',
    2: '已修复',
    3: '7天忽略',
    4: '关闭',
};

const splitCode = (blocks: any) => blocks.map((block: any) => {
    const codeLines = block.code.split('\n');
    const [start] = block.line_range.split('..').map(Number);

    const result = codeLines.reduce((acc: any, line: string, index: number) => {
        acc[start + index] = line;
        return acc;
    }, {});

    return result;
});

const openHandle = () => {
    list.value.forEach((item: any) => {
        item.vanir_data.forEach((ele: any) => {
            ele.expand = true;
            ele.raw_blocks = splitCode(ele.raw_blocks);
        });
    });
};

</script>

<style lang="less">
.unpatched_code i {
    vertical-align: -3px;
}

.code_wrap code.hljs {
    padding: 0 !important;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}
</style>
