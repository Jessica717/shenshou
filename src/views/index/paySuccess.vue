<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='pay_success'>
      <div class='pay_body'>
        <div class='pay_title'>
          <i class='iconfont icon-duihaocheckmark17'></i>
          <div>
            <span class='pay_states'>支付成功！</span>
            <span class='pay_info'>您的订单已提交仓库，即将配送</span>
          </div>
        </div>
        <div class='pay_addr'>
          <div>
            <span>收件人</span> {{addrInfo.ship_name}} {{addrInfo.ship_mobile}}
          </div>
          <div>
            <span>收件地址</span> {{addrInfo.ship_area}}{{addrInfo.ship_addr}}
          </div>
        </div>
        <div class='pay_btn'>
          <mt-button size='small' @click='showOrder'>查看订单</mt-button>
          <mt-button size='small' @click='buy'>继续购物</mt-button>
        </div>
        <img :src='payImg' style='width:100%;height:1.82rem;' v-if="payImg!=''&&payImg!=null"/>
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
import {
  getMyaddrList
} from '@/api/index'
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
  name: 'PaySuccess',
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
      h_title: '支付成功',
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      addrId: '',
      addrInfo: {},
      payImg: process.env.BASE_URL + '/static/img/payad.jpg'
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    this.addrId = options.addrId
    this.getInfo()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    showOrder: function () {
      this.$router.replace({
        path: '/order',
        name: 'Order',
        params: {
          id: 0,
          tid: 0
        }
      })
    },
    buy: function () {
      this.$router.replace({
        path: '/index'
      })
    },
    getInfo() {
      let that = this
      getMyaddrList().then(res => {
        if (res.isSuccess) {
          for (var i = 0; i < res.rows.length; i++) {
            if (that.addrId === res.rows[i].id) {
              that.addrInfo = res.rows[i]
              that.payImg = res.bgimg
            }
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

  .pay_success {
    font-family: SimHei;
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .pay_header {
    text-align: center;
    background: #f7f7f7;
    height: 94/100rem;
    line-height: 94/100rem;
  }

  .pay_header .iconfont {
    float: left;
    color: #5d5d5d;
    padding-left: 26/100rem;
  }

  .pay_header span {
    color: #393939;
    font-size: 38/100rem;
    margin-left: -26/100rem;
  }

  .pay_body {
    background: #fff;
  }

  .pay_body .pay_title {
    height: 180/100rem;
    /* line-height: 180/100rem; */
    background: #ff8d97;
    display: flex;
    padding: 0 26/100rem;
    align-items: center;
  }

  .pay_title i {
    font-size: 70/100rem;
    color: #fff;
  }

  .pay_title div {
    color: #fff;
    margin-left: 40/100rem;
  }

  .pay_title div .pay_states {
    font-size: 34/100rem;
    display: block;
  }

  .pay_title div .pay_info {
    font-size: 24/100rem;
  }

  .pay_addr {
    padding: 20/100rem 0;
    border-bottom: 2/100rem solid #e0e0e0;
    margin: 0 26/100rem;
  }

  .pay_addr div {
    font-size: 24/100rem;
    color: #444;
    padding: 5/100rem 0;
  }

  .pay_addr div span {
    color: #999;
    width: 100/100rem;
    display: inline-block;
  }

  .pay_btn {
    height: 256/100rem;
    line-height: 256/100rem;
    text-align: center;
  }

  .pay_btn button {
    color: #ff8d97;
    border: 2/100rem solid #ff8d97;
    background: #fff;
    margin: 0 30/100rem;
  }

  .pay_btn button::after {
    border: none;
  }

</style>
