import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
console.log(store)

Vue.use(Router)
// 需要左方向动画的路由用this.$router.togo('****')
Router.prototype.togo = function (info) {
  console.log(info)
  this.isleft = true
  this.isright = false
  this.push(info)
}
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (info) {
  this.isleft = false
  this.isright = true
  this.push(info.path)
}
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  console.log('后退')
  Router.isleft = false
  Router.isright = true
  console.log(this)
  this.go(-1)
  console.log(this)
}
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true
  this.isleft = false
}
// 点击浏览器前进按钮执行
Router.prototype.togoin = function () {
  this.isright = false
  this.isleft = true
}
export default new Router({
  // mode: 'history', // 本地测试，最后要去掉
  routes: [
    {
      path: '/',
      name: 'index',
      component: (resolve) => require(['@/views/index'], resolve),
      redirect: '/index',
      children: [{
        path: '/index',
        name: 'Index',
        meta: {
          title: '首页',
          noCache: false
        },
        component: (resolve) => require(['@/views/index/index'], resolve)
      },
      {
        path: '/find',
        name: 'Find',
        component: (resolve) => require(['@/views/index/find'], resolve),
        meta: {
          title: '精选',
          noCache: false
        }
      },
      {
        path: '/type',
        name: 'Type',
        component: (resolve) => require(['@/views/index/type'], resolve),
        meta: {
          title: '商品分类',
          noCache: true
        }
      },
      {
        path: '/car',
        name: 'Car',
        component: (resolve) => require(['@/views/index/car'], resolve),
        meta: {
          title: '购物车',
          noCache: true
        }
      },
      {
        path: '/member',
        name: 'Member',
        component: (resolve) => require(['@/views/index/member'], resolve),
        meta: {
          title: '个人中心',
          noCache: true
        }
      },
      {
        path: '/order',
        name: 'Order',
        component: (resolve) => require(['@/views/index/myOrder'], resolve),
        meta: {
          title: '我的订单',
          noCache: true
        }
      },
      {
        path: '/proList',
        name: 'ProList',
        component: (resolve) => require(['@/views/index/proList'], resolve),
        meta: {
          title: '商品列表',
          noCache: true
        }
      },
      {
        path: '/flash',
        name: 'Flash',
        component: (resolve) => require(['@/views/index/flashSale'], resolve),
        meta: {
          title: '限时抢购',
          noCache: true
        }
      },
      {
        path: '/try',
        name: 'Try',
        component: (resolve) => require(['@/views/index/tryOut'], resolve),
        meta: {
          title: '试用体验',
          noCache: true
        }
      },
      {
        path: '/group',
        name: 'Group',
        component: (resolve) => require(['@/views/index/group'], resolve),
        meta: {
          title: '拼团中心',
          noCache: true
        }
      },
      {
        path: '/myColl',
        name: 'MyColl',
        component: (resolve) => require(['@/views/index/myColl'], resolve),
        meta: {
          title: '我的收藏',
          noCache: true
        }
      },
      {
        path: '/paySuccess',
        name: 'PaySuccess',
        component: (resolve) => require(['@/views/index/paySuccess'], resolve),
        meta: {
          title: '支付成功页',
          noCache: true
        }
      }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: (resolve) => require(['@/views/login'], resolve),
      meta: {
        title: '登录',
        noCache: true
      }
    },
    {
      path: '/set',
      name: 'Set',
      component: (resolve) => require(['@/views/set'], resolve),
      meta: {
        title: '设置',
        noCache: true
      }
    },
    {
      path: '/other',
      name: 'Other',
      component: (resolve) => require(['@/views/other'], resolve),
      meta: {
        title: '页面标题',
        noCache: true
      }
    },
    {
      path: '/proDetail',
      name: 'ProDetail',
      component: (resolve) => require(['@/views/proDetail'], resolve),
      meta: {
        title: '商品详情',
        noCache: false
      }
    },
    {
      path: '/tryDetail',
      name: 'TryDetail',
      component: (resolve) => require(['@/views/tryDetail'], resolve),
      meta: {
        title: '试用商品详情',
        noCache: true
      }
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: (resolve) => require(['@/views/orderDetail'], resolve),
      meta: {
        title: '订单详情',
        noCache: true
      }
    },
    {
      path: '/lottery',
      name: 'Lottery',
      component: (resolve) => require(['@/views/lottery'], resolve),
      meta: {
        title: '每日抽奖',
        noCache: true
      }
    },
    {
      path: '/findDetail',
      name: 'FindDetail',
      component: (resolve) => require(['@/views/findDetail'], resolve),
      meta: {
        title: '文章详情',
        noCache: true
      }
    },
    {
      path: '/sureOrder',
      name: 'SureOrder',
      component: (resolve) => require(['@/views/sureOrder'], resolve),
      meta: {
        title: '确认支付',
        noCache: true
      }
    },
    {
      path: '/myFootprint',
      name: 'MyFootprint',
      component: (resolve) => require(['@/views/member/myFootprint'], resolve),
      meta: {
        title: '我的足迹',
        noCache: true
      }
    },
    {
      path: '/mySignIn',
      name: 'MySignIn',
      component: (resolve) => require(['@/views/member/mySignIn'], resolve),
      meta: {
        title: '我的签到',
        noCache: true
      }
    },
    {
      path: '/improveInfo',
      name: 'ImproveInfo',
      component: (resolve) => require(['@/views/member/improveInfo'], resolve),
      meta: {
        title: '完善生日',
        noCache: true
      }
    },
    {
      path: '/myCoupon',
      name: 'MyCoupon',
      component: (resolve) => require(['@/views/member/myCoupon'], resolve),
      meta: {
        title: '我的优惠券',
        noCache: true
      }
    },
    {
      path: '/editInfo',
      name: 'EditInfo',
      component: (resolve) => require(['@/views/member/editInfo'], resolve),
      meta: {
        title: '我的地址',
        noCache: true
      }
    },
    {
      path: '/editAddr',
      name: 'EditAddr',
      component: (resolve) => require(['@/views/member/editAddr'], resolve),
      meta: {
        title: '编辑地址',
        noCache: true
      }
    },
    {
      path: '/personCenter',
      name: 'PersonCenter',
      component: (resolve) => require(['@/views/member/personCenter'], resolve),
      meta: {
        title: '我的资料',
        noCache: true
      }
    },
    {
      path: '/bind',
      name: 'Bind',
      component: (resolve) => require(['@/views/member/bind'], resolve),
      meta: {
        title: '绑定手机',
        noCache: true
      }
    },
    {
      path: '/news',
      name: 'News',
      component: (resolve) => require(['@/views/member/news'], resolve),
      meta: {
        title: '消息中心',
        noCache: true
      }
    },
    {
      path: '/myScore',
      name: 'MyScore',
      component: (resolve) => require(['@/views/member/myScore'], resolve),
      meta: {
        title: '我的积分',
        noCache: true
      }
    },
    {
      path: '/myComment',
      name: 'MyComment',
      component: (resolve) => require(['@/views/member/myComment'], resolve),
      meta: {
        title: '我的评价',
        noCache: true
      }
    },
    {
      path: '/mytryOut',
      name: 'MytryOut',
      component: (resolve) => require(['@/views/member/mytryOut'], resolve),
      meta: {
        title: '我的试用',
        noCache: true
      }
    },
    {
      path: '/groupBy',
      name: 'GroupBy',
      component: (resolve) => require(['@/views/member/groupBy'], resolve),
      meta: {
        title: '我的拼团',
        noCache: true
      }
    },
    {
      path: '/myGift',
      name: 'MyGift',
      component: (resolve) => require(['@/views/member/myGift'], resolve),
      meta: {
        title: '我的赠品',
        noCache: true
      }
    },
    {
      path: '/myGiftList',
      name: 'MyGiftList',
      component: (resolve) => require(['@/views/member/myGiftList'], resolve),
      meta: {
        title: '我的奖品',
        noCache: true
      }
    },
    {
      path: '/myIntersted',
      name: 'MyIntersted',
      component: (resolve) => require(['@/views/member/myIntersted'], resolve),
      meta: {
        title: '我的关注',
        noCache: true
      }
    },
    {
      path: '/vipBirthday',
      name: 'Birtahday',
      component: (resolve) => require(['@/views/member/vipBirthday'], resolve),
      meta: {
        title: '生日专区',
        noCache: true
      }
    },
    {
      path: '/orderTrack',
      name: 'OrderTrack',
      component: (resolve) => require(['@/views/other/orderTrack'], resolve),
      meta: {
        title: '物流详情',
        noCache: true
      }
    },
    {
      path: '/single',
      name: 'Single',
      component: (resolve) => require(['@/views/other/single'], resolve),
      meta: {
        title: '凑单',
        noCache: true
      }
    },
    {
      path: '/useCoupon',
      name: 'UseCoupon',
      component: (resolve) => require(['@/views/other/useCoupon'], resolve),
      meta: {
        title: '使用优惠券',
        noCache: true
      }
    },
    {
      path: '/addComment',
      name: 'AddComment',
      component: (resolve) => require(['@/views/other/addComment'], resolve),
      meta: {
        title: '添加评价',
        noCache: true
      }
    },
    {
      path: '/err',
      name: 'ErrPage',
      component: (resolve) => require(['@/views/other/errPage'], resolve),
      meta: {
        title: '错误页面',
        noCache: true
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: (resolve) => require(['@/views/other/search'], resolve),
      meta: {
        title: '搜索',
        noCache: true
      }
    },
    {
      path: '/saleAfter',
      name: 'SaleAfter',
      component: (resolve) => require(['@/views/other/saleAfter'], resolve),
      meta: {
        title: '微信授权页',
        noCache: true
      }
    },
    {
      path: '/scanCode',
      name: 'ScanCode',
      component: (resolve) => require(['@/views/other/scanCode'], resolve),
      meta: {
        title: '扫码结果页',
        noCache: true
      }
    },
    {
      path: '/afterDetail',
      name: 'AfterDetail',
      component: (resolve) => require(['@/views/other/afterDetail'], resolve),
      meta: {
        title: '申请售后',
        noCache: true
      }
    },
    {
      path: '/userAuz',
      name: 'UserAuz',
      component: (resolve) => require(['@/views/other/userAuz'], resolve),
      meta: {
        title: '售后详情',
        noCache: true
      }
    },
    {
      path: '/groupResult',
      name: 'GroupResult',
      component: (resolve) => require(['@/views/other/groupResult'], resolve),
      meta: {
        title: '拼购详情',
        noCache: true
      }
    },
    {
      path: '/scan',
      name: 'ScanPage',
      component: (resolve) => require(['@/views/other/scanPage'], resolve),
      meta: {
        title: '扫一扫',
        noCache: true
      }
    }
  ]
})
