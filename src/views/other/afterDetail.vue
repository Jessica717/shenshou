<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='sale_after'>
      <div class='after_head'>
        <span>本次售后服务由</span>
        <span class='name'>公主购</span>为您提供
      </div>
      <div class='after_pro'>
        <div class='title'>订单编号：{{orderInfo.order_id}}</div>
        <div class='car_pro'>
          <div class='pro_img'>
            <img :src='orderInfo.img' v-if="orderInfo.img!=null&&orderInfo.img!=''" />
            <img src='@/assets/img/pro/static.png' v-else />
          </div>
          <div class='pro_info'>
            <div class='pro_title'>
              <span>{{orderInfo.name}}</span>
            </div>
            <div class='pro_spec'>
              <div class='pro_price'>
                <div class='spec_info' v-if="orderInfo.title!=''&&orderInfo.title!=null">规格:{{orderInfo.title}}</div>
                <div style='display:flex;align-items:center;'>
                  <span class='peo_nowprice' v-if='orderInfo.price>0'>￥{{orderInfo.price}}+</span>
                  <div class='pro_inter_img' v-if='orderInfo.point>0'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='orderInfo.point>0'>{{orderInfo.point}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='after_progress'>
        <div class='title'>售后进度</div>
        <div class='progress_info'>
          <div class='step' v-if='orderInfo.flag>=-1'>
            <i class='iconfont icon-duigoudaibiankuang'></i>
            <span>提交申请</span>
          </div>
          <div class='step_line' v-if='orderInfo.flag>=-1'>
            <i class='iconfont icon-progress'></i>
          </div>
          <div class='step' v-if='orderInfo.flag==-1'>
            <i class="iconfont icon-bohui" style='color:red'></i>
            <span style='color:red'>已驳回</span>
          </div>
          <div class='step' v-if='orderInfo.flag>=1'>
            <i :class="orderInfo.flag>=2?'iconfont icon-duigoudaibiankuang':'iconfont icon-wait'"></i>
            <span>等待审核</span>
          </div>
          <div class='step_line' v-if='orderInfo.flag>=2'>
            <i class='iconfont icon-progress'></i>
          </div>
          <div class='step' v-if='orderInfo.flag>=2'>
            <i :class="orderInfo.flag>=3?'iconfont icon-duigoudaibiankuang':'iconfont icon-wait'"></i>
            <span v-if="orderInfo.refund_info.type=='refunds'">退款</span>
            <span v-else>确认收货</span>
          </div>
          <div class='step_line' v-if='orderInfo.flag>=3'>
            <i class='iconfont icon-progress'></i>
          </div>
          <div class='step' v-if='orderInfo.flag>=3'>
            <i :class="orderInfo.flag==3?'iconfont icon-duigoudaibiankuang':'iconfont icon-wait'"></i>
            <span>完成</span>
          </div>
        </div>
      </div>
      <div class='prob_descr'>
        <div class='title'>
          问题描述
        </div>
        <div class='after_com' v-if='orderInfo.flag!=0'>
          <span>{{orderInfo.refund_info.content}}</span>
          <div class='com_imgList'>
            <div class='imgBlock' v-for="(item,index) in orderInfo.refund_info.img" :key="index">
              <img :src='item' @click="previewImg(item)" />
            </div>
          </div>
        </div>
      </div>
      <div class='prob_descr' v-if='orderInfo.flag==-1'>
        <div class='title'>驳回理由</div>
        <div class='after_com'>
          <span>{{orderInfo.refund_info.reject_reason}}</span>
        </div>
      </div>
      <div class='after_info'>
        <div class='title'>售后信息</div>
        <div class='after_info_list'>
          <div>
            <span>服务类型：</span>
            <span class='text_active' v-if="orderInfo.refund_info.type=='refunds'">退款</span>
            <span class='text_active' v-if="orderInfo.refund_info.type=='reship'">退货退款</span>
            <span class='text_active' v-if="orderInfo.refund_info.type=='barter'">换货</span>
          </div>
          <div>
            <span>申请时间：</span>
            <span class='text_active'>{{orderInfo.refund_info.create_time}}</span>
          </div>
          <div v-if="orderInfo.refund_info.type!='refunds'&&orderInfo.flag>=2">
            <span>卖家留言：</span>
            <span class='text_active'>{{orderInfo.refund_info.reject_reason}}</span>
          </div>
          <div v-if="orderInfo.refund_info.type!='refunds'&&orderInfo.refund_info.express!=''">
            <span>快递公司：</span>
            <span>{{track_name}}</span>
          </div>
          <div v-if="orderInfo.refund_info.type!='refunds'&&orderInfo.refund_info.express_no!=''">
            <span>快递单号：</span>
            <span>{{track_number}}</span>
          </div>
        </div>
      </div>

      <div class='comBtn' v-if='flag>=0&&flag<3'>
        <span @click='afterSale(pid,order_Id)' v-if="orderInfo.refund_info.type!='refunds'&&orderInfo.flag==2&&orderInfo.refund_info.express==''">填写物流</span>
        <span @click='afterSale(pid,order_Id)' v-else>修改申请</span>
        <span @click='afterCancel(pid,order_Id)'>取消申请</span>
      </div>
      <div class='comBtn' v-if='flag==-1&&orderInfo.is_apply==0'>
        <span @click='afterSale(pid,order_Id)'>重新申请</span>
      </div>
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
  Toast,
  MessageBox
} from 'mint-ui'
import {
  getAfterPro,
  cancelAfter
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
  name: 'name',
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
      h_title: '售后详情',
      procomm: '',
      track_name: '',
      track_number: '',
      uploadimg: [],
      uploadOk: false,
      imgShow: false,
      img_show_big: '',
      tempFilePaths: [],
      imgs: [],
      ischose: '',
      pid: '',
      order_Id: '',
      orderInfo: {
        refund_info: {}
      },
      flag: 0,
      order_type: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    this.pid = options.pid
    this.order_Id = options.orderId
    this.order_type = options.order_type
    this.getInfo()
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
        order_id: that.order_Id,
        product_id: that.pid
      }
      getAfterPro(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.orderInfo = res.data
          that.ischose = res.data.refund_info.type === undefined ? 'refunds' : res.data.refund_info.type
          that.imgs = res.data.refund_info.img === undefined ? [] : res.data.refund_info.img
          that.flag = res.data.flag
          that.track_name = res.data.refund_info.express === undefined ? '' : res.data.refund_info.express
          that.track_number = res.data.refund_info.express_no === undefined ? '' : res.data.refund_info.express_no
        }
      })
    },
    afterSale(pid, orderid) {
      this.$router.togo({
        path: '/saleAfter?pid=' + pid + '&orderId=' + orderid + '&order_type=' + this.order_type
      })
    },
    previewImg(url) {
      this.imgShow = true
      this.img_show_big = url
    },
    hiddenImg() {
      this.imgShow = false
    },
    afterCancel(pid, orderid) {
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('是否确定取消当前售后申请？', function(e) {
          console.log('Close confirm: ' + e.index)
          if (e.index === 0 || e.index === '0') {
            let info = {
              order_id: orderid,
              product_id: pid
            }
            cancelAfter(info).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '成功取消',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.$router.back()
                }, 1000)
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
          message: '是否确定取消当前售后申请？',
          showCancelButton: true,
          closeOnClickModal: false
        }).then(res => {
          if (res === 'confirm') {
            let info = {
              order_id: orderid,
              product_id: pid
            }
            cancelAfter(info).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '成功取消',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.$router.back()
                }, 1000)
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
        })
      }
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .sale_after {
    padding-bottom: 30px;
  }

  .detail_title {
    background: #ff8d97;
    height: 60/100rem;
    line-height: 60/100rem;
    color: #fff;
    font-size: 40/100rem;
    padding: 0 26/100rem;
  }

  .after_head {
    font-size: 26/100rem;
    text-align: center;
    background: #f2f2f2;
    height: 50/100rem;
    color: #808080;
    line-height: 50/100rem;
  }

  .after_head .name {
    color: #ff8d97;
    margin: 0 8/100rem;
  }

  .title {
    font-size: 28/100rem;
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 16/100rem;
  }

  /* 售后产品 */

  .after_pro {
    background: #fff;
    padding: 16/100rem 26/100rem;
    margin-bottom: 26/100rem;
  }

  .after_pro .car_pro {
    /* height: 262/100rem; */
    display: flex;
    align-items: center;
    padding-top: 26/100rem;
  }

  .car_pro .pro_img {
    float: left;
    /* margin-left: 18/100rem; */
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 186/100rem;
  }

  .car_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 26/100rem;
    color: #444;
    /* margin-top: 30/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pro_title .title_icon {
    background: #ff8d97;
    height: 26/100rem;
    /* width: 48/100rem; */
    font-size: 20/100rem;
    color: #fff;
    border-radius: 8/100rem;
    line-height: 26/100rem;
    text-align: center;
    display: inline-block;
    margin-right: 10/100rem;
    padding: 0 6/100rem;
  }

  .pro_info .pro_spec {
    overflow: hidden;
    /* height: 64/100rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14/100rem;
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    width: 240/100rem;
  }

  .pro_price .peo_nowprice {
    color: #ff8d97;
    font-size: 30/100rem;
    /* font-weight: bold; */
    margin-right: 10/100rem;
  }

  .pro_price .pro_integral {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #ff8d97;
    margin-left: 8/100rem;
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: flex-end;
    /* margin-left: 20/100rem; */
    /* margin-right: 30/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #ff8d97;
    display: inline-flex;
  }

  /* .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

  .pro_price .pro_orig {
    font-size: 24/100rem;
    color: #b8b8b8;
    text-decoration: line-through;
  }

  .pro_price .spec_info {
    font-size: 20/100rem;
    color: #999;
  }

  .pro_weight span {
    font-size: 20/100rem;
    color: #888;
    font-weight: 'DIN';
  }

  .pro_spec .pro_btn {
    display: inline-flex;
    align-items: center;
  }

  .pro_spec .pro_btn button {
    min-width: 150/100rem;
    height: 52/100rem;
    border: 1px solid #808080;
    color: #808080;
    background: transparent;
    font-size: 24/100rem;
    padding: 0/100rem 20/100rem;
    line-height: 52/100rem;
    border-radius: 18/100rem;
  }

  .pro_spec .pro_btn button::after {
    border: none;
  }

  /* 售后进度 */

  .after_progress {
    background: #fff;
    padding: 16/100rem 26/100rem;
    margin-bottom: 26/100rem;
  }

  .after_progress .progress_info {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16/100rem;
  }

  .progress_info .iconfont {
    color: #51c560;
    font-size: 40/100rem;
    font-weight: bold;
  }

  .progress_info .step {
    text-align: center;
  }

  .progress_info .step_line {
    margin: 0 10/100rem;
  }

  .progress_info .step span {
    display: block;
    font-size: 28/100rem;
    margin-top: 6px;
    color: #51c560;
  }

  /* 售后信息 */

  .after_info {
    background: #fff;
    padding: 16/100rem 26/100rem;
    margin-bottom: 26/100rem;
  }

  .after_info .after_info_list {
    padding: 16/100rem 0;
  }

  .after_info_list span {
    font-size: 26/100rem;
  }

  /* 问题描述 */

  .prob_descr {
    background: #fff;
    padding: 16/100rem 26/100rem;
    margin-bottom: 26/100rem;
  }

  .prob_descr .after_com {
    padding: 10/100rem 0;
    background: #fff;
  }

  .after_com span {
    font-size: 26/100rem;
  }

  .com_imgList {
    /* display: flex;
  justify-content: flex-start;
  align-items: center; */
    overflow: hidden;
    padding: 10/100rem 0;
  }

  .com_imgList .imgBlock {
    position: relative;
    margin: 10/100rem;
    /* display: inline-flex; */
    float: left;
  }

  .imgBlock .iconfont {
    position: absolute;
    top: -28/100rem;
    right: 0;
    color: #ff8d97;
    z-index: 20;
  }

  .imgBlock span {
    display: blcok;
    position: absolute;
    top: -3/100rem;
    right: 6/100rem;
    background: #fff;
    width: 20/100rem;
    height: 20/100rem;
    border-radius: 50%;
    z-index: 10;
  }

  .imgBlock img {
    width: 130/100rem;
    height: 130/100rem;
  }

  .com_imgList .addicon {
    font-size: 125/100rem;
    color: #a4a4a4;
  }

  .comBtn {
    margin-top: 30/100rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .comBtn span {
    width: 200/100rem;
    height: 60/100rem;
    line-height: 60/100rem;
    border: 1px solid #e4e4e4;
    background: #fff;
    color: #282828;
    font-size: 30/100rem;
    /* font-weight: bold; */
    border-radius: 20/100rem;
    text-align: center;
    margin-left: 20/100rem;
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
