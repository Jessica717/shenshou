<template>
  <div>
    <common-header :h_title="h_title" :showback="false" :bgcolor="head_color"></common-header>
    <div style='height:0.8rem' id='hot'></div>
    <div class='find_bg'>
      <!-- 返回顶部按钮 -->
      <return-top @returnTop='goTop'></return-top>
      <div class='hot_push' v-if='isShow' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
        infinite-scroll-distance="30">
        <div class='hot_block' v-for="(item,index) in hotList" :key='index' :id='item.id' @click="goDeatail(item)">
          <div class='hot_time'>
            <span style='font-size:0.36rem'>{{item.time[0]}}/</span>
            <span style='font-size:0.42rem'>{{item.time[1]}}.{{item.time[2]}}</span>
          </div>
          <div class='hot_head'>
            <img :src="item.img" />
          </div>
          <div class='hot_title'>
            <div class='title_name'>{{item.title}}</div>
            <span>{{item.summary}}</span>
          </div>
          <div class='hot_operating'>
            <i class="iconfont icon-16pxyuedu"></i>
            <span>{{item.click_nums}}人已阅读</span>
          </div>
        </div>
      </div>
      <div class='more_load' v-if='!loading'>
        <mt-spinner type="fading-circle"></mt-spinner>
      </div>
      <div class='list_bottom' v-if='loading'>—————— 我是有底线的 ——————</div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Spinner
} from 'mint-ui'
import returnTop from '@/components/return-top'
import {
  getFind
} from '@/api/index'
export default {
  name: 'Find',
  components: {
    commonHeader,
    returnTop,
    InfiniteScroll,
    Spinner
  },
  data() {
    return {
      h_title: '推荐精选',
      isShow: false,
      hotList: [],
      page: 1,
      limit: 3,
      isSign: true,
      loading: true,
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      }
    }
  },
  mounted() {
    Indicator.open('加载中...')
    this.getList()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('hot').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getList() {
      getFind({
        limit: this.limit,
        page: this.page
      }).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          for (var i = 0; i < res.rows.length; i++) {
            res.rows[i].time = res.rows[i].createtime.split('-')
          }
          this.hotList = res.rows
          this.total = res.total
          this.isShow = true
          this.loading = false
        }
      })
    },
    goDeatail(event) {
      console.log(event)
      this.$router.togo({
        path: '/findDetail?id=' + event.id
      })
    },
    loadMore() {
      this.loading = true
      // 加载更多数据
      this.page = ++this.page
      console.log('更多架子啊')
      getFind({
        limit: this.limit,
        page: this.page
      }).then(res => {
        if (res.isSuccess) {
          if (res.rows !== null && res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
              res.rows[i].time = res.rows[i].createtime.split('-')
            }
            this.hotList = this.hotList.concat(res.rows)
            this.total = res.total
            this.isShow = true
            this.loading = false
          } else {
            this.loading = true
          }
        }
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .find_bg {
    // margin-top: 1rem;
    padding-bottom: 0.98rem;
  }

  .hot_push {
    background: #fff;
    /* padding: 0 20/100rem; */
    padding: 20/100rem;
  }

  .hot_block {
    margin-bottom: 18/100rem;
    padding: 50/100rem 12/100rem 30/100rem 12/100rem;
    background: #fff;
    border-radius: 12/100rem;
    box-shadow: 0 3/100rem 4/100rem 2/100rem #e7e7e7;
    text-align: left;
  }

  .hot_time {
    padding: 0 16/100rem 15/100rem 16/100rem;
  }

  .hot_time span {
    color: #000;
    font-family: 'DIN';
  }

  .hot_head {
    height: 480/100rem;
  }

  .hot_head img {
    /* border-radius: 10/100rem; */
    width: 100%;
    height: 480/100rem;
  }

  .hot_title {
    padding: 30/100rem 16/100rem 20/100rem 16/100rem;
    /* border-bottom: 1px solid #e4e4e4; */
  }

  .hot_title .title_name {
    font-size: 36/100rem;
    /* font-weight: 600; */
    color: #000;
    padding-bottom: 0.2rem;
  }

  .hot_title span {
    font-size: 24/100rem;
    /* font-weight: bold; */
    color: #666;
  }

  .hot_operating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    /* padding-top: 10/100rem; */
  }

  .hot_operating .iconfont {
    font-size: 38/100rem;
    display: inline-flex;
    margin-right: 8/100rem;
  }

  .hot_operating span {
    font-size: 24/100rem;
    color: #666;
    margin-right: 16/100rem;
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

</style>
