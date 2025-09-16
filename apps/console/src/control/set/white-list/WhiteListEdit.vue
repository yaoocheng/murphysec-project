<template>
    <el-dialog width="664px" top="5%" @closed="bus.emit('closeEdit', false)" title="添加仓库白名单配置"
               :close-on-click-modal="false">
        <FormComp label-position="top" :hide-required-asterisk="false">
            <el-form-item :required="true" label="策略名称">
                <div style="width: 100%;">
                    <el-input v-model="editData.name" maxlength="30" show-word-limit placeholder="请输入策略名称"></el-input>
                </div>
            </el-form-item>

            <el-form-item label="仓库域名">
                <div style="width: 100%;">
                    <el-input v-model="editData.domain" placeholder="请输入仓库域名，如abc.com"></el-input>
                </div>
            </el-form-item>

            <el-form-item label="项目范围">
                <template #label>
                    <div>
                        <span class="g-color-err">*</span> 项目范围
                        <el-tooltip placement="top"><i class="murphy icon-wenhaoxiao g-f-14 g-color-3"></i>
                            <template #content>
                                <div>
                                    情况一：https://git.abc.com/GroupA/ProjectB/mycode
                                    ,其中命名空间为GroupA/ProjectB,仓库名称为mycode,仓库地址为GroupA/ProjectB/mycode
                                </div>
                                <div>
                                    情况二：https://git.abc.com/ProjectB/mycode
                                    ,其中命名空间为ProjectB,仓库名称为mycode,仓库地址为ProjectB/mycode
                                </div>
                            </template>
                        </el-tooltip>
                    </div>
                </template>
                <div class="g-w-100">
                    <el-radio-group v-model="editData.scope">
                        <el-radio :label="1" size="large">将命名空间下全部仓库加入白名单</el-radio>
                        <el-radio :label="2" size="large">将指定仓库地址加入白名单</el-radio>
                    </el-radio-group>

                    <div v-if="editData.scope === 1" class="g-bdr-6 g-bg-f7 g-p-16">
                        <div>
                            <span class="g-color-err">*</span> 命名空间
                        </div>
                        <el-input v-model="editData.namespace" placeholder="请输入命名空间"></el-input>
                    </div>

                    <div v-else class="g-bdr-6 g-bg-f7 g-p-16">
                        <div class="g-flex g-justify-between">
                            <div>
                                <span class="g-color-err">*</span> 仓库地址列表
                            </div>
                            <div>
                                共 {{ splitData?.length }} 条数据
                            </div>
                        </div>
                        <el-input type="textarea" @input="inputHandle" resize="none" :rows="6"
                                  v-model="editData.textarea" placeholder="请输入仓库地址（每个仓库地址单独为一行)，如：
develop/demo
develop/test
public/test-code
GroupA/ProjectB/mycode"></el-input>
                    </div>
                </div>
            </el-form-item>

            <div class="btns">
                <el-button class="minor_btn" @click="bus.emit('closeEdit', false)">取消</el-button>
                <el-button @click="confirmHandle">保存</el-button>
            </div>
        </FormComp>
    </el-dialog>
</template>

<script setup lang='ts'>
import FormComp from 'comp/FormComp.vue';
import { ref } from 'vue';
import { saveWhiteListApi } from 'api/team';
import bus, { showMessage } from 'util/tools';
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import store from 'util/store';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
const props = defineProps(['editData']);
const splitData = ref<any>([]);
const editData = ref<any>(props.editData);

const confirmHandle = async () => {
    const splitDatas = editData.value.textarea.split(/[\r\n\t]/).filter((item: any) => item);
    editData.value.addr_list = splitDatas;
    try {
        await saveWhiteListApi(editData.value);
        bus.emit('closeEdit', false);
        showMessage('保存成功', 'success');
    } catch (error) {
        console.log(error);
    }
};

const inputHandle = (value: string) => {
    splitData.value = value.split(/[\r\n\t]/).filter((item: any) => item);
};
inputHandle(editData.value.textarea);
</script>

<style scoped lang='less'>
.btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;

    .el-button {
        width: 80px;
        height: 32px;
    }
}
</style>
