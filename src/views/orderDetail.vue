<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='orderDetail'></div>
    <div class='sure_order'>
      <div class='sure_body'>
        <div class='sure_head'>
          <div class='sure_addr'>
            <div class='sure_addr_info'>
              <i class='iconfont icon-address'></i>
              <div style='margin-left:0.2rem;'>
                <span class='add_more'>{{order.ship_name}}</span>
                <span class='static' v-if="order.is_default=='1'">默认</span>
                <span style='margin-left:0.4rem;'>{{order.ship_mobile}}</span>
                <div><span style='margin-right:0.06rem;'>{{order.ship_area}}</span>{{order.ship_addr}}</div>
              </div>
            </div>
            <!-- <i class='iconfont icon-youjiantou1'></i> -->
          </div>
          <img src='@/assets/img/sale/s_bg.jpg' />
        </div>
        <div class='car_no'>
          <div v-if='order.t_type==1&&order.countdown>0'>订单状态：待付款
            <!-- <span v-if='order.countdown>0' style='color:#ff8d97;'>(剩余{{saleTime.min}}分{{saleTime.sec}}秒自动关闭)</span> -->
          </div>
          <div v-if='order.t_type==2'>订单状态：待收货</div>
          <div v-if='order.t_type==3'>订单状态：已完成</div>
          <div v-if='order.t_type==4||(order.countdown!=null&&order.countdown<=0)'>订单状态：已取消</div>
          <div v-if='order.t_type==5'>订单状态：待发货</div>
          <div v-if='order.t_type==6'>订单状态：待评价</div>
          <div v-if='order.t_type==7'>订单状态：售后</div>
          <div>订单编号：{{order.order_id}}</div>
          <div>创建时间：{{order.createtime}}</div>
          <div v-if='order.pay_time!=null'>付款时间：{{order.pay_time}}</div>
        </div>
        <div class='sure_pro' v-for='(item,index) in proList' :key='index'>
          <div class='car_pro'>
            <div class='pro_img' @click="goPro('/proDetail?type=normal&id=',item.goods_id,item.is_up,order.order_refer)">
              <img :src='item.product_img_src' v-if="item.product_img_src!=null&&item.product_img_src!=''" />
              <img src='@/assets/img/pro/static.png' v-else />
            </div>
            <div class='pro_info'>
              <div class='pro_title' @click="goPro('/proDetail?type=normal&id=',item.goods_id,item.is_up,order.order_refer)">
                <span class='title_icon' v-if="order.order_refer=='tuangou'">拼购</span>
                <span class='title_icon' v-if="order.order_refer=='qianggou'">促销</span>
                <span class='title_icon' v-if="order.order_refer=='exchange'">抽奖</span>
                <span class='title_icon' v-if="order.order_refer=='try'">试用</span>
                <span class='title_icon' v-if="order.order_refer=='point'">兑换</span>
                <span class='title_icon' v-if="order.order_refer=='birthday'">生日兑换</span>
                <span class='title_icon' v-if="order.order_refer=='scan'">扫码抽奖</span>
                <span class='title_icon' v-if="order.order_refer=='fruits'">水果</span>
                <span>{{item.name}}</span>
              </div>
              <div class='pro_spec'>
                <div class='pro_price'>
                  <div class='spec_info' v-if="item.title!=''&&item.title!=null">规格:{{item.title}}</div>
                  <div style='display:flex;align-items:center;'>
                    <span class='peo_nowprice' v-if='item.price>0'>￥{{item.price}}</span>
                    <span class='pro_integral' v-if='item.point>0&&item.price>0'>+</span>
                    <div class='pro_inter_img' v-if='item.point>0'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral' v-if='item.point>0'>{{item.point}}</span>
                  </div>
                </div>
                <div class='pro_btn'>
                  <mt-button size='small' @click="afterSale(item.product_id,item.flag,order.t_type)" id='item.product_id'
                    v-if='item.flag==0&&order.allow_sale==1' data-ordertype='order.t_type'>申请售后</mt-button>
                  <mt-button size='small' @click="afterSale(item.product_id,item.flag,order.t_type)" id='item.product_id' v-if='item.flag!=0'
                    data-flag='item.flag'>售后详情</mt-button>
                </div>
              </div>
            </div>
          </div>
          <div class='pro_num'>
            <span>购买数量</span>
            <div class='pro_icon'>
              <span>{{item.nums}}</span>
            </div>
          </div>
        </div>
        <div class='sure_other'>
          <div class='other_blcok' v-if="order.discout_youhuiquan>0">
            <div class='type'>
              <span>优惠券</span>
            </div>
            <div>
              <span>已减{{order.discout_youhuiquan}}元</span>
            </div>
          </div>
          <div class='other_blcok'>
            <div class='type'>
              <span>运费</span>
            </div>
            <div>
              <span>￥{{order.cost_freight}}</span>
            </div>
          </div>
          <div class='other_blcok'>
            <div class='type'>
              <span>配送快递</span>
            </div>
            <div>
              <span>{{order.shipping}}</span>
            </div>
          </div>
          <div class='other_blcok' v-if="order.point_use>0||order.order_refer=='birthday'">
            <div class='type'>
              <span>实付积分</span>
            </div>
            <div>
              <span class='sure_score'>{{order.point_use}}积分</span>
            </div>
          </div>
          <div class='other_blcok'>
            <div class='type'>
              <span>实付总额</span>
            </div>
            <div>
              <span class='sure_price'>￥{{order.total_amount}}</span>
            </div>
          </div>
          <div class='other_blcok' v-if="order.memo!=''&&order.memo!=null">
            <div class='type'>
              <span>买家留言：</span>
            </div>
            <span class='memo'>{{order.memo}}</span>
          </div>
        </div>
        <div class="order_oper">
          <mt-button size='small' class='contact' open-type="contact">联系客服</mt-button>
          <mt-button size='small' @click="changeAdd('/editAddr')" v-if="(order.t_type == 1||order.t_type == 5)&&order.is_cangku==0&&order.countdown>0">修改地址</mt-button>
          <mt-button size='small' @click='cancelProOrder(order.order_id)' v-if='order.t_type == 1&&order.countdown>0'>取消订单</mt-button>
          <mt-button size='small' class='btn_red' @click='payOver(order.order_id,order.pay_id)' v-if='order.t_type == 1&&order.countdown>0'>立即支付</mt-button>
          <mt-button size='small' :class="order.remind==1?'':'btn_red'" @click='remind(order.order_id,order.remind)'
            v-if='order.t_type == 5'>提醒发货</mt-button>
          <mt-button size='small' @click='viewtrack(order.order_id)' v-if='order.t_type == 2||order.t_type ==3||order.t_type ==6'>查看物流</mt-button>
          <mt-button size='small' class='btn_red' @click='sureOrder(order.order_id)' v-if='order.t_type == 2'>确认收货</mt-button>
          <mt-button size='small' class='btn_red' @click="goComm('/addComment??num=',proList.length,order.order_id)"
            v-if='order.t_type == 6'>立即评价</mt-button>
          <mt-button size='small' v-if='order.t_type == 4||(order.countdown!=null&&order.countdown<=0)'>已取消</mt-button>
          <mt-button size='small' v-if='order.t_type == 7'>已退货</mt-button>
        </div>
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
  Toast,
  MessageBox
} from 'mint-ui'
import {
  getOrderDetail,
  getOrderTrack,
  cancelOrder,
  remindShip,
  confirmReceipt,
  wxPay
} from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
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
    Toast,
    MessageBox
  },
  data() {
    return {
      h_title: '订单详情',
      order_id: '',
      proList: [],
      order: {},
      staticAdd: {},
      orderType: '',
      time: null,
      saleTime: [],
      after_tips: '',
      is_sale: '',
      allowbind: true,
      after_sale_states: 0, // 0是退款，1是退货，2是换货
      channels: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    if (options.is_sale !== undefined) {
      this.is_sale = options.is_sale
    }
    this.order_id = options.id
    this.allowbind = true
    this.getOrder()
    let that = this
    let System = window.plus
    System.payment.getChannels(function(s) {
      that.channels = s
    }, function(e) {
      alert('获取支付通道列表失败：' + e.message)
    })
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    addInfo(e) {
      this.setData({
        order_memo: e.detail.value
      })
    },
    goComm(url, num, id) {
      console.log(url, num, id)
      this.$router.togo({
        path: url + '?num=' + num + '&orderId=' + id
      })
    },
    goPro(url, id, type, orderType) {
      if (type != null) {
        if (orderType === 'fruits') {
          this.$router.togo({
            path: '/fruitDetail?type=fruits&&id=' + id
          })
        } else {
          if (orderType !== 'birthday') {
            this.$router.togo({
              path: url + id
            })
          }
        }
      } else {
        Toast({
          message: '该商品不存在~',
          duration: 1000
        })
      }
    },
    getOrder() {
      var that = this
      let info = {
        id: that.order_id,
        is_sale: that.is_sale
      }
      getOrderDetail(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          res.row_order.createtime = parseTime(res.row_order.createtime, '{y}-{m}-{d} {h}:{i}:{s}')
          if (res.row_order.pay_time != null) {
            res.row_order.pay_time = parseTime(res.row_order.pay_time, '{y}-{m}-{d} {h}:{i}:{s}')
          }
          that.proList = res.order_items
          that.order = res.row_order
          if (that.order.order_refer === 'tuangou') {
            that.orderType = 'group'
          } else if (that.order.order_refer === 'qianggou') {
            that.orderType = 'flash'
          } else if (that.order.order_refer === 'local') {
            that.orderType = 'normal'
          } else {
            that.orderType = that.order.order_refer
          }
        }
      })
    },
    viewtrack(id) {
      var that = this
      getOrderTrack(id).then(res => {
        if (res.isSuccess) {
          that.$router.togo({
            path: '/orderTrack?orderId=' + id
          })
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
        }
      })
    },
    changeAdd(url) {
      let info = {
        order_id: this.order.order_id,
        name: this.order.ship_name,
        phone: this.order.ship_mobile,
        area: this.order.ship_area,
        addr: this.order.ship_addr
      }
      this.$router.push({
        path: url,
        name: 'EditAddr',
        params: {
          type: 'change',
          editname: '修改地址',
          info: info
        }
      })
    },
    cancelProOrder(id) {
      console.log(id)
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('确定取消当前订单？订单一经取消不可恢复！', function(e) {
          console.log('Close confirm: ' + e.index)
          if (e.index === 0 || e.index === '0') {
            cancelOrder(id).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: res.msg,
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.getOrder()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      } else {
        MessageBox({
          title: '提示',
          message: '确定取消当前订单？订单一经取消不可恢复！',
          showCancelButton: true,
          closeOnClickModal: false
        }).then(res => {
          if (res === 'confirm') {
            cancelOrder(id).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: res.msg,
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.getOrder()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        })
      }
    },
    afterSale(pid, flag, type) {
      if (flag === 0 || flag === '0') {
        this.$router.togo({
          path: '/saleAfter?pid=' + pid + '&orderId=' + this.order.order_id + '&order_type=' + type
        })
      } else {
        this.$router.togo({
          path: '/afterDetail?pid=' + pid + '&orderId=' + this.order.order_id + '&order_type=' + type
        })
      }
    },
    sureOrder(orderId) {
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('请确定已收到货品！', function(e) {
          console.log('Close confirm: ' + e.index)
          if (e.index === 0 || e.index === '0') {
            confirmReceipt(orderId).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '成功',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.page = 1
                  that.getOrder()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      } else {
        MessageBox({
          title: '提示',
          message: '请确定已收到货品',
          showCancelButton: true,
          closeOnClickModal: false
        }).then(res => {
          if (res === 'confirm') {
            confirmReceipt(orderId).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '成功',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.page = 1
                  that.getOrder()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        })
      }
    },
    payOver(orderId, payId) {
      var that = this
      if (that.allowbind) {
        that.allowbind = false
        let info = {
          id: orderId,
          pay_id: payId,
          pay_payment: 'wechatapp'
        }
        that.wxPayment(info)
      }
    },
    wxPayment(info) {
      let that = this
      wxPay(info).then(res => {
        if (res.isSuccess) {
          console.log(res.data)
          console.log('支付通道')
          console.log(that.channels)
          let System = window.plus
          let param1 = {
            appid: res.data.appId,
            noncestr: res.data.nonceStr,
            package: res.data.package,
            partnerid: res.data.partnerid,
            prepayid: res.data.prepayid,
            timestamp: res.data.timeStamp,
            sign: res.data.paySign
          }
          System.payment.request(that.channels[0], param1, function() {
            that.allowbind = true
            Toast({
              message: '支付成功',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            // that.$router.replace({
            //   path: '/paySuccess?addrId=' + that.staticAdd[0].id
            // })
          }, function(e) {
            console.log(e.message)
            that.allowbind = true
            // that.$router.replace({
            //   path: '/order',
            //   name: 'Order',
            //   params: {
            //     id: 1,
            //     tid: 1
            //   }
            // })
          })
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
        }
      })
    },
    remind(orderId, isRemind) {
      var that = this
      if (isRemind === 0 || isRemind === '0') {
        remindShip(orderId).then(res => {
          if (res.isSuccess) {
            Toast({
              message: '已提醒',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            setTimeout(function () {
              that.order.remind = 1
            }, 1000)
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      } else {
        Toast({
          message: '请勿重复提醒',
          duration: 1000
        })
      }
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .sure_order {
    font-family: SimHei;
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .sure_body {
    background: #f2f2f2;
  }

  .sure_body .sure_head {
    height: 160/100rem;
    position: relative;
    margin-bottom: 20/100rem;
  }

  .sure_head .sure_addr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 152/100rem;
    padding: 0 26/100rem;
    background: #fff;
  }

  .add_tips {
    font-size: 32/100rem;
    color: #555;
    font-family: 'DIN';
  }

  .sure_addr .sure_addr_info {
    font-size: 24/100rem;
    color: #888;
    font-family: 'DIN';
    display: flex;
    align-items: center;
  }

  .sure_addr_info div .add_more {
    font-size: 28/100rem;
    color: #333;
  }

  .sure_addr_info div .static {
    width: 56/100rem;
    height: 24/100rem;
    line-height: 24/100rem;
    border: 2/100rem solid #ff8d97;
    font-size: 20/100rem;
    color: #ff8d97;
    border-radius: 5/100rem;
    display: inline-block;
    text-align: center;
    margin-left: 52/100rem;
  }

  .sure_head img {
    position: absolute;
    width: 100%;
    height: 8/100rem;
    bottom: 0;
  }

  .car_no {
    padding: 26/100rem;
    border-bottom: 1px solid #ebebeb;
    font-size: 24/100rem;
    color: #999;
    background: #fff;
  }

  .car_no div {
    display: block;
    margin: 10/100rem 0;
  }

  .sure_pro {
    /* height: 358/100rem; */
    background: #fff;
    margin-bottom: 20/100rem;
  }

  .sure_pro .car_pro {
    padding: 0 26/100rem;
    height: 262/100rem;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
  }

  .car_pro .pro_img {
    float: left;
    /* margin-left: 18/100rem; */
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 186/100rem;
  }

  .pro_img .pro_tips {
    width: 190/100rem;
    height: 52/100rem;
    background: rgba(0, 0, 0, 0.6);
    line-height: 52/100rem;
    text-align: center;
    position: absolute;
    bottom: 0;
  }

  .pro_tips span {
    color: #fff;
    font-size: 24/100rem;
  }

  .car_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 26/100rem;
    color: #444;
    /* margin-top: 30/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pro_title .title_icon {
    background: #ff8d97;
    height: 26/100rem;
    /* width: 48/100rem; */
    font-size: 20/100rem;
    color: #fff;
    border-radius: 8/100rem;
    line-height: 26/100rem;
    text-align: center;
    display: inline-block;
    margin-right: 10/100rem;
    padding: 0 6/100rem;
  }

  .pro_info .pro_spec {
    overflow: hidden;
    /* height: 64/100rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14/100rem;
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    width: 240/100rem;
  }

  .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
    margin-right: 10/100rem;
  }

  .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    /* margin-left: 8/100rem; */
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: flex-end;
    /* margin-left: 20/100rem; */
    /* margin-right: 30/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    display: inline-flex;
  }

  .pro_price .pro_orig {
    font-size: 24/100rem;
    color: #b8b8b8;
    text-decoration: line-through;
  }

  .pro_price .spec_info {
    font-size: 20/100rem;
    color: #999;
  }

  .pro_weight span {
    font-size: 20/100rem;
    color: #888;
    font-weight: 'DIN';
  }

  .pro_spec .pro_btn {
    display: inline-flex;
    align-items: center;
  }

  .pro_spec .pro_btn button {
    min-width: 150/100rem;
    /* height: 52/100rem; */
    border: 1px solid #808080;
    color: #808080;
    background: transparent;
    font-size: 24/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 2.0;
    border-radius: 18/100rem;
  }

  .pro_spec .pro_btn button::after {
    border: none;
  }

  .pro_num {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 26/100rem;
    height: 86/100rem;
  }

  .pro_num span {
    color: #999;
    font-size: 24/100rem;
  }

  .pro_num .pro_icon {
    margin-right: 4/100rem;
    display: flex;
    /* border: 1px solid #ccc;
  border-radius: 6/100rem; */
  }

  .pro_icon span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #565656;
  }

  .pro_icon button {
    width: 44/100rem;
    height: 44/100rem;
    line-height: 42/100rem;
    padding: 0 22/100rem;
    margin: 0;
    color: #9f9f9f;
    font-size: 38/100rem;
    display: flex;
    justify-content: center;
    border-radius: 0;
    background: #f3f3f3;
  }

  .pro_icon button::after {
    border: none;
  }

  .pro_icon input {
    width: 70/100rem;
    height: 44/100rem;
    min-height: 44/100rem;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 0;
    font-size: 30/100rem;
    font-weight: bold;
    color: #565656;
    text-align: center;
    display: flex;
    align-items: center;
    font-family: 'DIN';
  }

  .sure_other {
    background: #fff;
    margin-bottom: 122/100rem;
  }

  .sure_other .other_blcok {
    padding: 0 26/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100/100rem;
    line-height: 100/100rem;
    border-bottom: 2/100rem solid #e0e0e0;
    color: #999;
    font-size: 24/100rem;
  }

  .other_blcok .type span {
    color: #999;
    font-size: 24/100rem;
  }

  .other_blcok div span {
    color: #555;
    font-size: 24/100rem;
    font-family: 'DIN';
  }

  .other_blcok div icon {
    margin-left: 30/100rem;
  }

  .other_blcok div .sure_score {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #666;
    /* margin-right: 30/100rem; */
  }

  .other_blcok div .sure_price {
    font-size: 50/100rem;
    color: #ff8d97;
  }

  .other_blcok .memo {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 500/100rem;
  }

  .sure_body .order_oper {
    padding: 20/100rem 0;
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .order_oper button {
    margin: 0 10/100rem;
    border: 1px solid #808080;
    color: #808080;
    background: transparent;
    border-radius: 18/100rem;
    font-size: 26/100rem;
    width: 180/100rem;
    padding: 4/100rem 26/100rem;
    text-align: center;
  }

  /*
.order_oper  .static_btn {
  float: left;
  margin-left: 16/100rem;
  border-color: #f06b90;
  color: #f06b90;
} */

  /* .order_oper .contact icon {
  color: #666;
  font-size: 40/100rem;
} */

  .order_oper .btn_red {
    border-color: #f06b90;
    color: #f06b90;
  }

  .view_hidden {
    display: none;
  }

</style>
