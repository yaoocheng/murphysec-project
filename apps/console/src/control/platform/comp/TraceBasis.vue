<template>
    <div style="height: calc(100vh - 300px);">
        <div class="flex justify-between h-full" v-if="basisData && Object.keys(basisData).length">
            <div class="w-[280px] mr-0.5 bg-f7 rounded-md p-4">
                <div class="flex justify-between items-center mb-4">
                    <div class="font-semibold">来源文件</div>
                    <SelectComp @change="changeSource" class="w-32" clearable size="small" :options="source_option"
                        v-model="source" placeholder="组件识别准确性" />
                </div>

                <div style="height: calc(100% - 48px);" class="overflow-auto">
                    <div @click="activeData = item; activeItem = i" class="p-2 rounded-md active cursor-pointer"
                        :class="{ 'bg-[#6C87FF1A]': activeItem === i }" v-for="(item, i) in listData" :key="i">
                        <div class="mb-1.5 flex items-center">
                            <img class="w-5 mr-1 align-middle" src="~ast/fileImg/file_type_binary.svg" alt="">
                            <span :class="{ 'text-primary': activeItem === i }" class="font-medium mr-1">
                                {{ item.name }}
                            </span>

                            <TagComp v-if="item?.accuracy==='Inaccuracy'" content="模糊" c="#525252" bgc="#EBEBEB" />

                            <TagComp v-if="item?.accuracy==='Accuracy'" class="ml-1" content="精准" c="#6425D0" bgc="#7F3BF533" />

                            <TagComp v-if="item?.accuracy==='Adjusted'" class="ml-1" content="校准" c="#B220B2" bgc="#D136D133" />
                        </div>
                        <div class="ell text-xs text-85 break-all">{{ item.path }}</div>
                    </div>

                    <NoData :image-size="100" v-if="!listData.length" />
                </div>
            </div>

            <div class="flex-1 bg-f7 rounded-md p-4 overflow-auto">
                <div class="bg-[#EBEBEBCC] px-3 py-2 text-xs break-all">
                    {{ activeData?.path }}
                </div>
                <div class="p-4 bg-ff">
                    <div v-if="activeData?.accuracy==='Adjusted'" class="mb-6">
                        该文件为校准组件时所选择的来源文件，以下为手动校准前系统提供的溯源依据
                    </div>

                    <div :class="{'opacity-20':activeData?.accuracy==='Adjusted'} ">
                        <div class="flex justify-between mb-6">
                            <div class="w-1/3">
                                检测方式：二进制成分识别
                                <TipsComp
                                    content="基于对提取后的二进制文件元数据、文件哈希、符号信息、字符串、立即数、函数语义等多维度特征信息，通过组合多种分析策略，可识别二进制文件中包含的依赖软件成分"
                                    width="344" />
                            </div>
                            <div class="w-1/3">组件识别准确性：{{ activeData?.accuracy === 'Inaccuracy' ? '模糊' : '准确' }}</div>
                            <div class="w-1/3">引入组件关系：{{ curCompInfo.is_direct_dependency ? '直接依赖' : '间接依赖' }}</div>
                        </div>

                        <div class="flex justify-between mb-4">
                            <div class="font-medium">检测依据</div>
                            <div v-if="activeData?.hash_string_list?.length" class="text-xs text-85">仅展示部分特征</div>
                        </div>

                        <div v-if="activeData?.accuracy === 'Inaccuracy'"
                            class="tip g-f-14 g-color-1 g-flex g-justify-between">
                            <div>
                                <i class="murphy icon-tan align-middle" style="color: #FF9940;"></i>
                                由于目标文件中包含的唯一性特征较少，系统使用模糊匹配策略识别的结果可能不精确
                            </div>
                        </div>

                        <div v-if="activeData?.pattern_match_list?.length">
                            <div v-for="item in activeData?.pattern_match_list" :key="item.whole_block"
                                class="p-4 overflow-x-auto bg-f7 mb-2">
                                <pre>{{ item.whole_block }}</pre>
                            </div>
                        </div>
                        <div v-else-if="activeData?.hash_string_list?.length"
                            class="border-solid border border-[#EBEBEB] rounded-md mb-2">
                            <div v-for="item in activeData?.hash_string_list" :key="item.text" class="px-4 py-[10px]"
                                style="border-bottom: 1px solid #EFF0F1;">
                                {{ item.text }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <NoData description="暂无溯源依据" v-else />
    </div>
</template>

<script setup>
import { ref } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import store from 'util/store';
// import { } from 'api/project';
const { basisData } = defineProps(['basisData', 'curCompInfo']);

const activeItem = ref(0);
const activeData = ref({});
const listData = ref([]);
const cacheData = ref([]);

// eslint-disable-next-line no-restricted-syntax, guard-for-in
for (const key in basisData) {
    listData.value.push({
        path: key,
        name: key.split('/')[key.split('/').length - 1],
        ...basisData[key],
    });
}

cacheData.value = listData.value;
[activeData.value] = listData.value;

const source = ref(undefined);
const source_option = [
    {
        label: '校准',
        value: 'Adjusted',
    },
    {
        label: '精准',
        value: 'Accuracy',
    },
    {
        label: '模糊',
        value: 'Inaccuracy',
    },

];

const changeSource = (val) => {
    if (val) {
        listData.value = cacheData.value.filter((item) => item.accuracy === val);
    } else {
        listData.value = cacheData.value;
    }
};

</script>

<style>
.tip {
    padding: 8px 16px;
    border-radius: 6px;
    background-color: #FF99401A;
    margin-bottom: 16px;
}

.ell {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>
