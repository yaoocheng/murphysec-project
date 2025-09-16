<template>
    <div style="height: 100%;">
        <div class="detect_head">
            <div>
                <img :src="$systemConfig.whiteLogo" alt="">
                <span>新建项目检测</span>
            </div>
            <el-button class="cancle_btn hover_btn1" style="width: 80px" v-if="!localStorageUtil('get', 'isGuide')"
                       @click="backHandle">取消</el-button>
        </div>

        <div class="wrap" v-loading="store.loading">
            <div class="list_content">
                <el-tabs v-model="activeTab" @tab-click="tabClickHandle">
                    <AccessTabPane :names="{
                        label: 'GitLab',
                        value: 'gitlab'
                    }">
                        <GitlabTab v-if="activeTab === 'gitlab' && store.allAccessInfo?.gitlab?.length" />
                        <DefaultPage :type="'gitlab'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'GitHub',
                        value: 'github'
                    }">
                        <GithubTab v-if="activeTab === 'github' && store.allAccessInfo?.github?.length" />
                        <DefaultPage :type="'github'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'CODING',
                        value: 'coding'
                    }">
                        <CodingTab v-if="activeTab === 'coding' && store.allAccessInfo?.coding?.length" />
                        <DefaultPage :type="'coding'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: '简单云（代码仓库）',
                        value: 'ezone_code'
                    }">
                        <EzoneCode v-if="activeTab === 'ezone_code' && store.allAccessInfo?.ezone_code?.length" />
                        <DefaultPage :type="'ezone_code'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Bitbucket',
                        value: 'bitbucket'
                    }">
                        <BitbucketTab v-if="activeTab === 'bitbucket' && store.allAccessInfo?.bitbucket?.length" />
                        <DefaultPage :type="'bitbucket'" v-else />
                    </AccessTabPane>

                    <AccessTabPane v-for="item in ideaData" :key="item.svg" :names="{
                        label: item.name,
                        value: item.type,
                        svg: item.svg
                    }">
                        <IdeaTab v-if="activeTab === item.type" :name="item.name" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'CLI',
                        value: 'cli'
                    }">
                        <ClientTab v-if="activeTab === 'cli'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Git',
                        value: 'git'
                    }">
                        <GitTab v-if="activeTab === 'git'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: '文件上传',
                        value: 'upload'
                    }">
                        <UploadTab v-if="activeTab === 'upload'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Eclipse',
                        value: 'eclipse'
                    }">
                        <EclipseTab v-if="activeTab === 'eclipse'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'VSCode',
                        value: 'vscode'
                    }">
                        <VscodeTab v-if="activeTab === 'vscode'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Svn',
                        value: 'svn'
                    }">
                        <SvnTab v-if="activeTab === 'svn'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Jenkins',
                        value: 'jenkins'
                    }">
                        <JenkinsTab v-if="activeTab === 'jenkins'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Docker',
                        value: 'docker'
                    }">
                        <DockerTab v-if="activeTab === 'docker'" />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Harbor',
                        value: 'harbor'
                    }">

                        <HarborTab v-if="activeTab === 'harbor' && store.allAccessInfo?.harbor?.length" />
                        <DefaultPage :type="'harbor'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: '简单云（制品库）',
                        value: 'ezone_package'
                    }">
                        <EzonePackage v-if="activeTab === 'ezone_package' && store.allAccessInfo?.ezone_package?.length" />
                        <DefaultPage :type="'ezone_package'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Nexus',
                        value: 'nexus'
                    }">

                        <NexusTab v-if="activeTab === 'nexus' && store.allAccessInfo?.nexus?.length" />
                        <DefaultPage :type="'nexus'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Jfrog',
                        value: 'jfrog'
                    }">

                        <JfrogTab v-if="activeTab === 'jfrog' && store.allAccessInfo?.jfrog?.length" />
                        <DefaultPage :type="'jfrog'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Amazon ECR',
                        value: 'ecr'
                    }">

                        <EcrTab v-if="activeTab === 'ecr' && store.allAccessInfo?.ecr?.length" />
                        <DefaultPage :type="'ecr'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Gerrit',
                        value: 'gerrit'
                    }">

                        <GerritTab v-if="activeTab === 'gerrit' && store.allAccessInfo?.gerrit?.length" />
                        <DefaultPage :type="'gerrit'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'Folib',
                        value: 'folib'
                    }">
                        <FolibTab v-if="activeTab === 'folib' && store.allAccessInfo?.folib?.length" />
                        <DefaultPage :type="'folib'" v-else />
                    </AccessTabPane>

                    <AccessTabPane :names="{
                        label: 'SBOM清单',
                        value: 'comp'
                    }">

                        <CompTab v-if="activeTab === 'comp'" />
                    </AccessTabPane>

                    <AccessTabPane v-if="store.conf?.upload_binary_diff" :names="{
                        label: '二进制文件对比',
                        value: 'binary'
                    }">

                        <BinaryTab v-if="activeTab === 'binary'" />
                    </AccessTabPane>

                    <AccessTabPane v-if="store.conf?.is_4a" :names="{
                        label: '主机检测（4A）',
                        value: '4a'
                    }">

                        <Host4a v-if="activeTab === '4a'" />
                    </AccessTabPane>

                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store, { detectInfo, createDetectInfo } from 'util/store';
import { localStorageUtil } from 'util/tools';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DefaultPage from './DefaultPage.vue';
import AccessTabPane from './components/AccessTabPane.vue';

// 异步加载detect_type目录下的组件
const createAsyncComponent = (name: string) => defineAsyncComponent({
    loader: () => import(`./detect-type/${name}.vue`),
    loadingComponent: LoadingComponent,
    delay: 100,
});

const IdeaTab = createAsyncComponent('IdeaTab');
const ClientTab = createAsyncComponent('ClientTab');
const GitTab = createAsyncComponent('GitTab');
const UploadTab = createAsyncComponent('UploadTab');
const GitlabTab = createAsyncComponent('GitlabTab');
const EclipseTab = createAsyncComponent('EclipseTab');
const VscodeTab = createAsyncComponent('VscodeTab');
const SvnTab = createAsyncComponent('SvnTab');
const JenkinsTab = createAsyncComponent('JenkinsTab');
const HarborTab = createAsyncComponent('HarborTab');
const DockerTab = createAsyncComponent('DockerTab');
const NexusTab = createAsyncComponent('NexusTab');
const JfrogTab = createAsyncComponent('JfrogTab');
const CompTab = createAsyncComponent('CompTab');
const GerritTab = createAsyncComponent('GerritTab');
const BinaryTab = createAsyncComponent('BinaryTab');
const FolibTab = createAsyncComponent('FolibTab');
const BitbucketTab = createAsyncComponent('BitbucketTab');
const GithubTab = createAsyncComponent('GithubTab');
const Host4a = createAsyncComponent('Host4a');
const CodingTab = createAsyncComponent('CodingTab');
const EcrTab = createAsyncComponent('EcrTab');
const EzonePackage = createAsyncComponent('EzonePackage');
const EzoneCode = createAsyncComponent('EzoneCode');
const route = useRoute();
const router = useRouter();
const activeTab = ref<string>();

// 接入名称
const tabClickHandle = (context: any) => {
    detectInfo.access_type = context.paneName;
    detectInfo.tree_expands_nodes = [];
    router.push(`/detect-main?from=${context.paneName}`);
};

onBeforeMount(() => {
    activeTab.value = route.query.from as string;
    detectInfo.access_type = activeTab.value;
});
const backHandle = () => {
    router.push('/integrate');
    Object.assign(detectInfo, createDetectInfo());
};

const ideaData:any = [
    {
        svg: 1,
        name: 'IntelliJ IDEA',
        type: 'ij',
    },
    {
        svg: 2,
        name: 'PyCharm',
        type: 'pc',
    },
    {
        svg: 3,
        name: 'CLion',
        type: 'cl',
    },
    {
        svg: 4,
        name: 'WebStorm',
        type: 'ws',
    },
    {
        svg: 5,
        name: 'PhpStorm',
        type: 'ps',
    },
    {
        svg: 6,
        name: 'GoLand',
        type: 'go',
    },
    {
        svg: 7,
        name: 'RubyMine',
        type: 'rm',
    },
];
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

.wrap {
    height: calc(100% - 126px);
    overflow: auto;
}

.list_content {
    max-width: 1200px;
    padding-top: 12px;
    margin: 0 auto;
    font-size: 14px;
    box-sizing: border-box;
    padding-bottom: 30px;

    .logo {
        width: 18px;
        vertical-align: -3px;
    }

    .top {
        .between();
        margin-bottom: 16px;
    }
}
</style>
