<template>
    <div class="h-full flex" id="main">
        <NavIndex />

        <div class="flex-1 w-0 asset_content">
            <MainHeader />

            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import NavIndex from './navs/Index.vue';
import MainHeader from '../components/MainHeader.vue';

</script>
