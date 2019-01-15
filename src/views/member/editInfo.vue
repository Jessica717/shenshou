<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div class='editInfo'>
      <div style="height:0.9rem" id='addr'></div>
      <div :class="editInput==0?'e_body':'body_hide'">
        <div :class="editcode=='nickname'?'section':'hide'">
          <input placeholder="请输入昵称" type='text' v-model='value' @blur='editInfo(value)' />
        </div>
        <div v-if="editcode=='nickname'" class='info_tips'>
          <span>提示：昵称由2-8位中文，英文字母和数字及下划线组成</span>
        </div>
        <div :class="editcode=='email'?'section':'hide'">
          <input placeholder="请输入电子邮箱" type='text' @blur='editInfo(value)' v-model='value' />
        </div>
        <div class="section saveInfo">
          <button size='default' @click='saveInfo'>保存</button>
        </div>
      </div>
      <div :class="editInput==1?'e_add_body':'body_hide'">
        <!-- <radio-group bindchange="checkAddr"> -->
        <div class="add_section" v-for='(item,index) in addrList' :key='index'>
          <div class='add_info' @click='choseAdd((item.id))' >
            <div class='info_people'>
              <span class='peop_name'>{{item.ship_name}}</span>
              <span class='peop_tel'>{{item.ship_mobile}}</span>
            </div>
            <div class='info_addr'>
              <span style='margin-right:10/100rem;'>{{item.ship_area}}</span> {{item.ship_addr}}
            </div>
          </div>
          <div class='add_edit'>
            <div class='edit_radio'>
              <input :id='index' type="radio" :checked="item.is_default=='1'" :value="item.id" @click="checkAddr(item.id)">
              <label :for='index' @click="checkAddr(item.id)"></label>
              <span :class="item.is_default=='1'?'isChecked':''">默认地址</span>
            </div>
            <div class='operating'>
              <div @click='editAdd(item)' >
                <img src='@/assets/img/com/edit.png' class='oper_icon' />
                <span>编辑</span>
              </div>

              <div @click="delAdd(item.id)" >
                <img src='@/assets/img/com/del.png' class='oper_icon' />
                <span>删除</span>
              </div>
            </div>
          </div>
        </div>
        <!-- </radio-group> -->
        <div class='null_section'></div>
        <div class="add_saveInfo">
          <mt-button form-type='submit' size='normal' @click='newAdd'>+添加新地址</mt-button>
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
  MessageBox,
  Toast
} from 'mint-ui'
import {
  getMyaddrList, setDefaultAddr, delMyAddr, savePersonInfo, getPriceByTrack
} from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
export default {
  name: 'EditInfo',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    MessageBox,
    Toast
  },
  data() {
    return {
      formType: '',
      h_title: '我的优惠券',
      editcode: '',
      editInput: 0,
      addrList: [],
      value: '',
      chooseAdd: false,
      default_code: '',
      default_cou: '',
      ship_id: '',
      addType: '',
      staticAdd: [],
      orderType: '',
      pid: '',
      amount: 0
    }
  },
  mounted() {
    var options = this.$route.query
    console.log(options)
    var that = this
    this.formType = options.type
    if (options.type === 'choose') {
      that.chooseAdd = true
    }
    if (options.code === 'address') {
      if (options.type !== undefined) {
        let sureData = that.$store.state.home.choseAddr
        this.choseId = sureData.couCode
        this.ship_id = sureData.ship_id
        this.addType = sureData.addType
        this.orderType = sureData.orderType
        this.staticAdd = sureData.staticAdd
        this.pid = options.pid
        this.amount = sureData.amount
      }
    } else if (options.code === 'nickname' || options.code === 'email') {
      if (options.value === 'null' || options.value === '') {
        that.value = ''
      } else {
        that.value = options.value
      }
    }
    that.editcode = options.code
    that.editInput = options.isInput
    this.h_title = options.codename
    if (that.editcode === 'address') {
      Indicator.open('加载中...')
      that.getAddrList()
    }
  },
  methods: {
    ...mapMutations({
      setChoseAddr: 'SET_CHOSEADDR',
      setUserInfo: 'SET_USERINFO'
    }),
    getAddrList() {
      getMyaddrList().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          this.addrList = res.rows
        }
      })
    },
    editAdd: function (data) {
    //   wx.setStorageSync('edit_info', e.currentTarget.dataset.info)
      this.$router.push({
        path: '/editAddr',
        name: 'EditAddr',
        params: {
          'type': 'edit',
          'info': data
        }
      })
    },
    newAdd: function () {
      let type = ''
      let info = {}
      if (this.formType === 'choose') {
        type = 'choose'
        info = {
          coupon_code: this.choseId,
          checked: this.pid,
          shipmethod_id: this.ship_id,
          cart_type: this.addType,
          type: this.orderType,
          address_id: ''
        }
      } else {
        type = 'new'
      }
      this.$router.push({
        path: '/editAddr',
        name: 'EditAddr',
        params: {
          'type': type,
          'info': info
        }
      })
    },
    delAdd(id) {
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('是否删除当前地址?', function(e) {
          console.log('Close confirm: ' + e.index)
          if (e.index === 0 || e.index === '0') {
            delMyAddr(id).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '删除成功',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  Indicator.open('加载中...')
                  that.addrList = []
                  that.getAddrList()
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
          message: '是否删除当前地址',
          showCancelButton: true,
          closeOnClickModal: false
        }).then(res => {
          if (res === 'confirm') {
            delMyAddr(id).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '删除成功',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  Indicator.open('加载中...')
                  that.addrList = []
                  that.getAddrList()
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
    editInfo: function (e) {
      this.value = e
    },
    saveInfo: function () {
      var flag = true
      if (this.editcode === 'email') {
        let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$/
        if (!str.test(this.value)) {
          Toast({
            message: '请填写正确的邮箱',
            duration: 1000
          })
          flag = false
        }
      } else if (this.editcode === 'nickname') {
        let str = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,8}$/
        if (!str.test(this.value)) {
          Toast({
            message: '请填写正确的用户名',
            duration: 1000
          })
          flag = false
        }
      }
      var that = this
      if (flag) {
        var obj = {}
        var key = that.editcode
        obj[key] = that.value
        var arr = []
        arr.push(obj)
        savePersonInfo(JSON.stringify(arr)).then(res => {
          if (res.isSuccess) {
            Toast({
              message: '保存成功',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            if (that.editcode === 'nickname') {
              let userInfo = that.$store.state.home.userInfo
              userInfo.nickname = that.value
              that.setUserInfo(userInfo)
            }
            setTimeout(function () {
              that.$router.go(-1)
            }, 1000)
          }
        })
      }
    },
    checkAddr(id) {
      for (var i = 0, len = this.addrList.length; i < len; i++) {
        this.addrList[i].is_default = '0'
      }
      var list = {}
      for (let i = 0, len = this.addrList.length; i < len; i++) {
        if (this.addrList[i].id === id) {
          this.addrList[i].is_default = '1'
          list = this.addrList[i]
        }
      }
      var that = this
      let info = {
        id: id,
        ship_name: list.ship_name,
        ship_mobile: list.ship_mobile,
        ship_area: list.ship_area,
        ship_addr: list.ship_addr,
        is_default: '1'
      }
      setDefaultAddr(info).then(res => {
        if (res.isSuccess) {
          console.log(that.chooseAdd)
          if (that.chooseAdd) {
            let info = {
              coupon_code: that.choseId,
              checked: that.pid,
              shipmethod_id: that.ship_id,
              cart_type: that.addType,
              type: that.orderType,
              address_id: id
            }
            getPriceByTrack(info).then(res => {
              if (res.isSuccess) {
                let data = {
                  couInfo: '',
                  couValue: '',
                  couCode: '',
                  chooseAdd: '',
                  total_price: '',
                  staticAdd: [],
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
                console.log(list)
                data.couInfo = cou
                data.couValue = res.coupon_discount
                data.couCode = res.cart_params
                data.chooseAdd = id
                data.staticAdd.push(list)
                data.static_freight = res.cost_freight
                that.setChoseAddr(data)
                that.$router.go(-1)
              }
            })
          }
        }
      }
      )
    },
    choseAdd(id) {
      if (this.chooseAdd) {
        var list = {}
        for (var i = 0, len = this.addrList.length; i < len; i++) {
          if (this.addrList[i].id === id) {
            list = this.addrList[i]
          }
        }
        var that = this
        let info = {
          coupon_code: that.choseId,
          checked: that.pid,
          shipmethod_id: that.ship_id,
          cart_type: that.addType,
          type: that.orderType,
          address_id: id
        }
        getPriceByTrack(info).then(res => {
          if (res.isSuccess) {
            if (res.isSuccess) {
              let data = {
                couInfo: '',
                couValue: '',
                total_price: '',
                orderDetail: '',
                staticAdd: [],
                static_freight: '',
                chooseAdd: ''
              }
              data.total_price = res.amount
              let cou = ''
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
              data.chooseAdd = id
              data.couInfo = cou
              data.couValue = res.coupon_discount
              data.couCode = res.cart_params
              data.staticAdd.push(list)
              data.static_freight = res.cost_freight
              that.setChoseAddr(data)
              that.$router.go(-1)
            }
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
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .e_body {
    padding: 0 26/100rem;
    height: 100vh;
    background: #fff;
  }

  .e_body .section {
    border-bottom: 1/100rem solid #e3e3e3;
  }

  .e_body .info_tips {
    font-size: 24/100rem;
    margin-top: 10/100rem;
    margin-bottom: -24/100rem;
  }

  .e_body .hide {
    display: none;
  }

  .e_body .section input {
    padding: 40/100rem 20/100rem;
    outline: none;
  }

  ::-webkit-input-placeholder {
    font-size: 28/100rem;
    color: #bbb;
  }

  .saveInfo {
    border: none !important;
    margin-top: 126/100rem;
    text-align: center;
  }

  .saveInfo button {
    width: 460/100rem;
    height: 86/100rem;
    line-height: 86/100rem;
    border: none;
    background: #ff8d97;
    color: #fff;
    outline: none;
    font-size: 40/100rem;
    border-radius: 20/100rem;
  }

  /* 修改地址 */

  .e_add_body {
    background: #f2f2f2;
    height: auto;
  }

  .body_hide {
    display: none !important;
  }

  .add_section {
    /* height: 302/100rem; */
    background: #fff;
  }

  .add_section .add_info {
    padding: 0 26/100rem;
    padding-top: 49/100rem;
    padding-bottom: 39/100rem;
    border-bottom: 1/100rem solid #e4e4e4;
  }

  .add_info .info_people {
    display: flex;
    justify-content: space-between;
  }

  .info_people .peop_name {
    color: #333;
    font-size: 30/100rem;
    /* font-weight: bold; */
  }

  .info_people .peop_tel {
    color: #352228;
    font-size: 26/100rem;
    /* font-family: 'DIN'; */
  }

  .add_info .info_addr {
    color: #6d6d6d;
    font-size: 27/100rem;
  }

  .add_section .add_edit {
    padding: 0 26/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 22/100rem;
    padding-bottom: 44/100rem;
  }

  .add_edit .edit_radio {
    position: relative;
  }

  .add_edit .edit_radio span {
    font-size: 27/100rem;
    color: #2d2e30;
    margin-left: 0.1rem;
  }

  .isChecked {
    color: #ff8d97 !important;
  }

  .add_section {
    margin-bottom: 22/100rem;
  }

  .operating {
    display: inline-flex;
  }

  .operating .oper_icon {
    width: 35/100rem;
    height: 40/100rem;
    float: left;
    margin-left: 22/100rem;
  }

  .operating span {
    font-size: 27/100rem;
    color: #2d2e30;
    float: left;
    margin-top: 4/100rem;
    margin-left: 10/100rem;
  }

  .null_section {
    height: 138/100rem;
  }

  .add_saveInfo {
    position: fixed;
    bottom: 0;
    height: 138/100rem;
    width: 100%;
    background: #f2f2f2;
    text-align: center;
  }

  .null {
    bottom: 80%;
  }

  .add_saveInfo button {
    width: 460/100rem;
    height: 78/100rem;
    line-height: 78/100rem;
    border: none;
    background: #ff8d97;
    color: #fff;
    outline: none;
    font-size: 40/100rem;
    border-radius: 20/100rem;
    margin-top: 45/100rem;
  }

  /* radio的默认样式 */
  input[type="radio"] {
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
