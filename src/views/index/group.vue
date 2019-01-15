<template>
  <div>
    <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
    <!-- 返回顶部按钮 -->
    <return-top @returnTop='goTop'></return-top>
    <div class='sale_height' id='group'></div>
    <div class='sale' v-if='isShow'>
      <div class='sale_body'>
        <div class='sale_banner'>
          <img :src='headbg' />
        </div>
        <!-- <mt-loadmore :bottom-method="loadMore" class='sale_list' v-if='total>0' :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false' :bottomDistance='60' :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'"> -->
        <div class='sale_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30">
          <div style='background:#fff;padding: 0 0.24rem;' v-if='total>0'>
          <div class='sale_pro' v-for="(item,index) in saleProList" :key="index">
            <div class='pro_img' @click="goPro('group',item.id,item.goods_id)">
              <img :src='item.img' />
            </div>
            <div class='pro_info'>
              <div class='pro_title' @click="goPro('group',item.id,item.goods_id)">{{item.name}}</div>
              <div class='pro_spec'>
                <div class='pro_price'>
                  <div style='display:flex;align-items:center;'>
                    <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price}} </span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price}} </span>
                    <span class='pro_integral_point' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>+</span>
                    <i class='iconfont icon-jifen1 pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'></i>
                    <span class='pro_integral_point' v-if='item.deal_type==2'>{{item.point}}</span>
                    <span class='pro_integral_point' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                  </div>
                  <div class='pro_orig'>
                    <span class='line'>¥{{item.price_market}}</span>
                  </div>
                </div>
                <div class='pro_group'>
                  <span class='pro_integral'>{{item.startnum}}人团</span>
                  <span>·NEW</span>
                </div>
                <div class='pro_icon'>
                  <span>已拼{{item.join_num}}人</span>
                  <mt-button size='small' @click="goPro('group',item.id,item.goods_id)" v-if='item.is_past==2' class='end'>未开场</mt-button>
                  <mt-button size='small' @click="goPro('group',item.id,item.goods_id)" v-if='item.is_past==0' class='active'>去开团</mt-button>
                  <mt-button size='small' @click="goPro('group',item.id,item.goods_id)" v-if='item.is_past==1' class='end'>已结束</mt-button>
                </div>
              </div>
            </div>
          </div>
          </div>
          <!-- </mt-loadmore> -->
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='list_bottom' v-if='loading'>—————— 我是有底线的 ——————</div>
          <div class='sale_list_null' v-if='total<=0&&isShow'>
            <div class='order-foot'>
              <span>暂无数据</span>
            </div>
          </div>
        </div>

      </div>
      <div class='null_height'></div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload
} from 'mint-ui'
import {
  getGroupList
} from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
export default {
  name: 'Group',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '拼团中心',
      newNews: false,
      total_amout: 0,
      isShow: false,
      timeList: [],
      saleProList: [],
      typeList: [],
      typeId: '',
      page: 1,
      pagesize: 10,
      total: 0,
      headbg: '',
      isSign: true,
      loading: false
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取促销时段列表
    this.getList()
  },
  methods: {
    onPageScroll: function (e) {
      // 获取滚动条当前位置
      if (e.scrollTop > 900) {
        if (this.data.isSign) {
          this.setData({
            isSign: false
          })
        }
      } else {
        if (!this.data.isSign) {
          this.setData({
            isSign: true
          })
        }
      }
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('group').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goPro(type, id, goodsid) {
      this.$router.togo({
        path: '/proDetail?type=' + type + '&id=' + id + '&goods_id=' + goodsid
      })
    },
    choseType: function (e) {
      //   wx.showLoading({
      //     title: '加载中'
      //   })
      this.setData({
        typeId: e.currentTarget.id,
        page: 1,
        total: '0'
      })
      this.getList()
    },
    getList: function () {
      var info = {
        timeid: this.typeId,
        page: this.page,
        pagesize: this.pagesize
      }
      let that = this
      getGroupList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.h_title = res.data.title
          that.headbg = res.data.group_bgimg
          that.saleProList = res.data.group_list.rows
          that.total = res.data.group_list.total
          that.isShow = true
          that.loading = false
        } else {
          that.saleProList = []
          that.total = 0
          that.loading = true
        }
      })
    },
    loadMore() {
      let that = this
      this.loading = true
      // 加载更多数据
      this.page = ++this.page
      var info = {
        timeid: this.typeId,
        page: this.page,
        pagesize: this.pagesize
      }
      getGroupList(info).then(res => {
        if (res.isSuccess) {
          if (res.data.group_list.rows != null && res.data.group_list.rows.length > 0) {
            that.saleProList = that.saleProList.concat(
              res.data.group_list.rows
            )
            that.total = res.data.group_list.total
            that.loading = false
            // if (parseInt(that.total) === parseInt(that.saleProList.length) && parseInt(that.total) > 0) {
            //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            // }
          } else {
            this.loading = true
          }
        }
      })

      // this.$refs.loadmore.onBottomLoaded()
    }
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .sale_height {
    height: 0.9rem;
  }

  .sale_body {
    background: #fff;
  }

  .sale_body .sale_banner {
    height: 450/100rem;
  }

  .sale_body .sale_banner img {
    height: 450/100rem;
    width: 100%;
  }

  .sale_body .sale_tab {
    height: 120/100rem;
    width: 100%;
    white-space: nowrap;
  }

  .sale_tab .sale_nav {
    overflow: hidden;
    text-align: center;
    position: relative;
    height: 120/100rem;
    width: 192/100rem;
    display: inline-block;
  }

  .sale_tab .sale_nav div {
    height: 80/100rem;
    line-height: 80/100rem;
    background: #000;
    padding: 10/100rem 0;
  }

  .sale_tab .sale_nav .active {
    background: #ff8d97;
  }

  .sale_nav div span {
    display: block;
    text-align: center;
    color: #fff;
    margin: 0;
    padding: 0;
  }

  .sale_tab .sale_nav img {
    height: 18/100rem;
    width: 28/100rem;
    /* transform: rotate(90deg); */
    position: absolute;
    bottom: 4/100rem;
  }

  .sale_nav div .sale_time {
    font-size: 30/100rem;
    font-weight: bold;
    font-family: "DIN";
  }

  .sale_nav div .sale_states {
    font-size: 26/100rem;
  }

  .sale_nav .active .sale_time {
    font-size: 50/100rem;
    color: #fff600;
    margin-top: -16/100rem;
    font-weight: bold;
  }

  .sale_nav .active .sale_states {
    color: #fff600;
  }

  .sale_list {
    // padding: 0 26/100rem;
    padding-top: 30/100rem;
  }

  .sale_list_null {
    padding: 0 26/100rem;
  }

  .sale_list .sale_pro {
    /* padding: 0 26/100rem;
  height: 260/100rem;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  align-items: center; */
    height: 342/100rem;
    background: #fff;
    display: flex;
    align-items: center;
    border-radius: 12/100rem;
    box-shadow: 0 3/100rem 4/100rem 2/100rem #e4e4e4;
    padding: 0 40/100rem;
    margin-bottom: 30/100rem;
  }

  .sale_pro .pro_img {
    float: left;
    /* margin-left: 18/100rem; */
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 260/100rem;
    height: 260/100rem;
  }

  .sale_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 26/100rem;
    color: #121212;
    /* margin: 20/100rem 0; */
    margin-bottom: 30/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pro_info .pro_progress {
    height: 30/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 22/100rem 0;
  }

  .pro_progress .prog {
    width: 300/100rem;
    height: 15/100rem;
    border: 2/100rem solid #ff8d97;
    background: #ffc4d5;
    border-radius: 10/100rem;
  }

  .pro_progress .prog div {
    width: 60%;
    height: 15/100rem;
    background: #ff8d97;
    border-radius: 10/100rem;
  }

  .pro_progress span {
    color: #ea3364;
    font-size: 22/100rem;
    font-family: "DIN";
  }

  .pro_spec .pro_price {
    font-family: "DIN";
    /* width: 240/100rem; */
    display: flex;
    align-items: flex-end;
    margin-bottom: 30/100rem;
  }

  .pro_price .peo_nowprice {
    /* color: #ff8d97; */
    color: #313131;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_price .pro_integral {
    font-size: 24/100rem;
    /* color: #ff8d97; */
    color: #313131;
    /* margin-left: 8/100rem; */
    margin-right: 20/100rem;
  }

  .pro_price .pro_integral_point {
    font-size: 30/100rem;
    font-weight: bold;
    /* color: #ff8d97; */
    color: #313131;
    /* margin-left: 8/100rem; */
  }

  .pro_price .pro_inter_img {
    font-size: 30/100rem;
    font-weight: bold;
    display: inline-flex;
    color: #313131;
    /* margin-right: 30/100rem; */
  }

  /* .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

  .pro_price .pro_orig {
    font-size: 22/100rem;
    color: #989898;
    margin-bottom: 6/100rem;
    /* margin-left: 10/100rem; */
  }

  .pro_price .pro_orig .line {
    text-decoration: line-through;
    margin-left: 14/100rem;
  }

  .pro_spec .pro_group {
    display: flex;
    align-items: center;
    margin-bottom: 30/100rem;
  }

  .pro_group span {
    font-size: 24/100rem;
    color: #999;
  }

  .pro_group .pro_integral {
    color: #ff8d97;
    /* margin-right: 20/100rem; */
  }

  .pro_spec .pro_icon {
    margin-right: 4/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pro_spec .pro_icon span {
    font-size: 20/100rem;
    color: #999;
  }

  .pro_icon img {
    width: 50/100rem;
    height: 46/100rem;
  }

  .pro_icon button {
    width: 140/100rem;
    height: 52/100rem;
    color: #fff;
    font-size: 26/100rem;
    padding: 0/100rem 20/100rem;
    margin: 0;
    line-height: 52/100rem;
    border-radius: 16/100rem;
  }

  .pro_icon .active {
    background: #ff8d97;
  }

  .pro_icon .end {
    background: #d3d3d3;
  }

  .sale_body_list .sale_tab {
    height: 120/100rem;
  }

  .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
    /* margin-top: -30/100rem; */
    background: #f2f2f2;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  /* 空白的块，解决底部导航占领高度 */
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

  .null_height {
    height: 106/100rem;
  }

</style>
