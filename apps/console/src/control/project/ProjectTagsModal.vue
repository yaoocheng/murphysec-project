<template>
    <el-dialog width="420px" @opened="openModal" :close-on-click-modal="false" @closed="closeHandle">
        <template #header>
            <div class="modal_title">
                设置项目标签
            </div>
        </template>
        <div>
            <div class="g-mb-24" v-if="store.conf?.is_cmdb_open">
                <div class="g-fw-500 g-mb-6"><span style="color: #F34D3D;">*</span> 默认标签</div>
                <el-select style="width: 100%" filterable popper-class="default-tag-select" @change="selectDefaultTag"
                    v-model="defaultTag">
                    <el-option v-for="(item, key) in defaultTagOption" :key="key" :label="item.name" :value="item.name">
                        <div style="height: 20px;" class="g-fw-400 g-mb-8">
                            {{ item.name }}
                        </div>
                        <div class="g-pb-6" style="width: 320px;line-height: 20px; word-break:break-all;white-space: pre-wrap">
                            <span class="g-f-12 g-color-3 g-fw-400" v-for="(ele, i) in item.primaryDep?.slice(0, 2)" :key="ele">
                                {{ ele }}<span v-if="i===0">-</span>
                            </span>
                        </div>
                    </el-option>
                </el-select>
            </div>

            <div class="g-fw-500 g-mb-6">自定义标签</div>

            <div v-if="!isAddTag">
                <div class="g-mb-8">
                    <div class="add item-tag" @click="isAddTag = true">
                        <i class="murphy icon-jia"></i> 添加自定义标签
                    </div>
                </div>

                <span class="item-tag g-mb-8" v-for="(item, index) in tags" :key="index">
                    {{ item.tag_name }} <i @click="delTagsHandle(item)" class="murphy icon-cuo"></i>
                </span>
            </div>

            <div v-else class="g-flex">
                <el-input maxlength="10" show-word-limit v-model="value" placeholder="请输入标签名称（最多10个字符）"></el-input>
            </div>
        </div>
        <div class="btns" v-if="isAddTag">
            <el-button class="cancle_btn" @click="isAddTag = false; value = ''">取消</el-button>
            <el-button @click="confirmHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { addProjectTagApi, getCurProjectTagsApi, delProjectTagApi } from 'api/project';
import { ref } from 'vue';
import { getDefaultTagsApi, addDefaultTagsApi } from 'api/asset';
import store from 'util/store';
import { showMessage } from '@/utils/tools';

const props = defineProps(['data']);
// const emits = defineEmits(['update:modelValue']);
const value = ref<string>('');
const isAddTag = ref<boolean>(false);
const tags = ref<Array<any>>([]);
const defaultTag = ref<string>('');
const defaultTagObj = ref<any>({});
const defaultTagOption = ref<any[]>([]);

const closeHandle = () => {
    window.location.reload();
};

const openModal = async () => {
    try {
        const res = await getCurProjectTagsApi(props.data.project_id);
        tags.value = res.data.filter((item: any) => item.tag_type === 0);

        // 默认标签
        defaultTag.value = res.data.find((item: any) => item.tag_type === 1)?.tag_name;
        defaultTagObj.value = res.data.find((item: any) => item.tag_type === 1);
    } catch (error) {
        console.log(error);
    }

    if (store.conf?.is_cmdb_open) {
        try {
            const { data } = await getDefaultTagsApi();
            defaultTagOption.value = data;
        } catch (error) {
            console.log(error);
        }
    }
};
// 添加自定义标签
const confirmHandle = async () => {
    if (!value.value.trim()) {
        showMessage('请填写标签名称', 'warning');
        return;
    }
    try {
        await addProjectTagApi({
            tag_name: value.value.trim(),
            project_id: props.data.project_id,
            update_user: store.userInfo?.id,
            team_id: store.teamInfo.team_id,
        });
        isAddTag.value = false;
        value.value = '';
        openModal();
    } catch (error) {
        console.log(error);
    }
};

// 选择默认标签
const selectDefaultTag = async (name: string) => {
    console.log(name);

    if (defaultTagObj.value) {
        await addDefaultTagsApi({
            update_user: store.userInfo?.id,
            team_id: store.teamInfo.team_id,
            ...defaultTagObj.value,
            tag_name: name,
        });
    } else {
        await addDefaultTagsApi({
            tag_name: name,
            tag_type: 1,
            tag_id: '0',
            team_id: store.teamInfo.team_id,
            project_id: props.data.project_id,
            update_user: store.userInfo?.id,
        });
    }
};

const delTagsHandle = async (item: any) => {
    await delProjectTagApi({
        tag_id: item.tag_id,
        project_id: props.data.project_id,
        team_id: store.teamInfo.team_id,
    });
    showMessage('删除成功', 'success');
    openModal();
};
</script>

<style lang='less' scoped>
.item-tag {
    background-color: #c7c7c73b;
    display: inline-block;
    border-radius: 4px;
    padding: 3px 6px;
    margin-right: 8px;
    line-height: 20px;
    height: 20px;
    cursor: pointer;

    i {
        font-size: 14px;
    }
}

.add {
    display: inline-block;
    border: none;
    color: #6C87FF;
    background-color: #fff;

    &:hover {
        background-color: #6C87FF1A;
    }
}

.btns {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>

<style lang="less">
.default-tag-select .el-select-dropdown__item {
    height: auto;
}
</style>
