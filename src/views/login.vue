<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='login_bg'>
      <div class='login'>
        <div class='login_head_img'>
          <img :src="loginImg" alt="" srcset="">
        </div>
        <div class='login_head_title'>公主购商城</div>
        <div class='login_btn' @click='loginApp'>
          <mt-button plain size="large">
            <i class='iconfont icon-weixin'></i>
            微信快速登录</mt-button>
        </div>
        <div class='login_version'>
          <span>账号登录</span>
          <span>{{version}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import login from '@/assets/img/login.png'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  appLogin
} from '@/api/index'
  // import {
  //   getOrderDetail
  // } from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
import {
  setToken
} from '@/store/auth'
export default {
  name: 'Login',
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
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '登录',
      version: 'v1.0',
      loginImg: login,
      aweixin: ''
    }
  },
  mounted() {
    let System = window.plus
    console.log(System.runtime.version)
    this.version = System.runtime.version
    let that = this
    System.oauth.getServices(
      function (services) {
        let auths = services
        console.log(auths)
        if (services[0].id === 'weixin') {
          that.aweixin = services[0]
        }
      },
      function (e) {
        alert('获取分享服务列表失败：' + e.message + ' - ' + e.code)
      }
    )
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    loginApp() {
      console.log(this.aweixin)
      let that = this
      var storage = window.localStorage
      if (!window.plus) {
        alert('当前环境不支持微信登录')
        storage.setItem('token', 'uid=829926;username=wx_ohocf0Qu-S1Xz0oU4PD4lqspjOd4;rank=1;token=cbfae70b164f0f406f2c2fc9c18aaf5d_1547428571;source=wechatapp;sessionid=bqeol9h4ttsnansdh4b765fv04;')
        storage.setItem('isLogin', true)
        setToken('member[uid]', '829926')
        setToken('member[username]', 'wx_ohocf0Qu-S1Xz0oU4PD4lqspjOd4')
        setToken('member[rank]', '1')
        setToken('member[token]', 'cbfae70b164f0f406f2c2fc9c18aaf5d_1547428571')
        setToken('member[source]', 'wechatapp')
        setToken('sessionid', 'bqeol9h4ttsnansdh4b765fv04')
        that.$router.go(-1)
      } else {
        this.aweixin.login(
          function (e) {
            console.log(e)
            let info = {
              openid: e.target.userInfo.openid,
              uionId: e.target.userInfo.unionid,
              name: e.target.userInfo.nickname,
              iconurl: e.target.userInfo.headimgurl
            }
            appLogin(info).then(res => {
              console.log(res)
              if (res.isSuccess) {
                var data =
                    'uid=' +
                    res.uid +
                    ';username=' +
                    res.username +
                    ';rank=' +
                    res.rank +
                    ';token=' +
                    res.token +
                    ';source=' +
                    res.source +
                    ';sessionid=' +
                    res.sessionid
                console.log(data)
                storage.setItem('token', data)
                storage.setItem('isLogin', true)
                // that.userInfo = that.$store.state.home.userInfo
                console.log('返回上一页')
                // Toast({
                //   message: '登陆成功',
                //   iconClass: 'iconfont icon-dui1',
                //   duration: 1000
                // })
                that.$router.go(-1)
              // that.loginModel = false
              }
            })
          },
          function (e) {
            alert('授权失败：' + JSON.stringify(e))
          }, {
            scope: 'snsapi_userinfo',
            state: 'authorize test',
            appid: 'wxbc7c7b9255f2935b'
          }
        )
      }
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .login_bg {
    background: #fff;
    height: calc(100% - 0.9rem);

    .login {
      height: 100%;
      position: relative;

      .login_head_img {
        // text-align: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 10%;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 0.2rem;

        }
      }

      .login_head_title {
        position: absolute;
        top: 28%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.32rem;
        color: #000;
      }

      .login_btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 22%;
        width: 100%;

        button {
          width: 80%;
          margin: 0 auto;
          font-size: 0.34rem;
          border: 1px solid #d5d5d5 !important;
        }
      }

      .login_version {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10%;
        width: 100%;
        font-size: 0.28rem;
        color: #585858;

        span {
          display: block;
          text-align: center;
        }
      }
    }

  }

</style>
