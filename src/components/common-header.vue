<template>
  <div class="header-box" :style='bgcolor'>
    <div class="left-icon">
      <span v-if="showback" @click="back" class="iconfont icon-jiantouarrowhead7" :style='bgcolor'></span>
    </div>
    <div class="header-tittle">
      <span v-if="showinput">
        <cus-input></cus-input>
      </span>
      <span v-if="!showinput">{{h_title}}</span>
    </div>
    <div class="right-icon">
      <span v-if="showmore" class="iconfont icon-shezhi2" @click='goSet'></span>
    </div>
  </div>
</template>

<script>
import cusInput from 'common/cus-input'
export default {
  data() {
    return {}
  },
  props: {
    showright: {
      type: Boolean,
      default: false
    },
    showleft: {
      type: Boolean,
      default: false
    },
    showinput: {
      type: Boolean,
      default: false
    },
    h_title: {
      type: String,
      default: '标题'
    },
    showback: {
      type: Boolean,
      default: true
    },
    showmore: {
      type: Boolean,
      default: false
    },
    bgcolor: {
      type: Object,
      default: function() {
        return {
          background: '#ff8d97',
          color: '#ffffff'
        }
      }
    }
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    goSet() {
      this.$router.togo({
        path: '/set'
      })
    }
  },
  components: {
    cusInput
  }
}

</script>

<style lang="less" scoped>
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .header-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: @base-header-size;
    display: flex;
    z-index: 100;
    // padding: 0.1rem 0.26rem;
    .left-icon {
      position: relative;
      flex: 1;
      display: inline-flex;
      align-items: center;
      .iconfont{
        font-size: 0.42rem;
        padding-left: 0.03rem;
      }
    }

    .header-tittle {
      flex: 3;
      text-align: center;
      line-height: 0.9rem;
    }

    .right-icon {
      position: relative;
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      .iconfont{
        font-size: 0.42rem;
        color: #fff;
      }
    }
  }

</style>
