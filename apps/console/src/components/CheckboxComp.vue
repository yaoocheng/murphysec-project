<template>
    <el-select multiple style="width: 140px; margin-right: 8px;" clearable :collapse-tags="true">
        <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang='ts'>
import {
    onBeforeMount, ref, watch, getCurrentInstance,
} from 'vue';

const globalInfo = getCurrentInstance()?.appContext?.config?.globalProperties;
const props = defineProps(['filterType', 'options']);
const options = ref<Array<any>>(props.options);

onBeforeMount(() => {
    switch (props.filterType) {
        case 'status':
            options.value = [
                {
                    label: '队列中',
                    value: 1,
                },
                {
                    label: '运行中',
                    value: 2,
                },
                {
                    label: '检测成功',
                    value: 3,
                },
                {
                    label: '检测取消',
                    value: 8,
                },
                {
                    label: '检测失败',
                    value: -1,
                },
            ];
            break;
        case 'access':
            options.value = [
                {
                    label: '主机检测（4A）',
                    value: '4a',
                },
                {
                    label: 'GitHub',
                    value: 'github',
                },
                {
                    label: 'GitLab',
                    value: 'gitlab',
                },
                {
                    label: 'CODING',
                    value: 'coding',
                },
                {
                    label: '简单云（代码仓库）',
                    value: 'ezone_code',
                },
                {
                    label: 'GitLab增量',
                    value: 'gitlabwebhook',
                },
                {
                    label: 'IDEA',
                    value: 'idea',
                },
                {
                    label: 'Git',
                    value: 'git',
                },
                {
                    label: 'CLI',
                    value: 'cli',
                },
                {
                    label: '文件上传',
                    value: 'upload',
                },
                {
                    label: '远程文件检测',
                    value: 'remote_url',
                },
                {
                    label: 'Svn',
                    value: 'svn',
                },
                {
                    label: 'Harbor',
                    value: 'harbor',
                },
                {
                    label: 'Docker',
                    value: 'docker',
                },
                {
                    label: 'Nexus',
                    value: 'nexus',
                },
                {
                    label: 'Jfrog',
                    value: 'jfrog',
                },
                {
                    label: 'Amazon ECR',
                    value: 'ecr',
                },
                {
                    label: 'Gerrit',
                    value: 'gerrit',
                },
                {
                    label: 'Bitbucket',
                    value: 'bitbucket',
                },
                {
                    label: 'Folib',
                    value: 'folib',
                },
                {
                    label: '简单云（制品库）',
                    value: 'ezone_package',
                },
                {
                    label: 'SBOM清单',
                    value: 'comp',
                },

            ];
            break;
        case 'suggest':
            options.value = [
                {
                    label: '强烈建议修复',
                    value: 4,
                },
                {
                    label: '建议修复',
                    value: 3,
                },
                {
                    label: '可选修复',
                    value: 2,
                },
            ];
            break;
        case 'fix':
            options.value = !globalInfo?.$systemConfig.isGf ? [
                {
                    label: '关闭',
                    value: 4,
                },
                {
                    label: '7天忽略',
                    value: 3,
                },
                {
                    label: '已修复',
                    value: 2,
                },
                {
                    label: '待修复',
                    value: 1,
                },
            ] : [
                {
                    label: '关闭',
                    value: 4,
                },
                {
                    label: '已修复',
                    value: 2,
                },
                {
                    label: '待修复',
                    value: 1,
                },
            ];
            break;
        case 'lang':
            options.value = [
                {
                    value: 'Go',
                    label: 'Go',
                },
                {
                    value: 'Java',
                    label: 'Java',
                },
                {
                    value: 'JavaScript',
                    label: 'JavaScript',
                },
                {
                    value: 'C/C++',
                    label: 'C/C++',
                },
                {
                    value: 'Python',
                    label: 'Python',
                },
                {
                    value: 'oc',
                    label: 'Objective-C',
                },
                {
                    value: 'ruby',
                    label: 'Ruby',
                },
                {
                    value: 'php',
                    label: 'PHP',
                },
                {
                    value: 'lua',
                    label: 'Lua',
                },
                {
                    value: '.net',
                    label: '.Net',
                },
                {
                    value: 'unknown',
                    label: '未知',
                },
            ];
            break;
        case 'mode':
            options.value = [
                {
                    value: 1,
                    label: '标准扫描',
                },
                {
                    value: 3,
                    label: '二进制扫描',
                },
                {
                    value: 6,
                    label: '依赖配置扫描',
                },
                {
                    value: 5,
                    label: '容器镜像扫描',
                },
                {
                    value: 4,
                    label: '固件扫描',
                },
            ];
            break;
        default:
            options.value = props.options;
            break;
    }
});

watch(props, () => {
    options.value = props.options; // 请求的筛选项
});
</script>

<style lang='less'>
.el-select__placeholder {
    font-weight: 400;
}
</style>
