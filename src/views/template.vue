<template>
    <div>
      <common-header :h_title="h_title" :showback="true"></common-header>
      <return-top @returnTop='goTop'></return-top>
      <div style='height:0.9rem'></div>
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
  name: 'name',
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
      h_title: ''
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
    }
  }
}
</script>

<style scoped lang="less">
@import '~styles/index.less';
@import '~styles/variable.less';
</style>
