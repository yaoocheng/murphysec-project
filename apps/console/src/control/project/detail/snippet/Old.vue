<template>
    <div class="code-snippet">
        <div class="g-flex g-mb-24">
            <SearchComp style="width: 240px;" v-model="filterData.project_name" clearable placeholder="请搜索匹配项目名称" />
            <CheckboxComp style="width: 240px" v-model="filterData.license_names" :options="licenseOptions" clearable
                placeholder="许可证类型" />
            <MinorBtn @click="resetFilter">重置</MinorBtn>
        </div>
        <div class="g-f-14 g-mb-8 g-color-3">
            共 <span class="g-color-1">{{ total }}</span> 条数据
        </div>
        <div class="table_wrap">
            <div class="thead">
                <div class="th" style="width:30%">匹配项目</div>
                <div class="th" style="width:20%;">版本</div>
                <div class="th" style="width:20%">许可证类型</div>
                <div class="th" style="width:15%">文件匹配溯源文件</div>
                <div class="th" style="width:15%">片段匹配溯源文件</div>
                <div class="th" style="width:10%">操作</div>
            </div>
            <div class="tbody">
                <div class="list_item" v-for="(item, index) in listData" :key="index">
                    <!-- <div class="td" style="width:3%">
                        <span class="expand_icon">
                            <i class="murphy icon-youjiantou" style="font-size: 12px;" v-if="!item.expand"></i>
                            <i class="murphy icon-xiala1" v-else></i>
                        </span>
                    </div> -->
                    <div class="td hover_text" @click="codeDiffHandle(item)" style="width:30%">
                        {{ item.name }}
                    </div>
                    <div class="td" style="width:20%">
                        {{ item.version }}
                    </div>
                    <div class="td" style="width:20%">
                        <el-tooltip v-if="item.license?.licenses?.length" placement="top">
                            <template #content>
                                <div v-for="ele in item.license?.licenses" :key="ele">{{ ele }}</div>
                            </template>
                            <span>
                                <span v-for="ele in item.license?.licenses" :key="ele">{{ ele }};</span>
                            </span>
                        </el-tooltip>

                        <el-tooltip v-else-if="item.licenses?.length" placement="top">
                            <template #content>
                                <div v-for="ele in item.licenses" :key="ele">{{ ele.license }}</div>
                            </template>
                            <span>
                                <span v-for="ele in item.licenses" :key="ele">{{ ele.license }}</span>
                            </span>
                        </el-tooltip>

                        <span v-else>未声明许可证</span>
                    </div>
                    <div class="td" style="width:15%">
                        {{ item.total_files }}
                    </div>
                    <div class="td" style="width:15%">
                        {{ item.total_fragmented_files }}
                    </div>
                    <div @click="codeDiffHandle(item)" class="td g-color-5" style="width:10%">
                        查看
                    </div>
                </div>
            </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>

        <NoData v-if="!isHaveData" />
    </div>

    <CodeSnippetModal v-model="isShowDiffDialog" v-if="isShowDiffDialog" :dialogRenderData="dialogRenderData" />
</template>

<script setup lang='ts'>
import NoData from 'comp/NoData.vue';
import SearchComp from 'comp/SearchComp.vue';
import CheckboxComp from 'comp/CheckboxComp.vue';
import useList from 'util/hook';
import { ref } from 'vue';
import { getFileSourceApi, getFileSourceSimilarCodeApi, getLicenseListApi } from 'api/project';
import { useRoute } from 'vue-router';
import MinorBtn from '@/components/MinorBtn.vue';
import CodeSnippetModal from '../components/CodeSnippetModal.vue';

const route = useRoute();
const isShowDiffDialog = ref<boolean>(false);
const dialogRenderData = ref({});

const filterData = ref<{
    project_id: string,
    subtask_id: string,
    license_names: Array<string>,
    project_name: string,
}>({
    project_id: route.params.tid as string,
    subtask_id: route.params.sid as string,
    license_names: [],
    project_name: '',
});

const resetFilter = () => {
    Object.assign(filterData.value, {
        license_names: [],
        project_name: '',
    });
};

const {
    total, curPage, listData, isHaveData,
} = useList(getFileSourceApi, filterData);

// open modal
const codeDiffHandle = async (item: any) => {
    const res = await getFileSourceSimilarCodeApi({
        project_id: route.params.tid, subtask_id: route.params.sid, name: item.name, version: item.version,
    });
    dialogRenderData.value = {
        list: res.data || [],
        cache: res.data || [],
        project_license_data: item.license,
        project_licenses_data: item.licenses,
        ...item,
    };
    isShowDiffDialog.value = true;
};

const licenseOptions = ref<any>([]);

const getLicenseList = async () => {
    const res = await getLicenseListApi({
        project_id: route.params.tid, subtask_id: route.params.sid,
    });
    licenseOptions.value = res.data?.map((item: any) => ({
        label: item,
        value: item,
    }));
    licenseOptions.value.push({
        label: '未声明许可证',
        value: '',
    });
};
getLicenseList();
</script>
