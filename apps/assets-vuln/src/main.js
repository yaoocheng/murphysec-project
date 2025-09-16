import { createApp } from 'vue';

import VxeTable from 'vxe-table';
import 'vxe-table/lib/style.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import router from './router';

import globalComponents from './components';
import './style/index.less';

const app = createApp(App);

app.use(router);
app.use(globalComponents);
app.use(Antd);
app.use(VxeTable);

app.mount('#app');
