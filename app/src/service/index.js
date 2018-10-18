import axios from "axios";
import { Config } from "../config/env.js";
export default {
  data() {
    return {};
  },
  methods: {
    fetch(options) {
      options = options || {};
      if(options&&options.data&&Storage.get("user")){
        Object.assign(options.data,{
          companyId:Storage.get("user").companyId||null,
          token:(Storage.get("user").token)||null,
          userId:Storage.get("user").userId||null,
        })
      }
      if(options.data&&!options.data.timestamp){
        let timestamp = new Date().getTime()
        Object.assign(options.data,{timestamp:timestamp})
      }
      return new Promise((resolve, reject) => {
        axios({
          url: options.url,
          method: options.method || "post",
          baseURL: options.baseURL || Config.baseUrl,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Expose-Headers": "FooBar",
            "Content-Type": "application/json;charset=UTF-8",
            Accept: "application/json",
            "Access-Control-Expose-Headers": "Authorization"
          },
          //`params`选项是要随请求一起发送的请求参数----一般链接在URL后面
          //他的类型必须是一个纯对象或者是URLSearchParams对象
          params: options.data,
          // //`paramsSerializer`是一个可选的函数，起作用是让参数（params）序列化
          // //例如(https://www.npmjs.com/package/qs,http://api.jquery.com/jquery.param)
          paramsSerializer: function(params) {},
          //`data`选项是作为一个请求体而需要被发送的数据
          //该选项只适用于方法：`put/post/patch`
          //当没有设置`transformRequest`选项时dada必须是以下几种类型之一
          //string/plain/object/ArrayBuffer/ArrayBufferView/URLSearchParams
          //仅仅浏览器：FormData/File/Bold
          //仅node:Stream
          data: options.data,
          //`timeout`选项定义了请求发出的延迟毫秒数
          //如果请求花费的时间超过延迟的时间，那么请求会被终止

          // timeout: options.timeout || 30000,
          // //`withCredentails`选项表明了是否是跨域请求

          withCredentials: true, //default
          //`adapter`适配器选项允许自定义处理请求，这会使得测试变得方便
          //返回一个promise,并提供验证返回
          // adapter: function(config){
          // /*..........*/
          // },
          auth: {
            username: "fruitday",
            password: "fruitday"
          },
          dataType: "json",
          timeout: 20000,
          responseType: "json", //default
          //`xsrfCookieName`是要用作 xsrf 令牌的值的cookie的名称
          xsrfCookieName: "XSRF-TOKEN", //default
          // `xsrfHeaderName`是携带xsrf令牌值的http头的名称
          xsrfHeaderName: "X-XSRF-TOKEN", //default
          //`onUploadProgress`上传进度事件
          onUploadProgress: function(progressEvent) {
            // console.log(progressEvent)
          },
          //下载进度的事件
          onDownloadProgress: function(progressEvent) {
            // console.log(progressEvent)
          },
          //相应内容的最大值
          maxContentLength: 2000,
          //`validateStatus`定义了是否根据http相应状态码，来resolve或者reject promise
          //如果`validateStatus`返回true(或者设置为`null`或者`undefined`),那么promise的状态将会是resolved,否则其状态就是rejected
          validateStatus: function(status) {
            return status >= 200 && status < 300; //default
          },
          // //`maxRedirects`定义了在nodejs中重定向的最大数量
          maxRedirects: 5, //default
          // //`httpAgent/httpsAgent`定义了当发送http/https请求要用到的自定义代理
          // //keeyAlive在选项中没有被默认激活
          // httpAgent: new http.Agent({keeyAlive:true}),
          // httpsAgent: new https.Agent({keeyAlive:true}),
          //proxy定义了主机名字和端口号，
          //`auth`表明http基本认证应该与proxy代理链接，并提供证书
          //这将会设置一个`Proxy-Authorization` header,并且会覆盖掉已经存在的`Proxy-Authorization`  header
          proxy: {
            host: "127.0.0.1",
            port: 9000,
            auth: {
              username: "skda",
              password: "radsd"
            }
          }
        })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
