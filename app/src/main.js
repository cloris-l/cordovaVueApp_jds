// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import fetch from './service'
import appApi from './lib/appApi.js'
import dayjs from 'dayjs'
import './lib/rem.js'
import './utils'
import './assets/font/iconfont.css'
require('./lib/vconsole.js')
import './lib/onBackKeyDown'

/*---companents---*/
import './lib/companents'

/*---filter---*/
import './lib/filter'
// import 'babel-polyfill'
Vue.config.productionTip = false
Vue.mixin(fetch)
Vue.mixin(appApi)

import VueCordova from 'vue-cordova';
Vue.use(VueCordova);

Vue.prototype.dayjs = dayjs;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})