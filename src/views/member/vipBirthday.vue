<template>
  <div style='background:#0d4dae'>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='my_vip' v-if="isShow" :style="{height:vipHeight+'rem'}">
      <div class='vip_bg'>
        <img :src="vipBg" class="vip_bg_01" />
      </div>
      <div class='vip_body'>
        <img src='@/assets/img/member/b_top.png' class="list_img" />
        <div class='vip_list_bg'>
          <div class='vip_list'>
            <div class='vip_pro' v-for="(item,index) in vipList" :key="index">
              <div class='pro_img' @click='goPro(item.goods_id)' id="item.goods_id">
                <img :src="item.img" />
              </div>
              <div class='pro_info'>
                <div class='pro_title' @click='goPro(item.goods_id)' id="item.goods_id">{{item.name}}</div>
                <div class='pro_spec'>
                  <div class='pro_price'>
                    <div style='display:flex;align-items:center;'>
                      <div class='pro_inter_img' v-if="item.deal_type!=1">
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if="item.deal_type==2||item.deal_type==3">{{item.point}}</span>
                      <span class='pro_integral' v-if="item.deal_type>=4">{{item.point}}</span>
                      <span class='pro_integral' v-if="item.deal_type>=4">+</span>
                      <div class='peo_nowprice' v-if="item.deal_type==1">
                        <span>￥{{item.price_sell}}</span>
                      </div>
                      <div class='peo_nowprice' v-if="item.deal_type>=4">
                        <span>￥{{item.price_sell}}</span>
                      </div>
                    </div>
                    <div class='pro_orig'>
                      <div style='display:inline-flex;align-items:center;'>
                        <span class='nowprice'>{{item.price_market_from}} </span>
                        <span class='nowprice line'>￥{{item.price_market}} </span>
                      </div>
                      <div class='pro_btn'>
                        <mt-button size='small' @click='goPro(item.goods_id)'>立即兑换</mt-button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <img src='@/assets/img/member/b_bottom.png' class="list_img" />
      </div>
    </div>
    <div class='goIndex' @click="goIndex('/index')">
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
    Toast
  } from 'mint-ui'
  import {
    getBirthdayList
  } from '@/api/index'
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
    name: 'Birthday',
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
        h_title: '生日专区',
        isShow: false,
        page: 1,
        pagesize: 100,
        vipList: [],
        vipBg: null,
        // type: 'member',
        type: 'birthday',
        vipHeight: 0
      }
    },
    mounted() {
      Indicator.open('加载中...')
      this.getList()
      // console.log(this.$route.query)
    },
    methods: {
      goTop() {
        console.log('回到顶部')
        document.getElementById('coll').scrollIntodiv({
          block: 'start',
          behavior: 'smooth'
        })
      },
      getList: function () {
        var that = this
        let info = {
          type: that.type,
          page: that.page,
          pagesize: that.pagesize
        }
        getBirthdayList(info).then(res => {
          Indicator.close()
          that.isShow = true
          if (res.isSuccess) {
            that.h_title = res.data.title
            that.vipList = res.data.list.rows
            that.vipBg = res.data.birthday_bgimg
            that.$nextTick(() => {
              that.vipHeight = document.querySelector('.vip_body').offsetHeight / 50 + 4.6
            })
            //   console.log(document.querySelector('.vip_body').offsetHeight/50+4.6)
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      },
      goPro(id) {
        this.$router.togo({
          path: '/proDetail?type=birthday&id=' + id
        })
      },
      goIndex(url) {
        this.$router.togo({
          path: url
        })
      }
    }
  }

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .my_vip {
    background: #0d4dae;
    width: 100%;
    //   height: 100%;
  }

  .vip_header {
    text-align: center;
    background: #f7f7f7;
    height: 94/100rem;
    line-height: 94/100rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 50;
  }

  .vip_header icon {
    float: left;
    padding-left: 26/100rem;
    color: #5d5d5d;
  }

  .vip_header text {
    color: #393939;
    font-size: 38/100rem;
    margin-left: -26/100rem;
  }

  .vip_bg .vip_bg_01 {
    position: absolute;
    width: 100%;
    //   height: 100%;
  }

  .vip_bg .vip_top_img {
    position: absolute;
    width: 570/100rem;
    height: 420/100rem;
    top: 700/100rem;
    left: 52%;
    transform: translateX(-50%);
    z-index: 30;
  }

  .vip_title {
    display: flex;
    /* justify-content: center; */
    text-align: center;
    padding: 20/100rem 0;
  }

  .vip_title text {
    width: 50%;
    color: #fff;
    font-size: 38/100rem;
  }

  .vip_body {
    position: absolute;
    /* top: 1060/100rem; */
    top: 460/100rem;
    width: 100%;
    //   background: #0d4dae;
    /* background: #1152b0;  */
    overflow: hidden;
    //   margin-bottom: 100/100rem;
    /* padding-bottom: 40/100rem; */
    /* background: #0d4fcd; */
  }

  .list_img {
    width: 100%;
    /* margin-bottom: -10/100rem; */
    /* opacity: 0.5; */
  }

  .vip_list_bg {
    margin-top: -12/100rem;
    overflow: hidden;
    /* opacity: 0.5; */
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAABkCAYAAADZqbVdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDU0Nzc1QjA5QkI4MTFFOEFGMjU4MkFGQzJBQ0JFOUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDU0Nzc1QjE5QkI4MTFFOEFGMjU4MkFGQzJBQ0JFOUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENTQ3NzVBRTlCQjgxMUU4QUYyNTgyQUZDMkFDQkU5RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENTQ3NzVBRjlCQjgxMUU4QUYyNTgyQUZDMkFDQkU5RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlKqrTIAAAI8SURBVHja7NZBCkFBHMDheRKlHMDG0sYdXjY2cg9ncAI3cAdLW2sLLsDSwsIF9MTCIE+xYPWU8n31b6ampqnZ/JIYY3ho1IZJvn1e381NKd+/rNnhdJzOBpNOt5WGgqy3+3C+vrXdrAcAACjK6tqZ8QuduZhvlr103K9Uy+XkXs/n/Ch+mMd52GWj+HxfyVcBAMDvE+4AACDcAQAA4Q4AAMIdAAAQ7gAAgHAHAADhDgAACHcAAEC4AwCAcAcAAIQ7AAAIdwAAQLgDAADCHQAAhDsAACDcAQAA4Q4AAMIdAAAQ7gAAgHAHAADhDgAACHcAABDuAACAcAcAAIQ7AAAIdwAAQLgDAADCHQAAhDsAACDcAQBAuAMAAMIdAAAQ7gAAINwBAADhDgAACHcAABDuAACAcAcAAIQ7AAAIdwAAQLgDAIBwBwAAhDsAACDcAQBAuAMAAMIdAAAQ7gAAINwBAADhDgAAwh0AABDuAACAcAcAAOEOAAAIdwAAQLgDAIBwBwAAhDsAACDcAQBAuAMAAMIdAACEOwAAINwBAADhDgAAwh0AABDuAACAcAcAAOEOAAAIdwAAEO4AAIBwBwAAhDsAAAh3AABAuAMAAMIdAACEOwAAINwBAADhDgAAwh0AABDuAAAg3AEAAOEOAAAIdwAAEO4AAIBwBwAAhDsAAAh3AABAuAMAgHAHAACEOwAAINwBAEC4AwAAwh0AABDuAAAg3AEAAOEOAAAIdwAAEO4AAIBwBwCAf3IRYAApYijFuCPbPAAAAABJRU5ErkJggg==);
    background-size: 100%;
    background-repeat: repeat-y;
  }

  .vip_list {
    height: 100%;
    padding: 0 30/100rem;
  }

  .vip_list .chose_date {
    color: #686868;
    font-size: 28/100rem;
    margin-left: 26/100rem;
    font-family: 'DIN';
  }

  /* 订单商品信息 */

  .vip_list .vip_pro {
    /* height: 262/100rem; */
    display: flex;
    align-items: center;
    /* padding: 10/100rem 40/100rem; */
    padding: 40/100rem;
    padding-bottom: 10/100rem;
    /* padding-bottom: 70/100rem; */
  }

  .vip_pro .pro_img {
    float: left;
    /* margin-top: 40/100rem; */
    /* margin-left: 18/100rem; */
    margin-right: 36/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 190/100rem;
  }

  .pro_img .pro_tips {
    width: 190/100rem;
    height: 52/100rem;
    background: rgba(0, 0, 0, 0.6);
    line-height: 52/100rem;
    text-align: center;
    position: absolute;
    bottom: 0;
  }

  .pro_tips text {
    color: #fff;
    font-size: 24/100rem;
  }

  .vip_pro .pro_info {
    width: 400/100rem;
  }

  .pro_info .pro_title {
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pro_info .pro_spec {
    overflow: hidden;
    /* margin-top: 20/100rem; */
    /* height: 82/100rem; */
    /* display: flex;
  align-items: center;
  justify-content: space-between; */
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    /* width: 226/100rem; */
    margin-top: 10/100rem;

  }

  .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff8d97;
    /* font-weight: bold; */
    /* margin-left: 8/100rem; */
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    /* margin-left: 9/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 40/100rem;
    display: inline-flex;
    color: #ff8d97;
  }

  .pro_price .pro_orig {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pro_price .pro_orig .nowprice {
    font-size: 24/100rem;
    color: #b8b8b8;
    /* margin-left: 8/100rem; */
  }

  .pro_price .pro_orig .line {
    text-decoration: line-through;
  }

  .pro_spec .pro_btn {
    display: flex;
    border-radius: 6/100rem;
  }

  .pro_btn button {
    width: 150/100rem;
    /* height: 52/100rem; */
    background: #ff8d97;
    color: #fff;
    font-size: 26/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 1.8;
    border-radius: 18/100rem;
  }

  .pro_btn button::after {
    border: none;
  }

</style>
