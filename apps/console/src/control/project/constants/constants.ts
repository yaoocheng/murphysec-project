import { ref } from 'vue';
import { getLicenseListApi } from 'api/project';

/* eslint-disable camelcase */
export const other_label_options = [
    {
        value: '可触发漏洞',
        label: '可触发漏洞',
    },
    {
        value: '线上依赖',
        label: '线上依赖',
    },
    {
        value: '投毒',
        label: '投毒',
    },
    {
        value: '只看有修复方案的缺陷组件',
        label: '只看有修复方案的缺陷组件',
    },
    // {
    //     value: '命中项目策略',
    //     label: '命中项目策略',
    // },
    // {
    //     value: '命中组件策略',
    //     label: '命中组件策略',
    // },
];

export const s_label_options = [
    {
        value: '线上依赖',
        label: '线上依赖',
    },
    // {
    //     value: '命中项目策略',
    //     label: '命中项目策略',
    // },
    // {
    //     value: '命中组件策略',
    //     label: '命中组件策略',
    // },
];

export const sbom_label_options = [
    {
        value: '可触发漏洞',
        label: '可触发漏洞',
    },
    {
        value: '可POC',
        label: '可POC',
    },
    {
        value: '投毒',
        label: '投毒',
    },
    {
        value: '只看有修复方案的漏洞',
        label: '只看有修复方案的漏洞',
    },
];

export const licenseLevelOption = [
    {
        value: 'High',
        label: '高风险',
    },
    {
        value: 'Medium',
        label: '中风险',
    },
    {
        value: 'Low',
        label: '低风险',
    },
    {
        value: 'Safe',
        label: '无风险',
    },
];

export const snipLcenseLevelOption = [
    {
        value: 4,
        label: '高风险',
    },
    {
        value: 3,
        label: '中风险',
    },
    {
        value: 2,
        label: '低风险',
    },
    {
        value: 1,
        label: '无风险',
    },
];

export const compSugOption = [
    {
        value: 4,
        label: '强烈建议修复',
    },
    {
        value: 3,
        label: '建议修复',
    },
    {
        value: 2,
        label: '可选修复',
    },
    {
        value: 1,
        label: '安全',
    },
];

export const vulnLevelOption = [
    {
        value: 'Critical',
        label: '严重',
    },
    {
        value: 'High',
        label: '高危',
    },
    {
        value: 'Medium',
        label: '中危',
    },
    {
        value: 'Low',
        label: '低危',
    },
];

export const mavenInfo: any = {
    mvn_not_found: {
        shortDesc: '【警告】本次检测结果的准确性受限，因检测过程中存在异常导致',
        desc: '【警告】针对 Java 项目的检测，会基于 Maven 工具对项目进行模拟构建以获取准确的检测结果。本次检测未发现 Maven 工具安装在检测环境中，导致检测时无法模拟项目构建过程，从而影响依赖的精确分析。',
        plan: `1. 请确保 Maven 工具已经正确安装在检测环境中，可以访问 Maven 官方网站下载并安装最新版本的 Maven。
2. 安装后，请在命令行中运行 “mvn -version” 来验证安装成功。`,
        level: 'warning',
    },
    mvn_failed: {
        shortDesc: '【警告】本次检测结果的准确性受限，因检测过程中存在异常导致',
        desc: '【警告】针对 Java 项目的检测，会基于 Maven 工具对项目进行模拟构建以获取准确的检测结果。本次检测在执行 Maven 构建命令过程中遇到错误，导致依赖分析任务中断。这可能是由于 Maven 环境配置不正确，项目文件 pom.xml 配置错误，或是项目代码本身存在构建错误问题。',
        plan: `1. 【常见情况】如果项目中使用到企业私有仓库内的组件，请确认是否在平台中正确配置了私有源，否则会出现组件拉取失败的报错。
2. 检查项目的 pom.xml 文件，确认所有依赖项已正确声明且无语法错误。
3. 在项目根目录下，尝试手动执行 “mvn clean install” 命令，观察是否有错误信息输出。根据提供的错误信息，修复具体问题（如依赖冲突、缺少插件等）。`,
        level: 'warning',
    },
    auto_build_error: {
        shortDesc: '【警告】本次检测结果的准确性受限，可能是检测过程中因网络、环境等原因导致',
        desc: '【警告】本次检测结果的准确性受限，可能是检测过程中因网络异常或环境异常等原因导致',
        plan: `1. 确认当前检测环境是否存在网络受限。
2. 可尝试使用客户端或流水线在构建环境中进行检测。`,
        level: 'warning',
    },
    build_disabled: {
        shortDesc: '【提示】本次检测结果的准确性受限，因检测未开启“编译/构建”选项导致',
        desc: '【提示】针对 Java 项目的检测，可以基于 Maven 工具对项目进行模拟构建，从而获取准确的检测结果。本次检测在配置时未启用“编译/构建”功能，针对 Java 项目的检测使用了备用方案，因此检测结果可能不完全准确。',
        plan: `1. 如果通过页面发起检测任务，可以在检测配置中打开“编译/构建”开关并重新检测。
2. 如果通过 API 发起检测任务，可以设置 “is_build” 参数为 true。`,
        level: 'notice',
    },
    mvn_timeout_killed: {
        shortDesc: '【警告】本次检测结果的准确性受限，因检测过程中存在网络环境异常导致',
        desc: '【警告】针对 Java 项目的检测，会基于 Maven 工具对项目进行模拟构建以获取准确的检测结果。本次检测在执行 Maven 构建命令过程中存在网络环境异常，导致依赖分析任务中断。这可能是由于当前检测环境无法访问公共或配置的私有源地址。',
        plan: `1. 确认当前检测环境是否存在网络受限。
2. 如果项目中使用到企业私有仓库内的组件，请确认是否在平台中正确配置了私有源。
3. 如果项目使用的是公共仓库，请确认检测环境与公共仓库的网络连通是否正常。`,
        level: 'warning',
    },
};

export const getFixOptions = (isGf: boolean) => (isGf ? [
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
] : [
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
]);

export const suggestOptions = [
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
export const relyOptions = [
    {
        label: '直接依赖',
        value: true,
    },
    {
        label: '间接依赖',
        value: false,
    },
    {
        label: '自身依赖',
        value: 1,
    },
];

export const source_option = [
    {
        label: '校准',
        value: 'Adjusted',
    },
    {
        label: '精准',
        value: 'Accuracy',
    },
    {
        label: '模糊',
        value: 'Inaccuracy',
    },

];

export const tagOptions = [
    {
        label: '标记为安全组件',
        value: 'safe',
    },
    {
        label: '标记为缺陷组件',
        value: 'defect',
    },
    {
        label: '打标签',
        value: 'mark',
    },
];

export const compUse: any = {
    source_code: '源代码',
    static_linked: '静态链接',
    dynamic_linked: '动态链接',
    separate_work: '单独工作',
    merely_aggregated: '仅汇总',
    implementation_of_standard: '实施标准',
    prerequisite: '先决条件',
    dev_tool_or_excluded: '开发工具/已排除',
    unspecified: '未指定',
};

export const licenseOptions = ref<any[]>([]);

/** 许可证选项接口定义 */
interface LicenseOption {
    label: string;
    value: string;
}

/**
 * 获取许可证列表
 * @param tid - 项目ID
 * @param sid - 子任务ID
 * @description 从API获取许可证列表并转换为选项格式，包含未声明许可证选项
 */
export const getLicenseList = async (tid: string, sid: string): Promise<void> => {
    try {
        const res = await getLicenseListApi({
            project_id: tid,
            subtask_id: sid,
        });

        if (!res.data) {
            licenseOptions.value = [];
            return;
        }

        const mappedOptions: LicenseOption[] = res.data.map((item: string) => ({
            label: item,
            value: item,
        }));

        // 添加未声明许可证选项
        mappedOptions.push({
            label: '未声明许可证',
            value: '',
        });

        licenseOptions.value = mappedOptions;
    } catch (error) {
        console.error('获取许可证列表失败:', error);
        licenseOptions.value = [];
    }
};

export const USEMAP: any = {
    source_code: '源代码',
    static_linked: '静态链接',
    dynamic_linked: '动态链接',
    separate_work: '单独工作',
    merely_aggregated: '仅汇总',
    implementation_of_standard: '实施标准',
    prerequisite: '先决条件',
    dev_tool_or_excluded: '开发工具/已排除',
    unspecified: '未指定',
};

export const USEOP = [
    {
        label: '源代码',
        value: 'source_code',
    },
    {
        label: '静态链接',
        value: 'static_linked',
    },
    {
        label: '动态链接',
        value: 'dynamic_linked',
    },
    {
        label: '单独工作',
        value: 'separate_work',
    },
    {
        label: '仅汇总',
        value: 'merely_aggregated',
    },
    {
        label: '实施标准',
        value: 'implementation_of_standard',
    },
    {
        label: '先决条件',
        value: 'prerequisite',
    },
    {
        label: '开发工具/已排除',
        value: 'dev_tool_or_excluded',
    },
    {
        label: '未指定',
        value: 'unspecified',
    },
];

export const distributeOp: any = [
    {
        label: '外部',
        value: 'external',
    },
    {
        label: '内部',
        value: 'internal',
    },
    {
        label: 'SaaS',
        value: 'saas',
    },
    {
        label: '开源',
        value: 'open_source',
    },
];

export const licenseCopyrightLevel:any = {
    targets_not_license: {
        showType: 'license',
        riskTitle: '第三方代码许可证声明缺失风险',
        riskLevel: '高',
        riskColor: '#F34D3D',
        riskDescription: '系统检测到项目中包含第三方开源代码，但在对应文件未发现原始许可证声明。主流开源许可证要求在复制、修改或分发代码时随附完整且未经修改的许可证文本；声明缺失将使项目违反原始许可条款，进而带来法律责任与合规审查风险。',
        // riskItems: [
        //     '法律风险：丧失组件的合法使用权利，面临侵权索赔或被强制开源衍生作品',
        //     '供应链风险：无法追溯组件来源及版本，影响漏洞修复和版本维护',
        //     '分发风险：若产品包含此类组件并对外分发，可能触发法律纠纷或商业合作终止条款',
        // ],
        solutions: [
            {
                title: '定位风险文件及原始许可信息',
                steps: [
                    '请仔细查看"风险文件"列表，这些文件是系统中检测到缺失许可证声明的项目代码文件。',
                    '同时，请关注右侧"匹配开源文件"区域，这里通常会展示该第三方代码原始的许可证声明内容。',
                ],
            },
            {
                title: '获取完整的原始许可证声明文本',
                steps: [
                    '如果"匹配开源文件"区域未能完整展示您需要复制到项目文件中的许可证声明全文，或者您想确认最准确的声明格式，请访问该第三方代码的官方来源（如其代码仓库的特定文件、项目主页等）。',
                    '查找并复制原始代码中位于文件头部的许可证声明注释，或者该许可证要求的标准声明文本。',
                ],
            },
            {
                title: '在受影响的项目代码文件中添加/恢复许可证声明',
                steps: [
                    '操作方式：打开每一个被标记为"风险文件"的项目代码文件。',
                    '具体做法：请将您获取到的原始许可证声明文本（通常是多行注释，包含版权信息、许可证名称、许可证正文或指向正文的链接等）直接添加到该项目文件的文件头部。确保声明清晰、完整，并符合原始许可证的要求。',
                ],
            },
        ],
    },
    targets_sources_license_mismatched: {
        showType: 'license',
        riskTitle: '与第三方代码许可证声明不一致风险',
        riskLevel: '高',
        riskColor: '#F34D3D',
        riskDescription: '系统检测到项目中包含第三方开源代码，其在项目文件中声明的许可证与该代码的原始许可证存在不一致。主流开源许可证要求在复制、修改或分发代码时随附完整且未经修改的许可证文本；此种不一致可能会使项目违反原始许可条款，进而带来法律责任与合规审查风险。',
        // riskItems: [
        //     '法律侵权：违反许可证义务（如未保留声明、未开源衍生代码），面临诉讼或赔偿',
        //     '供应链失效：依赖链断裂（如社区禁止违规使用组件）',
        //     '商业损失：产品分发受限或合作方终止合同',
        // ],
        solutions: [
            {
                title: '定位风险文件及原始许可信息',
                steps: [
                    '请仔细查看"风险文件"列表，这些文件是系统中检测到其内部声明的许可证与所含三方代码原始许可不一致的项目代码文件。',
                    '同时，请关注右侧"匹配开源文件"区域，这里通常会展示该第三方代码原始的许可证类型及其声明内容，供您对比和参考。',
                ],
            },
            {
                title: '获取并确认权威的原始许可证声明文本',
                steps: [
                    '如果"匹配开源文件"区域未能完整展示您需要参照的原始许可证声明全文，或者您想最终确认最准确的原始许可证条款和声明格式，请访问该第三方代码的官方来源（如其代码仓库的特定文件、项目主页等）。',
                    '查找并确认该第三方代码原始的、官方的许可证声明文本或SPDX标识符，这将是您修正项目文件声明的依据。',
                ],
            },
            {
                title: '在受影响的项目代码文件中修正不一致的许可证声明',
                steps: [
                    '操作方式：打开每一个被标记为"风险文件"的项目代码文件。',
                    '具体做法：请将您在项目文件头部（或其他位置）声明的、与原始许可不一致的许可证信息，修改为与该文件所含第三方代码的原始许可证完全一致的声明文本或正确的SPDX许可证标识符。确保修正后的声明清晰、完整，并严格符合原始许可证的要求。',
                ],
            },
        ],
    },
    // targets_sources_copyright_mismatched: {
    //     showType: 'copyright',

    //     riskTitle: '三方开源代码原始版权信息被篡改',
    //     riskLevel: '高',
    //     riskColor: '#F34D3D',
    //     riskScene: '对比三方代码原始数据，版权信息不一致，被篡改',
    //     riskDescription: '开源组件的原始版权声明（如源码头部注释、AUTHORS文件）被修改，导致：',
    //     riskItems: [
    //         '法律侵权：违反许可证的署名要求（如MIT/BSD要求保留版权声明），构成著作权侵权',
    //         '供应链信任危机：社区或合作方质疑代码来源合法性，引发供应链禁运风险',
    //         '合规失效：破坏许可证有效性（如Apache-2.0要求保留版权和NOTICE文件），失去合规使用基础',
    //     ],
    //     solutions: [
    //         {
    //             title: '恢复原始版权信息',
    //             steps: [
    //                 '从组件官方仓库或历史版本中提取原始版权声明（如Copyright (c) 2022 Author）',
    //                 '若源码头部声明被删除，参考官方Release版本还原注释（如Git Tag对应版本）',
    //             ],
    //         },
    //         {
    //             title: '完整性验证',
    //             steps: [
    //                 '使用哈希值校验文件一致性（优先校验含版权声明的文件）',
    //                 '检查Git历史记录，定位篡改提交',
    //             ],
    //         },
    //         {
    //             title: '处置验证',
    //             steps: [
    //                 '处置后在本平台重新扫描项目，若已处置则该风险文件不存在',
    //             ],
    //         },
    //     ],
    // },
    targets_not_copyright: {
        riskTitle: '第三方代码版权声明缺失风险',
        showType: 'copyright',
        riskLevel: '高',
        riskColor: '#F34D3D',
        riskDescription: '系统检测到项目中包含第三方开源代码，但在对应文件未发现原始版权声明。多数软件许可证及版权法通常要求，在复制、修改或分发代码时保留清晰的版权归属信息；版权声明缺失可能导致对原作者权利的侵犯、项目归属不清，进而带来法律纠纷与合规审查风险。',
        // riskItems: [
        //     '法律侵权：违反许可证的署名权条款（如MIT/BSD/Apache均明确要求保留版权声明），构成著作权侵权',
        //     '供应链信任崩塌：开源社区或原开发者可能禁止后续使用，导致依赖链断裂',
        //     '合规性失效：破坏许可证有效性，项目失去合规使用基础，可能被迫停止分发',
        // ],
        solutions: [
            {
                title: '定位风险文件及原始版权信息',
                steps: [
                    '请仔细查看"风险文件"列表，这些文件是系统中检测到缺失版权声明的项目代码文件。',
                    '同时，请关注右侧"匹配开源文件"区域，这里通常会展示该第三方代码原始的版权声明内容。',
                ],
            },
            {
                title: '获取完整的原始版权声明文本',
                steps: [
                    '如果"匹配开源文件"区域未能完整展示您需要复制到项目文件中的版权声明全文，或者您想确认最准确的声明格式，请访问该第三方代码的官方来源（如其代码仓库的特定文件、项目主页、或包含版权信息的文件如 NOTICE、COPYRIGHT 等）。',
                    '查找并复制原始代码中位于文件头部的版权声明注释，或者该版权持有人要求的标准声明文本。',
                ],
            },
            {
                title: '在受影响的项目代码文件中添加/恢复版权声明',
                steps: [
                    '操作方式：打开每一个被标记为"风险文件"的项目代码文件。',
                    '具体做法：请将您获取到的原始版权声明文本（通常是包含版权符号©、年份、版权持有人等信息的注释）直接添加到该项目文件的文件头部。确保声明清晰、完整，并准确反映原始第三方代码的版权归属。',
                ],
            },
        ],
    },
    sources_not_copyright: {
        riskTitle: '自研代码版权声明缺失风险',
        showType: 'copyright',
        riskLevel: '低',
        riskColor: '#FFCC33',
        riskDescription: '系统检测到项目中部分自研代码文件未包含明确的版权声明。明确和声明代码的版权归属是保护知识产权、明晰责任和规范管理的基础实践；虽然此风险通常低于第三方代码相关风险，但版权声明缺失仍可能导致项目知识产权归属不清晰、增加潜在的权益纠纷可能，并影响代码的规范化管理。',
        // riskItems: [
        //     '权属争议：无法证明代码所有权，在合作、并购或诉讼中处于被动地位',
        //     '商业风险：合作伙伴或客户质疑代码合法性，影响合同签署或融资进程',
        //     '开源隐患：若未来需开源自研代码，缺失版权声明可能违反社区规范（如Apache-2.0要求明确版权）',
        // ],
        solutions: [
            {
                title: '定位风险文件',
                steps: [
                    '请仔细查看"风险文件"列表，这些文件是系统中检测到缺失版权声明的自研代码文件。',
                    '对于自研代码，版权通常归属于开发该软件的组织或个人。',
                ],
            },
            {
                title: '确定标准的版权声明文本',
                steps: [
                    '根据当前组织/公司的政策或行业标准实践，确定适用于自研代码的标准版权声明格式。',
                    '该声明通常包含：版权符号："©" 或 "(c)"、是首次发布年份（或年份范围，例如 "2020-2024"）、版权持有人。',
                    '示例："Copyright (c) 2024 Your Company Name. All rights reserved. "(请根据实际情况替换年份和公司名称)',
                ],
            },
            {
                title: '在受影响的自研代码文件中添加版权声明',
                steps: [
                    '操作方式：打开每一个被标记为"风险文件"的自研代码文件。',
                    '具体做法：请将确定好的标准版权声明文本（通常是一行或多行注释）直接添加到该项目文件的文件头部。确保声明清晰、准确地标识出版权归属。',
                ],
            },
        ],
    },
    // sources_copyright_nonstandard: {
    //     riskTitle: '自研代码中版权声明不规范',
    //     showType: 'copyright',

    //     riskLevel: '低',
    //     riskColor: '#FFCC33',
    //     riskScene: '自研代码中，版权存在但不规范',
    //     riskDescription: '自研代码的版权声明存在格式混乱、信息缺失或错误，例如：',
    //     riskItems: [
    //         '法律模糊性：声明未标注年份、公司全称或使用非标准表述（如(C)代替(c)），导致知识产权主张效力减弱',
    //         '合作信任风险：潜在投资者或客户因声明不规范质疑代码所有权合法性',
    //         '开源阻碍：若未来需开源代码，不符合SPDX等社区规范（如缺少SPDX-License-Identifier），导致开源流程失败',
    //     ],
    //     solutions: [
    //         {
    //             title: '统一声明格式',
    //             steps: [
    //                 '内部代码管理政策应明确声明格式、位置及更新规则',
    //                 '可通过Git历史确认首次提交年份，补全年份范围',
    //             ],
    //         },
    //         {
    //             title: '处置验证',
    //             steps: [
    //                 '处置后在本平台重新扫描项目，若已处置则该风险文件不存在',
    //             ],
    //         },
    //     ],
    // },
};
