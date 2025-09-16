import { reactive } from 'vue';
import { localStorageUtil } from 'util/tools';

// 用户信息接口
interface UserInfo {
    profession?: string;
    [key: string]: any;
}

// 团队信息接口
interface TeamInfo {
    team_id: string;
    team_name?: string;
    org_id: number;
}

// 环境信息接口
interface EnvInfo {
    env: string | undefined;
    type: string;
}

// 通知配置接口
interface NoticeConfig {
    notice_rule_leak_comp_disable: number;
    notice_rule_leak_comp_high_suggest_low: number;
    notice_rule_leak_comp_num: number;
    notice_rule_license_disable: number;
    notice_rule_license_risk_low: number;
    notice_rule_license_num: number;
    notice_im_robots_disable: number;
    notice_self_email_disable: number;
    notice_self_phone_disable: number;
    notice_api_disable: number;
    notice_other_disable: number;
    notice_api_addr: string;
    notice_api_headers: Array<{ key: string; value: string }>;
    im_robots_addr: Array<{ addr: string }>;
    other_contact: Array<any>;
}

// 全局状态接口
interface GlobalState {
    userInfo: UserInfo;
    teamInfo: TeamInfo;
    envInfo: EnvInfo;
    allAccessInfo: any;
    loading: boolean;
    groupName: string;
    isShowChangePrincipal: boolean;
    isShowTeamMemberModal: boolean;
    isShowShareReportModal: boolean;
    navShrink: boolean;
    securityId: string;
    repoId: string;
    reportShowInfo: any;
    conf: any;
    isLic: boolean;
    pullRequescCompData: Array<any>;
    isDmFix: boolean;
    isShowNewUserGuide: boolean;
    loginType: number;
    isShowFilterConfig: boolean;
    teamList: Array<any>;
    isAllTeam: boolean;
}

// 初始化全局状态
const store = reactive<GlobalState>({
    userInfo: {}, // 用户信息
    teamInfo: localStorageUtil('get', 'g-t') as any, // 当前团队信息
    teamList: [{
        id: '-1',
        team_name: '所有团队',
    }],
    isAllTeam: localStorageUtil('get', 'g-t')?.team_id === '-1', // 是否当前是所有团队
    envInfo: {
        env: process.env.NODE_ENV,
        type: 'private',
    },
    conf: localStorageUtil('get', 'g-conf'),
    isLic: localStorageUtil('get', 'g-conf')?.is_license_setting_with_distribution,
    allAccessInfo: null, // 所有接入方式配置信息
    loading: false, // 全局加载态
    groupName: '', // 用户组名
    navShrink: false, // 导航收缩
    isShowChangePrincipal: false, // 负责人弹框
    isShowTeamMemberModal: false, // 团队成员弹框
    isShowShareReportModal: false, // 分享报告弹框
    securityId: '', // 安全问题id 分享判断安全问题分享或检测详情分享
    repoId: '', // 代码项目id
    reportShowInfo: {}, // 报告需要的信息
    pullRequescCompData: [], // 提交pr组件列表
    isDmFix: false, // 是否dm修复
    isShowNewUserGuide: false, // B端产品介绍
    loginType: 1, // B端登录显示
    isShowFilterConfig: false, // 筛选配置
});

export default store;

// 检测配置基础信息接口
interface BaseDetectConfig {
    team_id: string;
    team_config_id: string;
    access_type: string;
    detect_type: number;
    config_type: string;
    project_config_id: string;
    projects_id: string;
}

// 代码仓库配置接口
interface RepoConfig {
    repos: Array<{
        git_addr: string;
        git_branch: string;
    }>;
    is_fork?: boolean;
    namespace: string[];
    addr: string;
    branch: string;
    project_name: string;
    repository_key: string;
    repository_type: string;
    coding_branch: string;
    gitlab_branch: string;
    gitlab_branch_condition_list: any[];

}

// 组件配置接口
interface ComponentConfig {
    comp_list: string[];
    ecosystem: string;
    format: string;
    upload_file_name: string;
    comp_type: string;
}

// 检测范围配置接口
interface DetectionScopeConfig {
    pull_time_type: string;
    repo_last_active_time_days?: number;
    repo_last_active_time_start: string | null;
    repo_last_active_time_end: string | null;
    repo_languages: string[];
    languages: string[];
    detection_scope_id: string;
}

// 检测选项配置接口
interface DetectionOptionsConfig {
    is_build: boolean;
    is_deep: boolean;
    is_iot_deep: boolean;
    include_archiving_repo: number;
    detector_license_disable: number;
    is_module_binary_analyze: boolean;
    is_autonomous: boolean;
    is_libloom: boolean;
    scan_mode: number;
    cron_type: number;
}

// 匹配配置接口
interface MatchConfig {
    match_min_feature_file_num?: number;
    match_min_projects_ratio?: number;
    match_min_ratio?: number;
}

// 连接配置接口
interface ConnectionConfig {
    jump_host: string;
    jump_port?: number;
    username: string;
    password: string;
    line_rules: string;
    target_list: string[];
}

// 检测配置完整接口
interface DetectConfig extends BaseDetectConfig,
    RepoConfig,
    ComponentConfig,
    DetectionScopeConfig,
    DetectionOptionsConfig,
    NoticeConfig,
    MatchConfig,
    ConnectionConfig {
    nexus_cron_filter: any[];
    crontab_spec: string;
    ecr_repositories: Array<{
        repository_name: string;
        repository_uri: string;
        created_at: string;
        region: string;
        is_public: boolean;
    }>;
    bitbucket_repositories: Array<{
        name: string;
        addr: string;
        branch: string;
        last_activity_at: string;
    }>;
    harbor_repositories: Array<any>;
    strategy_info: string[];
    cmdb_tag: string;
    package_private_id?: string | number;
    project_tag_names: string[];
    cron_expression_detail: {
        unit: string;
        value?: number;
        time: string;
    };
    bitbucket_role: string;
    ecr_region_name: string;
    ecr_is_public_repo: boolean;
    ecr_is_only_least_version: boolean;
    bitbucket_workspace: string,
    tree_expands_nodes: any[],
    harbor_cron_filter: any[],
    harbor_is_only_least_version: boolean,
    repo_format: string,
    repo_type: string,
}

// 创建默认检测配置
export const createDetectInfo = (): DetectConfig => ({
    team_id: localStorageUtil('get', 'g-t')?.team_id,
    team_config_id: '0',
    access_type: '',
    repos: [],
    detect_type: 0,
    is_fork: undefined,
    namespace: [],
    config_type: '',
    project_config_id: '0',
    projects_id: '',
    addr: '',
    branch: '',
    project_name: '',
    comp_list: [],
    format: '',
    repository_key: '',
    upload_file_name: '',
    ecosystem: '',
    pull_time_type: 'default',
    coding_branch: 'default',
    gitlab_branch: 'default',
    gitlab_branch_condition_list: [],
    repo_last_active_time_days: undefined,
    repo_last_active_time_start: null,
    repo_last_active_time_end: null,
    repo_languages: [],
    languages: [],
    is_build: true,
    is_deep: true,
    is_iot_deep: false,
    include_archiving_repo: 1,
    detector_license_disable: 1,
    notice_rule_leak_comp_disable: 1,
    notice_rule_leak_comp_high_suggest_low: 1,
    notice_rule_leak_comp_num: 0,
    notice_rule_license_disable: 2,
    notice_rule_license_risk_low: 1,
    notice_rule_license_num: 0,
    notice_im_robots_disable: 1,
    notice_self_email_disable: 1,
    notice_self_phone_disable: 1,
    notice_api_disable: 1,
    notice_other_disable: 1,
    notice_api_addr: '',
    notice_api_headers: [{ key: '', value: '' }],
    is_module_binary_analyze: false,
    strategy_info: [],
    im_robots_addr: [{ addr: '' }],
    other_contact: [],
    scan_mode: 1,
    cron_type: 2,
    is_autonomous: false,
    is_libloom: false,
    repository_type: '',
    cmdb_tag: '',
    package_private_id: undefined,
    project_tag_names: [],
    cron_expression_detail: { unit: 'week', value: undefined, time: '' },
    jump_host: '',
    jump_port: undefined,
    username: '',
    password: '',
    line_rules: '{%user%}???{%targetIP%}',
    target_list: [],
    comp_type: 'spdx_2.3',
    detection_scope_id: '',
    match_min_feature_file_num: undefined,
    match_min_projects_ratio: undefined,
    match_min_ratio: undefined,
    bitbucket_role: 'member',
    ecr_region_name: '',
    ecr_is_public_repo: false,
    ecr_is_only_least_version: true,
    bitbucket_workspace: '',
    nexus_cron_filter: [],
    harbor_cron_filter: [],
    harbor_is_only_least_version: true,
    crontab_spec: '',
    ecr_repositories: [],
    bitbucket_repositories: [],
    harbor_repositories: [],
    tree_expands_nodes: [], // 定时树默认展开节点
    repo_format: '',
    repo_type: '',
});

// 导出响应式检测配置
export const detectInfo = reactive<DetectConfig>(createDetectInfo());
