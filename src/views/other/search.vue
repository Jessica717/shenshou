<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='search_his'>
      <div class='search_header'>
        <div class='search'>
          <i class='iconfont icon-search'></i>
          <mt-field placeholder="搜索喜欢的商品" v-model="searchkey" class='search_input' @change="searchList"></mt-field>
        </div>
        <span @click='searchList'>搜索</span>
      </div>
      <div class='his_list'>
        <div class='his_header' v-if="keylist.length!==0">
          <span>历史记录</span>
          <span @click="clearSearchStorage" class='red_text'>清除</span>
        </div>
        <div class='h_list'>
          <span v-for='(item,index) in keylist' @click='goLink(item.name)' data-link='../proList/proList?type=key&value=item.name'
            :key='index'>{{item.name}}</span>
        </div>
      </div>
      <div class='hot_search'>
        <div class='hot_header'>
          <span>热门搜索</span>
          <div class='hot_right'>
            <i class='iconfont icon-shuaxin'></i>
            <span @click='changeList' class='red_text'>换一批</span>
          </div>
        </div>
        <div class='hot_list'>
          <span @click='goLink(item.title)' data-link='../proList/proList?type=key&value=item.title' v-for='(item,index) in hotSearch'
            :key='index'>{{item.title}}</span>
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
  getHotSearch
} from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
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
  name: 'Search',
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
      h_title: '搜索',
      hot_page: 1,
      hot_limit: 10,
      hot_total: 0,
      hotNum: 0,
      hotSearch: [],
      istrue: false,
      searchkey: '',
      keylist: []
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    // console.log(this.$route.query)
    this.searchHis()
    this.openLocationsercher()
  },
  methods: {
    ...mapMutations({
      setSearchData: 'SET_SEARCHDATA'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goLink(value) {
      this.$router.togo({
        path: '/proList?type=key&value=' + value
      })
    },
    searchHis: function () {
      var that = this
      // 获取热门搜索列表
      let info = {
        page: that.hot_page,
        pagesize: that.hot_limit
      }
      getHotSearch(info).then(res => {
        if (res.isSuccess) {
          that.hotSearch = res.data.rows
          that.hot_total = res.data.total
          that.istrue = true
          that.hotNum = Math.ceil(res.data.total / that.hot_limit)
        }
      })
    },
    changeList: function () {
      if (this.hot_page === this.hotNum) {
        this.hot_page = 0
      }
      this.setData({
        hot_page: ++this.hot_page
      })
      this.searchHis()
    },
    searchHidden: function () {
      this.setData({
        s_history: false
      })
    },
    searchInput: function (e) {
      this.setData({
        searchkey: e.detail.value
      })
    },
    clearSearch: function () {
      this.setData({
        searchkey: '',
        istrue: true
      })
    },
    searchList: function () {
      var self = this
      if (this.searchkey !== '') {
        // 将搜索记录更新到缓存
        console.log(self.keylist)
        if (self.keylist === null) {
          self.keylist = []
        }
        var searchData = self.keylist

        if (searchData.length > 8) {
          searchData.pop()
        }
        var arr = [{
          id: searchData.length,
          name: self.searchkey
        }]
        searchData = arr.concat(searchData)
        console.log(searchData)
        window.localStorage.setItem('searchData', JSON.stringify(searchData))
        // self.setSearchData(searchData)
      }
      self.this.$router.togo({
        path: '/proList?type=key&value=' + self.searchkey
      })
    //   wx.navigateTo({
    //     url: '../proList/proList?type=key&value=' + this.searchkey
    //   })
    },
    // 清除缓存历史
    clearSearchStorage: function () {
      window.localStorage.setItem('searchData', '')
      this.keylist = []
    },
    // 打开历史记录列表
    openLocationsercher: function () {
      let info = []
      if (window.localStorage.getItem('searchData') !== '') {
        info = JSON.parse(window.localStorage.getItem('searchData'))
      }
      this.keylist = info
      // this.keylist = this.$store.state.home.searchData || []
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

  .search_his {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .search_header {
    padding: 20/100rem 26/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 2/100rem solid #e0e0e0;

    .search {
      width: 80%;
      height: 60/100rem;
      line-height: 60/100rem;
      border-radius: 50/100rem;
      background: #f5f5f5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 26/100rem;

      .iconfont {
        color: #ec5580;
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
    span {
    font-size: 30/100rem;
    color: #555;
  }
  }

  .his_list {
    padding: 0 26/100rem;
  }

  .his_list .his_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24/100rem;
    color: #666;
    margin: 30/100rem 0;
  }

  .his_header .red_text {
    color: #ec5580;
  }

  .h_list span {
    display: inline-block;
    height: 56/100rem;
    line-height: 56/100rem;
    font-size: 24/100rem;
    color: #999;
    background: #f1f2f6;
    border-radius: 20/100rem;
    padding: 0 26/100rem;
    margin-bottom: 22/100rem;
    margin-right: 40/100rem;
  }

  .hot_search {
    padding: 0 26/100rem;
  }

  .hot_search .hot_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24/100rem;
    color: #666;
    margin: 30/100rem 0;
  }

  .hot_right .iconfont {
    color: #ec5580;
    font-size: 24/100rem;
  }

  .hot_right .red_text {
    color: #ec5580;
  }

  .hot_list span {
    display: inline-block;
    height: 56/100rem;
    line-height: 56/100rem;
    font-size: 24/100rem;
    color: #999;
    background: #f1f2f6;
    border-radius: 20/100rem;
    padding: 0 26/100rem;
    margin-bottom: 22/100rem;
    margin-right: 40/100rem;
  }

</style>
