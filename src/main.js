// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*eslint-disable*/
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './store'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/styles/index.css'
import '@/styles/public.css'
import '@/styles/iconfont.css'
import FastClick from 'fastclick'
import '../static/js/flexible.js'
// import {
//   wxConfig
// } from '@/api/index'
// import {
//   setToken,
//   getToken
// } from '@/store/auth'
// import { Message } from 'element-ui'
// import wx from 'weixin-js-sdk'
Vue.prototype.HOST = '/api'
import {
  Cell,
  Checklist,
  Navbar,
  TabItem
} from 'mint-ui';

import Vconsole from 'vconsole'
if (process.env.NODE_ENV != 'development') {
  let vConsole = new Vconsole()
}
Vue.component(Cell.name, Cell);
Vue.component(Checklist.name, Checklist);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
// 顶部导航栏
import LyTab from '@/components/LyTab/index'
Vue.component('LyTab', LyTab)
// 返回顶部组件 
import returnTop from '@/components/return-top'
Vue.component('returnTop', returnTop)

// import base from './base'
// Vue.use(base)
console.log(process.env.BASE_URL)
var storage = window.localStorage
storage.setItem('leaveIndex', false)


/**
 *监听浏览器点击返回前进操作动画
 *浏览器端使用需要注意路由path的创建，二级应该在一级的基础上添加
 *如一级/Home，则二级为/Home/Detail，依次往后加，如果是app的话可忽略以下代码
 */
let init = 0
window.addEventListener('popstate', function (e) {
  init++
  if (init < 2) {
    router.beforeEach((to, from, next) => {
      console.log(to)
      let arr1 = to.path.split('/')
      let arr2 = from.path.split('/')
      if (arr1.length === 2) {
        if (arr1[1].length === 0) {
          arr1.splice(1, 1)
        }
      }
      if (arr2.length === 2) {
        if (arr2[1].length === 0) {
          arr2.splice(1, 1)
        }
      }
      if (arr1.length < arr2.length) {
        router.togoback()
      } else {
        router.togoin()
      }
      next()
    })
  }
}, false)
let whiteRouter = ['/login', '/other', '/set', '/index', '/find', '/type', '/car', '/proList', '/flash', '/try', '/group', '/lottery', '/mySignIn', '/proDetail', '/tryDetail','/scanCode','/groupResult','/vipBirthday']
let whiteLogin = ['/login', '/index', '/find', '/member', '/proList', '/findDetail', '/flash', '/try', '/group', '/type', '/other', '/set','/lottery','/scanCode','/groupResult']

router.beforeEach((to, from, next) => {
  // console.log(to.path)
  setTimeout(function () {
    if (whiteRouter.indexOf(to.path) !== -1) {
      console.log('白色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#f9f9f9')
        window.plus.navigator.setStatusBarStyle('dark')
      }
    } else {
      console.log('红色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#ff8d97')
        window.plus.navigator.setStatusBarStyle('light')
      }
    }
    if (whiteLogin.indexOf(to.path) == -1 && (storage.getItem('isLogin') === 'false'||storage.getItem('isLogin') === false)) {
      window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
        if (e.index === 0 || e.index === '0') {
          router.push({
            path: '/login'
          })
        } else {
          router.go(-1)
        }
      }, {
        'title': '提示',
        'buttons': ['确定', '取消'],
        'verticalAlign': 'center'
      })
    }
  }, 100)

  next()
})


// document.addEventListener('plusready', function () {
//   // app 修改状态栏颜色
//   let System = window.plus.os.name
//   console.log(System)
//   if (System === 'iOS') {
//     window.plus.navigator.setStatusBarBackground('#d81e06')
//   }
// })

if (window.plus) {
  console.log('校验通过是app')
  plusReady();
} else {
  document.addEventListener('plusready', plusReady, false)
}

function plusReady() {
  console.log(plus.navigator.getStatusBarBackground())
  // Android处理返回键
  plus.key.addEventListener('backbutton', function () {
    ('iOS' == plus.os.name) ? plus.nativeUI.confirm('确认退出？', function (e) {
      if (e.index > 0) {
        plus.runtime.quit();
      }
    }, 'HelloH5', ['取消', '确定']): (confirm('确认退出？') && plus.runtime.quit());
  }, false);
  // 关闭启动界面
  plus.navigator.setStatusBarBackground('#D74B28');
  setTimeout(function () {
    plus.navigator.closeSplashscreen();
  }, 200);
}

Vue.use(Mint)
Vue.use(Vuex)
Vue.config.productionTip = false
FastClick.attach(document.body)

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
