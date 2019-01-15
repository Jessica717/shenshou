<template>
  <div style="background:#fff">
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='improveInfo'>
      <div class='improve_title'>
        <span>完善个人信息</span>
      </div>
      <div class='improve_tips'>
        <span>生日，性别保存后不可修改</span>
      </div>
      <div class='improve_body'>
        <!-- <form bindsubmit="formSubmit" bindreset="formReset"> -->
          <div class='section'>
            <span class='info_title'>选择您的生日</span>
            <!-- <picker mode="date" value="birthday" start="1900-01-01" bindchange="bindDateChange"> -->
            <div @click='openBirth' class='pickers'>
              <span v-if='birthday!=null'>{{birthday}}</span>
              <span v-if='birthday==null'>仅自己可见</span>
              <i class='iconfont icon-youjiantou1'></i>
            </div>
            <!-- </picker> -->
          </div>
          <div class='section'>
            <span class='info_title'>选择您的性别</span>
            <div class='info_radiolist'>
              <div class='info_radio'>
                <input id='m' type="radio" :checked="sex=='male'" :value="sex" @click="radioChange('male')">
                <label for='m' @click="radioChange('male')"></label>
                <span>男</span>
              </div>
              <div class='info_radio'>
                <input id='w' type="radio" :checked="sex=='female'" :value="sex" @click="radioChange('female')">
                <label for='w' @click="radioChange('female')"></label>
                <span>女</span>
              </div>
            </div>
          </div>
          <div class="next">
            <mt-button form-type='submit' size='normal' v-if="visited=='0'" @click="formSubmit">完成</mt-button>
            <mt-button form-type='submit' size='normal' v-else @click="formSubmit">完成</mt-button>
          </div>
        <!-- </form> -->
      </div>
        <mt-datetime-picker ref="dataPicker" type="date"  v-model="nowDate" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm" :startDate = "startDate"
        :endDate = "endDate">
        </mt-datetime-picker>
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
  Picker,
  MessageBox
} from 'mint-ui'
import {
  savePersonInfo
} from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
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
    Toast,
    Picker,
    MessageBox
  },
  data() {
    return {
      h_title: '完善信息',
      visited: 0,
      sex: 'male',
      birthday: null,
      nowDate: parseTime(new Date().getTime(), '{y}-{m}-{d}'),
      startDate: new Date('1970-01-01'),
      endDate: new Date('2019-01-22')
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    // console.log(this.$route.query)
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    openBirth() {
      this.$refs.dataPicker.open()
    },
    handleConfirm(e) {
      this.birthday = parseTime(e.getTime(), '{y}-{m}-{d}')
    },
    radioChange(id) {
      this.sex = id
    },
    formSubmit: function () {
      var that = this
      var arr = []
      if (this.birthday != null) {
        let plus = window.plus
        if (window.plus) {
          plus.nativeUI.confirm('生日，性别一旦保存不能修改', function(e) {
            console.log('Close confirm: ' + e.index)
            if (e.index === 0 || e.index === '0') {
              arr = [{
                sex: that.sex,
                birthday: (new Date(that.birthday).getTime()) / 1000
              }]
              savePersonInfo(JSON.stringify(arr)).then(req => {
                if (req.isSuccess) {
                  Toast({
                    message: '保存成功',
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  setTimeout(function() {
                    that.$router.back()
                  }, 1000)
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
            message: '生日，性别一旦保存不能修改',
            showCancelButton: true,
            closeOnClickModal: false
          }).then(res => {
            if (res === 'confirm') {
              arr = [{
                sex: that.sex,
                birthday: (new Date(that.birthday).getTime()) / 1000
              }]
              savePersonInfo(JSON.stringify(arr)).then(req => {
                if (req.isSuccess) {
                  Toast({
                    message: '保存成功',
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  setTimeout(function() {
                    that.$router.back()
                  }, 1000)
                }
              })
            } else {
              console.log('用户点击取消')
            }
          })
        }
      } else {
        Toast({
          message: '请选择生日',
          duration: 1000
        })
      }
    }
    // goNext: function () {
    //   wx.redirectTo({
    //     url: '../Interested/Interested?visit=0'
    //   })
    // }
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .improveInfo {
    text-align: center;
  }

  .jump {
    text-align: right;
    font-size: 30/100rem;
    //   font-weight: bold;
    color: #666;
    margin-top: 58/100rem;
    margin-right: 58/100rem;
  }

  .improve_title {
    margin-top: 60/100rem;
    text-align: center;
  }

  .improve_title span {
    color: #343434;
    font-size: 44/100rem;
    display: inline;
    /* font-family: Arial, Helvetica, sans-serif, SimHei; */
  }

  .improve_tips {
    margin-top: 28/100rem;
    text-align: center;
  }

  .improve_tips span {
    color: #8f8f8f;
    font-size: 26/100rem;
    display: inline;
    line-height: 10/100rem;
    /* font-family: Arial, Helvetica, sans-serif, SimHei; */
  }

  .improve_body {
    padding: 0 78/100rem;
    margin-top: 60/100rem;
  }

  .section {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 12/100rem 0;
  }

  .section:first-child {
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 64/100rem;
  }

  .section .info_title {
    font-size: 30/100rem;
    color: #808080;
  }

  .section .pickers span {
    font-size: 24/100rem;
    color: #b3b3b3;
    margin-right: 70/100rem;
  }

  .section i {
    color: #bebebe;
    display: inline-flex;
    font-size: 26/100rem;
  }

  .section .info_radiolist {
    display: inline-flex;
  }

  .info_radiolist .info_radio {
    position: relative;
    margin: 0 0.2rem;
  }

  .section .info_radio span {
    font-size: 27/100rem;
    color: #2d2e30;
    margin-left: 0.1rem;
  }

  .next {
    margin-top: 110/100rem;
    text-align: center;
  }

  .next button {
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
    border-radius: 50%;
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
