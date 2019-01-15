<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='com'></div>
    <div class='my_comment'>
      <div class='com_body'>
        <div class='com_user'>
          <div class='user_info'>
            <img :src='userInfo.avatar' style='width:0.64rem;height:0.61rem;border-radius:50%;' />
            <span>{{userInfo.nickname}}</span>
            <!-- <i class='iconfont icon-userInfo.level'></i> -->
          </div>
          <div class='con_btn' @click="goOrder('/order',5,6)">写评论</div>
        </div>
        <div class='com_write' v-if='commOrder!=null'>
          <div class='write_title'>
            没有来得及评价的宝贝，还有机会去评论！
          </div>
          <div class='write_imglist'>
            <img :src='item.first_img' v-for='(item,index) in commOrder' :key='index' @click="goComm('/addComment',item.order_items.length,item.order_id)" />
            <div class='null_img' @click="goOrder('/order',5,6)" v-if='order_total>4'>
              <span>查看更多</span>
            </div>
          </div>
        </div>
        <div class='com_list' v-if='comList.length>0' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" >
          <div class='com_head'>全部评论</div>
          <div class='com_info' v-for='(item,index) in comList' :key='index'>
            <div class='com_info_head'>
              <div class='com_users'>
                <img :src='userInfo.avatar' style='width:0.64rem;height:0.61rem;border-radius:50%;' />
                <span>{{userInfo.nickname}}</span>
              </div>
              <div class='star_level'>
                <i class='iconfont icon-star' v-if="item.score<1"></i>
                <i class='iconfont icon-xingping light' v-if="item.score>=1"></i>
                <i class='iconfont icon-star' v-if="item.score<2"></i>
                <i class='iconfont icon-xingping light' v-if="item.score>=2"></i>
                <i class='iconfont icon-star' v-if="item.score<3"></i>
                <i class='iconfont icon-xingping light' v-if="item.score>=3"></i>
                <i class='iconfont icon-star' v-if="item.score<4"></i>
                <i class='iconfont icon-xingping light' v-if="item.score>=4"></i>
                <i class='iconfont icon-star' v-if="item.score<5"></i>
                <i class='iconfont icon-xingping light' v-if="item.score>=5"></i>
              </div>
            </div>
            <div class='com_pro_info'>
              <span>{{item.createtime}}</span>规格:
              <!-- 数量:<span>{{item.proNum}}</span> -->
              <span>{{item.title}}</span>
            </div>
            <div class='com_text'>
              {{item.comment}}
            </div>
            <div class='com_img'>
              <img :src='com' v-for='(com,index) in item.pic' :key='index' @click='previewImg(com)' />
            </div>
            <div class='com_pro_more' @click="goLink('/proDetail?type=normal&id=',item.goods_id)">
              <div class='pro_img'>
                <img :src='item.goods_image' />
              </div>
              <div class='pro_more_info'>
                <div class='pro_name'>{{item.name}}</div>
                <div class='pro_spec'>
                  规格:
                  <span>{{item.title}}</span>
                </div>
                <div class='pro_price'>
                  <span class='price'>{{item.proPrice_n}}</span>
                  <i class='iconfont icon-jifen1' v-if='item.proScore>0'></i>
                  <span class='score' v-if='item.proScore>0'>{{item.proScore}}</span>
                </div>
                <div class='pro_oldprice'>{{item.proPrice_o}}</div>
              </div>
            </div>
          </div>
          <button type="default" size="default" loading plain hidden='comList.length==total' style="border:none;background:#f2f2f2">加载中...</button>
        </div>
        <div class='order-foot' v-if='comList.length==total&&total>0'>
          <span>—————— 我是有底线的 ——————</span>
        </div>
        <div class='com_list_null' v-if='comList.length<=0'>暂无数据</div>
      </div>
    </div>
    <div class='goIndex' @click='goIndex' data-link='../index/index'>
      <i class='iconfont icon-home'></i>
    </div>
    <div class='pro_com_img_bg' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg"></div>
    <div class='pro_com_img' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg">
      <img :src="img_show_big" alt="" @click="hiddenImg">
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
// import {
//   mapMutations,
//   mapGetters
// } from 'vuex'
import {
  parseTime
} from '@/store/pubilc.js'
import {
  getMyCommList,
  getnoCommList
} from '@/api/index'
export default {
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
      h_title: '我的评价',
      showImg: false,
      comList: [],
      commOrder: [],
      userInfo: {
        avatar: '',
        nickname: '',
        username: '',
        isShow: 0
      },
      page: 1,
      limit: 10,
      total: 0,
      order_total: 0,
      imgShow: false,
      loading: true
    }
  },
  mounted() {
    Indicator.open('加载中...')
    this.userInfo = this.$store.state.home.userInfo
    // 获取我的评价列表
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('com').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    goLink(link, value) {
      let url = link
      if (value !== '') {
        url = link + value
      }
      this.$router.togo({
        path: url
      })
    },
    goOrder(link, id, tid) {
      this.$router.push({
        path: link,
        name: 'Order',
        params: {
          id: id,
          tid: tid
        }
      })
    },
    goComm(link, num, id) {
      this.$router.togo({
        path: link + '?num=' + num + '&orderId=' + id
      })
      // wx.navigateTo({
      //   url: e.currentTarget.dataset.url + '?num=' + e.currentTarget.dataset.num + '&orderId=' + e.currentTarget.id
      // })
    },
    getList: function () {
      var that = this
      // 获取我的评价
      let info = {
        page: that.page,
        limit: that.limit
      }
      getMyCommList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          for (var i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].createtime = parseTime(res.data.rows[i].createtime, '{y}-{m}-{d}')
          }
          that.comList = res.data.rows
          that.total = res.data.total
          that.loading = false
        }
      })
      // 获取未评价订单
      getnoCommList().then(res => {
        if (res.isSuccess) {
          if (res.row !== null) {
            that.commOrder = res.rows
            that.order_total = res.total
          }
        }
      })
    },
    loadMore() {
      var that = this
      that.loading = true
      // 获取我的评价
      let info = {
        page: ++that.page,
        limit: that.limit
      }
      getMyCommList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.rows !== null && res.data.rows.length > 0) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(res.data.rows[i].createtime, '{y}-{m}-{d}')
            }
            that.comList = that.comList.concat(res.data.rows)
            that.total = res.data.total
            that.loading = false
          } else {
            that.loading = true
          }
        }
      })
    },
    previewImg(url) {
      this.imgShow = true
      this.img_show_big = url
    },
    hiddenImg() {
      this.imgShow = false
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .my_comment {
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .com_body {
    height: 100%;
  }

  .com_user {
    height: 88/100rem;
    line-height: 88/100rem;
    background: #fff;
    margin-bottom: 20/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 26/100rem;
  }

  .com_user .user_info {
    height: 88/100rem;
    line-height: 88/100rem;
    display: inline-flex;
    align-items: center;
  }

  .com_user .user_info img {
    vertical-align: middle;
  }

  .user_info span {
    font-size: 24/100rem;
    color: #686868;
    margin: 0 16/100rem;
  }

  .user_info .iconfont {
    font-size: 40/100rem;
    color: #ff8d97;
  }

  .com_user .con_btn {
    width: 160/100rem;
    height: 50/100rem;
    font-size: 28/100rem;
    color: #ff8d97;
    border: 2/100rem solid #ff8d97;
    text-align: center;
    line-height: 50/100rem;
    border-radius: 20/100rem;
  }

  .com_body .com_write {
    height: 252/100rem;
    background: #fff;
    margin-bottom: 20/100rem;
    padding: 0 26/100rem;
  }

  .com_write .write_title {
    font-size: 24/100rem;
    color: #909090;
    padding-top: 38/100rem;
  }

  .com_write .write_imglist {
    margin-top: 25/100rem;
    overflow: hidden;
  }

  .write_imglist img {
    width: 130/100rem;
    height: 130/100rem;
    margin-right: 12/100rem;
  }

  .write_imglist .null_img {
    width: 130/100rem;
    height: 130/100rem;
    background: #8f8f8f;
    text-align: center;
    line-height: 130/100rem;
    float: right;
  }

  .null_img span {
    color: #fff;
    font-size: 22/100rem;
  }

  // .com_body .com_list {}

  .com_list .com_head {
    height: 84/100rem;
    line-height: 84/100rem;
    font-size: 32/100rem;
    color: #ff8d97;
    background: #fff;
    padding: 0 26/100rem;
    border-bottom: 2/100rem solid #e0e0e0;
  }

  .com_list .com_info {
    margin-bottom: 20/100rem;
    background: #fff;
    padding: 0 26/100rem;
    padding-bottom: 20/100rem;
  }

  .com_info .com_info_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 36/100rem;
  }

  .com_info_head .com_users {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
  }

  .com_users span {
    font-size: 24/100rem;
    color: #686868;
    margin-left: 16/100rem;
  }

  .com_info .com_pro_info {
    padding-top: 22/100rem;
    font-size: 24/100rem;
    color: #a4a4a4;
    font-family: 'DIN';
    background: #fff;
  }

  .com_info_head .star_level .light {
    color: #ff8d97;
  }

  .com_info_head .star_level icon {
    color: #ff8d97;
  }

  .com_pro_info span {
    margin-right: 8/100rem;
  }

  .com_info .com_span {
    padding: 36/100rem 0;
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #333;
    word-wrap: break-word;
  }

  .com_img img {
    width: 176/100rem;
    height: 176/100rem;
    margin-right: 12/100rem;
  }

  .com_info .com_pro_more {
    height: 220/100rem;
    display: flex;
    align-items: center;
    background: #f8f8f8;
  }

  .com_pro_more .pro_img {
    width: 220/100rem;
    height: 220/100rem;
  }

  .com_pro_more .pro_img img {
    width: 220/100rem;
    height: 220/100rem;
  }

  .com_pro_more .pro_more_info {
    padding: 0 24/100rem;
    background: #f8f8f8;
  }

  .pro_more_info .pro_name {
    width: 437/100rem;
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #313131;
    /* margin-top: 30/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pro_more_info .pro_spec {
    margin-top: 10/100rem;
    font-size: 24/100rem;
    color: #7e7e7e;
  }

  .pro_spec span {
    font-family: 'DIN';
  }

  .com_pro_more .pro_price {
    margin-top: 10/100rem;
    font-family: 'DIN';
  }

  .pro_price .price {
    font-size: 38/100rem;
    color: #ff8d97;
  }

  .pro_price .score {
    font-size: 26/100rem;
    color: #666;
  }

  .pro_price img {
    width: 24/100rem;
    height: 20/100rem;
  }

  .com_pro_more .pro_oldprice {
    font-family: 'DIN';
    color: #7c7c7c;
    font-size: 22/100rem;
    text-decoration: line-through;
    margin-top: -8/100rem;
  }

  .com_oper {
    display: flex;
    height: 72/100rem;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 42/100rem;
  }

  .com_oper .com_oper_info {
    font-size: 24/100rem;
    color: #8b8b8b;
  }

  .com_oper .com_oper_btn {
    width: 144/100rem;
    height: 46/100rem;
    font-size: 28/100rem;
    color: #ff8d97;
    border: 2/100rem solid #ff8d97;
    text-align: center;
    line-height: 46/100rem;
    border-radius: 20/100rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .com_oper_btn icon {
    font-size: 28/100rem;
    line-height: 88/100rem;
  }

  .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
    margin-top: -20/100rem;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .com_list_null {
    text-align: center;
    font-size: 30/100rem;
    /* font-weight: bold; */
    padding: 20/100rem 0;
    color: #999;
  }

  .pro_com_img_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;
  }

  .pro_com_img {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    z-index: 203;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80%;
      vertical-align: middle;
    }
  }

</style>
