<template>
    <div>
      <common-header :h_title="h_title" :showback="true"></common-header>
      <return-top @returnTop='goTop'></return-top>
      <div style='height:0.9rem'></div>
      <div class='err_bg'>
  <div class='err'>
    <div style='text-align: center;'>
      <img :src='errUrl' style='width:119px;height:119px'/>
    </div>
    <div class='err_title'>{{msg}}</div>
    <div class='err_link' @click='goIndex'>商城首页</div>
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
import errImg from '@/assets/img/login.png'
export default {
  name: 'ErrPage',
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
      h_title: '提示',
      errUrl: errImg,
      msg: '积分码不存在'
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    this.msg = options.text
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex: function() {
      this.$router.replace({
        path: '/index'
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~styles/index.less';
@import '~styles/variable.less';
.err_bg {
  background: #f6f6f6;
  height: 100vh;
  position: relative;
}
.err{
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  width: 80%;
}
.err_title{
  font-size: 30/100rem;
  margin: 30/100rem 0;
      text-align: center;
}
.err_link{
  font-size: 30/100rem;
  color: #ff8d97;
      text-align: center;
}
</style>
