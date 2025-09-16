// 用户来源选项
export const USER_SOURCE_OPTIONS = [
    { label: '全部', value: '' },
    { label: 'LDAP', value: 'ldap-ad' },
    { label: '手动添加', value: 'normal' },
];

// 用户状态选项
export const USER_STATUS_OPTIONS = [
    { label: '全部', value: '' },
    { label: '启用', value: 'open' },
    { label: '禁用', value: 'close' },
];

// 展示类型选项
export const DISPLAY_TYPE_OPTIONS = [
    { label: '展示全部成员', value: '' },
    { label: '仅展示组织的直属成员', value: 'direct' },
];
