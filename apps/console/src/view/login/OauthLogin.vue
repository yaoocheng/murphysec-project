<template>
    <div v-loading.fullscreen="loading" element-loading-text="正在登录中，请您耐心等待..."></div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getOrgUserInfo } from '@/view/login/hook';

const loading = ref<boolean>(true);
const route = useRoute();
const router = useRouter();

onBeforeMount(async () => {
    try {
        const data = await getOrgUserInfo(route.query.ticket as string);
        // eslint-disable-next-line no-unused-expressions
        data ? router.push('/no-team') : router.push('/platform/index');
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped lang='less'></style>
