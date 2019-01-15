<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='sign'></div>
    <div class='sign_in'>
      <div class='sign_body'>
        <div class='sign_banner'>
          <img src='@/assets/img/member/sign_bg_02.jpg' />
          <div class='banner_left' @click='sign'>
            <span style='font-size:0.6rem;' v-if='!isSign'>签到</span>
            <span style='font-size:0.5rem;' v-else>已签到</span>
            <span style="font-size:0.3rem;font-family:'DIN'">连续{{signDate}}天</span>
          </div>
          <div class='banner_right'>
            <div style='font-size:0.42rem;color:#fff;'>签到领积分</div>
            <div class='banner_score'>
              <i class='iconfont icon-jifen1'></i>
              <span>{{score}}</span>
            </div>
            <div class='btn' @click='goScore'>
              <i class='iconfont icon-weibiaoti2fuzhi14'></i>
              <span>前往购物商城</span>
            </div>
          </div>
        </div>
        <div class='sign_date'>
          <div class='sign_title'>{{year}}年{{mon}}月</div>
          <sign-picker :date="date" @getValue='getValue' ref="sign" :sign-list="signTime"></sign-picker>
        </div>
        <div class='sign_info'>
          <div class='info_title'>
            <span>签到规则</span>
            <div></div>
          </div>
          <div class='info_more'>
            <span>{{sign_info}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import SignPicker from '@/components/SignPicker.vue'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
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
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  signToday, getSignDays
} from '@/api/index'
export default {
  name: 'MySignIn',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    SignPicker
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '每日签到',
      hasEmptyGrid: false,
      showPicker: false,
      signDate: 0,
      isSign: false,
      signTime: [],
      score: '',
      sign_info: '',
      year: new Date().getFullYear(),
      mon: new Date().getMonth() + 1,
      date: new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1 <= 0
            ? '0' + new Date().getMonth() + 1
            : new Date().getMonth() + 1) +
          '-' +
          '01'
    }
  },
  mounted() {
    this.getList()
    // this.$nextTick(() => {
    //   console.log(this.$store.state.home.signData)
    //   let info = this.$store.state.home.signData
    //   this.signDate = info.signDays
    //   this.sign_info = info.signRule
    //   this.score = info.signScore
    // })

    // Indicator.open('加载中...')
    // console.log(this.$route.query)
  },
  methods: {
    ...mapMutations({
      setNews: 'SET_NEWS'
    }),
    getList() {
      let that = this
      getSignDays().then(res => {
        if (res.isSuccess) {
          console.log(res)
          for (var i = 0; i < res.rows.length; i++) {
            that.signTime.push(new Date(res.rows[i] * 1000).getDate())
          }
          that.signDate = res.days
          that.score = res.point
          that.sign_info = res.sign_rule_set
        }
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('sign').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goScore() {
      this.$router.togo({
        path: '/proList?type=key&price=asc&value='
      })
    },
    getValue(e) {
      console.log(e)
    },
    sign() {
      var that = this
      signToday().then(res => {
        if (res.isSuccess) {
          Toast({
            message: '签到成功，获得' + res.point + '积分',
            duration: 2000
          })
          that.getList()
        } else {
          Toast({
            message: res.msg,
            duration: 2000
          })
        }
      })
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

  .sign_in {
    position: relative;
    background: #f2f2f2;
  }

  .sign_body .sign_banner {
    height: 415/100rem;
    width: 100%;
    position: relative;
  }

  .sign_banner img {
    height: 415/100rem;
    width: 100%;
    position: absolute;
  }

  .sign_banner .banner_left {
    position: absolute;
    /* width: 123/100rem; */
    left: 112/100rem;
    top: 135/100rem;
    text-align: center;
    width: 150/100rem;
  }

  .sign_banner .banner_left span {
    display: block;
    color: #ff8d97;
    text-align: center;
  }

  .banner_right {
    position: absolute;
    /* width: 250/100rem; */
    top: 76/100rem;
    /* right: 140/100rem; */
    left: 50%;
  }

  .banner_right .banner_score {
    font-size: 50/100rem;
    color: #fff;
    font-family: "DIN";
    margin: 10/100rem 0;
  }

  .banner_score .iconfont {
    font-size: 44/100rem;
    color: #ffe790;
  }

  .banner_right .btn {
    width: 222/100rem;
    height: 54/100rem;
    border: 2/100rem solid #fff;
    border-radius: 50/100rem;
    background: transparent;
    color: #fff;
    font-size: 24/100rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn .iconfont {
    color: #fff;
    font-size: 0.32rem;
  }

  .sign_date {
    background: #fff;
  }

  .sign_date .sign_title {
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.38rem;
    margin-bottom: -0.4rem;
  }

  .sign_info {
    background: #fff;
    padding: 0 26/100rem;
  }

  .sign_info .info_title {
    height: 125/100rem;
    position: relative;
  }

  .info_title div {
    width: 100%;
    height: 2/100rem;
    background: #dadada;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
  }

  .info_title span {
    font-size: 30/100rem;
    color: #555;
    width: 133/100rem;
    height: 36/100rem;
    text-align: center;
    background: #fff;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .info_more {
    font-size: 22/100rem;
    color: #b0b0b0;
    padding-bottom: 46/100rem;
  }

  .info_more span {
    color: #555;
    white-space: pre-line;
  }

</style>
