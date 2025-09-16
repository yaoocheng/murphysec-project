import { getRepoTypeApi } from 'api/asset';
import store from 'util/store';
import { ref } from 'vue';

export const accessOptions:any[] = [
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
        label: '简单云（制品库）',
        value: 'ezone_package',
    },
    {
        label: 'SBOM清单',
        value: 'comp',
    },
    {
        label: 'Folib',
        value: 'folib',
    },
];

export const repairOptions:any[] = [
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

export const triggerOptions:any[] = [
    {
        label: '是',
        value: 1,
    },
    {
        label: '否',
        value: 0,
    },
];

export const onlineOptions:any[] = [
    {
        label: '是',
        value: 1,
    },
    {
        label: '否',
        value: 0,
    },
];

export const posionOptions:any[] = [
    {
        label: '是',
        value: true,
    },
    {
        label: '否',
        value: false,
    },
];

export const levelOption:any[] = [
    {
        label: '严重',
        value: 5,
    },
    {
        label: '高危',
        value: 4,
    },
    {
        label: '中危',
        value: 3,
    },
    {
        label: '低危',
        value: 2,
    },
];

export const vulnTags:any[] = [
    {
        label: '投毒',
        value: 'posion',
    },
    {
        label: '独家',
        value: 'sole',
    },
    {
        label: 'RCE',
        value: 'rce',
    },
    {
        label: 'POC',
        value: 'poc',
    },
];

// 生态仓库
export const langOptions = ref();
export const getRepoTypeHandle = async () => {
    try {
        const res = await getRepoTypeApi({
            team_id: store.teamInfo.team_id,
        });
        langOptions.value = res.data.filter((item: any) => item.ecosystem || item.repository).map((ele: any) => {
            let repo: string = '';
            if (ele.ecosystem && ele.repository) {
                repo = `${ele.ecosystem}-${ele.repository}`;
            } else {
                repo = ele.ecosystem || ele.repository;
            }
            return {
                label: repo,
                value: repo,
            };
        });
    } catch (error) {
        console.log(error);
    }
};
getRepoTypeHandle();

export const formatOptions:any[] = [
    {
        label: 'Excel',
        value: 1,
    },
    {
        label: 'Word',
        value: 9,
    },
    {
        label: 'PDF',
        value: 5,
    },
    {
        label: 'Zip',
        value: 6,
    },
    {
        label: 'Csv',
        value: 8,
    },
    {
        label: 'Tag-Value (SPDX)',
        value: 14,
    },
    {
        label: 'RDF (SPDX)',
        value: 11,
    },
    {
        label: 'JSON (SPDX)',
        value: 2,
    },
    {
        label: 'YAML (SPDX)',
        value: 10,
    },
    {
        label: 'JSON (CycloneDX)',
        value: 3,
    },
    {
        label: 'XML (CycloneDX)',
        value: 13,
    },
    {
        label: 'XML (SWID)',
        value: 4,
    },
    {
        label: 'TXT',
        value: 12,
    },
];

export const typeOptions:any[] = [
    {
        label: '资产导出',
        value: 1,
    },
    {
        label: '风险导出',
        value: 2,
    },
    {
        label: 'SBOM导出',
        value: 3,
    },
    {
        label: '报告导出',
        value: 4,
    },
    {
        label: '项目组导出',
        value: 5,
    },
    {
        label: 'Notice文件导出',
        value: 9,
    },
    {
        label: '巡检导出',
        value: 10,
    },
];

export const statusOptions:any[] = [
    {
        value: 1,
        label: '导出中',
    },
    {
        value: 2,
        label: '导出成功',
    },
    {
        value: 3,
        label: '导出失败',
    },
];
