<template>
  <div>
    <common-header :h_title="h_title"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='order'></div>
    <div class='myOrder' v-if='isShow'>
      <return-top @returnTop='goTop'></return-top>
      <div class='order_body'>
        <ly-tab v-model="selectId" :items="orderType" :options="options" @change='choseOrder' class='order_type'></ly-tab>
        <div style='height:0.9rem'></div>
        <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false' :bottomDistance='100'
         :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'" class='order_list' > -->
        <div class='order_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="30">
          <!-- v-if='orderNum' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" -->
          <!-- infinite-scroll-distance="30" -->
          <div class='order_single' v-for='(order,index) in orderList' :key='index'>
            <div class='order_head'>
              <div class='order_code'>
                订单号：
                <span>{{order.order_id}}</span>
              </div>
              <div class='order_states' v-if='orderStatusCode!=7'>
                <div v-if='(order.t_type==1&&order.countdown!=undefined&&order.countdown>0)||(endTimeList.length>0&&order.t_type==1&&order.countdown>0)'>等待付款</div>
                <div v-if='order.t_type==5'>买家已付款</div>
                <div v-if='order.t_type==2'>待收货</div>
                <div v-if='order.t_type==6'>交易成功</div>
                <div v-if='order.t_type==3'>交易完成</div>
                <div v-if='(endTimeList.length<=0&&order.countdown!=undefined&&order.countdown<=0)||(order.t_type==4||order.countdown<=0)'>已取消</div>
                <!-- <div v-if='order.t_type==7'>交易关闭</div> -->
              </div>
              <div class='order_states' v-else>
                <div v-if="order.after_type=='refunds'">退款订单</div>
                <div v-if="order.after_type=='reship'">退货订单</div>
                <div v-if="order.after_type=='barter'">换货订单</div>
              </div>
            </div>
            <div class='order_pro_info' v-for='(item,index) in order.order_items' :key='index' @click='goPro(order.order_id,item)'>
              <div class='pro_img'>
                <img :src='item.product_img_src' v-if="item.product_img_src!=null&&item.product_img_src!=''" />
                <img src='@/assets/img/pro/static.png' v-else />
              </div>
              <div class='pro_info'>
                <div class='pro_title'>
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
                <div class='pro_color' v-if="item.title!=''&&item.title!=null">规格：{{item.title}}</div>
                <div class='pro_spec'>
                  <div class='pro_price'>
                    <span class='peo_nowprice' v-if='item.price>0'>￥{{item.price}} </span>
                    <span class='pro_integral' v-if='item.point>0&&item.price>0'>+</span>
                    <div class='pro_inter_img' v-if='item.point>0'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral' v-if='item.point>0'>{{item.point}}</span>

                  </div>
                  <div class='pro_num'>数量：{{item.nums}}</div>
                </div>
              </div>
            </div>
            <div class='order_info'>
              共{{order.order_items.length}}件商品 合计：
              <span>￥{{order.total_amount}}</span>
              <span v-if='order.point_use>0'>+{{order.point_use}}积分</span>
              （含运费￥{{order.cost_freight}}）
            </div>
            <div :class="order.t_type == 1&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <div v-if="orderStatusCode==1&&order.countdown>0" class='countdown'>
                <i class='iconfont icon-jinriqianggou'></i>
                <span>支付剩余</span>
                <span>{{saleTimeList[index].hou}}:{{saleTimeList[index].min}}:{{saleTimeList[index].sec}}</span>
              </div>
              <mt-button size="small" @click="cancelOrders(order.order_id)" v-if="order.countdown>0">取消订单</mt-button>
              <mt-button size="small" class='btn_red' @click='payOver(order.order_id,order.pay_id)' v-if="order.countdown>0">立即支付</mt-button>
              <mt-button size="small" v-if="order.countdown<=0">已取消</mt-button>
            </div>
            <div :class="order.t_type == 5&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" :class="order.remind==1?'':'btn_red'" @click='remind(order.order_id,order.remind)'>提醒发货</mt-button>
            </div>
            <div :class="order.t_type == 2&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" @click='viewtrack(order.order_id)'>查看物流</mt-button>
              <mt-button size="small" class='btn_red' @click='sureOrder(order.order_id)'>确认收货</mt-button>
            </div>
            <div :class="order.t_type == 6&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" @click='viewtrack(order.order_id)'>查看物流</mt-button>
              <mt-button size="small" class='btn_red' @click='goComm(order.order_id,order.order_items.length)'>立即评价</mt-button>
            </div>
            <div :class="order.t_type == 3&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" @click='viewtrack(order.order_id)'>查看物流</mt-button>
            </div>
            <div :class="order.t_type == 4&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small">已取消</mt-button>
            </div>
            <div :class="order.t_type == 7&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small">售后完成</mt-button>
            </div>
          </div>
          <div class='order_list_null' v-if='total==0'>
            <span>当前类别下暂无订单，快去选购吧~</span>
            <mt-button class='btn_red' @click='goIndex'>去首页看看</mt-button>
          </div>
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='list_bottom' v-if='orderList.length==total&&total>0'>—————— 我是有底线的 ——————</div>
        </div>
      </div>
      <!-- </mt-loadmore> -->
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Search,
  Button,
  Lazyload,
  MessageBox,
  Toast,
  Loadmore
} from 'mint-ui'
import LyTab from '@/components/LyTab/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  getOrderList,
  getCarList,
  cancelOrder,
  getOrderTrack,
  remindShip,
  confirmReceipt,
  wxPay
} from '@/api/index'
import {
  countDownList
} from '@/store/pubilc.js'
import returnTop from '@/components/return-top'
export default {
  name: 'Order',
  components: {
    commonHeader,
    Search,
    LyTab,
    returnTop,
    InfiniteScroll,
    Lazyload,
    Button,
    MessageBox,
    Toast,
    Loadmore
  },
  data() {
    return {
      // head_color: {
      //   background: '#f9f9f9',
      //   color: '#000'
      // },
      h_title: '我的订单',
      options: {
        activeColor: '#ff8d97',
        labelKey: 'name'
      },
      active_type_id: 'type0',
      isShow: false,
      newNews: false,
      total_amout: 0,
      orderstatus: '等待付款',
      selectId: 0,
      orderStatusCode: 0,
      loading: true,
      time: '', // 定时器
      endTime: '', // 倒计时秒数
      saleTime: {}, // 倒计时时分秒数组
      saleTimeList: [{
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }],
      page: 1,
      limit: 10,
      orderList: [],
      endTimeList: [],
      total: 0,
      orderNum: false,
      after_tips: '',
      leftLength: 0,
      allowbind: true,
      orderType: [{
        id: 0,
        tid: 0,
        name: '全部'
      },
      {
        id: 1,
        tid: 1,
        name: '待付款'
      },
      {
        id: 2,
        tid: 5,
        name: '待发货'
      },
      {
        id: 3,
        tid: 2,
        name: '待收货'
      },
      {
        id: 4,
        tid: 7,
        name: '退换/售后'
      },
      {
        id: 5,
        tid: 6,
        name: '待评价'
      },
      {
        id: 6,
        tid: 3,
        name: '已完成'
      },
      {
        id: 7,
        tid: 4,
        name: '已取消'
      }
      ],
      channels: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    console.log(this.$route.params)
    var storage = window.localStorage
    if (this.$route.params.id !== undefined) {
      this.selectId = this.$route.params.id
      this.orderStatusCode = this.$route.params.tid
      storage.setItem('selectId', this.selectId)
      storage.setItem('orderStatusCode', this.orderStatusCode)
    } else {
      this.selectId = parseInt(storage.getItem('selectId'))
      this.orderStatusCode = parseInt(storage.getItem('orderStatusCode'))
    }
    this.getList()
    let that = this
    let System = window.plus
    System.payment.getChannels(function (s) {
      that.channels = s
    }, function (e) {
      alert('获取支付通道列表失败：' + e.message)
    })
  },
  methods: {
    ...mapMutations({
      setCarnum: 'SET_CARNUM'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('order').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goComm(orderId, num) {
      this.$router.togo({
        path: '/addComment' + '?num=' + num + '&orderId=' + orderId
      })
    },
    goPro(orderno, event) {
      if (this.orderStatusCode === '7') {
        if (event.flag <= 0) {
          this.$router.togo({
            path: '/saleAfter?pid=' + event.id + '&orderId=' + orderno + '&order_type=7'
          })
        } else {
          this.$router.togo({
            path: '/afterDetail?pid=' + event.id + '&orderId=' + orderno
          })
        }
      } else {
        this.$router.togo({
          path: '/orderDetail?id=' + orderno
        })
      }
    },
    goIndex(e) {
      this.$router.replace({
        path: '/index'
      })
    },
    choseOrder(e) {
      var storage = window.localStorage
      Indicator.open('加载中...')
      console.log(e)
      this.orderStatusCode = e.tid
      this.selectId = e.id
      storage.setItem('selectId', this.selectId)
      storage.setItem('orderStatusCode', this.orderStatusCode)
      this.page = 1
      this.total = 0
      this.orderList = []
      document.getElementById('order').scrollIntoView(false)
      this.getList()
    },
    cancelOrders(id) {
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('确定取消当前订单？订单一经取消不可恢复！', function (e) {
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
                  clearInterval(that.time)
                  that.orderList = []
                  that.saleTimeList = []
                  that.endTimeList = []
                  that.total = 0
                  that.page = 1
                  that.getList()
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
                  clearInterval(that.time)
                  that.orderList = []
                  that.saleTimeList = []
                  that.endTimeList = []
                  that.total = 0
                  that.page = 1
                  that.getList()
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
    getList() {
      var info = {
        id: this.orderStatusCode,
        page: this.page,
        limit: this.limit
      }
      getCarList().then(res => {
        if (res.isSuccess) {
          // that.total_amout = res.data.rows_total
          that.setCarnum(res.data.rows_total)
        }
      })
      console.log(this.page)
      var that = this
      getOrderList(info).then(res => {
        Indicator.close()
        this.isShow = true
        if (res.isSuccess) {
          if (that.orderStatusCode === 7) {
            if (res.rows != null) {
              for (var i = 0; i < res.rows.length; i++) {
                var afterList = []
                for (var j = 0; j < res.rows[i].order_items.length; j++) {
                  afterList.push(res.rows[i].order_items[j].type)
                }
                var afterStr = afterList.join(',')
                if (afterStr.indexOf('barter') !== -1) {
                  res.rows[i].after_type = 'barter'
                } else if (afterStr.indexOf('reship') !== -1) {
                  res.rows[i].after_type = 'reship'
                } else {
                  res.rows[i].after_type = 'refunds'
                }
              }
            }
          }
          if (that.orderStatusCode === 1) {
            if (res.rows != null) {
              var timearr = []
              for (let i = 0; i < res.rows.length; i++) {
                timearr.push(res.rows[i].countdown)
              }
              that.endTimeList = timearr
              var sectimeList = countDownList(timearr)
              that.saleTimeList = sectimeList
              that.time = setInterval(function () {
                for (var k = 0; k < timearr.length; k++) {
                  if (timearr[k] > 0) {
                    timearr[k] = --timearr[k]
                  } else {
                    timearr[k] = 0
                  }
                }
                that.endTimeList = timearr
                sectimeList = countDownList(timearr)
                that.saleTimeList = sectimeList
              }, 1000)
            }
          }
          if (res.rows !== null) {
            that.orderList = res.rows
            that.total = res.total
            that.orderNum = true
            that.loading = false
          } else {
            that.orderList = []
            that.orderNum = false
            that.loading = true
          }
          // setTimeout(function () {
          //   if ((parseInt(that.total) === parseInt(that.orderList.length) && parseInt(that.total) > 0) ||
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
      // 加载更多数据
      this.page = ++this.page
      var info = {
        id: this.orderStatusCode,
        page: this.page,
        limit: this.limit
      }
      var that = this
      getOrderList(info).then(res => {
        if (res.isSuccess) {
          if (that.orderStatusCode === 7) {
            if (res.rows != null && res.rows.length > 0) {
              that.orderList = that.orderList.concat(res.rows)
              for (var i = 0; i < that.orderList.length; i++) {
                var afterList = []
                for (var j = 0; j < that.orderList[i].order_items.length; j++) {
                  afterList.push(that.orderList[i].order_items[j].type)
                }
                var afterStr = afterList.join(',')
                if (afterStr.indexOf('barter') !== -1) {
                  that.orderList[i].after_type = 'barter'
                } else if (afterStr.indexOf('reship') !== -1) {
                  that.orderList[i].after_type = 'reship'
                } else {
                  that.orderList[i].after_type = 'refunds'
                }
              }
            }
          }
          if (that.orderStatusCode === 1) {
            if (res.rows != null) {
              that.orderList = that.orderList.concat(res.rows)
              var timearr = []
              for (let i = 0; i < that.orderList.length; i++) {
                timearr.push(that.orderList[i].countdown)
              }
              that.endTimeList = timearr
              var sectimeList = countDownList(timearr)
              that.saleTimeList = sectimeList
              that.time = setInterval(function () {
                for (var k = 0; k < timearr.length; k++) {
                  if (timearr[k] > 0) {
                    timearr[k] = --timearr[k]
                  } else {
                    timearr[k] = 0
                  }
                }
                that.endTimeList = timearr
                sectimeList = countDownList(timearr)
                that.saleTimeList = sectimeList
              }, 1000)
            }
          }
          if (res.rows !== null) {
            that.orderList = that.orderList.concat(res.rows)
            that.total = res.total
            that.orderNum = true
            that.loading = false
            // if (parseInt(that.total) === parseInt(that.orderList.length) && parseInt(that.total) > 0) {
            //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            // }
          } else {
            that.orderNum = false
            that.loading = true
          }
        }
      })
      // that.$refs.loadmore.onBottomLoaded()
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
    sureOrder(orderId) {
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('请确定已收到货品！', function (e) {
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
                  that.orderList = []
                  that.getList()
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
                  that.orderList = []
                  that.getList()
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
          System.payment.request(that.channels[0], param1, function () {
            that.allowbind = true
            Toast({
              message: '支付成功',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            // that.$router.replace({
            //   path: '/paySuccess?addrId=' + that.staticAdd[0].id
            // })
          }, function (e) {
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
              for (var i = 0; i < that.orderList.length; i++) {
                if (that.orderList[i].order_id === orderId) {
                  that.orderList[i].remind = 1
                  break
                }
              }
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
    beforeDestroy() {
      clearInterval(this.time)
    }
  },
  computed: {
    ...mapGetters([])
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .myOrder {
    overflow-x: hidden;
  }

  .order_header {
    text-align: center;
    background: #ff8d97;
    height: 94/100rem;
    line-height: 94/100rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 50;
  }

  .order_header icon {
    float: left;
    padding-left: 13px;
    color: #fff;
  }

  .order_header span {
    color: #fff;
    font-size: 38/100rem;
    margin-left: -26/100rem;
  }

  .order_body {
    height: 100%;
    margin-bottom: 98/100rem;
  }

  .order_type {
    height: 88/100rem;
    background: #fff;
    border-top: 1px solid transparent;
    border-bottom: 1px solid #dadada;
    width: 100%;
    white-space: nowrap;
    position: fixed;
    /* top: 94/100rem; */
    z-index: 50;
  }

  .order_type span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #444;
    margin: 0 21/100rem;
    height: 80/100rem;
    line-height: 80/100rem;
    /* width: 104/100rem; */
    display: inline-block;
    text-align: center;
    border-bottom: 5/100rem solid transparent;
    border-top: 5/100rem solid transparent;
  }

  .order_type .text_active {
    border-bottom: 5/100rem solid #ff8d97;
  }

  .order_list {
    // height: 100%;
    height: calc(100vh - 2.76rem);
    overflow-y: scroll;
    // padding-top: 94/100rem;
  }

  .order_list_null {
    height: 100%;
    padding-top: 94/100rem;
    text-align: center;
  }

  .order_list_null span {
    font-size: 28/100rem;
    color: #555;
    display: block;
    text-align: center;
  }

  .order_list_null .btn_red {
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

  .order_list .order_single {
    /* height: 520/100rem; */
    background: #fff;
    margin-bottom: 22/100rem;
  }

  /* 单个订单的订单号和订单状态 */

  .order_single .order_head {
    height: 27/100rem;
    margin: 0 24/100rem;
    padding-top: 35/100rem;
    padding-bottom: 18/100rem;
  }

  .order_head .order_code {
    color: #515151;
    font-size: 24/100rem;
    float: left;
  }

  .order_head .order_code span {
    font-family: "DIN";
  }

  .order_head .order_states {
    color: #ff8d97;
    font-size: 30/100rem;
    /* font-weight: bold; */
    float: right;
  }

  .order_states span {
    color: #dfdfdf;
  }

  .order_states div {
    float: left;
    padding: 0 20/100rem;
  }

  .order_states .delOrder {
    float: left;
  }

  .order_states .delOrder img {
    width: 34/100rem;
    height: 30/100rem;
  }

  /* 订单商品信息 */

  .order_single .order_pro_info {
    /* height: 252/100rem;
  background: #f8f8f8; */
    background: #f8f8f8;
    display: flex;
    align-items: center;
    padding: 30/100rem;
  }

  .order_pro_info .pro_img {
    float: left;
    /* margin-top: 40/100rem; */
    margin-left: 18/100rem;
    margin-right: 30/100rem;
  }

  .order_pro_info .pro_img img {
    width: 190/100rem;
    height: 190/100rem;
  }

  .order_pro_info .pro_info {
    float: left;
    width: 440/100rem;
  }

  .pro_info .pro_title {
    /* width: 400/100rem; */
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    border-radius: 10/100rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pro_info .title_icon {
    /* border: 2/100rem solid #ff8d97; */
    background: #ff8d97;
    height: 30/100rem;
    /* width: 48/100rem; */
    padding: 0 8/100rem;
    font-size: 20/100rem;
    color: #fff;
    border-radius: 8/100rem;
    line-height: 30/100rem;
    text-align: center;
    display: inline-block;
    margin-right: 10/100rem;
  }

  .pro_info .pro_color {
    /* width: 400/100rem; */
    font-size: 20/100rem;
    color: #999;
    margin: 10/100rem 0;
  }

  .pro_info .pro_spec {
    /* width: 490/100rem; */
    overflow: hidden;
    /* margin-top: 30/100rem; */
    height: 50/100rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pro_spec .pro_price {
    font-family: "DIN";
    width: 280/100rem;
    display: flex;
    align-items: center;
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
    display: flex;
    align-items: flex-end;
    /* margin-left: 10/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    display: inline-flex;
  }

  /* .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

  .pro_price .pro_orig {
    font-size: 22/100rem;
    color: #7c7c7c;
    text-decoration: line-through;
  }

  .pro_spec .pro_num {
    font-size: 20/100rem;
    color: #999;
    margin-right: 8/100rem;
  }

  .order_single .order_info {
    color: #555;
    font-size: 24/100rem;
    text-align: right;
    margin-top: 34/100rem;
    padding-bottom: 24/100rem;
    border-bottom: 1px solid #eaeaea;
  }

  .order_info span {
    color: #ff8d97;
    font-weight: bold;
    font-size: 30/100rem;
    font-family: "DIN";
  }

  .order_single .order_oper {
    /* margin-top: 25/100rem; */
    text-align: right;
    padding: 24/100rem 0;
  }

  .order_single .order_oper .countdown {
    font-size: 26/100rem;
    float: left;
    margin-left: 16/100rem;
    color: #f06b90;
    display: inline-flex;
    align-items: center;
    height: 0.66rem;
  }

  .order_single .order_oper .countdown .iconfont {
    margin-right: 4/100rem;
    color: #f06b90;
  }

  .order_single .order_oper .countdown span {
    margin-right: 4/100rem;
  }

  .order_oper button {
    margin-right: 16/100rem;
    border: 1px solid #808080;
    color: #808080;
    background: transparent;
    border-radius: 50/100rem;
    font-size: 26/100rem;
    width: 180/100rem;
    padding: 4/100rem 26/100rem;
  }

  .order_oper .btn_red {
    border-color: #f06b90;
    color: #f06b90;
  }

  .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
    margin-top: -22/100rem;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .view_hidden {
    display: none;
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
