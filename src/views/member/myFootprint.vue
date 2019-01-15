<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='foot'></div>
    <div class='my_footprint' v-if='isShow'>
      <div class='foot_header' v-if='total>0'>
        <span>共浏览<span class='foot_num'>{{total}}</span>件商品</span>
        <span class='foot_edit' @click='edit' :hidden='isEdit'>编辑</span>
        <span class='foot_edit' @click='edit' :hidden='!isEdit'>完成</span>
      </div>
      <div :class="total>0?'foot_body':'foot_body top'">
        <div class="foot_date">
          <date-picker :date="date" @getValue='getValue'></date-picker>
          <!-- <template is="calendar" data="...calendar" /> -->
        </div>
        <div class="foot_list" v-if='footList.length>0'>
          <span class='chose_date'>{{mon}}月{{day}}日</span>
          <!-- <checkbox-group bindchange="chosefoot"> -->
          <div class='foot_pro' v-for="(item,index) in footList" :key="index">
            <div class='pro_chose' v-if='isEdit'>
              <input v-model="item.checked" :id='item.id' type='checkbox' @click="chosefoot(item)" />
              <label :for="item.id"></label>
              <!-- <checkbox value="item.id" checked="item.checked" /> -->
            </div>
            <div class='pro_img' @click='goPro(item.goods_id)' >
              <img :src='item.img' />
            </div>
            <div class='pro_info'>
              <div class='pro_title' @click='goPro(item.goods_id)' >
                <div class='pro_level' v-if='item.promotion==1'>
                  <img src='@/assets/img/member/cu.png' />
                  <span>限时购</span>
                </div>
                {{item.name}}
              </div>
              <div class='pro_spec'>
                <div class='pro_price'>
                  <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}} </span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>+</span>
                  <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>
                <div class='pro_icon' v-if='!isEdit' @click='goPro(item.goods_id)' >
                  <img src='@/assets/img/member/red_car.png' />
                </div>
              </div>
            </div>
          </div>
          <!-- </checkbox-group> -->
        </div>
        <div class='order-foot' v-if='total>0'>
          <span>—————— 我是有底线的 ——————</span>
        </div>
        <div class='foot_list_null' v-if='footList.length==0'>暂无数据</div>
      </div>
      <div class='foot_edit_more' v-if='isEdit&&footList.length>0'>
        <div class='allCheck'>
          <!-- <checkbox @click='checkAll' checked='allchose==1' /> -->
          <div class='checkbox'>
            <input v-model='allchose' :checked="allchose==true" id='all' type='checkbox' @click="checkAll" />
            <label for="all"></label>
          </div>
          <span>全选</span>
        </div>
        <mt-button size='small' @click='delFoot'>删除</mt-button>
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
import DatePicker from '@/components/DatePicker.vue'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  getFootDays,
  delFootsList
} from '@/api/index'
  // import {
  //   getOrderDetail
  // } from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
  // import {
  //   setToken,
  //   getToken
  // } from '@/store/auth'
export default {
  name: 'MyFootprint',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    DatePicker,
    MessageBox
  },
  data() {
    return {
      h_title: '我的足迹',
      isShow: true,
      //   apiUrl: app.globalData.apiUrl,
      footList: [],
      // date_show: false,
      year: new Date().getFullYear(),
      mon: new Date().getMonth() + 1,
      day: new Date().getDate(),
      isEdit: false,
      total: 0,
      delList: [],
      page: 1,
      pagesize: 100,
      allchose: false,
      date: new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1 <= 9
            ? '0' + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1) +
          '-' +
          (new Date().getDate() <= 9
            ? '0' + (new Date().getDate())
            : new Date().getDate())
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    // console.log(this.$route.query)
    // console.log(this.$store.state.home.footNum)
    // console.log(this.$store.state.home.footList)
    // this.$nextTick(() => {
    //   this.total = this.$store.state.home.footNum
    //   this.footList = this.$store.state.home.footList
    // })
    console.log(this.date)
    this.getFoot(this.date)
  },
  methods: {
    getValue(e) {
      console.log(e)
      if (!e) {
        this.footList = []
        this.total = 0
        Toast({
          message: '当天没有足迹',
          duration: 1000
        })
      } else {
        this.getFoot(e)
        this.date = e
        const splitValue = e.split('-')
        this.mon = splitValue[1]
        this.day = splitValue[2]
        Indicator.open('加载中...')
      }
    },
    getFoot(date) {
      this.footList = []
      const splitValue = date.split('-')
      let info = {
        month: splitValue[0] + '-' + splitValue[1],
        date: date
      }
      this.setfootNum(0)
      this.setfootNum([])
      let that = this
      getFootDays(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
        //   that.setfootNum(res.data.foot_list.total)
        //   that.setfootList(res.data.foot_list.rows)
          that.total = res.data.foot_list.total
          that.footList = res.data.foot_list.rows
        }
      })
    },
    ...mapMutations({
      setfootNum: 'SET_FOOTNUM',
      setfootList: 'SET_FOOTLIST'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('foot').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    goPro(id) {
      this.$router.togo({
        path: '/proDetail?type=normal&id=' + id
      })
    },
    edit: function () {
      this.isEdit = !this.isEdit
    },
    checkAll: function () {
      this.delList = []
      console.log(this.allchose)
      if (this.allchose === false) {
        for (let j = 0; j < this.footList.length; j++) {
          this.footList[j].checked = true
          this.delList.push(this.footList[j].id)
        }
        this.allchose = true
      } else {
        for (let j = 0; j < this.footList.length; j++) {
          this.footList[j].checked = false
        }
        this.delList = []
        this.allchose = false
      }
    },
    confirm() {
      console.log(this.date)
    },
    chosefoot(event) {
      event.checked = !event.checked
      this.delList = []
      for (let j = 0; j < this.footList.length; j++) {
        if (this.footList[j].checked) {
          this.delList.push(this.footList[j].id)
        }
      }
      let status = this.footList.every(x => x.checked)
      if (status) {
        this.allchose = true
      } else {
        this.allchose = false
      }
    },
    delFoot: function () {
      var that = this
      if (that.delList.length <= 0) {
        Toast({
          message: '请选择要操作的数据',
          duration: 1000
        })
      } else {
        let plus = window.plus
        if (window.plus) {
          plus.nativeUI.confirm('是否删除选中内容?', function(e) {
            console.log('Close confirm: ' + e.index)
            if (e.index === 0 || e.index === '0') {
              delFootsList(that.delList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: res.msg,
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.allchose = false
                  that.footList = []
                  that.getFoot(that.date)
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
            message: '是否删除选中内容?',
            showCancelButton: true,
            closeOnClickModal: false
          }).then(res => {
            if (res === 'confirm') {
              delFootsList(that.delList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: res.msg,
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.allchose = false
                  that.footList = []
                  that.getFoot(that.date)
                } else {
                  Toast({
                    message: res.msg,
                    duration: 1000
                  })
                }
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
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .my_footprint {
    overflow-x: hidden;
  }

  .foot_header {
    text-align: center;
    background: #ebebeb;
    width: 100%;
    height: 86/100rem;
    line-height: 86/100rem;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0.9rem;
    z-index: 100;
  }

  .foot_header span {
    padding-left: 26/100rem;
    color: #515151;
    font-size: 24/100rem;
  }

  .foot_header .foot_num {
    color: #ff8d97;
    font-size: 26/100rem;
    padding-left: 0;
  }

  .foot_header .foot_edit {
    float: right;
    padding-right: 26/100rem;
    color: #ff8d97;
    font-size: 24/100rem;
  }

  .foot_body {
    height: 100%;
    padding-top: 86/100rem;
  }

  .top {
    padding-top: 0;
  }

  .foot_body .foot_date {
    // padding: 0 10/100rem;
    background: #f8f8f8;
    position: relative;
    overflow: hidden;
    height: 450/100rem;
    /* 原始高度 */
  }

  /* .foot_body  .foot_date_hidden {
  padding: 0 10/100rem;
  background: #f8f8f8;
  position: relative;
  overflow: hidden;
  height: 170/100rem;
} */

  /* .foot_body .down_more {
  width: 80/100rem;
  height: 80/100rem;
  line-height: 80/100rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #f8f8f8;
  position: absolute;
  top: 140/100rem;
  right: 20/100rem;
}

.foot_body .down_more_down {
  width: 80/100rem;
  height: 80/100rem;
  line-height: 80/100rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #f8f8f8;
  position: absolute;
  top: 695/100rem;
  right: 20/100rem;
}

.down_more icon {
  color: #cecece;
} */

  .foot_list {
    padding-top: 32/100rem;
    background: #fff;
  }

  .foot_list .chose_date {
    color: #686868;
    font-size: 28/100rem;
    margin-left: 26/100rem;
    font-family: "DIN";
  }

  /* 订单商品信息 */

  .foot_list .foot_pro {
    padding: 0 26/100rem;
    height: 220/100rem;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
  }

  .foot_pro .pro_chose {
    // float: left;
    // display: flex;
    // align-items: center;
    // height: 262/100rem;
    margin-right: 16/100rem;
    position: relative;
  }

  .foot_pro .pro_img {
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

  .foot_pro .pro_info {
    /* float: left; */
    width: 100%;
  }

  .pro_info .pro_title {
    /* width: 100%;
  max-width: 490/100rem; */
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pro_title img {
    width: 68/100rem;
    height: 24/100rem;
  }

  .pro_title .pro_level {
    width: 68/100rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 24/100rem;
  }

  .pro_title .pro_level span {
    font-size: 16/100rem;
    color: #fefefe;
    position: absolute;
    left: 46%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }

  .pro_level text {
    color: #fff;
  }

  .pro_info .pro_spec {
    /* width: 490/100rem; */
    overflow: hidden;
    margin-top: 30/100rem;
    height: 64/100rem;
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
    /* margin-left: 9/100rem; */
    /* margin-right: 30/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 26/100rem;
    font-weight: bold;
    display: inline-flex;
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
  }

  .pro_icon img {
    width: 50/100rem;
    height: 46/100rem;
  }

  .pro_icon button {
    width: 170/100rem;
    height: 52/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 26/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 52/100rem;
    border-radius: 50/100rem;
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

  .foot_list_null {
    text-align: center;
    font-size: 30/100rem;
    /* font-weight: bold; */
    padding: 20/100rem 0;
    color: #999;
  }

  /* 空白的块，解决底部导航占领高度 */

  .null_height {
    height: 100/100rem;
  }

  .foot_edit_more {
    box-shadow: 0 8/100rem 20/100rem 10/100rem #dadada;
    height: 100/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
  }

  .foot_edit_more .allCheck {
    margin-left: 26/100rem;
    font-size: 26/100rem;
    color: #555;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .foot_edit_more .allCheck .checkbox {
    position: relative;
    margin-right: 0.12rem;
    margin-top: -0.1rem;
  }

  .foot_edit_more button {
    float: right;
    width: 210/100rem;
    height: 100/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 34/100rem;
    line-height: 100/100rem;
    border-radius: 0;
    margin: 0;
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
