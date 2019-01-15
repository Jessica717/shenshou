<template>
  <div>
    <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
    <!-- 返回顶部按钮 -->
    <return-top @returnTop='goTop'></return-top>
    <div class='try_height' id='try'></div>
    <div class="try_out" v-if='isShow'>
      <div class='try_body'>
        <div class='try_headbg'>
          <img :src='tryImg' />
        </div>
        <div class='sale_tab'>
          <div :class="item.id==choseId?'sale_nav sale_active':'sale_nav'" v-for='(item,index) in timeList' :key='index'
            @click='choseList(item)'>
            <span class='sale_time'>{{item.time_title}}</span>
            <span class='sale_states'>{{item.salesname}}</span>
          </div>
        </div>
        <div class='tryList' v-if='tryList.length>0'>
          <div class='try_blcok' v-for='(item,index) in tryList' :key='index'>
            <div class='t_b_img' @click='showDetail(item.id)' >
              <img :src='item.img' />
            </div>
            <div class='t_b_info'>
              <div class='t_b_title' @click='showDetail(item.id)' >{{item.name}}</div>
              <div>
                <div class='t_b_info_left'>
                  <div class='t_b_other'>
                    <div style='font-size:0.23rem;color:#ff8d97;'>
                      <span class='t_b_price'>¥{{item.price}}</span>
                    </div>
                    <div style='margin-bottom:0.3rem;'>
                      <span class='text_bg'>限领</span>
                      <span class='t_b_num'>{{item.num}}份</span>
                    </div>
                  </div>
                </div>
                <div class='t_b_info_right'>
                  <div style='font-size:0.18rem;color:#707070;'>
                    <span class='t_b_num'>{{item.count}}</span>
                    <span>人已申领</span>
                  </div>
                  <mt-button size='small' @click='showDetail(item.id)' v-if='item.status==0' class='start'>未开始</mt-button>
                  <mt-button size='small' @click='showDetail(item.id)' v-if='item.status==1' class='running'>免费申领</mt-button>
                  <mt-button size='small' @click='showDetail(item.id)' v-if='item.status==2' class='end'>已结束</mt-button>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class='tryList' v-if='boostList.length>0'>
          <img src='@/assets/img/pro/zhuli.png' style='width:1.58rem;height:0.56rem;margin-bottom:0.2rem;' />
          <div class='try_blcok' v-for='(item,index) in boostList' :key='index'>
            <div class='t_b_img' @click='showDetail(item.id)' >
              <img :src='item.img' />
            </div>
            <div class='t_b_info'>
              <div class='t_b_title' @click='showDetail(item.id)' >{{item.name}}</div>
              <div>
                <div class='t_b_info_left'>
                  <div class='t_b_other'>
                    <div style='font-size:0.23rem;color:#ff8d97;'>
                      <span class='t_b_price'>¥{{item.price}}</span>
                    </div>
                    <div style='margin-bottom:0.3rem;'>
                      <span class='text_bg'>限领</span>
                      <span class='t_b_num'>{{item.num}}份</span>
                    </div>
                  </div>
                </div>
                <div class='t_b_info_right'>
                  <div style='font-size:0.18rem;color:#707070;'>
                    <span class='t_b_num'>{{item.count}}</span>
                    <span>人已申领</span>
                  </div>
                  <mt-button size='small' @click='showDetail(item.id)' v-if='item.status==0' class='start'>未开始</mt-button>
                  <mt-button size='small' @click='showDetail(item.id)' v-if='item.status==1' class='running'>免费申领</mt-button>
                  <mt-button size='small' @click='showDetail(item.id)' v-if='item.status==2' class='end'>已结束</mt-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class='more_load' v-if='!loading'>
          <mt-spinner type="fading-circle"></mt-spinner>
        </div> -->
        <div class='list_bottom' v-if='loading'>—————— 我是有底线的 ——————</div>
        <!-- <div class='sale_list_null' v-if='tryList.length==0'>
          <span>当前时段下暂无商品抢购，敬请期待</span>
        </div> -->
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
  getTryList
} from '@/api/index'
import {
  countDown
} from '@/store/pubilc.js'
export default {
  name: 'Try',
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
      h_title: '试用体验',
      newNews: false,
      total_amout: 0,
      isShow: false,
      tryImg: '',
      choseTime: 1,
      choseId: '',
      timeList: [],
      tryList: [],
      boostList: [],
      leftLength: 0,
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
    this.getList()
  },
  methods: {
    golink: function (e) {
      //   wx.navigateTo({
      //     url: '../flashSalelist/flashSalelist?type=1&id=' + e.currentTarget.id + '&timeId=' + this.timeid + '&status=' + this.chose_status
      //   })
    },
    showDetail(id) {
      //   wx.navigateTo({
      //     url: e.currentTarget.dataset.link
      //   })
      this.$router.togo({
        path: '/tryDetail?id=' + id + '&form_share=0&help_id=null'
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
    },
    getList: function () {
      var info = {
        timeid: this.choseId
      }
      getTryList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (this.choseId === '') {
            for (var i = 0; i < res.data.sales_type.length; i++) {
              if (res.data.sales_type[i].check === 1) {
                this.choseId = res.data.sales_type[i].id
              }
            }
          }
          this.timeList = res.data.sales_type
          this.tryImg = res.data.try_bgimg
          this.isShow = true
          this.tryList = res.data.try_list
          this.boostList = res.data.help_list
        }
      })
    },
    // loadMore() {
    //   this.loading = true
    //   // 加载更多数据
    //   this.page = ++this.page
    //   console.log('更多架子啊')
    //   var info = {
    //     timeid: this.choseId,
    //     page: this.page,
    //     pagesize: this.pagesize
    //   }
    //   getSaleList(info).then(res => {
    //     if (res.isSuccess) {
    //       if (res.data.list.rows.length > 0) {
    //         this.saleProList = this.saleProList.concat(res.data.list.rows)
    //         this.total = res.data.list.total
    //         this.loading = false
    //       } else {
    //         this.loading = true
    //       }
    //     }
    //   })
    // },
    goTop() {
      console.log('回到顶部')
      document.getElementById('try').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  },
  beforeDestroy() {
    // this.$refs.slider.$emit('autoplayStop')
    // clearInterval(this.time)
  }
}
</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .try_height {
    height: 0.9rem;
  }

  .try_out {
    position: relative;
  }

  .sale_white {
    background: #fff;
  }

  .try_body {
    height: 100%;
    background: #fff;
  }

  .try_body .try_headbg {
    height: 450/100rem;
  }

  .try_body .try_headbg img {
    height: 450/100rem;
    width: 100%;
  }

  .try_body .sale_tab {
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
    padding: 0 20/100rem;
  }

  .tryList {
    padding: 0 26/100rem;
    background: #fff;
  }

  .tryList .try_blcok {
    height: 342/100rem;
    background: #fff;
    display: flex;
    align-items: center;
    border-radius: 12/100rem;
    box-shadow: 0 3/100rem 4/100rem 2/100rem #e4e4e4;
    padding: 0 40/100rem;
    margin-bottom: 30/100rem;
  }

  .try_blcok .t_b_img {
    float: left;
    /* margin-top: 40/100rem; */
    /* margin-left: 18/100rem; */
    margin-right: 36/100rem;
    position: relative;
  }

  .try_blcok .t_b_img img {
    width: 260/100rem;
    height: 260/100rem;
  }

  .try_blcok .t_b_img text {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 26/100rem;
    width: 190/100rem;
    text-align: center;
    padding: 10/100rem 0;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
  }

  .try_blcok .t_b_info {
    width: 320/100rem;
  }

  .t_b_info .t_b_title {
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-bottom: 30/100rem;
  }

  .t_b_title .pro_level {
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

  .pro_level text {
    color: #ff8d97;
  }

  .t_b_info_left .t_b_other {
    text-align: left;
    /* margin-top: 10/100rem; */
  }

  .t_b_info_left .t_b_other .text_bg {
    width: 64/100rem;
    height: 26/100rem;
    line-height: 26/100rem;
    background: #ff8d97;
    color: #fff;
    display: inline-block;
    text-align: center;
    font-size: 20/100rem;
    border-radius: 8/100rem;
  }

  .t_b_other div {
    font-family: "DIN";
    display: flex;
    align-items: center;
  }

  .t_b_other .t_b_price {
    font-size: 36/100rem;
    /* margin-right: 26/100rem; */
    margin-bottom: 30/100rem;
  }

  .t_b_other .t_b_num {
    color: #888;
    margin: 0 4/100rem;
    font-size: 20/100rem;
  }

  .t_b_info_right {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 320/100rem;
  }

  .t_b_info_right button {
    min-width: 150/100rem;
    height: 52/100rem;
    color: #fff;
    font-size: 26/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 52/100rem;
    border-radius: 12/100rem;
    margin: 0;
  }

  .t_b_info_right .running {
    background: #ff8d97;
  }

  .t_b_info_right .start {
    background: #c6c6c6;
  }

  .t_b_info_right .end {
    background: #d3d3d3;
  }

  .t_b_info_right button::after {
    border: none;
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
