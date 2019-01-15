<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='result_group'>
      <div class="result_title" v-if='GroupOrder.isleader&&GroupOrder.status==1'>
        <i class='iconfont icon-duihaocheckmark17'></i>
        <div>
          <span class='title_top'>恭喜你，开团成功!</span>
          <span>快去邀请小伙伴参团吧~</span>
        </div>
      </div>
      <div class="result_title" v-if='!GroupOrder.isleader&&GroupOrder.status==1'>
        <i class='iconfont icon-duihaocheckmark17'></i>
        <div>
          <span class='title_top'>团长邀请你加入该团~</span>
        </div>
      </div>
      <div class="result_title" v-if='GroupOrder.status==2'>
        <i class='iconfont icon-duihaocheckmark17'></i>
        <div>
          <span class='title_top'>恭喜，拼购成功!</span>
        </div>
      </div>
      <div class='result_title fail' v-if='GroupOrder.status==-1'>
        <i class='iconfont icon-guanbi2'></i>
        <div>
          <span class='title_top'>该团未能按时凑齐人数，拼购失败!</span>
        </div>
      </div>
      <div class='group_order'>
        <div class='sale_pro'>
          <div class='pro_img'>
            <img :src='GroupOrder.img' />
          </div>
          <div class='pro_info'>
            <div class='pro_title'>{{GroupOrder.name}}</div>
            <div class='pro_spec'>
              <div class='pro_price'>
                <i class='iconfont icon-tuangou3'></i>
                <span class='pro_integral'>{{GroupOrder.startnum}}人拼</span>
                <span class='peo_nowprice'>¥{{GroupOrder.price}}</span>
              </div>
            </div>
            <div class='pro_orig'>
              市场价
              <span>¥{{GroupOrder.price_market}}</span>
            </div>
          </div>
        </div>
        <div class='sale_time'>
          <div class='group_spec' :hidden='GroupOrder.status==-1||GroupOrder.startnum<=groupPeople.length'>
            <span class='spec_text'>还剩</span>
            <span class='spec_text spec_red'>{{GroupOrder.startnum-groupPeople.length}}人</span>
            <span class='spec_text'>拼购成功，剩余时间</span>
            <span class='sepc_block'>{{saleTime.day}}</span>
            <span class='spec_text'>天</span>
            <span class='sepc_block'>{{saleTime.hou}}</span>
            <span class='spec_text'>:</span>
            <span class='sepc_block'>{{saleTime.min}}</span>
            <span class='spec_text'>:</span>
            <span class='sepc_block'>{{saleTime.sec}}</span>
          </div>
          <div class='group_person'>
            <div class='group_img' v-for='(item,index) in groupPeople' :key='index'>
              <div v-if="index<4">
                <span class='leader' v-if='item.leader==1'>团长</span>
                <img :src='item.image' v-if="item.image!=null&&item.image!=''" />
                <img src='@/assets/img/com/pc_avatar.png' v-if="item.image==null||item.image==''" />
              </div>
            </div>
            <div class='group_img' v-for='k of (GroupOrder.startnum-groupPeople.length)' :key='k'>
              <div class='img_bg'></div>
            </div>
            <div class='group_img' v-if='groupPeople.length>5'>
              <span>...</span>
            </div>
          </div>
        </div>
        <div class='sale_btn' :hidden='GroupOrder.status==-1||GroupOrder.startnum<=groupPeople.length'>
          <mt-button @click="golink('/proDetail?type=group&id=',GroupOrder.group_id,GroupOrder.id)" v-if='GroupOrder.isleader!=1' class='width'>我要参团</mt-button>
          <mt-button @click='shareGroup'>邀请好友参团</mt-button>
          <div @click='goIndex' >商城首页</div>
        </div>
        <div class='sale_btn' v-if='GroupOrder.status==-1'>
          <mt-button class='fail'>拼购失败</mt-button>
          <div @click='goIndex' >商城首页</div>
        </div>
        <div class='sale_btn' v-if='GroupOrder.status==2'>
          <mt-button class='width'>拼购成功</mt-button>
          <div @click='goIndex' >商城首页</div>
        </div>
      </div>

      <div class='group_help'>
        <div class='help_title'>拼购规则</div>
        <div class='help_detail'>
          <span>{{GroupOrder.rule}}</span>
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
import { groupDetail } from '@/api/index'
import { countDown } from '@/store/pubilc.js'
// import { // parseTime // } from '@/store/pubilc.js'
// import { // setToken, // getToken // } from '@/store/auth'
export default {
  name: 'GroupResult',
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
      h_title: '拼购详情',
      allowbind: true,
      orderId: '',
      id: '',
      GroupOrder: {},
      groupPeople: [],
      endTime: null,
      saleTime: [],
      time: null,
      sharewx: ''
    }
  },
  mounted() { //
    Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    if (options.type === 'pay') {
      this.orderId = options.orderId
      this.id = ''
    } else {
      this.orderId = ''
      this.id = options.orderId
    }
    this.getInfo()
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
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getInfo: function () {
      var that = this
      let info = {
        order_id: that.orderId,
        id: that.id
      }
      groupDetail(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          var secTime = countDown(res.data.countdown)
          that.endTime = res.data.countdown
          that.saleTime = secTime
          that.GroupOrder = res.data
          that.groupPeople = res.customer
          that.id = res.data.id
          that.time = setInterval(function () {
            secTime = countDown(--that.endTime)
            that.saleTime = secTime
          }, 1000)
        }
      })
    },
    golink(url, aid, gid) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        this.$router.togo({
          path: url + aid + '&gid=' + gid
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
    shareGroup() {
      let that = this
      let System = window.plus
      console.log(this.sharewx)
      let img = '_www/img/mp.png'
      // 正式gh_a0cfbcaf8fa2 测试gh_05718de312bd
      let shareUrl = '/pages/groupResult/groupResult?type=payshare&orderId=' + this.id
      let msg = {
        type: 'miniProgram',
        title: '[小程序]' + that.GroupOrder.name,
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
        // alert('分享成功！')
        console.log('分享成功！')
      }, function (e) {
        console.log('失败失败啊')
        alert('分享失败：' + e.message)
      })
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

  .result_title {
    /* height: 180/100rem; */
    background: #ff8d97;
    display: flex;
    padding: 10/100rem 26/100rem;
    align-items: center;
  }

  .result_null {
    display: none;
  }

  .fail {
    background: #999;
  }

  .result_title .iconfont {
    font-size: 50/100rem;
    color: #fff;
    margin-right: 40/100rem;
  }

  .result_title span {
    font-size: 26/100rem;
    color: #fff;
  }

  .result_title .title_top {
    font-size: 34/100rem;
    margin-right: 14/100rem;
  }

  .group_order {
    background: #fff;
    /* height: 310/100rem; */
    padding-top: 30/100rem;
  }

  .group_order .sale_pro {
    padding: 26/100rem;
    border: 1px solid #ebebeb;
    display: flex;
    align-items: center;
    width: 84%;
    border-radius: 12/100rem;
    margin: 0 auto;
  }

  .sale_pro .pro_img {
    float: left;
    margin-left: 18/100rem;
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 186/100rem;
  }

  .sale_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 24/100rem;
    color: #444;
    margin: 10/100rem 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pro_info .pro_spec {
    /* width: 490/100rem; */
    overflow: hidden;
    /* height: 64/100rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6/100rem;
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    /* width: 240/100rem; */
    display: flex;
    align-items: center;
  }

  .pro_price .iconfont {
    font-size: 38/100rem;
    display: inline-flex;
    color: #ff8d97;
  }

  .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_price .pro_integral {
    font-size: 24/100rem;
    /* color: #ff8d97; */
    color: #ff8d97;
    margin-left: 8/100rem;
    margin-right: 20/100rem;
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: flex-end;
    margin-left: 9/100rem;
    /* margin-right: 30/100rem; */
  }

  .pro_price .pro_inter_img img {
    width: 24/100rem;
    height: 20/100rem;
  }

  .pro_info .pro_orig {
    font-size: 22/100rem;
    color: #b8b8b8;
    /* margin-left: 6/100rem; */
  }

  .pro_info .pro_orig span {
    text-decoration: line-through;
  }

  .group_order .sale_time {
    margin: 60/100rem 0;
  }

  .group_spec {
    text-align: center;
    font-weight: bold;
    font-family: 'DIN';
  }

  .group_spec span {
    font-size: 28/100rem;
  }

  .group_spec .spec_text {
    color: #444;
  }

  .group_spec .spec_red {
    color: #ff8d97;
    margin: 0 4/100rem;
  }

  .group_spec .sepc_block {
    background: #343434;
    border-radius: 5/100rem;
    color: #fff;
    font-size: 30/100rem;
    font-weight: bold;
    font-family: 'DIN';
    padding: 5/100rem;
    margin: 0 4/100rem;
    font-weight: normal;
  }

  .group_person {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 60/100rem;
  }

  .group_img {
    margin: 0 10/100rem;
    position: relative;
  }

  .group_img .leader {
    position: absolute;
    top: -16/100rem;
    background: #ff8d97;
    color: #fff;
    height: 30/100rem;
    width: 60/100rem;
    font-size: 20/100rem;
    text-align: center;
    border-radius: 10/100rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .group_img .img_bg {
    width: 96/100rem;
    height: 96/100rem;
    border-radius: 50%;
    background: #f7f7f7;
    border: 2/100rem solid #e0e0e0;
  }

  .group_img img {
    width: 96/100rem;
    height: 96/100rem;
    border-radius: 50%;
    border: 2/100rem solid #ff8d97;
  }

  .group_order .sale_btn {
    width: 84%;
    margin: 0 auto;
    padding-bottom: 30/100rem;
    text-align: center;
  }

  .sale_btn div {
    font-size: 28/100rem;
    color: #ff8d97;
    margin-top: 20/100rem;
    text-align: center;
  }

  .sale_btn button {
    background: #ff8d97;
    color: #fff;
    font-size: 34/100rem;
    border-radius: 20/100rem;
  }

  .sale_btn .width {
    width: 45%;
    display: inline-flex;
    justify-content: center;
    margin: 0 2%;
  }

  .sale_btn .goindex {
    background: #ff8a00;
  }

  .sale_btn .fail {
    background: #999;
  }

  .sale_btn button::after {
    border: none;
  }

  .group_help {
    margin-top: 20/100rem;
    background: #fff;
    padding-bottom: 20/100rem;
  }

  .help_title {
    font-size: 32/100rem;
    padding: 26/100rem;
    border-bottom: 2/100rem solid #f2f2f2;
  }

  .help_detail {
    padding: 0 26/100rem;
  }

  .help_detail span {
    font-size: 24/100rem;
    display: block;
    margin: 10/100rem 0;
    word-wrap: break-word;
    color: #333;
    line-height: 1.5;
  }

</style>
