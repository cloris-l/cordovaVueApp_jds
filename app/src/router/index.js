import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/login',
            name: 'login',
            components: {
                default: resolve => require(['../pages/login/index.vue'], resolve)
            }
        },
        {
            path: '/deviceSearch',
            name: 'deviceSearch',
            components: {
                default: resolve => require(['../pages/dynamic/deviceSearch.vue'], resolve)
            }
        },
        {
            path: '/',
            name: 'content',
            components: {
                default: resolve => require(['../pages/content/index.vue'], resolve)
            },
            children: [{
                    path: '/',
                    components: {
                        default: resolve => require(['../pages/amountFeeFeatures/index.vue'], resolve)
                    },
                },
                {
                    path: '/amountFF',
                    name: '量费特性',
                    components: {
                        default: resolve => require(['../pages/amountFeeFeatures/index.vue'], resolve)
                    },
                },
                {
                    path: '/dynamic',
                    name: '运行动态',
                    components: {
                        default: resolve => require(['../pages/dynamic/index.vue'], resolve)
                    },
                },
                {
                    path: '/diagnose',
                    name: '节能诊断',
                    components: {
                        default: resolve => require(['../pages/diagnose/index.vue'], resolve)
                    },
                },
                {
                    path: '/eleEnergy',
                    name: '电能质量',
                    components: {
                        default: resolve => require(['../pages/eleEnergy/index.vue'], resolve)
                    },
                },
                {
                    path: '/user',
                    name: '个人中心',
                    components: {
                        default: resolve => require(['../pages/user/index.vue'], resolve)
                    },
                },
                {
                    path: '/user/modifyPw',
                    name: '修改密码',
                    components: {
                        default: resolve => require(['../pages/user/modifyPw.vue'], resolve)
                    },
                },
                {
                    path: '/alarmSearch',
                    name: '告警查询',
                    components: {
                        default: resolve => require(['../pages/alarmSearch/index.vue'], resolve)
                    },
                }
            ]
        },
    ]
})
router.beforeEach((to, form, next) => {
    let time = new Date().getTime() / 1000
    if ((!Storage.get("user") || (Storage.get("user") && !Storage.get("user").userId)) && to.name != 'login') {
        next({ path: '/login' })
    } else {
        Storage.set('loginTime', parseInt(time), true)
        next()
    }
})
export default router