// 合同识别状态
export const COMPONENT_CONTRACT_OCR_STATUS = [
    {
        label: '队列中',
        value: 'pending',
    },
    {
        label: '进行中',
        value: 'running',
    },
    {
        label: '已完成',
        value: 'completed',
    },
    {
        label: '已失败',
        value: 'failed',
    },
];

export const findComponentContractOcrStatusLabel = (value) => COMPONENT_CONTRACT_OCR_STATUS.find((item) => item.value === value)?.label || '-';
