import { reactive, computed } from 'vue';
import dayjs from 'dayjs';

export const filters = reactive({
    page: 0,
    limit: 15,
    severity: null,
    analysis_status: null,
    type: null,
    title: null,
    mps_id: null,
    // 添加缺少的字段
    attack_vector: null,
    disposal_priority: null,
    is_poc: null,
    release_time: null,
    release_time_start: computed(() => (filters.release_time?.[0] ? dayjs(filters.release_time[0]).startOf('day').toDate() : undefined)),
    release_time_end: computed(() => (filters.release_time?.[1] ? dayjs(filters.release_time[1]).endOf('day').toDate() : undefined)),
    update_time: null,
    update_time_start: computed(() => (filters.update_time?.[0] ? dayjs(filters.update_time[0]).startOf('day').toDate() : undefined)),
    update_time_end: computed(() => (filters.update_time?.[1] ? dayjs(filters.update_time[1]).endOf('day').toDate() : undefined)),
});

// 已选择的筛选条件
export const selectedFilters = reactive([
    { filterkey: 'severity', oldfilterkey: '', flitervalue: null },
    { filterkey: 'disposal_priority', oldfilterkey: '', flitervalue: null },
    { filterkey: 'type', oldfilterkey: '', flitervalue: null },
    { filterkey: 'analysis_status', oldfilterkey: '', flitervalue: null },
    { filterkey: 'is_poc', oldfilterkey: '', flitervalue: null },
]);
