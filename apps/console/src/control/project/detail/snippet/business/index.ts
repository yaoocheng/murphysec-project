import { reactive, ref, watch } from 'vue';

export const projectFileFilter = (() => ([
    {
        title: '匹配方式',
        checks: [
            {
                name: '文件精准匹配',
                value: false,
                flag: 1,
            },
            {
                name: '代码片段匹配',
                value: false,
                flag: 2,
            },
        ],
    },
    {
        title: '确认状态',
        checks: [
            {
                name: '待确认',
                value: false,
                flag: 3,
            },
            {
                name: '已确认',
                value: false,
                flag: 4,
            },
            {
                name: '已忽略',
                value: false,
                flag: 5,
            },
        ],
    },
    {
        title: '许可证风险等级',
        checks: [
            {
                name: '高',
                value: false,
                flag: 6,
            },
            {
                name: '中',
                value: false,
                flag: 7,
            },
            {
                name: '低',
                value: false,
                flag: 8,
            },
        ],
    },
]));

export const matchWaysOptions = [
    {
        label: '文件匹配',
        value: 'file',
    },
    {
        label: '代码片段',
        value: 'fragmented',
    },
];

export const statusOption = [
    {
        label: '待确认',
        value: 2,
    },
    {
        label: '已确认',
        value: 3,
    },
    {
        label: '已忽略',
        value: 1,
    },
];

export const changeStatusOption = [
    {
        label: '待确认',
        value: 2,
    },
    {
        label: '已确认',
        value: 3,
    },
    {
        label: '已忽略',
        value: 1,
    },
];

export const licenseOption = [
    {
        label: '高',
        value: 4,
        bg: '#F54A4533',
        c: '#F34D3D',
    },
    {
        label: '中',
        value: 3,
        bg: '#FF880033',
        c: 'rgb(255, 153, 64)',
    },
    {
        label: '低',
        value: 2,
        bg: '#1F23291A',
        c: 'rgb(255, 204, 51)',
    },
    {
        label: '无',
        value: 1,
        bg: '#1F23291A',
        c: '#c7c7c7',
    },
];

export const licenseOptionLower = [
    {
        label: '高',
        value: 4,
        bg: '#F34D3D33',
        c: '#D83931',
    },
    {
        label: '中',
        value: 3,
        bg: '#FF880033',
        c: '#DE7802',
    },
    {
        label: '低',
        value: 2,
        bg: '#FFCC3333',
        c: '#DBAF2C',
    },
    {
        label: '无',
        value: 1,
        bg: '#1F23291A',
        c: '#828282',
    },
];

export const UI = ref();

export const fragCodeMatchFileId = ref();

export const ITEM_CODE_HEIGHT = '20px';

export const temporaryStorageSnip = reactive([]); // 购物车数据

watch(temporaryStorageSnip, (val: any[]) => {
    if (val.length > 0) {
        window.onbeforeunload = () => '';
    } else {
        window.onbeforeunload = null;
    }
});

export const loading = ref(false);

export const isShowUseSnipModal = ref(false); // 购物车弹框

export const snippetModal = ref(false);

export const projectItemInfo = ref();

export const midInfo = ref({});

// mid code light
export const midHighLightList = ref([]);

// mid code
export const fileCode = ref('');

// right file list
export const matchFileList = ref([]);

// more match list
export const moreMatchFileList = ref([

]);
