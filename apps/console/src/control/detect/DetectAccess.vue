<template>
    <div class="detect_head" v-loading.fullscreen="store.loading">
        <div>
            <img :src="$systemConfig.whiteLogo" alt="">
            <span>新增集成</span>
        </div>
        <el-button style="width: 80px" v-if="!localStorageUtil('get', 'isGuide')" class="cancle_btn hover_btn1"
                   @click="backHandle">取消</el-button>
    </div>

    <div class="access_content">
        <div v-for="item in access" :key="item.type">
            <component v-if="$route.query.from === item.type" :is="item.components" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { localStorageUtil } from 'util/tools';
import GitlabTab from './access-type/GitlabTab.vue';
import HarborTab from './access-type/HarborTab.vue';
import JfrogTab from './access-type/JfrogTab.vue';
import NexusTab from './access-type/NexusTab.vue';
import GerritTab from './access-type/GerritTab.vue';
import FolibTab from './access-type/FolibTab.vue';
import GithubTab from './access-type/GithubTab.vue';
import CodingTab from './access-type/CodingTab.vue';
import BitbucketTab from './access-type/BitbucketTab.vue';
import EcrTab from './access-type/EcrTab.vue';
import EzoneCode from './access-type/EzoneCode.vue';
import EzonePackage from './access-type/EzonePackage.vue';

const access: any[] = [
    {
        components: GitlabTab,
        type: 'gitlab',
    },
    {
        components: HarborTab,
        type: 'harbor',
    },
    {
        components: JfrogTab,
        type: 'jfrog',
    }, {
        components: NexusTab,
        type: 'nexus',
    }, {
        components: GerritTab,
        type: 'gerrit',
    }, {
        components: FolibTab,
        type: 'folib',
    }, {
        components: GithubTab,
        type: 'github',
    }, {
        components: CodingTab,
        type: 'coding',
    },
    {
        components: BitbucketTab,
        type: 'bitbucket',
    },
    {
        components: EcrTab,
        type: 'ecr',
    },
    {
        components: EzoneCode,
        type: 'ezone_code',
    },
    {
        components: EzonePackage,
        type: 'ezone_package',
    },
];

const backHandle = () => {
    window.location.href = '/console/integrate';
};
</script>

<style lang='less' scoped>
.detect_head {
    height: 64px;
    padding: 0 24px;
    .between();
    background: linear-gradient(90deg, #6D38FF 0%, #385DFF 100%);
    color: #fff;

    img {
        width: 40px;
        height: 38px;
        margin-right: 15px;
        vertical-align: middle;
    }

    span {
        height: 22px;
        border-left: 1px solid #fff;
        padding-left: 15px;
    }

    .cancle_btn {
        background-color: #385DFF;
        color: #fff;
    }
}

.access_content {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 40px;

    .label {
        font-size: 16px;
    }

    img.logo {
        width: 18px;
        vertical-align: -2px;
    }
}
</style>
