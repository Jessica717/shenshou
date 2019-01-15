<template>
  <div>
    <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
    <!-- 返回顶部按钮 -->
    <return-top @returnTop='goTop'></return-top>
    <div class='sale_height' id='flash'></div>
    <div class="sale" v-if='isShow'>
      <div class='sale_body'>
        <div class='sale_banner'>
          <img :src='headImg' />
        </div>
        <div class='sale_tab'>
          <div :class="item.id==choseId?'sale_nav sale_active':'sale_nav'" v-for='(item,index) in timeList' :key='index'
            @click='choseList(item)'>
            <span class='sale_time'>{{item.fromtime}}</span>
            <span class='sale_states'>{{item.salesname}}</span>
          </div>
        </div>
        <div class='sale_title' v-if='saleProList.length>0'>
          <div class='sale_left'>
            <span>低价风暴 闪电促销</span>
          </div>
          <div class='sale_right' v-if='endTimes>0'>
            <i class='iconfont icon-jinriqianggou'></i>
            <span v-if='chose_status==0'>距离下场开始：</span>
            <span v-if='chose_status==1'>距离本场开始：</span>
            <span class='time'>{{saleTime.hou}}:{{saleTime.min}}:{{saleTime.sec}}</span>
          </div>
        </div>
        <!-- <mt-loadmore :bottom-method="loadMore" class='sale_list' v-if='saleProList.length>0' :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false' :bottomDistance='60' :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'"> -->
        <div class='sale_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30">
          <div class='sale_pro' v-for="(item,index) in saleProList" :key="index">
            <div class='pro_img' @click="goPro('flash',item.goods_id)">
              <img :src='item.img' v-lazy="item.img" />
            </div>
            <div class='pro_info'>
              <div class='pro_title' @click="goPro('flash',item.goods_id)">
                {{item.name}}</div>
              <div class='pro_progress'>
                <div class='prog'>
                  <div :style="{width:item.count_num/item.store*100+'%'}" v-if='item.count_num/item.store*100<100'></div>
                  <div style='width:100%' v-if='item.count_num/item.store*100>=100'></div>
                </div>
                <span>已抢{{item.count_num}}份</span>
              </div>
              <div class='pro_spec'>
                <div class='pro_price'>
                  <div class='pro_inter_img' v-if='item.deal_type!=2'>
                    <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}} </span>
                    <span class='pro_integral' v-if='item.deal_type>=4'>+</span>
                    <i class='iconfont icon-jifen1' v-if='item.deal_type!=1&&item.deal_type!=3'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>

                </div>
                <div style='display:flex;justify-content:space-between;align-items:center;'>
                  <div style='font-size:0.12rem;display:inline-flex;'>
                    <span class='pro_orig'>{{item.price_market_from}}:</span>
                    <span class='pro_orig line'>¥{{item.price_market}}</span>
                  </div>
                  <div class='pro_icon'>
                    <mt-button size="small" @click="goPro('flash',item.goods_id)" v-if='status==0' class='active'>立即抢购</mt-button>
                    <mt-button size="small" @click="goPro('flash',item.goods_id)" v-if='status==1' class='start'>未开场</mt-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <!-- </mt-loadmore> -->
        <div class='more_load' v-if='!loading'>
          <mt-spinner type="fading-circle"></mt-spinner>
        </div>
        <div class='list_bottom' v-if='saleProList.length==total&&total>0'>—————— 我是有底线的 ——————</div>
        <div class='sale_list_null' v-if='saleProList.length==0'>
          <span>当前时段下暂无商品抢购，敬请期待</span>
        </div>
        </div>

      </div>
      <div class='null_height'></div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload
} from 'mint-ui'
import {
  getSaleTime,
  getSaleList
} from '@/api/index'
import {
  countDown
} from '@/store/pubilc.js'
export default {
  name: 'Flash',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '限时抢购',
      newNews: false,
      total_amout: 0,
      isShow: false,
      headImg: '',
      choseTime: 1,
      choseId: '',
      timeList: [],
      leftLength: 0,
      blocklist: [],
      saleProList: [],
      total: 0,
      wxTimerList: {},
      timeid: '',
      page: 1,
      pagesize: 4,
      endTimes: 0,
      endShow: false,
      chose_status: '',
      status: '',
      loading: false,
      time: '', // 定时器
      endTime: '', // 倒计时秒数
      saleTime: {} // 倒计时时分秒数组
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取促销时段列表
    this.getTimeList()
  },
  methods: {
    golink: function (e) {
      //   wx.navigateTo({
      //     url: '../flashSalelist/flashSalelist?type=1&id=' + e.currentTarget.id + '&timeId=' + this.timeid + '&status=' + this.chose_status
      //   })
    },
    goPro(type, id) {
      this.$router.togo({
        path: '/proDetail?type=' + type + '&id=' + id
      })
    },
    choseList: function (e) {
      clearInterval(this.time)
      Indicator.open('加载中...')
      console.log(e)
      this.choseId = e.id
      this.timeid = e.id
      this.page = 1
      this.pagesize = 4
      this.endShow = this.endShow
      this.chose_status = e.status
      for (var i = 0, len = this.timeList.length; i < len; i++) {
        if (this.timeList[i].id === e.id) {
          this.status = this.timeList[i].status
          this.endTimes = this.timeList[i].countdown
          var endtime = this.timeList[i].countdown
          this.saleTime = countDown(endtime)
          this.time = setInterval(function () {
            --endtime
            this.saleTime = countDown(endtime)
          }.bind(this), 1000)
        }
      }
      this.getTimeList()
    },
    getTimeList: function () {
      var info = {
        timeid: this.timeid,
        page: this.page,
        pagesize: this.pagesize
      }
      getSaleTime(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          this.isShow = true
          this.h_title = res.data.title
          this.headImg = res.data.bgimg
          this.timeList = res.data.time_list
          this.blocklist = res.data.type_list.rows
          this.total = res.data.type_list.total
          if (this.choseId === '') {
            for (var i = 0, len = this.timeList.length; i < len; i++) {
              if (res.data.time_list[i].checked !== undefined) {
                this.choseTime = i - 1
                this.firstChose = res.data.time_list[i].id
                this.choseId = res.data.time_list[i].id
                this.endTimes = res.data.time_list[i].countdown
                this.endShow = true
                this.timeid = res.data.time_list[i].id
                this.status = res.data.time_list[i].status
              }
            }
            if (this.endTimes > 0) {
              var endtime = this.endTimes
              this.saleTime = countDown(endtime)
              this.time = setInterval(
                function () {
                  --endtime
                  this.saleTime = countDown(endtime)
                }.bind(this),
                1000
              )
            }
          }
          this.getList()
        }
      })
    },
    getList: function () {
      var info = {
        timeid: this.choseId,
        page: this.page,
        pagesize: this.pagesize
      }
      let that = this
      getSaleList(info).then(res => {
        if (res.isSuccess) {
          that.saleProList = res.data.list.rows
          that.total = res.data.list.total
          that.loading = false
          setTimeout(function() {
            if ((parseInt(that.total) === parseInt(that.saleProList.length) && parseInt(that.total) > 0) || parseInt(that.total) === 0) {
              that.loading = true
              // document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            } else {
              // document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
            }
          }, 100)
        }
      })
    },
    loadMore() {
      let that = this
      that.loading = true
      // 加载更多数据
      that.page = ++that.page
      console.log('更多架子啊')
      var info = {
        timeid: that.choseId,
        page: that.page,
        pagesize: that.pagesize
      }
      getSaleList(info).then(res => {
        if (res.isSuccess) {
          if (res.data.list.rows !== null && res.data.list.rows.length > 0) {
            that.saleProList = that.saleProList.concat(res.data.list.rows)
            that.total = res.data.list.total
            that.loading = false
            if (parseInt(that.total) === parseInt(that.saleProList.length) && parseInt(that.total) > 0) {
              that.loading = true
              // document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            }
          } else {
            that.loading = true
          }
        }
      })

      this.$refs.loadmore.onBottomLoaded()
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('flash').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  },
  beforeDestroy() {
    // this.$refs.slider.$emit('autoplayStop')
    clearInterval(this.time)
  }
}
</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .sale_height {
    height: 0.9rem;
  }

  .sale {
    position: relative;
  }

  .sale_white {
    background: #fff;
  }

  .sale_body {
    height: 100%;
    background: #fff;
  }

  .sale_body .sale_banner {
    height: 450/100rem;
  }

  .sale_body .sale_banner img {
    height: 450/100rem;
    width: 100%;
  }

  .sale_body .sale_tab {
    height: 100/100rem;
    white-space: nowrap;
    display: flex;
    background: #000;
  }

  .sale_tab .sale_nav {
    /* overflow: hidden; */
    /* float: left; */
    display: inline-block;
    text-align: center;
    position: relative;
    /* height: 120/100rem; */
    width: 33%;
    background: #000;
    /* height: 100/100rem; */
    padding: 17/100rem 0;
  }

  .sale_tab .sale_active {
    background: #ff8d97;
    /* font-weight: bold;
  height: 82/100rem; */
    border-top-left-radius: 20/100rem;
    border-top-right-radius: 20/100rem;
  }

  .sale_nav span {
    display: block;
    text-align: center;
    color: #fff;
    margin: 0;
    padding: 0;
  }

  .sale_tab .sale_nav img {
    height: 48/100rem;
    width: 16/100rem;
    transform: rotate(90deg);
    position: absolute;
    bottom: -8/100rem;
  }

  .sale_nav .sale_time {
    font-size: 36/100rem;
    /* font-weight: bold; */
    font-family: "DIN";
  }

  .sale_nav .sale_states {
    font-size: 24/100rem;
    margin-top: -2/100rem;
  }

  .sale_tab .sale_active .sale_time {
    font-family: "DIN";
    color: #fff;
    /* padding-top: 16/100rem; */
    /* color: #fffc00; */
  }

  .sale_tab .sale_active .sale_states {
    /* color: #fffc00; */
    color: #fff;
  }

  .sale_title {
    padding: 50/100rem 26/100rem;
    /* height: 98/100rem; */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sale_left span {
    font-size: 30/100rem;
    color: #ff8d97;
  }

  .sale_right {
    font-size: 28/100rem;
    color: #000;
    display: flex;
    align-items: center;
  }

  .sale_right icon {
    /* transform: rotate(-30deg); */
    color: #000;
    margin-right: 6/100rem;
    display: inline-flex;
  }

  .sale_right .time {
    font-family: "DIN";
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #f56e92;
    width: 120/100rem;
  }

  .sale_body_list .sale_list {
    // padding: 0 20/100rem;
    max-height: calc(100vh - 2.66rem);
    overflow: scroll;
  }

  .sale_list {
    padding: 0 26/100rem;
    /* background: #fff; */
  }

  .sale_list .sale_pro {
    height: 342/100rem;
    background: #fff;
    /* border-bottom: 1px solid #ebebeb; */
    display: flex;
    align-items: center;
    /* background: #fff; */
    border-radius: 12/100rem;
    box-shadow: 0 3/100rem 4/100rem 2/100rem #e4e4e4;
    padding: 0 40/100rem;
    margin-bottom: 30/100rem;
  }

  .sale_pro .pro_img {
    float: left;
    /* margin-left: 18/100rem; */
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 260/100rem;
    height: 260/100rem;
  }

  .sale_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 30/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    min-height: 64/100rem;
  }

  .pro_title .pro_level {
    width: 80/100rem;
    border: 2/100rem solid #ff8d97;
    border-radius: 16/100rem;
    display: inline-flex;
    align-items: center;
    margin-right: 6/100rem;
    padding: 0 4/100rem;
    justify-content: center;
  }

  .pro_level .iconfont {
    color: #ff8d97;
    display: inline-flex;
  }

  .pro_level span {
    color: #ff8d97;
  }

  .pro_info .pro_progress {
    height: 30/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30/100rem 0;
  }

  .pro_progress .prog {
    width: 220/100rem;
    /* height: 15/100rem; */
    height: 20/100rem;
    background: #ebebeb;
    /* border: 2/100rem solid #ff8d97; */
    /* background: #ffc4d5; */
    border-radius: 10/100rem;
  }

  .pro_progress .prog div {
    width: 60%;
    height: 20/100rem;
    background: #ff8d97;
    border-radius: 10/100rem;
  }

  .pro_progress span {
    color: #999;
    font-size: 20/100rem;
    font-family: "DIN";
  }

  .pro_info .pro_spec {
    /* width: 490/100rem; */
    overflow: hidden;
    /* height: 74/100rem; */
    /* display: flex;
  align-items: center;
  justify-content: space-between; */
  }

  .pro_spec .pro_price {
    font-family: "DIN";
    /* width: 240/100rem; */
    display: flex;
    align-items: center;
    margin-bottom: 20/100rem;
  }

  .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    /* font-weight: bold; */
    /* margin-left: 8/100rem; */
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    /* align-items: flex-end; */
    align-items: center;
    /* margin-left: 9/100rem; */
    /* margin-right: 30/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    display: inline-flex;
    color: #ff8d97;
  }

  /* .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

  .pro_spec .pro_orig {
    font-size: 20/100rem;
    color: #989898;
  }

  .pro_spec .line {
    text-decoration: line-through;
    // margin-left: 6/100rem;
  }

  .pro_spec .pro_icon {
    // margin-right: 4/100rem;
    display: flex;
  }

  .pro_icon img {
    width: 50/100rem;
    height: 46/100rem;
  }

  .pro_icon .active {
    width: 160/100rem;
    height: 52/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 24/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 52/100rem;
    /* border-radius: 50/100rem; */
    border-radius: 12/100rem;
  }

  .pro_icon .start {
    width: 160/100rem;
    height: 52/100rem;
    background: #d3d3d3;
    color: #fff;
    font-size: 24/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 52/100rem;
    /* border-radius: 50/100rem; */
    border-radius: 12/100rem;
  }

  .sale_body_list .sale_tab {
    height: 120/100rem;
  }

  .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .sale_list_null {
    text-align: center;
    font-size: 30/100rem;
    /* font-weight: bold; */
    padding: 40/100rem 0;
    background: #f2f2f2;
  }

  /* .sale_list .sale_blcok {
  height: 430/100rem;
  margin-bottom: 20/100rem;
}

.sale_blcok img {
  width: 100%;
  height: 348/100rem;
}

.sale_blcok .sale_blcok_title {
  height: 80/100rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26/100rem;
  padding-left: 14/100rem;
  padding-right: 26/100rem;
}

.sale_blcok_title .sale_btn {
  width: 184/100rem;
  height: 44/100rem;
  line-height: 44/100rem;
  border: 2/100rem solid #ea3364;
  color: #ea3364;
  font-size: 24/100rem;
  background: #fff;
  border-radius: 10/100rem;
  text-align: center;
  padding: 8/100rem 16/100rem;
}

.sale_blcok_title .sale_name {
  color: #424242;
  text-align: center;
  margin-left: 20/100rem;
}

.sale_blcok_title .sale_date {
  color: #999;
  text-align: center;
} */
  .more_load {
    display: flex;
    justify-content: center;
  }

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    background: #f2f2f2;
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  /* 空白的块，解决底部导航占领高度 */

  .null_height {
    height: 100/100rem;
    background: #f2f2f2;
  }
</style>
