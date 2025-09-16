<template>
    <div class="comp_wrap" v-loading="loading">
        <div class="g-mb-16">
            <SearchComp style="width: 240px;" v-model="searchData.keyword" clearable placeholder="请搜索许可证名称" />
            <CheckboxComp style="width: 150px" v-model="searchData.level" :options="licenseLevelOption" clearable
                          placeholder="许可证风险等级" />
            <!-- <CheckboxComp style="width: 150px" v-model="searchData.level" :options="licenseLevelOption" clearable
                placeholder="类型" /> -->
            <!-- <el-button class="minor_btn" @click="resetHandle" style="height: 32px;width: 52px;">
                重置
            </el-button> -->
        </div>

        <div v-if="isHaveData">
            <div class="g-color-3 g-fw-400 g-f-14 g-mb-12">
                共 <span class="g-color-1 g-fw-500">{{ listData.length }}</span> 条数据
            </div>

            <div class="thead">
                <div class="th" style="flex: 1">许可证名称</div>
                <div class="th" style="width:20%">相关组件</div>
            </div>
        </div>

        <div class="license_item" v-for="(item, index) in listData " :key="index">
            <div class="item">
                <!-- <div style="width:25px;">
                    <ExpandIcon :type="'r'" :expand="item.expand" />
                </div> -->

                <div class="td name-wrap" style="flex:1">
                    <span @click="getLicCompList(item)" class="cursor-pointer hover:underline hover:text-primary">{{ item.spdx }}</span>
                    <TagComp class="ml-1" c="#fff" :bgc="getLicenseLevelTool(item.level).color"
                             :content="getLicenseLevelTool(item.level).text" />
                </div>

                <!-- <div class="td g-color-3" style="width: 28%;">
                    许可证类型 -
                </div> -->

                <div class="td g-color-3" style="width: 20%;">
                    <span class="text-3c">{{ item.comp_num }}</span>
                </div>

                <!-- <div class="td"
                     @click.stop="isShowLicenseInfo = true; licenseDesc = item.license_desc; licenseName = item.spdx; licenseRisk = item.level">
                    <div class="button-text-blue">
                        详情
                    </div>
                </div> -->
            </div>

            <!-- <div class="item_comp text-3c" @click.stop v-for="( ele, i ) in item.compList " :key="i" v-if="item.expand">
                <div class="flex items-center">
                    <span>组件名称：</span>
                    <span @click="compJump({name: ele?.comp_name,version: ele?.comp_version, ecosystem: ele?.ecosystem, repository: ele?.repository})" class="inline-block max-w-[240px] mr-1 link_text ellipsis">{{ ele.comp_name }}</span>
                    <TagComp class="ml-1" v-if="ele.ecosystem" :content="ele.ecosystem || '-'" />
                    <TagComp class="ml-1" v-if="ele.is_online" content="线上依赖" />
                    <TagComp class="ml-1" v-if="ele.is_self" content="自身依赖" />
                    <TagComp class="ml-1" v-else :content="ele.is_direct_dependency ? '直接依赖' : '间接依赖'" />
                    <span class="ml-4 max-w-[200px] ellipsis">
                        版本：{{ ele.comp_version || '暂无' }}
                    </span>
                    <el-tooltip placement="top" v-if="ele.the_chosen_version && ele.comp_version">
                        <template #content>
                            <div style="max-width: 344px;">
                                此版本为推测值，由于检测时获取到的特征有限，识别可能存在偏差，暂时无法提供精确版本。
                            </div>
                        </template>
                        <span class="hover_icon g-ml-4 g-vertical--1" style="padding:4px 6px">
                            <i class="murphy icon-wenhaoxiao g-f-14 g-color-1"></i>
                        </span>
                    </el-tooltip>
                    <span v-if="store.isLic" class="ml-4">
                        组件用法：
                        <span v-for="(a, i) in ele.way_of_use?.split(',')" :key="a"
                              class="inline-block max-w-full leading-none">{{
                                  compUse[a] }}<span v-if="i !== ele.way_of_use?.split(',')?.length - 1">、</span>
                        </span>
                    </span>
                    <span class="ml-4">
                        许可证风险等级：<span :style="{ color: getLicenseLevelTool(item.level).color }">{{
                            getLicenseLevelTool(item.level).text
                        }}</span>
                    </span>
                </div>

                <span class="button-text-blue max-w-[220px] ellipsis">
                    <a v-if="ele.repo_url" target="_blank" :href="ele.repo_url" class="text-primary">官方地址</a>
                    <span v-else>-</span>
                </span>
            </div> -->
        </div>

        <NoData v-if="!isHaveData" class="my-20" />

        <!-- 分页 -->
        <!-- <div class="pagination" v-if="total > 0">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div> -->
    </div>

    <LicenseInfoModal v-model="isShowLicenseInfo" :licenseCompList="licenseCompList" :licenseName="licenseName" :licenseRisk="licenseRisk"
                      :licenseDesc="licenseDesc" v-if="isShowLicenseInfo" />

</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NoData from 'comp/NoData.vue';
import { getDetailLicenseListApi, getDetailLicenseCompListApi } from 'api/project';
import { getLicenseLevelTool } from 'util/tools';
import useList from 'util/hook';
import store from '@/utils/store';
import { licenseLevelOption } from '../../constants/constants';
import LicenseInfoModal from './LicenseInfoModal.vue';

const route = useRoute();
const isShowLicenseInfo = ref<boolean>(false);
const licenseName = ref<string>('');
const licenseRisk = ref<string>('');
const licenseDesc = ref<string>('');
const filterData = ref<{
    team_id: string,
    subtask_id: string,
    project_id: string,
    page: undefined,
    limit: undefined,
}>({
    page: undefined,
    limit: undefined,
    team_id: store.teamInfo.team_id,
    subtask_id: route.params.sid as string,
    project_id: route.params.tid as string,
});
const licenseCompList = ref<Array<any>>([]);

const searchData = ref({
    keyword: '',
    level: [],
});

const {
    listData, isHaveData, initData, loading,
} = useList(getDetailLicenseListApi, filterData);

const sortLicense = (list: any[]) => [
    ...list.filter((item) => item.level === 'High'),
    ...list.filter((item) => item.level === 'Medium'),
    ...list.filter((item) => item.level === 'Low'),
    ...list.filter((item) => item.level === 'Safe'),
];

watch(initData, (newVal: any[]) => {
    if (newVal.length) {
        listData.value = sortLicense(newVal);
    }
});

// 获取许可证涉及组件
const getLicCompList = async (item: any) => {
    loading.value = true;
    try {
        const { data } = await getDetailLicenseCompListApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
            comp_string_list: item.comp_string_list,
        });
        licenseDesc.value = item.license_desc;
        licenseName.value = item.spdx;
        licenseRisk.value = item.level;
        // eslint-disable-next-line no-return-assign
        licenseCompList.value = data?.map((ele:any) => ({
            ...ele,
            level: item.level,
        })) || [];
        isShowLicenseInfo.value = true;
        loading.value = false;
    } catch (error) {
        console.log(error);
    }
};

const filterHandle = (newVal: any) => {
    let filterdata: Array<any> = [];

    // 搜索过滤
    filterdata = initData.value.filter((item: any) => item.spdx.includes(newVal.keyword));

    // 危险等级
    if (newVal.level.length) {
        filterdata = filterdata.filter((item: any) => newVal.level.includes(item.level));
    }

    listData.value = sortLicense(filterdata);
    isHaveData.value = listData.value.length > 0;
};

// const resetHandle = () => {
//     Object.assign(searchData.value, {
//         keyword: '',
//         level: [],
//     });

//     filterHandle(searchData.value);
// };

watch(searchData.value, (newVal: any) => {
    filterHandle(newVal);
});
</script>

<style lang='less' scoped>
.thead {
    display: flex;
    align-items: center;
    height: 46px;
    background: #F7F8FB;
    padding: 0 16px;
    font-size: 14px;
    color: #8F959E;
    border-radius: 4px;
    margin-bottom: 1px;
}

th {
    .ellipsis();
}

.license_item .item {
    &:hover {
        background-color: #6c87ff0e;
    }

    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 14px;
    height: 48px;
    border-radius: 4px;
    color: #3c3c3c;
    // margin-bottom: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #EFF0F1;

    .name-wrap {
        display: flex;
        align-items: center;

        .repaire {
            width: 32px;
            height: 32px;
            line-height: 32px;
            color: #fff;
            font-size: 12px;
            text-align: center;
            background: #FF9940;
            border-radius: 7px;
            margin-right: 15px;
        }

        .name {
            font-weight: 600;
            color: #3c3c3c;
            cursor: pointer;
        }

        .tag {
            display: inline-block;
            padding: 3px 6px;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 12px;
            color: #8C95A1;
            background: rgba(240, 245, 252, 0.4);
            border-radius: 4px;
            border: 1px solid rgba(104, 112, 128, 0.19);
        }
    }

    .bottom_tag {
        display: inline-block;
        padding: 3px 6px;
        font-size: 12px;
        color: #8C95A1;
        background: rgba(240, 245, 252, 0.4);
        border-radius: 4px;
        border: 1px solid rgba(104, 112, 128, 0.19);
        margin-right: 10px;
    }
}

.license_item .item_comp {
    padding: 16px;
    background-color: #F7F8FB;
    border-radius: 6px;
    margin-bottom: 10px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;

    .tag {
        display: inline-block;
        padding: 3px 6px;
        font-weight: 400;
        font-size: 12px;
        color: #8C95A1;
        background: rgba(240, 245, 252, 0.4);
        border-radius: 4px;
        transform: scale(1);
        border: 1px solid rgba(104, 112, 128, 0.19);
    }

    .td:nth-of-type(1) {
        // width: 50%;

        .name {
            color: #3c3c3c;
            margin-right: 4px;
        }

        i {
            color: #F45C4D;
        }

        .tag {
            margin-right: 16px;
        }
    }

    // .td:nth-of-type(2) {
    //     width: 15%;
    // }

    // .td:nth-of-type(3) {
    //     width: 15%;
    // }
}
</style>
