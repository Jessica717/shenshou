<template>
  <div>
    <common-header :h_title="h_title" :showback="false" :showmore='true'></common-header>
    <div class='member_head'></div>
    <div class='member'>
      <div class='m_header'>
        <div :class="userInfo.isShow == 0 ? 'm_info':'view_hidden'" @click="showLogin">
          <span class='login_btn'>
            <img :src="avatarUrl" class='m_avatar' />
          </span>
          <span class='login_btn'>
            登录
          </span>
        </div>
        <div :class="userInfo.isShow == 1 ? 'm_info_login':'view_hidden'">
          <img :src="userInfo.avatar" class='m_avatar' mode='scaleToFill' @click="goPage('/personCenter')"/>
          <div class='m_info_title'>
            <!-- <span>{{userInfo.username}}</span> -->
            <div class='m_info_name'>
              <span>{{userInfo.nickname}}</span>
            </div>
            <div class='m_info_level'>
              <div style='display:inline-flex;align-items:center;' @click='showLevel'>
                <i class='iconfont icon-huiyuanquanyi'></i>
                <span>{{userInfo.level}}</span>
              </div>
              <div style='display:inline-flex;align-items:center;margin-left:0.16rem;'>
                <i class='iconfont icon-jifen1'></i>
                <span>{{$store.state.home.score}}</span>
              </div>
            </div>
          </div>
          <div class='m_score'>
            <!-- <span>总积分:{{score}}</span> -->
            <!-- <i class='iconfont icon-qiandaojiluchaxun'></i> -->
            <i class='iconfont icon-iconqiandaowenzi' data-url='../mySignIn/mySignIn' @click='goSign'></i>
            <!-- <i class='iconfont icon-qiandao'></i> -->
            <!-- <img src='@/assets/img/member/signIn.png' style='width:214/100rem;height:56/100rem;' mode='aspectFit' data-url='../mySignIn/mySignIn' @click='linkGo'></img> -->
          </div>
        </div>
      </div>
      <div class='m_body'>
        <div class='m_order'>
          <div class='m_order_top'>
            <span>我的订单</span>
            <div class='m_order_right' @click="linkGo('/order',0,0)">
              <span>查看全部订单</span>
              <i class='iconfont icon-youjiantou1'></i>
            </div>
          </div>
          <div class='m_order_more'>
            <div class='has_msg' @click='linkGo(item.link,item.id,item.typeId)' v-for='(item,index) in orderNav' :key='index'>
              <img :src='item.imgUrl' class='more_icon' />
              <div :class="(userInfo.isShow == 1&&item.num>0&&item.typeId!==7) ? ' msg_bg ':'msg_bg_hidden '">
                <span>{{item.num}}</span>
              </div>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
        <div class='m_more_feature'>
          <div class='m_more_f_top'>
            <div @click="goPage('/myColl')">
              <img src='@/assets/img/member/shoucang.png' class='more_icons' />
              <span>我的收藏</span>
            </div>
            <div @click="goPage('/myFootprint')">
              <img src='@/assets/img/member/zuji.png' class='more_icons' />
              <span>我的足迹</span>
            </div>
            <div @click="goPage('/myCoupon')">
              <img src='@/assets/img/member/quan.png' class='more_icons' />
              <span>我的优惠券</span>
            </div>
            <div @click="goPage('/editInfo?code=address&codename=我的地址&isInput=1')">
              <img src='@/assets/img/member/dizhi.png' class='more_icons' />
              <span>收货地址</span>
            </div>
          </div>
          <div class='m_more_f_top'>
            <div class='newsNav' @click="goPage('/news')">
              <!-- <i class='iconfont icon-yuandianzhong1' v-if='newNews'></i> -->
              <div :class="$store.state.home.news ? ' msg_bg ':'msg_bg_hidden '">
                <span>{{$store.state.home.newsnum}}</span>
              </div>
              <img src='@/assets/img/member/xiaoxi.png' class='more_icons' />
              <span>消息中心</span>
            </div>
            <div @click="goPage('/personCenter')">
              <img src='@/assets/img/member/set.png' class='more_icons' />
              <span>我的资料</span>
            </div>
            <div @click="goPage('/myScore')">
              <img src='@/assets/img/member/jifen.png' class='more_icons' />
              <span>我的积分</span>
            </div>
            <div @click="goPage('/myComment')">
              <img src='@/assets/img/member/pingjia.png' class='more_icons' />
              <span>我的评价</span>
            </div>
          </div>
          <div class='m_more_f_bottom'>
            <div @click="goPage('/mytryOut')">
              <img src='@/assets/img/member/shiyong.png' class='more_icons' />
              <span>我的试用</span>
            </div>
            <div @click="goPage('/groupBy')">
              <img src='@/assets/img/member/tuan.png' class='more_icons' />
              <span>我的拼团</span>
            </div>
            <div @click="goPage('/myGift')">
              <img src='@/assets/img/member/zeng.png' class='more_icons' />
              <span>我的赠品</span>
            </div>
            <div @click="goPage('/myGiftList')">
              <img src='@/assets/img/member/gift.png' class='more_icons' />
              <span>我的奖品</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <include src="../footer/footer.wxml" /> -->
    </div>
    <div class='vipDetail_bg' v-if='vipShow'></div>
    <div class='vipDetail' v-if='vipShow'>
      <div class='vip_head'>会员等级规则说明</div>
      <div class='richtext' style="height: 4rem; ">
        <!-- <template is="wxParse" data="wxParseData:proDetail.nodes" /> -->
        <span>{{vipTitle}}</span>
      </div>
      <div class='vip_btn' @click='hiddenVip'>
        <mt-button size='small'>我知道了</mt-button>
      </div>
    </div>
    <!-- 弹出框-->
    <!-- <div class='login_model_bg' v-if='loginModel' @click='exitLogin'>
    </div>
    <div class='login_model' v-if='loginModel'>
      <div @click="loginApp" class='login_content'>
        <img src='@/assets/img/member/wx_login.png' />
        <span>微信一键登陆</span>
      </div>
    </div> -->
  </div>
</template>
<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  Button,
  Toast
} from 'mint-ui'
import {
  getPersonInfo,
  getMemberRule,
  getOrderNum,
  getCarList,
  getNewsRead
  //, appLogin
} from '@/api/index'
import commonHeader from 'common/common-header'
import pay from '@/assets/img/member/pay.png'
import ship from '@/assets/img/member/ship.png'
import receipt from '@/assets/img/member/receipt.png'
import evals from '@/assets/img/member/eval.png'
import after from '@/assets/img/member/after_sale.png'
import avatar from '@/assets/img/member/avatar.png'
import headerBg from '@/assets/img/member/m_header_bg.png'
// import msg from '@/assets/img/member/msg.png'
// import sets from '@/assets/img/member/set.png'
export default {
  name: 'Member',
  components: {
    commonHeader,
    Button,
    Toast
  },
  data() {
    return {
      h_title: '公主购',
      navNtn: 5,
      header_bg: headerBg,
      avatarUrl: avatar,
      // score: 0,
      newNews: false,
      news_num: 0,
      refuse: false,
      vipTitle: '',
      loginModel: false,
      orderNav: [{
        id: 1,
        typeId: 1,
        imgUrl: pay,
        link: '/myOrder',
        name: '待付款',
        num: 0
      },
      {
        id: 2,
        typeId: 5,
        imgUrl: ship,
        link: '/myOrder',
        name: '待发货',
        num: 0
      },
      {
        id: 3,
        typeId: 2,
        imgUrl: receipt,
        link: '/myOrder',
        name: '待收货',
        num: 0
      },
      {
        id: 5,
        typeId: 6,
        imgUrl: evals,
        link: '/myOrder',
        name: '待评价',
        num: 0
      },
      {
        id: 4,
        typeId: 7,
        imgUrl: after,
        link: '/myOrder',
        name: '退换/售后',
        num: 0
      }
      ],
      vipShow: false,
      memRule: '',
      userInfo: {
        avatar: '',
        nickname: '',
        username: '',
        isShow: 0
      },
      // apiUrl: apiUrl,
      // hiddenlogin: hiddenlogin,
      orderList: [{
        imgurl: '',
        orderStates: '',
        id: ''
      }],
      aweixin: ''
    }
  },
  created() {},
  mounted() {
    console.log(this.$store.state)
    let storage = window.localStorage
    // 获取个人信息,订单数量,消息数量，是否签到
    console.log(storage.getItem('isLogin'))
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      this.getInfo()
    }
    let that = this
    let System = window.plus
    if (System) {
      System.oauth.getServices(
        function (services) {
          let auths = services
          console.log(auths)
          if (services[0].id === 'weixin') {
            that.aweixin = services[0]
          }
        },
        function (e) {
          alert('获取分享服务列表失败：' + e.message + ' - ' + e.code)
        }
      )
    }
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM',
      setCarnum: 'SET_CARNUM',
      setIsbind: 'SET_ISBIND',
      setScore: 'SET_SCORE',
      setNews: 'SET_NEWS',
      setNewsnum: 'SET_NEWSNUM',
      setIssign: 'SET_ISSIGN',
      setUserInfo: 'SET_USERINFO'
    }),
    getInfo() {
      var that = this
      getPersonInfo().then(res => {
        if (res.isSuccess) {
          let userInfo = {}
          userInfo.avatar = res.data.image
          userInfo.level = res.data.rankName
          userInfo.isShow = 1
          userInfo.nickname = res.data.nickname
          that.setUserInfo(userInfo)
          that.setScore(res.data.point)
          if (res.data.mobile !== '' && res.data.mobile !== null) {
            that.setIsbind(true)
          } else {
            that.setIsbind(false)
          }
          that.userInfo = that.$store.state.home.userInfo
        }
      })
      for (var j = 0; j < that.orderNav.length; j++) {
        that.orderNav[j].num = 0
      }
      getOrderNum().then(res => {
        if (res.isSuccess) {
          if (res.isSuccess) {
            for (var i = 0; i < res.data.length; i++) {
              for (var j = 0; j < that.orderNav.length; j++) {
                if (res.data[i].type === that.orderNav[j].typeId) {
                  that.orderNav[j].num = res.data[i].num
                }
              }
            }
          } else {
            for (let j = 0; j < that.orderNav.length; j++) {
              that.orderNav[j].num = 0
            }
          }
        }
      })
      getCarList({
        p: 1,
        limit: 10
      }).then(res => {
        if (res.isSuccess) {
          // that.total_amout = res.data.rows_total
          that.setCarnum(res.data.rows_total)
        }
      })
      getNewsRead().then(res => {
        if (res.isSuccess) {
          // 判断是否签到
          if (res.data.is_sign === 1) {
            // that.isSign = true
            that.setIssign(true)
          } else {
            that.setIssign(false)
            // that.isSign = false
          }
          // 判断是否有新消息
          if (res.data.num > 0) {
            that.setNews(true)
            that.setNewsnum(res.data.num)
          } else {
            that.setNews(false)
            that.setNewsnum(0)
          }
        }
      })
    },
    showLogin() {
      // this.loginModel = true
      this.$router.togo({path: '/login'})
    },
    linkGo(link, id, tid) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        that.$router.togo({
          path: link,
          name: 'Order',
          params: {
            id: id,
            tid: tid
          }
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
    goPage(url) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        that.$router.togo({
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
    goSign(e) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
          that.$router.replace({
            path: '/bind?visit=5'
          })
        } else {
          that.$router.togo({
            path: '/mySignIn'
          })
        }
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
    showLevel() {
      var that = this
      that.vipShow = true
      getMemberRule().then(res => {
        if (res.isSuccess) {
          // that.memRule = res.member_rule
          that.vipTitle = res.member_rule
        }
      })
    },
    hiddenVip() {
      this.vipShow = false
    }
  },
  computed: {
    ...mapGetters([])
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .member_head {
    height: 0.9rem;
  }

  .member {
    position: relative;
    background: #f2f2f2;
    overflow-x: hidden;
    /* height:100vh; */
  }

  .m_header {
    height: 200/100rem;
    width: 702/100rem;
    position: relative;
    z-index: 20;
    /* top: 28/100rem; */
    padding: 0 26/100rem;
    background: #ff8d97;
  }

  /* 头部会员信息 */

  .m_info {
    padding-top: 36/100rem;
    margin-left: 20/100rem;
    display: flex;
    align-items: center;
  }

  .m_info .m_avatar {
    width: 122/100rem;
    height: 122/100rem;
    margin-right: 50/100rem;
  }

  .m_info .login_btn {
    margin: 0;
    padding: 0;
    background: transparent;
  }

  .m_info .login_btn::after {
    border: none;
  }

  .m_info span {
    font-size: 40/100rem;
    color: #fff;
    margin-right: 30/100rem;
    // line-height: 1.22rem;
  }

  /* 登陆成功后的会员信息 */

  .m_info_login {
    margin-left: 20/100rem;
    display: flex;
    align-items: center;
    /* align-items: flex-end; */
    height: 200/100rem;
    justify-content: space-between;
    padding-right: 24/100rem;
  }

  .m_info_login .m_avatar {
    width: 122/100rem;
    height: 122/100rem;
    margin-right: 24/100rem;
    margin-bottom: 12/100rem;
    border-radius: 50%;
  }

  .m_info_login .m_info_title {
    /* width: 260/100rem; */
    /* margin-right: 140/100rem; */
    width: 400/100rem;
    /* display: inline-flex; */
  }

  .m_info_login .m_info_title .m_info_name {
    font-size: 30/100rem;
    font-weight: bold;
    color: #fff;
    /* display: block; */
    margin-left: 14/100rem;
  }

  .m_info_login .m_info_title .m_info_level {
    display: flex;
    justify-content: flex-start;
  }

  .m_info_login .m_info_title .m_info_level span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #fff;
  }

  .m_info_login .m_info_title .m_info_level .iconfont {
    font-size: 40/100rem;
    /* color: #f5cd19; */
    color: #ffe790;
    display: inline-flex;
  }

  .m_score {
    text-align: center;
  }

  .m_score .iconfont {
    font-size: 84/100rem;
    color: #fff;
  }

  .m_score span {
    font-size: 60/100rem;
    color: #fff;
    font-weight: bold;
    display: block;
  }

  .view_hidden {
    display: none;
  }

  /* 中间部分 */

  .m_order {
    height: 260/100rem;
    padding: 0 26/100rem;
    padding-top: 24/100rem;
    background: #fff;
  }

  .m_order_top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90/100rem;
    // line-height: 90/100rem;
    border-bottom: 1px solid #e4e4e4;
  }

  .m_order .m_order_top span {
    color: #444;
    font-size: 32/100rem;
  }

  .m_order_top .m_order_right {
    float: right;
    display: flex;
    align-items: center;
  }

  .m_order_top .m_order_right span {
    /* font-size: 20/100rem;
  color: #c4c4c4; */
    font-size: 24/100rem;
    color: #999;
  }

  .m_order_top .m_order_right icon {
    display: flex;
    align-items: center;
    color: #bebebe;
  }

  .m_order_more {
    text-align: center;
  }

  .m_order_more div {
    display: inline-block;
    text-align: center;
    /* margin: 30/100rem 26/100rem; */
    width: 20%;
    margin: 30/100rem 0;
  }

  .m_order_more .more_icon {
    width: 58/100rem;
    height: 48/100rem;
  }

  .m_order_more span {
    display: block;
    font-size: 26/100rem;
    color: #504448;
    text-align: center;
  }

  /* 消息数量定位 */

  .has_msg {
    position: relative;
  }

  .has_msg .msg_bg {
    position: absolute;
    margin: 0;
    top: -10/100rem;
    right: 30/100rem;
    line-height: 30/100rem;
    text-align: center;
    width: 30/100rem;
    height: 30/100rem;
    border-radius: 50%;
    background: #f43530;
  }

  .msg_bg_hidden {
    position: absolute;
    top: -14/100rem;
    right: -2/100rem;
    margin: 0;
    z-index: -1;
  }

  .has_msg .msg_bg span {
    font-size: 18/100rem;
    color: #fff;
    font-weight: bold;
    text-align: center;
  }

  .m_more_feature {
    background: #fff;
    margin-top: 24/100rem;
    margin-bottom: 24/100rem;
    /* height: 372/100rem; */
    padding: 0 26/100rem;
  }

  .m_more_f_top {
    border-bottom: 1px solid #e4e4e4;
    padding: 30/100rem 0;
    /* text-align: center; */
    display: flex;
    justify-content: space-between;
  }

  .m_more_f_top .newsNav {
    position: relative;
  }

  .newsNav .msg_bg {
    position: absolute;
    margin: 0;
    top: -10/100rem;
    right: 30/100rem;
    line-height: 30/100rem;
    text-align: center;
    width: 30/100rem;
    height: 30/100rem;
    border-radius: 50%;
    background: #f43530;
  }

  .msg_bg_hidden {
    position: absolute;
    top: -14/100rem;
    right: -2/100rem;
    margin: 0;
    z-index: -1;
  }

  .newsNav .msg_bg span {
    font-size: 18/100rem;
    color: #fff;
    font-weight: bold;
    text-align: center;
  }

  /* .newsNav .iconfont {
  position: absolute;
  font-size: 24/100rem;
  color: #f43530;
  top: -7/100rem;
  display: inline-flex;
  right: 25%;
} */

  .m_more_f_bottom {
    padding: 30/100rem 0;
    /* text-align: center; */
    display: flex;
    justify-content: space-between;
  }

  .m_more_f_top div {
    display: inline-block;
    text-align: center;
    width: 22%;
    margin-top: 24/100rem;
    margin-bottom: 15/100rem;
    /* margin-left: 7/100rem; */
  }

  .m_more_f_bottom div {
    display: inline-block;
    text-align: center;
    width: 22%;
    margin-top: 24/100rem;
    margin-bottom: 15/100rem;
    /* margin-left: 7/100rem; */
  }

  .m_more_feature .more_icons {
    // width: 58/100rem;
    height: 52/100rem;
  }

  .m_more_feature span {
    display: block;
    font-size: 26/100rem;
    color: #444;
    text-align: center;
  }

  /* 空白的块，解决底部导航占领高度 */

  .vipDetail_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 50;
  }

  .vipDetail {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    /* height: 50%; */
    z-index: 100;
    background: #fff;
    border-radius: 20/100rem;
  }

  .vip_head {
    text-align: center;
    margin: 40/100rem 0;
  }

  .richtext {
    /* margin: 20/100rem; */
    width: 90%;
    margin: 0 auto;
    overflow: scroll;
  }

  .richtext span {
    font-size: 30/100rem;
    font-weight: bold;
    color: #666;
    word-wrap: break-word;
    width: 96%;
    display: block;
  }

  .vip_btn {
    margin: 20/100rem;
    text-align: center;
  }

  .vip_btn button {
    background: #ff8d97;
    color: #fff;
    font-size: 28/100rem;
    border-radius: 20/100rem;
  }

  .login_model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 50;
  }

  .login_model {
    width: 570/100rem;
    height: 510/100rem;
    position: fixed;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 60;
    background: #fff;
    text-align: center;
  }

  .login_model .login_content {
    text-align: center;
    margin-top: 1rem;
  }

  .login_content img {
    width: 192/100rem;
    height: 192/100rem;
    margin-top: 40/100rem;
  }

  .login_content span {
    font-size: 0.28rem;
    color: #333;
    display: block;
    text-align: center;
  }

</style>
