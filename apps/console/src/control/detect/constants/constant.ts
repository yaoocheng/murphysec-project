import gitlab1 from 'ast/configImg/gitlab1.png';
import gitlab2 from 'ast/configImg/gitlab2.png';
import gitlab3 from 'ast/configImg/gitlab3.png';
import gitlab4 from 'ast/configImg/gitlab4.png';
import gitlab5 from 'ast/configImg/gitlab5.png';
import { ref } from 'vue';
import detectSpeed1 from 'ast/img/detect-speed1.png';
import detectSpeed2 from 'ast/img/detect-speed2.png';
import detectSpeed3 from 'ast/img/detect-speed3.png';
import gitlab from 'ast/logos/gitlab.png';
import git from 'ast/logos/git.png';
import cli from 'ast/logos/cli.png';
import file from 'ast/logos/upload.png';
import eclip from 'ast/logos/eclip.png';
import vscode from 'ast/logos/vscode.png';
import svn from 'ast/logos/svn.png';
import jenkins from 'ast/logos/jenkins.png';
import harbor from 'ast/logos/harbor.png';
import docker from 'ast/logos/docker.png';
import nexus from 'ast/logos/nexus.png';
import jfrog from 'ast/logos/jfrog.png';
import comp from 'ast/logos/comp.png';
import gerrit from 'ast/logos/gerrit.png';
import binary from 'ast/logos/binary.png';
import folib from 'ast/logos/folib.png';
import github from 'ast/logos/github.png';
import host from 'ast/logos/host.png';
import coding from 'ast/logos/coding.png';
import bitbucket from 'ast/logos/bitbucket.png';
import ecr from 'ast/logos/ecr.png';
import ezone from 'ast/logos/ezone.png';

export const langOptions = [
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
        value: 'lua',
        label: 'Lua',
    },
    {
        value: 'Python',
        label: 'Python',
    },
    {
        value: 'Objective-C',
        label: 'Objective-C',
    },
    {
        value: 'Ruby',
        label: 'Ruby',
    },
    {
        value: '.net',
        label: '.Net',
    },
];

export const showImgs = {
    gitlab1: {
        small: gitlab1,
        big: [gitlab1],
    },
    gitlab2: {
        small: gitlab2,
        big: [gitlab2],
    },
    gitlab3: {
        small: gitlab3,
        big: [gitlab3],
    },
    gitlab4: {
        small: gitlab4,
        big: [gitlab4],
    },
    gitlab5: {
        small: gitlab5,
        big: [gitlab5],
    },
};

export const gitlabBranch = [
    {
        label: '默认分支',
        value: 'default',
    },
    {
        label: '最新分支',
        value: 'new',
    },
];

export const formatOptions = [
    {
        value: 'npm',
        label: 'npm',
    },
    {
        value: 'maven',
        label: 'maven',
    },
    {
        value: 'maven2',
        label: 'maven2',
    },
    {
        value: 'docker',
        label: 'docker',
    },
    {
        value: 'pypi',
        label: 'pypi',
    },
    {
        value: 'yum',
        label: 'yum',
    },
];

export const repoTypeOptions = [
    { label: '全部', value: '' },
    {
        label: '本地仓库（Local）',
        value: 'local',
    },
    {
        label: '缓存仓库（Cache）',
        value: 'virtual',
    },
];

export const repoTypeNexusOptions = [
    // { label: '全部', value: '' },
    {
        label: '本地仓库（Hosted）',
        value: 'hosted',
    },
    // {
    //     label: '远程仓库',
    //     value: 'proxy',
    // },
];

export const repoKeysOptions = ref<Array<any>>([]);

export const statusOptions = [
    {
        label: '全部状态',
        value: 0,
    },
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
        label: '检测失败',
        value: -1,
    },
];

export const fileExtBlack = ['aac', 'avi', 'azw', 'bmp', 'bz', 'bz2', 'css', 'csv', 'doc', 'docx', 'epub', 'gz', 'gif', 'heic', 'heif', 'htm', 'html', 'ico', 'ics', 'jar', 'jpeg', 'jpg', 'js', 'json', 'jsonld', 'mid', 'midi', 'mjs', 'mp3', 'mp4', 'mpeg', 'odp', 'ods', 'odt', 'oga', 'ogv', 'opus', 'otf', 'png', 'pdf', 'php', 'ppt', 'pptx', 'rar', 'rtf', 'sh', 'svg', 'swf', 'tar', 'tif', 'tiff', 'ts', 'ttf', 'txt', 'vsd', 'wav', 'weba', 'webm', 'webp', 'woff', 'woff2', 'xhtml', 'xls', 'xlsx', 'xml', 'xul', 'zip', '7z', 'mkv', 'mov', 'msg', 'md', 'tgz', 'py'];

export const configs: Array<any> = [
    {
        name: '标准扫描',
        secondDesc: '全面识别各类型检测对象的混合扫描',
        icon: 'icon-a-CombinedShape',
        num: 1,
        desc: '从项目中全方位扫描源代码、二进制、容器镜像、混合扫描模式。选择后，将尽可能对文件中各种类型的文件进行扫描，来获取最全面的开源组件信息和存在的漏洞，扫描速度略慢。',
        speed: detectSpeed1,
    },
    {
        name: '二进制扫描',
        secondDesc: '仅针对二进制文件的特定扫描',
        icon: 'icon-Vector2',
        num: 3,
        desc: '专门针对二进制文件进行检测，识别二进制文件中的开源组件和存在的漏洞',
        speed: detectSpeed2,
    },
    {
        name: '依赖配置扫描',
        secondDesc: '仅针对源代码的特定扫描',
        icon: 'icon-Union1',
        num: 6,
        desc: '通过分析项目源代码中的依赖配置文件，识别项目中使用的开源组件和存在的漏洞',
        speed: detectSpeed3,
    },
    {
        name: '容器镜像扫描',
        secondDesc: '仅针对容器镜像扫描的特定扫描',
        icon: 'icon-Vector3',
        num: 5,
        desc: '专门针对容器镜像进行检测，识别镜像中的开源组件和存在的漏洞',
        speed: detectSpeed2,
    },
    {
        name: '固件扫描',
        secondDesc: '仅针对固件的特定扫描',
        icon: 'icon-gujian',
        num: 4,
        desc: '专门针对固件文件进行检测，识别固件中的开源组件和存在的漏洞',
        speed: detectSpeed2,
    },
];

export const compRuleOptions: Array<any> = [
    {
        value: 1,
        label: '可选修复及以上组件',
    },
    {
        value: 2,
        label: '建议修复及以上组件',
    },
    {
        value: 3,
        label: '强烈建议修复组件',
    },
];
export const licenseRuleOptions: Array<any> = [
    {
        value: 1,
        label: '低风险及以上许可证数量',
    },
    {
        value: 2,
        label: '中风险及以上许可证数量',
    },
    {
        value: 3,
        label: '高风险许可证数量',
    },
];
export const noticeData: Array<any> = [
    {
        name: '邮箱',
        desc: '通过账号邮箱通知',
        icon: 'icon-youxiangyoujian',
    },
    {
        name: 'API接口',
        desc: '通过配置API接口通知',
        icon: 'icon-jiekou',
    },
    {
        name: '通知其他人',
        desc: '通过邮箱通知',
        icon: 'icon-qita',
    },
];

export const weekOptions = [
    {
        value: 1,
        label: '周一',
    },
    {
        value: 2,
        label: '周二',
    },
    {
        value: 3,
        label: '周三',
    },
    {
        value: 4,
        label: '周四',
    },
    {
        value: 5,
        label: '周五',
    },
    {
        value: 6,
        label: '周六',
    },
    {
        value: 7,
        label: '周天',
    },
];

export const timeOptions = Object.keys(new Array(30).fill(1)).map((item) => ({ label: `${Number(item) + 1}号`, value: Number(item) + 1 }));

export const intergrateData: any = [
    {
        name: '推荐',
        content: [
            {
                img: gitlab,
                name: 'GitLab',
                type: 'gitlab',
            },
            {
                img: github,
                name: 'GitHub',
                type: 'github',
            },
            {
                img: host,
                name: '主机检测（4A）',
                type: '4a',
            },
        ],
    },
    {
        name: '代码编辑工具',
        content: [
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
            {
                img: eclip,
                name: 'Eclipse',
                type: 'eclipse',
            },
            {
                img: vscode,
                name: 'VSCode',
                type: 'vscode',
            },
        ],
    },
    {
        name: '代码管理平台',
        content: [
            {
                img: gitlab,
                name: 'GitLab',
                type: 'gitlab',
            },
            {
                img: github,
                name: 'GitHub',
                type: 'github',
            },
            {
                img: coding,
                name: 'CODING',
                type: 'coding',
            },
            {
                img: gerrit,
                name: 'Gerrit',
                type: 'gerrit',
            },
            {
                img: bitbucket,
                name: 'Bitbucket',
                type: 'bitbucket',
            },
            {
                img: ezone,
                name: '简单云（代码仓库）',
                type: 'ezone_code',
            },
            {
                img: git,
                name: 'Git',
                type: 'git',
            },
            {
                img: svn,
                name: 'Svn',
                type: 'svn',
            },

        ],
    },
    {
        name: 'CI/CD',
        content: [
            {
                img: cli,
                name: 'CLI',
                type: 'cli',
            },
            {
                img: jenkins,
                name: 'Jenkins',
                type: 'jenkins',
            },
        ],
    },
    {
        name: '镜像库',
        content: [
            {
                img: harbor,
                name: 'HarBor',
                type: 'harbor',
            },
            {
                img: docker,
                name: 'Docker',
                type: 'docker',
            },
            {
                img: ecr,
                name: 'Amazon ECR',
                type: 'ecr',
            },
        ],
    },
    {
        name: '制品库',
        content: [
            {
                img: nexus,
                name: 'Nexus',
                type: 'nexus',
            },
            {
                img: jfrog,
                name: 'JFrog',
                type: 'jfrog',
            },
            {
                img: folib,
                name: 'Folib',
                type: 'folib',
            },
            {
                img: ezone,
                name: '简单云（制品库）',
                type: 'ezone_package',
            },
        ],
    },
    {
        name: '其他',
        content: [
            {
                img: file,
                name: '文件上传',
                type: 'upload',
            },
            {
                img: comp,
                name: 'SBOM清单',
                type: 'comp',
            },
            {
                img: binary,
                name: '二进制文件对比',
                type: 'binary',
            },
            {
                img: host,
                name: '主机检测（4A）',
                type: '4a',
            },
        ],
    },
];

export const createGitlabAllBranchOptions = () => [
    {
        type: 'active_branch',
        day_number: undefined,
        keyword: undefined,
        desc: '这种方法可以确保选择的分支是项目近期依然在活跃开发的分支',
        checked: false,
        text: '天内项目活跃过的全部分支',
    },
    // {
    //     type: 'commit_new',
    //     day_number: 0,
    //     keyword: undefined,
    //     desc: '如果项目使用标签或版本号管理，选择最近发布的新版本所在的分支进行扫描',
    //     checked: false,
    //     text: '天内最新一次发布新版本的分支',
    // },
    {
        type: 'commit_keyword_active_branch',
        day_number: undefined,
        keyword: undefined,
        desc: '如果分支名有关键词的特征，可以选择命中关键词的分支进行扫描',
        checked: false,
    },
    {
        type: 'target_branch',
        day_number: undefined,
        keyword: undefined,
        desc: '这种方式可以确保选择的是那些活跃开发的分支，因为这些分支通常包含最新的变更',
        checked: false,
        text: '最近一次进行过合并请求的目标分支（Target Branch）',
    },
    {
        type: 'source_branch',
        day_number: undefined,
        keyword: undefined,
        desc: '这种方式可以确保选择的是那些活跃开发的分支，因为这些分支通常包含最新的变更',
        checked: false,
        text: '最近一次被合并的分支（Source Branch）',
    },
];

export const sensitiveKeywords = [
    'bosch', 'nvidia', 'mediatek', 'qualcomm',
    'orin', 'stm32',
    'ecu', 'mcu', 'esp',
    'emmc',
    'rootfs', 'bootloader',
    'qnx',
    'firmware', 'FW', 'rom',
    '固件', '.bin', '.img', '.rom',
];
