<template>
    <el-dialog width="1320px" @close="closeHandle" :close-on-click-modal="false">
        <template #header>
            <div>
                <span v-if="lincenseStore.type === 1">添加</span>
                <span v-if="lincenseStore.type === 2">编辑</span>许可证策略
                <TipsComp placement="bottom" :width="344" :content="'添加许可证策略以满足不同场景下的风险等级调整，并可以为该场景下的许可证设置单独的说明信息'" />
            </div>
        </template>

        <div class="add-content">
            <AddForm v-if="step === 1" />
            <LicenseCards v-if="step === 2" />

            <div class="btns" v-if="step === 1">
                <el-button v-if="lincenseStore.type !== 3" class="minor_white_btn" @click="closeHandle">取消</el-button>
                <el-button
                    v-if="lincenseStore.name && lincenseStore.desc && ((lincenseStore.is_global === 2 && lincenseStore.tags.length) || lincenseStore.is_global === 1)"
                    class="minor_btn" @click="step = 2">下一步</el-button>
                <el-button v-else class="minor_btn disable-next">下一步</el-button>
            </div>

            <div class="btns" v-if="step === 2">
                <el-button class="minor_btn" @click="step = 1">上一步</el-button>
                <el-button v-if="lincenseStore.type !== 3" class="minor_white_btn" @click="closeHandle">取消</el-button>
                <el-button v-if="lincenseStore.type !== 3" @click="confirHandle">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue';
import { getSysLicenseApi, addLicenseStraApi, editStraGetLicenseApi } from 'api/team';
import AddForm from './AddForm.vue';
import LicenseCards from './LicenseCards.vue';
import TipsComp from '@/components/TipsComp.vue';
import lincenseStore, {
    highList, midList, lowList, safeList, createAddLicenseData,
} from './store';
import store from '@/utils/store';
import { showMessage } from '@/utils/tools';

const emits = defineEmits(['updateData']);
const step = ref(1);

const divide = (data: any) => {
    highList.value = data.filter((item: any) => item.risk === 'High');
    midList.value = data.filter((item: any) => item.risk === 'Medium');
    lowList.value = data.filter((item: any) => item.risk === 'Low');
    safeList.value = data.filter((item: any) => item.risk === 'Safe');
};

onBeforeMount(async () => {
    if (lincenseStore.type === 1 || lincenseStore.type === 3) {
        try {
            const { data } = await getSysLicenseApi({
                team_id: store.teamInfo.team_id,
                is_only_builtin: false,
            });
            divide(data);
        } catch (error) {
            console.log(error);
        }
    } else if (lincenseStore.type === 2) {
        try {
            const { data } = await editStraGetLicenseApi({
                team_id: store.teamInfo.team_id,
                detector_license_id: lincenseStore.id,
            });
            lincenseStore.licenses = data?.change_list;
            divide(data?.list);
        } catch (error) {
            console.log(error);
        }
    }
});

const confirHandle = async () => {
    try {
        await addLicenseStraApi(lincenseStore);
        showMessage('操作成功', 'success');
        emits('updateData', false);
        Object.assign(lincenseStore, createAddLicenseData());
    } catch (error) {
        console.log(error);
    }
};

const closeHandle = () => {
    Object.assign(lincenseStore, createAddLicenseData());
    emits('updateData', false);
};

</script>

<style scoped lang='less'>
.add-content {
    height: 600px;
    padding-top: 16px;
    position: relative;
}

.btns {
    position: absolute;
    bottom: 0;
    right: 0;
}

.btns .el-button {
    width: 80px;
    height: 32px;

}

.disable-next {
    &:hover {
        background-color: #fff !important;
    }

    border-color: #EBEBEB !important;
    color: #C7C7C7 !important;
}
</style>
