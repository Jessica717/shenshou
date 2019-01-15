<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div style='height:1.8rem' id='try'></div>
    <return-top @returnTop='goTop'></return-top>
    <div class='my_flashSale' v-if='isShow'>
      <div class='flashSale_body'>
        <div class='flashSale_nav'>
          <span @click='viewTryType(1)' :class="flashType=='1'?'text_active':''">已成功</span>
          <span @click='viewTryType(3)' :class="flashType=='3'?'text_active':''">进行中</span>
          <span @click='viewTryType(2)' :class="flashType=='2'?'text_active':''">已取消</span>
        </div>
        <div class='cou_tips' v-if='orderList.length<=0'>
          <span>{{tips}}</span>
          <button class='btn_red' @click='goLink'>去试用列表看看</button>
        </div>
        <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false' v-if='orderList.length>0' :bottomDistance='100'
          :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'"> -->
        <div class='order_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="30">
          <div class='order_info' v-for="(item,index) in orderList" :key="index">
            <div class='order_title'>
              <div class='pro_img'>
                <img :src='item.img' />
              </div>
              <div class='pro_info'>
                <div class='pro_title'>{{item.name}}</div>
                <div class='pro_color'>申请时间：{{item.createtime}}</div>
                <div class='order_btn'>
                  <mt-button size='small' class='btn_red' @click="goOrderDetail('/orderDetail?id=',item)" v-if="item.try_status==1">前往查看</mt-button>
                  <mt-button size='small' class='btn_red' @click="goTryDetail('/tryDetail?id=',item)" v-if="item.try_status=='help_try'&&item.help_num>item.yet_num">查看详情</mt-button>
                  <mt-button size='small' class='btn_red' @click="goTryDetail('/tryDetail?id=',item)" v-if="item.try_status=='help_try'&&item.help_num==item.yet_num">前往下单</mt-button>
                  <mt-button size='small' v-if="item.try_status==2" class='btn_red'>已取消</mt-button>
                  <mt-button v-if="item.try_status==3" class='btn_red' size='small'>已下架</mt-button>
                </div>
              </div>
            </div>
          </div>
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='order-foot' :hidden='orderList.length<total||total==0'>
            <span>—————— 我是有底线的 ——————</span>
          </div>
        </div>
        <!-- </mt-loadmore> -->
      </div>
    </div>
    <div class='goIndex' @click='goIndex' data-link='../index/index'>
      <i class='iconfont icon-home'></i>
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
  Spinner,
  Toast,
  Loadmore
} from 'mint-ui'
import {
  getMyTryList
} from '@/api/index'
  // import {
  //   mapMutations,
  //   mapGetters
  // } from 'vuex'
import {
  parseTime
} from '@/store/pubilc.js'
export default {
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Spinner,
    Toast,
    Loadmore
  },
  data() {
    return {
      h_title: '我的试用',
      isShow: false,
      orderList: [],
      tips: '您暂时没有申请试用商品，赶快去申请吧',
      page: 1,
      pagesize: 5,
      flashType: '1',
      couTotal: 0,
      total: 0,
      proType: 'try',
      loading: true,
      screenHeight: (document.documentElement.clientHeight - 90) / 50
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取我的奖品列表
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('try').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    goLink: function (e) {
      this.$router.togo({
        path: '/try'
      })
    },
    goOrderDetail(url, value) {
      this.$router.togo({
        path: url + value.order_id
      })
    },
    goTryDetail(url, value) {
      this.$router.togo({
        path: url + value.activity_id + '&help_id=' + value.help_id + '&model=true'
      })
    },
    // goOrder: function (e) {
    //   if(!this.$store.state.home.isbind){

    //   }else{
    //     this.$router.togo({
    //       path:''
    //     })
    //   }
    //   if (!wx.getStorageSync('isbind')) {
    //     var pages = getCurrentPages() // 获取加载的页面
    //     var currentPage = pages[pages.length - 1] // 获取当前页面的对象
    //     var url = currentPage.route // 当前页面url
    //     var options = currentPage.options
    //     // 拼接url的参数
    //     if (JSON.stringify(options) != '{}') {
    //       var urlWithArgs = url + '?'
    //       for (var key in options) {
    //         var value = options[key]
    //         urlWithArgs += key + '=' + value + '&'
    //       }
    //     } else {
    //       urlWithArgs = url
    //     }
    //     getApp().globalData.backUrl = urlWithArgs
    //     wx.reLaunch({
    //       url: '../bind/bind?visit=4'
    //     })
    //   } else {
    //     wx.navigateTo({
    //       url: e.currentTarget.dataset.link
    //     })
    //   }
    // },
    showDetail: function (e) {
      this.$router.togo({
        path: '/tryDetail?id=' + e.currentTarget.id
      })
    },
    viewTryType(id) {
      Indicator.open('加载中...')
      this.flashType = id
      this.page = 1
      this.loading = true
      this.getList()
    },
    getList() {
      var that = this
      let info = {
        type: that.flashType,
        page: that.page,
        pagesize: that.pagesize
      }
      getMyTryList(info).then(res => {
        Indicator.close()
        that.isShow = true
        if (res.isSuccess) {
          if (res.data.rows.length > 0) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(res.data.rows[i].createtime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            that.orderList = res.data.rows
            that.total = res.data.total
            that.loading = false
            // console.log(parseInt(that.total) === parseInt(that.orderList.length))
            // setTimeout(function () {
            //   if ((parseInt(that.total) === parseInt(that.orderList.length) && parseInt(that.total) > 0) ||
            //       parseInt(that.total) === 0) {
            //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            //   } else {
            //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
            //   }
            // }, 100)
          } else {
            if (that.flashType === 'all') {
              that.tips = '您暂时没有申请试用商品，赶快去申请吧！'
            } else if (that.flashType === 1) {
              that.tips = '您暂时没有申请成功的试用商品，赶快去申请吧！'
            } else if (that.flashType === 3) {
              that.tips = '您暂时没有进行中的助力试用商品，赶快去申请吧！'
            } else {
              that.tips = '您暂时没有已取消的试用商品，赶快去申请吧！'
            }
            that.loading = true
            that.orderList = []
            that.tips = that.tips
            that.total = res.data.total
          }
        }
      })
    },
    loadMore() {
      console.log(1)
      var that = this
      that.loading = true
      let info = {
        type: that.flashType,
        page: ++that.page,
        pagesize: that.pagesize
      }
      getMyTryList(info).then(res => {
        if (res.isSuccess) {
          if (res.data.rows !== null && res.data.rows.length > 0) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(res.data.rows[i].createtime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            that.orderList = that.orderList.concat(res.data.rows)
            that.total = res.data.total
            that.loading = false
          } else {
            if (that.flashType === 'all') {
              that.tips = '您暂时没有申请试用商品，赶快去申请吧！'
            } else if (that.flashType === 1) {
              that.tips = '您暂时没有申请成功的试用商品，赶快去申请吧！'
            } else if (that.flashType === 3) {
              that.tips = '您暂时没有进行中的助力试用商品，赶快去申请吧！'
            } else {
              that.tips = '您暂时没有已取消的试用商品，赶快去申请吧！'
            }
            that.loading = true
          }
        }
      })
      // if (parseInt(that.total) === parseInt(that.orderList.length) && parseInt(that.total) > 0) {
      //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
      // }
      // that.$refs.loadmore.onBottomLoaded()
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .my_flashSale {
    /* font-family: SimHei; */
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .flashSale_body {
    height: 100%;
  }

  .flashSale_nav {
    height: 90/100rem;
    background: #f6f6f6;
    width: 100%;
    z-index: 50;
    position: fixed;
    top: 0.9rem;
  }

  .flashSale_nav span {
    width: 32%;
    display: inline-block;
    color: #999;
    font-size: 32/100rem;
    text-align: center;
    border-bottom: 4/100rem solid transparent;
    border-top: 4/100rem solid transparent;
    height: 82/100rem;
    line-height: 82/100rem;
  }

  .flashSale_nav .text_active {
    border-bottom: 4/100rem solid #e21f11;
    color: #333;
  }

  .cou_tips {
    text-align: center;
    margin-top: 140/100rem;
  }

  .cou_tips span {
    font-size: 28/100rem;
    color: #555;
  }

  .cou_tips .btn_red {
    margin-top: 20/100rem;
    display: inline-flex;
    height: 66/100rem;
    line-height: 66/100rem;
    border: none;
    background: #ff8d97;
    color: #fff;
    outline: none;
    font-size: 32/100rem;
    border-radius: 20/100rem;
  }

  /* 订单商品信息 */

  .order_list {
    padding: 0 26/100rem;
    // margin-top: 116/100rem;
    overflow: scroll;
    height: calc(100vh - 1.78rem);
  }

  .order_list .order_info {
    /* height: 252/100rem; */
    background: #fff;
    margin: 16/100rem 0;
  }

  .order_info .order_title {
    /* border-bottom: 2/100rem solid #e0e0e0; */
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 20/100rem;
    justify-content: space-between;
  }

  .order_title .pro_img {
    float: left;
    /* margin-top: 30/100rem; */
    /* margin-left: 18/100rem; */
    margin-right: 30/100rem;
  }

  .order_title .pro_img img {
    width: 190/100rem;
    height: 190/100rem;
    vertical-align: middle;
  }

  .order_title .pro_info {
    float: left;
    width: 440/100rem;
  }

  .pro_info .pro_title {
    width: 100%;
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 90/100rem; */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /* margin-top: 18/100rem; */
  }

  .pro_info .pro_color {
    width: 100%;
    font-size: 20/100rem;
    color: #999;
    margin-top: 22/100rem;
  }

  .pro_info .order_btn {
    /* text-align: right;
  padding: 10/100rem 26/100rem; */
    text-align: right;
    margin-top: 20/100rem;
    width: 100%;
  }

  .pro_info .order_btn button {
    border: 1px solid #808080;
    border-color: #f06b90;
    color: #f06b90;
    background: transparent;
    border-radius: 20/100rem;
    font-size: 26/100rem;
    width: 160/100rem;
    padding: 4/100rem 16/100rem;
    line-height: 1.6;
  }

  .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
    margin-top: -18/100rem;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .more_load {
    display: flex;
    justify-content: center;
  }

</style>
