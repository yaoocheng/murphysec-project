import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
import mitt from 'mitt';

export const emitter = mitt();

// 防抖函数
export const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

// loading icon
export const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '32px',
    },
    spin: true,
});

// reset
const excludeProps = ['limit', 'organize_id', 'application_id', 'carrier_id'];
export const resetFilter = (filters) => {
    for (let index = 0; index < Object.keys(filters).length; index++) {
        if (!excludeProps.includes(Object.keys(filters)[index])) {
            filters[Object.keys(filters)[index]] = undefined;
        }
    }
};

export const resizeTableColumn = (w, col) => {
    col.width = w;
};

/**
 * 格式化日期
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '';

    const dat = new Date(date);

    // 检查是否是有效的日期
    if (Number.isNaN(dat.getTime())) {
        return '';
    }

    const year = dat.getFullYear();
    const mon = (dat.getMonth() + 1) < 10 ? `0${dat.getMonth() + 1}` : dat.getMonth() + 1;
    const data = dat.getDate() < 10 ? `0${dat.getDate()}` : dat.getDate();
    const hour = dat.getHours() < 10 ? `0${dat.getHours()}` : dat.getHours();
    const min = dat.getMinutes() < 10 ? `0${dat.getMinutes()}` : dat.getMinutes();
    const sec = dat.getSeconds() < 10 ? `0${dat.getSeconds()}` : dat.getSeconds();

    switch (format) {
        case 'YYYY-MM-DD HH:mm:ss':
            return `${year}-${mon}-${data} ${hour}:${min}:${sec}`;
        case 'YYYY-MM-DD HH:mm':
            return `${year}-${mon}-${data} ${hour}:${min}`;
        case 'YYYY-MM-DD':
            return `${year}-${mon}-${data}`;
        case 'YYYY年MM月DD日':
            return `${year}年${mon}月${data}日`;
        case 'YYYY-MM-DD HH:mm:ss TZ': {
            // 带时区信息的格式
            const offsetMinutes = dat.getTimezoneOffset();
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
            const offsetMins = Math.abs(offsetMinutes) % 60;
            const offsetSign = offsetMinutes <= 0 ? '+' : '-';
            const timezone = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;
            return `${year}-${mon}-${data} ${hour}:${min}:${sec} (UTC${timezone})`;
        }
        case 'relative': {
            // 相对时间格式
            const now = new Date();
            const diff = now - dat;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                return `${days}天前`;
            } if (hours > 0) {
                return `${hours}小时前`;
            } if (minutes > 0) {
                return `${minutes}分钟前`;
            }
            return '刚刚';
        }

        default:
            return `${year}-${mon}-${data} ${hour}:${min}:${sec}`;
    }
}

/**
 * 下载
 */
export const downloadFile = async (api, id) => {
    const { data } = await api(id);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = 'log.txt';
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
};

/**
 * 判断修复等级
 */
export function repaireChangeColor(flag) {
    const colorObj = { color: '#06D7A1', text: '低危' };
    switch (flag) {
        case 'critical':
            colorObj.color = '#D83931';
            colorObj.text = '严重';
            return colorObj;
        case 'high':
            colorObj.color = '#DE7802';
            colorObj.text = '高危';
            return colorObj;
        case 'medium':
            colorObj.color = '#646A73';
            colorObj.text = '中危';
            return colorObj;
        default:
            return colorObj;
    }
}

/**
 * 危险等级判断
 */
export function getDangerLevel(flag) {
    const levelObj = { color: '', text: '-', bgc: '' };
    switch (flag) {
        case 'critical':
            levelObj.color = '#BF1C0D';
            levelObj.text = '严重';
            levelObj.bgc = '#FDE9E7';
            return levelObj;
        case 'high':
            levelObj.color = '#CC5F00';
            levelObj.text = '高危';
            levelObj.bgc = '#FFF1E5';
            return levelObj;
        case 'medium':
            levelObj.color = '#CC9900';
            levelObj.text = '中危';
            levelObj.bgc = '#FFF9E5';
            return levelObj;
        case 'low':
            levelObj.color = '#666666';
            levelObj.text = '低危';
            levelObj.bgc = '#F2F2F2';
            return levelObj;
        default:
            return levelObj;
    }
}
