<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div class='my_gift'>
      <return-top @returnTop='goTop'></return-top>
      <div id='gift' style='height:0.9rem'></div>
      <div class='gift_nav'>
        <span @click="viewGift('2')" :class="giftType=='2'?'text_active':''">待领取</span>
        <span @click="viewGift('1')" :class="giftType=='1'?'text_active':''">已领取</span>
      </div>
      <div style='height:0.9rem'></div>
      <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false' :bottomDistance='100'
        :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'" v-if='giftList.length>0' class='gift_info'> -->
      <!-- v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30"  :style="{height:screenHeight+'rem'}"-->
      <div class='gift_info' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
        infinite-scroll-distance="30">
        <div class='info' v-for='(item,index) in giftList' :key='index'>
          <i class='iconfont icon-jifen' v-if='item.lottery_type==2'></i>
          <i class='iconfont icon-youhuiquan' v-if='item.lottery_type==3'></i>
          <i class='iconfont icon-shangpin' v-if='item.lottery_type==1'></i>
          <span>{{item.name}}</span>
          <button size='mini' class='btn_red' v-if='item.status==0' @click='usegift(item.id,item.lottery_id,item.lottery_type)'>立即领取</button>
          <button size='mini' class='btn_red' v-if='item.status==1'>已领取</button>
          <button size='mini' class='btn_red' v-if='item.status==2'>已下单</button>
          <button size='mini' class='btn_red' v-if='item.status==3'>已取消</button>
          <button size='mini' class='btn_red' v-if='item.status==4'>已过期</button>
        </div>
        <div class='more_load' v-if='!loading'>
          <mt-spinner type="fading-circle"></mt-spinner>
        </div>
        <!-- <button type="default" size="default" loading plain hidden='giftList.length==total' style="border:none;background:#f2f2f2">加载中...</button> -->
        <div class='list_bottom' v-if='total>0&&giftList.length>0'>—————— 我是有底线的 ——————</div>
        <div class='center' v-if='giftList.length==0'>
          <span class='gift_tips'>当前分类暂无数据</span>
        </div>
      </div>
      <!-- </mt-loadmore> -->
    </div>
    <div class='goIndex' @click='goIndex'>
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
  Toast
} from 'mint-ui'
import {
  getGiftList,
  addCarofNormal,
  getGift
} from '@/api/index'
export default {
  name: 'MyGift',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Spinner,
    Toast
  },
  data() {
    return {
      h_title: '我的赠品',
      allowbind: true,
      giftType: '2',
      page: 1,
      limit: 30,
      total: 0,
      giftList: [],
      proType: 'scan',
      loading: true,
      screenHeight: (document.documentElement.clientHeight - 50) / 50
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取促销时段列表
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('gift').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getList: function () {
      var that = this
      let info = {
        p: that.page,
        limit: that.limit,
        type: that.giftType
      }
      getGiftList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data == null) {
            res.data = []
            that.loading = true
          }
          that.giftList = res.data
          that.total = res.total
          that.loading = false
          // setTimeout(function () {
          //   if ((parseInt(that.total) === parseInt(that.giftList.length) && parseInt(that.total) > 0) ||
          //       parseInt(that.total) === 0) {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
          //   } else {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
          //   }
          // }, 100)
        }
      })
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        p: ++that.page,
        limit: that.limit,
        type: that.giftType
      }
      getGiftList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data === null) {
            res.data = []
          }
          that.loading = true
        } else {
          that.giftList = that.giftList.concat(res.data)
          that.total = res.total
          that.loading = false
          // if ((parseInt(that.total) === parseInt(that.giftList.length) && parseInt(that.total) > 0)) {
          //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
          // } else {
          //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
          // }
        }
      })
      // that.$refs.loadmore.onBottomLoaded()
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    viewGift(id) {
      Indicator.open('加载中...')
      this.giftType = id
      this.loading = true
      this.giftList = []
      this.page = 1
      this.getList()
    },
    usegift(id, pid, type) {
      if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
        this.$router.replace({
          path: '/bind?visit=4'
        })
      } else {
        if (this.allowbind) {
          var that = this
          that.allowbind = false
          if (type === 1 || type === '1') {
            // 实物领取
            let info = {
              pid: pid,
              num: 1,
              goods_id: '',
              deal_type: '',
              type: 'scan',
              lottery_id: pid
            }
            addCarofNormal(info).then(res => {
              if (res.isSuccess) {
                that.$router.togo({
                  path: '/sureOrder?id=' + id + '&addType=3'
                })
              } else {
                that.allowbind = true
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            getGift(id).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: res.msg,
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.page = 1
                  that.allowbind = true
                  that.getList()
                }, 1000)
              } else {
                that.allowbind = true
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          }
        }
      }
    }
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .my_gift {
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .gift_nav {
    background: #f6f6f6;
    height: 90/100rem;
    width: 100%;
    position: fixed;
    top: 0.9rem;
    z-index: 50;
  }

  .gift_nav span {
    width: 49%;
    display: inline-block;
    color: #999;
    font-size: 32/100rem;
    text-align: center;
    border-bottom: 4/100rem solid transparent;
    border-top: 4/100rem solid transparent;
    height: 82/100rem;
    line-height: 82/100rem;
  }

  .gift_nav .text_active {
    border-bottom: 4/100rem solid #e21f11;
    color: #333;
  }

  .center {
    text-align: center;
    margin-top: 0.9rem;
  }

  .gift_tips {
    margin-top: 90/100rem;
    font-size: 24/100rem;
    color: #999;
  }

  .gift_info {
    overflow: scroll;
    padding: 30/100rem 14/100rem;
    padding-bottom: 0;
    height: calc(100vh - 1.78rem);
    overflow-y: scroll;
  }

  .gift_info .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 26/100rem;
    border-radius: 20/100rem;
    margin-bottom: 16/100rem;
  }

  .info .iconfont {
    font-size: 60/100rem;
    color: #999;
  }

  .info span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    margin-left: 10/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 400/100rem;
  }

  .info button {
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

  .info .btn_red {
    border-color: #f06b90;
    color: #f06b90;
    font-size: 24/100rem;
    margin-right: 0;
  }

  .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
    margin-top: -50/100rem;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
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

</style>
