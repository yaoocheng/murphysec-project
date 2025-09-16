<template>
    <div class="control_index" v-loading.fullscreen="store.loading"
         element-loading-background="rgba(255, 255, 255, 0.8)">
        <div class="control_navs_frame" :class="{ 'shrink_nav': store.navShrink }">
            <div>
                <img class="shrink" @click="(store.navShrink = !store.navShrink)"
                     :class="{ 'shrink_active': store.navShrink }" src="~ast/img/back.png" alt="">

                <div class="top">
                    <div class="logo_wrap">
                        <img class="small_logo" :class="{ 'shrink_logo_active': store.navShrink }" @click="toWeb"
                             :src="$systemConfig.mainLogo" alt="">
                        <CommonChange />
                    </div>

                    <div>
                        <!-- 主导航 -->
                        <MainNavs v-if="route.meta.navType === 1" />
                        <!-- 个人主页导航 -->
                        <UserNavs v-if="route.meta.navType === 2" />
                        <!-- 组织导航 -->
                        <OrgNavs v-if="route.meta.navType === 3" />
                    </div>
                </div>
            </div>

        </div>

        <!-- 分享项目检测报告 -->
        <ShareReportModal v-model="store.isShowShareReportModal" v-if="store.isShowShareReportModal" />

        <div class="control_content_frame">
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import store from 'util/store';
import { consoleDanme } from 'utils';
import MainNavs from './navs/MainNavs.vue';
import UserNavs from './navs/UserNavs.vue';
import OrgNavs from './navs/OrgNavs.vue';
import CommonChange from './navs/CommonChange.vue';
import ShareReportModal from '@/control/share/ShareReportModal.vue';

const route = useRoute();

consoleDanme();

const toWeb = () => {
    window.location.href = `${window.location.origin}`;
};

</script>

<style lang="less" scoped>
.control_index {
    height: 100%;
    width: 100%;

    .logo_wrap {
        display: flex;
        align-items: center;
        padding-left: 14px;
        margin-bottom: 20px;

        img {
            width: 32px;
            height: 32px;
        }

        .shrink_logo_active {
            transform: translateX(-20%);
        }
    }

    .control_navs_frame {
        &:hover .shrink {
            opacity: 1;
        }

        width: 220px;
        height: 100%;
        padding: 28px 8px 10px 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        float: left;
        position: relative;
        background: linear-gradient(160.07deg, #FEF7FF 0%, #FFFFFF 43.23%, #FFFFFF 61.46%, #F7F9FF 100%);
        box-shadow: 0px 0px 12px rgba(166, 174, 214, 0.5);
        border-radius: 0px 16px 16px 0px;

        .shrink {
            width: 32px;
            position: absolute;
            right: -12px;
            top: 135px;
            z-index: 99;
            opacity: 0;
            transition: opacity .2s;
            cursor: pointer;
        }

        .shrink_active {
            transform: rotate(180deg);
        }

        .small_logo {
            // width: 32px;
            // margin-right: 10px;
            cursor: pointer;
        }

        .free {
            display: inline-block;
            background: linear-gradient(90deg, #596599 0%, #051766 100%);
            border-radius: 0px 6px;
            font-size: 12px;
            color: #fff;
            padding: 2px 4px;
            transform: scale(0.8);
            width: 40px;
            height: 18px;
            line-height: 18px;
        }
    }

    .hide-nav {
        display: none;
    }

    .shrink_nav {
        width: 64px;
    }

    .control_content_frame {
        overflow: hidden;
        height: 100%;
    }

}
</style>
