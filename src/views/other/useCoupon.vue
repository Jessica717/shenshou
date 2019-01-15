<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='use_coupon'>
      <div class='coupon_body'>
        <div class='coupon_nav'>
          <span :class="choseType==0?'text_active':''" @click='choseTypeList(0)' id='0'>可用优惠券({{couUseList.length}})</span>
          <span :class="choseType==1?'text_active':''" @click='choseTypeList(1)' id='1'>不可使用优惠券({{couNoList.length}})</span>
        </div>
        <div class='cou_tip' v-if='isChecked'>
          使用优惠券1张，共抵用
          <span>￥{{couValue}}</span>
        </div>
        <div class='cou_list'>
          <div class='cou_info' v-for="(item,index) in couList" :key="index">
            <img src='@/assets/img/order/cop_bg.png' v-if='choseType==0' />
            <img src='@/assets/img/order/cop_bg_01.png' v-if='choseType==1' />
            <div class='cou_more'>
              <div class='cou_value'>￥
                <span>{{item.cashworth}}</span>
              </div>
              <div class='cou_more_tips'>
                <span v-if='item.order_price>0'>满{{item.order_price}}可用</span>
                <span v-else>零门槛使用</span>
              </div>
            </div>
            <div class='cou_tips'>
              <span class='cou_title'>{{item.title}}</span>
              <div class='cou_time'>有效期至
                <span>{{item.totime}}</span> </div>
              <span class='cou_type' v-if='item.name!=null'>适用于{{item.name}}{{item.content}}</span>
              <span class='cou_type' v-if='item.name==null'>全类目通用{{item.content}}</span>
            </div>
            <div class='cou_radio' :hidden='choseType==1'>
              <input v-model="item.checked" :id='item.code' type='checkbox' @click="choseCou(item)" />
              <label :for="item.code"></label>
            </div>
          </div>
        </div>

      </div>
      <div class='null_view'></div>
      <div class='cou_btn' @click='useCou' v-if='choseType==0'>
        <mt-button size='normal'>确定</mt-button>
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
  cancelCou,
  getPriceByTrack
} from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  parseTime
} from '@/store/pubilc.js'
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
      h_title: '使用优惠券',
      couList: [],
      couUseList: [],
      couNoList: [],
      staticAdd: [],
      couValue: 0,
      choseId: 0,
      choseType: 0,
      isChecked: false,
      pid: '',
      default_code: '',
      default_cou: '',
      ship_id: '',
      addType: '',
      orderType: ''
    }
  },
  mounted() {
    // console.log(this.$route.query)
    // console.log(this.$store.state.home.choseAddr)
    let options = this.$route.query
    let beforeInfo = this.$store.state.home.choseAddr
    this.default_cou = beforeInfo.default_cou
    this.ship_id = beforeInfo.ship_id
    this.addType = beforeInfo.addType
    this.orderType = beforeInfo.orderType
    this.staticAdd = beforeInfo.staticAdd
    let info = beforeInfo.couList
    for (let i = 0; i < info.length; i++) {
      if (info[i].totime.indexOf('-') === -1) {
        info[i].totime = parseTime(info[i].totime, '{y}-{m}-{d}')
      }
      if (info[i].checked !== undefined && (info[i].checked === 'true' || info[i].checked === true)) {
        this.default_code = info[i].code
        this.couValue = info[i].cashworth
        this.isChecked = true
        this.choseId = info[i].code
        info[i].checked = true
      } else {
        info[i].checked = false
      }
    }
    var canUseList = []
    var notUseList = []
    for (let i = 0; i < info.length; i++) {
      if (info[i].can_use) {
        canUseList.push(info[i])
      } else {
        notUseList.push(info[i])
      }
    }
    this.couList = canUseList
    this.couUseList = canUseList
    this.couNoList = notUseList
    this.pid = options.pid
    // Indicator.open('加载中...')
    // console.log(this.$route.query)
  },
  methods: {
    ...mapMutations({
      setChoseAddr: 'SET_CHOSEADDR',
      setUserInfo: 'SET_USERINFO'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    choseTypeList(id) {
      if (id === 0) {
        this.couList = this.couUseList
      } else {
        this.couList = this.couNoList
      }
      this.choseType = id
    },
    choseCou(event) {
      event.checked = !event.checked
      if (event.checked) {
        for (let i = 0; i < this.couList.length; i++) {
          if (this.couList[i].code === event.code) {
            this.couList[i].checked = true
            this.couValue = this.couList[i].cashworth
            this.isChecked = true
          } else {
            this.couList[i].checked = false
          }
        }
        this.choseId = event.code
        this.default_code = event.code
        this.couUseList = this.couList
      } else {
        for (let i = 0; i < this.couList.length; i++) {
          if (this.couList[i].code === event.code) {
            this.couList[i].checked = false
            this.couValue = 0
            this.isChecked = false
          }
        }
        this.choseId = ''
        this.default_code = ''
        this.couUseList = this.couList
      }
    },
    useCou: function () {
      var that = this
      var addId = ''
      if (that.staticAdd.length > 0) {
        addId = that.staticAdd[0].id
      }
      if (that.choseId === '') {
        if (that.default_cou.indexOf('c=') !== -1) {
          that.default_cou = that.default_cou.substring(2)
        }
        let info = {
          coupon_code: that.default_cou,
          checked: that.pid,
          cart_type: that.addType,
          shipmethod_id: that.ship_id,
          type: that.orderType,
          address_id: addId
        }
        cancelCou(info).then(res => {
          if (res.isSuccess) {
            let data = {
              couInfo: '',
              couValue: '',
              couCode: '',
              total_price: '',
              couList: [],
              static_freight: ''
            }
            that.setChoseAddr(data)
            data.total_price = res.amount
            var cou = ''
            if (that.choseId === '') {
              cou = '选择优惠券'
            } else {
              cou = '已减' + parseInt(res.coupon_discount) + '元'
            }
            if (res.amount !== undefined) {
              data.total_price = res.amount
            } else {
              data.total_price = that.amount
            }
            console.log(that.couList)
            data.couInfo = cou
            data.couValue = res.coupon_discount
            data.couCode = res.cart_params
            data.couList = that.couList.concat(that.couNoList)
            data.static_freight = res.cost_freight
            console.log(data.couList)
            that.setChoseAddr(data)
            that.$router.go(-1)
          }
        })
      } else {
        let info = {
          coupon_code: that.choseId,
          checked: that.pid,
          shipmethod_id: that.ship_id,
          cart_type: that.addType,
          type: that.orderType,
          address_id: addId
        }
        getPriceByTrack(info).then(res => {
          if (res.isSuccess) {
            let data = {
              couInfo: '',
              couValue: '',
              couCode: '',
              total_price: '',
              couList: [],
              static_freight: ''
            }
            that.setChoseAddr(data)
            data.total_price = res.amount
            var cou = ''
            if (that.choseId === '') {
              cou = '选择优惠券'
            } else {
              cou = '已减' + parseInt(res.coupon_discount) + '元'
            }
            if (res.amount !== undefined) {
              data.total_price = res.amount
            } else {
              data.total_price = that.amount
            }
            console.log(that.couList)
            data.couInfo = cou
            data.couValue = res.coupon_discount
            data.couCode = res.cart_params
            data.couList = that.couList.concat(that.couNoList)
            console.log(data.couList)
            data.static_freight = res.cost_freight
            that.setChoseAddr(data)
            that.$router.go(-1)
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters([])
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .use_coupon {
    /* font-family: SimHei 'DIN'; */
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .coupon_nav {
    height: 90/100rem;
    background: #fff;
  }

  .coupon_nav span {
    width: 370/100rem;
    display: inline-block;
    color: #999;
    font-size: 32/100rem;
    text-align: center;
    padding-top: 24/100rem;
    padding-bottom: 18/100rem;
    border-bottom: 4/100rem solid transparent;
  }

  .coupon_nav .text_active {
    border-bottom: 4/100rem solid #e21f11;
    color: #333;
  }

  .cou_tip {
    width: 100%;
    height: 72/100rem;
    border-top: 1px solid #edd9b0;
    border-bottom: 1px solid #edd9b0;
    background: #fff3db;
    font-size: 26/100rem;
    color: #4a4a4a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cou_tip span {
    color: #ff8d97;
    font-family: 'DIN';
  }

  .cou_list {
    padding: 0 26/100rem;
    background: #f6f6f6;
  }

  .cou_info {
    margin-top: 42/100rem;
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
    font-family: 'DIN';
    margin-left: -16/100rem;
  }

  .cou_more .cou_more_tips {
    text-align: center;
    margin-top: -19/100rem;
    text-align: center;
  }

  .cou_more_tips span {
    font-size: 22/100rem;
    color: #fff;
    margin-right: 8/100rem;
  }

  .cou_more_tips icon {
    color: #fff;
    font-size: 20/100rem;
  }

  .cou_info .cou_tips {
    width: 380/100rem;
  }

  .cou_info .cou_tips span {
    display: block;
  }

  .cou_info .cou_title {
    color: #444;
    font-size: 32/100rem;
  }

  .cou_info .cou_time {
    color: #999;
    font-size: 24/100rem;
    margin: 15/100rem 0;
    width: 260/100rem;
  }

  .cou_time span {
    float: right;
    font-size: 26/100rem;
  }

  .cou_info .cou_type {
    color: #999;
    font-size: 24/100rem;
    //     display: -webkit-box !important;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    // overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 0.7rem;
  }

  .cou_radio {
    position: relative;
    right: 30/100rem;
  }

  .null_view {
    height: 100/100rem;
  }

  .cou_btn {
    position: fixed;
    bottom: 0;
    height: 98/100rem;
    width: 100%;
  }

  .cou_btn button {
    background: #ff8d97;
    color: #fff;
    font-size: 40/100rem;
    border-radius: 0;
    width: 100%;
    height: 100%;
  }

  input[type="checkbox"] {
    width: 34/100rem;
    height: 34/100rem;
    opacity: 0;
  }

  label {
    position: absolute;
    left: 5/100rem;
    top: 8/100rem;
    width: 34/100rem;
    height: 34/100rem;
    // border-radius: 50%;
    border: 2/100rem solid #7c7c7c;
    border-radius: 50%;
  }

  /*设置选中的input的样式*/
  /* + 是兄弟选择器,获取选中后的label元素*/
  input:checked+label {
    background-color: #ff8d97;
    border: 2/100rem solid #ff8d97;
  }

  input:checked+label::after {
    position: absolute;
    content: "";
    width: 0.1rem;
    height: 0.24rem;
    top: 0;
    left: 0.11rem;
    border: 0.04rem solid #fff;
    border-top: none;
    border-left: none;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

</style>
