<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <div style='height:0.9rem'></div>
    <div class='login_bg'>
      <div class='login'>
        <div class='login_head_img'>
          <img :src="loginImg" alt="" srcset="">
        </div>
        <div class='login_head_title'>公主购商城</div>
        <div class='login_text'>
          <div @click="goOther('statement')">
            <span>特别声明</span>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
          <div @click="goOther('privacy')">
            <span>隐私政策</span>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>
        <div class='login_version'>
          <span>Copyright©2018 公主购</span>
          <span>浙江神首信息技术有限公司 版权所有</span>
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
  name: 'Set',
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
      h_title: '关于',
      version: 'v1.0',
      loginImg: login,
      aweixin: ''
    }
  },
  mounted() {

  },
  methods: {
    goOther(type) {
      this.$router.togo({
        path: '/other?type=' + type
      })
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

      .login_text {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 34%;
        width: 100%;
        font-size: 0.28rem;
        color: #000;

        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 0.3rem;
          border-bottom: 1px solid #e0e0e0;
          padding: 0.2rem 0;
          .iconfont{
              font-size: 0.38rem;
          }
        }
      }

      .login_version {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 14%;
        width: 100%;
        font-size: 0.26rem;
        color: #585858;

        span {
          display: block;
          text-align: center;
        }
      }
    }

  }

</style>
