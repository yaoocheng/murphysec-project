<template>
    <a-config-provider :locale="zhCN" :theme="THEME" :wave="{ disabled: true }">
        <!-- <template #renderEmpty>
            <div>
                <img class="w-[120px]" src="~assets/img/empty.png" alt="">
                <p class="text-base text-3c font-medium">暂无数据</p>
            </div>
        </template> -->
        <router-view />
    </a-config-provider>
</template>

<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { THEME } from './constants';
</script>
