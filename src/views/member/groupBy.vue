<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:1.8rem' id='group'></div>
    <div class='mytryOut' v-if='isShow'>
      <div class='tryOut_body'>
        <div class='try_nav'>
          <span @click='viewGroupType(0)' :class="groupType=='0'?'text_active':''">全部</span>
          <span @click='viewGroupType(1)' :class="groupType=='1'?'text_active':''">进行中</span>
          <span @click='viewGroupType(2)' :class="groupType=='2'?'text_active':''">成功</span>
          <span @click='viewGroupType(-1)' :class="groupType=='-1'?'text_active':''">失败</span>
        </div>
        <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false'
          v-if='orderList.length>0' :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'"
          :bottomLoadingText="'加载中'"> -->
        <div class='order_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="30">
          <div v-for='(item,index) in orderList' :key='index' class='sale_pro'>
            <div class='proInfo'>
              <div class='order_status'>
                <i class='iconfont icon-pintuanchenggong iconred' v-if="item.status=='2'"></i>
                <i class='iconfont icon-pintuanshibai' v-if="item.status=='-1'"></i>
                <i class='iconfont icon-jinhangzhong icongreen' v-if="item.status=='1'"></i>
              </div>
              <div class='pro_img' @click="goPro('/orderDetail?id=',item.order_id)">
                <img :src='item.img' />
              </div>
              <div class='pro_info'>
                <div class='pro_title' @click="goPro('/orderDetail?id=',item.order_id)">{{item.name}}</div>
                <div class='pro_spec'>
                  <div class='pro_price'>
                    <i class='iconfont icon-tuangou3'></i>
                    <span class='pro_integral'>{{item.startnum}}人拼</span>
                    <span class='peo_nowprice'>¥{{item.price}}</span>
                  </div>
                </div>
                <div class='pro_orig'>
                  市场价
                  <span>¥{{item.price_market}}</span>
                </div>
              </div>
            </div>
            <div class='pro_btn'>
              <mt-button size='small' class='btn_red' @click="goPro('/orderDetail?id=',item.order_id)">订单详情</mt-button>
              <mt-button size='small' class='btn_red' id='item.id' @click="goPro('/groupResult?type=view&orderId=',item.id)">拼购详情</mt-button>
            </div>
          </div>
          <div class='cou_tips' v-if='orderList.length<=0'>
            <span>{{tips}}</span>
            <mt-button class='btn_red' @click='goLink'>去团购专场看看</mt-button>
          </div>
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='order-foot' v-if='orderList.length==total&&orderList.length>0'>
            <span>—————— 我是有底线的 ——————</span>
          </div>
          <!-- <button type="default" size="default" loading plain :hidden='orderList.length==total' style="border:none;background:#f2f2f2">加载中...</button> -->
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
  getMyGroupList
} from '@/api/index'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
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
      h_title: '我的团购',
      groupType: 0,
      p: 1,
      limit: 4,
      orderList: [],
      tips: '您暂时没有团购商品，赶快去开团或拼团吧',
      total: 0,
      isShow: false,
      loading: true
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
      document.getElementById('group').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    viewGroupType(id) {
      Indicator.open('加载中...')
      this.groupType = id
      this.p = 1
      this.getList()
    },
    goLink: function () {
      this.$router.togo({
        path: '/myGroupBy'
      })
    },
    goPro(url, value) {
      this.$router.togo({
        path: url + value
      })
    },
    getList: function () {
      var that = this
      let info = {
        status: that.groupType,
        p: that.p,
        limit: that.limit
      }
      getMyGroupList(info).then(res => {
        that.isShow = true
        Indicator.close()
        if (res.isSuccess) {
          if (res.data === null) {
            res.data = []
            that.loading = true
          } else {
            that.loading = false
          }
          that.orderList = res.data
          that.total = res.total
          // setTimeout(function () {
          //   if (parseInt(that.total) === parseInt(that.orderList.length) && parseInt(that.total) > 0) {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
          //   } else {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
          //   }
          // }, 100)
        } else {
          if (that.groupType === 0) {
            that.tips = '您暂时没有团购商品，赶快去开团或拼团吧！'
          } else if (that.groupType === 2) {
            that.tips = '您暂时没有拼团成功的商品，赶快去开团或拼团吧！'
          } else if (that.groupType === -1) {
            that.tips = '您暂时没有拼团失败的商品，赶快去开团或拼团吧！'
          } else {
            that.tips = '您暂时没有拼团中的商品，赶快去开团或拼团吧！'
          }
          that.loading = true
          that.orderList = []
          that.total = 0
        }
      })
    },
    loadMore() {
      console.log(1)
      let that = this
      that.loading = true
      let info = {
        status: that.groupType,
        p: ++that.p,
        limit: that.limit
      }
      getMyGroupList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data === null) {
            res.data = []
            that.loading = true
          }
          that.orderList = that.orderList.concat(res.data)
          that.total = res.total
          that.loading = false
          // if (parseInt(that.total) === parseInt(that.orderList.length) && parseInt(that.total) > 0) {
          //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
          // }
        }
      })
      // that.$refs.loadmore.onBottomLoaded()
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .mytryOut {
    /* font-family: SimHei; */
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .tryOut_body {
    height: 100%;
  }

  .try_nav {
    height: 90/100rem;
    background: #f6f6f6;
    width: 100%;
    z-index: 50;
    position: fixed;
    top: 0.9rem;
  }

  .try_nav span {
    width: 24%;
    display: inline-block;
    color: #999;
    font-size: 32/100rem;
    text-align: center;
    border-bottom: 4/100rem solid transparent;
    border-top: 4/100rem solid transparent;
    height: 82/100rem;
    line-height: 82/100rem;
  }

  .try_nav .text_active {
    border-bottom: 4/100rem solid #e21f11;
    color: #333;
  }

  .sale_pro {
    background: #fff;
    margin: 16/100rem 30/100rem;
  }
  .order_list{
        height: calc(100vh - 1.78rem);
    overflow-y: scroll;
  }
  .order_list .proInfo {
    padding: 26/100rem;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
    /* margin: 20/100rem 0; */
    background: #fff;
    position: relative;
  }

  .order_status {
    position: absolute;
    top: 3%;
    right: 3%;
  }

  .order_status .iconfont {
    font-size: 120/100rem;
    color: #999;
  }

  .order_status .iconred {
    color: #e21f11;
  }

  .order_status .icongreen {
    color: #12c343;
  }

  .sale_pro .pro_img {
    float: left;
    /* margin-left: 18/100rem; */
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 190/100rem;
    vertical-align: middle;
  }

  .sale_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 24/100rem;
    color: #444;
    margin: 10/100rem 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 75%;
  }

  .pro_info .pro_spec {
    /* width: 490/100rem; */
    overflow: hidden;
    /* height: 64/100rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6/100rem;
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    /* width: 240/100rem; */
    display: flex;
    align-items: center;
  }

  .pro_price .iconfont {
    font-size: 38/100rem;
    display: inline-flex;
    color: #ff8d97;
  }

  .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_price .pro_integral {
    font-size: 24/100rem;
    /* color: #ff8d97; */
    color: #ff8d97;
    margin-left: 8/100rem;
    margin-right: 20/100rem;
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: flex-end;
    margin-left: 9/100rem;
    /* margin-right: 30/100rem; */
  }

  .pro_price .pro_inter_img img {
    width: 24/100rem;
    height: 20/100rem;
  }

  .pro_info .pro_orig {
    font-size: 22/100rem;
    color: #b8b8b8;
    margin-left: 6/100rem;
  }

  .pro_info .pro_orig span {
    text-decoration: line-through;
  }

  .sale_pro .pro_btn {
    text-align: right;
    padding: 14/100rem 10/100rem;
  }

  .sale_pro .pro_btn button {
    margin-right: 16/100rem;
    border: 1px solid #808080;
    border-color: #f06b90;
    color: #f06b90;
    background: transparent;
    border-radius: 20/100rem;
    font-size: 26/100rem;
    width: 180/100rem;
    padding: 4/100rem 26/100rem;
    line-height: 1.6;
    display: inline-flex;
    justify-content: center;
  }

  .cou_tips {
    text-align: center;
    margin-top: 120/100rem;
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

</style>
