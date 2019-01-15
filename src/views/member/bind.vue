<template>
  <div style='background:#fff'>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='bind'>
      <!-- <div class='b_jump'>
        <span @click='skipBind' :hidden="visited=='1'">跳过</span>
      </div> -->
      <div class='b_content'>
        <div class='b_title'>
          <span>绑定手机号</span>
        </div>
        <div class='b_tips'>
          <span>忘记密码或账号有异常，可以通过手机号寻回账号</span>
        </div>
        <div class='b_form'>
          <!-- <form bindsubmit="formSubmit" bindreset="formReset"> -->
            <div class="section mobile">
              <span>+86</span>
              <input placeholder="输入手机号码" class='width' v-model="mobile"/>
            </div>
            <div class="section getcode">
              <input placeholder="输入验证码" @blur='getCode' v-model="code"/>
              <mt-button size="small" :disabled='isDisabled' @click='send' :style="{backgroundColor:color}">{{text}}</mt-button>
            </div>
            <div class="section next">
              <mt-button form-type='submit' size='normal' @click="formSubmit">完成</mt-button>
            </div>
          <!-- </form> -->
        </div>
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
  Toast,
  MessageBox
} from 'mint-ui'
import {
  sendCode, savePhone
} from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
export default {
  name: 'name',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    MessageBox
  },
  data() {
    return {
      h_title: '绑定手机',
      visited: 0,
      mobile: '',
      code: '',
      text: '获取验证码',
      currentTime: 61,
      isDisabled: false,
      color: '#ff8d97',
      canclick: false,
      is_success: false
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    // console.log(this.$route.query)
  },
  methods: {
    ...mapMutations({
      setIsbind: 'SET_ISBIND'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    // skipBind: function () {
    //   var that = this
    //   if (that.visited === '3') {
    //     // 已注册未绑定手机
    //     wx.switchTab({
    //       url: '../index/index'
    //     })
    //   } else if (that.visited == '0') {
    //     // 扫码领赠品
    //     if (getApp().globalData.winId != '') {
    //       wx.redirectTo({
    //         url: '../myGift/myGift'
    //       })
    //     } else {
    //       wx.switchTab({
    //         url: '/' + getApp().globalData.backUrl
    //       })
    //       wx.redirectTo({
    //         url: '/' + getApp().globalData.backUrl
    //       })
    //     }
    //   } else if (that.visited == '4') {
    //     // 在商品购买页已注册未绑定手机
    //     wx.redirectTo({
    //       url: '/' + getApp().globalData.backUrl
    //     })
    //     wx.switchTab({
    //       url: '/' + getApp().globalData.backUrl
    //     })
    //   } else if (that.visited == '1') {
    //     // 个人信息修改手机号码
    //     setTimeout(function () {
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     }, 500)
    //   } else if (that.visited == '5') {
    //     // 个人中心点登陆,或者签到
    //     wx.switchTab({
    //       url: '/pages/memberCenter/memberCenter'
    //     })
    //   } else if (that.visited == '6') {
    //     // 抽奖页未绑定手机
    //     wx.redirectTo({
    //       url: '../lottery/lottery'
    //     })
    //   } else {
    //     // 返回上一页
    //     wx.navigateBack({
    //       delta: 1
    //     })
    //   }
    // },
    getCode: function (e) {
      this.canclick = false
      // code: e.detail.value
    },
    send() {
      console.log(0)
      var that = this
      that.isDisabled = true // 只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      that.color = '#ccc'
      var phone = that.mobile
      var currentTime = that.currentTime
      var warn = null // warn为当手机号为空或格式不正确时提示用户的文字，默认为空
      if (phone === '') {
        warn = '号码不能为空'
      } else if (phone.trim().length !== 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
        warn = '手机号格式不正确'
      } else {
        Indicator.open('发送中')
        // 当手机号正确的时候提示用户短信验证码已经发送,并后台请求短信
        sendCode(that.mobile).then(res => {
          Indicator.close()
          var interval = setInterval(function () {
            currentTime-- // 每执行一次让倒计时秒数减一
            that.color = '#ccc'
            that.text = currentTime + 's' // 按钮文字变成倒计时对应秒数
            if (currentTime <= 0) {
              clearInterval(interval)
              that.text = '重新发送'
              that.currentTime = 61
              that.isDisabled = false
              that.color = '#ff8d97'
            }
          }, 1000)
          if (res.isSuccess) {
            Toast({
              message: res.msg,
              duration: 1000
            })
          } else {
            clearInterval(interval)
            that.isDisabled = false
            that.color = '#ff8d97'
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      }
      // 判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
      if (warn != null) {
        let plus = window.plus
        if (window.plus) {
          plus.nativeUI.confirm(warn, function(e) {
            console.log('Close confirm: ' + e.index)
            if (e.index === 0 || e.index === '0') {
              console.log('用户点击确定')
            }
          }, {
            'title': '提示',
            'buttons': ['确定'],
            'verticalAlign': 'center'
          })
        } else {
          MessageBox('提示', warn)
        }
        // wx.showModal({
        //   title: '提示',
        //   content: warn
        // })
        that.isDisabled = false
        that.color = '#ff8d97'
      }
    },
    formSubmit: function () {
      if (this.mobile === '') {
        if (this.mobile.trim().length !== 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)) {
          Toast({
            message: '手机号格式不正确',
            duration: 1000
          })
        //   wx.showToast({
        //     title: '手机号格式不正确',
        //     icon: 'none',
        //     duration: 1000
        //   })
        }
        // wx.showToast({
        //   title: '手机号不能为空',
        //   icon: 'none',
        //   duration: 1000
        // })
      } else if (this.code === '') {
        Toast({
          message: '验证码不能为空',
          duration: 1000
        })
        // wx.showToast({
        //   title: '验证码不能为空',
        //   icon: 'none',
        //   duration: 1000
        // })
      } else {
        // wx.showLoading({
        //   title: '提交中'
        // })
        Indicator.open('提交中')
        if (!this.is_success) {
          var that = this
          // 保存手机号 接口
          let info = {
            phone: that.mobile,
            code: that.code
          }
          savePhone(info).then(res => {
            Indicator.close()
            if (res.isSuccess) {
              that.setData({
                is_success: true
              })
              Toast({
                message: res.msg,
                duration: 500
              })
              that.setIsbind(true)
              if (that.visited === '3') {
              // 签到已注册未绑定手机
                // wx.redirectTo({
                //   url: '../mySignIn/mySignIn'
                // })
                that.$router.replace({
                  path: '/mySignIn'
                })
              } else if (that.visited === '0') {
                setTimeout(function() {
                  that.$router.back()
                }, 500)
              // 扫码中奖前往领取
                // if (getApp().globalData.winId != '') {
                //   wx.redirectTo({
                //     url: '../myGift/myGift'
                //   })
                // } else {
                //   wx.switchTab({
                //     url: '/' + getApp().globalData.backUrl
                //   })
                //   wx.redirectTo({
                //     url: '/' + getApp().globalData.backUrl
                //   })
                // }
              } else if (that.visited === '4') {
                setTimeout(function() {
                  that.$router.back()
                }, 500)
              // 在商品购买页，试用页面，我的赠品，我的奖品，我的试用已注册未绑定手机
                // wx.redirectTo({
                //   url: '/' + getApp().globalData.backUrl
                // })
                // wx.switchTab({
                //   url: '/' + getApp().globalData.backUrl
                // })
                //     that.$router.replace({
                //       path:'/member'
                //   })
              } else if (that.visited === '1') {
              // 个人信息修改手机号码
                setTimeout(function() {
                  that.$router.back()
                }, 500)
              } else if (that.visited === '5') {
              // 个人中心点登陆,或者签到
                // wx.switchTab({
                //   url: '/pages/memberCenter/memberCenter'
                // })
                that.$router.replace({
                  path: '/member'
                })
              } else if (that.visited === '6') {
              // 抽奖页未绑定手机
                that.$router.replace({
                  path: '/lottery'
                })
                // wx.redirectTo({
                //   url: '../lottery/lottery'
                // })
              } else {
              // 返回上一页
                that.$router.back()
              }
            } else {
              Toast({
                message: res.msg,
                duration: 1000
              })
            }
          })
        //   util.queryRequest('?m=member&a=bind_phonenum', {
        //     // data: SON.stringify(data),
        //     phone: that.mobile,
        //     code: that.code
        //   }, 'POST', function (res) {

        //     if (res.isSuccess) {
        //       that.setData({
        //         is_success: true
        //       })
        //       wx.showToast({
        //         title: res.msg,
        //         icon: 'none',
        //         duration: 500
        //       })
        //       wx.setStorageSync('isbind', true)
        //       console.log(getApp().globalData.backUrl)
        //       if (that.visited == '3') {
        //         // 签到已注册未绑定手机
        //         wx.redirectTo({
        //           url: '../mySignIn/mySignIn'
        //         })
        //       } else if (that.visited == '0') {
        //         // 扫码中奖前往领取
        //         if (getApp().globalData.winId != '') {
        //           wx.redirectTo({
        //             url: '../myGift/myGift'
        //           })
        //         } else {
        //           wx.switchTab({
        //             url: '/' + getApp().globalData.backUrl
        //           })
        //           wx.redirectTo({
        //             url: '/' + getApp().globalData.backUrl
        //           })
        //         }
        //       } else if (that.visited == '4') {
        //         // 在商品购买页，试用页面，我的赠品，我的奖品，我的试用已注册未绑定手机
        //         wx.redirectTo({
        //           url: '/' + getApp().globalData.backUrl
        //         })
        //         wx.switchTab({
        //           url: '/' + getApp().globalData.backUrl
        //         })
        //       } else if (that.visited == '1') {
        //         // 个人信息修改手机号码
        //         setTimeout(function () {
        //           wx.navigateBack({
        //             delta: 1
        //           })
        //         }, 500)
        //       } else if (that.visited == '5') {
        //         // 个人中心点登陆,或者签到
        //         wx.switchTab({
        //           url: '/pages/memberCenter/memberCenter'
        //         })
        //       } else if (that.visited == '6') {
        //         // 抽奖页未绑定手机
        //         wx.redirectTo({
        //           url: '../lottery/lottery'
        //         })
        //       } else {
        //         // 返回上一页
        //         wx.navigateBack({
        //           delta: 1
        //         })
        //       }
        //     } else {
        //       wx.showToast({
        //         title: res.msg,
        //         icon: 'none',
        //         duration: 1000
        //       })
        //     }
        //   })
        }
      }
    }
  },
  computed: {
    ...mapGetters([])
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .bind {
    margin: 58/100rem 58/100rem;
  }

  .b_jump {
    text-align: right;
  }

  .b_jump span {
    font-size: 30/100rem;
    color: #666;
  }

  .b_content {
    width: 528/100rem;
    text-align: center;
    margin: 0 auto;
    padding-top: 48/100rem;
  }
.b_content .b_title{
    text-align: center;
}
  .b_content .b_title span {
    color: #343434;
    font-size: 44/100rem;
    display: inline;
  }

  .b_content .b_tips {
    margin-top: 28/100rem;
    padding: 0 20/100rem;
  }

  .b_content .b_tips span {
    color: #8f8f8f;
    font-size: 26/100rem;
    display: block;
    text-align: center;
  }

  .b_content .b_form {
    text-align: left;
  }

  .b_form .section {
    display: flex;
    align-items: center;
    margin-top: 66/100rem;
    justify-content: space-between;
  }

  .b_form .section span {
    font-size: 30/100rem;
    font-weight: bold;
    color: #8c8c8c;
    font-weight: bold;
    float: left;
    margin-right: 24/100rem;
  }

  .b_form .section i {
    padding-top: 1px;
    color: #bbb;
    display: flex;
    float: left;
    margin-right: 24/100rem;
  }

  .b_form .section input {
    width: 290/100rem;
    float: left;
    padding: 10/100rem;
    border-bottom: 1px solid #dbdbdb;
    outline: none;
  }

  .b_form .section .width {
    width: 100%;
  }

  ::-webkit-input-placeholder {
    font-size: 30/100rem;
    color: #c7c7c7;
  }

  .b_form .mobile {
    border-bottom: 1px solid #dbdbdb;
  }

  .b_form .mobile input {
    border: none;
    outline: none;
  }

  .b_form .getcode button {
    border: none;
    background: #ff8d97;
    color: #fff;
    outline: none;
    border-radius: 30/100rem;
    font-size: 26/100rem;
    min-width: 110/100rem;
    text-align: center;
  }

  .b_form .next {
    margin-top: 110/100rem;
    justify-content: center;
  }

  .b_form .next button {
    width: 460/100rem;
    height: 86/100rem;
    line-height: 86/100rem;
    border: none;
    background: #ff8d97;
    color: #fff;
    outline: none;
    font-size: 40/100rem;
    border-radius: 20/100rem;
  }

  .b_form .next .btn_default {
    background: #c7c7c7;
  }

</style>
