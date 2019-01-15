<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='auth'>
      <div class='head_icon'>
        <i class='iconfont icon-weixin'></i>
      </div>
      <div class='head_title'>微信授权页面</div>
      <div class='view_tips'>此页面为微信授权页面，点击下方按钮弹出授权或跳转页面</div>
      <div class='auth_btn'>
        <mt-button type='primary' open-type="getUserInfo" bindgetuserinfo='wx_login' size="large">点击微信授权</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
  // import {
  //   getOrderDetail
  // } from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
  // import {
  //   setToken,
  //   getToken
  // } from '@/store/auth'
export default {
  name: 'UserAuz',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast
  },
  data() {
    return {
      h_title: '微信授权页',
      userInfo: {
        avatar: '',
        nickname: '',
        username: '',
        isShow: 0
      },
      refuse: false
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    // console.log(this.$route.query)
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    wx_login: function () {
      var that = this
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            that.setData({
              hiddenlogin: true
            })
            wx.login({
              success: function (res) {
                // 登录
                wx.getUserInfo({
                  success: function (req) {
                    if (res.code) {
                      // 发起网络请求
                      util.queryRequest('?m=login&a=dologin', {
                        code: res.code,
                        signature: req.signature,
                        encryptedData: req.encryptedData,
                        iv: req.iv,
                        source: 'wxxcx',
                        prize: app.globalData.winId
                      }, 'POST', function (res) {
                        if (res.isSuccess == true) {
                          var data = 'member[uid]=' + res.uid +
                              ';member[username]=' + res.username +
                              ';member[rank]=' + res.rank +
                              ';member[token]=' + res.token +
                              ';member[source]=' + res.source +
                              ';sessionid=' + res.sessionid
                          wx.setStorageSync('cookie', data)
                          app.globalData.userInfo.nickname = res.nickname
                          app.globalData.userInfo.username = res.username
                          app.globalData.userInfo.level = res.rankname
                          app.globalData.userInfo.isbind = res.bindPhone
                          app.globalData.userInfo.avatar = res.img
                          app.globalData.userInfo.isShow = 1
                          wx.setStorageSync('userInfo', app.globalData.userInfo)
                          wx.setStorageSync('score', res.point)
                          wx.setStorageSync('isbind', res.bindPhone)
                          that.setData({
                            userInfo: app.globalData.userInfo
                          })
                          if (!res.bindPhone) {
                            wx.reLaunch({
                              url: '../bind/bind?visit=0'
                            })
                          } else {
                            if (getApp().globalData.backUrl.indexOf('scanCode') != -1) {
                              wx.navigateTo({
                                url: '../myGift/myGift'
                              })
                            } else if (getApp().globalData.backUrl.indexOf('memberCenter') !=
                                -1) {
                              wx.switchTab({
                                url: '../memberCenter/memberCenter'
                              })
                            } else {
                              wx.redirectTo({
                                url: '/' + getApp().globalData.backUrl
                              })
                              wx.switchTab({
                                url: '/' + getApp().globalData.backUrl
                              })
                              // wx.navigateBack({
                              //   delta: 1
                              // })
                            }
                          }
                        }
                      })
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  },
                  fail: res => {
                    console.log('getUserInfo接口')
                    console.log(res)
                    wx.showToast({
                      title: '微信接口异常',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                })
              },
              fail: res => {
                console.log('login接口')
                console.log(res)
                wx.showToast({
                  title: '微信接口异常',
                  icon: 'none',
                  duration: 1000
                })
              }
            })
          } else {
            that.setData({
              refuse: true
            })
          }
        }
      })
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .auth {
    text-align: center;
    padding: 30% 29px;
    height: 100vh;
    background: #fff;
  }
.head_icon {
    text-align: center;
}
  .head_icon .iconfont {
    font-size: 150/100rem;
    color: #1aad16;
  }

  .head_title {
    margin-top: 30/100rem;
    font-size: 48/100rem;
    color: #666;
    text-align: center;
  }

  .view_tips {
    font-size: 32/100rem;
    color: #999;
    margin: 60/100rem 0;
    text-align: center;
  }
  .auth_btn button{
      background-color: #179B16;
  }

</style>
