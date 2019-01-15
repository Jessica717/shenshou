<template>
  <!-- <common-header :h_title="h_title" :showback="false"></common-header> -->
  <div :class="red_show?'index_bg index_fixed':'index_bg'" >
    <!-- 签到按钮 -->
    <div class='sign_bg' @click="goSign" v-if='!isSign'>
      <img src='@/assets/img/pro/signIn.png' />
    </div>
    <!-- 返回顶部按钮 -->
    <return-top @returnTop='goTop'></return-top>
    <!-- 首页顶部搜索框 -->
    <div :class="top?'fixed_head i_header_bg':'fixed_head'">
      <div class='icon_bg' @click="goProtype">
        <i class='iconfont  icon-kuaijiecaidan'></i>
      </div>
      <div :class="top?'search search_bg':'search'">
        <i class='iconfont icon-search'></i>
        <span @click='searchHis'>搜索喜欢的商品</span>
        <i class='iconfont icon-saoma' @click='scan' style='float:right'></i>
      </div>
      <div class='icon_bg' @click="goLink('/news')">
        <div class='icon_radio' v-if='$store.state.home.news'>
          <span>{{$store.state.home.newsnum}}</span>
        </div>
        <i class='iconfont icon-xiaoxioff'></i>
      </div>
    </div>
    <!-- 首页轮播图 -->
    <div class='index_head' id="top" ref='top'>
      <mt-swipe :auto="3000" :speed='500' :defaultIndex='0' :continuous='true' class='swiper_bg'>
        <mt-swipe-item v-for="(item,index) in headBg" :key='index'>
          <img :src="item.image_pc" class='swiper_bg_img' @click="imgLink(item)">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!-- 首页菜单栏 -->
    <ul class='index_nav'>
      <li v-for="(navItem,index) in comNav" :key='index' @click="goPage(navItem)">
        <a href="javascript:void(0);">
          <img :src="navItem.url" alt="" srcset="">
          <span>{{navItem.text}}</span>
        </a>
      </li>
    </ul>
    <!-- 首页中奖列表 -->
    <div class='index_win_bg'>
      <div class='index_win'>
        <div class='win_bg_left'>
          <img src='@/assets/img/pro/i_w_left.png' class='i_win_left' />
        </div>
        <div class='win_bg_right'>
          <slider ref="slider" :options="options" @slide='slide'>
            <slideritem v-for="(item,index) in winList" :key="index" class='win_block' catchtouchmove='catchTouchMove'>
              <div class='win_block_info'>
                <span class='i_win_mobile'>{{item.mobile}}</span>
                <span class='i_win_name'>{{item.name}}</span>
                <span class='i_win_time'>{{item.lottery_time}}</span>
              </div>
            </slideritem>
          </slider>
        </div>
      </div>
    </div>
    <!-- 积分专区-->
    <div class='index_pro_block i_redeem' v-if='redeemList.rows!=null'>
      <div class='pro_block_head i_redeem_head'>
        <div class='i_redeem_head_left'>
          <img src='@/assets/img/pro/i_r_left.png' />
        </div>
        <div class='i_more_right' @click="goLink('/proList?type=key&point=asc&value=')">
          <span>查看更多</span>
          <i class='iconfont icon-iconfontjiantou5'></i>
        </div>
      </div>
      <div class='pro_block_body i_redeem_body'>
        <div class='i_prolist'>
          <div class='i_pro' v-for="(item,index) in redeemList.rows" :key="index" @click="goPro('normal',item.goods_id)">
            <div class='pro_img'>
              <img :src='item.gimg' v-lazy="item.gimg" />
            </div>
            <div class='pro_tag'>
              <span>积分兑换</span>
            </div>
            <div class='pro_title pro_line_one'>
              <div class='pro_level' v-if='item.promotion==1'>
                <img src='@/assets/img/member/cu.png' />
                <span>限时购</span>
              </div>
              {{item.gname}}
            </div>
            <div class='pro_price'>
              <div class='pro_price_line'>
                <div class='pro_flex'>
                  <div class='pro_inter_img'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral'>{{item.point}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 购物商城 -->
    <div class='index_pro_block i_shop' v-if='shopList.rows!=null'>
      <div class='pro_block_head i_shop_head'>
        <div class='i_shop_head_left'>
          <img src='@/assets/img/pro/i_m_left.png' />
        </div>
        <div class='i_more_right' @click="goLink('/proList?type=key&price=asc&value=')">
          <span>查看更多</span>
          <i class='iconfont icon-iconfontjiantou5'></i>
        </div>
      </div>
      <div class='pro_block_body i_shop_body'>
        <div class='i_prolist'>
          <div class='i_pro' v-for="(item,index) in shopList.rows" :key="index" @click="goPro('normal',item.goods_id)">
            <div class='pro_img'>
              <img :src='item.gimg' v-lazy="item.gimg" />
            </div>
            <div class='pro_title pro_line_two'>
              <div class='pro_level' v-if='item.promotion==1'>
                <img src='@/assets/img/member/cu.png' />
                <span>限时购</span>
              </div>
              {{item.gname}}
            </div>
            <div class='pro_price'>
              <div class='pro_price_line'>
                <div class='pro_flex'>
                  <div class='pro_flex'>
                    <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}</span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                  </div>
                  <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>
              </div>
              <div style='display:flex;align-items:center;justify-content:space-between;'>
                <div style='display:inline-flex;align-items:center;'>
                  <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                  <span class='pro_orig line'>￥{{item.price_market}}</span>
                </div>
                <div class='pro_count'>销量:{{item.buy_count}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 限时促销倒计时 -->
    <div class='index_pro_block i_flash_sale' v-if='isSale'>
      <div class='pro_block_head i_sale_head'>
        <div class='i_sale_head_left'>
          <img src='@/assets/img/pro/i_s_left.png' class='f_sale_bg' />
          <div>
            <span class='sale_time_style'>{{saleTime.hou}}</span>
            <span class='sale_icon_style'>：</span>
            <span class='sale_time_style'>{{saleTime.min}}</span>
            <span class='sale_icon_style'>：</span>
            <span class='sale_time_style'>{{saleTime.sec}}</span>
          </div>
        </div>
        <div class='i_more_right' @click="goLink('/flash?type=1')">
          <span>查看更多</span>
          <i class='iconfont icon-iconfontjiantou5'></i>
        </div>
      </div>
      <div class='pro_block_body i_sale_body'>
        <div class='i_sale_info'>
          <div class='i_sale_info_pro' v-for='(item,index) in saleList' :key="index" @click="goPro('normal',item.goods_id)">
            <div class='i_sale_info_pro_top'>
              <img :src='item.img' />
            </div>
            <div class='i_sale_info_pro_bottom'>
              <div class='pro_price'>
                <div class='pro_price_line'>
                  <div class='pro_flex'>
                    <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_combine}}</span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                  </div>
                  <div class='pro_flex'>
                    <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                    <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point_combine}}</span>
                  </div>
                </div>
              </div>
              <div class='pro_title pro_line_one'>{{item.name}}</div>
            </div>
          </div>
        </div>
        <!-- </scroll-div> -->
      </div>
    </div>
    <!-- 本周上新 -->
    <div class='index_pro_block i_new' v-if='newList.rows!=null'>
      <div class='pro_block_head i_new_head'>
        <div class='i_new_head_left'>
          <img src='@/assets/img/pro/i_n_left.png' />
        </div>
      </div>
      <div class='pro_block_body i_new_body'>
        <div class='i_adv' @click='goUrl(newList.advert.href_type,newList.advert.href_id)' v-if='newList.advert!=undefined'>
          <img :src='newList.advert.img' />
        </div>
        <div class='i_new_list'>
          <div class='i_new_block' v-for="(item,index) in newList.rows" :key="index" @click="goPro('normal',item.goods_id)">
            <div class='pro_img'>
              <img :src='item.gimg' v-lazy="item.gimg" />
            </div>
            <div class='pro_title pro_line_one'>
              <div class='pro_level' v-if='item.promotion==1'>
                <img src='@/assets/img/member/cu.png' />
                <span>限时购</span>
              </div>
              {{item.gname}}
            </div>
            <div class='pro_price'>
              <div class='pro_price_line'>
                <div class='pro_flex'>
                  <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_combine}}</span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                </div>
                <div class='pro_flex'>
                  <div class='pro_inter_img' v-if='item.deal_type>=4'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point_combine}}</span>
                </div>
              </div>
              <div style='display:flex;align-items:center;' v-if='item.deal_type!=1&&item.point>0'>
                <span class='pro_orig pro_bg'>积分兑换</span>
                <span class='pro_orig'>{{item.point}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 热销产品 -->
    <div class='index_pro_block i_hot' v-if='hotList.rows!=null||hotList.advert!=undefined'>
      <div class='pro_block_head i_hot_head'>
        <div class='i_hot_head_left'>
          <img src='@/assets/img/pro/i_h_left.png' />
        </div>
      </div>
      <div class='pro_block_body i_hot_body'>
        <div class='i_hot_top_block'>
          <div class='i_hot_img' @click='goUrl(hotList.advert.href_type,hotList.advert.href_id)' v-if='hotList.advert!=undefined'>
            <img :src='hotList.advert.img' />
          </div>
          <div class='i_hot_pro'>
            <div style='display:flex;align-items:center;justify-content:space-between;margin-top:10/100rem;'>
              <span class='i_hot_pro_name'>{{hotList.advert.goods.name}}</span>
              <span class='i_hot_pro_market'>￥{{hotList.advert.goods.price_market}}</span>
            </div>
            <div style='display:flex;align-items:center;justify-content:space-between;'>
              <div v-if='hotList.advert.goods.point>0'>
                <span class='i_hot_show_title' v-if='hotList.advert.goods.point>0'>积分兑换：</span>
                <span class='i_hot_pro_point' v-if='hotList.advert.goods.point>0'>{{hotList.advert.goods.point}}</span>
              </div>
              <div v-if='hotList.advert.goods.price_sell>0'>
                <span class='i_hot_pro_price' v-if='hotList.advert.goods.price_sell>0'>￥{{hotList.advert.goods.price_sell}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class='i_prolist'>
          <div class='i_pro' v-for="(item,index) in hotList.rows" :key="index" @click="goPro('normal',item.goods_id)">
            <div class='pro_img'>
              <img :src='item.gimg' v-lazy="item.gimg" />
            </div>
            <div class='pro_title pro_line_two'>
              <div class='pro_level' v-if='item.promotion==1'>
                <img src='@/assets/img/member/cu.png' />
                <span>限时购</span>
              </div>
              {{item.name}}
            </div>
            <div class='pro_price'>
              <div class='pro_price_line'>
                <div class='pro_flex'>
                  <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}</span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                </div>
                <div class='pro_flex'>
                  <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>
              </div>
              <div style='display:flex;align-items:center;justify-content:space-between;'>
                <div style='display:inline-flex;align-items:center;'>
                  <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                  <span class='pro_orig line'>￥{{item.price_market}}</span>
                </div>
                <div class='pro_count'>销量:{{item.buy_count}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 精品分类 -->
    <div class='i_type' v-if='downList.length>0'>
      <div class='i_type_head'>
        <div class='i_type_head_left'>
          <img src='@/assets/img/pro/i_t_left.png' />
        </div>
        <div class='i_more_right' @click='goProtype'>
          <span>查看更多</span>
          <i class='iconfont icon-iconfontjiantou5'></i>
        </div>
      </div>
      <div class='i_type_body'>
        <div class='i_type_block' v-for='(item,index) in downList' :key='index' @click='goTypeList(index,item.id)'>
          <img :src='item.icon' />
        </div>
      </div>
    </div>
    <!-- 热门推荐 -->
    <div class='index_pro_block i_recom' v-if='recomList.rows!=null'>
      <div class='pro_block_head i_recom_head'>
        <div class='i_recom_head_left'>
          <img src='@/assets/img/pro/i_recom_left.png' />
        </div>
      </div>
      <div class='pro_block_body i_recom_body'>
        <div class='i_adv' @click='goUrl(recomList.advert.href_type,recomList.advert.href_id)' v-if='recomList.advert!=undefined'
          style='box-shadow:none;'>
          <img :src='recomList.advert.img' />
        </div>
        <div class='i_prolist'>
          <div class='i_pro' v-for="(item,index) in recomList.rows" :key="index" @click="goPro('normal',item.goods_id)">
            <div class='pro_img'>
              <img :src='item.gimg' v-lazy="item.gimg" />
            </div>
            <div class='pro_title pro_line_two'>
              <div class='pro_level' v-if='item.promotion==1'>
                <img src='@/assets/img/member/cu.png' />
                <span>限时购</span>
              </div>
              {{item.gname}}
            </div>
            <div class='pro_price'>
              <div class='pro_price_line'>
                <div class='pro_flex'>
                  <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}</span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                </div>
                <div class='pro_flex'>
                  <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>
              </div>
              <div style='display:flex;align-items:center;justify-content:space-between;'>
                <div style='display:inline-flex;align-items:center;'>
                  <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                  <span class='pro_orig line'>￥{{item.price_market}}</span>
                </div>
                <div class='pro_count'>销量:{{item.buy_count}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 猜你喜欢 -->
    <div class='index_pro_block i_like' v-if='likeList.length>0'>
      <div class='pro_block_head i_like_head'>
        <div class='i_like_head_left'>
          <img src='@/assets/img/pro/i_l_left.png' />
        </div>
      </div>
      <div class='pro_block_body i_like_body'>
        <div class='i_prolist'>
          <div class='i_pro' v-for="(item,index) in likeList" :key="index" @click="goPro('normal',item.goods_id)">
            <div class='pro_img'>
              <img :src='item.gimg' v-lazy="item.gimg" />
            </div>
            <div class='pro_title pro_line_two'>
              <div class='pro_level' v-if='item.promotion==1'>
                <img src='@/assets/img/member/cu.png' />
                <span>限时购</span>
              </div>
              {{item.gname}}
            </div>
            <div class='pro_price'>
              <div class='pro_price_line'>
                <div class='pro_flex'>
                  <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}} </span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}</span>
                  <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>

                </div>
                <div class='pro_flex'>
                  <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                  <span class='pro_integral' v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                </div>

              </div>
              <div style='display:flex;align-items:center;justify-content:space-between;'>
                <div style='display:inline-flex;align-items:center;'>
                  <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                  <span class='pro_orig line'>￥{{item.price_market}}</span>
                </div>
                <div class='pro_count'>销量:{{item.buy_count}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='i_like_bottom' @click='changeLike'>
        <img src='@/assets/img/member/change.png' />
      </div>
    </div>
    <div class='open_model_bg' v-if="red_show&&boxType=='cou'" catchtouchmove="ture"></div>
    <div class='open_model' v-if="red_show&&boxType=='cou'" catchtouchmove="ture">
      <img src='@/assets/img/member/r_01.png' class='package' />
      <i class='iconfont icon-guanbi2' @click='closeModel'></i>
      <div class='model_info'>
        <div class='top_title'>
          {{redInfo.title}}
        </div>
        <div class='title'>
          恭喜您获得
        </div>
        <div class='price'>
          <span>¥{{redInfo.cashworth}}</span>
          <span class='price_max'>满{{redInfo.order_price}}可用</span>
        </div>
        <div class='time'>
          即日起至{{redInfo.totime}}
        </div>
      </div>
      <img src='@/assets/img/member/r_btn.png' class='open_btn' @click='getCou(redInfo.id)' />
    </div>
    <!-- 首页引导大转盘弹框 -->
    <div class='open_model_bg' v-if="red_show&&boxType=='lottery'" catchtouchmove="ture"></div>
    <div class='open_model' v-if="red_show&&boxType=='lottery'" catchtouchmove="ture">
      <img :src='lotteryImg' class='lottery_img' @click="goLottery('/lottery')" />
      <i class='iconfont icon-guanbi2' @click='closeModel'></i>
    </div>
  </div>
</template>

<script>
import {
  Swipe,
  SwipeItem,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  slider,
  slideritem
} from 'vue-concise-slider' // 竖直滚动列表
import {
  mapMutations,
  mapGetters
} from 'vuex'
import returnTop from '@/components/return-top'
import {
  countDown,
  parseTime
} from '@/store/pubilc.js'
import {
  getBanner,
  getWin,
  getProList,
  getRecomType,
  getLikeList,
  getFlashList,
  getNewsRead,
  getCarList,
  getPersonInfo,
  getIndexModel,
  rceiveCou,
  setBannerClick
} from '@/api/index'
import nav03 from '@/assets/img/pro/i_nav_03.png'
import nav09 from '@/assets/img/pro/i_nav_09.png'
import nav07 from '@/assets/img/pro/i_nav_07.png'
import nav13 from '@/assets/img/pro/i_nav_13.png'
import nav11 from '@/assets/img/pro/i_nav_11.png'
export default {
  name: 'Index',
  components: {
    Swipe,
    SwipeItem,
    slider,
    slideritem,
    returnTop,
    Lazyload,
    Toast
  },
  data() {
    return {
      headBg: [],
      result: [],
      value: '',
      comNav: [{
        nav: true,
        url: nav03,
        text: '购物商城',
        link: '/proList?type=key&price=asc&value='
      },
      {
        nav: true,
        url: nav09,
        text: '限时抢购',
        link: '/flash'
      },
      {
        nav: true,
        url: nav07,
        text: '免费试用',
        link: '/try'
      },
      {
        nav: true,
        url: nav13,
        text: '超值拼团',
        link: '/group'
      },
      {
        nav: false,
        url: nav11,
        text: '幸运抽奖',
        link: '/lottery'
      }
      ],
      winList: [],
      win_list_num: 8,
      options: {
        currentPage: 0, // 默认开始页
        thresholdDistance: 500, // 滑动距离阈值判定
        thresholdTime: 100, // 滑动时间阈值判定
        autoplay: 3000, // 自动播放:时间[ms]
        itemAnimation: true,
        centeredSlides: true,
        direction: 'vertical', // 垂直滚动
        loop: true, // 无限循环
        loopedSlides: 8, // 多级滚动时，需要添加前后遍历数
        slidesToScroll: 4, // 需要滚动页面的数量
        timingFunction: 'ease', // 滑动方式
        speed: 1000, // 滑动速度
        pagination: false // 不显示滑动圆点
      },
      time: '', // 定时器
      endTime: '', // 倒计时秒数
      saleTime: {}, // 倒计时时分秒数组
      isSale: false, // 是否凶案是促销模块
      isTop: false, // 显示返回顶部按钮
      dataCopy: false, // 滑动赋值商品列表
      top: false,
      isSign: true,
      isShow: false, // 是否显示整体区域
      like_page: 1, // 猜你喜欢第n页
      proList: [], // 首页商品列表
      redeemList: {}, // 积分专区
      shopList: {}, // 购物商城
      newList: {}, // 本周上新
      hotList: {}, // 热销商品
      recomList: {}, // 热推商品
      downList: [], // 精品分类
      likeList: [], // 猜你喜欢
      boxType: '',
      red_show: false,
      lotteryImg: '',
      redInfo: {}
    }
  },
  created() {
    let plus = window.plus
    plus.navigator.setStatusBarBackground('#f9f9f9')
    window.plus.navigator.setStatusBarStyle('dark')
  },
  mounted() {
    document.getElementById('top').scrollIntoView(false)
    // this.$router.options.routes = []
    // this.$router.addRoutes([])
    // 获取轮播图
    this.getBanner()
    // 获取中奖名单
    this.getWinList()
    // 获取首页商品列表
    this.getList()
    // 获取促销商品
    this.getFlash()
    let storage = window.localStorage
    console.log(storage.getItem('isLogin'))
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      // 获取首页弹框，查询购物车数量
      this.getAlaways()
      // 获取消息是否已读,是否可以签到,是否会员生日
      this.getNews()
    }
    // 监听滚动条高度
    this.tabScroll()
  },
  methods: {
    ...mapMutations({
      setCarnum: 'SET_CARNUM',
      setIsbind: 'SET_ISBIND',
      setScore: 'SET_SCORE',
      setNews: 'SET_NEWS',
      setNewsnum: 'SET_NEWSNUM',
      setIssign: 'SET_ISSIGN',
      setUserInfo: 'SET_USERINFO'
    }),
    tabScroll() {
      window.addEventListener('scroll', this.handleScroll)
    },
    getAlaways() {
      let that = this
      getCarList({
        p: 1,
        limit: 10
      }).then(res => {
        if (res.isSuccess) {
          that.setCarnum(res.data.rows_total)
        }
      })
      getIndexModel().then(res => {
        if (res.isSuccess) {
          if (res.data.lottery !== '' && res.data.lottery !== undefined) {
            that.boxType = 'lottery'
            that.red_show = true
            that.lotteryImg = res.data.lottery
          } else {
            console.log(typeof res.data.coupon)
            if (res.data.coupon.length === 0) {
              res.data.coupon = ''
            }
            if (res.data.coupon !== '') {
              res.data.coupon.totime = parseTime(
                res.data.coupon.totime,
                '{y}-{m}-{d}'
              )
              that.boxType = 'cou'
              that.red_show = true
              that.redInfo = res.data.coupon
            } else {
              that.red_show = false
            }
          }
          console.log(that.red_show)
          console.log(that.boxType)
        }
      })
      getPersonInfo().then(res => {
        if (res.isSuccess) {
          let userInfo = {}
          userInfo.avatar = res.data.image
          userInfo.level = res.data.rankName
          userInfo.isShow = 1
          userInfo.nickname = res.data.nickname
          that.setUserInfo(userInfo)
          this.setScore(res.data.point)
          if (res.data.mobile !== '' && res.data.mobile !== null) {
            that.setIsbind(true)
          } else {
            that.setIsbind(false)
          }
          that.userInfo = that.$store.state.home.userInfo
        }
      })
    },
    getNews() {
      let that = this
      getNewsRead().then(res => {
        if (res.isSuccess) {
          // 判断是否签到
          if (res.data.is_sign === 1) {
            // that.isSign = true
            that.setIssign(true)
          } else {
            that.setIssign(false)
            // that.isSign = false
          }
          that.isSign = that.$store.state.home.issign
          // 判断是否有新消息
          if (res.data.num > 0) {
            that.setNews(true)
            that.setNewsnum(res.data.num)
          } else {
            that.setNews(false)
            that.setNewsnum(0)
          }
        }
      })
    },
    handleScroll() {
      var scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
      var browserHeight = window.outerHeight // 浏览器高度
      if (window.localStorage.getItem('leaveIndex') !== 'false') {
        scrollTop = 0
        window.localStorage.setItem('leaveIndex', false)
      }
      if (scrollTop > 0) {
        if (!this.top) {
          this.top = true
        }
        if (scrollTop > browserHeight) {
          if (this.isTop) {
            this.isTop = false
          }
          if (this.dataCopy === false) {
            // 获取猜你喜欢
            this.getLike()
            // 获取精品分类
            this.getTypeList()
            // 给本周上新，热销商品，热推商品赋值
            this.newList = this.proList.new // 本周上新
            this.hotList = this.proList.buy // 热销商品
            this.recomList = this.proList.hot // 热推商品
            this.dataCopy = true
          }
        } else {
          if (!this.isTop) {
            this.isTop = true
          }
        }
      } else {
        this.isTop = false
        this.top = false
      }
    },
    goSign() {
      let that = this
      if (that.$store.state.home.isbind === 'false' || that.$store.state.home.isbind === false) {
        that.$router.togo({
          path: '/bind?visit=3'
        })
      } else {
        that.$router.togo({
          path: '/mySignIn'
        })
      }
      // getPersonInfo().then(res => {
      //   if (res.isSuccess) {
      //     let userInfo = {}
      //     userInfo.avatar = res.data.image
      //     userInfo.level = res.data.rankName
      //     userInfo.isShow = 1
      //     userInfo.nickname = res.data.nickname
      //     that.setUserInfo(userInfo)
      //     this.setScore(res.data.point)
      //     if (res.data.mobile !== '' && res.data.mobile !== null) {
      //       that.setIsbind(true)
      //     } else {
      //       that.setIsbind(false)
      //     }
      //     that.userInfo = that.$store.state.home.userInfo
      //     if (that.$store.state.home.isbind === 'false' || that.$store.state.home.isbind === false) {
      //       that.$router.togo({
      //         path: '/bind?visit=3'
      //       })
      //     } else {
      //       that.$router.togo({
      //         path: '/mySignIn'
      //       })
      //     }
      //   }
      // })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('top').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getBanner() {
      getBanner().then(res => {
        if (res.isSuccess) {
          this.headBg = res.data.rows
        }
      })
    },
    getWinList() {
      getWin(this.win_list_num).then(res => {
        if (res.isSuccess) {
          // var list = []
          // for (var i = 0; i < res.data.length; i++) {
          //   list.push(res.data[i])
          //   if ((i + 1) % 4 === 0) {
          //     this.winList.push({ list: list })
          //     list = []
          //   }
          // }
          // if (res.data.length < 4) {
          //   this.winList.push(list)
          // }
          this.winList = res.data
        }
      })
    },
    getList() {
      getProList().then(res => {
        if (res.isSuccess) {
          this.proList = res.data
          this.redeemList = res.data.list
          this.shopList = res.data.money
        }
      })
    },
    searchHis() {
      this.$router.togo({
        path: '/search'
      })
    },
    // 猜你喜欢换一换
    changeLike() {
      ++this.like_page
      this.getLike()
    },
    // 获取猜你喜欢
    getLike() {
      getLikeList(this.like_page).then(res => {
        if (res.isSuccess) {
          this.likeList = res.data
        } else {
          this.isShow = true
        }
      })
    },
    // 获取顶部分类
    getTypeList() {
      getRecomType().then(res => {
        this.downList = res.top
      })
    },
    // 获取促销商品
    getFlash() {
      getFlashList().then(res => {
        if (res.isSuccess) {
          if (res.data != null) {
            this.isSale = true
            this.isShow = true
            this.saleList = res.data
            if (res.countdown > 0) {
              this.endTime = res.countdown
              this.saleTime = countDown(res.countdown)
              this.time = setInterval(
                function () {
                  --res.countdown
                  this.saleTime = countDown(res.countdown)
                }.bind(this),
                1000
              )
            }
          } else {
            this.isSale = false
            this.isShow = true
          }
        } else {
          this.isSale = false
          this.isShow = true
        }
      })
    },
    imgLink(e) {
      let that = this
      setBannerClick(e.id).then(res => {
        if (res.isSuccess) {
          console.log(res)
        }
      })
      let pageLink = ''
      console.log(e)
      switch (e.type) {
        // 1 商品，3是试用，4是团购，5 文章，6 大转盘
        case '1':
          pageLink = '/proDetail?type=normal&id=' + e.relevance_id
          break
        case '3':
          pageLink = '/tryOutdetail?id=' + e.activity_id
          break
        case '4':
          pageLink =
              '/proDetail?type=group&id=' + e.activity_id + '&goods_id=' + e.relevance_id
          break
        case '5':
          pageLink = '/hotArticle?id=' + e.relevance_id + '&name=文章详情'
          break
        case '6':
          pageLink = '/lottery'
          break
            // case '7':
            //   pageLink = '/fruitDetail?type=fruits&id=' + e.relevance_id
            //   break
      }
      if (e.type === '6') {
        that.$router.replace({
          path: pageLink
        })
      } else {
        that.$router.togo({
          path: pageLink
        })
      }
    },
    // 跳转商品分类
    goProtype() {
      this.$router.togo({
        path: '/type'
      })
    },
    goTypeList(id, typeid) {
      this.$router.togo({
        path: '/type?id=' + (id + 1) + '&typeid=' + typeid
      })
    },
    // 拉起摄像头扫码
    scan() {
      this.$router.togo({
        path: '/scan?type=scan'
      })
    },
    closeModel() {
      this.red_show = false
    },
    getCou(id) {
      let that = this
      rceiveCou(id).then(res => {
        if (res.isSuccess) {
          Toast({
            message: '领取成功',
            iconClass: 'iconfont icon-dui1',
            duration: 1000
          })
          setTimeout(function () {
            that.red_show = false
          }, 1000)
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
          setTimeout(function () {
            that.red_show = false
          }, 1000)
        }
      })
    },
    goLottery(url) {
      this.$router.replace({
        path: url
      })
    },
    // Listener event
    slide(data) {},
    goPage(value) {
      console.log(value.nav)
      if (value.nav) {
        this.$router.togo({
          path: value.link
        })
      } else {
        this.$router.replace({
          path: value.link
        })
      }
    },
    goPro(type, id) {
      this.$router.togo({
        path: '/proDetail?type=' + type + '&id=' + id
      })
    },
    goLink(url) {
      this.$router.togo({
        path: url
      })
    },
    goUrl(type, id) {
      if (type === 1 || type === '1') {
        this.$router.togo({
          path: '/proDetail?type=normal' + '&id=' + id
        })
        // 商品详情
      } else {
        // 跳转分类
        if (id !== 0) {
          let tid = 0
          for (let i = 0; i < this.downList.length; i++) {
            if (this.downList[i].id === id) {
              tid = i
            }
          }
          console.log(id)
          this.$router.replace({
            path: '/type?id=' + (tid + 1) + '&typeid=' + id
          })
        }
      }
    }
  },
  beforeDestroy() {
    this.$refs.slider.$emit('autoplayStop')
    window.localStorage.setItem('leaveIndex', true)
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.time)
  },
  computed: {
    ...mapGetters([
      'number',
      'carnum',
      'isbind',
      'score',
      'news',
      'newsnum',
      'issign'
    ])
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";

  // @import '~styles/variabl less';
  .index_bg {
    background: #f2f2f2;
    padding-bottom: 0.98rem;
    position: relative;

    .sign_bg {
      position: fixed;
      right: 16/100rem;
      top: 60%;
      z-index: 100;

      img {
        width: 88/100rem;
        height: 88/100rem;
      }
    }

    .fixed_head {
      padding: 0 0.3rem;
      height: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      top: 0;
      width: 94%;
      z-index: 50;
      position: fixed;
      background: transparent;

      .icon_bg {
        width: 0.6rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        position: relative;

        .iconfont {
          color: #fff;
        }

        .icon_radio {
          position: absolute;
          margin: 0;
          top: 4/100rem;
          right: -2/100rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26/100rem;
          height: 26/100rem;
          border-radius: 50%;
          background: #f00;

          span {
            font-size: 0.14rem;
            color: #fff;
            display: inline-flex;
            align-items: center;
          }
        }
      }

      .search {
        width: 64%;
        height: 0.56rem;
        line-height: 0.56rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.7);
        padding: 0 0.3rem;

        .iconfont {
          color: #9b9b9b;
          font-size: 0.3rem;
          font-weight: bold;
          float: left;
          display: flex;
        }

        span {
          font-size: 0.24rem;
          color: #9b9b9b;
          float: left;
          width: 70%;
          text-align: left;
        }
      }

      .search_bg {
        background: #f2f2f2;
      }
    }

    .i_header_bg {
      background: #fff;
    }

    .index_head {
      height: 4.5rem;
      width: 100%;

      .swiper_bg_img {
        height: 4.5rem;
        width: 100%;
      }
    }

    .index_nav {
      height: 1.54rem;
      width: 100%;
      white-space: nowrap;
      padding: 0.3rem 0;
      text-align: center;
      background: #fff;

      li {
        width: 1.3rem;
        display: inline-block;
        padding: 0.1rem;

        a {
          display: inline-block;

          img {
            width: 0.88rem;
            height: 0.88rem;
          }

          span {
            width: 1.3rem;
            font-size: 0.25rem;
            color: #555;
            display: block;
            text-align: center;
          }
        }
      }
    }

    .index_win_bg {
      height: 1.84rem;
      background: #f6f6f6;

      .index_win {
        height: 1.52rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 0.16rem 0.22rem;

        .win_bg_left {
          img {
            width: 1.68rem;
            // height: 0.7rem;
          }
        }

        .win_bg_right {
          font-size: 0.2rem;
          color: #767676;
          padding: 0.16rem 0.22rem;
          z-index: 10;
          height: 1.2rem;
          width: 4.86rem;
          background: #fff;
          border-radius: 0.08rem;

          .win_block {
            display: block;
            height: 0.3rem !important;

            .win_block_info {
              display: flex;
              justify-content: space-between;
              width: 4.9rem !important;
              height: 0.3rem !important;
              align-items: center;
              color: #000;

              .i_win_mobile {
                width: 1.3rem;
                text-align: left;
              }

              .i_win_name {
                width: 1.86rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .i_win_time {
                width: 1.5rem;
              }
            }
          }
        }
      }
    }

    .index_pro_block {
      background: #fff;

      .pro_block_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 34/100rem 30/100rem 34/100rem 32/100rem;

        /* 上右下左 */
        .i_redeem_head_left {
          img {
            height: 66/100rem;
            width: 168/100rem;
          }
        }

        .i_shop_head_left {
          img {
            width: 174/100rem;
            height: 66/100rem;
          }
        }

        .i_sale_head_left {
          font-size: 26/100rem;
          color: #343434;
          z-index: 10;
          display: inline-flex;
          justify-content: flex-start;
          align-items: flex-end;

          .f_sale_bg {
            height: 63/100rem;
            width: 150/100rem;
          }

          .sale_time_style {
            display: inline-block;
            text-align: center;
            height: 48/100rem;
            line-height: 48/100rem;
            width: 34/100rem;
            padding: 0 4/100rem;
            background: #000;
            font-size: 24/100rem;
            color: #fff;
            margin: 0 5/100rem;
          }
        }

        .i_new_head_left {
          img {
            width: 153/100rem;
            height: 64/100rem;
          }
        }

        .i_hot_head_left {
          img {
            width: 200/100rem;
            height: 66/100rem;
          }
        }

        .i_recom_head_left {
          img {
            width: 261/100rem;
            height: 66/100rem;
          }
        }

        .i_like_head_left {
          img {
            width: 199/100rem;
            height: 64/100rem;
          }
        }

        .i_more_right {
          display: inline-flex;
          align-items: center;

          span {
            color: #989898;
            font-size: 24/100rem;
          }

          .iconfont {
            display: inline-flex;
            align-items: center;
            color: #989898;
          }
        }
      }

      .pro_block_body {
        padding: 0 30/100rem;

        .i_adv {
          height: 260/100rem;
          border-radius: 26/100rem;
          box-shadow: 0/100rem 6/100rem 10/100rem 0/100rem #bdbdbd;
          margin: 20/100rem 0;

          img {
            height: 260/100rem;
            width: 100%;
          }
        }

        .i_hot_top_block {
          background: #fff;
          box-shadow: 0/100rem 6/100rem 10/100rem 0/100rem #bdbdbd;
          margin-bottom: 20/100rem;
          border-radius: 20/100rem;

          .i_hot_img {
            img {
              height: 280/100rem;
              width: 100%;
              border-top-left-radius: 20/100rem;
              border-top-right-radius: 20/100rem;
            }
          }

          .i_hot_pro {
            height: 100/100rem;
            background: #fff;
            padding: 0 22/100rem;
            border-bottom-left-radius: 20/100rem;
            border-bottom-right-radius: 20/100rem;

            .i_hot_pro_name {
              width: 50%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #989898;
              font-size: 28/100rem;
            }

            .i_hot_pro_market {
              font-size: 30/100rem;
              font-weight: bold;
              color: #979797;
              text-decoration: line-through;
            }

            .i_hot_show_title {
              font-size: 24/100rem;
              color: #ff8d97;
            }

            .i_hot_pro_point {
              font-size: 36/100rem;
              font-weight: bold;
              color: #666;
            }

            .i_hot_pro_price {
              font-size: 36/100rem;
              font-weight: bold;
              color: #2f2f2f;
            }
          }
        }

        .i_sale_info {
          height: 358/100rem;
          width: 100%;
          white-space: nowrap;
          overflow-x: scroll;

          .i_sale_info_pro {
            width: 262/100rem;
            height: 328/100rem;
            background: #fff;
            display: inline-block;
            margin-right: 26/100rem;

            .i_sale_info_pro_top {
              img {
                width: 238/100rem;
                height: 238/100rem;
              }
            }

            .i_sale_info_pro_bottom {
              .pro_title {
                font-size: 26/100rem;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .pro_price {
                align-items: center;
                justify-content: center;

                .pro_price_line {
                  display: flex;
                  align-items: center;
                  line-height: 0.48rem;

                  .pro_flex {
                    display: inline-flex;
                    align-items: center;

                    .pro_inter_img {
                      color: #ff8d97;

                      .iconfont {
                        font-size: 30/100rem;
                        font-weight: bold;
                        color: #ff8d97;
                      }
                    }

                    .pro_integral {
                      font-size: 30/100rem;
                      font-weight: bold;
                      color: #ff8d97;
                    }

                    .peo_nowprice {
                      color: #ff8d97;
                      font-size: 30/100rem;
                      font-weight: bold;
                    }

                    .pro_orig {
                      font-size: 30/100rem;
                      font-weight: bold;
                      color: #9d9d9d;
                      text-decoration: line-through;
                    }
                  }
                }
              }
            }
          }
        }
      }

      .i_prolist {
        background: #fff;
        overflow: hidden;

        .i_pro {
          width: 336/100rem;
          float: left;
          background: #fff;
          margin-bottom: 24/100rem;
          position: relative;

          .pro_img {
            position: relative;

            img {
              width: 336/100rem;
              height: 336/100rem;
            }
          }

          .pro_tag {
            margin-top: 20/100rem;
            font-size: 20/100rem;
            width: 120/100rem;
            background: #ff8d97;
            color: #fff;
            border-radius: 10/100rem;
            margin-right: 6/100rem;
            line-height: 1.4;
            text-align: center;
          }

          .pro_title {
            font-size: 24/100rem;
            color: #333;
            margin-top: 10/100rem;

            img {
              width: 88/100rem;
              height: 30/100rem;
            }

            .pro_level {
              width: 88/100rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              position: relative;
              height: 30/100rem;

              span {
                font-size: 16/100rem;
                color: #fefefe;
                position: absolute;
                left: 44%;
                top: 50%;
                transform: translate(-50%, -50%);
                white-space: nowrap;
              }

              .iconfont {
                color: #ff8d97;
                display: inline-flex;
              }
            }
          }

          .pro_price {
            .pro_price_line {
              display: flex;
              align-items: center;
              line-height: 0.48rem;
            }

            .pro_flex {
              display: inline-flex;
              align-items: center;
            }

            .peo_nowprice {
              color: #ff8d97;
              font-size: 30/100rem;
              font-weight: bold;
            }

            .pro_integral {
              font-size: 30/100rem;
              color: #ff8d97;
              font-weight: bold;
            }

            .pro_integral_add {
              font-size: 30/100rem;
              color: #333;
            }

            .pro_inter_img {
              display: flex;
              align-items: flex-end;

              .iconfont {
                display: inline-flex;
                font-size: 30/100rem;
                color: #ff8d97;
                font-weight: bold;
              }
            }

            .pro_orig {
              font-size: 24/100rem;
              color: #888;
              /* width: 80/100rem; */
            }

            .pro_bg {
              background: #ff8d97;
              color: #fff;
              border-radius: 8/100rem;
              text-align: center;
              font-size: 20/100rem;
              margin-right: 10/100rem;
              /* width: 100/100rem; */
              padding: 0 8/100rem;
              line-height: 1.4;
            }

            .line {
              text-decoration: line-through;
              /* margin-left: 14/100rem; */
            }

            .pro_count {
              font-size: 23/100rem;
              color: #888;
            }
          }

          .pro_line_one {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }

          .pro_line_two {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            min-height: 70/100rem;
            text-align: left;
          }
        }

        .i_pro:nth-child(even) {
          float: right;
        }
      }

      .i_new_list {
        overflow: hidden;

        .i_new_block {
          width: 220/100rem;
          margin-right: 14/100rem;
          margin-bottom: 12/100rem;
          float: left;
          height: 368/100rem;

          .pro_img {
            img {
              width: 220/100rem;
              height: 220/100rem;
            }
          }

          .pro_title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 26/100rem;
            color: #333;
            margin-top: 20/100rem;
            text-align: left;

            img {
              width: 88/100rem;
              height: 30/100rem;
            }

            .pro_level {
              width: 88/100rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              position: relative;
              height: 30/100rem;

              span {
                font-size: 16/100rem;
                color: #fefefe;
                position: absolute;
                left: 44%;
                top: 50%;
                transform: translate(-50%, -50%);
                white-space: nowrap;
              }

              .iconfont {
                color: #ff8d97;
                display: inline-flex;
              }
            }
          }

          .pro_price {
            min-height: 80/100rem;

            .pro_price_line {
              display: flex;
              align-items: center;
              line-height: 0.48rem;
            }

            .pro_flex {
              display: inline-flex;
              align-items: center;
            }

            .pro_level {
              position: relative;

              image {
                width: 38/100rem;
                height: 41/100rem;
              }

              text {
                color: #fff;
                position: absolute;
                left: 50%;
                top: 35%;
                transform: translate(-50%, -50%);
                font-size: 18/100rem;
                font-weight: bold;
              }
            }

            .peo_nowprice {
              color: #ff8d97;
              font-weight: bold;
              font-size: 26/100rem;
            }

            .pro_integral {
              font-size: 26/100rem;
              color: #ff8d97;
              font-weight: bold;
            }

            .pro_inter_img {
              display: flex;
              align-items: flex-end;

              .iconfont {
                font-size: 26/100rem;
                color: #ff8d97;
                font-weight: bold;
              }
            }

            .pro_orig {
              font-size: 24/100rem;
              color: #888;
            }

            .pro_bg {
              background: #ff8d97;
              color: #fff;
              border-radius: 8/100rem;
              text-align: center;
              font-size: 20/100rem;
              margin-right: 10/100rem;
              /* width: 100/100rem; */
              padding: 0 8/100rem;
              line-height: 1.4;
            }
          }
        }

        .i_new_block:nth-child(3n + 3) {
          margin-right: 0;
        }
      }

      .i_like_bottom {
        background: #fff;
        padding: 20/100rem 0;
        text-align: center;

        img {
          width: 264/100rem;
          height: 54/100rem;
        }
      }
    }

    .i_type {
      background: #fff;
      padding: 34/100rem 30/100rem 34/100rem 32/100rem;

      .i_type_head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .i_type_head_left {
          img {
            width: 210/100rem;
            height: 70/100rem;
          }
        }

        .i_more_right {
          display: inline-flex;
          align-items: center;

          span {
            color: #989898;
            font-size: 24/100rem;
          }

          .iconfont {
            display: inline-flex;
            align-items: center;
            color: #989898;
          }
        }
      }

      .i_type_body {
        .i_type_block {
          width: 220/100rem;
          display: inline-block;
          height: 224/100rem;
          margin-right: 14/100rem;

          img {
            height: 224/100rem;
            width: 100%;
          }
        }

        .i_type_block:last-child {
          margin-right: 0;
        }

        .i_type_block:nth-child(1) {
          width: 380/100rem;

          img {
            width: 380/100rem;
          }
        }

        .i_type_block:nth-child(2) {
          width: 294/100rem;
          margin-right: 0;

          img {
            width: 294/100rem;
          }
        }
      }
    }

    .open_model_bg {
      position: fixed;
      z-index: 200;
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      height: 100%;
      top: 0;
    }

    .open_model {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 201;
      text-align: center;

      .package {
        width: 660/100rem;
        height: 757/100rem;
      }

      .lottery_img {
        width: 645/100rem;
        height: 645/100rem;
      }

      i {
        position: absolute;
        right: 8/100rem;
        top: 14%;
        font-size: 58/100rem;
        color: #ffea00;
      }

      .model_info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);

        .top_title {
          font-size: 40/100rem;
          color: #ffe790;
          margin-bottom: 38/100rem;
          font-weight: bold;
          text-align: center;
        }

        .title {
          color: #d72a19;
          font-size: 30/100rem;
          font-weight: bold;
          text-align: center;
        }

        .price {
          color: #cf1202;
          margin-bottom: 18/100rem;
          text-align: center;

          span {
            font-size: 66/100rem;
            margin: -10/100rem 0;
          }

          .price_max {
            font-size: 22/100rem;
            display: block;
            text-align: center;
          }
        }

        .time {
          font-size: 16/100rem;
          color: #774022;
          text-align: center;
        }
      }

      .open_btn {
        position: absolute;
        width: 225/100rem;
        height: 56/100rem;
        left: 51%;
        transform: translateX(-50%);
        bottom: 5%;
      }
    }
  }
  .index_fixed{
    position: fixed;
  }

</style>
