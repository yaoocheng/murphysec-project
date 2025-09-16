<template>
    <div class="select_plan">
        <el-select v-model="planValue" @change="changeVersion" style="width: 100%;margin-bottom: 16px;">
            <el-option v-for="item in planOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
    </div>

    <!-- 代码片段 -->
    <div class="fix_code_wrap" v-if="(planValue !== 'last'&&info.is_direct_dependency===2)">
        <pre>
            &lt;dependencyManagement>
                &lt;dependencies>
                    &lt;dependency>
                        &lt;groupId>{{ info.comp_name.split(':')[0] }}&lt;/groupId>
                        &lt;artifactId>{{ info.comp_name.split(':')[1] }}&lt;/artifactId>
                        &lt;version>{{ planValue }}&lt;/version>
                    &lt;/dependency>
                &lt;/dependencies>
            &lt;/dependencyManagement>
        </pre>
    </div>
    <!-- 直接依赖有fix_block_data就显示 没有就拼接代码 -->
    <div class="fix_code_wrap" v-if="info.is_direct_dependency===1&&(!info.fix_block_data||!info.fix_block_data[0]?.code_fragment_result?.preview)">
        <pre>
            &lt;dependency>
                &lt;groupId>{{ info.comp_name.split(':')[0] }}&lt;/groupId>
                &lt;artifactId>{{ info.comp_name.split(':')[1] }}&lt;/artifactId>
                &lt;version>{{ planValue }}&lt;/version>
            &lt;/dependency>
        </pre>
    </div>

    <!-- 最后一种修复方式显示 -->
    <div class="repair_wrap" v-if="planValue === 'last'||(info.is_direct_dependency===1&&info.fix_block_data&&info.fix_block_data[0]?.code_fragment_result?.preview)">
        <div class="pr_content" v-for="(item, index) in info.fix_block_data" :key="index">
            <RepairComp :info="item" :version="planValue" :index="index" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import RepairComp from './RepairComp.vue';

const props = defineProps(['info']);
const planValue = ref<string>();
const planOptions = ref<Array<any>>([]);

// 直接依赖只有code方式(fix_block_data只有一个,使用它的fix_plan)  间接依赖有dm和code(dm自己拼， code使用fix_block_data)
if (props.info?.is_direct_dependency === 1) {
    const fixPlans = Object.values(props.info?.fix_block_data[0]?.fix_plan).filter((item: any) => item.target_version).map((item:any) => item.target_version);

    const filterArr:any[] = [...new Set(fixPlans)];

    planOptions.value = filterArr.map((ele: any) => ({
        value: ele,
        label: `缺陷组件${props.info?.comp_name}从${props.info?.comp_version}升级至${ele}`,
    }));
} else if (props.info?.is_direct_dependency === 2) {
    const fixPlans = Object.values(props.info?.comp_info?.fix_plans).filter((item: any) => item.target_version).map((item:any) => item.target_version);

    const filterArr:any[] = [...new Set(fixPlans)];

    planOptions.value = filterArr.map((ele: any) => ({
        value: ele,
        label: `缺陷组件${props.info?.comp_name}从${props.info?.comp_version}升级至${ele}`,
    }));

    // 方案二种只要有一个plan1为空就无此方案
    if (props.info?.fix_block_data?.length && props.info?.fix_block_data?.every((item: any) => item.code_fragment_result && Object.keys(item.code_fragment_result).length && item.fix_plan?.plan1?.target_version)) {
        planOptions.value.push(
            {
                value: 'last',
                label: '升级引入该组件的直接依赖修复安全问题',
            },
        );
    }
}

// 默认第一个修复方案
planValue.value = planOptions.value[0].value;

const constructData = () => {
    store.isDmFix = props.info.is_direct_dependency === 2;
    store.pullRequescCompData = [
        {
            comp_name: props.info?.comp_info?.comp_name,
            comp_version: props.info?.comp_info?.comp_version,
            min_fix_version: planValue.value,
        },
    ];
};
constructData();

// 更改版本构造pr数据
const changeVersion = () => {
    if (planValue.value === 'last') {
        store.pullRequescCompData = props.info.fix_block_data;
        store.isDmFix = false;
    } else {
        constructData();
    }
};
</script>

<style lang='less' scoped>
.repair_wrap {
    padding: 24px;
    background-color: #F7F8FB;
    border-radius: 4px;

    .pr_content {
        background: #FFFFFF;
        border-radius: 4px;
        padding: 16px;
    }

    p {
        color: #3c3c3c;
        margin-bottom: 8px;
    }

    p:nth-of-type(1) {
        color: #858585;
    }
}

.fix_code_wrap {
    background-color: #fafafa;
    color: @text-color;
    font-size: 14px;
    padding: 16px;
    border-radius: 6px;
    line-height: 28px;
}
</style>
