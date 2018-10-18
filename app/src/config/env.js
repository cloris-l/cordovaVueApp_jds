/**
 * 配置编译环境和线上环境之间的切换
 *
 */
let Config = {
        baseUrl: '', //接口url
        imgBaseUrl: '', //图片url
    }
    // process.env.NODE_ENV == 'development'
if (process.env.NODE_ENV == 'development') { //开发环境
    // Config.baseUrl = 'http://192.168.1.157:8080/platform/'
    // Config.baseUrl2 = 'http://192.168.1.157:8080/company'
    // Config.baseUrl3 = 'http://192.168.1.155:8090/electricPlatform/'
    Config.baseUrl = 'http://192.168.1.157:8080/platform/'
    Config.baseUrl2 = 'http://192.168.1.157:8080/company'
    Config.baseUrl3 = 'http://192.168.1.157:8080/electricPlatform/'
        // Config.baseUrl = 'https://enesource.app.envisioniot.com/platform/'
        // Config.baseUrl2 = 'https://enesource.app.envisioniot.com/company'
        // Config.baseUrl3 = 'https://enesource.app.envisioniot.com/electricPlatform/'
    Config.imgBaseUrl = ''
} else if (process.env.NODE_ENV == 'test') {
    Config.baseUrl = 'http://192.168.1.157:8080/platform/'
    Config.baseUrl2 = 'http://192.168.1.157:8080/company'
    Config.baseUrl3 = 'http://192.168.1.157:8080/electricPlatform/'

    Config.imgBaseUrl = ''
} else if (process.env.NODE_ENV == 'release') {
    Config.baseUrl = 'https://enesource.app.envisioniot.com/platform/'
    Config.baseUrl2 = 'https://enesource.app.envisioniot.com/company'
    Config.baseUrl3 = 'https://enesource.app.envisioniot.com/electricPlatform/'
}
export {
    Config
}