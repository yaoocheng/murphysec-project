<template>
    <div class="w-full h-full p-6">
        <!-- <div class="py-4 px-3 flex flex-col gap-1 border-r border-[#e5e7eb]">
            <div v-for="item in NavList" :key="item.path" class="py-2 px-4 bg-[#E5EAFF] rounded-[3px]">
                <div>{{ item.name }}</div>
            </div>
        </div> -->
        <div class="flex items-center gap-2">
            <span class="text-center">情报匹配到新安全风险站内通知</span>
            <a-switch v-model:checked="checked" size="small" @change="handleChange" />
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserSettingApi, saveUserSettingApi } from '@/api/setting';

const checked = ref(false);

// const NavList = [
//     {
//         name: '通知设置',
//         path: '/setting/notify',
//     },
//     {
//         name: '通知设置',
//         path: '/setting/notify',
//     },
//     {
//         name: '通知设置',
//         path: '/setting/notify',
//     },
// ];

onMounted(async () => {
    const res = await getUserSettingApi();
    checked.value = res.data.data.murphy_vuln_notification;
});

const handleChange = async () => {
    await saveUserSettingApi({ murphy_vuln_notification: checked.value });
};

</script>
