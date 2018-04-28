/**
 * Created by aresn on 16/6/20.
 */
import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import iView from '../src/index';
import locale from '../src/locale/lang/en-US';
// import locale from '../src/locale/lang/zh-CN';

import 'font-awesome-webpack';

Vue.use(VueRouter);
Vue.use(iView, { locale });

// 开启debug模式
Vue.config.debug = true;

// 路由配置
const router = new VueRouter({
    esModule: false,
    routes: [
        {
            path: '/button',
            component: (resolve) => require(['./routers/button.vue'], resolve)
        },{
            path: '/card',
            component: (resolve) => require(['./routers/card.vue'], resolve)
        },{
            path: '/select',
            component: (resolve) => require(['./routers/Select.vue'], resolve)
        },{
            path: '/radio',
            component: (resolve) => require(['./routers/radio.vue'], resolve)
        },{
            path: '/input',
            component: (resolve) => require(['./routers/input.vue'], resolve)
        },{
            path: '/collapse',
            component: (resolve) => require(['./routers/collapse.vue'], resolve)
        },{
            path: '/modal',
            component: (resolve) => require(['./routers/modal.vue'], resolve)
        }
    ]
});

const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app');
