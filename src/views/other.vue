<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <div style='height:0.9rem'></div>
    <div class='other_bg'>
        <div v-html='content' class='pro_html'></div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
// import login from '@/assets/img/login.png'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  getSetInfo
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
  name: 'Other',
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
      h_title: '',
      type: '',
      content: ''
    }
  },
  mounted() {
    this.type = this.$route.query.type
    if (this.type === 'statement') {
      this.h_title = '特别声明'
    } else {
      this.h_title = '隐私政策'
    }
    this.getInfo()
  },
  methods: {
    getInfo() {
      let that = this
      getSetInfo().then(res => {
        console.log(res)
        if (res.isSuccess) {
          if (that.type === 'statement') {
            that.content = res.data.statement
          } else {
            that.content = res.data.privacy_policy
          }
        }
      })
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

    .other_bg {
      padding: 0 0.2rem;
    }

</style>
