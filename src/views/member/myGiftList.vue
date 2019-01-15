<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div class='my_gift'>
      <return-top @returnTop='goTop'></return-top>
      <div id='giftList' style='height:0.9rem'></div>
      <div class='gift_nav'>
        <span @click="viewGift('2')" :class="giftType=='2'?'text_active':''">待领取</span>
        <span @click="viewGift('1')" :class="giftType=='1'?'text_active':''">已领取</span>
      </div>
      <div style='height:0.9rem'></div>
      <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false'
        :bottomDistance='100' :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'" class='gift_info'
        v-if='giftList!=null'> -->
      <!-- v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" :infinite-scroll-immediate-check="false" infinite-scroll-distance="30"  :style="{height:screenHeight+'rem'}" -->
      <div class='gift_info' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30">
        <div class='info' v-for='(item,index) in giftList' :key='index'>
          <i class='iconfont icon-jifen' v-if='item.lottery_type==2'></i>
          <i class='iconfont icon-youhuiquan' v-if='item.lottery_type==3'></i>
          <i class='iconfont icon-shangpin' v-if='item.lottery_type==1'></i>
          <span class='win_time'>{{item.createtime}}</span>
          <span class='win_name'>{{item.name}}</span>
          <button size='mini' class='btn_red' v-if='item.get_status==1'>已领取</button>
          <button size='mini' class='btn_red' v-if='item.get_status==2' @click="goLink('../myOrder/myOrder?tid=1&id=type1')">待付款</button>
          <button size='mini' class='btn_red' v-if='item.get_status==3'>已取消</button>
          <button size='mini' class='btn_red' v-if='item.get_status==0' @click='winPro(item.pid,item.id)'>点击领取</button>
        </div>
        <div class='more_load' v-if='!loading'>
          <mt-spinner type="fading-circle"></mt-spinner>
        </div>
        <div class='center' v-if='giftList.length==0'>
          <span class='gift_tips'>当前分类暂无数据</span>
        </div>
        <div class='list_bottom' v-if='total>0&&giftList.length==total'>—————— 我是有底线的 ——————</div>
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
  Toast,
  Loadmore
} from 'mint-ui'
import {
  getPrizeList,
  addCarofNormal
} from '@/api/index'
import {
  parseTime
} from '@/store/pubilc.js'
export default {
  name: 'MyGiftList',
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
      h_title: '我的奖品列表',
      allowbind: true,
      giftType: '2',
      page: 1,
      limit: 10,
      total: 0,
      giftList: [],
      proType: 'exchange',
      loading: true,
      screenHeight: (document.documentElement.clientHeight - 50) / 50
    }
  },
  mounted() {
    console.log(this.$route)
    Indicator.open('加载中...')
    // 获取我的奖品列表
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('giftList').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getList() {
      var that = this
      let info = {
        page: that.page,
        type: that.giftType,
        limit: that.limit
      }
      getPrizeList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.rows === null) {
            res.data.rows = []
            that.loading = true
            that.total = 0
          } else {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(
                res.data.rows[i].createtime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            that.total = res.data.total
            that.loading = false
            console.log(that.loading)
          }
          that.giftList = res.data.rows
          // setTimeout(function () {
          //   if ((parseInt(that.total) === parseInt(that.giftList.length) && parseInt(that.total) > 0) ||
          //       parseInt(that.total) === 0) {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
          //   } else {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
          //   }
          // }, 100)
        } else {
          that.total = 0
          that.giftList = []
          that.loading = true
        }
      })
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        page: ++that.page,
        type: that.giftType,
        limit: that.limit
      }
      getPrizeList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.rows === null) {
            that.loading = true
            that.total = 0
            res.data.rows = []
          } else {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(
                res.data.rows[i].createtime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            that.total = res.data.total
            that.loading = false
            // if (parseInt(that.total) === parseInt(that.giftList.length) && parseInt(that.total) > 0) {
            //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            // } else {
            //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
            // }
          }
          that.giftList = that.giftList.concat(res.data.rows)
        } else {
          that.total = 0
          that.giftList = []
          that.loading = true
        }
      })
      // that.$refs.loadmore.onBottomLoaded()
    },
    goLink(link) {
      this.$router.togo({
        path: link
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    viewGift(id) {
      Indicator.open('加载中...')
      this.giftType = id
      this.page = 1
      this.loading = true
      this.giftList = []
      this.loading = true
      this.getList()
    },
    winPro(id, lid) {
      // 判断是否绑定手机
      if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
        this.$router.togo({
          path: '/bind?visit=4'
        })
      } else {
        var that = this
        if (this.allowbind) {
          that.allowbind = false
          let info = {
            pid: id,
            num: 1,
            type: 'exchange',
            lottery_id: lid
          }
          addCarofNormal(info).then(res => {
            if (res.isSuccess) {
              that.$router.togo({
                path: '/sureOrder?id=' + id + '&addType=3&proType=exchange'
              })
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

  // .gift_list {
  //   padding: 30/100rem 14/100rem;
  //   padding-bottom: 0;
  // }

  .gift_tips {
    margin-top: 90/100rem;
    font-size: 24/100rem;
    color: #999;
  }

  .gift_info {
    padding: 30/100rem 14/100rem;
    padding-bottom: 0;
    height: calc(100vh - 1.78rem);
    overflow-y: scroll;
    /* background: #fff;
  padding: 26/100rem;
  border-radius: 20/100rem; */
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

  .info .win_time {
    font-size: 24/100rem;
  }

  .info .win_name {
    font-size: 30/100rem;
    /* font-weight: bold; */
    margin-left: 10/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 360/100rem;
  }

  .info button {
    border: 1px solid #808080;
    border-color: #f06b90;
    color: #f06b90;
    background: transparent;
    border-radius: 20/100rem;
    font-size: 26/100rem;
    min-width: 160/100rem;
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
