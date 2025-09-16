<template>
    <div class="form_item">
        <div class="name"><span v-if="lincenseStore.type !== 3" class="g-color-err">*</span> 策略名称</div>
        <el-input v-if="lincenseStore.type !== 3" v-model="lincenseStore.name" placeholder="请输入策略名称" maxlength="30"
            show-word-limit></el-input>
        <div v-else>{{ lincenseStore.name }}</div>
    </div>

    <div class="form_item">
        <div class="name"><span v-if="lincenseStore.type !== 3" class="g-color-err">*</span> 策略说明</div>
        <el-input v-if="lincenseStore.type !== 3" v-model="lincenseStore.desc" type="textarea" rows="4"
            placeholder="请输入策略说明" maxlength="500" show-word-limit></el-input>
        <div v-else>{{ lincenseStore.desc }}</div>
    </div>

    <div class="g-f-16 g-color-1 g-fw-500 g-mb-8">
        <span v-if="lincenseStore.type !== 3" class="g-color-err">*</span> 应用范围
        <TipsComp placement="right" :width="344" :content="'一个项目只可以应用一个许可证策略。若一个项目上被应用了多个策略，将根据最近操作时间取最新一条策略应用至该项目'" />
    </div>
    <div class="part_content">
        <FormComp label-position="top" :hide-required-asterisk="false">
            <el-form-item>
                <template #label>
                    <span v-if="lincenseStore.type !== 3" class="g-color-err">*</span> 策略范围
                </template>
                <el-radio-group v-if="lincenseStore.type !== 3" v-model="lincenseStore.is_global"
                    @change="lincenseStore.tags = []">
                    <el-radio :label="1" size="large">全部项目</el-radio>
                    <el-radio :label="2" size="large">指定项目</el-radio>
                </el-radio-group>

                <div v-else>
                    {{ lincenseStore.is_global === 1 ? '全部项目':'指定项目' }}
                </div>
            </el-form-item>

            <div v-if="lincenseStore.type !== 3">
                <div v-if="lincenseStore.is_global === 2" class="g-bg-ff g-bdr-6 g-w-100 g-border-box"
                    style="padding: 16px;padding-bottom: 1px;">
                    <el-form-item :required="true" label="项目标签">
                        <el-select class="g-w-100" v-model="lincenseStore.tags" @change="changeTagNames"
                            :reserve-keyword="false" multiple filterable allow-create default-first-option
                            placeholder="请搜索并选择项目标签">
                            <el-option v-for="item in tagList" :key="item.tag_id" :label="item.tag_name"
                                :value="item.tag_name" />
                        </el-select>
                    </el-form-item>
                </div>
            </div>
        </FormComp>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { getProjectTagsApi } from 'api/project';
import TipsComp from 'comp/TipsComp.vue';
import FormComp from 'comp/FormComp.vue';
import { showMessage } from 'util/tools';
import store from 'util/store';
import lincenseStore from './store';
// import { } from 'api/project';

const tagList = ref<any[]>([]);

onBeforeMount(async () => {
    try {
        const { data } = await getProjectTagsApi({
            team_id: store.teamInfo.team_id,
        });
        tagList.value = data;
    } catch (error) {
        console.log(error);
    }
});

const changeTagNames = (value: string[]) => {
    if (value.length && value[value.length - 1].length > 10) {
        value.pop();
        showMessage('长度不能超过10个字符', 'warning');
    }
};
</script>

<style scoped lang='less'>
.form_item {
    margin-bottom: 32px;

    .name {
        color: @text-color;
        font-weight: 500;
        margin-bottom: 8px;
    }
}

.part_content {
    background: #F7F8FB;
    border-radius: 6px;
    padding: 24px;
    font-size: 14px;
    margin-bottom: 32px;
}
</style>
