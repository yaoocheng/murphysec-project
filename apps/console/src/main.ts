import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/dist/index.css';

import VxeTable from 'vxe-table';
import 'vxe-table/lib/style.css';

import 'highlight.js/lib/common';
import 'highlight.js/styles/github.css';
import hljsVuePlugin from '@highlightjs/vue-plugin';

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

import router from './router/index';
import App from './App.vue';

import './styles/index.less';
import 'ast/icon/iconfont.css';
import 'virtual:svg-icons-register';
import systemConfig from './constants/system-config';
import globalComponents from './components/index';

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

const app = createApp(App);

// 系统配置
app.config.globalProperties.$systemConfig = systemConfig.value;

app.use(VMdPreview);
app.use(router);
app.use(ElementPlus, {
    locale: zhCn,
});
app.use(hljsVuePlugin);
app.use(VxeTable);
app.use(globalComponents);

app.mount('#app');
