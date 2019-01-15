<template>
  <div>
    <common-header :h_title="h_title" :showback="false" :bgcolor='head_color'></common-header>
    <div style='height:0.9rem' id='car'></div>
    <return-top @returnTop='goTop'></return-top>
    <div class='my_car' v-if='isShow'>
      <div class='car_header' v-if='carNum'>
        <span>共有<span class='car_num'>{{total}}</span>件商品</span>
        <span class='car_edit' @click='edit' v-if='!isEdit'>编辑</span>
        <span class='car_edit' @click='edit' v-if='isEdit'>完成</span>
      </div>
      <div class='car_body' v-if='carNum'>
        <div class='car_list'>
          <div class='car_pro' v-for="(item,index) in carList" :key="index">
            <div class='pro_chose'>
              <input v-model="item.checked" :checked="item.checked" :id='item.product_id' type='checkbox' @click="chosePro(item)" />
              <label :for="item.product_id"></label>
            </div>
            <div class='pro_img' @click="goPro('normal',item.goods_id)">
              <img :src='item.goods.img' />
            </div>
            <div class='pro_info'>
              <div class='pro_title' @click="goPro('normal',item.goods_id)">{{item.name}}</div>
              <span class='pro_spec_info' v-if="item.title!=''">规格：{{item.title}}</span>
              <div class='pro_spec'>
                <div class='pro_price'>
                  <div>
                    <div class='peo_nowprice' v-if='item.deal_type!=2&&item.deal_type!=3'>￥{{item.price_cart}} </div>
                    <div class='pro_inter_img' v-if='item.deal_type==2||item.deal_type==3||item.deal_type>=4'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral' v-if='item.deal_type==2||item.deal_type==3||item.deal_type>=4'>{{item.point}}</span>
                  </div>
                </div>
                <div class='pro_icon'>
                  <mt-button size="small" class='pro_btn' @click='lessNum(item.product_id,item.quantity)'>-</mt-button>
                  <input v-model='item.quantity' @blur='changeValue(item.product_id,item.quantity)' type='number' @focus="isInput" />
                  <mt-button size="small" class='pro_btn' @click='addNum(item.product_id,item.quantity)'>+</mt-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='car_body_null' v-if='!carNum'>
        <span>您的购物车是空的，快去选购吧~</span>
        <button class='btn_red' @click="goLink('/index')">去首页看看</button>
      </div>
      <div class='recom_info'>
        <span class='i_title'>—————— 大家都在找 ——————</span>
        <div class='recom_list'>
          <div class='i_pro' v-for="(item,index) in recomList" :key="index">
            <div class='pro_img' @click="goPro('normal',item.goods_id)">
              <img :src='item.img' v-lazy="item.img" />
            </div>
            <div class='pro_title' @click="goPro('normal',item.goods_id)">
              {{item.name}}</div>
            <div class='pro_price'>
              <div style='display:inline-flex'>
                <div class='pro_flex' :hidden='item.deal_type==2'>
                  <span class='peo_nowprice' v-if='item.deal_type==1'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}+</span>
                </div>
                <div class='pro_flex' :hidden='item.deal_type==1'>
                  <div class='pro_inter_img'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2||item.deal_type==3'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>
              </div>
              <div class='pro_flex'>
                <i class='iconfont icon-car' @click='addCar(item.product_id,item.deal_type)'></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='order-car' v-if='carNum'>
        <span>—————— 我是有底线的 ——————</span>
      </div>
      <div class='car_score' v-if="isChose&&full_amount!=null&&!isEdit">
        <div v-if='scoreNum>0&&!isEdit' class='score'>
          <span>需消费积分</span>
          <span class='total_score'>{{scoreNum}}</span>
          <span>点</span>
        </div>
        <div class='shipping' v-if='difference>0'>
          <span>购满</span>
          <span class='total_score'>{{full_amount}}</span>
          <span>元包邮,还差</span>
          <span class='total_score'>{{difference}}</span>
          <span>元</span>
          <span @click="goLink('/single')" class='total_score join_total'>立即凑单</span>
        </div>
        <div class='shipping' v-if='difference<=0'>
          <span>已享受满</span>
          <span class='total_score'>{{full_amount}}</span>
          <span>元包邮</span>
        </div>
      </div>
      <div class='car_score' v-if="isChose&&full_amount==null&&scoreNum>0&&!isEdit">
        <div v-if='scoreNum>0&&!isEdit' class='score'>
          <span>需消费积分</span>
          <span class='total_score'>{{scoreNum}}</span>
          <span>点</span>
        </div>
      </div>
      <div class='car_edit_more' v-if='carNum'>
        <div class='allCheck'>
          <div class='checkbox'>
            <input v-model='allchose' type='checkbox' :checked="allchose==true" id='all' @click="checkAll" />
            <label for="all"></label>
          </div>
          <span>全选</span>
          <div class='car_pro_total' v-if='!isEdit'>合计：￥
            <span>{{priceAll}}</span>
          </div>
        </div>
        <mt-button size="small" @click='sureOrder' v-if='!isEdit&&miss_point==false'>结算({{choseNum}}件)</mt-button>
        <mt-button size="small" v-if='!isEdit&&miss_point==true' style='background:#d3d3d3'>积分不足</mt-button>
        <mt-button size="small" @click='delCar' v-if='isEdit'>删除</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import {
  Toast,
  MessageBox,
  Indicator,
  Button
} from 'mint-ui'
import {
  getCarList,
  getCarRecomList,
  updateCar,
  delCarPro,
  addCarofPro
} from '@/api/index'
export default {
  components: {
    commonHeader,
    Toast,
    MessageBox,
    Indicator,
    Button,
    returnTop
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      value: '',
      h_title: '购物车',
      miss_point: false,
      isShow: true,
      full_amount: 0.0,
      difference: 0.0,
      navNtn: 3,
      carList: [],
      recomList: [],
      isEdit: false,
      isChose: false,
      scoreAll: false,
      totalScore: 0,
      scoreNum: 0,
      priceAll: 0.0,
      discountAll: 0,
      allchose: false,
      total: 0,
      total_amout: 0,
      recom_total: 0,
      carNum: false,
      proType: 'normal',
      maxNum: 0,
      choseNum: 0,
      activeInput: false
    }
  },
  mounted() {
    let storage = window.localStorage
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      Indicator.open('加载中...')
      // 获取购物车推荐
      this.getRecom()
      // 获取购物车列表
      this.getList()
    }
  },
  methods: {
    ...mapMutations({
      setCarPro: 'SET_CARPRO',
      setCarAmount: 'SET_CARAMOUNT',
      setCarScore: 'SET_CARSCORE',
      setCarShip: 'SET_CARSHIP',
      setCarDifference: 'SET_CARDIFFERENCE',
      setCarnum: 'SET_CARNUM'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('car').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    isInput() {
      this.activeInput = true
    },
    sureOrder() {
      if (this.activeInput === false) {
        var choseList = []
        for (var j = 0, len = this.carList.length; j < len; j++) {
          if (this.carList[j].checked) {
            choseList.push(this.carList[j].product_id)
          }
        }
        if (choseList.length <= 0) {
          Toast({
            message: '请选择商品进行结算',
            duration: 1000
          })
        } else {
          if (Number(this.totalScore) < Number(this.scoreNum)) {
            Toast({
              message: '用户积分不足',
              duration: 1000
            })
          } else {
            if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
              this.$router.replace({
                path: '/bind?visit=4'
              })
            } else {
              if (window.plus) {
                window.plus.key.hideSoftKeybord()
              }
              window.localStorage.setItem('neworder', true)
              this.$router.togo({
                path: '/sureOrder?addType=0&proType=normal&id=' + choseList.join(',')
              })
            }
          }
        }
      }
    },
    goLink(url) {
      this.setCarAmount(this.priceAll)
      this.setCarShip(this.full_amount)
      this.setCarDifference(this.difference)
      this.$router.togo({
        path: url
      })
    },
    goPro(type, id) {
      this.setCarAmount(this.priceAll)
      this.setCarShip(this.full_amount)
      this.setCarDifference(this.difference)
      if (id === '') {} else {
        this.$router.togo({
          path: '/proDetail?type=' + type + '&id=' + id
        })
      }
    },
    delCar() {
      var that = this
      var choseList = []
      for (var j = 0, len = this.carList.length; j < len; j++) {
        if (this.carList[j].checked) {
          choseList.push(this.carList[j].product_id)
        }
      }
      if (choseList.length <= 0) {
        Toast({
          message: '请选择要操作的商品',
          duration: 1000
        })
      } else {
        let plus = window.plus
        if (window.plus) {
          plus.nativeUI.confirm('是否删除选中商品?', function(e) {
            console.log('Close confirm: ' + e.index)
            if (e.index === 0 || e.index === '0') {
              delCarPro(choseList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: '删除成功',
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.setCarPro([])
                  that.allchose = 0
                  that.priceAll = (0).toFixed(2)
                  that.difference = (0).toFixed(2)
                  that.scoreNum = 0
                  that.choseNum = 0
                  that.isChose = false
                  that.getList()
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
            message: '是否删除选中商品?',
            showCancelButton: true,
            closeOnClickModal: false
          }).then(res => {
            if (res === 'confirm') {
              delCarPro(choseList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: '删除成功',
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.setCarPro([])
                  that.allchose = 0
                  that.priceAll = (0).toFixed(2)
                  that.difference = (0).toFixed(2)
                  that.scoreNum = 0
                  that.choseNum = 0
                  that.isChose = false
                  that.getList()
                }
              })
            } else {
              console.log('用户点击取消')
            }
          })
        }
      }
    },
    addCar(id, type) {
      var that = this
      let info = {
        pid: id,
        quantity: 1,
        checked: 0,
        deal_type: type
      }
      addCarofPro(info).then(res => {
        if (res.isSuccess) {
          if (that.$store.state.home.carpro.length <= 0) {
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
    },
    checkAll() {
      this.allchose = !this.allchose
      var chosePro = []
      var flag = true
      for (var k = 0, len = this.carList.length; k < len; k++) {
        if (this.carList[k].checked === false) {
          flag = false
          break
        }
      }
      if (!flag) {
        let sum = 0
        let priceSum = 0
        let discount = 0
        for (let j = 0; j < this.carList.length; j++) {
          this.carList[j].checked = true
          chosePro.push(this.carList[j].product_id)
          sum += Number(this.carList[j].point) * this.carList[j].quantity * 100
          priceSum +=
              Number(this.carList[j].price_cart) *
              10000 *
              this.carList[j].quantity
          discount +=
              ((Number(this.carList[j].price_market) -
                  Number(this.carList[j].price_cart)) *
                100 *
                this.carList[j].quantity) /
              100
        }
        this.priceAll = priceSum
        this.choseNum = this.carList.length
        for (let a = 0; a < this.carList.length; a++) {
          if (this.carList[a].checked === false) {
            this.isChose = false
            break
          }
        }
        if (k >= this.carList.length) {
          this.allchose = true
          this.isChose = true
          this.setCarPro(chosePro)
        }
        if (!this.isEdit) {
          this.scoreAll = true
        }
        if (this.allchose === true) {
          this.priceAll = this.total_amout
        }
        this.allchose = true
        this.scoreNum = sum / 100
        this.priceAll = (priceSum / 10000).toFixed(2)
        this.difference = ((this.full_amount * 10000 - priceSum) / 10000).toFixed(2)
        this.discountAll = discount.toFixed(2)
        if (this.isEdit === false && this.scoreNum > this.totalScore) {
          this.miss_point = true
        } else {
          this.miss_point = false
        }
      } else {
        for (let b = 0; b < this.carList.length; b++) {
          this.carList[b].checked = false
        }
        this.setCarPro([])
        this.allchose = false
        this.priceAll = (0).toFixed(2)
        this.difference = (0).toFixed(2)
        this.scoreNum = 0
        this.choseNum = 0
        this.isChose = false
        this.miss_point = false
      }
    },
    chosePro(event) {
      event.checked = !event.checked
      this.isChose = true
      var chosePro = []
      // 将选中的商品id塞进缓存
      this.setCarPro([])
      let sum = 0
      let priceSum = 0
      let discount = 0
      for (var j = 0, len = this.carList.length; j < len; j++) {
        if (this.carList[j].checked) {
          sum += parseInt(this.carList[j].point) * this.carList[j].quantity * 100
          priceSum += parseFloat(this.carList[j].price_cart) * 10000 * this.carList[j].quantity
          discount += ((parseInt(this.carList[j].price_market) - parseInt(this.carList[j].price_cart)) * 100 * this.carList[j].quantity / 100)
          chosePro.push(this.carList[j].product_id)
        }
      }
      let status = this.carList.every(x => x.checked)
      if (status) {
        this.allchose = true
      } else {
        this.allchose = false
      }
      this.priceAll = priceSum
      if (!this.isEdit) {
        this.scoreAll = true
      }
      this.scoreNum = sum / 100
      this.priceAll = (priceSum / 10000).toFixed(2)
      this.difference = (((this.full_amount) * 10000 - priceSum) / 10000).toFixed(2)
      this.discountAll = discount.toFixed(2)
      if (this.isEdit === false && this.scoreNum > this.totalScore) {
        this.miss_point = true
      } else {
        this.miss_point = false
      }
      console.log(chosePro)
      this.setCarPro(chosePro)
      this.choseNum = chosePro.length
      console.log(this.choseNum)
    },
    edit() {
      this.isEdit = !this.isEdit
      this.scoreAll = false
      for (var j = 0, len = this.carList.length; j < len; j++) {
        if (this.carList[j].checked) {
          this.scoreAll = true
        }
      }
    },
    addNum(pid, num) {
      let value = parseInt(num)
      value++
      for (var i = 0, len = this.carList.length; i < len; i++) {
        if (this.carList[i].product_id === pid) {
          if (value > this.carList[i].store_usefull) {
            Toast({
              message: '库存不足',
              duration: 1000
            })
            this.carList[i].quantity = this.carList[i].store_usefull
          } else {
            this.carList[i].quantity = value
          }
        }
      }
      console.log(this.scoreNum)
      // 更新数据库配置
      this.upPro(pid, value)
    },
    lessNum(pid, num) {
      // let id = event.target.id
      let value = parseInt(num)
      for (var i = 0, len = this.carList.length; i < len; i++) {
        if (this.carList[i].product_id === pid) {
          if (value <= 1) {
            value = 1
          } else {
            value--
          }
          this.carList[i].quantity = value
        }
      }
      this.upPro(pid, value)
    },
    changeValue(id, value) {
      // this.upPro(e.target.id, e.detail.value)
      for (var i = 0, len = this.carList.length; i < len; i++) {
        if (this.carList[i].product_id === id) {
          if (value <= 1) {
            this.carList[i].quantity = 1
          } else {
            if (
              Number(value) > Number(this.carList[i].store_usefull)
            ) {
              Toast({
                message: '库存不足',
                duration: 1000
              })
              // 判断最大库存数
              this.carList[i].quantity = this.carList[i].store_usefull
            } else {
              this.carList[i].quantity = value
            }
          }
        }
      }
      this.upPro(id, value)
    },
    upPro: function (id, num) {
      var that = this
      let info = {
        pid: id,
        quantity: num
      }
      updateCar(info).then(res => {
        if (res.isSuccess) {
          this.upspec()
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
          if (res.num !== undefined) {
            that.maxNum = res.num
            // 当商品被选中，更改数量时更新总数
          } else {
            for (var i = 0; i < that.carList.length; i++) {
              if (that.carList[i].product_id === id) {
                that.carList[i].quantity = num - 1
              }
            }
            // 当商品被选中，更改数量时更新总数
          }
          this.upspec()
        }
      })
    },
    upspec() {
      let sum = 0
      let priceSum = 0
      let discount = 0
      for (var j = 0, len = this.carList.length; j < len; j++) {
        if (this.carList[j].checked) {
          sum += Number(this.carList[j].point) * this.carList[j].quantity * 100
          priceSum +=
              Number(this.carList[j].price_cart) *
              10000 *
              this.carList[j].quantity
          discount +=
              ((Number(this.carList[j].price_market) -
                  Number(this.carList[j].price_cart)) *
                100 *
                this.carList[j].quantity) /
              100
        }
      }
      this.scoreNum = sum / 100
      this.priceAll = (priceSum / 10000).toFixed(2)
      this.difference = ((this.full_amount * 10000 - priceSum) / 10000).toFixed(2)
      this.discountAll = discount.toFixed(2)
      if (this.isEdit === false && this.scoreNum > this.totalScore) {
        this.miss_point = true
      } else {
        this.miss_point = false
      }
      this.activeInput = false
    },
    getList() {
      var that = this
      getCarList().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.rows === false) {
            that.carList = []
            that.total = res.data.rows_total
            that.carNum = false
            that.total_amout = res.data.rows_total
            that.full_amount = res.data.free_freight
            that.choseNum = 0
          }
          if (res.data.rows.length > 0) {
            this.carNum = true
            for (var j = 0; j < res.data.rows.length; j++) {
              res.data.rows[j].checked = false
            }
            var choseList = []
            if (that.$store.state.home.carpro.length > 0) {
              choseList = that.$store.state.home.carpro
            }
            // app.globalData.carNum = res.data.rows_total
            let sum = 0
            let priceSum = 0
            let discount = 0
            console.log(choseList)
            if (choseList.length > 0) {
              for (let i = 0; i < choseList.length; i++) {
                for (let c = 0; c < res.data.rows.length; c++) {
                  if (choseList[i] === res.data.rows[c].product_id) {
                    res.data.rows[c].checked = true
                    sum +=
                        Number(res.data.rows[c].point) *
                        res.data.rows[c].quantity *
                        100
                    priceSum +=
                        Number(res.data.rows[c].price_cart) *
                        10000 *
                        res.data.rows[c].quantity
                    discount +=
                        ((Number(res.data.rows[c].price_market) -
                            Number(res.data.rows[c].price_cart)) *
                          100 *
                          res.data.rows[c].quantity) /
                        100
                  }
                }
              }
              if (this.isEdit === false && sum / 100 > res.data.member_point) {
                that.miss_point = true
              } else {
                that.miss_point = false
              }
              that.isChose = true
            }
            that.full_amount = res.data.free_freight
            that.carList = res.data.rows
            that.total = res.data.rows_total
            that.total_amout = res.data.rows_total
            that.scoreNum = sum / 100
            that.priceAll = (priceSum / 10000).toFixed(2)
            that.difference = (
              (res.data.free_freight * 10000 - priceSum) /
                10000
            ).toFixed(2)
            that.discountAll = discount.toFixed(2)
            that.choseNum = choseList.length
            that.totalScore = res.data.member_point
            if (choseList.length === res.data.rows.length) {
              that.allchose = true
              that.isChose = true
            }
          } else {
            that.carNum = false
          }
          that.setCarnum(that.total)
        }
      })
    },
    getRecom() {
      var that = this
      let info = {
        type: 1
      }
      getCarRecomList(info).then(res => {
        if (res.isSuccess) {
          that.recomList = res.data
          that.recom_total = res.total
        }
      })
    }
  },
  computed: {
    ...mapGetters(['number'])
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .my_car {
    font-family: SimHei;
    background: #f2f2f2;
    overflow-x: hidden;
    overflow-y: hidden;
    padding-bottom: 0.98rem;
  }

  .car_header {
    text-align: center;
    background: #ebebeb;
    height: 86/100rem;
    line-height: 86/100rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0.9rem;
    z-index: 50;
  }

  .car_header span {
    padding-left: 26/100rem;
    color: #515151;
    font-size: 24/100rem;
  }

  .car_header .car_num {
    color: #ff8d97;
    font-size: 26/100rem;
    padding-left: 0;
  }

  .car_header .car_edit {
    float: right;
    padding-right: 26/100rem;
    color: #ff8d97;
    font-size: 24/100rem;
  }

  .car_body {
    padding-top: 0.86rem;
  }

  .car_list_head {
    height: 1rem;
  }

  .car_body_null {
    padding-top: 110/100rem;
    text-align: center;
  }

  .car_body_null span {
    font-size: 28/100rem;
    color: #555;
    display: block;
    text-align: center;
  }

  .car_body_null .btn_red {
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

  .car_body .editDel {
    height: 92/100rem;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    top: 86/100rem;
    width: 100%;
    z-index: 50;
  }

  .editDel button {
    margin: 0;
    color: #ff8d97;
    background: transparent;
    border-radius: 32/100rem;
    border: 3/100rem solid #ff8d97;
    margin-right: 26/100rem;
  }

  .editDel button::after {
    border: 2/100rem solid transparent;
  }

  .car_list {
    /* background: #fff; */
    height: 100%;
  }

  /* .car_list_height {
  padding-top: 92/100rem;
} */

  .car_list .chose_date {
    color: #686868;
    font-size: 28/100rem;
    margin-left: 26/100rem;
    font-family: "DIN";
  }

  /* 订单商品信息 */

  .car_list .car_pro {
    padding: 10/100rem 36/100rem;
    height: 260/100rem;
    background: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 20/100rem;
  }

  .car_pro .pro_chose {
    // float: left;
    // display: flex;
    // align-items: center;
    // height: 262/100rem;
    position: relative;
  }

  .car_pro .pro_img {
    float: left;
    /* margin-top: 40/100rem; */
    margin-left: 18/100rem;
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 190/100rem;
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
    /* width: 100%; */
    width: 400/100rem;
    float: left;
  }

  .pro_info .pro_title {
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pro_spec_info {
    font-size: 24/100rem;
    color: #7c7c7c;
  }

  .pro_info .pro_spec {
    /* width: 490/100rem; */
    overflow: hidden;
    /* margin-top: 14/100rem; */
    /* height: 64/100rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pro_spec .pro_price {
    font-family: "DIN";
    width: 240/100rem;
    /* display: flex;
  align-items: center; */
  }

  .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
    /* margin-bottom: -10/100rem; */
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
    align-items: flex-end;
    /* margin-left: 9/100rem; */
    /* margin-right: 30/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    display: inline-flex;
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
  }

  .pro_price .pro_orig {
    font-size: 22/100rem;
    color: #7c7c7c;
    text-decoration: line-through;
  }

  .pro_spec .pro_icon {
    margin-right: 4/100rem;
    display: flex;
    border: 1px solid #ccc;
    border-radius: 6/100rem;
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
    /* font-weight: bold; */
    color: #565656;
    text-align: center;
    display: flex;
    align-items: center;
    font-family: "DIN";
    outline: none;
  }

  /* 购物车推荐商品 */

  // .recom_info {}

  .i_pro_content_null {
    font-size: 25/100rem;
    color: #555;
    text-align: center;
    background: #f2f2f2;
    padding: 30px 0;
  }

  .recom_info .i_title {
    font-size: 25/100rem;
    color: #bebebe;
    text-align: center;
    display: block;
    height: 99/100rem;
    line-height: 99/100rem;
    background: #f2f2f2;
  }

  .recom_list {
    background: #f2f2f2;
    overflow: hidden;
  }

  .recom_list .i_pro {
    width: 370/100rem;
    height: 550/100rem;
    float: left;
    background: #fff;
    /* padding: 0 26/100rem; */
    /* margin-right: 7/100rem; */
    margin-bottom: 13/100rem;
    position: relative;
  }

  .recom_list .i_pro:nth-child(even) {
    float: right;
  }

  .recom_list .i_pro .pro_img {
    /* margin-top: 40/100rem;
  margin-left: 18/100rem;
  margin-right: 30/100rem; */
    position: relative;
  }

  .recom_list .pro_img img {
    width: 370/100rem;
    height: 370/100rem;
  }

  .recom_list .i_pro .pro_title {
    width: 320/100rem;
    font-size: 24/100rem;
    color: #333;
    margin-top: 20/100rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    height: 70/100rem;
    padding: 0 26/100rem;
  }

  .recom_list .pro_title .pro_level {
    width: 80/100rem;
    border: 2/100rem solid #ff8d97;
    border-radius: 16/100rem;
    display: inline-flex;
    align-items: center;
    margin-right: 6/100rem;
    padding: 0 4/100rem;
    justify-content: center;
  }

  .recom_list .pro_level .iconfont {
    color: #ff8d97;
    display: inline-flex;
  }

  .recom_list .pro_level span {
    color: #ff8d97;
    font-size: 22/100rem;
  }

  .recom_list .i_pro .pro_price {
    margin-top: 10/100rem;
    font-family: "DIN";
    /* width: 280/100rem; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16/100rem;
  }

  .recom_list .pro_price .pro_flex .iconfont {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
    display: inline-flex;
  }

  .recom_list .pro_price .i_level {
    position: relative;
  }

  .recom_list .pro_price .i_level img {
    width: 38/100rem;
    height: 41/100rem;
  }

  .recom_list .pro_price .i_level span {
    color: #fff;
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    font-size: 18/100rem;
    font-weight: bold;
    font-family: "DIN";
  }

  .recom_list .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .recom_list .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
  }

  .recom_list .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: flex-end;
    /* margin-left: 10/100rem; */
  }

  .recom_list .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    display: inline-flex;
  }

  /* .recom_list .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

  .recom_list .pro_price .pro_orig {
    font-size: 22/100rem;
    color: #7c7c7c;
    text-decoration: line-through;
  }

  .order-car {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
    margin-bottom: 100/100rem;
  }

  .order-car span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  /* 空白的块，解决底部导航占领高度 */

  .null_height {
    height: 100/100rem;
  }

  .car_score {
    width: 100%;
    height: 74/100rem;
    position: fixed;
    bottom: 198/100rem;
    border-top: 1px solid #edd9b0;
    border-bottom: 1px solid #edd9b0;
    background: #fff3db;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26/100rem;
    color: #4a4a4a;
    z-index: 20;
  }

  .car_score .score {
    padding-left: 26/100rem;
    display: inline-flex;
  }

  .score .total_score {
    color: #ff8d97;
    font-family: "DIN";
  }

  .car_score .shipping {
    padding-left: 26/100rem;
    padding-right: 26/100rem;
    display: inline-flex;
  }

  .shipping .total_score {
    color: #ff8d97;
    font-family: "DIN";
  }

  .shipping .join_total {
    margin-left: 10/100rem;
  }

  .car_edit_more {
    height: 100/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0.98rem;
    width: 100%;
    background: #fff;
    z-index: 50;
  }

  .car_edit_more .allCheck {
    margin-left: 26/100rem;
    font-size: 26/100rem;
    color: #555;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .car_edit_more .allCheck .checkbox {
    position: relative;
    margin-right: 0.12rem;
    margin-top: -0.1rem;
  }

  .allCheck .car_pro_total {
    font-family: "DIN";
    font-size: 30/100rem;
    /* font-weight: bold; */
    display: flex;
    align-items: center;
    color: #484848;
    margin-left: 27/100rem;
  }

  .car_pro_total span {
    font-size: 42/100rem;
    color: #ff8d97;
    font-family: "DIN";
    align-items: flex-end;
  }

  .car_edit_more button {
    float: right;
    min-width: 244/100rem;
    height: 100/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 34/100rem;
    line-height: 100/100rem;
    border-radius: 0;
    margin: 0;
  }

  // input[type="checkbox"] {
  //   border-radius: 50%;
  //   width: 34/100rem;
  //   height: 34/100rem;
  //   -webkit-appearance: none;
  //   vertical-align: middle;
  //   margin-top: 0;
  //   background: #fff;
  //   border: #999 solid 1px;
  // }
  // input[type="checkbox"]:checked {
  //   border: 1px solid transparent;
  //   background: #ff8d97;
  // }
  // input[type="checkbox"]:checked::after {
  //   content: "\00a0";
  //   border-radius: 50%;
  //   width: 34/100rem;
  //   height: 34/100rem;
  //   line-height: 34/100rem;
  //   text-align: center;
  //   font-size: 30/100rem;
  //   color: #fff;
  //   background: transparent;
  //   transform: translate(-50%, -50%) scale(1);
  //   -webkit-transform: translate(-50%, -50%) scale(1);
  // }
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
