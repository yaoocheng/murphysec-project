<template>
    <div ref="fileCodeRef"
        class="flex flex-1 w-0 relative overflow-auto box-border mr-2 h-full border border-solid border-[#ebebeb] rounded-md">
        <!-- 蒙层 -->
        <div v-if="fileCode" ref="hide" @click="clickFragHandle(item)"
            :class="{ 'active_frag': fragCodeMatchFileId === item.source_id }" :id="`frag_${item.source_id}`"
            class="hide absolute cursor-pointer bg-[#6C87FF1A] hover:bg-[#6C87FF33] box-border w-full left-0"
            :style="{ top: `${(item.first_line_range - 1) * parseInt(ITEM_CODE_HEIGHT)}px`, height: `${(item.last_line_range - item.first_line_range + 1) * parseInt(ITEM_CODE_HEIGHT)}px` }"
            v-for="(item, i) in midHighLightList" :key="item.source_id">

            <div v-if="!$route.fullPath.includes('share-report')"
                class="code_operate h-9 absolute right-0 top-0 w-[184px] flex items-center justify-center text-primary bg-[#e2e7ff] text-xs">
                <div class="hover_icon py-0.5 hover:bg-[#6C87FF1A]" @click="moreModal = true; clickFragHandle(item)"
                    v-if="item.confirm_status === 2">
                    <SvgIcon class="align-[-2px]" name="more_match" color="#6C87FF" style="width: 12px; height: 12px" />
                    更多匹配结果
                </div>

                <Tooltip v-else content="当确认状态为“待确认”，才可以查看更多匹配结果">
                    <div class="text-c7">
                        <SvgIcon class="align-[-2px]" name="more_match" color="#c7c7c7"
                            style="width: 12px; height: 12px" />
                        更多匹配结果
                    </div>
                </Tooltip>

                <el-divider class="border-[#6C87FF]" direction="vertical" />

                <el-popover ref="popRef" placement="bottom-end" :teleported="false" trigger="click" :hide-after="0">
                    <div @click.stop="changeFragStatus(i, ele, item)"
                        class="px-4 py-2 cursor-pointer hover:bg-eb rounded-md" v-for="ele in changeStatusOption"
                        :key="ele.value">
                        {{ ele.label }}
                    </div>
                    <template #reference>
                        <div @click.stop class="hover_icon py-0.5 hover:bg-[#6C87FF1A]">
                            {{ changeStatusOption.find(ele => ele.value === item.confirm_status)?.label }}
                            <SvgIcon name="expand_down_filled" color="#6C87FF" style="width: 8px; height: 8px" />
                        </div>
                    </template>
                </el-popover>
            </div>
        </div>

        <!-- 无代码 -->
        <div class="w-full" v-if="!fileCode">
            <div class="text-xs text-85 flex items-center ml-4 mt-4 mb-2">
                <SvgIcon class="tips mr-[6px]" name="tips" color="#858585" style="width: 14px; height: 14px" />
                检测时未上传源代码，仅展示片段行号信息
            </div>
            <div class="ml-4 mt-4" v-if="midInfo.data_type === 'file'">
                片段行号：1 - {{ midInfo.total_lines }}
            </div>

            <div v-else>
                <div @click="clickFragHandle(item)" :class="{ 'active_frag': fragCodeMatchFileId === item.source_id }"
                    class="hide flex pl-4 justify-between items-center cursor-pointer hover:bg-[#6C87FF33] box-border w-full h-9"
                    v-for="(item, i) in midHighLightList" :key="item.source_id">
                    <div class="text-3c text-sm">
                        片段行号：{{ item.first_line_range }} - {{ item.last_line_range }}
                    </div>

                    <div v-if="!$route.fullPath.includes('share-report')"
                        class="code_operate w-[184px] flex items-center justify-center text-primary bg-[#e2e7ff] text-xs">
                        <div class="hover_icon py-0.5 hover:bg-[#6C87FF1A]"
                            @click="moreModal = true; clickFragHandle(item)" v-if="item.confirm_status === 2">
                            <SvgIcon class="align-[-2px]" name="more_match" color="#6C87FF"
                                style="width: 12px; height: 12px" />
                            更多匹配结果
                        </div>

                        <Tooltip v-else content="当确认状态为“待确认”，才可以查看更多匹配结果">
                            <div class="text-c7">
                                <SvgIcon class="align-[-2px]" name="more_match" color="#c7c7c7"
                                    style="width: 12px; height: 12px" />
                                更多匹配结果
                            </div>
                        </Tooltip>

                        <el-divider class="border-[#6C87FF]" direction="vertical" />

                        <el-popover ref="popRef" placement="bottom-end" :teleported="false" trigger="click"
                            :hide-after="0">
                            <div @click.stop="changeFragStatus(i, ele, item)"
                                class="px-4 py-2 cursor-pointer hover:bg-eb rounded-md"
                                v-for="ele in changeStatusOption" :key="ele.value">
                                {{ ele.label }}
                            </div>
                            <template #reference>
                                <div @click.stop class="hover_icon py-0.5 hover:bg-[#6C87FF1A]">
                                    {{ changeStatusOption.find(ele => ele.value === item.confirm_status)?.label }}
                                    <SvgIcon name="expand_down_filled" color="#6C87FF"
                                        style="width: 8px; height: 8px" />
                                </div>
                            </template>
                        </el-popover>
                    </div>
                </div>
            </div>
        </div>

        <div class="mx-4" v-if="fileCode">
            <div class="line_num text-right" :style="{ height: ITEM_CODE_HEIGHT, lineHeight: ITEM_CODE_HEIGHT }"
                v-for="(item, index) in fileCode?.split(/\n/)" :key="index">
                <span>{{ index + 1 }}</span>
            </div>
        </div>

        <div v-if="fileCode">
            <div class="item_code" :style="{ height: ITEM_CODE_HEIGHT, lineHeight: ITEM_CODE_HEIGHT }"
                v-for="(item, i) in fileCode?.split(/\n/)" :key="i">
                <pre>{{ item }}</pre>
                <!-- <highlightjs autodetect :code="item" /> -->
            </div>
        </div>
    </div>

    <MoreMatchFile v-if="moreModal" v-model="moreModal" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showMessage } from 'util/tools';
import { changeSnippetStatusApi } from 'api/detail';
import {
    fileCode, changeStatusOption, fragCodeMatchFileId, ITEM_CODE_HEIGHT, midHighLightList, midInfo,
} from './business';
import MoreMatchFile from './MoreMatchFile.vue';

const fileCodeRef = ref();
const hide = ref();
const popRef = ref();
const moreModal = ref(false);
const route = useRoute();

onMounted(() => {
    if (hide.value?.length) {
        fileCodeRef.value.addEventListener('scroll', () => {
            hide.value.forEach((item) => {
                item.style.left = `${fileCodeRef.value.scrollLeft}px`;
            });
        });
    }
});

// position file list
watch(fragCodeMatchFileId, (newVal) => {
    if (document.getElementById(`frag_${newVal}`)) {
        document.getElementById(`frag_${newVal}`).scrollIntoView(true);
    }
});

const clickFragHandle = (item) => {
    fragCodeMatchFileId.value = item.source_id;
    midInfo.value.source_fragmented = item;
};

// 更改状态
const updateHandle = async (status, list) => {
    try {
        await changeSnippetStatusApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            source_id: list,
            source_file_id: [midInfo.value.source_file_id],
            confirm_status: status,
        });
        showMessage('修改成功', 'success');
    } catch (error) {
        console.log(error);
    }
};

const changeFragStatus = async (i, ele, item) => {
    popRef.value[i].hide();
    item.confirm_status = ele.value;

    await updateHandle(ele.value, [item.source_id]);

    // left list status change
    if (midHighLightList.value.some((_item) => _item.confirm_status === 2)) {
        midInfo.value.confirm_status = 2;
    } else if (midHighLightList.value.some((_item) => _item.confirm_status === 3)) {
        midInfo.value.confirm_status = 3;
    } else if (midHighLightList.value.some((_item) => _item.confirm_status === 1)) {
        midInfo.value.confirm_status = 1;
    }
};

</script>

<style lang="less">
.active_frag {
    border: 2px solid #6C87FF;
    background-color: #6C87FF33;
}

.code_operate {
    opacity: 0
}

.hide:hover .code_operate {
    opacity: 1
}

.item_code pre code.hljs {
    padding: 0 !important;
    overflow-x: initial;
}
</style>
