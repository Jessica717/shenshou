<template>
  <div class="input-box">
    <span class="icon"></span>
    <input type="text" class="search" placeholder="找人 找故事">
  </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
@import '~styles/index.less';
@import '~styles/variable.less';
.input-box {
  position: relative;
  .icon {
    position: absolute;
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    top: 50%;
    margin-top: -0.18rem;
    left: -0.2rem;
    background-image: url('../assets/img/search.svg');
    background-size: cover;
  }
  .search {
    border-radius: 0.08rem;
    height: 0.5rem;
    line-height: 0.5rem;
    width: 100%;
    outline: none;
    padding-left: 0.5rem;
    padding-top: 0.05rem;
    margin-left: -0.25rem;
    font-size: 0.26rem;
  }
}
</style>
