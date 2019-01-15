<template>
  <div>
    <common-header :h_title="h_title" :bgcolor='head_color' :showback="false"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div class='goIndex' @click='goIndex' data-link='../index/index'>
      <i class='iconfont icon-home'></i>
    </div>
    <div id='lottery' style='height:0.9rem'></div>
    <div class="lottery" v-if='isShow'>
      <div class='l_body' :style="{height:height+'px'}">
        <img class='l_bg' :src='img' />
        <div class='my_win_title' @click='gowinList'>
          我的奖品
          <i class='iconfont icon-iconfontjiantou5' style='font-size:0.22rem;margin-left:-0.06rem;color: #fff;'></i>
        </div>
        <div class='l_turntable'>
          <img src='@/assets/img/order/l_t.png' class='l_open' />
          <div class="canvas-container">
            <div class="canvas-content">
              <img src='@/assets/img/order/l_t_01.png' class="canvas-element" />
              <div class="canvas-list" v-for="(item,index) in awardsList" :key="index">
                <div class="canvas-item">
                  <span class="canvas-item-span" :style="{transform: 'rotate('+item.turn+'deg)'}">{{item.award}}</span>
                  <img :src='item.imgUrl' class='canvas-item-img' :style="{transform: 'rotate('+item.turn+'deg)'}" />
                </div>
              </div>
            </div>
          </div>
          <div @click="startLottery" class="canvas-btn">
            <img src='@/assets/img/order/l_03.png' style='width:1.75rem;height:2.02rem;' />
          </div>
        </div>
      </div>
      <div class='l_info'>
        <div class='l_title'>
          您今天还有
          <span>{{times}}</span>次抽奖机会
        </div>
      </div>
      <div class='win_list_bg' v-if='winList.length>0'>
        <img :src='list_bg_top' class='win_list_bg_top'/>
        <!--  -->
        <div class='win_list' :style="{backgroundImage:'url('+ list_bg_middle +')'}">
          <div class='head_title'>
            <div>中奖列表</div>
          </div>
          <div class='win_title'>
            <span class='name'>手机号</span>
            <span class='pro'>奖品</span>
            <span class='time'>时间</span>
          </div>
          <div class='win_blcok' v-for='(item,index) in winList' :key='index' v-if='winList.length>0'>
            <span class='name'>{{item.mobile}}</span>
            <span class='pro'>{{item.name}}</span>
            <span class='time'>{{item.lottery_time}}</span>
          </div>
          <div class='win_blcok' style='text-align:center' v-if='winList.length==0'>
            <span>暂无人获奖</span>
          </div>
        </div>
        <img :src='list_bg_bottom' class='win_list_bg_bottom'/>
      </div>
    </div>
    <div class='win_bg' :hidden='modelShow'></div>
    <div class='myWin' :hidden='modelShow'>
      <i class='iconfont icon-guanbi2' @click='close_model'></i>
      <div class='myWin_list'>
        <div class='myWin_title'>
          <span>中奖时间</span>
          <span>奖品</span>
          <span>是否领取</span>
        </div>
        <div class='myWin_news'>
          <div class='myWin_block' v-for='(item,index) in myWinList' :key='index'>
            <span>{{item.createtime}}</span>
            <span>{{item.name}}</span>
            <span v-if='item.get_status==1'>已领取</span>
            <span v-if='item.get_status==2' @click="goLink('/myOrder?tid=1&id=type1')">待付款</span>
            <span v-if='item.get_status==3'>已取消</span>
            <span v-if='item.get_status==4'>已失效</span>
            <span v-if='item.get_status==0' @click='winPro(item.pid,item.id)'>点击领取</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  MessageBox,
  Toast
} from 'mint-ui'
import {
  parseTime
} from '@/store/pubilc.js'
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import anime from 'animejs'
import {
  getlottery,
  getResult,
  getWin,
  getWinList,
  addCarofNormal
} from '@/api/index'
export default {
  name: 'Lottery',
  components: {
    commonHeader,
    returnTop,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    MessageBox
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '',
      list_bg_top: '',
      list_bg_middle: '',
      list_bg_bottom: '',
      allowbind: true,
      height: 0,
      top: 0,
      isShow: false,
      isScroll: true,
      awardsList: {},
      animationData: {},
      btnDisabled: '',
      total_people: 0,
      img: '',
      modelShow: true,
      myWinList: [],
      times: 0,
      winList: [],
      prizeList: [],
      page: 1,
      limit: 15,
      proType: 'exchange',
      winId: '',
      lotteryId: '',
      msg: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取抽奖详情
    this.getList()
  },
  methods: {
    goIndex: function (e) {
      if (this.btnDisabled === '') {
        this.$router.replace({
          path: '/index'
        })
      }
    },
    goTop() {
      if (this.btnDisabled === '') {
        console.log('回到顶部')
        document.getElementById('lottery').scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      }
    },
    getList() {
      getlottery().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          this.h_title = res.data.title
          // wx.hideLoading()
          this.isShow = true
          this.prizeList = res.data.disk.rows
          this.total_people = res.data.total_times
          this.img = res.data.background_image
          this.times = Number(res.data.left_times)
          this.list_bg_top = res.data.background_image1
          this.list_bg_middle = res.data.background_image2
          this.list_bg_bottom = res.data.background_image3
          // app.awardsConfig =
          let awardsConfig = this.prizeList
          let len = awardsConfig.length
          let html = []
          let turnNum = 360 / len // 文字旋转 turn 值
          for (var i = 0; i < len; i++) {
            // 奖项列表
            html.push({
              turn: i * turnNum,
              award: awardsConfig[i].name,
              imgUrl: awardsConfig[i].image
            })
          }
          this.awardsList = html
        } else {
          Toast({
            message: '活动未开启！',
            duration: 1000
          })
          setTimeout(function () {
            this.$router.replace({
              path: '/index'
            })
          }.bind(this), 1000)
        }
      })
      getWin(this.limit).then(res => {
        if (res.isSuccess) {
          this.winList = res.data
        }
      })
    },
    gowinList: function () {
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        if (this.btnDisabled === '') {
          this.isScroll = false
          getWinList().then(res => {
            if (res.isSuccess) {
              for (var i = 0; i < res.data.rows.length; i++) {
                res.data.rows[i].createtime = parseTime(res.data.rows[i].createtime, '{y}-{m}-{d} {h}:{i}:{s}')
              }
              this.myWinList = res.data.rows
              this.modelShow = false
            }
          })
        }
      } else {
        let that = this
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    close_model: function () {
      this.modelShow = true
      this.isScroll = true
    },
    winPro(e, listid) {
      var that = this
      if (this.allowbind) {
        this.allowbind = false
        let id = ''
        let lid = ''
        if (e !== undefined) {
          id = e
          lid = listid
        } else {
          id = this.winId
          lid = this.lotteryId
        }
        let info = {
          pid: id,
          num: 1,
          type: 'exchange',
          goods_id: '',
          deal_type: 1,
          lottery_id: lid
        }
        addCarofNormal(info).then(res => {
          if (res.isSuccess) {
            that.$router.togo({
              path: '/sureOrder?id=' + id + '&addType=3&proType=exchange'
            })
          } else {
            that.allowbind = true
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      }
    },
    goLink(url) {
      this.$router.togo({
        path: url
      })
    },
    startLottery: function () {
      var that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        if (that.times > 0) {
          console.log(that.btnDisabled)
          if (that.btnDisabled === '') {
            this.btnDisabled = 'disabled'
            // 判断是否登陆
            // 判断是否绑定手机号
            console.log(this.$store.state.home.isbind)
            if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
              this.btnDisabled = ''
              this.$router.togo({
                path: '/bind?visit=6'
              })
            } else {
              getResult().then(res => {
                if (res.isSuccess) {
                  this.msg = res.msg
                  if (res.product_id !== 0) {
                    this.winId = res.product_id
                    this.lotteryId = res.id
                  }
                  var awardIndex = res.prize_id - 1
                  var el = document.querySelector('.canvas-content')
                  anime({
                    targets: el,
                    rotate: {
                      value: 360 * 8 - awardIndex * (360 / 8),
                      duration: 4000,
                      easing: 'easeInOutSine'
                    },
                    loop: false,
                    complete: function () {
                      var win = false
                      var winName = '确定'
                      if (that.winId !== '') {
                        win = true
                        winName = '前往领取'
                      }
                      let plus = window.plus
                      if (window.plus) {
                        if (win) {
                        // 中实物奖
                          console.log('手动领取')
                          plus.nativeUI.confirm(that.msg, function(e) {
                            console.log('Close confirm: ' + e.index)
                            if (e.index === 0 || e.index === '0') {
                              that.btnDisabled = ''
                              that.winPro()
                            } else {
                              console.log('用户点击取消')
                              that.btnDisabled = ''
                              that.winId = ''
                            }
                          }, {
                            'title': '恭喜您',
                            'buttons': [winName, '取消'],
                            'verticalAlign': 'center'
                          })
                        } else {
                        // 自动到账的奖
                          console.log('自动领取')
                          plus.nativeUI.confirm(that.msg, function(e) {
                            console.log('Close confirm: ' + e.index)
                            if (e.index === 0 || e.index === '0') {
                              anime({
                                targets: el,
                                rotate: {
                                  value: 360 - awardIndex * (360 / 8),
                                  duration: 1,
                                  easing: 'easeInOutSine'
                                },
                                loop: false
                              })
                              if (that.times <= 0) {
                                that.times = 0
                              } else {
                                that.times = that.times - 1
                              }
                              that.winId = ''
                              that.lotteryId = ''
                              that.btnDisabled = ''
                            } else {
                              console.log('用户点击取消')
                              that.btnDisabled = ''
                              that.winId = ''
                            }
                          }, {
                            'title': '恭喜您',
                            'buttons': [winName],
                            'verticalAlign': 'center'
                          })
                        }
                      } else {
                        MessageBox({
                          title: '恭喜您',
                          message: that.msg,
                          confirmButtonText: winName,
                          showCancelButton: win,
                          closeOnClickModal: false
                        }).then(action => {
                          console.log(action)
                          if (action === 'confirm') {
                            that.btnDisabled = ''
                            if (win) {
                              that.winPro()
                            } else {
                              anime({
                                targets: el,
                                rotate: {
                                  value: 360 - awardIndex * (360 / 8),
                                  duration: 1,
                                  easing: 'easeInOutSine'
                                },
                                loop: false
                              })
                              if (that.times <= 0) {
                                that.times = 0
                              } else {
                                that.times = that.times - 1
                              }
                              that.winId = ''
                              that.lotteryId = ''
                            }
                          } else {
                            that.btnDisabled = ''
                            that.winId = ''
                          }
                        })
                      }
                    }
                  })
                } else {
                  Toast(res.msg)
                }
              })
            }
          } else {
            console.log('按钮不可点')
          }
        } else {
          Toast('今日抽奖次数已用完!')
        }
      } else {
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    }
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .lottery {
     position: relative;
    background: #f2f2f2;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 0.9rem );
  }

  .bodyLock {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    z-index: 0;
    display: block;
  }

  .l_body {
    width: 100%;
  }

  .l_body .l_bg {
    position: absolute;
    width: 750/100rem;
    // height: 100%;
    top: 0.9rem;
  }

  .my_win_title {
    position: absolute;
    z-index: 20;
    top: 525/100rem;
    right: 28/100rem;
    height: 80/100rem;
    line-height: 80/100rem;
    font-size: 30/100rem;
    color: #fff;
  }

  .l_turntable {
    position: absolute;
    z-index: 10;
    top: 650/100rem;
    left: 51%;
    transform: translateX(-50%);
  }

  .l_turntable .l_open {
    width: 748/100rem;
    height: 940/100rem;
    position: absolute;
    top: -130/100rem;
    left: 49%;
    transform: translateX(-50%);
  }

  /* 转盘 */

  .canvas-container ul,
  .canvas-container li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .canvas-container {
    margin: 0 auto;
    position: relative;
    width: 562/100rem;
    height: 562/100rem;
    border-radius: 50%;
  }

  .canvas-content {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20;
    display: block;
    width: inherit;
    height: inherit;
  }

  .canvas-element {
    width: 562/100rem;
    height: 562/100rem;
  }

  .canvas-list {
    position: absolute;
    left: 0;
    top: 0;
    width: inherit;
    height: inherit;
    z-index: 30;
  }

  .canvas-item {
    position: absolute;
    left: 0;
    top: 8/100rem;
    width: 100%;
    height: 100%;
    color: #fff;
  }

  .canvas-item-span {
    position: relative;
    display: block;
    padding-top: 28/100rem;
    /* width: 50px; */
    margin: 0 auto;
    text-align: center;
    -webkit-transform-origin: 50% 270/100rem;
    transform-origin: 50% 270/100rem;
    font-size: 22/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 144/100rem;
  }

  .canvas-item-img {
    width: 0.6rem;
    height: 0.6rem;
    -webkit-transform-origin: 42% 190/100rem;
    transform-origin: 42% 190/100rem;
    position: absolute;
    left: 256/100rem;
    top: 82/100rem;
    /* border-radius: 50%; */
  }

  .canvas-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    width: 200/100rem;
    height: 210/100rem;
    border-radius: 50%;
    color: #f4e9cc;
    line-height: 160/100rem;
    text-align: center;
  }

  .gb-run {
    -webkit-transition: all 6s ease;
    transition: all 6s ease;
  }

  .l_info {
    width: 640/100rem;
    text-align: center;
    position: absolute;
    top: 1320/100rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    /* display: none; */
  }

  .l_info icon {
    color: #f0eb3c;
    font-weight: bold;
    font-size: 20px;
  }

  .l_title {
    width: 640/100rem;
    height: 100/100rem;
    line-height: 100/100rem;
    color: #fff;
    font-size: 30/100rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .l_title span {
    font-size: 31/100rem;
    margin: 0 10/100rem;
    background: #e36a08;
    border-radius: 10/100rem;
    height: 42/100rem;
    min-width: 42/100rem;
    line-height: 42/100rem;
    text-align: center;
  }

  .l_other {
    margin-top: 13/100rem;
    color: #f1eb3c;
    font-size: 29.49/100rem;
  }

  .win_list_bg {
    position: absolute;
    top: 2654/100rem;
    width: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }

  .win_list_bg .win_list_bg_top {
    width: 750/100rem;
    display: block;
  }

  .win_list_bg .win_list_bg_bottom {
    width: 750/100rem;
    display: block;
  }

  .win_list {
    width: 80%;
    padding: 0 10%;
    background-size: 100%;
    background-repeat: repeat-y;
  }

  .win_list .head_title {
    font-size: 28/100rem;
    color: #6d4304;
    padding: 20/100rem 26/100rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0;
  }

  .win_list .win_title {
    font-size: 28/100rem;
    color: #6d4304;
    padding: 0 18/100rem;
    padding-bottom: 10/100rem;
    border-bottom: 2/100rem solid #e9a84c;
    display: flex;
    justify-content: center;
  }

  .win_blcok {
    color: #6d4304;
    font-size: 24/100rem;
    display: flex;
    justify-content: center;
    height: 53/100rem;
    line-height: 53/100rem;
  }

  .win_list div span {
    display: inline-block;
  }

  .win_list div .id {
    width: 60/100rem;
    text-align: center;
  }

  .win_list div .name {
    width: 170/100rem;
    text-align: center;
  }

  .win_list div .pro {
    width: 200/100rem;
    text-align: center;
    margin: 0 20/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .win_list div .time {
    width: 170/100rem;
    text-align: center;
  }

  /* 我的中奖列表 */

  .win_bg {
    position: fixed;
    z-index: 50;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
  }

  .myWin {
    position: fixed;
    width: 85%;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  .myWin i {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 58/100rem;
    color: #ffea00;
  }

  .myWin_list {
    width: 100%;
    height: 600/100rem;
    border: 2/100rem dotted #c20c08;
    border-radius: 10/100rem;
    background: #f6d77a;
    margin: 0 auto;
    margin-top: 100/100rem;
  }

  /* .myWin_list div:nth-child(2) {
  margin-top: 60/100rem;
} */

  .myWin_title {
    font-size: 28/100rem;
    color: #6d4304;
    padding: 10/100rem 18/100rem;
    border-bottom: 2/100rem solid #bf9b4a;
    position: absolute;
    top: 15%;
    width: 94%;
    background: #f6d77a;
  }

  .myWin_title span {
    display: inline-flex;
    justify-content: center;
  }

  .myWin_title span:first-child {
    width: 200/100rem;
  }

  .myWin_title span:nth-child(2) {
    width: 38%;
  }

  .myWin_title span:nth-child(3) {
    width: 25%;
  }

  .myWin_list .myWin_news {
    margin-top: 10%;
    height: 530/100rem;
    overflow: scroll;
  }

  .myWin_news .myWin_block {
    color: #6d4304;
    font-size: 24/100rem;
    padding: 14/100rem 18/100rem;
    display: flex;
    align-items: center;
  }

  .myWin_block span {
    display: inline-flex;
    justify-content: center;
    text-align: center;
  }

  .myWin_block span:first-child {
    width: 200/100rem;
  }

  .myWin_block span:nth-child(2) {
    width: 40%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .myWin_block span:nth-child(3) {
    width: 25%;
  }

</style>
