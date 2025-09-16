<template>
    <div class="repair_code">
        <div class="name_content">
            <div class="name">
                <el-tooltip placement="top" :content="info?.comp_name">
                    {{ info?.comp_name }}
                </el-tooltip>
            </div>
            <div class="selects">
                当前版本
                <span>{{ info?.comp_version }}</span>
                升级至
                <span>{{ version !== 'last' ? version : info?.fix_plan?.plan1?.target_version }}</span>
                <!-- eslint-disable-next-line vue/no-mutating-props -->
                <!-- <el-select v-model="info.min_fix_version" style="width: 235px;" @change="changeVersion">
                    <el-option v-for="(item, index) in options" :key="index" :value="item.value">
                        <span>{{ item.desc }}</span>
                    </el-option>
                </el-select> -->
            </div>
        </div>
        <!-- <div class="tip">
            <i class="murphy icon-gantanhao"></i>
            {{ info?.is_direct === 1 ? `缺陷组件${info?.direct_comp}` : `缺陷组件${info?.direct_comp}是由${info?.comp_name}组件引入的` }}
        </div> -->
        <div class="repair_code">
            <div class="code_head">
                <div>
                    <!-- <i class="murphy icon-arrow" v-if="isExpand"></i> -->
                    <!-- <i class="murphy icon-arrow" style="transform: rotate(-90deg) scale(0.6);" v-else></i> -->
                    {{ codes?.preview[0]?.path }}
                </div>
            </div>
            <div class="code_content">
                <div class="level" v-for="(ele, index) in codes?.preview[0]?.content" :key="index">
                    <span class="line">
                        {{ ele.line }}
                        <i v-if="codes?.preview[0]?.line === ele.line" style="font-size: 16px;cursor: pointer;margin-left: 10px;"
                            :data-clipboard-text="ele.text" @click="copyFunc('#path_copy')" id="path_copy"
                            class="murphy icon-fuzhi1"></i>
                    </span>
                    <span class="code_wrap">
                        <highlightjs autodetect :code="ele.text" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { copyFunc } from 'util/tools';

const props = defineProps(['info', 'version']);
const version = ref<string>(props.version);
const codes = ref<any>(props.info.code_fragment_result);
const lastVersion = ref<string>(props.version);
// console.log(props.info);

// 选版本代码变化 替换修复版本到代码中
const changeVersion = () => {
    codes.value?.preview.forEach((item: any) => {
        item.content?.forEach((ele: any) => {
            if (ele.line === item.line) {
                ele.text = ele.text.replace(props.info?.comp_version, props.version !== 'last' ? props.version : props.info?.fix_plan?.plan1?.target_version);
            }
        });
    });
    lastVersion.value = props.version;
};
changeVersion();

watch(() => props.version, ((newVal: any) => {
    codes.value?.preview.forEach((item: any) => {
        item.content?.forEach((ele: any) => {
            if (ele.line === item.line) {
                ele.text = ele.text.replace(lastVersion.value, newVal);
            }
        });
    });
    lastVersion.value = props.version;
    version.value = newVal;
}));

</script>

<style lang='less' scoped>
.name_content {
    .between();
    margin-bottom: 8px;

    .name {
        max-width: 240px;
        .ellipsis();
    }

    .selects {
        color: #8F959E;
    }

    .selects span {
        color: #3c3c3c;
        margin-right: 8px;
    }
}

.tip {
    background-color: #6C87FF2E;
    padding: 9px 16px;
    border-radius: 6px;
    color: #3c3c3c;
    margin-bottom: 8px;
    font-size: 12px;

    i {
        color: #6C87FF;
        margin-right: 8px;
        vertical-align: -1px;
    }
}

.code_head {
    height: 52px;
    color: #3c3c3c;
    background: #fafafa;
    font-size: 12px;
    padding: 0 16px;
    cursor: pointer;
    .between();

    i {
        display: inline-block;
        color: #525252;
        font-size: 12px;
        vertical-align: -1px;
        transform: scale(0.6);
    }
}

.code_content {
    background-color: #eaf7ff;
    margin-bottom: 8px;
}

.level {
    display: flex;
    align-items: center;
    height: 36px;

    .line {
        width: 80px;
        height: 100%;
        text-align: left;
        color: #8F959E;
        padding-left: 20px;
        line-height: 36px;
        box-sizing: border-box;
    }

    .code_wrap {
        flex: 1;
        width: 0;
        white-space: pre-wrap;
    }
}
</style>
