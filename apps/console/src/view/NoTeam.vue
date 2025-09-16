<template>
    <CommonHead>
        <div class="flex items-center">
            <img class="w-8" @click="toWeb" :src="$systemConfig.mainLogo" alt="">
            <span class="text-3c text-base ml-2">暂无团队</span>
        </div>
    </CommonHead>

    <div class="h-content bg-f7 box-border p-6">
        <div class="bg-ff h-full rounded-md flex items-center justify-center">
            <div class="flex items-center text-3c">
                <img class="w-[400px] mr-12" src="~ast/img/no-team.png" alt="">
                <div>
                    <div class="font-semibold text-2xl mb-4">暂未加入任何团队</div>
                    <div class="text-sm font-medium w-[340px] leading-22 mb-1">您暂未加入任何团队，需联系管理员将您添加至团队后使用该产品
                        <a class="text-primary hover:underline" href="/docs/faqs/group/add-team-members.html" target="_blank">如何添加成员至团队</a>
                    </div>
                    <div class="text-sm font-medium text-85">
                        「个人空间」已被管理员关闭
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang='ts'>
import CommonHead from '@/components/CommonHead.vue';

const toWeb = () => {
    window.location.href = `${window.location.origin}`;
};
</script>
