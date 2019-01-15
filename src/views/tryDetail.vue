<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='try'></div>
    <div v-if='isShow'>
      <div class='try_detail'>
        <div class='try_body'>
          <div class='try_pro_info'>
            <div class='pro_img'>
              <div class='pro_swiper'>
                <mt-swipe :auto="3000" :speed='1000' :defaultIndex='0' :continuous='true' class='swiper_bg'>
                  <mt-swipe-item v-for="(item,index) in proInfo.pic" :key='index'>
                    <img :src="item" class='slide-img'>
                  </mt-swipe-item>
                </mt-swipe>
              </div>
              <div class='pro_down' v-if='endTime>0'>
                <span>距结束还剩：</span>
                <span class='time_bg'>{{saleTime.day}}</span>天
                <span class='time_bg'>{{saleTime.hou}}</span>小时
                <span class='time_bg'>{{saleTime.min}}</span>分
                <span class='time_bg'>{{saleTime.sec}}</span>秒
              </div>
            </div>
            <div class='pro_title'>
              <i class='iconfont icon-shiyong'></i>
              <span>{{proInfo.name}}</span>
            </div>
            <div class='pro_other'>
              <div>
                <span>限量</span>
                <span class='num'>{{proInfo.num}}</span>份</div>
              <div>
                <span class='peo_num'>{{proInfo.count}}</span>人申请
              </div>
              <div style='display:inline-flex;align-items:center;'>
                <span class='nowPrice' v-if='proInfo.deal_type!=2'>¥{{proInfo.price}}</span>
              </div>
            </div>
          </div>
          <div class='try_pro_game' v-if='proInfo.is_help==1'>
            <div class='try_pro_title'>领取规则</div>
            <div class='try_pro_intrduce'>
              <i class='iconfont icon-yaoqing'></i>
              <span>邀请好友</span>
              <i class='iconfont icon-peoples'></i>
              <span>{{proInfo.help_num}}人助力</span>
              <i class='iconfont icon-weibiaoti2fuzhi03'></i>
              <span>人满领取</span>
            </div>
          </div>
          <div class='try_pro_more'>
            <div class='pro_more_nav'>
              <span :class="choseid=='p'?'nav_text_active':''" @click="choseTab('p')">商品详情</span>|
              <span :class="choseid=='a'?'nav_text_active':''" @click="choseTab('a')">活动规则</span>
            </div>
            <div class='peo_more_tab'>
              <div v-html='tryDetail' class='pro_html'></div>
            </div>
          </div>
        </div>
        <div class='null_block'></div>
      </div>
      <div class='try_btn' v-if='hiddenFix'>
        <!-- 共同按钮 status为0，1，2，未开始，进行中，已结束 -->
        <mt-button id='proInfo.id' class='pro_buy' @click='openSpec'>积分兑换</mt-button>
        <mt-button v-if='proInfo.status==2&&proInfo.is_get==0' class='end_time'>已结束</mt-button>
        <mt-button v-if='proInfo.status==0' class='end_time'>活动未开始</mt-button>
        <!-- <button v-if='proInfo.num==proInfo.count&&endTime>0' class='end_time'>已领取完</button> -->

        <!-- 免费领取按钮 is_help是0是免费领取 is_get是1是免费领取已领取，是0则未领取-->
        <mt-button @click='getTry(proInfo)' id='proInfo.id' v-if='proInfo.is_help==0&&proInfo.status==1&&proInfo.is_get==0'
          class='application'>免费申领</mt-button>
        <mt-button v-if='proInfo.is_get==1&&proInfo.is_help==0' class='end_time'>已领取</mt-button>

        <!-- 助力领取按钮 form_share为0代表助力本人进入此页面，1是助力者访问页面，is_help是1助力试用-->
        <mt-button class='application' @click='initiate(proInfo.id)'  v-if='proInfo.num>proInfo.count&&proInfo.help_list.length<proInfo.help_num&&proInfo.is_help==1&&proInfo.status==1&&form_share==0'>邀请{{proInfo.help_num}}人免费领（已邀{{proInfo.help_list.length}}人）</mt-button>
        <mt-button class='
          application' @click='showModel' v-if='proInfo.num>proInfo.count&&proInfo.help_list.length==proInfo.help_num&&proInfo.help_list.length>0&&proInfo.status==1&&form_share==0'>邀请成功</mt-button>
        <mt-button class='application' @click='showModel' v-if='proInfo.num>proInfo.count&&proInfo.help_list.length<proInfo.help_num&&form_share==1&&proInfo.status==1'>为他助力</mt-button>
        <mt-button class='application' @click='showModel' v-if='proInfo.num>proInfo.count&&form_share==1&&proInfo.help_list.length==proInfo.help_num&&proInfo.help_list.length>0&&proInfo.status==1'>助力成功</mt-button>

      </div>
      <div class='goTop' :hidden='isSign' @click='returnTop'>
        <i class='iconfont icon-huidaodingbu'></i>
      </div>
      <div class='goIndex' @click='goIndex' data-link='../index/index'>
        <i class='iconfont icon-home'></i>
      </div>

      <div class='share_bg' v-if='showShare' catchtouchmove="ture"></div>
      <div class='share_info' v-if='showShare' catchtouchmove="ture">
        <div class='close' @click='closeShare'>
          <i class='iconfont icon-guanbi'></i>
        </div>
        <div class='share_title' v-if='form_share==0&&proInfo.help_list.length<proInfo.help_num'>
          <span class=''>邀请好友助力</span> 免费领
        </div>
        <div class='share_title' v-if='form_share==1&&proInfo.help_list.length<proInfo.help_num'>
          <span class='over_hidden'>{{proInfo.nickname}}</span>邀请你为他助力
        </div>
        <div class='share_time'>
          <span style='margin-right:20/100rem;'>剩余时间</span>
          <span class='time'>{{saleTime.day}}</span>
          <span>天</span>
          <span class='time'>{{saleTime.hou}}</span>
          <span>小时</span>
          <span class='time'>{{saleTime.min}}</span>
          <span>分</span>
          <span class='time'>{{saleTime.sec}}</span>
          <span>秒</span>
        </div>
        <div class='share_people'>
          <div class='share_img_list'>
            <div class='share_img' v-for='(img,index) in proInfo.help_list' :key='index'>
              <img :src='img.image' v-if="img.image!=null||img.image!=''" />
            </div>
            <div class='share_img' v-for='(item,index) in proInfo.help_num-proInfo.help_list.length' :key='index'>
              <img src='@/assets/img/com/add_img.png' />
            </div>
          </div>
          <span class='people_tips' v-if='proInfo.help_list.length<proInfo.help_num'>再邀请<span class='num'>{{proInfo.help_num-proInfo.help_list.length}}</span>人助力，即可免费得</span>
          <span class='people_tips' v-if='proInfo.help_list.length==proInfo.help_num'>助力成功</span>
        </div>
        <div class='share_btn'>
          <mt-button @click='share(proInfo.id)' v-if='form_share==0&&proInfo.help_list.length<proInfo.help_num'>邀请助力</mt-button>
          <mt-button @click='share(proInfo.id)' v-if='form_share==1&&proInfo.help_list.length<proInfo.help_num'>更多助力</mt-button>
          <mt-button id='proInfo.id' v-if='form_share==1&&proInfo.help_list.length<proInfo.help_num' @click='boost'>为他助力</mt-button>
          <mt-button v-if='form_share==0&&proInfo.help_list.length==proInfo.help_num&&proInfo.selected==1' class='width'
            @click='getTry(proInfo)' id='proInfo.id'>助力成功，立即下单</mt-button>
          <mt-button v-if='form_share==0&&proInfo.help_list.length==proInfo.help_num&&proInfo.selected==2' class='width'>助力成功，已领取</mt-button>
          <mt-button v-if='form_share==1&&proInfo.help_list.length==proInfo.help_num' class='width'>助力成功</mt-button>
        </div>
      </div>
      <div class='spec_bg' :hidden='modelShow' @click='closeSpec' catchtouchmove="ture"></div>
      <div class='spec_info' :hidden='modelShow' catchtouchmove="ture">
        <div class='spec_head'>
          <div class='spec_pro_img' @click='viewImg' data-url='default_spec.img'>
            <img :src='default_spec.img' mode='widthFix' />
          </div>
          <div class='spec_close' @click='closeSpec'>
            <i class='iconfont icon-guanbi'></i>
          </div>
          <div class='spec_pro_price'>
            <span class='spec_pro_nowprice' v-if='price_type==4'>￥{{default_spec.price_combine}}+</span>
            <span class='spec_pro_nowprice' v-if='price_type==1'>￥{{default_spec.price_sell}}</span>
            <div class='spec_pro_inter_img' v-if='price_type!=1'>
              <i class='iconfont icon-jifen1'></i>
            </div>
            <span class='spec_pro_integral' v-if='price_type==4'>{{default_spec.point_combine}}</span>
            <span class='spec_pro_integral' v-if='price_type==2'>{{default_spec.point}}</span>
          </div>
          <div class='spec_pro_code'>
            <div>
              <span>{{default_spec.price_market_from}}</span>
              <span class='spec_pro_orig'>￥{{default_spec.price_market}}</span>
            </div>
          </div>
        </div>
        <div class='spec_body'>
          <div>
            <div class='spec_title'>
              结算方式
            </div>
            <div class='spec_type'>
              <mt-button size='small' v-if='sale_type!=1&&sale_type!=2&&sale_type!=3' :class="price_type==4? 'button_click': ''"
                @click='chosePriceType(4)'>
                ￥{{default_spec.price_combine}}+<i class='iconfont icon-jifen1'></i>{{default_spec.point_combine}}
              </mt-button>
              <mt-button size='small' v-if='sale_type!=2&&sale_type!=6' :class="price_type==1? 'button_click': ''"
                @click='chosePriceType(1)'>￥{{default_spec.price_sell}}</mt-button>
              <mt-button size='small' v-if='sale_type!=1&&sale_type!=5' :class="price_type==2? 'button_click': ''"
                @click='chosePriceType(2)'>
                <i class='iconfont icon-jifen1'></i>{{default_spec.point}}</mt-button>
            </div>
          </div>
          <div v-for='(item,index) in specList' :key='index' :hidden='!hasSpec'>
            <div class='spec_title'>
              {{item.name}}
            </div>
            <div class='spec_type'>
              <mt-button size='small' @click="choseType(item.tid,item.pid)" v-for="(item,index) in item.list" :key='index' id='item.tid'
                data-pid='item.pid' :class="item.ischose? 'button_click': ''">{{item.name}}</mt-button>
            </div>
          </div>
          <div class='spec_num' v-if="proType!='birthday'">
            <span>数量</span>
            <div class='pro_icon'>
              <mt-button size='small' class='pro_spec_btn' id='0' @click='lessNum' data-value='less'>-</mt-button>
              <input v-model='specNum' type='number' @lur='changeValue' />
              <mt-button size='small' class='pro_spec_btn' id='1' @click='addNum' data-value='add'>+</mt-button>
            </div>
          </div>
        </div>
        <div v-if="maxNum>0&&is_up=='true'">
          <div class='spec_btn'>
            <mt-button @click='addCar' class='surebtn'>确认</mt-button>
          </div>
        </div>
        <div v-if='maxNum<=0'>
          <div class='spec_btn'>
            <mt-button class='surebtn'>缺货</mt-button>
          </div>
        </div>
        <div v-if="is_up=='false'">
          <div class='spec_btn'>
            <mt-button class='surebtn'>已下架</mt-button>
          </div>
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
  getTryDetail,
  getProDetail,
  addCarofTry,
  openInitiate,
  addCarofNormal,
  getProduct,
  boostHe
} from '@/api/index'
import {
  countDown
} from '@/store/pubilc.js'
export default {
  name: 'TryDetail',
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
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '试用商品详情',
      isShow: false,
      allowbind: true,
      hiddenFix: true,
      form_share: 1,
      help_id: '',
      proInfo: {},
      endTime: null,
      saleTime: [],
      time: null,
      choseid: 'p',
      detail: '',
      spec: '',
      isSign: true,
      showShare: false,
      modelShow: true,
      maxNum: 0,
      is_up: '', // 是否上架
      specNum: 1,
      staticImg: '',
      proType: 'try',
      default_spec: {},
      product_id: '',
      sale_type: '',
      price_type: '',
      goods_id: '',
      specNameList: [],
      specDetailList: [],
      specList: [],
      showSpec: [],
      hasSpec: true,
      trybtn: true,
      mytry: false, // 是否从我的试用点进来的
      tryDetail: '',
      sharewx: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    document.getElementById('try').scrollIntoView(false)
    console.log(this.$route.query)
    let options = this.$route.query
    if (options.model !== undefined) {
      this.mytry = true
    }
    this.tryId = options.id
    this.help_id = options.help_id
    // 获取试用商品详情
    this.getDetail()
    let that = this
    let System = window.plus
    System.share.getServices(function (s) {
      let shares = {}
      for (var i in s) {
        var t = s[i]
        shares[t.id] = t
      }
      that.sharewx = shares['weixin']
      console.log(that.sharewx)
    }, function (e) {
      alert('获取分享服务列表失败：' + e.message)
    })
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('try').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    closeModel() {
      this.closeModel = !this.modelShow
    },
    viewImg: function (e) {
      // var arr = []
      // arr.push(url)
      // wx.previewImage({
      //   // 当前显示图片
      //   current: arr[0],
      //   urls: arr
      // })
    },
    goIndex(e) {
      this.$router.replace({
        path: '/index'
      })
    },
    closeShare() {
      this.showShare = false
    },
    showModel() {
      this.showShare = true
    },
    closeSpec() {
      this.modelShow = !this.modelShow
    },
    openSpec() {
      // 获取普通商品的规格
      var that = this
      let info = {
        id: that.goods_id,
        type: 'normal'
      }
      getProDetail(info).then(res => {
        that.isShow = true
        if (res.isSuccess) {
          that.default_spec = res.product_default
          that.sale_type = res.goods_info.deal_type
          that.is_up = res.goods_info.is_up
          that.maxNum = res.product_default.store
          that.product_id = res.product_default.product_id
          if (res.goods_info.deal_type >= 4) {
            that.price_type = 4
          } else if (
            res.goods_info.deal_type === 2 ||
              res.goods_info.deal_type === 3 ||
              res.goods_info.deal_type === '2' ||
              res.goods_info.deal_type === '3'
          ) {
            that.price_type = 2
          } else {
            that.price_type = 1
          }
          if (
            res.spec_key_name !== undefined &&
              res.spec_key_nameval !== undefined
          ) {
            that.specNameList = res.spec_key_name
            that.specDetailList = res.spec_key_nameval
            that.hasSpec = true
            var arr = []
            var list = []
            for (var item in that.specNameList) {
              arr.push({
                id: item,
                name: that.specNameList[item],
                list: []
              })
            }
            for (let item in that.specDetailList) {
              var dlist = []
              for (var key in that.specDetailList[item]) {
                dlist.push({
                  tid: item + ':' + key,
                  pid: item,
                  name: that.specDetailList[item][key],
                  ischose: false
                })
              }
              list.push({
                id: item,
                list: dlist
              })
            }
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < list.length; j++) {
                if (arr[i].id === list[j].id) {
                  arr[i].list = list[j].list
                }
              }
            }
            var spec = res.product_default.spec.split(';')
            for (let k = 0; k < spec.length; k++) {
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].list.length; j++) {
                  if (arr[i].list[j].tid === spec[k]) {
                    arr[i].list[j].ischose = true
                    that.showSpec.push(arr[i].list[j].name)
                  }
                }
              }
            }
            that.proInfo.price_sell = res.product_default.price_sell
            if (
              res.product_default.bn !== '' &&
                res.product_default.bn !== null
            ) {
              that.proInfo.bn = res.product_default.bn
            }
            that.specList = arr
          } else {
            that.hasSpec = false
          }
          that.modelShow = false
        }
      })
    },
    choseType(id, pid) {
      var spec = []
      var specshow = []
      var slist = this.specList
      for (let i = 0; i < slist.length; i++) {
        if (slist[i].id === pid) {
          for (let j = 0; j < slist[i].list.length; j++) {
            slist[i].list[j].ischose = false
          }
          for (let j = 0; j < slist[i].list.length; j++) {
            if (slist[i].list[j].tid === id) {
              slist[i].list[j].ischose = true
            }
          }
        }
      }
      for (var i = 0; i < slist.length; i++) {
        for (var j = 0; j < slist[i].list.length; j++) {
          if (slist[i].list[j].ischose) {
            spec.push(slist[i].list[j].tid)
            specshow.push(slist[i].list[j].name)
          }
        }
      }
      this.specList = slist
      this.showSpec = specshow
      var that = this
      let info = {
        goods_id: that.goods_id,
        marketing_type: 0,
        spec: spec.join(';')
      }
      getProduct(info).then(res => {
        if (res.isSuccess) {
          that.default_spec = res.data.product
          that.product_id = res.data.product.product_id
          that.maxNum = res.data.product.store
          if (res.data.product.price_market_from !== undefined) {
            that.price_market_from = res.data.product.price_market_from
            that.price_market = res.data.product.price_market
          }
          if (res.data.product.img !== '' && res.data.product.img !== null) {
            that.staticImg = res.data.product.img
          } else {
            that.staticImg = that.firstImg
          }
        }
      })
    },
    chosePriceType(id) {
      this.price_type = id
    },
    addNum(id) {
      let value = parseInt(this.specNum)
      value++
      this.specNum = value
    },
    changeValue(e) {
      if (e.detail.value <= 1) {
        this.specNum = 1
      } else {
        this.specNum = e.detail.value
      }
    },
    lessNum(event) {
      let value = parseInt(this.specNum)
      if (value <= 1) {
        this.specNum = 1
      } else {
        value--
      }
      this.specNum = value
    },
    noBind() {
      // var pages = getCurrentPages() // 获取加载的页面
      // var currentPage = pages[pages.length - 1] // 获取当前页面的对象
      // var url = currentPage.route // 当前页面url
      // var options = currentPage.options
      // // 拼接url的参数
      // if (JSON.stringify(options) != '{}') {
      //   var urlWithArgs = url + '?'
      //   for (var key in options) {
      //     var value = options[key]
      //     urlWithArgs += key + '=' + value + '&'
      //   }
      // } else {
      //   urlWithArgs = url
      // }
      // getApp().globalData.backUrl = urlWithArgs
      // wx.reLaunch({
      //   url: '../bind/bind?visit=4'
      // })
      this.$router.togo({
        path: '/bind?visit=4'
      })
    },
    addCar(e) {
      console.log(this.$store.state.home.isbind)
      if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
        this.noBind()
      } else {
        var flag = true
        var typelist = []
        var slist = this.specList
        for (var i = 0; i < slist.length; i++) {
          typelist.push(false)
          for (var j = 0; j < slist[i].list.length; j++) {
            if (slist[i].list[j].ischose) {
              typelist[i] = true
            }
          }
        }
        for (var k = 0; k < typelist.length; k++) {
          if (typelist[k] === false) {
            flag = false
          }
        }
        var that = this
        // if (util.isLogin()) {
        if (!flag) {
          Toast({
            message: '未选择规格',
            duration: 1000
          })
        } else {
          if (parseInt(that.specNum) > parseInt(that.maxNum)) {
            Toast({
              message: '库存不足',
              duration: 1000
            })
            if (parseInt(that.maxNum) <= 0) {
              that.specNum = 1
            } else {
              that.specNum = that.maxNum
            }
          } else {
            let info = {
              pid: that.product_id,
              num: that.specNum,
              goods_id: that.goods_id,
              deal_type: that.price_type
            }
            addCarofNormal(info).then(res => {
              if (res.isSuccess) {
                that.proType = 'normal'
                that.$router.togo({
                  path: '/sureOrder?addType=3&id=' + that.product_id
                })
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          }
        }
        // }
      }
    },
    scroll(e) {
      if (e.detail.scrollTop > 900) {
        this.setData({
          isSign: false
        })
      } else {
        this.setData({
          isSign: true
        })
      }
    },
    returnTop() {
      this.setData({
        isSign: true,
        topNum: 0
      })
    },
    getTry(event) {
      var that = this
      // if (util.isLogin()) {
      if (this.allowbind) {
        that.allowbind = false
        console.log(that.$store.state.home.isbind)
        if (that.$store.state.home.isbind === 'false' || that.$store.state.home.isbind === false) {
          this.noBind()
        } else {
          addCarofTry(event.id).then(req => {
            if (req.isSuccess) {
              that.allowbind = true
              that.$router.togo({
                path: '/sureOrder?addType=3&proType=try&id=' +
                    '&try_id=' +
                    event.id
              })
            } else {
              Toast({
                message: req.msg,
                duration: 1000
              })
              that.allowbind = true
            }
          })
        }
      }
      // }
    },
    boost() {
      // if (util.isLogin()) {
      var that = this
      boostHe(that.help_id).then(res => {
        if (res.isSuccess) {
          Toast({
            message: res.msg,
            iconClass: 'iconfont icon-dui1',
            duration: 1000
          })
          that.proInfo.help_list = res.data
          that.showShare = false
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
        }
      })
      // }
    },
    initiate(id) {
      if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
        this.noBind()
      } else {
        if (this.help_id !== null && this.help_id !== '') {
          this.showShare = true
        } else {
          var that = this
          openInitiate(id).then(req => {
            if (req.isSuccess) {
              that.showShare = true
              that.help_id = req.data
            } else {
              Toast({
                message: req.msg,
                duration: 1000
              })
            }
          })
        }
      }
    },
    share(id) {
      let that = this
      let System = window.plus
      console.log(this.sharewx)
      let img = '_www/img/mp.png'
      // 正式gh_a0cfbcaf8fa2 测试gh_05718de312bd
      let shareUrl = 'pages/tryOutdetail/tryOutdetail?id=' + id + '&form_share=1&help_id=' + this.help_id
      console.log(shareUrl)
      console.log(that.proInfo.name)
      let msg = {
        type: 'miniProgram',
        title: '[小程序]' + that.proInfo.name,
        thumbs: [img],
        content: '分享小程序描述内容。',
        miniProgram: {
          id: 'gh_a0cfbcaf8fa2',
          path: shareUrl,
          webUrl: 'http://uniapp.dcloud.io',
          type: 0
        },
        extra: {
          scene: 'WXSceneSession'
        }
      }
      this.sharewx ? this.isAuth(msg) : System.nativeUI.alert('当前环境不支持微信分享操作!')
    },
    isAuth(msg) {
      console.log('判断是否授权')
      console.log(msg)
      if (this.sharewx.authenticated) {
        this.shareAction(msg)
      } else {
        this.sharewx.authorize(function () {
          this.shareAction(msg)
        }, function (e) {
          alert('认证授权失败')
        })
      }
    },
    shareAction(msg) {
      console.log('开始分享')
      console.log(msg)
      this.sharewx.send(msg, function () {
        alert('分享成功！')
      }, function (e) {
        console.log('失败失败啊')
        alert('分享失败：' + e.message)
      })
    },
    getDetail() {
      var that = this
      let info = {
        try_id: that.tryId,
        help_id: that.help_id
      }
      getTryDetail(info).then(res => {
        Indicator.close()
        that.isShow = true
        if (res.isSuccess) {
          var secTime = countDown(res.data.countdown)
          that.proInfo = res.data
          that.endTime = res.data.countdown
          that.saleTime = secTime
          that.detail = res.data.intro
          that.spec = res.data.desc
          that.goods_id = res.data.goodsid
          if (res.data.is_help === 1 || res.data.is_help === '1') {
            that.form_share = res.data.form_share
            if (that.form_share === 0 || that.form_share === '0') {
              that.help_id = res.data.help_id
            } else {
              that.showShare = true
            }
          }
          if (that.mytry) {
            that.showShare = true
          }
          that.tryDetail = that.detail
          // WxParse.wxParse('proDetail', 'html', proDetail, that, 10)
          // desc
          that.time = setInterval(function () {
            secTime = countDown(--that.endTime)
            that.saleTime = secTime
          }, 1000)
        }
      })
    },
    choseTab(type) {
      this.choseid = type
      this.tryDetail = ''
      if (type === 'p') {
        this.tryDetail = this.detail
      } else {
        this.tryDetail = this.spec
      }
    }
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .try_detail {
    /* font-family: SimHei; */
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .try_pro_info {
    /* height: 880/100rem; */
    background: #fff;
    margin-bottom: 10/100rem;
  }

  .pro_img {
    /* position: relative; */
    text-align: center;
    /* padding-top: 54/100rem; */
    /* padding-bottom: 47/100rem; */
    /* height: 640/100rem; */
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    /* height: 820/100rem; */
  }

  .pro_img .pro_swiper {
    width: 100%;
    height: 750/100rem;
  }

  .pro_swiper swiper {
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .pro_swiper swiper-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  swiper .slide-img {
    width: 750/100rem;
    height: 750/100rem;
  }

  .pro_img img {
    width: 750/100rem;
    height: 750/100rem;
  }

  .pro_down {
    /* position: absolute; */
    width: 100%;
    height: 72/100rem;
    line-height: 72/100rem;
    color: #fff;
    /* background: rgba(234, 53, 104, 0.3); */
    background-image: linear-gradient(267deg, #ab0023 0%, #e4002f 74%);
    font-size: 30/100rem;
    /* font-weight: bold; */
    bottom: 0;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    padding: 0 32/100rem;
  }

  .pro_down span {
    font-size: 28/100rem;
  }

  .pro_down .time_bg {
    color: #fff;
    background: #000;
    padding: 4/100rem;
    /* border-radius: 6/100rem; */
    font-family: "DIN";
    margin: 0 4/100rem;
    min-width: 45/100rem;
    height: 45/100rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 30/100rem;
  }

  .pro_title {
    padding: 0 26/100rem;
    margin: 50/100rem 0;
    font-size: 32/100rem;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pro_other {
    padding: 0 26/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #686767;
    font-size: 34/100rem;
    font-family: "DIN";
    padding-bottom: 40/100rem;
  }

  .pro_other .num {
    color: #ff8d97;
  }

  .pro_other .peo_num {
    color: #737373;
  }

  .pro_other .nowPrice {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    margin-right: 10/100rem;
  }

  .pro_other .price {
    font-size: 24/100rem;
    text-decoration: line-through;
  }

  .try_pro_game {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26/100rem;
    /* margin-top: -10/100rem; */
    margin-bottom: 10/100rem;
    padding: 20/100rem 26/100rem;
    background: #fff;
  }

  .try_pro_intrduce {
    display: inline-flex;
  }

  .try_pro_intrduce .iconfont {
    display: inline-flex;
    align-items: center;
    margin-left: 10/100rem;
    margin-right: 4/100rem;
    color: #808080;
    font-size: 26/100rem;
  }

  .try_pro_intrduce span {
    color: #737373;
  }

  .try_pro_more {
    background: #fff;
  }

  .try_pro_more .pro_more_nav {
    display: flex;
    justify-content: center;
    font-size: 28/100rem;
    color: #525151;
    padding: 34/100rem 70/100rem;
  }

  .pro_more_nav span {
    margin: 0 90/100rem;
  }

  .pro_more_nav .nav_text_active {
    color: #ff8d97;
  }

  .peo_more_tab {
    /* padding: 0 26/100rem; */
    text-align: center;
  }

  .peo_more_tab img {
    width: 700/100rem;
    height: 100%;
  }

  .null_block {
    height: 100/100rem;
    z-index: 180;
  }

  .try_btn {
    box-shadow: 0 8/100rem 26/100rem 14/100rem #dadada;
    position: fixed;
    bottom: -6/100rem;
    height: 100/100rem;
    line-height: 100/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #fff;
    color: #fff;
    z-index: 199;
  }

  .try_btn button {
    display: flex;
    justify-content: center;
    /* width: 50%; */
    border-radius: 0;
    height: 100/100rem;
    line-height: 100/100rem;
    font-size: 32/100rem;
    color: #666;
  }

  .try_btn button::after {
    border: none;
  }

  .try_btn .pro_buy {
    /* width: 300/100rem; */
    /* background: #ff8a00; */
    background: #000;
    color: #fff;
    width: 40%;
  }

  .try_btn .application {
    width: 60%;
    background: #ff8d97;
    color: #fff;
  }

  .try_btn .end_time {
    width: 60%;
    background: #d3d3d3;
    color: #fff;
  }

  .share_bg {
    position: fixed;
    z-index: 300;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
  }

  .share_info {
    /* background: #e67354; */
    background: #ff8d97;
    width: 100%;
    height: 700/100rem;
    position: fixed;
    bottom: 0;
    z-index: 301;
    text-align: center;
    padding: 2% 0;
  }

  .close {
    margin-right: 5%;
    text-align: right;
  }

  .close .iconfont {
    color: #fff;
    font-size: 40/100rem;
  }

  .share_title {
    /* color: #ffe253; */
    color: #fff;
    font-size: 44/100rem;
    font-weight: bold;
    margin-bottom: 40/100rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .share_title span {
    color: #fff;
    font-weight: normal;
  }

  .share_title .over_hidden {
    width: 260/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    margin-right: 10/100rem;
  }

  .share_time {
    /* color: #ffe253; */
    color: #fff;
    margin-bottom: 40/100rem;
    text-align: center;
  }

  .share_time .time {
    color: #fff;
    background: #000;
    /* background: #ffe253;  color: #6d4d23; */
    border-radius: 6/100rem;
    font-family: "DIN";
    margin: 0 4/100rem;
    width: 50/100rem;
    height: 50/100rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .share_people {
    background: #fff;
    border-radius: 10/100rem;
    margin: 0 44/100rem;
    padding: 30/100rem 0;
    text-align: center;
  }

  .share_people .share_img_list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 26/100rem;
  }

  .share_img_list .share_img {
    width: 98/100rem;
    height: 98/100rem;
    border-radius: 50%;
    background: #e1e1e1;
    margin: 0 10/100rem;
    border: 1px solid #e1e1e1;
  }

  .share_img_list .share_img img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .share_people .people_tips {
    color: #999;
    font-size: 30/100rem;
    /* font-weight: bold; */
  }

  .share_people .people_tips .num {
    color: #ff8d97;
    font-family: "DIN";
  }

  .share_info .share_btn {
    margin-top: 50/100rem;
    display: flex;
    justify-content: center;
  }

  .share_info .share_btn button {
    width: 40%;
    /* background: #ffe253;
  color: #6d4d23; */
    background: #fff;
    color: #ff8d97;
    height: 100/100rem;
    line-height: 100/100rem;
  }

  .share_info .share_btn .width {
    width: 60%;
  }

  .share_info .share_btn button::after {
    border: none;
  }

  /* 规格选择框 */

  .spec_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 201;
  }

  .spec_info {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 202;
    min-height: 80vh;
  }

  .spec_head {
    height: 162/100rem;
    padding: 0 26/100rem;
  }

  .spec_pro_img {
    position: absolute;
    width: 170/100rem;
    height: 170/100rem;
    text-align: center;
    line-height: 170/100rem;
    top: -35/100rem;
    border: 2/100rem solid #e0e0e0;
    border-radius: 10/100rem;
    background: #fff;
  }

  .spec_pro_img img {
    width: 140/100rem;
    /* height: 140/100rem; */
    vertical-align: middle;
  }

  .spec_head .spec_pro_price {
    font-family: "DIN";
    /* width: 280/100rem; */
    display: flex;
    align-items: center;
    margin-left: 180/100rem;
    margin-top: 24/100rem;
  }

  .spec_pro_price .spec_pro_nowprice {
    color: #ff8d97;
    /* font-size: 60/100rem; */
    font-size: 30/100rem;
    font-weight: bold;
    /* margin-right: 16/100rem; */
    border: 1px solid transparent;
    /* padding-right: 10/100rem; */
  }

  .spec_pro_price .spec_pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    /* font-weight: bold; */
    /* margin-left: 8/100rem; */
  }

  .spec_pro_price .spec_pro_inter_img {
    display: flex;
    align-items: flex-end;
    /* margin-left: 9/100rem; */
    /* margin-right: 30/100rem; */
  }

  .spec_pro_price .spec_pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    display: inline-flex;
  }

  .spec_pro_price span {
    font-size: 24/100rem;
    color: #b8b8b8;
    /* margin-left: 14/100rem; */
  }

  .spec_pro_code {
    font-size: 26/100rem;
    color: #9d9d9d;
    margin-left: 186/100rem;
    margin-top: 10/100rem;
    display: flex;
    justify-content: space-between;
  }

  .spec_pro_code .spec_pro_orig {
    font-size: 24/100rem;
    color: #b8b8b8;
    text-decoration: line-through;
  }

  .spec_head .spec_close {
    position: absolute;
    top: 24/100rem;
    right: 26/100rem;
    display: inline-flex;
  }

  .spec_head .spec_close .iconfont {
    display: inline-flex;
  }

  .spec_body {
    padding: 0 26/100rem;
    overflow: hidden;
    width: 700/100rem;
    height: calc(80vh - 160px);
  }

  .spec_title {
    color: #9d9d9d;
    font-size: 24/100rem;
    margin-bottom: 20/100rem;
  }

  .spec_body .spec_type {
    margin-bottom: 30/100rem;
  }

  .spec_type button {
    margin-right: 20/100rem;
    margin-bottom: 10/100rem;
    color: #555;
    font-size: 24/100rem;
    background: #fff;
    border: 2/100rem solid #777;
    line-height: 2;
    min-width: 116/100rem;
  }

  .spec_type button .iconfont {
    font-size: 24/100rem;
    display: inline-flex;
  }

  .spec_type button::after {
    border: none;
  }

  .spec_type .button_click {
    color: #ff8d97;
    border: 2/100rem solid #ff8d97;
  }

  .spec_type .button_click .iconfont {
    color: #ff8d97;
  }

  .spec_capacity {
    margin-bottom: 30/100rem;
  }

  .spec_capacity button {
    margin-right: 20/100rem;
    color: #555;
    font-size: 24/100rem;
    background: #fff;
    border: 2/100rem solid #777;
  }

  .spec_capacity button::after {
    border: none;
  }

  .spec_capacity .button_click {
    color: #ff8d97;
    border: 2/100rem solid #ff8d97;
  }

  .spec_num {
    /* position: relative; */
    margin-bottom: 62/100rem;
  }

  .spec_num span {
    color: #9d9d9d;
    font-size: 24/100rem;
    margin-bottom: 20/100rem;
  }

  .spec_num .pro_icon {
    margin-right: 4/100rem;
    display: flex;
    border: 1px solid #ccc;
    border-radius: 6/100rem;
    float: right;
    width: 164/100rem;
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
  }

  .spec_btn {
    display: flex;
    align-items: center;
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  .spec_btn .pro_buy {
    width: 50%;
    background: #ff8d97;
    color: #fff;
    font-size: 34/100rem;
    border-radius: 0;
    height: 100/100rem;
    line-height: 100/100rem;
  }

  .spec_btn .add_car {
    width: 50%;
    background: #ff8a00;
    color: #fff;
    height: 100/100rem;
    font-size: 34/100rem;
    border-radius: 0;
    line-height: 100/100rem;
  }

  .spec_btn .surebtn {
    width: 100%;
    background: #ff8d97;
    color: #fff;
    font-size: 34/100rem;
    border-radius: 0;
  }

  .spec_btn button::after {
    border: none;
  }

</style>
