<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div style='height:0.9rem' id='addr'></div>
    <div class='editAddr'>
      <div class='ea_body'>
        <div class='form_body'>
          <div class='section'>
            <span class='form_title text_left'>收货人</span>
            <input placeholder="请输入收货人姓名" name='name' @blur="validate('name',addInfo.name)" type="text" v-model="addInfo.name" />
            <div>
              <i v-if="form.name!==''" :class="form.name==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"
                size="16" />
            </div>
          </div>
          <div class='section'>
            <span class='form_title text_left'>联系电话</span>
            <input placeholder="请输入手机号码" type='number' name='phone' @blur="validate('phone',addInfo.mobile)" v-model="addInfo.mobile" />
            <div>
              <i v-if="form.phone!==''" :class="form.phone==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"
                size="16" />
            </div>
          </div>
          <div class='section'>
            <span class='form_title text_left'>所在区域</span>
            <!-- <p>地址3级联动：{{myAddressProvince}} {{myAddressCity}} {{myAddresscounty}}</p> -->
            <!-- <picker mode="region" name='area' data-name="area" bindchange="validate" value="areaShow" data-validator="required"> -->
            <span @click="showArea" style='width: 4.4rem;'>{{areaShow[0]}}，{{areaShow[1]}}，{{areaShow[2]}}</span>
            <!-- </picker> -->
            <div>
              <i v-if="form.area!==''" :class="form.area==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"
                size="16" />
            </div>
          </div>
          <div class='section'>
            <span class='form_title text_left'>详细地址</span>
            <input placeholder="请填写详细地址" name='addr' @blur="validate('addr',addInfo.addr)" type="text" v-model="addInfo.addr" />
            <div>
              <i v-if="form.addr!==''" :class="form.addr==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"
                size="16" />
            </div>
          </div>
          <div class='section' v-if='showswitch'>
            <span class='form_title'>是否设为默认地址</span>
            <mt-switch v-model="addInfo.is_default" name='is_default'></mt-switch>
            <!-- <switch checked='addInfo.is_default' name='is_default' data-name="required" /> -->
          </div>
          <div class='saveInfo'>
            <button @click="formSubmit">保存</button>
          </div>
        </div>
      </div>
      <div v-if="form.$dirty" class="invalid">
        {{form.$invalidMsg}}
      </div>
      <mt-popup v-model="areaChange" position="bottom" class='editArea'>
        <div class='picker_btn'>
          <span @click="hideArea">取消</span>
          <span @click="choseArea">确认</span>
        </div>
        <mt-picker :slots="myAddressSlots" @change="onMyAddressChange" v-model='areaShow'></mt-picker>
      </mt-popup>
      <!-- <div class='editArea_bg' v-if='areaChange' @click="hideArea"></div>
      <div class='editArea' v-if='areaChange'>
        <div class='picker_btn'>
          <span @click="hideArea">取消</span>
          <span @click="choseArea">确认</span>
        </div>
        <mt-picker :slots="myAddressSlots" @change="onMyAddressChange" v-model='areaShow'></mt-picker>
      </div> -->

    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
// import {
//   validate,
//   validateRequired
// } from '@/store/validate.js'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  setDefaultAddr, getPriceByTrack, changeAddr
} from '@/api/index'
import myaddress from '@/store/area.json'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast,
  Field,
  Picker,
  Switch,
  Popup
} from 'mint-ui'
export default {
  name: 'EditAddr',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    Field,
    Picker,
    Switch,
    Popup
  },
  data() {
    return {
      h_title: '编辑地址',
      editname: '新增地址',
      showswitch: true,
      addInfo: {
        id: '',
        name: null,
        mobile: null,
        area: null,
        addr: null,
        is_default: false
      },
      areaChange: false,
      areaShow: ['请选择省', '市', '区'],
      addType: null,
      addFrom: '',
      staticInfo: {},
      form: {
        $dirty: false,
        $invalidMsg: '',
        addr: '',
        area: '',
        name: '',
        phone: ''
      },
      myAddressSlots: [{
        flex: 1,
        defaultIndex: 1,
        values: Object.keys(myaddress), // 省份数组
        className: 'slot1',
        textAlign: 'center'
      }, {
        divider: true,
        content: '-',
        className: 'slot2'
      }, {
        flex: 1,
        values: [],
        className: 'slot3',
        textAlign: 'center'
      },
      {
        divider: true,
        content: '-',
        className: 'slot4'
      },
      {
        flex: 1,
        values: [],
        className: 'slot5',
        textAlign: 'center'
      }
      ],
      myAddressProvince: '省',
      myAddressCity: '市',
      myAddresscounty: '区/县'
    }
  },
  mounted() {
    this.$nextTick(() => { // vue里面全部加载好了再执行的函数  （类似于setTimeout）
      this.myAddressSlots[0].defaultIndex = 0
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
      // 因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
    })
    console.log(this.$route.params)
    let options = this.$route.params
    this.addType = options.type
    if (options.type === 'new' || options.type === 'choose') {
      this.addFrom = options.type
      this.h_title = this.editname
      this.staticInfo = options.info
    } else if (options.type === 'edit') {
      this.form = {
        $dirty: false,
        $invalidMsg: '',
        addr: false,
        area: false,
        name: false,
        phone: false
      }
      this.addInfo = '编辑地址'
      var info = options.info
      this.addInfo = {
        id: info.id,
        name: info.ship_name,
        mobile: info.ship_mobile,
        area: info.ship_area,
        addr: info.ship_addr,
        is_default: info.is_default === '1'
      }
      this.areaShow = this.addInfo.area.split('/')
    } else if (options.type === 'change') {
      console.log(options)
      this.form = {
        $dirty: false,
        $invalidMsg: '',
        addr: false,
        area: false,
        name: false,
        phone: false
      }
      this.addInfo = '修改地址'
      let info = options.info
      this.addInfo = {
        order_id: info.order_id,
        name: info.name,
        mobile: info.phone,
        area: info.area,
        addr: info.addr
      }
      this.areaShow = this.addInfo.area.split('/')
      this.showswitch = false
    }
  },
  methods: {
    ...mapMutations({
      setChoseAddr: 'SET_CHOSEADDR'
    }),
    onMyAddressChange(picker, values) {
      if (myaddress[values[0]]) { // 这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
        picker.setSlotValues(1, Object.keys(myaddress[values[0]])) // Object.keys()会返回一个数组，当前省的数组
        picker.setSlotValues(2, myaddress[values[0]][values[1]]) // 区/县数据就是一个数组
        this.myAddressProvince = values[0]
        this.myAddressCity = values[1]
        this.myAddresscounty = values[2]
      }
    },
    showArea() {
      this.areaChange = true
    },
    hideArea() {
      this.areaChange = false
    },
    choseArea() {
      this.areaShow[0] = this.myAddressProvince
      this.areaShow[1] = this.myAddressCity
      this.areaShow[2] = this.myAddresscounty
      this.areaChange = false
      this.addInfo.area = this.areaShow.join('/')
      this.form.$dirty = false
      this.form.$invalidMsg = ''
      this.form.area = false
    },
    bindRegionChange: function (e) {
      this.setData({
        region: e.detail.value
      })
    },
    validate(name, value) {
      console.log(name)
      console.log(value)
      this.form.$dirty = false
      this.form.$invalidMsg = ''
      if (name === 'name') {
        if (value === '' || value === null) {
          this.form.$dirty = true
          this.form.$invalidMsg = '姓名不能为空'
          this.form.name = true
        } else {
          this.form.$dirty = false
          this.form.$invalidMsg = ''
          this.form.name = false
        }
      } else if (name === 'phone') {
        let reg = /^[\d]{11}$/
        if (value === '' || value === null) {
          this.form.$dirty = true
          this.form.$invalidMsg = '手机号码不能为空'
          this.form.phone = true
        } else {
          console.log(reg.test(value))
          if (reg.test(value) === false) {
            this.form.$dirty = true
            this.form.$invalidMsg = '手机号码格式不正确'
            this.form.phone = true
          } else {
            this.form.$dirty = false
            this.form.$invalidMsg = ''
            this.form.phone = false
          }
        }
      } else if (name === 'addr') {
        if (value === '' || value === null) {
          this.form.$dirty = true
          this.form.$invalidMsg = '地址不能为空'
          this.form.addr = true
        } else {
          this.form.$dirty = false
          this.form.$invalidMsg = ''
          this.form.addr = false
        }
      } else {
        if (value === '' || value === null) {
          this.form.$dirty = true
          this.form.$invalidMsg = '区域不能为空'
          this.form.area = true
        } else {
          this.form.$dirty = false
          this.form.$invalidMsg = ''
          this.form.area = false
        }
      }
    },
    formSubmit: function (e) {
      let that = this
      console.log(this.form)
      if (this.form.name !== false) {
        this.validate('name', this.addInfo.name)
      } else if (this.form.phone !== false) {
        this.validate('phone', this.addInfo.phone)
      } else if (this.form.addr !== false) {
        this.validate('addr', this.addInfo.addr)
      } else if (this.form.area !== false) {
        this.validate('area', this.addInfo.area)
      } else {
        console.log('全部校验通过')
        if (this.addType === 'change') {
        // 订单详情修改地址
          var infoAddr = {
            order_id: that.addInfo.order_id,
            ship_name: that.addInfo.name,
            ship_mobile: that.addInfo.mobile,
            ship_area: that.addInfo.area,
            ship_addr: that.addInfo.addr
          }
          // 修改订单地址
          changeAddr(infoAddr).then(res => {
            if (res.isSuccess) {
              Toast({
                message: '操作成功',
                iconClass: 'iconfont icon-dui1',
                duration: 1000
              })
              setTimeout(function() {
                that.$router.go(-1)
              }, 1000)
            } else {
              that.$router.go(-1)
              // Toast({
              //   message: res.msg,
              //   duration: 2000
              // })
            }
          })
        } else {
          let info = {
            id: that.addInfo.id,
            ship_name: that.addInfo.name,
            ship_mobile: that.addInfo.mobile,
            ship_area: that.addInfo.area,
            ship_addr: that.addInfo.addr,
            is_default: that.addInfo.is_default === true ? '1' : '0'
          }
          console.log(info)
          setDefaultAddr(info).then(res => {
            if (res.isSuccess) {
              Toast({
                message: '操作成功',
                iconClass: 'iconfont icon-dui1',
                duration: 1000
              })
              console.log(that.addInfo.is_default)
              if (that.addInfo.is_default) {
                that.addInfo.id = res.id
                if (that.addFrom === 'new') {
                  that.$router.go(-1)
                } else {
                  that.staticInfo.address_id = that.addInfo.id
                  console.log(that.staticInfo)
                  getPriceByTrack(that.staticInfo).then(req => {
                    if (req.isSuccess) {
                      let data = {
                        couInfo: '',
                        couValue: '',
                        total_price: '',
                        orderDetail: '',
                        staticAdd: [],
                        static_freight: ''
                      }
                      data.total_price = req.amount
                      let cou = ''
                      if (that.choseId === '') {
                        cou = '选择优惠券'
                      } else {
                        cou = '已减' + parseInt(req.coupon_discount) + '元'
                      }
                      data.couInfo = cou
                      data.couValue = req.coupon_discount
                      data.couCode = req.cart_params
                      data.staticAdd.push(that.addInfo)
                      data.static_freight = req.cost_freight
                      that.setChoseAddr(data)
                      that.$router.go(-2)
                    }
                  })
                }
              } else {
                that.$router.go(-1)
              }
            } else {
              Toast({
                message: res.msg,
                duration: 2000
              })
            }
          })
        }
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

  .editAddr {
    background: #fff;
    height: calc(100vh - 0.9rem);
  }

  .ea_body {
    padding: 0 26/100rem;
    height: 100%;
    /* padding-top: 94/100rem; */
  }

  .ea_body .form_body {
    overflow: hidden;
  }

  .ea_body .section {
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20/100rem 0;
    margin-top: 44/100rem;
  }

  .section .form_title {
    font-size: 28/100rem;
    color: #555;
    display: inline-flex;
    justify-content: flex-start;
  }

  .section .text_left {
    width: 140/100rem;
  }

  .section .red {
    color: red;
  }

  .section .green {
    color: #09bb07;
  }

  .section picker {
    width: 494/100rem;
    margin-left: 42/100rem;
  }

  .section picker span {
    font-size: 28/100rem;
    color: #555;
  }

  .section input {
    width: 440/100rem;
    outline: none;
    line-height: 0.4rem;
  }

  .section ::-webkit-input-placeholder {
    font-size: 24/100rem;
    color: #bbb;
  }

  .section div {
    width: 40/100rem;
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

  .invalid {
    position: fixed;
    width: 100%;
    color: #fff;
    bottom: 0;
    background: #ff8d97;
    text-align: center;
  }

  .editArea_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 99;

  }

  .editArea {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 100;
    background: #fff;
    height: 40vh;
    border-top: 1px solid #e0e0e0;
  }

  .editArea .picker_btn {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0.26rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .editArea .picker_btn span {
    width: 50%;
    color: #2c3e50;
    text-align: center;
  }

</style>
