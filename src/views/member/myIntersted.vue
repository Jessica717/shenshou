<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='interested'>
      <div class='i_header'>
        <span class='header_title'>选择至少4个感兴趣的内容</span>
        <span>私人订制，以后可随时更改</span>
      </div>
      <div class='i_body'>
        <div class='i_likeList'>
          <!-- <checkbox-group bindchange="checkLike"> -->
          <div class='i_like' v-for='(item,index) in list' :key='index'>
            <!-- <label for='item.id'> -->
            <img :src='item.img' class='i_like_img' />
            <div class='info_chose'>
              <input v-model="item.selected" :id='item.id' type='checkbox' @click="checkLike(item)" />
              <label :for="item.id"></label>
            </div>
            <!-- <checkbox id='item.id' checked='item.selected' value='item.id'></checkbox> -->
            <span>{{item.name}}</span>
            <!-- </label> -->
          </div>
          <!-- </checkbox-group> -->
        </div>
        <div class='i_like_btn' @click='goInfo'>
          <mt-button size='normal'>完成</mt-button>
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
  getMyIntersted,
  savePersonInfo
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
  name: 'MyIntersted',
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
      h_title: '我的关注',
      visited: 0,
      list: [],
      select: []
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    // console.log(this.$route.query)
    let options = this.$route.query
    this.visited = options.visit
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
    checkLike(event) {
      event.selected = !event.selected
      this.select = []
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].selected) {
          this.select.push(this.list[i].id)
        }
      }
      console.log(this.select)
    },
    getList() {
      var that = this
      that.select = []
      getMyIntersted().then(res => {
        if (res.isSuccess) {
          for (var i = 0; i < res.data.rows.length; i++) {
            if (res.data.rows[i].selected) {
              that.select.push(res.data.rows[i].id)
            }
          }
          that.list = res.data.rows
          that.select = that.select
        }
      })
    },
    goInfo: function () {
      if (this.select.length >= 4) {
        var obj = {
          'tag_ids': this.select.join(',')
        }
        var arr = []
        arr.push(obj)
        var that = this
        savePersonInfo(JSON.stringify(arr)).then(res => {
          if (res.isSuccess) {
            Toast({
              message: '保存成功',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            setTimeout(function () {
              that.$router.back()
            }, 1000)
          }
        })
        // util.queryRequest('?m=myinfo&a=usersave', {
        //   data: JSON.stringify(arr)
        // }, 'POST', function (res) {
        //   if (res.isSuccess) {
        //     wx.showToast({
        //       title: '保存成功',
        //       icon: 'success',
        //       duration: 1000
        //     })
        //     setTimeout(function () {
        //       var pages = getCurrentPages()
        //       if (this.visited == 0) {
        //         wx.redirectTo({
        //           url: '../memberCenter/memberCenter'
        //         })
        //       } else {
        //         // 调用接口保存感兴趣的内容，
        //         wx.navigateBack({
        //           delta: 1
        //         })
        //       }
        //     }.bind(that), 1000)
        //   }
        // })
      } else {
        Toast({
          message: '至少选择四个',
          duration: 1000
        })
      }
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .interested {
    /* font-family: SimHei; */
    padding: 0.81rem;
    background: #fff;
  }

  .interested .i_header {
    text-align: center;
  }

  .interested .i_header span {
    font-size: 26/100rem;
    color: #8f8f8f;
    display: block;
    text-align: center;
  }

  .i_header .header_title {
    font-size: 44/100rem !important;
    font-weight: bold;
    color: #343434;
    margin-bottom: 22/100rem;
  }

  .i_body {
    margin-top: 54/100rem;
  }

  .i_likeList {
    overflow: hidden;
    height: 716/100rem;
    overflow: scroll;
  }

  .i_like {
    position: relative;
    float: left;
    margin: 14/100rem;
    text-align: center;
  }

  .i_like .i_like_img {
    width: 168/100rem;
    height: 168/100rem;
  }

  .i_like span {
    display: block;
    font-size: 26.65/100rem;
    color: #373737;
    text-align: center;
    width: 168/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .i_like_btn {
    text-align: center;
  }

  .i_like_btn button {
    margin-top: 58/100rem;
    width: 460/100rem;
    height: 86/100rem;
    line-height: 86/100rem;
    border: none;
    background: #ff8d97;
    color: #fff;
    outline: none;
    font-size: 40/100rem;
    border-radius: 20/100rem;
  }

  input[type="checkbox"] {
    // width: 34/100rem;
    // height: 34/100rem;
    // opacity: 0;
    width: 1.68rem;
    height: 1.68rem;
    opacity: 0;
    position: absolute;
    top: 0;
  }

  label {
    position: absolute;
    right: 5/100rem;
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
