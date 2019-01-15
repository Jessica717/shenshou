<template>
  <div>
    <common-header :h_title="h_title" :bgcolor="head_color"></common-header>
    <div id='find' style="height:0.9rem"></div>
    <div class="hot_article">
      <!-- <return-top @returnTop='goTop'></return-top> -->
      <div class='hot_info'>
        <div class='hot_title'>
          {{articleInfo.title}}
        </div>
        <div class='hot_other'>
          <div class='other_time'>{{articleInfo.updatetime}}</div>
          <div class='other_icon'>
            <i class="iconfont icon-16pxyuedu"></i>
            <span>{{articleInfo.click_nums}}人已阅读</span>
          </div>
        </div>
        <div class='hot_content' v-for='(item,index) in articleInfo.content' :key='index'>
          <div class='hot_rich' v-if='item.type==1'>
            <div v-html='item.content' class='pro_html'></div>
            <!-- <template is="wxParse" data="{{wxParseData:item.html}}" /> -->
          </div>
          <div class='hot_pro' v-if='item.type==2'>
            <div class='pro' @click="goPro('normal',item.content,'')">
              <img :src='item.goods.img' style='width:7rem;' />
              <div class='pro_price'>
                <span v-if='item.goods.deal_type==1'>¥{{item.goods.price_sell}}</span>
                <span v-if='item.goods.deal_type>=4'>¥{{item.goods.price_sell}}+</span>
                <i class='iconfont icon-jifen1' v-if='item.goods.deal_type!=1'></i>
                <span v-if='item.goods.deal_type==2||item.goods.deal_type==3'>{{item.goods.point}}</span>
                <span v-if='item.goods.deal_type>=4'>{{item.goods.point}}</span>
                <span>|去购买</span>
              </div>
            </div>
          </div>
          <div class='hot_pro' v-if='item.type==3'>
            <div class='pro' @click="goPro('group',item.activity_id,item.content)">
              <img :src='item.goods.img' style='width:7rem;' />
              <div class='pro_price'>
                <span v-if='item.goods.deal_type==1'>¥{{item.goods.price_sell}}</span>
                <span v-if='item.goods.deal_type>=4'>¥{{item.goods.price_sell}}+</span>
                <i class='iconfont icon-jifen1' v-if='item.goods.deal_type!=1'></i>
                <span v-if='item.goods.deal_type==2||item.goods.deal_type==3'>{{item.goods.point}}</span>
                <span v-if='item.goods.deal_type>=4'>{{item.goods.point}}</span>
                <span>|去购买</span>
              </div>
            </div>
          </div>
          <div class='hot_pro' v-if='item.type==4'>
            <div class='pro' @click="gotryPro(item.activity_id)" >
              <img :src='item.goods.img' style='width:7rem;' />
              <div class='pro_price'>
                <span v-if='item.goods.deal_type==1'>¥{{item.goods.price_sell}}</span>
                <span v-if='item.goods.deal_type>=4'>¥{{item.goods.price_sell}}+</span>
                <i class='iconfont icon-jifen1' v-if='item.goods.deal_type!=1'></i>
                <span v-if='item.goods.deal_type==2||item.goods.deal_type==3'>{{item.goods.point}}</span>
                <span v-if='item.goods.deal_type>=4'>{{item.goods.point}}</span>
                <span>|去购买</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='goIndex' @click='goIndex' data-link='../index/index'>
      <i class='iconfont icon-home'></i>
    </div>
    <div class='goShare' @click='share(articleInfo.id,articleInfo.title)'>
      <i class='iconfont icon-fenxiang2'></i>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Search,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
import LyTab from '@/components/LyTab/index'
import {
  getArticle
} from '@/api/index'
// import {
//   countDownList
// } from '@/store/pubilc.js'
import returnTop from '@/components/return-top'
export default {
  name: 'FindDetail',
  components: {
    commonHeader,
    Search,
    LyTab,
    returnTop,
    InfiniteScroll,
    Lazyload,
    Button,
    Toast
  },
  data() {
    return {
      h_title: '文章详情',
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      articleId: '',
      isSign: true,
      listShow: false,
      articleInfo: {},
      noScroll: false,
      sharewx: ''
    }
  },
  mounted() {
    document.getElementById('find').scrollIntoView(false)
    Indicator.open('加载中...')
    console.log(this.$route.query)
    this.articleId = this.$route.query.id
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
      document.getElementById('find').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getDetail() {
      getArticle(this.articleId).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          console.log(res)
          this.articleInfo = res.data
        }
      })
    },
    goPro(type, id, goodsId) {
      if (type === 'normal') {
        this.$router.togo({
          path: '/proDetail?type=' + type + '&id=' + id
        })
      } else if (type === 'group') {
        this.$router.togo({
          path: '/proDetail?type=' + type + '&id=' + id + '&goods_id' + goodsId
        })
      }
    },
    gotryPro(id) {
      this.$router.togo({
        path: '/tryOutdetail?id=' + id + '&form_share=0&help_id=null'
      })
    },
    goIndex: function (e) {
      this.$router.replace({
        path: '/index'
      })
    },
    share(id, title) {
      let System = window.plus
      console.log(this.sharewx)
      let img = '_www/img/mp.png'
      // 正式gh_a0cfbcaf8fa2 测试gh_05718de312bd
      let shareUrl = 'pages/hotArticle/hotArticle?id=' + id + '&name=' + title
      let msg = {
        type: 'miniProgram',
        title: '[小程序]' + title,
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
    showList: function () {
      this.setData({
        listShow: true,
        noScroll: true
      })
    },
    hideList: function () {
      this.setData({
        listShow: false
      })
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .hot_article {
    background: #fff;
    /* margin-bottom: 100/100rem; */
  }

  .fixed {
    position: fixed;
  }

  .hot_info {
    padding: 0 25/100rem;
    width: 700/100rem;
    padding-top: 30/100rem;
  }

  // .hot_title {}

  .hot_other {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24/100rem;
    color: #808080;
    margin-bottom: 26/100rem;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 26/100rem;

  }

  .hot_other .iconfont {
    font-size: 34/100rem;
    display: inline-flex;
    margin-right: 8/100rem;
  }

  .hot_img {
    margin: 10/100rem 0;
  }

  .hot_rich {
    /* text-align: center; */
    color: #666;
  }

  .hot_video {
    text-align: center;
  }

  .hot_video video {
    width: 700/100rem;
  }

  .hot_pro {
    text-align: center;
  }

  .pro {
    position: relative;
    width: 700/100rem;
    margin: 0 auto;
  }

  .pro .pro_price {
    position: absolute;
    right: 0;
    bottom: 20/100rem;
    background: rgba(0, 0, 0, 0.4);
    height: 50/100rem;
    font-size: 28/100rem;
    color: #fff;
    line-height: 50/100rem;
    text-align: center;
    padding: 0 10px;
  }

  .pro .pro_price .iconfont {
    display: inline-flex;
    color: #fff;
    /* margin: 0 10/100rem; */
  }

  .hot_btn {
    box-shadow: 0 8/100rem 26/100rem 14/100rem #dadada;
    position: fixed;
    bottom: -5/100rem;
    height: 100/100rem;
    line-height: 100/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #fff;
    color: #fff;
  }

  .hot_btn button {
    display: flex;
    justify-content: center;
    /* width: 50%; */
    border-radius: 0;
    height: 100/100rem;
    line-height: 100/100rem;
    font-size: 32/100rem;
    color: #666;
  }

  .hot_btn button::after {
    border: none;
  }

  .hot_btn .pro_buy {
    width: 60%;
    background: #ff8d97;
    color: #fff;
  }

  .hot_btn .pro_share {
    /* width: 300/100rem; */
    background: #ff8d97;
    color: #fff;
    width: 40%;
  }

</style>
