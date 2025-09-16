<template>
    <ChangePasswordModal v-model="isShowPwdModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChangePasswordModal from '@/control/component/ChangePasswordModal.vue';

const isShowPwdModal = ref(true);

</script>
