<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='scan' v-if='isShow'>
      <div class='scan_body'>
        <mt-swipe :auto="3000" :speed='500' :defaultIndex='0' :continuous='true' class='scan_swiper_bg'>
          <mt-swipe-item v-for="(item,index) in showPro.img" :key='index'>
            <img :src="item" class='slide-img'>
          </mt-swipe-item>
        </mt-swipe>
        <!-- <swiper indicator-dots="true" autoplay='true' indicator-color='rgba(0, 0, 0, .3)' indicator-active-color='#ff8d97'
          interval='3000'>
          <block v-for="(item,index) in showPro.img" :key='index'>
            <swiper-item>
              <img :src="item" class="slide-img" width="355" height="150" />
            </swiper-item>
          </block>
        </swiper> -->
        <div class='pro_info'>
          <div class='pro_price'>￥{{showPro.price}}</div>
          <div class='pro_name'>{{showPro.name}}</div>
          <div class='pro_desc' v-if='showPro.describe!=null'>{{showPro.describe}}</div>
        </div>
        <div class='pro_tips_reset' v-if="winType==-1">
          抱歉，本商品已经被扫过！
        </div>
      </div>
      <div class='scan_foot_win'>
        <mt-button size='small' @click='scan' v-if="winType<0">重新扫描</mt-button>
        <mt-button size='small' @click='goScore' v-if="winType>0">立即领取</mt-button>
        <mt-button size='small' class='go-Index' @click='goIndex'>商城首页</mt-button>
      </div>
    </div>
    <div class='scan_win_bg' v-if='winhidden' catchtouchmove="ture"></div>
    <div class='scan_win' v-if='winhidden' catchtouchmove="ture">
      <img src='@/assets/img/pro/win_bg_03.png' />
      <i class='iconfont icon-guanbi2' @click='hiddenWin'></i>
      <span class='win_price' v-if='winType==1'><span class='win_price_name'>{{winName}}</span> </span>
      <span class='win_price' v-if='winType==2'><span class='win_price_name'>{{winValue}}积分</span> </span>
      <span class='win_price' v-if='winType==3'>￥<span class='win_price_num'>{{winValue}}</span> </span>
      <span class='win_tips'>恭喜，您将获得{{winName}}</span>
      <div class='win_text' @click='goCou'>
        <img src='@/assets/img/member/r_btn.png' />
      </div>
    </div>
    <div class='gift_box' @click='openWin' v-if='winhidden==false&&winType!=-1&&isShow'>
      <img src='@/assets/img/pro/gift.png' class='animated pulse infinite' />
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
  getScanInfo
} from '@/api/index'
import axios from 'axios'
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
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '扫码结果页',
      allowbind: true,
      isShow: false, // 是否展示数据
      showPro: {},
      winId: '',
      winType: '',
      winName: '',
      winValue: '',
      winhidden: false,
      winUrl: '',
      apiUrl: process.env.BASE_URL
    }
  },
  mounted() {
    Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    var obj = options.q ? decodeURIComponent(options.q) : options.type
    var index = obj.lastIndexOf('code/')
    var objShort = obj.substring(index + 5, obj.length)
    var last = obj.split('/b2c')[1]
    var lastObj = this.apiUrl + 'b2c' + last
    this.winUrl = lastObj
    this.getInfo(objShort)
  },
  methods: {
    ...mapMutations({
      setScanId: 'SET_SCANID'
    }),
    getInfo(objShort) {
      let info = {
        code: decodeURI(objShort)
      }
      let that = this
      getScanInfo(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          this.isShow = true
          this.showPro = res.data
          let param = ''
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Token': window.localStorage.getItem('token')
            },
            withCredentials: true
          }
          axios.get(that.winUrl, param, config).then(response => {
            console.log(response)
            if (response.data.isSuccess) {
              that.winId = response.data.data
              that.winName = response.data.name
              that.winType = response.data.type
              that.winValue = response.data.worth
              that.winhidden = true
              that.setScanId(that.winId)
            } else {
              that.winType = -1
              that.winhidden = false
            }
          })
        } else {
          that.$router.replace({
            path: '/err?text=' + res.msg
          })
        }
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    scan() {
      this.$router.togo({
        path: '/scan?type=scan'
      })
    },
    goLogin(url) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        that.$router.replace({
          path: url
        })
      } else {
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    goScore: function () {
      this.goLogin('/myGift')
    },
    goIndex: function () {
      this.$router.replace({
        path: '/index'
      })
    },
    goCou: function () {
      this.goLogin('/myGift')
    },
    hiddenWin: function () {
      this.winhidden = false
    },
    openWin: function () {
      this.winhidden = true
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

  .scan {
    overflow-x: hidden;
  }

  .scan_body {
    margin-bottom: 100/100rem;
    background: #fff;
  }

  .scan_body .scan_swiper_bg {
    height: 7.5rem;
    width: 100%;
    background: #fff;
    text-align: center;
  }

  .scan_swiper_bg .slide-img {
    width: 750/100rem;
    height: 750/100rem;
  }

  .pro_info {
    padding: 40/100rem 26/100rem;
    background: #fff;
  }

  .pro_info .pro_price {
    font-size: 52/100rem;
    color: #ff8d97;
    font-family: 'DIN';
  }

  .pro_info .pro_name {
    font-size: 38/100rem;
    color: #393939;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pro_info .pro_code {
    font-size: 28/100rem;
    color: #7e7e7e;
    font-family: 'DIN';
  }

  .pro_info .pro_desc {
    font-size: 28/100rem;
    color: #7f7f7f;
  }

  .pro_tips {
    height: 126/100rem;
    text-align: center;
    font-size: 28/100rem;
    color: #393939;
    background: #fff;
  }

  .pro_tips span {
    font-size: 54/100rem;
    color: #ff8d97;
    font-family: 'DIN';
    display: block;
  }

  .pro_tips_reset {
    height: 100/100rem;
    line-height: 100/100rem;
    text-align: center;
    font-size: 30/100rem;
    //   font-weight: bold;
    color: #393939;
    background: #fff;
    padding-bottom: 30/100rem;
    font-weight: bold;

  }

  .pro_tips_reset span {
    font-size: 54/100rem;
    color: #ff8d97;
    font-family: 'DIN';
    display: block;
  }

  .pro_tips_win {
    height: 100/100rem;
    background: #fff;
  }

  .scan_foot_wx {
    background: #fff;
    text-align: center;
    padding-top: 38/100rem;
  }

  .scan_foot_wx span {
    color: #7f7f7f;
    font-size: 30/100rem;
    font-weight: bold;
    display: block;
    padding-bottom: 38/100rem;
  }

  .scan_foot_wx button {
    background: #ff8d97;
    color: #fff;
    font-size: 40/100rem;
    line-height: 100/100rem;
    border-radius: 0;
  }

  .scan_foot_wx button::after {
    border: none;
  }

  .scan_foot_app {
    height: 133/100rem;
    background: #fff;
    text-align: center;
    padding-top: 30/100rem;
  }

  .scan_foot_app button {
    width: 460/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 40/100rem;
    line-height: 80/100rem;
  }

  .scan_foot_app button::after {
    border: none;
  }

  .scan_foot_win {
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 100/100rem;
    display: flex;
  }

  .scan_foot_win button {
    background: #ff8a00;
    color: #fff;
    font-size: 34/100rem;
    line-height: 100/100rem;
    border-radius: 0;
    width: 50%;
    height: 100%;
  }

  .scan_foot_win .go-Index {
    background: #ff8d97;
  }

  .scan_foot_win button::after {
    border: none;
  }

  .scan_win_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 50;
  }

  .scan_win {
    position: fixed;
    top: 94/100rem;
    z-index: 60;
    left: 50%;
    transform: translateX(-50%);
  }

  .scan_win img {
    width: 700/100rem;
    height: 804/100rem;
  }

  .scan_win icon {
    position: absolute;
    color: #ffea00;
    top: 150/100rem;
    font-size: 50/100rem;
    right: 50/100rem;
  }

  .scan_win .win_price {
    font-size: 80/100rem;
    position: absolute;
    color: #ea2202;
    left: 50%;
    transform: translateX(-50%);
    top: 425/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 330/100rem;
  }

  .win_price .win_price_num {
    font-size: 80/100rem;
    font-family: 'DIN';
  }

  .win_price .win_price_name {
    font-size: 30/100rem;
    font-weight: bold;
    font-family: 'DIN';
  }

  .scan_win .win_price {
    position: absolute;
    color: #ea2202;
    text-align: center;
  }

  .win_tips {
    position: absolute;
    color: #fff;
    font-size: 30/100rem;
    font-weight: bold;
    left: 50%;
    top: 580/100rem;
    transform: translate(-50%);
    width: 540/100rem;
    display: inline-block;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .win_text {
    position: absolute;
    color: #fffd00;
    font-size: 48/100rem;
    left: 50%;
    transform: translateX(-50%);
    top: 650/100rem;
  }

  .win_text img {
    width: 225/100rem;
    height: 56/100rem;
  }

  .gift_box {
    position: fixed;
    right: 0;
    top: 50%;
  }

  .gift_box img {
    width: 120/100rem;
    height: 120/100rem;
  }

</style>
