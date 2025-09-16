// 已覆盖安全能力来源
export const COVERED_SECURITY_CAPABILITY_SOURCE = [
    {
        label: '手动添加',
        value: 'manual',
    },
    {
        label: '系统识别',
        value: 'automatic',
    },
];

export const findCoverSecCapabilitySource = (value) => COVERED_SECURITY_CAPABILITY_SOURCE.find((item) => item.value === value);
