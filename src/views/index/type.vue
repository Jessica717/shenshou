<template>
  <div>
    <!-- <common-header :h_title="h_title" :showback="false" :bgcolor='head_color'></common-header> -->
    <div class='type_bg'>
      <return-top @returnTop='goTop'></return-top>
      <div class='fixed_top'>
        <!-- 搜索框 -->
        <div class="type_header">
          <div class='serach'>
            <i class='iconfont icon-search'></i>
            <mt-field placeholder="搜索喜欢的商品" v-model="searchkey" class='search_input' @change="searchList"></mt-field>
          </div>
        </div>
        <!-- 顶部菜单栏 -->
        <div class='scroll_nav'>
          <ly-tab v-model="selectedId" :items="navList" :options="options" v-if='showNav' @change='choseNav'></ly-tab>
        </div>
        <!-- 筛选条件 -->
        <div class='type_fifter'>
          <span :class="searchFifter[0].point!=''?'icon_active ':''" @click="fifterSort('point')">积分
            <i :class="searchFifter[0].point=='asc'?'iconfont icon-asc sort_asc':'iconfont icon-desc sort_desc'"></i>
          </span>
          <span :class="searchFifter[0].price!=''?'icon_active ':''" @click="fifterSort('price')">价格
            <i :class="searchFifter[0].price=='asc'?'iconfont icon-asc sort_asc':'iconfont icon-desc sort_desc'"></i>
          </span>
          <span :class="searchFifter[0].quantity!=''?'icon_active ':''" @click="fifterSort('quantity')">销量
            <i :class="searchFifter[0].quantity=='asc'?'iconfont icon-asc sort_asc':'iconfont icon-desc sort_desc'"></i>
          </span>
          <span :class="(searchFifter[0].type_id!=''||searchFifter[0].deal_type!=''||searchFifter[0].price_range!='')?'fifter_sort icon_active ':'fifter_sort'"
            @click="fifterAll">筛选
            <i class='iconfont icon-shaixuan1'></i>
          </span>
        </div>
      </div>
      <div class='red_list_head' id='type'></div>
      <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false' :bottomDistance='60' class='red_list' :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" v-if='isShow'> -->
        <!--  -->
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30"  class='red_list'>
        <div class='red_pro' v-for="(item,index) in proList" :key="index">
          <div class='pro_img' @click="goPro('normal',item.goods_id)">
            <img :src='item.img' v-lazy="item.img" />
          </div>
          <div class='pro_info'>
            <div class='pro_title' @click="goPro('normal',item.goods_id)">
              <div class='pro_level' v-if='item.promotion==1'>
                <img src='@/assets/img/member/cu.png' />
                <span>限时购</span>
              </div>
              {{item.name}}
            </div>
            <div class='pro_spec'>
              <div class='pro_price'>
                <div style='display:flex;align-items:center;line-height:48/100rem;'>
                  <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}} </span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>+</span>
                  <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>
                <div style='display:flex;align-items:center;justify-content:space-between;'>
                  <div style='display:inline-flex;align-items:center;'>
                    <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                    <span class='pro_orig line'>￥{{item.price_market}}</span>
                  </div>
                  <div class='pro_count'>销量:{{item.buy_count}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </mt-loadmore> -->
      <div class='fifter_more_bg' @click='hiddenFifterBg' v-if='fifter' @touchmove='stopMove'></div>
      <div :class="{'animated slideInRight fifter_more':fifter,'animated slideOutRight fifter_more':!fifter}" style="height: 100%" v-if='fifter'>
        <div class='fifter_price'>
          <span>价格区间</span>
          <div>
            <input placeholder='最低价' type='number' v-model="lowPrice" @blur='low' />
            <i class='iconfont icon-jian'></i>
            <input placeholder='最高价' type='number' v-model="highPrice" @blur='high' />
          </div>
        </div>
        <div class='fifter_other' style="{height:brandHeight+'px'}">
          <div class='fifter_info' v-for="(item,index) in fifterList" :key='index'>
            <div class='fifter_head'>
              <span>{{item.fifter_name}}</span>
              <div v-if="item.fifter_id!=1" @click='openfifter(item.fifter_id)'>
                <span>全部</span>
                <i :class="item.isopen?'iconfont icon-xiajiantou icon_open':'iconfont icon-xiajiantou'"></i>
              </div>
            </div>
            <div :class="item.isopen?'fifter_options':'fifter_options_hidden fifter_options'">
              <span v-for="(item_fifter,index) in item.fifteroptions" :key="index" :class="item_fifter.checked?'chose_text':''"
               @click='chosefifterList(item_fifter.id,item.fifter_id,index)' v-if='item_fifter.id!=0'>{{item_fifter.name}}</span>
            </div>
          </div>
        </div>
        <div class='fifter_more_btn'>
          <mt-button size='small' @click='resetFifter'>重置</mt-button>
          <mt-button size='small' class='btn_red' @click='hiddenFifter'>确定</mt-button>
        </div>
      </div>
      <div class='more_load' v-if='!loading'>
        <mt-spinner type="fading-circle"></mt-spinner>
      </div>
      <div class='list_bottom' v-if='total==proList.length&&total>0'>—————— 我是有底线的 ——————</div>
      <div class='red_list_null' v-if='!hasData'>
        <span>暂无数据</span>
      </div>
    </div>
    <div style='height:0.98rem'></div>
  </div>
</template>

<script>
// import { mapMutations, mapGetters, mapState } from 'vuex'
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Search,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  getRecomType,
  getTypeList
} from '@/api/index'
import LyTab from '@/components/LyTab/index'
import returnTop from '@/components/return-top'
export default {
  name: 'Type',
  components: {
    commonHeader,
    Search,
    LyTab,
    returnTop,
    InfiniteScroll,
    Lazyload,
    Toast
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '商品分类',
      num: 0,
      total: 0,
      searchkey: '',
      par: '',
      limit: 10,
      selectedId: 0,
      choseIndex: 0,
      showNav: false,
      navList: [],
      proList: [],
      loading: true,
      hasData: false,
      options: {
        activeColor: '#ff8d97',
        labelKey: 'name'
      },
      searchFifter: [{
        price: '',
        point: '',
        type_id: '',
        deal_type: '',
        quantity: 'desc',
        price_range: ''
      }],
      fifterList: [{
        fifter_id: 0,
        fifter_name: '分类',
        isopen: true,
        fifteroptions: []
      },
      {
        fifter_id: 1,
        fifter_name: '支付方式',
        isopen: false,
        fifteroptions: [{
          id: '3',
          name: '现金+积分',
          checked: false
        },
        {
          id: '1',
          name: '现金',
          checked: false
        },
        {
          id: '2',
          name: '积分',
          checked: false
        }
        ]
      }
      ],
      fifter: false,
      lowPrice: '',
      highPrice: '',
      isShow: false
    }
  },
  mounted() {
    console.log(this.$route.query)
    let options = this.$route.query
    if (options.id !== undefined) {
      this.selectedId = parseInt(options.id)
      this.searchFifter[0].type_id = options.typeid
    }
    Indicator.open('加载中...')
    // 获取分类
    this.getType()
    // 获取列表
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('type').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getType() {
      getRecomType().then(res => {
        this.navList = res.left
        this.fifterList[0].fifteroptions = res.left
        this.navList.unshift({
          id: 0,
          name: '推荐'
        })
        this.showNav = true
      })
    },
    getList() {
      var info = {
        searchkey: this.searchkey,
        par: this.par,
        limit: this.limit,
        fifter: JSON.stringify(this.searchFifter)
      }
      let that = this
      getTypeList(info).then(res => {
        Indicator.close()
        that.isShow = true
        if (res.isSuccess) {
          if (res.rows.length > 0) {
            that.proList = res.rows
            that.total = res.total
            that.par = res.page
            that.hasData = true
            that.loading = false
          } else {
            that.proList = []
            that.total = 0
            that.hasData = false
            that.loading = true
          }
          setTimeout(function() {
            if ((parseInt(that.total) === parseInt(that.proList.length) && parseInt(that.total) > 0) || parseInt(that.total) === 0) {
              // document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
              that.loading = true
            } else {
              // document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
            }
          }, 100)
        }
      })
    },
    choseNav(e) {
      console.log(this.selectedId)
      Indicator.open('加载中...')
      document.getElementById('type').scrollIntoView(false)
      this.par = ''
      this.searchFifter[0].type_id = e.id
      this.getList()
    },
    fifterAll() {
      this.brandHeight = document.documentElement.clientHeight - 165
      this.pro_type = false
      this.fifter = !this.fifter
      this.allowScorll = false
      console.log(this.fifterList)
    },
    low: function(e) {
      console.log(this.lowPrice)
      console.log(typeof this.lowPrice)
      this.lowPrice = parseFloat(this.lowPrice)
      if (this.lowPrice.length > 0 && (typeof this.lowPrice !== 'number' || isNaN(this.lowPrice) === false)) {
        Toast({
          message: '价格只能为数字',
          duration: 1000
        })
        this.lowPrice = ''
      }
    },
    high: function(e) {
      console.log(this.highPrice)
      this.highPrice = parseFloat(this.highPrice)
      if (this.highPrice.length > 0 && (typeof this.highPrice !== 'number' || isNaN(this.highPrice) === false)) {
        Toast({
          message: '价格只能为数字',
          duration: 1000
        })
        this.highPrice = ''
      }
    },
    hiddenFifter() {
      this.page = 1
      this.allowScorll = true
      if (parseInt(this.lowPrice) > parseInt(this.highPrice)) {
        Toast({
          message: '最低价必须小于最高价',
          duration: 1000
        })
      } else {
        Indicator.open('加载中...')
        this.proList = []
        if (this.lowPrice === '' && this.highPrice === '') {
          this.searchFifter[0].price_range = ''
        } else {
          this.searchFifter[0].price_range = this.lowPrice + ',' + this.highPrice
        }
        this.searchFifter[0].price = ''
        this.searchFifter[0].point = ''
        this.searchFifter[0].quantity = ''
        this.selectedId = this.choseIndex
        this.loading = true
        this.hasData = false
        setTimeout(function() {
          this.getList()
          this.fifter = !this.fifter
          this.allowScorll = true
          this.chose_nav_id = this.searchFifter[0].type_id
          this.topNum = 0
          this.is_load = true
        }.bind(this), 400)
      }
    },
    hiddenFifterBg() {
      this.fifter = !this.fifter
      this.allowScorll = true
    },
    stopMove(e) {
      e.preventDefault()
    },
    chosefifterList(id, fid, index) {
      let arr = []
      // console.log(fid) 父级筛选id 0是品牌，1是类型，2是分类
      // console.log(id) 单个筛选子类的id
      let farr = this.fifterList
      for (let i = 0; i < farr.length; i++) {
        if (i === fid) {
          for (let j = 0; j < farr[i].fifteroptions.length; j++) {
            if (farr[i].fifteroptions[j].id === id) {
              this.choseIndex = j
              farr[i].fifteroptions[j].checked = !farr[i].fifteroptions[j].checked
            } else {
            // 单选,重置所有高级搜索条件
              farr[i].fifteroptions[j].checked = false
            }
          }
        }
      }
      this.fifterList = farr
      for (let i = 0; i < farr.length; i++) {
        if (i === fid) {
          for (let j = 0; j < farr[i].fifteroptions.length; j++) {
            if (farr[i].fifteroptions[j].checked) {
              arr.push(farr[i].fifteroptions[j].id)
            }
          }
        }
      }
      if (fid === 1 || fid === '1') {
      // 选择支付类型
        this.searchFifter[0].deal_type = arr.join(',')
      } else if (fid === 0 || fid === '0') {
      // 选择分类
        this.searchFifter[0].type_id = arr.join(',')
        this.chose_nav_id = arr.join(',')
      }
    },
    openfifter(id) {
      let farr = this.fifterList
      for (var i = 0; i < farr.length; i++) {
        if (farr[i].fifter_id === id) {
          farr[i].isopen = !farr[i].isopen
        }
      }
      this.fifterList = farr
    },
    resetFifter() {
      for (var i = 0; i < this.fifterList.length; i++) {
        for (var j = 0; j < this.fifterList[i].fifteroptions.length; j++) {
          this.fifterList[i].fifteroptions[j].checked = false
        }
      }
      this.searchFifter[0].type_id = ''
      this.searchFifter[0].deal_type = ''
      this.searchFifter[0].price_range = ''
      this.lowPrice = ''
      this.highPrice = ''
      this.chose_nav_id = -1
      this.choseIndex = 0
      this.loading = true
      this.hasData = false
    },
    searchList() {
      console.log(0)
      Indicator.open('加载中...')
      document.getElementById('type').scrollIntoView(false)
      console.log(this.searchkey)
      // if(this.searchkey)
      this.par = ''
      this.proList = []
      this.getList()
      window.plus.key.hideSoftKeybord()
    },
    fifterSort(e) {
      console.log(e)
      if (e === 'point') {
        this.searchFifter[0].price = ''
        this.searchFifter[0].quantity = ''
        if (this.searchFifter[0].point === 'asc') {
          this.searchFifter[0].point = 'desc'
        } else {
          this.searchFifter[0].point = 'asc'
        }
      } else if (e === 'price') {
        this.searchFifter[0].point = ''
        this.searchFifter[0].quantity = ''
        if (this.searchFifter[0].price === 'asc') {
          this.searchFifter[0].price = 'desc'
        } else {
          this.searchFifter[0].price = 'asc'
        }
      } else if (e === 'quantity') {
        this.searchFifter[0].point = ''
        this.searchFifter[0].price = ''
        if (this.searchFifter[0].quantity === 'asc') {
          this.searchFifter[0].quantity = 'desc'
        } else {
          this.searchFifter[0].quantity = 'asc'
        }
      }
      this.par = ''
      Indicator.open('加载中...')
      document.getElementById('type').scrollIntoView(false)
      this.getList()
    },
    goPro(type, id) {
      this.$router.togo({
        path: '/proDetail?type=' + type + '&id=' + id
      })
    },
    loadMore() {
      this.loading = true
      // 加载更多数据
      var info = {
        searchkey: this.searchkey,
        par: this.par,
        limit: this.limit,
        fifter: JSON.stringify(this.searchFifter)
      }
      let that = this
      getTypeList(info).then(res => {
        if (res.isSuccess) {
          if (res.rows !== null && res.rows.length > 0) {
            that.proList = that.proList.concat(res.rows)
            that.total = res.total
            that.par = res.page
            that.loading = false
            console.log(that.proList)
            // if (res.page != null) {
            //   this.loading = false
            // } else {
            //   this.loading = true
            // }
            if (parseInt(that.total) === parseInt(that.proList.length) && parseInt(that.total) > 0) {
              that.loading = true
            }
          } else {
            that.loading = true
          }
        }
      })
      // this.$refs.loadmore.onBottomLoaded()
    }
    // ...mapMutations({
    //   setNum: 'SET_NUM'
    // }),
    // todetail() {
    //   this.$router.togo('/Home/Detail')
    // }
  }
  // computed: {
  //   ...mapGetters(['number']),
  //   ...mapState({
  //     number: state => state.home.number
  //   })
  // }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .type_bg {
    // padding-bottom: 0.98rem;
    // height: 100vh;
    .fixed_top {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 100;

      .type_header {
        padding: 0.1rem 0.26rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f9f9f9;
        width: 93%;
        z-index: 50;

        .serach {
          width: 100%;
          height: 60/100rem;
          line-height: 60/100rem;
          border-radius: 50/100rem;
          background: #f5f5f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 26/100rem;

          .iconfont {
            color: #333;
            font-size: 0.4rem;
          }

          .search_input {
            font-size: 0.24rem;
            width: 100%;
            height: 60/100rem;
            display: inline-flex;
            background: transparent;
          }
        }
      }

      .type_fifter {
        background: #fff;
        display: flex;

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 0.68rem;
          width: 25%;
          line-height: 0.68rem;
          font-size: 0.28rem;
          color: #666;
          position: relative;

          i {
            color: #999;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            left: 73%;
          }

          .sort_asc {
            top: 58%;
            font-size: 0.4rem;
          }

          .sort_desc {
            top: 52%;
            font-size: 0.4rem;
          }
        }

        .icon_active {
          color: #fa7682;

          i {
            color: #fa7682;
          }
        }
      }
    }

    .red_list_head {
      height: 2.28rem;
    }

    .red_list {
      overflow: hidden;
      padding: 0 20/100rem;
      background: #fff;

      .chose_date {
        color: #686868;
        font-size: 28/100rem;
        margin-left: 26/100rem;
      }

      .red_pro {
        width: 346/100rem;
        background: #fff;
        text-align: center;
        float: left;
        margin-bottom: 24/100rem;

        .pro_img {
          img {
            width: 346/100rem;
            height: 346/100rem;
          }
        }

        .pro_info {
          width: 100%;

          .pro_title {
            font-size: 30/100rem;
            color: #333;
            margin-top: 10/100rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            height: 78/100rem;
            text-align: left;

            img {
              width: 88/100rem;
              height: 30/100rem;
            }

            .pro_level {
              width: 88/100rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              position: relative;
              height: 30/100rem;

              span {
                font-size: 16/100rem;
                color: #fefefe;
                position: absolute;
                left: 44%;
                top: 50%;
                transform: translate(-50%, -50%);
                white-space: nowrap;
              }

              .iconfont {
                color: #ff8d97;
                display: inline-flex;
              }

              span {
                color: #fff;
                font-size: 22/100rem;
              }
            }
          }

          .pro_spec {
            text-align: left;
            margin-top: 10/100rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .pro_price {
              width: 100%;

              .peo_nowprice {
                color: #ff8d97;
                font-size: 32/100rem;
                font-weight: bold;
              }

              .pro_integral {
                font-size: 32/100rem;
                font-weight: bold;
                color: #ff8d97;
              }

              .pro_inter_img {
                display: inline-flex;
                align-items: flex-end;

                .iconfont {
                  font-size: 32/100rem;
                  color: #ff8d97;
                  display: inline-flex;
                  font-weight: bold;
                }
              }

              .pro_orig {
                font-size: 24/100rem;
                color: #888;
              }

              .pro_bg {
                background: #ff8d97;
                color: #fff;
                border-radius: 8/100rem;
                text-align: center;
                font-size: 20/100rem;
                margin-right: 10/100rem;
                padding: 0 8/100rem;
              }

              .line {
                text-decoration: line-through;
              }

              .pro_count {
                font-size: 23/100rem;
                color: #888;
              }
            }

            .pro_btn {
              margin-right: 4/100rem;
              display: flex;
              border-radius: 6/100rem;

              button {
                width: 170/100rem;
                height: 52/100rem;
                background: #ff8d97;
                color: #fff;
                font-size: 26/100rem;
                padding: 0/100rem 20/100rem;
                line-height: 52/100rem;
                border-radius: 50/100rem;
              }

              button::after {
                border: none;
              }
            }
          }

          .pro_other {
            display: flex;
            justify-content: space-between;
            font-size: 23/100rem;
            color: #999;
            padding: 0 26/100rem;
            padding-bottom: 10/100rem;
          }
        }
      }

      .red_pro:nth-child(odd) {
        float: left;
      }

      .red_pro:nth-child(even) {
        float: right;
      }
    }

    /* 筛选 */

    .fifter_more_bg {
      position: fixed;
      top: 0/100rem;
      z-index: 150;
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      height: 100%;
    }

    .fifter_more {
      position: fixed;
      width: 640/100rem;
      height: 100%;
      background: #f2f2f2;
      top: 0;
      right: 0;
      z-index: 152;
    }

    .fifter_more .fifter_price {
      padding-top: 36/100rem;
      height: 155/100rem;
      background: #fff;
      padding-right: 26/100rem;
      margin-bottom: 20/100rem;
    }

    .fifter_price div {
      margin-left: 30/100rem;
      height: 50/100rem;
      line-height: 50/100rem;
      display: flex;
      align-items: center;
      margin-top: 30/100rem;
    }

    .fifter_price input {
      width: 270/100rem;
      height: 50/100rem;
      line-height: 50/100rem;
      border-radius: 50/100rem;
      background: #f1f2f6;
      display: inline-block;
      text-align: center;
      font-size: 26/100rem;
    outline: none;

    }

    .fifter_price .input-placeholder {
      color: #c3c3c3;
      font-size: 26/100rem;
      text-align: center;
    }

    .fifter_price div i {
      line-height: 50/100rem;
      color: #000;
      margin: 0 10/100rem;
    }

    .fifter_price span {
      font-size: 30/100rem;
      color: #333;
      margin-left: 30/100rem;
      display: block;
    }

    .fifter_more .fifter_other {
      background: #fff;
      padding-bottom: 20/100rem;
    }

    .fifter_other .fifter_info {
      padding-top: 30/100rem;
    }

    .fifter_info .fifter_head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 26/100rem;
    }

    .fifter_head span {
      font-size: 30/100rem;
      /* font-weight: bold; */
      color: #333;
    }

    .fifter_head div {
      display: inline-flex;
      align-items: center;
    }

    .fifter_head div span {
      color: #939393;
      margin-right: 10/100rem;
    }

    .fifter_head div i {
      display: inline-flex;
      align-items: center;
      font-size: 26/100rem;
      color: #939393;
    }

    .fifter_head div .icon_open {
      transform: rotate(180deg);
    }

    .fifter_options {
      margin-top: 20/100rem;
      padding-left: 26/100rem;
    }

    .fifter_options_hidden {
      height: 80/100rem;
      overflow: hidden;
    }

    .fifter_options span {
      width: 126/100rem;
      height: 50/100rem;
      line-height: 50/100rem;
      padding: 0 16/100rem;
      text-align: center;
      font-size: 24/100rem;
      color: #6c6c6c;
      background: #f1f2f5;
      border-radius: 50/100rem;
      display: inline-block;
      margin: 10/100rem 0;
      margin-right: 45/100rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .fifter_options .chose_text {
      background: #ff8d97;
      color: #fff;
    }

    .fifter_more .fifter_more_btn {
      box-shadow: 0/100rem -4/100rem 20/100rem -6/100rem #a2a2a2;
      height: 75/100rem;
      display: flex;
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    .fifter_more_btn button {
      width: 50%;
      height: 75/100rem;
      color: #2b2b2b;
      background: #fff;
      font-size: 30/100rem;
      /* font-weight: bold; */
      line-height: 75/100rem;
      border-radius: 0;
      margin: 0;
    }

    .fifter_more_btn .btn_red {
      background: #ff8d97;
      color: #fff;
    }

    .fifter_more_btn button::after {
      border: none;
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

    .red_list_null {
      text-align: center;
      font-size: 30/100rem;
      padding: 20/100rem 0;
    }
  }

</style>
