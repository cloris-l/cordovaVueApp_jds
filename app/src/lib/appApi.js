import { Config } from "../config/env.js";
// import fetch from './service'
export default {
    data() {
        return {}
    },
    mounted() {
        // console.log(fetch())
    },
    methods: {
        /*登录 */
        login(data) {
            let params = {
                url: '/login',
                data: data,
            }
            return this.fetch(params);
        },
        /*登录时，获取基本信息 */
        baseDateLoad(data) {
            return this.fetch({ url: 'show/baseDateLoad', data: data })
        },
        /*量费特性-获取历史数据 */
        allEleAndFeeList(data) {
            return this.fetch({ url: 'show/allEleAndFeeList', baseURL: Config.baseUrl3, data: data })
        },
        /*量费特性-获取本月数据 */
        nowElwAndFee(data) {
            return this.fetch({ url: 'show/EleAndFeeListByType', baseURL: Config.baseUrl3, data: data })
        },
        /*明细查询 */
        mdmidDetail(data) {
            return this.fetch({ url: 'show/mdmidDetail', data: data })
        },
        /*修改密码 */
        updatePwd(data) {
            return this.fetch({ url: 'user/updatePwd', baseURL: Config.baseUrl2, data: data })
        },
        /*节能诊断-优化管理 */
        Optimization(data) {
            return this.fetch({ url: 'common/saveUserOptimization', data: data })
        },
        /*明细查询-设备列表 */
        ElementsBySite(data) {
            return this.fetch({ url: 'site/queryAllElementsBySite', baseURL: Config.baseUrl2, data: data })
        },
        /*电能质量-头部信息 */
        eleEnergyData(data) {
            return this.fetch({ url: 'show/queryPowerQuality', data: data })
        },
        /*量费特性-获取计费点 */
        getPackFee(data) {
            return this.fetch({ url: 'bill/getSitedetail', baseURL: Config.baseUrl3, data: data })
        },
        getDiagnose(data) {
            return this.fetch({ url: 'common/getDiagnosisInfo', data: data })
        },
        //告警查询
        findEventList(data) {
            return this.fetch({ url: 'event/findEventList', data: data })
        },
        //获取配电房
        getRoomData(data) {
            return this.fetch({ url: '/common/queryRoomList', data: data })
        },
        //获取app最新版本号
        appVersion(data) {
            return this.fetch({ url: '/version/getLastVersion', baseURL: Config.baseUrl2, data: data })
        },
    }
}