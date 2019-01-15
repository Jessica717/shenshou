<template>
    <div>
      <common-header :h_title="h_title" :showback="true"></common-header>
      <return-top @returnTop='goTop'></return-top>
      <div style='height:0.9rem' id='track'></div>
      <div class='orderTrack'>
  <div class='o_t_body'>
    <div class='order_info'>
      <div>
        <!-- 运单号： -->
        订单号：
        <span>{{orderNo}}</span>
      </div>
      <div>
        国内承运人：
        <span>{{name}}</span>
      </div>
    </div>
    <div class='track_infos'>
      <div class='track_infos_info' v-for='(item,index) in list' :key='index'>
        <div class='track_time'>
          <span>{{item.AcceptTime}}</span>
        </div>
        <div class='track_status'>
          <div class='track_border'></div>
          <img src='@/assets/img/com/s_top1.png' class='t_states'/>
        </div>
        <div class='track_location'>
          <span>{{item.AcceptStation}}</span>
        </div>
      </div>
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
import {
  getOrderTrack
} from '@/api/index'
export default {
  name: 'OrderTrack',
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
      h_title: '物流详情',
      list: [],
      name: '',
      orderNo: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    this.orderNo = options.orderId
    this.getDetail()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('track').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getDetail() {
      var that = this
      getOrderTrack(this.orderNo).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.orderNo = res.LogisticCode
          that.list = res.Traces
          that.name = res.ShipperName
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~styles/index.less';
@import '~styles/variable.less';
.orderTrack {
  /* padding: 0 26/100rem; */
  /* font-family: SimHei; */
  background: #f2f2f2;
  overflow-x: hidden;
}

.o_t_body {
  /* background: #fff; */
}

.order_info {
  background: #fff;
  padding: 44/100rem 26/100rem;
}

.order_info div {
  color: #999;
  font-size: 28/100rem;
  margin: 18/100rem 0;
}

.order_info div span {
  color: #444;
  /* font-weight: bold; */
}

.track_infos {
  background: #fff;
  margin-top: 20/100rem;
  padding: 92/100rem 26/100rem;
  /* display: flex;
  align-items: flex-start; */
}

.track_infos .track_infos_info {
  height: 112/100rem;
  width: 702/100rem;
  display: flex;
  align-items: flex-start;
}

.track_infos_info .track_time {
  /* width: 80/100rem; */
  width: 124/100rem;
  font-size: 18/100rem;
  color: #757575;
  font-weight: bold;
  /* font-family: Arial; */
  float: left;
  text-align: right;
}

.track_infos_info .track_time .track_date {
  width: 80/100rem;
  font-family: 'DIN';
  display: block;
}

.track_infos_info .track_time .big_date {
  font-size: 28/100rem;
}

.track_infos_info .track_status {
  width: 94/100rem;
  color: #ccc;
  float: left;
  height: 112/100rem;
  position: relative;
}

.track_status .track_border {
  width: 4/100rem;
  height: 112/100rem;
  background: #ccc;
  margin: 0 auto;
}

.track_status img {
  position: absolute;
  left: 50%;
  top: -4/100rem;
  transform: translateX(-50%);
}

.track_status .t_states {
  width: 24/100rem;
  height: 24/100rem;
}

.track_status .t_active {
  width: 38/100rem;
  height: 38/100rem;
}

.track_status .t_hide {
  display: none;
}

.track_status .t_show {
  display: block;
}

.track_infos_info:last-child .track_border {
  display: none;
}

.track_infos_info .track_location {
  width: 490/100rem;
  font-size: 25/100rem;
  color: #858585;
  float: left;
}

.track_location .track_oprea {
  font-size: 28/100rem;
  display: block;
}

</style>
