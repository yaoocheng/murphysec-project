<template>
    <el-dialog width="630px" title="高级筛选" :close-on-click-modal="false" @closed="emits('update:modelValue', false)">
        <div class="form_item">
            <div class="name">项目名称</div>
            <el-input v-model="formData.project_name" placeholder="请输入完整的项目名称"></el-input>
        </div>
        <div class="form_item">
            <div class="name">漏洞</div>
            <el-input v-model="formData.vul_id" placeholder="请输入漏洞CVE/MPS编号"></el-input>
        </div>
        <div class="form_item">
            <div class="name">组件版本
                <!-- <el-tooltip placement="right">
                    <template #content>
                        <div style="width: 344px;">版本格式：<br>
                            “,”为区间分割符号，左侧为最小版本，右侧为最大版本<br>
                            “[” 为包含该版本<br>
                            “)” 为不包含该版本<br>
                            “*”表示为不限制版本
                        </div>
                    </template>
                    <i class="murphy icon-wenhaoxiao g-color-3 g-f-14"></i>
                </el-tooltip> -->
            </div>
            <div class="comp_list" v-for="(item, index) in formData.asset_list" :key="index">
                <el-input style="width: 1300px;" v-model="item.name" placeholder="完整的组件名称"></el-input>
                <el-input v-model="item.min_version" placeholder="最小版本（包含）"></el-input>
                <el-input v-model="item.max_version" placeholder="最大版本（包含）"></el-input>
                <i class="murphy icon-zengjia" v-if="index === 0" @click="addCompHandle"></i>
                <i class="murphy icon-jianshao1" v-else @click="decreaseCompHandle(index)"></i>
            </div>
        </div>

        <div class="group-btn">
            <el-button @click="emits('update:modelValue', false)">取消</el-button>
            <el-button
                @click="emits('confirmFilterHandle', formData); emits('update:modelValue', false);">确认</el-button>
        </div>

    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import bus, { showMessage } from 'util/tools';

const emits = defineEmits(['update:modelValue', 'confirmFilterHandle']);
const formData = ref<{
    project_name: string,
    vul_id: string,
    asset_list: Array<{
        name: string,
        min_version: string,
        max_version: string,
    }>,
}>({
    project_name: '',
    vul_id: '',
    asset_list: [{
        name: '',
        min_version: '',
        max_version: '',
    }],
});

bus.on('showAdvanData', (data:any) => {
    formData.value.asset_list = data.asset_list;
    formData.value.project_name = data.project_name;
    formData.value.vul_id = data.vul_id;
});

// 添加
const addCompHandle = () => {
    if (formData.value.asset_list.length === 10) {
        showMessage('最多可添加10个组件', 'warning');
        return;
    }
    formData.value.asset_list.push({
        name: '',
        min_version: '',
        max_version: '',
    });
};

const decreaseCompHandle = (index: number) => {
    formData.value.asset_list.splice(index, 1);
};
</script>

<style lang='less' scoped>
.form_item {
    margin-bottom: 24px;

    .name {
        color: @text-color;
        font-weight: 500;
        margin-bottom: 8px;
    }

    .comp_list {
        margin-bottom: 8px;
        .between();

        .el-input {
            margin-right: 8px;
        }

        i {
            cursor: pointer;
            font-size: 18px;
        }
    }
}
</style>
