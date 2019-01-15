<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='single'></div>
    <div class="vip">
      <div class='vip_body_list'>
        <div class='vip_body'>
          <div class='vip_list'>
            <div class='vip_pro' v-for="(item,index) in vipList" :key="index">
              <div class='pro_img' @click="goPro('normal',item.goods_id)">
                <img :src='item.img' v-lazy="item.img"/>
              </div>
              <div class='pro_info'>
                <div class='pro_title' @click="goPro('normal',item.goods_id)">
                  {{item.name}}
                </div>
                <div class='pro_spec'>
                  <div class='pro_price'>
                    <div>
                      <div class='pro_nowprice'>
                        <span v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                        <span v-if='item.deal_type>=4'>￥{{item.price_sell}}</span>
                      </div>
                      <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                      <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                    </div>
                  </div>
                  <!-- 加入购物车 -->
                  <div class='pro_icon'>
                    <i class='iconfont icon-car' @click='addCar(item.product_id,item.deal_type,item.price_sell)'></i>
                  </div>
                </div>
              </div>
            </div>
            <div class='order-foot' v-if='vipList.length==0'>
              <span>暂无数据</span>
            </div>
          </div>
          <button type="default" size="default" loading plain :hidden='vipList.length==total' style="border:none;background:#f2f2f2">加载中...</button>
          <div class='order-foot' v-if='vipList.length==total&&total>0'>
            <span>—————— 我是有底线的 ——————</span>
          </div>
        </div>
        <div class='car_edit_more'>
          <div class='allCheck'>
            <div class='car_pro_total'>合计：
              <span>￥{{amount}}</span>
            </div>
            <span class='car_tips' v-if='difference>0'>还差{{difference}}元，可享包邮</span>
            <span class='car_tips' v-else>已满{{full_amount}}元享受包邮</span>
          </div>
          <mt-button size='small' @click="goCar('/car')">回购物车</mt-button>
        </div>
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
  getCarRecomList,
  addCarofPro
} from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
export default {
  name: 'Single',
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
      h_title: '凑单列表',
      height: '',
      topNum: 0,
      brandHeight: 0,
      allowScorll: true,
      isShow: false,
      hiddenFixed: true,
      vipDetail: 0,
      navNtn: 2,
      page: 1,
      pagesize: 6,
      vipList: [],
      vipBg: null,
      isSign: true,
      total: 0,
      top: 0,
      amount: 0.00,
      difference: 0.00,
      full_amount: 0.00,
      is_load: true
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // console.log(this.$route.query)
    this.amount = this.$store.state.home.carAmount
    this.difference = this.$store.state.home.difference
    this.full_amount = this.$store.state.home.carShip
    this.getList()
  },
  methods: {
    ...mapMutations({
      setCarPro: 'SET_CARPRO',
      setCarAmount: 'SET_CARAMOUNT',
      setCarDifference: 'SET_CARDIFFERENCE'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('single').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goPro(type, id) {
      this.$router.togo({
        path: '/proDetail?type=' + type + '&id=' + id
      })
    },
    goCar(url) {
      this.$router.togo({
        path: url
      })
    },
    addCar(id, type, price) {
      console.log(price)
      var that = this
      let info = {
        pid: id,
        quantity: 1,
        checked: 0,
        deal_type: type
      }
      addCarofPro(info).then(res => {
        if (res.isSuccess) {
          if (that.$store.state.home.carpro === '') {
            that.setCarPro([id])
          } else {
            var carList = that.$store.state.home.carpro
            for (var i = 0; i < carList.length; i++) {
              if (carList[i] === id) {
                break
              }
            }
            if (i >= carList.length) {
              carList.push(id)
            }
            that.setCarPro(carList)
          }
          that.amount = that.amount * 1000 + parseFloat(price) * 1000
          that.difference = that.difference * 1000 - parseFloat(price) * 1000
          that.amount = (that.amount / 1000).toFixed(2)
          that.difference = (that.difference / 1000).toFixed(2)
          that.setCarAmount(that.amount)
          that.setCarDifference(that.difference)
          Toast({
            message: '加入购物车成功',
            iconClass: 'iconfont icon-dui1',
            icon: 'success'
          })
          that.p = 1
          that.scoreNum = 0
          that.priceAll = 0
          that.getList()
        } else {
          Toast({
            message: res.msg,
            icon: 'success'
          })
        }
      })
      // var that = this
      // util.queryRequest('?m=cart&a=add', {
      //   pid: e.currentTarget.id,
      //   quantity: 1,
      //   checked: 0,
      //   deal_type: e.currentTarget.dataset.type
      // }, 'GET', function (res) {
      //   if (res.isSuccess) {
      //     if (wx.getStorageSync('chosePro') == '') {
      //       wx.setStorageSync('chosePro', [e.currentTarget.id])
      //     } else {
      //       var carList = wx.getStorageSync('chosePro')
      //       for (var i = 0; i < carList.length; i++) {
      //         if (carList[i] == e.currentTarget.id) {
      //           console.log(1)
      //           break
      //         }
      //       }
      //       if (i >= carList.length) {
      //         carList.push(e.currentTarget.id)
      //       }
      //       wx.setStorageSync('chosePro', carList)
      //     }
      //     that.data.amount = that.data.amount * 1000 + e.currentTarget.dataset.price * 1000
      //     that.data.difference = that.data.difference * 1000 - e.currentTarget.dataset.price * 1000
      //     that.setData({
      //       amount: (that.data.amount / 1000).toFixed(2),
      //       difference: (that.data.difference / 1000).toFixed(2)
      //     })
      //     wx.setStorageSync('carAmount', that.data.amount)
      //     wx.setStorageSync('difference', that.data.difference)
      //     wx.showToast({
      //       title: '加入购物车成功',
      //       icon: 'success'
      //     })
      //   } else {
      //     wx.showToast({
      //       title: res.msg,
      //       icon: 'none',
      //       duration: 1000
      //     })
      //   }
      // })
    },
    getList: function () {
      var that = this
      let info = {
        type: 0
      }
      // 查询购物车推荐商品
      getCarRecomList(info).then(res => {
        Indicator.close()
        that.isShow = true
        if (res.isSuccess) {
          console.log(res)
          that.vipList = res.data
          that.total = res.total
        }
      })
    }
  },
  computed: {
    ...mapGetters(['number'])
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .vip {
    position: relative;
    /* background: #fff; */
  }

  .bodyLock {
    /* top: 0px;
  left: 0px; */
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    z-index: 0;
  }

  .vip_body_list {
    /* height: 100%; */
    overflow: hidden;
    margin-bottom: 100/100rem;
  }

  .vip_body {
    position: relative;
    /* background: #f7f7f7; */
    /* margin-bottom: 120/100rem; */
  }

  /* 筛选 */

  .red_fifter {
    /* height: 66/100rem;
  line-height: 66/100rem; */
    margin-bottom: 20/100rem;
    background: #fff;
    padding: 10/100rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .red_fifter_fixed {
    position: fixed;
    width: 100%;
    top: 0/100rem;
    z-index: 50;
    padding: 0;
    /* padding-top: 20/100rem; */
  }

  .red_fifter .fifter_sort {
    /* padding: 0 40/100rem; */
    width: 25%;
    border-right: 2/100rem solid #e4e4e4;
    line-height: 63/100rem;
  }

  .red_fifter_fixed div {
    border-bottom: 2/100rem solid #e4e4e4;
    border-top: 2/100rem solid transparent;
  }

  .red_fifter .fifter_brand {
    border-top: 2/100rem solid #e4e4e4;
    border-bottom: 2/100rem solid #fff;
  }

  .red_fifter .fifter_brand_active {
    color: #eb3d6e;
  }

  .red_fifter div:last-child {
    border-right: none;
  }

  .red_fifter div span {
    font-size: 26/100rem;
    color: #323232;
  }

  .fifter_sort {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 68/100rem;
  }

  .fifter_sort .iconfont {
    font-size: 32/100rem;
  }

  .fifter_sort .fifter_icon {
    position: relative;
    width: 40/100rem;
    border: none;
    height: 60/100rem;
  }

  .fifter_icon .iconfont {
    position: absolute;
    font-size: 40/100rem;
    left: 16/100rem;
  }

  .fifter_sort .sort_asc {
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .fifter_sort .icon_active {
    color: #eb3d6e;
  }

  .fifter_sort .sort_desc {
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .vip_body .fifter_brand_more_bg {
    margin-top: -20/100rem;
    position: fixed;
    top: 108/100rem;
    z-index: 50;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
  }

  .fifter_brand_more {
    background: #fff;
    z-index: 60;
    position: fixed;
    top: 73/100rem;
  }

  .fifter_brand_more checkbox-group {
    padding-left: 20px;
  }

  .fifter_brand_more label {
    width: 340/100rem;
    display: inline-flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 22/100rem 0;
    position: relative;
  }

  .fifter_brand_more span {
    color: #323232;
    font-size: 28/100rem;
  }

  .fifter_brand_more .chose_text {
    border-bottom: 2/100rem solid #ff8d97;
  }

  .fifter_brand_more .chose_default {
    border-bottom: 2/100rem solid #fff;
  }

  .fifter_brand_more .fifter_brand_btn {
    box-shadow: 0/100rem -4/100rem 20/100rem -6/100rem #a2a2a2;
    height: 75/100rem;
    display: flex;
  }

  .fifter_brand_btn button {
    width: 50%;
    height: 75/100rem;
    color: #2b2b2b;
    background: #fff;
    font-size: 30/100rem;
    font-weight: bold;
    line-height: 75/100rem;
    border-radius: 0;
    margin: 0;
  }

  .fifter_brand_btn .btn_red {
    background: #ff8d97;
    color: #fff;
  }

  .fifter_brand_btn button::after {
    border: none;
  }

  /* 筛选 */

  .vip_body .fifter_more_bg {
    position: fixed;
    top: 0/100rem;
    z-index: 50;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
  }

  .vip_body .fifter_more {
    position: fixed;
    width: 640/100rem;
    height: 100%;
    background: #f2f2f2;
    top: 0;
    right: -640/100rem;
    z-index: 52;
  }

  .fifter_more .fifter_price {
    padding-top: 36/100rem;
    height: 155/100rem;
    background: #fff;
    padding-right: 26/100rem;
    margin-bottom: 20/100rem;
  }

  .fifter_price div {
    margin-left: 30/100rem;
    height: 50/100rem;
    line-height: 50/100rem;
    display: flex;
    align-items: center;
    margin-top: 30/100rem;
  }

  .fifter_price input {
    width: 270/100rem;
    height: 50/100rem;
    line-height: 50/100rem;
    border-radius: 50/100rem;
    background: #f1f2f6;
    display: inline-block;
    text-align: center;
    font-size: 26/100rem;
  }

  .fifter_price .input-placeholder {
    color: #c3c3c3;
    font-size: 26/100rem;
    text-align: center;
  }

  .fifter_price div icon {
    line-height: 50/100rem;
    color: #000;
    margin: 0 10/100rem;
  }

  .fifter_price span {
    font-size: 30/100rem;
    font-weight: bold;
    color: #333;
    margin-left: 30/100rem;
    display: block;
  }

  .fifter_more .fifter_other {
    background: #fff;
    padding-bottom: 20/100rem;
  }

  .fifter_other .fifter_info {
    padding-top: 30/100rem;
  }

  .fifter_info .fifter_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 26/100rem;
  }

  .fifter_head span {
    font-size: 30/100rem;
    font-weight: bold;
    color: #333;
  }

  .fifter_head div {
    display: inline-flex;
    align-items: center;
  }

  .fifter_head div span {
    color: #939393;
    margin-right: 10/100rem;
  }

  .fifter_head div icon {
    display: inline-flex;
    align-items: center;
    font-size: 26/100rem;
    color: #939393;
  }

  .fifter_head div .icon_open {
    transform: rotate(180deg);
  }

  .fifter_options {
    margin-top: 20/100rem;
    padding-left: 26/100rem;
  }

  .fifter_options_hidden {
    height: 80/100rem;
    overflow: hidden;
  }

  .fifter_options span {
    width: 126/100rem;
    height: 50/100rem;
    line-height: 50/100rem;
    padding: 0 16/100rem;
    text-align: center;
    font-size: 24/100rem;
    color: #6c6c6c;
    background: #f1f2f5;
    border-radius: 50/100rem;
    display: inline-block;
    margin: 10/100rem 0;
    margin-right: 45/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .fifter_options .chose_text {
    background: #ff8d97;
    color: #fff;
  }

  .fifter_more .fifter_more_btn {
    box-shadow: 0/100rem -4/100rem 20/100rem -6/100rem #a2a2a2;
    height: 75/100rem;
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .fifter_more_btn button {
    width: 50%;
    height: 75/100rem;
    color: #2b2b2b;
    background: #fff;
    font-size: 30/100rem;
    font-weight: bold;
    line-height: 75/100rem;
    border-radius: 0;
    margin: 0;
  }

  .fifter_more_btn .btn_red {
    background: #ff8d97;
    color: #fff;
  }

  .fifter_more_btn button::after {
    border: none;
  }

  /* 促销列表 */

  .vip_body_list .vip_list {
    padding: 0 26/100rem;
    background: #fff;
  }

  .vip_list .vip_pro {
    /* height: 310/100rem; */
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
    padding: 20/100rem 0;
  }

  .vip_list :last-child {
    border-bottom: 0;
  }

  .vip_pro .pro_img {
    float: left;
    /* margin-top: 40/100rem; */
    /* margin-left: 18/100rem; */
    margin-right: 36/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 190/100rem;
  }

  .vip_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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

  .pro_info .pro_spec {
    overflow: hidden;
    margin-top: 30/100rem;
    height: 82/100rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    width: 226/100rem;
  }

  .pro_price .pro_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    /* margin-bottom: -10/100rem; */
    font-weight: bold;
  }

  .pro_price .pro_integral {
    font-size: 30/100rem;
    color: #ff8d97;
    font-weight: bold;
    margin-left: 8/100rem;
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    /* margin-left: 9/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    color: #ff8d97;
    display: inline-flex;
    font-weight: bold;
  }

  /* .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

  .pro_price .pro_orig {
    margin-top: -20/100rem;
    /* height: 30/100rem;
  line-height: 30/100rem; */
    position: relative;
  }

  .pro_price .pro_orig .nowprice {
    font-size: 30/100rem;
    font-weight: bold;
    color: #b8b8b8;
    text-decoration: line-through;
    /* margin-left: 58/100rem; */
    margin-left: 4/100rem;
  }

  .pro_spec .pro_btn {
    margin-right: 4/100rem;
    display: flex;
    border-radius: 6/100rem;
  }

  .pro_btn button {
    width: 150/100rem;
    height: 52/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 26/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 52/100rem;
    border-radius: 18/100rem;
  }

  .pro_btn button::after {
    border: none;
  }

  .pro_icon {
    margin-right: 26/100rem;
  }

  .pro_icon .iconfont {
    color: #ff8d97;
    font-size: 40/100rem;
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

  checkbox .wx-checkbox-input {
    border-radius: 50%;
    width: 34/100rem;
    height: 34/100rem;
    border: none;
  }

  checkbox .wx-checkbox-input.wx-checkbox-input-checked {
    border: 1px solid transparent;
    background: #fff;
    color: #ff8d97;
  }

  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
    border-radius: 50%;
    width: 34/100rem;
    height: 34/100rem;
    line-height: 34/100rem;
    text-align: center;
    font-size: 30/100rem;
    color: #ff8d97;
    background: transparent;
    transform: translate(-50%, -50%) scale(1);
    -webkit-transform: translate(-50%, -50%) scale(1);
  }

  .car_edit_more {
    height: 100/100rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 50;
    box-shadow: 0 8/100rem 20/100rem 10/100rem #dadada;
  }

  .car_edit_more .allCheck {
    margin-right: 26/100rem;
    font-size: 26/100rem;
    color: #555;
    text-align: right;
  }

  .allCheck .car_pro_total {
    font-family: 'DIN';
    font-size: 30/100rem;
    font-weight: bold;
    color: #484848;
    font-weight: bold;
  }

  .car_pro_total span {
    font-size: 42/100rem;
    color: #ff8d97;
    font-family: 'DIN';
    align-items: flex-end;
  }

  .allCheck .car_tips {
    font-size: 24/100rem;
    color: #808080;
  }

  .car_edit_more button {
    float: right;
    min-width: 230/100rem;
    height: 100/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 34/100rem;
    line-height: 100/100rem;
    border-radius: 0;
    margin: 0;
  }

</style>
