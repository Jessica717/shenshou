import axios from 'axios'
// import store from '../store'
// import {
//   setToken
// } from '../store/auth'
// import {
//   MessageBox
// } from 'mint-ui'
// import router from '../router'
// create an axios instance
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/api'
} else {
  baseURL = process.env.BASE_URL
}
const service = axios.create({
  baseURL, // api 的 base_url
  withCredentials: true,
  transformRequest: [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    ret = ret.substring(0, ret.length - 1)
    return ret
  }],
  timeout: 5000 // request timeout
})
// // member[uid]=829926;member[username]=wx_ohocf0Qu-S1Xz0oU4PD4lqspjOd4;member[rank]=1;member[token]=0fbb9640a97e9e7f5b6c6f25bbaee1df_1545453505;member[source]=wxxcx;sessionid=bcs0qko7gmdnq8n1hp4g3gmunr
// // member[uid]=314;member[username]=wx_ohocf0Qu-S1Xz0oU4PD4lqspjOd4;member[rank]=1;member[token]=22faa06a79509ed2f0ca14c6ee35b4e2_1545187809;member[source]=wxxcx;sessionid=6ur7vnhmrhodj754pe4c3q12uk
// member[uid]=829926;member[username]=wx_ohocf0Qu-S1Xz0oU4PD4lqspjOd4;member[rank]=1;member[token]=0e6bda3cdacda8b4677dd94ed7c07ba8_1546823541;member[source]=wxxcx;sessionid=n1ee48ukaahqkgq5f70jobirvh
// setToken('member[uid]', '829926')
// setToken('member[username]', 'wx_ohocf0Qu-S1Xz0oU4PD4lqspjOd4')
// setToken('member[rank]', '1')
// setToken('member[token]', '0e6bda3cdacda8b4677dd94ed7c07ba8_1546823541')
// setToken('member[source]', 'wechatapp')
// setToken('sessionid', 'n1ee48ukaahqkgq5f70jobirvh')
// console.log('取localStorage')
// console.log(storage)
// console.log(storage.getItem('a'))
// console.log(storage.getItem('member[uid]'))
var storage = window.localStorage
console.log(storage.getItem('token'), 'token')

// 封装请求拦截
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // config.headers['Cookie'] = ''
    config.headers['Token'] = storage.getItem('token')
    console.log(config.headers['Token'])
    // if (storage.getItem('token') != null) { // 如果token不为null，否则传token给后台
    //   config.headers['Token'] = storage.getItem('token')
    // } else {
    //   console.log('清空Token')
    //   config.headers['Token'] = ''
    // }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
// respone拦截器 封装响应拦截，判断token是否过期
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    if (response.isSuccess) {
      return response.data
    }
    const res = response.data
    if (res.isSuccess) {
      return response.data
    } else {
      console.log(window.plus)
      if (res.isLogin === false) {
        storage.setItem('isLogin', false)
      }
      // var url = location.href.split('/')
      // if (res.isLogin === false && url[url.length - 1] !== 'member') {
      //   MessageBox({
      //     title: '提示',
      //     message: '您当前未登陆，是否立即前往登陆?',
      //     showCancelButton: true,
      //     closeOnClickModal: false
      //   }).then(config => {
      //     if (config === 'confirm') {
      //       router.push({
      //         path: '/login'
      //       })
      //     }
      //   })
      // }
    }
    return response.data
  },
  error => {
    console.log('err' + error)
    /* AlertModule.show({
      title: '提示',
      content: token
    }) */
    return Promise.reject(error)
  }
)

export default service
