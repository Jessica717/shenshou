<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div style='height:0.9rem' id='coll'></div>
    <return-top @returnTop='goTop'></return-top>
    <div class='my_collection' v-if='isShow'>
      <div class='coll_header'>
        <span>共有<span class='coll_num'>{{total}}</span>件商品</span>
        <span class='coll_edit' @click='edit' :hidden='isEdit'>编辑</span>
        <span class='coll_edit' @click='edit' :hidden='!isEdit'>完成</span>
      </div>
      <div class='coll_body'>
        <div class='editDel' v-if='isEdit'>
          <div class='allCheck'>
            <div class='checkbox'>
              <input v-model='allchose' :checked="allchose==true" id='all' type='checkbox' @click="checkAll" />
              <label for="all"></label>
            </div>
            <span>全选</span>
          </div>
          <mt-button size='small' @click='delColl'>删除</mt-button>
        </div>
        <!-- <mt-loadmore class='coll_list' :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false'
          :bottomDistance='100' :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'"> -->
          <div class='coll_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30"  >
          <div class='coll_pro' v-for="(item,index) in collList" :key="index">
            <div class='pro_chose' v-if='isEdit'>
              <input v-model="item.checked" :id='item.id' type='checkbox' @click="chose(item)" />
              <label :for="item.id"></label>
            </div>
            <div class='pro_img' @click="goPro(item.goods_id,'/proDetail?type=normal')">
              <img :src='item.img' />
              <div class='pro_tips' :hidden='!item.isExpired'>
                <span>已过期</span>
              </div>
            </div>
            <div :class="isEdit==false?'pro_info':'pro_info pro_info_edit'">
              <div class='pro_title' @click="goPro(item.goods_id,'/proDetail?type=normal')">
                <div class='pro_level' v-if='item.promotion==1'>
                  <img src='@/assets/img/member/cu.png' />
                  <span>限时购</span>
                </div>
                {{item.name}}
              </div>
              <div class='pro_spec'>
                <div class='pro_price'>
                  <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}} </span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>+</span>
                  <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>
                <div class='pro_icon' @click="goPro(item.goods_id,'/proDetail?type=normal')">
                  <img src='@/assets/img/member/red_car.png' />
                </div>
              </div>
            </div>
          </div>
          <div class='coll_list_null' v-if='collList.length<=0'>暂无数据</div>
          <div class='order-foot' v-if='loading&&collList.length>0'>
            <span>—————— 我是有底线的 ——————</span>
          </div>
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <!-- <button type="default" size="default" loading plain :hidden='collList.length==total' style="border:none;background:#f2f2f2">加载中...</button> -->
        </mt-loadmore>
        </div>
        <div class='null_height'></div>
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
  Toast,
  MessageBox
} from 'mint-ui'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
import {
  getMyCollList,
  delCollList,
  getProDetail
} from '@/api/index'
export default {
  name: 'MyColl',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    MessageBox
  },
  data() {
    return {
      h_title: '我的收藏',
      newNews: false,
      total_amout: 0,
      isShow: false,
      page: 1,
      limit: 5,
      total: 0,
      collList: [],
      delList: [],
      allchose: false,
      isEdit: false,
      loading: true,
      screenHeight: (document.documentElement.clientHeight - 130) / 50
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取我的收藏列表
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goPro(id, link) {
      var that = this
      if (id !== '') {
        let info = {
          id: id,
          type: 'normal'
        }
        getProDetail(info).then(res => {
          if (res.isSuccess) {
            that.$router.togo({
              path: link + '&id=' + id
            })
          } else {
            Toast({
              message: res.msg,
              duration: 2000
            })
          }
        })
      }
    },
    edit: function () {
      for (var j = 0; j < this.collList.length; j++) {
        this.collList[j].checked = false
      }
      this.isEdit = !this.isEdit
    },
    delColl: function () {
      var that = this
      if (that.delList.length === 0) {
        Toast({
          message: '请选择要操作的数据',
          duration: 1000
        })
      } else {
        let plus = window.plus
        if (window.plus) {
          plus.nativeUI.confirm('是否删除选中内容?', function (e) {
            console.log('Close confirm: ' + e.index)
            if (e.index === 0 || e.index === '0') {
              delCollList(that.delList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: '删除成功',
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.page = 1
                  that.allchose = false
                  that.collList = []
                  that.getList()
                } else {
                  Toast({
                    message: res.msg,
                    duration: 1000
                  })
                }
              })
            } else {
              console.log('用户点击取消')
            }
          }, {
            'title': '提示',
            'buttons': ['确定', '取消'],
            'verticalAlign': 'center'
          })
        } else {
          MessageBox({
            title: '提示',
            message: '是否删除选中内容?',
            showCancelButton: true,
            closeOnClickModal: false
          }).then(res => {
            if (res === 'confirm') {
              delCollList(that.delList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: '删除成功',
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.page = 1
                  that.allchose = false
                  that.collList = []
                  that.getList()
                } else {
                  Toast({
                    message: res.msg,
                    duration: 1000
                  })
                }
              })
            }
          })
        }
      }
    },
    chose(event) {
      event.checked = !event.checked
      this.delList = []
      for (let j = 0; j < this.collList.length; j++) {
        if (this.collList[j].checked) {
          this.delList.push(this.collList[j].id)
        }
      }
      let status = this.collList.every(x => x.checked)
      if (status) {
        this.allchose = true
      } else {
        this.allchose = false
      }
    },
    checkAll() {
      this.delList = []
      console.log(this.allchose)
      if (this.allchose === false) {
        for (let j = 0; j < this.collList.length; j++) {
          this.collList[j].checked = true
          this.delList.push(this.collList[j].id)
        }
        this.allchose = true
      } else {
        for (let j = 0; j < this.collList.length; j++) {
          this.collList[j].checked = false
        }
        this.delList = []
        this.allchose = false
      }
    },
    getList() {
      var that = this
      let info = {
        page: that.page,
        limit: that.limit
      }
      getMyCollList(info).then(res => {
        that.isShow = true
        Indicator.close()
        if (res.isSuccess) {
          for (var j = 0; j < res.data.rows.length; j++) {
            res.data.rows[j].checked = false
          }
          that.collList = res.data.rows
          that.total = res.data.total
          that.loading = false
          setTimeout(function () {
            if ((parseInt(that.total) === parseInt(that.collList.length) && parseInt(that.total) > 0) ||
                parseInt(that.total) === 0) {
              that.loading = true
              // document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            } else {
              // document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
            }
          }, 100)
        }
      })
    },
    loadMore() {
      var that = this
      that.loading = true
      let info = {
        page: ++that.page,
        limit: that.limit
      }
      getMyCollList(info).then(res => {
        that.isShow = true
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.rows !== null && res.data.rows.length > 0) {
            for (var j = 0; j < res.data.rows.length; j++) {
              res.data.rows[j].checked = false
            }
            that.collList = that.collList.concat(res.data.rows)
            that.total = res.data.total
            that.loading = false
            // if (parseInt(that.total) === parseInt(that.collList.length) && parseInt(that.total) > 0) {
            //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
            // }
          } else {
            that.loading = true
          }
        }
      })

      // this.$refs.loadmore.onBottomLoaded()
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .my_collection {
    font-family: SimHei;
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .coll_header {
    text-align: center;
    background: #ebebeb;
    height: 86/100rem;
    line-height: 86/100rem;
    display: flex;
    justify-content: space-between;
  }

  .coll_header span {
    padding-left: 26/100rem;
    color: #515151;
    font-size: 24/100rem;
  }

  .coll_header .coll_num {
    color: #ff8d97;
    font-size: 26/100rem;
    padding-left: 0;
  }

  .coll_header .coll_edit {
    float: right;
    padding-right: 26/100rem;
    color: #ff8d97;
    font-size: 24/100rem;
  }

  .coll_body {
    height: 100%;
  }

  .coll_body .editDel {
    height: 92/100rem;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 92/100rem;
    width: 100%;
    z-index: 50;
  }

  .editDel .allCheck {
    margin-left: 26/100rem;
    font-size: 26/100rem;
    color: #555;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .editDel .allCheck .checkbox {
    position: relative;
    margin-right: 0.12rem;
    margin-top: -0.1rem;
  }

  .editDel button {
    margin: 0;
    color: #ff8d97;
    background: transparent;
    border-radius: 32/100rem;
    border: 2/100rem solid #ff8d97;
    margin-right: 26/100rem;
  }

  .editDel button::after {
    border: 2/100rem solid transparent;
  }

  .coll_list {
    max-height: calc(100vh - 2.36rem);
    overflow: scroll;
  }

  /* 订单商品信息 */

  .coll_list .coll_pro {
    padding: 0 26/100rem;
    height: 220/100rem;
    background: #fff;
    margin-bottom: 20/100rem;
    display: flex;
    align-items: center;
    /* border-bottom: 1px solid #ebebeb; */
  }

  .coll_pro .pro_chose {
    // float: left;
    // display: flex;
    // align-items: center;
    // height: 262/100rem;
    // margin-left: 12/100rem;
    position: relative;
  }

  .coll_pro .pro_img {
    float: left;
    /* margin-top: 40/100rem; */
    margin-left: 18/100rem;
    margin-right: 30/100rem;
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

  .pro_tips span {
    color: #fff;
    font-size: 24/100rem;
  }

  .coll_pro .pro_info {
    float: left;
    width: 490/100rem;
  }

  .coll_pro .pro_info_edit {
    width: 440/100rem;
  }

  .pro_info .pro_title {
    /* width: 440/100rem; */
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pro_title img {
    width: 88/100rem;
    height: 30/100rem;
  }

  .pro_title .pro_level {
    width: 88/100rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 30/100rem;
  }

  .pro_title .pro_level span {
    font-size: 16/100rem;
    color: #fefefe;
    position: absolute;
    left: 43%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }

  .pro_info .pro_spec {
    width: 100%;
    /* width: 440/100rem; */
    overflow: hidden;
    margin-top: 20/100rem;
    height: 64/100rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    width: 280/100rem;
    display: flex;
    align-items: center;
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
  }

  .pro_price .pro_inter_img {
    display: flex;
    align-items: flex-end;
    /* margin-right: 6/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 26/100rem;
    display: inline-flex;
    color: #ff8d97;
    font-weight: bold;
  }

  .pro_price .pro_orig {
    font-size: 22/100rem;
    color: #7c7c7c;
    text-decoration: line-through;
  }

  .pro_spec .pro_icon {
    margin-right: 4/100rem;
    display: flex;
  }

  .pro_icon img {
    width: 50/100rem;
    height: 46/100rem;
  }

  .pro_icon button {
    width: 170/100rem;
    height: 52/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 26/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 52/100rem;
    border-radius: 50/100rem;
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

  .coll_list_null {
    text-align: center;
    font-size: 30/100rem;
    /* font-weight: bold; */
    padding: 20/100rem 0;
    color: #999;
  }

  .more_load {
    display: flex;
    justify-content: center;
  }

  /* 空白的块，解决底部导航占领高度 */

  .null_height {
    height: 106/100rem;
  }

  input[type="checkbox"] {
    width: 34/100rem;
    height: 34/100rem;
    opacity: 0;
  }

  label {
    position: absolute;
    left: 5/100rem;
    top: 8/100rem;
    width: 34/100rem;
    height: 34/100rem;
    // border-radius: 50%;
    border: 2/100rem solid #7c7c7c;
    border-radius: 50%;
  }

  /*设置选中的input的样式*/
  /* + 是兄弟选择器,获取选中后的label元素*/
  input:checked+label {
    background-color: #ff8d97;
    border: 2/100rem solid #ff8d97;
  }

  input:checked+label::after {
    position: absolute;
    content: "";
    width: 0.1rem;
    height: 0.24rem;
    top: 0;
    left: 0.11rem;
    border: 0.04rem solid #fff;
    border-top: none;
    border-left: none;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

</style>
