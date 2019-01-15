<template>
    <div class="returnTop" v-if="show" @click="goTop">
        <i class="iconfont icon-huidaodingbu"></i>
    </div>
</template>
<script>
export default {
  data() {
    return {
      show: this.isTop
    }
  },
  mounted() {
    // 监听滚动条高度
    this.tabScroll()
  },
  methods: {
    tabScroll() {
      window.addEventListener('scroll', this.handleScroll)
    },
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      var browserHeight = window.outerHeight // 浏览器高度
      if (scrollTop > browserHeight) {
        this.show = true
      } else {
        this.show = false
      }
    },
    goTop() {
      this.$emit('returnTop')
    }
  },
  destroyed: function() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="less" scoped>
@import '~styles/index.less';
@import '~styles/variable.less';
.returnTop {
  position: fixed;
  width: 80/100rem;
  height: 80/100rem;
  background: rgba(0, 0, 0, 0.5);
  right: 16/100rem;
  bottom: 20%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  .iconfont {
    color: #fff;
    font-size: 50/100rem;
  }
}
</style>
