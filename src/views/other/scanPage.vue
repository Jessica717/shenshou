<template>
  <div>
    <!-- <common-header :h_title="h_title" :showback="true"></common-header> -->
    <!-- <return-top @returnTop='goTop'></return-top> -->
    <div class='scan_head'>
      <i @click="tohome" class="iconfont icon-jiantouarrowhead7"></i>
      <span>{{h_title}}</span>
      <i></i>
    </div>
    <div id='barcode'></div>
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
      h_title: '扫一扫',
      barcode: '',
      type: 'index'
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    console.log(this.$route.query)
    this.type = this.$route.query.type
    this.start()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    start() {
      let System = window.plus
      console.log(this.barcode)
      if (!this.barcode) {
        this.barcode = System.barcode.create('barcode', [System.barcode.QR], {
          top: '45px',
          left: '0px',
          width: '100%',
          height: '100%',
          position: 'static'
        })
        console.log(this.barcode)
        this.barcode.onmarked = this.onmarked
        System.webview.currentWebview().append(this.barcode)
      }
      this.barcode.start()
    },
    onmarked(type, result) {
      let System = window.plus
      var text = '未知: '
      switch (type) {
        case System.barcode.QR:
          text = 'QR: '
          break
        case System.barcode.EAN13:
          text = 'EAN13: '
          break
        case System.barcode.EAN8:
          text = 'EAN8: '
          break
      }
      console.log(text + result)
      this.barcode.close()
      this.$router.replace({
        path: '/scanCode?type=' + result
      })
      // alert(text + result)
    },
    tohome() {
      console.log(this.type)
      this.$router.back()
    }
  },
  beforeDestroy() {
    this.barcode.close()
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .scan_head {
    height: 0.9rem;
    display: flex;
    align-items: center;
    background: #ff8d97;
    justify-content: space-between;
    background: rgb(255, 141, 151);
    color: rgb(255, 255, 255);

    .iconfont {
      font-size: 0.42rem;
      color: rgb(255, 255, 255);

    }

    span {
      font-size: 0.32rem;
    }
  }

</style>
