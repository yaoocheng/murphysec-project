<template>
    <CommonHead>
        <div class="common_bread">
            <img @click="$router.push('/project/list')" class="shrink" src="~ast/img/back.png" alt="">
            <span>检测详情</span>
        </div>
    </CommonHead>

    <DetailContent />

    <TemporaryAffix />

    <AppAdjustModal v-model="isShowAppAdjustModal" />

    <TemporaryAffixSnip />

    <AppAdjustModalSnip v-model="isShowUseSnipModal" />

    <TemporaryAffixCompUse />

    <AppAdjustUseModal v-model="isShowAppAdjustUseModal" v-if="isShowAppAdjustUseModal" />
</template>

<script setup lang='ts'>
import { isShowAppAdjustModal } from '../business';
import { isShowUseSnipModal } from './snippet/business';
import { isShowAppAdjustUseModal } from './comp_use/business';
import DetailContent from './DetailContent.vue';
import CommonHead from '@/components/CommonHead.vue';
import TemporaryAffix from './sbom/TemporaryAffix.vue';
import AppAdjustModal from './sbom/AppAdjustModal.vue';

import TemporaryAffixSnip from './snippet/TemporaryAffix.vue';
import AppAdjustModalSnip from './snippet/AppAdjustModal.vue';

import AppAdjustUseModal from './comp_use/AppAdjustUseModal.vue';
import TemporaryAffixCompUse from './comp_use/TemporaryAffixCompUse.vue';

</script>

<style lang='less' scoped>
.shrink {
    width: 32px;
    vertical-align: -10px;
    cursor: pointer;
}
</style>
