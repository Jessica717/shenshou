<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div class='news'>
      <div style='height:0.9rem' id='news'></div>
      <return-top @returnTop='goTop'></return-top>
      <div class='news_header'>
        <span v-if='choseType==2'>共有<span class='news_num'>{{total}}</span>条消息</span>
        <span v-if='choseType==1'>共有<span class='news_num'>{{total}}</span>条通知</span>
        <span class='news_edit' @click='edit' v-if='!isEdit&&newList.length>0'>编辑</span>
        <span class='news_edit' @click='edit' v-if='isEdit&&newList.length>0'>完成</span>
      </div>
      <div class="news_body">
        <div class="news_nav">
          <span :class="choseType==2?'text_active':''" @click="choseNews(2)">消息</span>
          <span :class="choseType==1?'text_active':''" @click="choseNews(1)">通知</span>
        </div>
        <div style='height:1.7rem'></div>
        <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="loading" ref="loadmore" :auto-fill='false' :bottomDistance='100'
         :bottomPullText="'按住上拉加载'" :bottomDropText="'松开加载更多'" :bottomLoadingText="'加载中'" class="news_list"
          v-if='total>0'> -->
        <!-- <div style='background:#fff' v-if='total>0'> -->
        <div class="news_list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30">
          <div style='background:#fff;padding: 0 0.24rem;' v-if='total>0'>
            <div :class="choseId==item.id&&newShow?'new_info':'new_info info_hidden'" v-for="(item,index) in newList"
              :key='index'>
              <div class='info_title'>
                <div class='info_chose' v-if='isEdit'>
                  <input v-model="item.checked" :id='item.id' type='checkbox' @click="chose(item)" />
                  <label :for="item.id"></label>
                </div>
                <div class='info_img' @click="viewNews(item.id,item.status_read)">
                  <i class='iconfont icon-tongzhi' v-if='choseType==1'></i>
                  <i class='iconfont icon-tongzhi1' v-if='choseType==2'></i>
                </div>
                <div class="news_more" @click="viewNews(item.id,item.status_read)">
                  <div class='news_tips'>
                    <span class='news_title'>{{item.title}}</span>
                    <span>{{item.createtime}}</span>
                    <i :class="choseId==item.id&&newShow?'iconfont icon-xiala':'iconfont icon-xiala iconopen'" v-if='item.status_read==1'></i>
                    <span v-if='item.status_read==0'>未读</span>
                  </div>
                </div>
              </div>
              <div class='info_detail'>
                {{item.nr}}
              </div>
            </div>
          </div>
          <div class='news_list_null' v-if='newList.length<=0'>
            <span>当前分类暂无数据</span>
          </div>
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='list_bottom' v-if='newList.length>0&&newList.length==total'>—————— 我是有底线的 ——————</div>
          <!-- </mt-loadmore> -->

        </div>
        <!-- </div> -->
      </div>
      <div class='null_height' v-if='isEdit&&newList.length>0'></div>
      <div class='foot_edit_more' v-if='isEdit&&newList.length>0'>
        <div class='allCheck'>
          <div class='checkbox'>
            <input v-model='allchose' :checked="allchose==true" id='all' type='checkbox' @click="checkAll" />
            <label for="all"></label>
          </div>
          <span>全选</span>
        </div>
        <mt-button size='small' @click='delNews'>删除</mt-button>
      </div>
    </div>
    <div class='goIndex' @click='goIndex'>
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
  MessageBox,
  Toast,
  CellSwipe,
  Loadmore
} from 'mint-ui'
import {
  parseTime
} from '@/store/pubilc.js'
import {
  mapGetters,
  mapMutations
} from 'vuex'
import {
  getNewsList,
  delNewsList,
  readNew
} from '@/api/index'
export default {
  name: 'News',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    MessageBox,
    Toast,
    CellSwipe,
    Loadmore
  },
  data() {
    return {
      h_title: '消息中心',
      newList: [],
      page: 1,
      pagesize: 10,
      total: 0,
      newDetail: {},
      newShow: false,
      choseId: '',
      choseType: 2,
      allchose: false,
      delList: [],
      isEdit: false,
      loading: true
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取我的消息列表
    this.getList()
  },
  methods: {
    ...mapMutations({
      setNews: 'SET_NEWS',
      setNewsnum: 'SET_NEWSNUM'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('news').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    chose(event) {
      event.checked = !event.checked
      this.delList = []
      for (let j = 0; j < this.newList.length; j++) {
        if (this.newList[j].checked) {
          this.delList.push(this.newList[j].id)
        }
      }
      let status = this.newList.every(x => x.checked)
      if (status) {
        this.allchose = true
      } else {
        this.allchose = false
      }
    },
    checkAll: function () {
      this.delList = []
      if (this.allchose === false) {
        for (let j = 0; j < this.newList.length; j++) {
          this.newList[j].checked = true
          this.delList.push(this.newList[j].id)
        }
        this.allchose = true
      } else {
        for (let j = 0; j < this.newList.length; j++) {
          this.newList[j].checked = false
        }
        this.delList = []
        this.allchose = false
      }
    },
    delNews() {
      var that = this
      if (that.delList.length <= 0) {
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
              delNewsList(that.delList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: res.msg,
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.page = 1
                  that.allchose = 0
                  that.newList = []
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
              delNewsList(that.delList.join(',')).then(res => {
                if (res.isSuccess) {
                  Toast({
                    message: res.msg,
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  that.page = 1
                  that.allchose = 0
                  that.newList = []
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
    edit() {
      this.isEdit = !this.isEdit
    },
    choseNews(id) {
      Indicator.open('加载中...')
      this.choseType = id
      this.page = 1
      this.allchose = false
      this.newList = []
      this.total = 0
      this.getList()
    },
    viewNews(id, status) {
      var that = this
      if (status === 0) {
        readNew(id).then(res => {
          if (res.isSuccess) {
            for (var i = 0; i < that.newList.length; i++) {
              if (that.newList[i].id === id) {
                that.newList[i].status_read = 1
              }
            }
          }
        })
      }
      if (id === this.choseId) {
        this.newShow = !this.newShow
      } else {
        this.newShow = true
        this.choseId = id
      }
    },
    getList() {
      var that = this
      let info = {
        type: that.choseType,
        page: that.page,
        pagesize: that.pagesize
      }
      getNewsList(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.rows !== null && res.data.rows.length > 0) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(res.data.rows[i].createtime, '{y}-{m}-{d} {h}:{i}:{s}')
              res.data.rows[i].checked = false
            }
            that.newList = res.data.rows
            that.total = res.data.total
            that.loading = false
          } else {
            that.newList = []
            that.total = 0
            that.loading = true
          }
        }
      })
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        type: that.choseType,
        page: ++that.page,
        pagesize: that.pagesize
      }
      getNewsList(info).then(res => {
        if (res.isSuccess) {
          if (res.data.rows !== null && res.data.rows.length > 0) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = parseTime(res.data.rows[i].createtime,
                '{y}-{m}-{d} {h}:{i}:{s}')
              res.data.rows[i].checked = false
            }
            that.newList = that.newList.concat(res.data.rows)
            that.total = res.data.total
            that.loading = false
          } else {
            res.data.rows = []
            that.newList = that.newList.concat(res.data.rows)
            that.total = res.data.total
            that.loading = true
          }
        }
      })
      // if (parseInt(that.total) === parseInt(that.newList.length) && parseInt(that.total) > 0) {
      //   document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
      // }
      // that.$refs.loadmore.onBottomLoaded()
    }
  },
  computed: {
    ...mapGetters(['number', 'carnum', 'isbind', 'score', 'news', 'newsnum', 'issign'])
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .news {
    /* padding: 0 26/100rem; */
    font-family: SimHei;
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .news_header {
    text-align: center;
    background: #ebebeb;
    width: 100%;
    height: 86/100rem;
    line-height: 86/100rem;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0.9rem;
    z-index: 100;
  }

  .news_header span {
    padding-left: 26/100rem;
    color: #515151;
    font-size: 24/100rem;
  }

  .news_header .news_num {
    color: #ff8d97;
    font-size: 26/100rem;
    padding-left: 0;
  }

  .news_header .news_edit {
    float: right;
    padding-right: 26/100rem;
    color: #ff8d97;
    font-size: 24/100rem;
  }

  .news_body {
    height: 100%;
  }

  .news_nav {
    height: 90/100rem;
    background: #fff;
    position: fixed;
    top: 176/100rem;
    width: 100%;
    z-index: 50;
    border-bottom: 4/100rem solid #f6f6f6;
  }

  .top {
    top: 0;
  }

  .news_nav span {
    width: 48%;
    display: inline-block;
    color: #999;
    font-size: 32/100rem;
    text-align: center;
    border-bottom: 4/100rem solid transparent;
    border-top: 4/100rem solid transparent;
    height: 82/100rem;
    line-height: 82/100rem;
  }

  .news_nav .text_active {
    border-bottom: 4/100rem solid #e21f11;
    color: #333;
  }

  .news_list {
    max-height: calc(100vh - 2.36rem);
    overflow: scroll;
    // padding-top: 170/100rem;
    /* padding-top: 84/100rem; */
  }

  .padd_top {
    padding-top: 84/100rem;
  }

  .news_list_null {
    padding: 0 24/100rem;
    padding-top: 50/100rem;
    text-align: center;
  }

  .news_list_null span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #999;
  }

  .news_list .new_info {
    padding-top: 20/100rem;
    border-bottom: 1px solid #e4e4e4;
  }

  .news_list .new_info:last-child {
    border-bottom: none;
  }

  .info_hidden {
    height: 100/100rem;
    overflow: hidden;
  }

  .news_list .info_title {
    display: flex;
    align-items: center;
  }

  .news_list .info_chose {
    // float: left;
    // display: flex;
    // align-items: center;
    position: relative;
  }

  .info_title .info_img {
    width: 96/100rem;
    height: 96/100rem;
    text-align: center;
    line-height: 96/100rem;
  }

  .info_title .info_img .iconfont {
    display: inline-flex;
    font-size: 64/100rem;
    color: #ff8d97;
  }

  .info_title .info_img img {
    width: 90%;
    height: 90%;
  }

  .info_title .news_more {
    width: 580/100rem;
    margin-left: 10/100rem;
  }

  .info_title .news_more_edit {
    width: 530/100rem;
    margin-left: 26/100rem;
  }

  .info_title .news_tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .news_tips .iconfont {
    display: inline-flex;
    color: #999;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .news_tips .iconopen {
    transform: rotate(180deg);
  }

  .info_title span {
    font-size: 24/100rem;
    color: #999;
    display: inline-block;
  }

  .info_title .news_title {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #4d4d4d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 220/100rem;
  }

  .info_detail {
    margin: 12/100rem 0;
    font-size: 28/100rem;
    color: #4d4d4d;
    text-indent: 2em;
    padding: 0 26/100rem;
    padding-bottom: 20/100rem;
    /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%; */
  }

  .null_height {
    height: 100/100rem;
  }

  .foot_edit_more {
    box-shadow: 0 8/100rem 20/100rem 10/100rem #dadada;
    height: 100/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
  }

  .foot_edit_more .allCheck {
    margin-left: 26/100rem;
    font-size: 26/100rem;
    color: #555;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .foot_edit_more .allCheck .checkbox {
    position: relative;
    margin-right: 0.12rem;
    margin-top: -0.1rem;
  }

  .foot_edit_more button {
    float: right;
    width: 210/100rem;
    height: 100/100rem;
    background: #ff8d97;
    color: #fff;
    font-size: 34/100rem;
    line-height: 100/100rem;
    border-radius: 0;
    margin: 0;
  }

  .more_load {
    display: flex;
    justify-content: center;
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

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    background: #f2f2f2;
    font-size: 23.97/100rem;
    color: #bebebe;
  }

</style>
