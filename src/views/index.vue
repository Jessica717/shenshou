<template>
  <div class="page">
    <!-- <keep-alive> -->
    <router-view></router-view>
    <!-- </keep-alive> -->
    <!-- 底部导航栏 -->
    <div class="nav-footer">
      <footer>
        <router-link v-for='(item, index) in navList' :to='item.path' :key='index' v-bind:class="{'active':activeRoute == item.path}">
          <!-- <mt-badge type="error" size='small'>10</mt-badge> -->
          <div class='badge' v-if="item.type=='num'&&$store.state.home.carnum>0">
            <span>{{$store.state.home.carnum}}</span>
          </div>
          <div class='radios' v-if="item.type=='radio'&&$store.state.home.news">
          </div>
          <div :class="'tab-'+index"></div>
          <p v-text="item.name"></p>
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
// import { Badge } from 'mint-ui'
export default {
  // components: {
  //   Badge
  // },
  data() {
    return {
      navList: [{
        path: '/index',
        name: '首页',
        type: ''
      },
      {
        path: '/find',
        name: '发现',
        type: ''
      },
      {
        path: '/type',
        name: '分类',
        type: ''
      },
      {
        path: '/car',
        name: '购物车',
        type: 'num'
      },
      {
        path: '/member',
        name: '我的',
        type: 'radio'
      }
      ]
    }
  },
  computed: {
    ...mapGetters(['number', 'carnum', 'isbind', 'score']),
    activeRoute() {
      return this.$route.path
    }
  },
  methods: {},
  watch: {
    $route(val) {
      // console.log(val)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .nav-footer {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 0.98rem;
    background: @tab-general-bg-color;
    display: block;
    z-index: 100;

    footer {
      font-size: 0;
      border-top: 1px solid #e7e7e7;
      border-bottom: 1px solid #f8f8f8;
      padding-top: 0.12rem;
      line-height: 1.2;
      width: 100%;
      height: 0.98rem;
      display: flex;

      a {
        text-decoration: none;
        color: @base-font-color;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        text-align: center;
        box-sizing: border-box;
        display: block;
        font-size: 0.22rem;
        position: relative;

        .badge {
          position: absolute;
          margin: 0;
          top: -0.05rem;
          right: 0.3rem;
          padding: 0.03rem;
          text-align: center;
          width: 0.3rem;
          height: 0.3rem;
          border-radius: 50%;
          background: #f43530;

          span {
            font-size: 0.18rem;
            color: #fff;
            // font-weight: bold;
            text-align: center;
          }
        }

        .radios {
          position: absolute;
          margin: 0;
          top: -0.05rem;
          right: 0.5rem;
          line-height: 0.2rem;
          text-align: center;
          width: 0.2rem;
          height: 0.2rem;
          border-radius: 50%;
          background: #f43530;
        }

        .tab-0,
        .tab-1,
        .tab-2,
        .tab-3,
        .tab-4 {
          display: inline-block;
          height: 0.42rem;
          width: 0.42rem;
          background-size: cover;
        }

        .tab-0 {
          background-image: url("../assets/img/home.png");
        }

        .tab-1 {
          background-image: url("../assets/img/coll.png");
        }

        .tab-2 {
          background-image: url("../assets/img/type.png");
        }

        .tab-3 {
          background-image: url("../assets/img/car.png");
        }

        .tab-4 {
          background-image: url("../assets/img/my.png");
        }

        &:hover {
          text-decoration: none;
        }

        &.router-link-active.active {
          .tab-0 {
            background-image: url("../assets/img/home_c.png");
          }

          .tab-1 {
            background-image: url("../assets/img/coll_c.png");
          }

          .tab-2 {
            background-image: url("../assets/img/type_c.png");
          }

          .tab-3 {
            background-image: url("../assets/img/car_c.png");
          }

          .tab-4 {
            background-image: url("../assets/img/my_c.png");
          }
        }
      }

      p {
        margin: 0;
      }
    }
  }

</style>
