<template>
  <div id="app">
    <div class="v_console_show" @click="v_console_click"></div>
    <transition :name="transitionName">
      <router-view class="Router"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: '',
      v_console_num: 0
    }
  },
  created() {
    setTimeout(function() {
      console.log('隐藏console')
      document.querySelector('#__vconsole').style.display = 'none'
      document.querySelector('#__vconsole .vc-switch').style.display = 'none'
    }, 100)
  },
  methods: {
    v_console_click () {
      this.v_console_num++
      console.log(this.v_console_num)
      if (this.v_console_num >= 4 && document.querySelector('#__vconsole')) {
        document.querySelector('#__vconsole').style.display = 'block'
        document.querySelector('#__vconsole .vc-switch').style.display = 'block'
        this.v_console_num = 0
        alert('01-14.1.0')
      }
    }
  },
  watch: {
    $route(val) {
      console.log(val)
      console.log(this.$router.isleft)
      console.log(this.$router.isright)
      if (this.$router.isleft) {
        this.transitionName = 'slideleft'
      }
      if (this.$router.isright) {
        this.transitionName = 'slideright'
      }
    }
  }
}
</script>

<style lang="less">
@import "~styles/variable.less";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v_console_show{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 40px;
  width: 40px;
  z-index: 100;
}
.Router {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: @body-bg-color;;
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
}
.slideleft-enter,
 .slideright-leave-active {
  opacity: 1;
  transform: translate3d(90% 0, 0);
  -webkit-transform: translate3d(90%, 0, 0);
  -moz-transform: translate3d(90%, 0, 0);
}
.slideleft-leave-active,
.slideright-enter {
 opacity: 1;
 transform: translate3d(-90% 0, 0);
 -webkit-transform: translate3d(-90%, 0, 0);
 -moz-transform: translate3d(-90%, 0, 0);
}
</style>
