// 安全能力类型
export const SECURITY_CAPABILITY_TYPE = [
    {
        label: '静态应用安全测试 (SAST)',
        value: 'Static Application Security Testing',
        name: '静态应用安全测试',
        shortName: 'SAST',
    },
    {
        label: '软件成分分析 (SCA)',
        value: 'Software Composition Analysis',
        name: '软件成分分析',
        shortName: 'SCA',
    },
    {
        label: '敏感信息检测 (SD)',
        value: 'Secrets Detection',
        name: '敏感信息检测',
        shortName: 'SD',
    },
    {
        label: '基础设施即代码扫描 (IaC)',
        value: 'Infrastructure as Code Scan',
        name: '基础设施即代码扫描',
        shortName: 'IaC',
    },
    {
        label: '容器镜像安全扫描 (CISS)',
        value: 'Container Image Security Scan',
        name: '容器镜像安全扫描',
        shortName: 'CISS',
    },
    {
        label: '动态应用安全测试 (DAST)',
        value: 'Dynamic Application Security Testing',
        name: '动态应用安全测试',
        shortName: 'DAST',
    },
    {
        label: '交互式应用安全测试 (IAST)',
        value: 'Interactive Application Security Testing',
        name: '交互式应用安全测试',
        shortName: 'IAST',
    },
    {
        label: 'API 安全测试 (API Sec)',
        value: 'API Security Testing',
        name: 'API安全测试',
        shortName: 'API Sec',
    },
    {
        label: '主机入侵检测系统 (HIDS)',
        value: 'Host-based Intrusion Detection System',
        name: '主机入侵检测系统',
        shortName: 'HIDS',
    },
    {
        label: '外部攻击面管理 (EASM)',
        value: 'External Attack Surface Management',
        name: '外部攻击面管理',
        shortName: 'EASM',
    },
    {
        label: 'Web 应用防火墙 (WAF)',
        value: 'Web Application Firewall',
        name: 'Web应用防火墙',
        shortName: 'WAF',
    },
    {
        label: '运行时应用自我保护 (RASP)',
        value: 'Runtime Application Self-Protection',
        name: '运行时应用自我保护',
        shortName: 'RASP',
    },
    {
        label: '漏洞情报 (VI)',
        value: 'Vulnerability Intelligence',
        name: '漏洞情报',
        shortName: 'VI',
    },
];

export const getSecurityCapabilityShortName = (value) => {
    const securityCapability = SECURITY_CAPABILITY_TYPE.find((item) => item.value === value);
    return securityCapability?.shortName || '';
};

export const getSecurityCapabilityName = (value) => {
    const securityCapability = SECURITY_CAPABILITY_TYPE.find((item) => item.value === value);
    return securityCapability?.name || '';
};

export const getSecurityCapabilityLabel = (value) => {
    const securityCapability = SECURITY_CAPABILITY_TYPE.find((item) => item.value === value);
    return securityCapability?.label || '';
};
