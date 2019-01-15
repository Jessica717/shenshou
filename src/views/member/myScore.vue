<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div class='my_score'>
      <!-- v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" -->
      <!-- :style="{height:screenHeight+'rem'}" -->
      <return-top @returnTop='goTop'></return-top>
      <div style='height:0.9rem' id='score'></div>
      <div class='m_header'>
        <div class="m_info_login">
          <img :src='userInfo.avatar' class='m_avatar' mode='scaleToFill' />
          <div class='m_info_title'>
            <div class='m_info_name'>
              <span>{{userInfo.nickname}}</span>
            </div>
            <div class='m_info_level'>
              <div style='display:inline-flex;align-items:center;'>
                <i class='iconfont icon-huiyuanquanyi'></i>
                <span>{{userInfo.level}}</span>
              </div>
              <div style='display:inline-flex;align-items:center;margin-left:0.16rem;'>
                <i class='iconfont icon-jifen1'></i>
                <span>{{score}}</span>
              </div>
            </div>
          </div>
          <div class='m_score'>
            <i class='iconfont icon-iconqiandaowenzi' data-url='../mySignIn/mySignIn' @click='goSign'></i>
          </div>
        </div>
      </div>
      <div class='score_body'>
        <div class='score_title'>积分收支明细</div>
        <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false'
          :bottomDistance='60' :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'"> -->
        <div class='score_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="30">
          <div class='score_info' v-for='(item,index) in scoreList' :key='index'>
            <div class='score_info_more'>
              <span>{{item.desc}}</span>
              <span class='score_time'>{{item.createtime}}</span>
            </div>
            <div class='score_num'>
              {{item.price}}
            </div>
          </div>
          <!-- <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div> -->
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='list_bottom' v-if='total>0&&scoreList.length==total'>—————— 我是有底线的 ——————</div>
        </div>
        <!-- </mt-loadmore> -->
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
  Spinner,
  Loadmore
} from 'mint-ui'
import {
  getScoreList
} from '@/api/index'
import {
  parseTime
} from '@/store/pubilc.js'
import {
  mapMutations,
  mapGetters
} from 'vuex'
export default {
  name: 'MyScore',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Spinner,
    Loadmore
  },
  data() {
    return {
      h_title: '我的积分',
      header_bg: '@/assets/img/member/m_header_bg.png',
      avatar: '@/assets/img/member/avatar.png',
      userInfo: {
        avatar: '',
        level: '',
        nickname: '',
        username: '',
        isShow: 0
      },
      score: 0,
      page: 1,
      pagesize: 10,
      total: 0,
      scoreList: [],
      loading: true,
      screenHeight: (document.documentElement.clientHeight) / 50
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取cookie里的用户信息
    if (
      this.$store.state.home.userInfo !== null &&
        this.$store.state.home.userInfo !== '' &&
        this.$store.state.home.userInfo !== undefined
    ) {
      this.userInfo = this.$store.state.home.userInfo
    }
    this.scoreShow()
    // 获取积分明细列表
    this.getList()
  },
  methods: {
    ...mapMutations({
      setIsbind: 'SET_ISBIND',
      setScore: 'SET_SCORE',
      setIssign: 'SET_ISSIGN'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('score').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    goSign() {
      this.$router.togo({
        path: '/mySignIn'
      })
    },
    getList() {
      var that = this
      let info = {
        page: that.page,
        pagesize: that.pagesize
      }
      getScoreList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.setScore(res.data.point)
          for (var i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].createtime = parseTime(
              res.data.rows[i].createtime,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
          }
          that.scoreList = res.data.rows
          that.total = res.data.total
          this.loading = false
          // setTimeout(function () {
          //   if ((parseInt(that.total) === parseInt(that.scoreList.length) && parseInt(that.total) > 0) ||
          //     parseInt(that.total) === 0) {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
          //   } else {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
          //   }
          // }, 100)
        } else {
          that.loading = true
        }
      })
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        page: ++that.page,
        pagesize: that.pagesize
      }
      getScoreList(info).then(res => {
        if (res.isSuccess) {
          that.setScore(res.data.point)
          if (res.data.rows !== null && res.data.rows.length > 0) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(
                res.data.rows[i].createtime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            that.scoreList = that.scoreList.concat(res.data.rows)
            that.total = res.data.total
            that.loading = false
            // if (parseInt(that.total) === parseInt(that.scoreList.length) && parseInt(that.total) > 0) {
            //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            // }
          } else {
            that.loading = true
          }
        }
      })

      // that.$refs.loadmore.onBottomLoaded()
    },
    scoreShow() {
      if (this.$store.state.home.score > 0) {
        this.score = this.$store.state.home.score
      } else {
        this.score = 0
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

  .my_score {
    /* font-family: SimHei; */
    position: relative;
    background: #f2f2f2;
    // overflow: scroll;
  }

  .my_score .m_header_bg {
    height: 332/100rem;
    width: 100%;
    position: absolute;
    z-index: 1;
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

  /* 头部导航icon */

  /* .m_top_nav {
  height: 72/100rem;
  line-height: 72/100rem;
  text-align: center;
}

.m_return {
  float: left;
}

.m_return icon {
  color: #fff;
}

.m_top_nav text {
  color: #fff;
  font-size: 38/100rem;
  margin-left: -26/100rem;
} */

  /* 会员信息 */

  .m_info_login {
    /* padding-top: 20/100rem;  */
    margin-left: 20/100rem;
    display: flex;
    align-items: center;
    height: 200/100rem;
    justify-content: space-between;
    padding-right: 24/100rem;
  }

  .m_info_login .m_avatar {
    width: 122/100rem;
    height: 122/100rem;
    margin-right: 30/100rem;
    margin-bottom: 12/100rem;
    border-radius: 50%;
  }

  .m_info_login .m_info_title {
    /* width: 260/100rem;
  margin-right: 62/100rem; */
    /* margin-right: 140/100rem; */
    width: 400/100rem;
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
    font-weight: bold;
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

  .score_title {
    height: 100/100rem;
    line-height: 100/100rem;
    text-align: center;
    background: #f1f1f1;
    font-size: 34/100rem;
    color: #444;
  }

  .score_list {
    background: #fff;
    padding: 0 24/100rem;
    // height: calc(100vh - 1.78rem);
    // overflow: scroll;
  }

  .score_list :last-child {
    border-bottom: 0;
  }

  .score_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 30/100rem;
    padding-bottom: 30/100rem;
    border-bottom: 1px solid #e4e4e4;
    font-family: "DIN";
  }

  .score_info .score_info_more {
    float: left;
  }

  .score_info_more span {
    display: block;
    font-size: 25/100rem;
    color: #555;
  }

  .score_info_more .score_time {
    font-size: 18/100rem !important;
    color: #999 !important;
    font-family: "DIN";
  }

  .score_info .score_num {
    font-size: 32/100rem;
    color: #ff8d97;
    font-family: "DIN";
  }

  .more_load {
    display: flex;
    justify-content: center;
  }

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    background: #f2f2f2;
    font-size: 23.97/100rem;
    color: #bebebe;
  }

</style>
