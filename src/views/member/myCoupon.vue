<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div class='my_coupon'>
      <return-top @returnTop='goTop'></return-top>
      <div id='cou' style='height:0.9rem'></div>
      <div class='coupon_body'>
        <div class='coupon_nav'>
          <span @click='viewCouType(0)' :class="couType=='1'?'text_active':''">可使用</span>
          <span @click='viewCouType(1)' :class="couType=='2'?'text_active':''">已使用</span>
          <span @click='viewCouType(2)' :class="couType=='3'?'text_active':''">已失效</span>
        </div>
        <div style='height:0.9rem' ></div>
        <div class='cou_list' v-if='couList.length>0'>
          <div class='cou_info' v-for="(item,index) in couList" :key="index">
            <img src='@/assets/img/order/cop_bg.png' :hidden="couType!='1'" />
            <img src='@/assets/img/order/cop_bg_01.png' :hidden="couType=='1'" />
            <div class='cou_more'>
              <div class='cou_value'>￥
                <span>{{item.cashworth}}</span>
              </div>
              <div class='cou_more_tips'>
                <span v-if='item.order_price>0'>满{{item.order_price}}可用</span>
                <span v-if='item.order_price<=0'>无门槛通用</span>
              </div>
            </div>
            <div class='cou_tips'>
              <span class='cou_title'>{{item.title}}</span>
              <div :class="item.state==1?'cou_type_normal cou_type':'cou_type'">
                <span v-if='item.type_name!=null'>适用于:{{item.type_name}}{{item.content}}</span>
                <span v-if='item.type_name==null'>全类目通用{{item.content}}</span>
              </div>
              <div class='cou_time' :hidden="item.state!=1">
                <span>有效期至{{item.totime}}</span> </div>
              <div class='cou_time' :hidden="item.state!=3">
                <span>使用时间：{{item.usetime}}</span> </div>
              <div class='cou_time' :hidden="item.state!=2">
                <span>过期时间：{{item.totime}}</span> </div>
            </div>
            <div class='cou_states'>
              <i class='iconfont icon-yishixiao' v-if='item.state==2'></i>
              <i class='iconfont icon-yishiyong' v-if='item.state==3'></i>
            </div>
          </div>
        </div>
        <div class='cou_list' v-if='couList.length<=0' style='text-align:center;margin:0.3rem 0;'>
          <span class='nullTips'>当前分类下暂无优惠券</span>
        </div>
      </div>
      <div class='list_bottom' v-if='loading&&couList.length>0'>—————— 我是有底线的 ——————</div>
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
  Lazyload
} from 'mint-ui'
import {
  parseTime
} from '@/store/pubilc.js'
import {
  getMyCou
} from '@/api/index'
export default {
  name: 'MyCoupon',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload
  },
  data() {
    return {
      h_title: '我的优惠券',
      couList: [],
      viewList: [],
      page: 1,
      pagesize: 100,
      couType: '1',
      couTotal: 0,
      total: 0,
      useTotal: 0,
      loading: true
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取我的优惠券列表
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('cou').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    viewCouType(id) {
      Indicator.open('加载中...')
      if (id === 0) {
        this.couType = '1'
      } else if (id === 1) {
        this.couType = '2'
      } else if (id === 2) {
        this.couType = '3'
      }
      this.page = 1
      this.loading = true
      this.couList = []
      this.getList()
    },
    getList() {
      let info = {
        page: this.page,
        pagesize: this.pagesize,
        type: this.couType
      }
      var that = this
      getMyCou(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.couList = res.data.rows
          that.loading = false
          for (var i = 0; i < that.couList.length; i++) {
            that.couList[i].totime = parseTime(
              that.couList[i].totime,
              '{y}-{m}-{d}'
            )
            that.couList[i].createtime = parseTime(
              that.couList[i].createtime,
              '{y}-{m}-{d}'
            )
            if (that.couList[i].usetime != null) {
              that.couList[i].usetime = parseTime(
                that.couList[i].usetime,
                '{y}-{m}-{d}'
              )
            }
          }
        }
      })
    }
    // loadMore() {
    //   this.loading = true
    //   setTimeout(() => {
    //     let info = {
    //       page: ++this.page,
    //       pagesize: this.pagesize,
    //       type: this.couType
    //     }
    //     var that = this
    //     getMyCou(info).then(res => {
    //       Indicator.close()
    //       if (res.isSuccess) {
    //         if (res.data.rows !== null && res.data.rows.length > 0) {
    //           for (var i = 0; i < res.data.rows.length; i++) {
    //             res.data.rows[i].totime = parseTime(
    //               res.data.rows.totime,
    //               '{y}-{m}-{d}'
    //             )
    //             res.data.rows[i].createtime = parseTime(
    //               res.data.rows.createtime,
    //               '{y}-{m}-{d}'
    //             )
    //             if (res.data.rows.usetime != null) {
    //               res.data.rows.usetime = parseTime(
    //                 res.data.rows.usetime,
    //                 '{y}-{m}-{d}'
    //               )
    //             }
    //             that.couList = that.couList.concat(res.data.rows)
    //           }
    //           that.loading = false
    //         } else {
    //           that.loading = true
    //         }
    //       }
    //     })
    //     that.loading = true
    //   }, 1000)
    // }
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .my_coupon {
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .coupon_body {
    height: 100%;
  }

  .coupon_nav {
    height: 90/100rem;
    background: #f6f6f6;
    width: 100%;
    z-index: 50;
    position: fixed;
    top: 0.9rem;
  }

  .coupon_nav span {
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

  .coupon_nav .text_active {
    border-bottom: 4/100rem solid #e21f11;
    color: #333;
  }

  .cou_list {
    padding: 0 26/100rem;
    /* background: #f6f6f6; */
    height: 100%;
  }

  .nullTips {
    font-size: 30/100rem;
    color: #999;
  }

  .cou_info {
    margin-top: 16/100rem;
    background: #fff;
    height: 200/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .cou_info img {
    width: 240/100rem;
    height: 200/100rem;
  }

  .cou_info .cou_more {
    position: absolute;
    text-align: center;
    width: 240/100rem;
  }

  .cou_more .cou_value {
    font-size: 26/100rem;
    color: #fff;
    text-align: center;
  }

  .cou_value span {
    font-size: 90/100rem;
    font-family: "DIN";
    margin-left: -16/100rem;
  }

  .cou_more .cou_more_tips {
    text-align: center;
    margin-top: -19/100rem;
  }

  .cou_more_tips span {
    font-size: 22/100rem;
    color: #fff;
    margin-right: 8/100rem;
  }

  .cou_more_tips .iconfont {
    color: #fff;
    font-size: 20/100rem;
  }

  .cou_info .cou_tips {
    /* margin-right: 126/100rem; */
    float: left;
    width: 420/100rem;
  }

  .cou_info .cou_tips span {
    // display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .cou_info .cou_title {
    color: #444;
    font-size: 32/100rem;
  }

  .cou_info .cou_type {
    font-size: 24/100rem;
    margin: 10/100rem 0;
    width: 300/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 0.7rem;
  }

  .cou_info .cou_type_normal {
    width: 400/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .cou_info .cou_time {
    color: #999;
    font-size: 24/100rem;
    // margin: 15/100rem 0;
    /* width: 220/100rem; */
  }

  .cou_time span {
    /* float: right; */
    font-size: 26/100rem;
  }

  .cou_states {
    position: absolute;
    right: 0;
    top: 0;
  }

  .cou_states .iconfont {
    font-size: 120/100rem;
    color: #999;
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
