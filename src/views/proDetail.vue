<template>
  <div>
    <!-- <common-header :h_title="h_title" :showmore="true"></common-header> -->
    <!-- 返回顶部按钮 -->
    <return-top @returnTop='goTop'></return-top>
    <div :class="!modelShow?'pro_detail pro_detail_fixed':'pro_detail'" v-if='isShow' id='detail'>
      <div class='pro_header'>
        <div class='pro_header_left head_between'>
          <i @click="tohome" class="iconfont icon-jiantouarrowhead7"></i>
        </div>
        <div class='pro_header_nav'>
          <span :class="choseName=='pro'?'text_active':''" @click="chose('pro')">商品</span>
          <span :class="choseName=='com'?'text_active':''" @click="chose('com')">评价</span>
          <span :class="choseName=='more'?'text_active':''" @click="chose('more')">详情</span>
        </div>
        <div class='pro_header_icon head_between'>
          <mt-button v-if="(isColl==''&&proType!='birthday')?true:false" @click='addColl(proInfo.goods_id)'>
            <i class='iconfont icon-shoucang'></i>
          </mt-button>
          <mt-button v-if="(isColl!=''&&proType!='birthday')?true:false" @click='addColl(isColl)' style="color:#ff8d97">
            <i class='iconfont icon-yishoucang' style="color:#ff8d97"></i>
          </mt-button>
          <mt-button @click="share">
            <i class='iconfont icon-iconfontfenxiang3'></i>
          </mt-button>
        </div>
      </div>
      <div class='head_top' id="pro"></div>
      <div class='pro_body' v-if='!allCom' id='top'>
        <div class='pro_info'>
          <div class='pro_swiper'>
            <mt-swipe :auto="3000" :speed='1000' :defaultIndex='0' :continuous='true' class='swiper_bg'>
              <mt-swipe-item v-for="(item,index) in imgUrls" :key='index'>
                <img :src="item" class='slide-img'>
              </mt-swipe-item>
            </mt-swipe>
          </div>
          <div class='pro_down_sale' v-if="isFlash==1&&(proType=='normal'||proType=='flash')">
            <div class='pro_price'>
              <div style='display:flex;align-items:center;'>
                <span class='peo_nowprice' v-if='price_type==1'>￥{{default_spec.price_sell}}</span>
                <span class='peo_nowprice' v-if='price_type==4'>￥{{default_spec.price_combine}}+</span>
                <div class='pro_inter_img' v-if='price_type!=1'>
                  <i class='iconfont icon-jifen1'></i>
                </div>
                <span class='pro_integral' v-if='price_type==4'>{{default_spec.point_combine}}</span>
                <span class='pro_integral' v-if='price_type==2'>{{default_spec.point}}</span>
              </div>
              <div>
                <span>{{price_market_from}}</span>
                <span class='pro_orig'>￥{{price_market}}</span>
                <span class='pro_num'>已抢{{activity.count_num}}件</span>
              </div>
            </div>
            <div class='pro_right'>
              <div class='pro_time'>
                <span class='title'>距结束还剩:</span>
                <span class='time'>{{saleTime.day}}</span>
                <span class='text'>天</span>
                <span class='time'>{{saleTime.hou}}</span>
                <span class='text'>:</span>
                <span class='time'>{{saleTime.min}}</span>
                <span class='text'>:</span>
                <span class='time'>{{saleTime.sec}}</span>
              </div>
              <div class='pro_prop'>
                <div class='prop_bg'>
                  <span :style="{width:activity.count_num/totalNum*100+'%'}" v-if='activity.count_num/totalNum*100<100'></span>
                  <span style='width:100%' v-if='activity.count_num/totalNum*100>=100'></span>
                </div>
              </div>
            </div>
          </div>
          <div class='pro_title'>
            <div class='pro_price' v-if="isFlash==0&&(proType=='normal'||proType=='flash')">
              <!-- <div class='pro_price_left'>
                  <span class='peo_nowprice' v-if='price_type==1'>￥{{default_spec.price_sell}}</span>
                  <span class='peo_nowprice' v-if='price_type==4'>￥{{default_spec.price_combine}}+</span>
                  <div class='pro_inter_img' v-if='price_type!=1'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='price_type==4&&isFlash==0'>{{default_spec.point_combine}}</span>
                  <span class='pro_integral' v-if='price_type==2&&isFlash==0'>{{default_spec.point}}</span>
                  <span>{{price_market_from}}</span>
                  <span class='pro_orig'>￥{{price_market}}</span>
                </div> -->
              <div class='pro_sale_num'>已售出{{proInfo.buy_count}}件</div>
            </div>
            <div class='pro_price' v-if="proType=='point'||proType=='birthday'">
              <!-- <div class='pro_price_left'>
                  <span class='peo_nowprice' v-if='price_type==1'>￥{{default_spec.price_sell}}</span>
                  <span class='peo_nowprice' v-if='price_type==4'>￥{{default_spec.price_combine}}+</span>
                  <div class='pro_inter_img' v-if='price_type!=1'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='price_type==4'>{{default_spec.point_combine}}</span>
                  <span class='pro_integral' v-if='price_type==2'>{{default_spec.point}}</span>
                  <span>{{price_market_from}}</span>
                  <span class='pro_orig'>￥{{price_market}}</span>
                </div> -->
              <div class='pro_sale_num'>已售出{{proInfo.buy_count}}件</div>
            </div>
            <div :class="proType=='group'?'pro_name group_top':'pro_name'">
              <div class='pro_name_icon' v-if="isFlash==1&&(proType=='normal'||proType=='flash')||proType=='group'">
                <img src='@/assets/img/pro/group_pro.png' style='width:0.65rem;height:0.29rem;' v-if="proType=='group'" />
                <img src='@/assets/img/pro/sale_pro.png' style='width:0.65rem;height:0.29rem;' v-if="isFlash==1&&(proType=='normal'||proType=='flash')" />
              </div>
              <span>{{proInfo.name}}</span>
            </div>
            <div class='pro_tips' v-if="proType!='group'">
              <span>{{summary}}</span>
            </div>
            <div class='pro_pay_type' v-if="(isFlash==0&&(proType=='normal'||proType=='flash'))||proType=='birthday'">
              <div class='pay_spec' v-if="proType=='group'&&buyType!=-2">
                <mt-button size='small' v-if='sale_type>=4' :class="price_type==4? 'button_click': ''" @click='chosePriceType(0,4)'>
                  ￥{{activity.price_combine}}+<i class='iconfont icon-jifen1'></i>{{activity.point_combine}}</mt-button>
                <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4' :class="price_type==1? 'button_click': ''"
                  @click='chosePriceType(0,1)'>￥{{activity.price}}</mt-button>
                <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4' :class="price_type==2? 'button_click': ''"
                  @click='chosePriceType(0,2)'>
                  <i class='iconfont icon-jifen1'></i>{{activity.point}}</mt-button>
              </div>
              <div class='pay_spec' v-else>
                <mt-button size='small' v-if='sale_type>=4' :class="default_price_type==4? 'button_click': ''" @click='chosePriceType(1,4)'
                  data-type='1'>
                  ￥{{default_spec.price_combine}}+<i class='iconfont icon-jifen1'></i>{{default_spec.point_combine}}</mt-button>
                <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4' :class="default_price_type==1? 'button_click': ''"
                  @click='chosePriceType(1,1)' data-type='1'>￥{{default_spec.price_sell}}</mt-button>
                <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4' :class="default_price_type==2? 'button_click': ''"
                  @click='chosePriceType(1,2)'>
                  <i class='iconfont icon-jifen1'></i> {{default_spec.point}}</mt-button>
              </div>
            </div>
            <div class="pro_market" v-if="(isFlash==0&&(proType=='normal'||proType=='flash'))||proType=='birthday'">
              <span>{{price_market_from}}</span>
              <span class='pro_orig'>￥{{price_market}}</span>
            </div>
            <div class='pro_price pro_price_group' v-if="proType=='group'">
              <div style='display:flex;align-items:center;justify-content:space-between;margin:0.2rem 0;'>
                <div style='display:inline-flex;align-items:center;background:#f9f9f9;padding:0.08rem 0;'>
                  <span class='pro_nowprice' v-if='activity.deal_type==1'>￥{{activity.price}}</span>
                  <span class='pro_nowprice' v-if='activity.deal_type>=4'>￥{{activity.price_combine}}+</span>
                  <div class='pro_group_img' v-if='activity.deal_type!=1'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral_group' v-if='activity.deal_type>=4'>{{activity.point_combine}}</span>
                  <span class='pro_integral_group' v-if='activity.deal_type==2||activity.deal_type==3'>{{activity.point}}</span>
                  <span class='pro_orig_group'>￥{{price_market}}</span>
                </div>
                <div style='display:inline-flex;align-items:center;font-size:0.24rem;color:#777777;'>{{success_num}}人已成功</div>
              </div>
              <div>
                <span class='group_num'>{{activity.startnum}}人团</span>
                <span class='group_tags'>·NEW</span>
              </div>
            </div>
          </div>
          <div class='pro_title_tips' v-if="proType=='normal'||proType=='flash'">
            <span>{{title_tips}}</span>
          </div>
          <div class="pro_spec" id='com'>
            <div style='display:inline-flex'>
              已选
            </div>
            <div style='display:inline-flex;width:4.2rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'>
              <span v-for='(item,index) in showSpec' :key='index'>{{item}}</span>
            </div>
            <div style='display:inline-flex;width:1rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'>
              <span>{{specNum}}件</span>
            </div>
            <div class='spec_icon' @click='showModel'>
              <i class='iconfont icon-yuandianzhong'></i>
              <i class='iconfont icon-yuandianzhong'></i>
              <i class='iconfont icon-yuandianzhong'></i>
            </div>
          </div>
        </div>
        <div class='pro_group_title' v-if="proType=='group'&&groupList.length>0">
          <span>{{groupTotal}}人在拼单</span>
          <div @click='moreGroup'>
            <span>查看更多</span>
            <i class='iconfont icon-iconfontjiantou5'></i>
          </div>
        </div>
        <div class='pro_group' v-if="proType=='group'&&groupList.length>0">
          <div v-for='(item,index) in groupList' :key='index'>
            <div class='group' style='padding:0.2rem 0;' v-if='index<2&&endTimeList[index]!=0'>
              <div class='group_user'>
                <img :src='item.img' class='group_img' />
                <span>{{item.nickname}}</span>
              </div>
              <div>
                <div>
                  <span>还差</span>
                  <span class='group_num'>{{item.need_num}}</span>
                  <span>人拼成</span>
                </div>
                <div>
                  <span class='title'>剩余</span>
                  <span class='time'>{{saleTimeList[index].hou}}</span>
                  <span class='text'>:</span>
                  <span class='time'>{{saleTimeList[index].min}}</span>
                  <span class='text'>:</span>
                  <span class='time'>{{saleTimeList[index].sec}}</span>
                </div>
              </div>
              <!-- data-link='../groupResult/groupResult?type=payshare&orderId=item.id'  -->
              <mt-button @click="golink('/groupResult?type=payshare&orderId=',item.id)" size='small'>去拼单</mt-button>
            </div>
          </div>
        </div>
        <div class='pro_group_tips' v-if="activity.rule!=''&&activity.rule!=null">
          <div class=' group_head'>
            <span>团购规则</span>
          </div>
          <div class='group_text'>
            <span>{{activity.rule}}</span>
          </div>
        </div>
        <div class='pro_com'>
          <div class='com_head'>
            <span>精选评价</span>
            <div class='head_right' @click='viewAllCom' v-if='comList.length>0'>
              好评度
              <span>{{rate}}</span>
              <i class='iconfont icon-iconfontjiantou5'></i>
            </div>
          </div>
          <div class='com_list' v-if='comList.length==0'>
            <div class='com_tips'>暂无评价</div>
          </div>
          <div class='com_list' v-if='comList.length>0'>
            <div class='com_info' v-for='(item,index) in comList' :key='index'>
              <div class='com_info_head'>
                <div class='user_info'>
                  <img :src='item.image' v-lazy="item.image" />
                  <span>{{item.nickname}}</span>
                </div>
                <div class='star_level'>
                  <i class='iconfont icon-star' v-if="item.score<1"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=1"></i>
                  <i class='iconfont icon-star' v-if="item.score<2"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=2"></i>
                  <i class='iconfont icon-star' v-if="item.score<3"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=3"></i>
                  <i class='iconfont icon-star' v-if="item.score<4"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=4"></i>
                  <i class='iconfont icon-star' v-if="item.score<5"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=5"></i>
                </div>
              </div>
              <div class='com_content'>
                <span>{{item.comment}}</span>
              </div>
              <div class='com_img'>
                <img :src='com' v-for='(com,index) in item.pic' :key='index' @click='previewImg(com)' data-comid='item.id'
                  v-lazy="com" />
              </div>
            </div>
            <div class='com_btn' @click='viewAllCom' id='more'>
              <mt-button size='normal'>查看全部评价</mt-button>
            </div>
          </div>
        </div>
        <div class='pro_show'>
          <div class='show_head'>
            <div class='header_nav'>
              <span :class="choseid=='p'?'nav_text_active':''" id='p' @click="choseTab('p')">商品介绍</span>|
              <span :class="choseid=='s'?'nav_text_active':''" id='s' @click="choseTab('s')">规格参数</span>|
              <span :class="choseid=='a'?'nav_text_active':''" id='a' @click="choseTab('a')">包装售后</span>
            </div>
          </div>
          <div class='pro_img'>
            <div v-html='proDetail' class='pro_html'></div>
          </div>
        </div>
      </div>
      <div class='pro_com_detail' v-if="allCom">
        <div class='com_detail_head'>
          <div class='com_head_left'>
            <span>共{{comDetail.length}}条评论</span>
          </div>
          <div class='com_head_right'>
            <span>好评{{rate}}</span> </div>
        </div>
        <div class='com_detail_list'>
          <div class='com_detail_info' v-for='(item,index) in comDetail' :key='index'>
            <div class='com_detail_userinfo'>
              <img :src='item.image' v-lazy="item.image" />
              <div class='com_detail_name'>
                <span>{{item.nickname}}</span>
                <div class='com_detail_star'>
                  <i class='iconfont icon-star' v-if="item.score<1"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=1"></i>
                  <i class='iconfont icon-star' v-if="item.score<2"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=2"></i>
                  <i class='iconfont icon-star' v-if="item.score<3"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=3"></i>
                  <i class='iconfont icon-star' v-if="item.score<4"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=4"></i>
                  <i class='iconfont icon-star' v-if="item.score<5"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=5"></i>
                </div>
              </div>
            </div>
            <div class='com_detail_com'>
              {{item.comment}}
            </div>
            <div class='com_detail_imglist'>
              <img :src='com' v-for='(com,index) in item.pic' :key='index' @click='previewImg(com)' v-lazy="com" />
            </div>
            <div class='com_detail_pro'>
              <div class='com_detail_pro_info'>
                <span v-if="item.title!=null&&item.title!=''">规格：{{item.title}}</span>
                <span>购买日期：{{item.date}}</span>
              </div>
              <div class='com_detaul_oper'>
              </div>
            </div>
            <div class='com_replay' v-if="item.reply!=null&&item.reply!=''">
              <div class='replay_info'>卖家回复:{{item.reply}}</div>
              <div class='replay_time'>{{item.reply_date}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class='null_view'></div>
      <div class='pro_btn' v-if="(proType=='normal'||proType=='flash')" :hidden='hiddenFix'>
        <div class='btn_blcok'>
          <mt-button open-type="contact" class='contact'>
            <i class='iconfont icon-kefu1'></i>
          </mt-button>
          <mt-button class='show_car' @click="goIndex('/Car')">
            <i class='iconfont icon-car'></i>
          </mt-button>
        </div>
        <mt-button class='btn_blcok add_car' @click='openCar(1)' v-if="maxNum>0&&is_up=='true'">加入购物车</mt-button>
        <mt-button class='btn_blcok pro_buy' @click='buyNow(0)' v-if="maxNum>0&&is_up=='true'">立即购买</mt-button>
        <mt-button class='btn_blcok width pro_buy_dis' v-if="maxNum<=0&&is_up=='true'&&isFlash!=1">已售完</mt-button>
        <mt-button class='btn_blcok width pro_buy_dis' v-if="maxNum<=0&&is_up=='true'&&isFlash==1">已抢完</mt-button>
        <mt-button class='btn_blcok width pro_buy_dis' v-if="is_up=='false'">已下架</mt-button>
      </div>
      <div class='pro_btn' v-else :hidden='hiddenFix'>
        <div class='btn_blcok'>
          <mt-button open-type="contact" class='contact_group'>
            <i class='iconfont icon-kefu1'></i>
          </mt-button>
        </div>
        <mt-button class="btn_blcok width add_car_group" @click='buyNow(10)' v-if="proType=='group'&&maxNum>0&&is_up=='true'">单独购买</mt-button>
        <mt-button class="btn_blcok width pro_buy" @click='buyNow(0)' v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&endTime>0">开启拼团</mt-button>
        <mt-button class="btn_blcok width pro_buy pro_buy_dis" v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&group_start==1&&endTime<=0">拼团已结束</mt-button>
        <mt-button class="btn_blcok width pro_buy pro_buy_dis" v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&group_start==0">团购未开始</mt-button>
        <mt-button class="btn_blcok width pro_buy" @click='buyNow(0)' v-if="proType=='group'&&addgroup!=''&&maxNum>0&&is_up=='true'">立即参团</mt-button>
        <mt-button :class="activity.is_qualification?'btn_blcok width pro_buy':'btn_blcok width pro_buy_dis'" @click='buyNow(0)'
          v-if="(proType=='point'||proType=='birthday')&&maxNum>0&&is_up=='true'">立即兑换</mt-button>
        <mt-button :class=" activity.is_qualification?'pro_buy btn_blcok width':'pro_buy_dis btn_blcok width'" @click='buyNow(0)'
          v-if="proType!='group'&&proType!='point'&&proType!='birthday'&&activity.is_qualification&&maxNum>0&&is_up=='true'">立即购买</mt-button>
        <mt-button :class="activity.is_qualification?'btn_blcok width pro_buy':'btn_blcok width pro_buy_dis'" v-if="activity.is_qualification==false&&isFlash==1&&maxNum>0&&is_up=='true'&&proType!='birthday'&&proType!='point'"
          @click='buyNow(0)'>立即购买</mt-button>
        <!-- <mt-button class='btn_blcok width pro_buy' v-if="maxNum<=0&&is_up=='true'&&isFlash==1">已抢完</mt-button>
        <mt-button class='btn_blcok width pro_buy' v-if="maxNum<=0&&is_up=='true'&&isFlash!=1">已售完</mt-button> -->
        <mt-button class='btn_blcok width pro_buy' v-if="is_up=='false'">已下架</mt-button>
      </div>
      <div class='pro_spec_model' v-if='!modelShow' @click='closeModel'>
      </div>
      <div class='pro_spec_detail' v-if='!modelShow'>
        <div class='spec_head'>
          <div class='spec_pro_img' @click='previewImg(staticImg)'>
            <img :src='staticImg' mode='widthFix' />
          </div>
          <div class='spec_close' @click='closeModel'>
            <i class='iconfont icon-guanbi'></i>
          </div>
          <div class='spec_pro_price' v-if="proType=='group'&&buyType!=-2">
            <span class='spec_pro_nowprice' v-if='price_type==1'>￥{{activity.price}}</span>
            <span class='spec_pro_nowprice' v-if='price_type==4'>￥{{activity.price_combine}}+</span>
            <div class='spec_pro_inter_img' v-if='price_type!=1'>
              <i class='iconfont icon-jifen1'></i>
            </div>
            <span class='spec_pro_integral' v-if='price_type==4'>{{activity.point_combine}}</span>
            <span class='spec_pro_integral' v-if='price_type==2'>{{activity.point}}</span>
          </div>
          <div class='spec_pro_price' v-else>
            <span class='spec_pro_nowprice' v-if='default_price_type==1'>￥{{default_spec.price_sell}}</span>
            <span class='spec_pro_nowprice' v-if='default_price_type>=4'>￥{{default_spec.price_combine}}+</span>
            <div class='spec_pro_inter_img' v-if='default_price_type!=1'>
              <i class='iconfont icon-jifen1'></i>
            </div>
            <span class='spec_pro_integral' v-if='default_price_type>=4'>{{default_spec.point_combine}}</span>
            <span class='spec_pro_integral' v-if='default_price_type==2||default_price_type==3'>{{default_spec.point}}</span>
          </div>
          <div class='spec_pro_code'>
            <div>
              <span>{{price_market_from}}</span>
              <span class='spec_pro_orig'>￥{{price_market}}</span>
            </div>
          </div>
        </div>
        <div class='spec_body'>
          <div :hidden="(isFlash==0&&(proType=='normal'||proType=='flash'))||proType=='birthday'">
            <div class='spec_title'>
              结算方式
            </div>
            <div class='spec_type' v-if="proType=='group'&&buyType!=-2">
              <mt-button size='small' v-if='sale_type>=4' :class="price_type==4? 'button_click': ''" @click='chosePriceType(0,4)'>
                ￥{{activity.price_combine}}+<i class='iconfont icon-jifen1'></i>{{activity.point_combine}}</mt-button>
              <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4' :class="price_type==1? 'button_click': ''"
                @click='chosePriceType(0,1)'>￥{{activity.price}}</mt-button>
              <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4' :class="price_type==2? 'button_click': ''"
                @click='chosePriceType(0,2)'>
                <i class='iconfont icon-jifen1'></i>{{activity.point}}</mt-button>
            </div>
            <div class='spec_type' v-else>
              <mt-button size='small' v-if='sale_type>=4' :class="default_price_type>=4? 'button_click': ''" @click='chosePriceType(1,4)'>￥{{default_spec.price_combine}}+<i
                  class='iconfont icon-jifen1'></i>{{default_spec.point_combine}}</mt-button>
              <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4' :class="default_price_type==1? 'button_click': ''"
                @click='chosePriceType(1,1)'>￥{{default_spec.price_sell}}</mt-button>
              <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4' :class="default_price_type==2? 'button_click': ''"
                @click='chosePriceType(1,2)'>
                <i class='iconfont icon-jifen1'></i> {{default_spec.point}}</mt-button>
            </div>
          </div>
          <div v-for='(item,index) in specList' :key='index' :hidden='!hasSpec'>
            <div class='spec_title'>
              {{item.name}}
            </div>
            <div class='spec_type'>
              <mt-button size='small' @click="choseType(item.tid,item.pid)" v-for="(item,index) in item.list" :key='index'
                :class="item.ischose? 'button_click': ''">{{item.name}}</mt-button>
            </div>
          </div>
          <div class='spec_num' v-if="proType!='birthday'">
            <span>数量</span>
            <div class='pro_icon'>
              <mt-button size='small' class='pro_spec_btn' id='0' @click='lessNum' data-value='less'>-</mt-button>
              <input v-model='specNum' @blur='changeValue' type='number' />
              <mt-button size='small' class='pro_spec_btn' id='1' @click='addNum' data-value='add'>+</mt-button>
            </div>
          </div>
        </div>
        <div v-if="maxNum>0&&is_up=='true'&&spec_up==true">
          <div class='spec_btn' v-if="buyType==0&&isFlash==0&&proType!='birthday'">
            <mt-button class='add_car' @click='addCar(0)' id='0'>加入购物车</mt-button>
            <mt-button class='pro_buy' @click='addCar(1)' id='1'>立即购买</mt-button>
          </div>
          <div class='spec_btn' v-else>
            <mt-button @click='addCar(1)' class='surebtn' id='1' v-if="proType!='normal'||isFlash==1">确认</mt-button>
            <mt-button @click='addCar' class='surebtn' v-else>确认</mt-button>
          </div>
        </div>
        <div v-if='maxNum<=0||spec_up==false'>
          <div class='spec_btn'>
            <mt-button class='surebtn_false'>已售完</mt-button>
          </div>
        </div>
        <div v-if="is_up=='false'">
          <div class='spec_btn'>
            <mt-button class='surebtn_false'>已下架</mt-button>
          </div>
        </div>
      </div>
      <div class='group_model_bg' :hidden='groupShow' @click='closeGroup'></div>
      <div class='group_model' :hidden='groupShow'>
        <div class='group_model_body'>
          <div class='group_model_icon' @click='closeGroup'>
            <img src='@/assets/img/pro/close.png' style='width:0.62rem;height:0.62rem;' />
          </div>
          <div class='group_model_title'>正在拼单</div>
          <div class='group_model_list' scroll-y :style="{height:g_list_height+'rem'}">
            <div v-for='(item,index) in groupList' :key='index'>
              <div class='group_block' v-if='endTimeList[index]!=0'>
                <div class='group_block_left'>
                  <img :src='item.img' class='group_img' />
                  <div class='group_right'>
                    <div style='display:flex;align-items:center;'>
                      <span class='group_name'>{{item.nickname}}</span>
                      <span class='group_num'>还差{{item.need_num}}人拼成</span>
                    </div>
                    <div class='group_right_time'>
                      <span class='title'>剩余</span>
                      <span class='time'>{{saleTimeList[index].hou}}</span>
                      <span class='text'>:</span>
                      <span class='time'>{{saleTimeList[index].min}}</span>
                      <span class='text'>:</span>
                      <span class='time'>{{saleTimeList[index].sec}}</span>
                    </div>
                  </div>
                </div>
                <div class='group_block_right'>
                  <mt-button @click="golink('/groupResult?type=payshare&orderId=',item.id)" size='small'>去拼单</mt-button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class='pro_com_img_bg' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg"></div>
      <div class='pro_com_img' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg">
        <img :src="img_show_big" alt="" @click="hiddenImg">
      </div>
    </div>
    <div class='goIndex' @click="goIndex('/index')">
      <i class='iconfont icon-home'></i>
    </div>
  </div>

</template>

<script>
import commonHeader from 'common/common-header'
import {
  Toast,
  Indicator,
  Button,
  Swipe,
  SwipeItem,
  Lazyload,
  Field
} from 'mint-ui'
import returnTop from '@/components/return-top'
import {
  countDown,
  countDownList
} from '@/store/pubilc.js'
import {
  getProDetail,
  getComList,
  getProduct,
  addCarofPro,
  addCarofGroup,
  addCarofPoint,
  addCarofNormal,
  collPro,
  cancleColl
} from '@/api/index'
export default {
  name: 'ProDetail',
  components: {
    commonHeader,
    Toast,
    Indicator,
    Button,
    Swipe,
    SwipeItem,
    Lazyload,
    returnTop,
    Field
  },
  data() {
    return {
      h_title: '商品详情',
      bindtop: 0,
      top: 0,
      allowbind: true,
      success_num: 0,
      title_tips: '',
      g_list_height: 350 / 100,
      groupTotal: 0,
      comHeight: 0,
      moreHeight: 0,
      proHeight: 0,
      topNum: 0,
      hiddenFix: false,
      isShow: true,
      imgUrls: [],
      height: '',
      min_height: 0,
      sale_type: '',
      price_type: '',
      default_price_type: '',
      default_chose_paytype: false,
      chose_paytype: false,
      choseName: 'pro',
      rate: '',
      chosecap: true,
      modelShow: true,
      groupShow: true,
      specNum: 1,
      isColl: false,
      isSign: true,
      page: 1,
      is_up: '', // 是否上架
      limit: 10,
      buyType: 0,
      product_id: null,
      // usepoint: 0,
      default_spec: {},
      maxNum: 0,
      totalNum: 0,
      summary: '', // 商品简介
      proInfo: [],
      goods_info: [],
      comList: [],
      comDetail: [],
      specNameList: [],
      specDetailList: [],
      specList: [],
      showSpec: [],
      // isnormal: true,
      toView: '',
      proType: 'normal',
      proDetail: '',
      intrDetail: '',
      specDetail: '',
      afterDetail: '',
      choseid: 'p',
      allCom: false,
      activity: {},
      endTime: null,
      saleTime: [],
      time: null,
      timeList: [],
      endTimeList: [],
      saleTimeList: [{
        hou: 0,
        min: 0,
        sec: 0
      }],
      addgroup: '',
      groupId: '',
      goods_id: '',
      type: '', // 商品类型，normal普通
      hasSpec: true,
      groupList: [],
      isFlash: 0,
      firstImg: '',
      price_market_from: '',
      price_market: 0,
      staticImg: '',
      activity_price_type: '',
      normal_price_type: '',
      group_start: 0,
      imgShow: false,
      img_show_big: '',
      sharewx: '',
      shareUrl: '',
      spec_up: true
    }
  },
  mounted() {
    document.getElementById('pro').scrollIntoView(false)
    Indicator.open('加载中...')
    console.log(this.$route.query)
    this.goods_id = this.$route.query.id// 普通商品的商品id
    this.type = this.$route.query.type
    if (this.type !== 'normal') {
      if (this.type === 'group' && this.$route.query.gid !== undefined) {
        this.proType = this.$route.query.type
        this.groupId = this.$route.query.id// 团购活动的id
        // this.goods_id = this.$route.query.goods_id
        this.addgroup = this.$route.query.gid// 开团的id
      } else {
        this.groupId = this.$route.query.goods_id// 团购商品的商品id
        this.goods_id = this.$route.query.id// 团购活动的id
        this.proType = this.$route.query.type
        this.addgroup = ''
      }
    }
    switch (this.type) {
      case 'normal':
        this.shareUrl = '/pages/proDetail/proDetail?type=normal&id=' + this.goods_id
        break
      case 'flash':
        this.shareUrl = '/pages/proDetail/proDetail?type=flash&id=' + this.goods_id
        break
      case 'group':
        if (this.addgroup !== '') {
          console.log(this.addgroup)
          // 参团
          this.shareUrl = '/pages/proDetail/proDetail?type=group&id=' + this.groupId + '&gid=' + this.addgroup
        } else {
          console.log(this.addgroup)
          this.shareUrl = '/pages/proDetail/proDetail?type=group&id=' + this.goods_id + '&goods_id=' + this.groupId
        }
        break
    }
    console.log(this.shareUrl)
    this.getPro()
    this.getCom()
    this.tabScroll()
    let that = this
    let System = window.plus
    System.share.getServices(function (s) {
      let shares = {}
      for (var i in s) {
        var t = s[i]
        shares[t.id] = t
      }
      that.sharewx = shares['weixin']
      console.log(that.sharewx)
    }, function (e) {
      alert('获取分享服务列表失败：' + e.message)
    })
    // 监听滚动条高度
    // System.oauth.getServices(
    //   function (services) {
    //     let auths = services
    //     console.log(auths)
    //     if (services[0].id === 'weixin') {
    //       that.aweixin = services[0]
    //     }
    //   },
    //   function (e) {
    //     alert('获取分享服务列表失败：' + e.message + ' - ' + e.code)
    //   }
    // )
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('pro').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    tabScroll() {
      window.addEventListener('scroll', this.handleScroll)
    },
    handleScroll() {
      let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
      this.top = scrollTop
      let browserHeight = window.outerHeight // 浏览器高度
      if (scrollTop > browserHeight) {
        this.choseName = 'more'
      } else {
        if (this.allCom === false) {
          if (scrollTop < 500) {
            this.choseName = 'pro'
          } else if (scrollTop > 500) {
            if (this.comList.length <= 0) {
              if (scrollTop > 684) {
                this.choseName = 'more'
              } else {
                this.choseName = 'com'
              }
            } else {
              this.choseName = 'com'
            }
          }
        }
      }
    },
    tohome() {
      // document.getElementById('pro').scrollIntoView(false)
      this.$router.goBack()
    },
    golink(url, id) {
      this.$router.togo({
        path: url + id
      })
    },
    goIndex(url) {
      this.$router.togo({
        path: url
      })
    },
    openCar(id) {
      if (this.activity.is_qualification) {
        if (id === 1) {
          this.buyType = 1
          this.modelShow = false
          document.querySelector('.pro_detail').style.top = -this.top + 'px'
          this.bindtop = -document.querySelector('.pro_detail').offsetTop
        }
      } else {
        Toast({
          message: '您不符合兑换/购买资格！',
          duration: 1000
        })
      }
    },
    buyNow(id) {
      console.log(this.activity.is_qualification)
      if (this.proType === 'group' || this.activity.is_qualification) {
        if (id === 0) {
          this.buyType = -1
          this.modelShow = false
          document.querySelector('.pro_detail').style.top = -this.top + 'px'
          this.sale_type = this.activity_price_type
        } else if (id === 10) {
          this.buyType = -2
          this.modelShow = false
          document.querySelector('.pro_detail').style.top = -this.top + 'px'
          this.sale_type = this.normal_price_type
          // 原价购商品默认选中
          if (this.default_chose_paytype === false) {
            if (parseInt(this.sale_type) >= 4) {
              this.default_price_type = 4
            } else if (parseInt(this.sale_type) === 2) {
              this.default_price_type = 2
            } else {
              this.default_price_type = 1
            }
          }
        }
        if (this.price_type === '' && id !== 10) {
          // 普通商品先选中支付方式再选择规格
          if (parseInt(this.sale_type) >= 4) {
            this.price_type = 4
          } else if (parseInt(this.sale_type) === 2) {
            this.price_type = 2
          } else {
            this.price_type = 1
          }
        }
        console.log(document.querySelector('.pro_detail').offsetTop)
        this.bindtop = -document.querySelector('.pro_detail').offsetTop
      } else {
        Toast({
          message: '您不符合兑换/购买资格！',
          duration: 1000
        })
      }
    },
    addColl(id) {
      var that = this
      // if (util.isLogin()) {
      if (this.isColl === '') {
        // 加入收藏
        collPro(id).then(res => {
          if (res.isSuccess) {
            that.isColl = res.data.collect_id
            Toast({
              message: '收藏成功',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      } else {
        // 取消收藏
        cancleColl(id).then(res => {
          if (res.isSuccess) {
            that.isColl = ''
            Toast({
              message: '取消收藏成功',
              duration: 1000
            })
          }
        })
      }
      // }
    },
    share() {
      console.log('判断是否授权')
      console.log(this.goods_info)
      let that = this
      let System = window.plus
      console.log(this.sharewx)
      let img = '_www/img/mp.png'
      // 正式gh_a0cfbcaf8fa2 测试gh_05718de312bd
      let msg = {
        type: 'miniProgram',
        title: '[小程序]' + that.goods_info.name,
        thumbs: [img],
        content: '分享小程序描述内容。',
        miniProgram: {
          id: 'gh_a0cfbcaf8fa2',
          path: that.shareUrl,
          webUrl: 'http://uniapp.dcloud.io',
          type: 0
        },
        extra: {
          scene: 'WXSceneSession'
        }
      }
      this.sharewx ? this.isAuth(msg) : System.nativeUI.alert('当前环境不支持微信分享操作!')
    },
    zipImg() {
      let System = window.plus
      let downloadImg = System.downloader.createDownload(this.goods_info.img_fm, {}, function (d, status) {
        // 下载完成
        if (status === 200) {
          console.log(d)
          console.log('Download success: ' + d.filename)
          // let imgZip = System.io.convertLocalFileSystemURL(d.filename)
          console.log(d.filename)
          return d.filename
        } else {
          alert('下载失败: ' + status)
          return false
        }
      })
      downloadImg.start()
    },
    isAuth(msg) {
      console.log('判断是否授权')
      console.log(msg)
      if (this.sharewx.authenticated) {
        this.shareAction(msg)
      } else {
        this.sharewx.authorize(function () {
          this.shareAction(msg)
        }, function (e) {
          alert('认证授权失败')
        })
      }
    },
    shareAction(msg) {
      console.log('开始分享')
      console.log(msg)
      this.sharewx.send(msg, function () {
        // alert('分享成功！')
        console.log('分享成功')
      }, function (e) {
        console.log('失败失败啊')
        alert('分享失败：' + e.message)
      })
    },
    chose(type) {
      this.choseName = type
      this.allCom = false
      document.getElementById(type).scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    chosePriceType(type, id) {
      if (type === 0) {
        this.price_type = id
        this.chose_paytype = true
      } else {
        this.default_price_type = id
        this.default_chose_paytype = true
      }
    },
    closeModel() {
      this.modelShow = !this.modelShow
      document.querySelector('.pro_detail').style.top = 'auto'
      document.scrollingElement.scrollTop = this.bindtop
      document.body.scrollTop = this.bindtop
      window.pageYOffset = this.bindtop
    },
    showModel() {
      document.querySelector('.pro_detail').style.top = -this.top + 'px'
      this.bindtop = -document.querySelector('.pro_detail').offsetTop
      if (this.proType === 'group') {
        if (this.endTime != null && this.endTime <= 0) {
          // 团购已结束
          this.buyType = -2
          this.modelShow = false
          this.sale_type = this.normal_price_type
          if (this.default_chose_paytype === false) {
            if (parseInt(this.sale_type) >= 4) {
              this.default_price_type = 4
            } else if (parseInt(this.sale_type) === 2) {
              this.default_price_type = 2
            } else {
              this.default_price_type = 1
            }
          }
        } else {
          // 团购价
          this.buyType = -1
          this.modelShow = false
          this.sale_type = this.activity_price_type
          if (this.chose_paytype === false) {
            if (parseInt(this.sale_type) >= 4) {
              this.price_type = 4
            } else if (parseInt(this.sale_type) === 2) {
              this.price_type = 2
            } else {
              this.price_type = 1
            }
          }
        }
      } else if (this.isFlash === 1) {
        this.modelShow = false
        this.buyType = -1
      } else {
        this.modelShow = false
        this.buyType = 0
      }
    },
    choseType(id, pid) {
      var spec = []
      var specshow = []
      var slist = this.specList
      for (var i = 0; i < slist.length; i++) {
        if (slist[i].id === pid) {
          for (let j = 0; j < slist[i].list.length; j++) {
            slist[i].list[j].ischose = false
          }
          for (let j = 0; j < slist[i].list.length; j++) {
            if (slist[i].list[j].tid === id) {
              slist[i].list[j].ischose = true
            }
          }
        }
      }
      for (let i = 0; i < slist.length; i++) {
        for (let j = 0; j < slist[i].list.length; j++) {
          if (slist[i].list[j].ischose) {
            spec.push(slist[i].list[j].tid)
            specshow.push(slist[i].list[j].name)
          }
        }
      }
      var info = {
        goods_id: this.proInfo.goods_id,
        spec: spec.join(';')
      }
      var that = this
      getProduct(info).then(res => {
        if (res.isSuccess) {
          that.proInfo = res.data.product
          that.product_id = res.data.product.product_id
          that.maxNum = res.data.product.store
          that.default_spec = res.data.product
          that.spec_up = res.data.is_up
          if (res.data.product.price_market_from !== undefined) {
            that.price_market_from = res.data.product.price_market_from
            that.price_market = res.data.product.price_market
          }
          if (res.data.product.img !== '' && res.data.product.img !== null) {
            that.staticImg = res.data.product.img
          } else {
            that.staticImg = that.data.firstImg
          }
        }
      })
    },
    addNum: function (event) {
      let value = parseInt(this.specNum)
      value++
      this.specNum = value
    },
    changeValue() {
      console.log(this.specNum)
      if (this.specNum <= 1) {
        this.specNum = 1
      }
    },
    lessNum: function (event) {
      let value = parseInt(this.specNum)
      if (value <= 1) {
        this.specNum = 1
      } else {
        value--
      }
      this.specNum = value
    },
    addCar: function (e) {
      var that = this
      if (that.allowbind) {
        that.allowbind = false
        if (that.$store.state.home.isbind === 'false' || that.$store.state.home.isbind === false) {
          // var pages = getCurrentPages() // 获取加载的页面
          // var currentPage = pages[pages.length - 1] // 获取当前页面的对象
          // var url = currentPage.route // 当前页面url
          // var options = currentPage.options
          // // 拼接url的参数
          // if (JSON.stringify(options) !== '{}') {
          //   var urlWithArgs = url + '?'
          //   for (var key in options) {
          //     var value = options[key]
          //     urlWithArgs += key + '=' + value + '&'
          //   }
          // } else {
          //   urlWithArgs = url
          // }
          // getApp().globalData.backUrl = urlWithArgs
          that.$router.togo({
            path: '/bind?visit=4'
          })
        } else {
          if (this.proType !== 'group' && !this.activity.is_qualification) {
            Toast({
              message: '您不符合兑换/购买资格！',
              duration: 1000
            })
            that.allowbind = true
          } else {
            var flag = true
            var typelist = []
            var slist = this.specList
            for (var i = 0; i < slist.length; i++) {
              typelist.push(false)
              for (var j = 0; j < slist[i].list.length; j++) {
                if (slist[i].list[j].ischose) {
                  typelist[i] = true
                }
              }
            }
            for (var k = 0; k < typelist.length; k++) {
              if (typelist[k] === false) {
                flag = false
              }
            }
            if (this.buyType === 1 || e === 0) {
              // if (util.isLogin()) {
              if (!flag) {
                Toast({
                  message: '未选择规格',
                  duration: 1000
                })
                that.allowbind = true
              } else {
                if (Number(that.specNum) > Number(that.maxNum)) {
                  Toast({
                    message: '库存不足',
                    duration: 1000
                  })
                  if (Number(that.maxNum) <= 0) {
                    that.specNum = 1
                    that.allowbind = true
                  } else {
                    that.specNum = that.maxNum
                    that.allowbind = true
                  }
                } else {
                  var info = {
                    pid: that.product_id,
                    quantity: that.specNum,
                    checked: 0,
                    deal_type: that.default_price_type
                  }
                  addCarofPro(info).then(res => {
                    if (res.isSuccess) {
                      Toast({
                        message: '加入购物车成功',
                        iconClass: 'iconfont icon-dui1',
                        duration: 1000
                      })
                      that.allowbind = true
                    } else {
                      Toast({
                        message: res.msg,
                        duration: 1000
                      })
                      that.allowbind = true
                    }
                  })
                }
              }
              // }
            } else if (this.buyType === -1 || e === 1) {
              // if (util.isLogin()) {
              if (!flag) {
                Toast({
                  message: '未选择规格',
                  duration: 1000
                })
                that.allowbind = true
              } else {
                if (Number(that.specNum) > Number(that.maxNum)) {
                  Toast({
                    message: '库存不足',
                    duration: 1000
                  })
                  if (Number(that.maxNum) <= 0) {
                    that.specNum = 1
                    that.allowbind = true
                  } else {
                    that.specNum = that.maxNum
                    that.allowbind = true
                  }
                } else {
                  if (that.proType === 'group' && this.buyType === -1) {
                    let info = {
                      id: that.addgroup,
                      group_id: that.groupId,
                      product_id: that.product_id,
                      num: that.specNum,
                      deal_type: that.price_type
                    }
                    addCarofGroup(info).then(res => {
                      if (res.isSuccess) {
                        that.allowbind = true
                        window.localStorage.setItem('neworder', true)
                        this.$router.togo({
                          path: '/sureOrder?addType=2&proType=group&id=' + that.product_id
                        })
                      } else {
                        Toast({
                          message: res.msg,
                          duration: 1000
                        })
                        setTimeout(function () {
                          that.modelShow = true
                          that.allowbind = true
                        }, 1000)
                      }
                    })
                  } else if (
                    that.proType === 'point' ||
                      that.proType === 'birthday'
                  ) {
                    debugger
                    // 生日兑换
                    that.isFlash = -2
                    let info = {
                      active: that.activity.id,
                      checked: that.product_id,
                      quantity: that.specNum,
                      deal_type: that.default_price_type
                    }
                    addCarofPoint(info).then(res => {
                      if (res.isSuccess) {
                        that.allowbind = true
                        window.localStorage.setItem('neworder', true)
                        this.$router.togo({
                          path: '/sureOrder?addType=3&proType=birthday&id=' + that.product_id
                        })
                      } else {
                        Toast({
                          message: res.msg,
                          duration: 1000
                        })
                        setTimeout(function () {
                          that.allowbind = true
                        }, 1000)
                      }
                    })
                  } else {
                    var groupNormal = 1
                    console.log(e)
                    if (that.isFlash === 1 || that.isFlash === '1') {
                      // 促销商品
                      groupNormal = 0
                    }
                    let info = {
                      pid: that.product_id,
                      num: that.specNum,
                      goods_id: that.goods_id,
                      deal_type: that.default_price_type
                    }
                    console.log(groupNormal)
                    if (groupNormal === 0) {
                      addCarofNormal(info).then(res => {
                        if (res.isSuccess) {
                          that.allowbind = true
                          window.localStorage.setItem('neworder', true)
                          this.$router.togo({
                            path: '/sureOrder?addType=3&id=' +
                                that.product_id +
                                '&group_normal=' +
                                groupNormal
                          })
                        } else {
                          Toast({
                            message: res.msg,
                            duration: 1000
                          })
                          setTimeout(function () {
                            that.allowbind = true
                          }, 1000)
                        }
                      })
                    } else {
                      console.log(111)
                      // 普通商品立即购买，同时加入购物车，并结算，若未支付则留在购物车中
                      let info = {
                        pid: that.product_id,
                        quantity: that.specNum,
                        checked: 0,
                        deal_type: that.default_price_type
                      }
                      addCarofPro(info).then(res => {
                        if (res.isSuccess) {
                          that.allowbind = true
                          window.localStorage.setItem('neworder', true)
                          this.$router.togo({
                            path: '/sureOrder?addType=0&id=' +
                                that.product_id +
                                '&group_normal=' +
                                groupNormal
                          })
                        } else {
                          Toast({
                            message: res.msg,
                            duration: 1000
                          })
                          setTimeout(function () {
                            that.allowbind = true
                          }, 1000)
                        }
                      })
                    }
                  }
                }
              }
              // }
            }
          }
          // }
        }
      }
    },
    moreGroup: function () {
      this.groupShow = false
    },
    closeGroup() {
      this.groupShow = true
    },
    viewAllCom() {
      //       wx.showLoading({
      //   title: '加载中',
      // })
      this.allCom = true
      this.choseName = 'com'
      this.getCom()
    },
    viewImg() {},
    choseTab(type) {
      this.choseid = type
      if (type === 'p') {
        this.proDetail = this.intrDetail
      } else if (type === 's') {
        this.proDetail = this.specDetail
      } else {
        this.proDetail = this.afterDetail
      }
    },
    previewImg(url) {
      this.imgShow = true
      this.img_show_big = url
    },
    hiddenImg() {
      this.imgShow = false
    },
    getPro() {
      let that = this
      var info = {
        id: this.goods_id,
        type: this.type
      }
      getProDetail(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.proInfo = res.goods_info
          that.sale_type = res.goods_info.deal_type
          that.goods_info = res.goods_info
          that.summary = res.goods_info.summary
          that.staticImg = res.product_default.img
          that.isColl = res.is_collect
          that.imgUrls = res.pic
          that.activity = res.marketing
          that.default_spec = res.product_default
          that.maxNum = res.product_default.store
          that.totalNum = res.goods_info.store
          that.product_id = res.product_default.product_id
          that.isFlash = res.goods_info.promotion
          that.is_up = res.goods_info.is_up
          that.intrDetail = res.goods_info.intro
          that.specDetail = res.goods_info.specification
          that.afterDetail = res.goods_info.packaging
          that.firstImg = res.goods_info.img
          that.activity_price_type = res.marketing.deal_type
          that.normal_price_type = res.goods_info.deal_type
          that.title_tips = res.site_exemption
          if (parseInt(res.goods_info.deal_type) >= 4) {
            that.price_type = 4
            that.default_price_type = 4
          } else if (parseInt(res.goods_info.deal_type) === 2) {
            that.price_type = 2
            that.default_price_type = 2
          } else {
            that.price_type = 1
            that.default_price_type = 1
          }
          if (res.product_default.price_market_from !== undefined) {
            that.price_market_from = res.product_default.price_market_from
            that.price_market = res.product_default.price_market
          }
          if (that.type === 'group') {
            if (res.allow_group.length > 0) {
              var timearr = []
              for (var i = 0; i < res.allow_group.length; i++) {
                timearr.push(res.allow_group[i].countdown)
              }
              that.endTimeList = timearr
              var sectimeList = countDownList(timearr)
              that.time = setInterval(
                function () {
                  for (var k = 0; k < timearr.length; k++) {
                    if (timearr[k] > 0) {
                      timearr[k] = --timearr[k]
                    } else {
                      timearr[k] = 0
                    }
                  }
                  that.endTimeList = timearr
                  sectimeList = countDownList(timearr)
                  that.saleTimeList = sectimeList
                },
                1000
              )
            }
            that.endTime = res.marketing.countdown
            that.groupTotal = res.allow_total
            that.groupList = res.allow_group
            that.isFlash = -1
            that.sale_type = res.marketing.deal_type
            that.group_start = res.marketing.status
            that.success_num = res.join_num
            if (res.allow_total >= 4) {
              that.g_list_height = 6.4
            } else {
              var height = 1.54 * res.allow_total
              that.g_list_height = height
            }
            if (parseInt(res.marketing.deal_type) >= 4) {
              that.price_type = 4
            } else if (parseInt(res.marketing.deal_type) === 2) {
              that.price_type = 2
            } else {
              this.price_type = 1
            }
            that.isShow = true
          } else {
            that.isShow = true
          }
          if (res.marketing === undefined) {
            that.groupId = ''
          } else {
            if (res.marketing.id !== undefined) {
              that.groupId = res.marketing.id
            } else {
              that.groupId = ''
            }
          }
          if (that.isFlash === 1 || that.isFlash === '1') {
            console.log('进入促销')
            var secTime = countDown(res.marketing.countdown)
            that.endTime = res.marketing.countdown
            that.saleTime = secTime
            that.time = setInterval(
              function () {
                secTime = countDown(--that.endTime)
                that.saleTime = secTime
              },
              1000
            )
          }
          if (
            res.spec_key_name !== undefined &&
              res.spec_key_nameval !== undefined
          ) {
            that.specNameList = res.spec_key_name
            that.specDetailList = res.spec_key_nameval
            var arr = []
            var list = []
            for (var item in that.specNameList) {
              arr.push({
                id: item,
                name: that.specNameList[item],
                list: []
              })
            }
            for (let item in that.specDetailList) {
              let dlist = []
              for (var key in that.specDetailList[item]) {
                dlist.push({
                  tid: item + ':' + key,
                  pid: item,
                  name: that.specDetailList[item][key],
                  ischose: false
                })
              }
              list.push({
                id: item,
                list: dlist
              })
            }
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < list.length; j++) {
                if (arr[i].id === list[j].id) {
                  arr[i].list = list[j].list
                }
              }
            }
            var spec = res.product_default.spec.split(';')
            for (let k = 0; k < spec.length; k++) {
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].list.length; j++) {
                  if (arr[i].list[j].tid === spec[k]) {
                    arr[i].list[j].ischose = true
                    that.showSpec.push(arr[i].list[j].name)
                  }
                }
              }
            }
            that.proInfo.price_sell = res.product_default.price_sell
            if (
              res.product_default.bn !== '' &&
                res.product_default.bn != null
            ) {
              that.proInfo.bn = res.product_default.bn
            }
            that.specList = arr
          } else {
            that.flag = false
            that.product_id = res.product_info.product_id
            that.hasSpec = false
          }
          that.proDetail = that.intrDetail
          // WxParse.wxParse('proDetail', 'html', proDetail, this, 10)
        }
      })
    },
    getCom() {
      let that = this
      var info = {
        goods_id: this.goods_id,
        page: this.page,
        limit: this.limit
      }
      getComList(info).then(res => {
        if (res.isSuccess) {
          if (res.isSuccess) {
            // 商品详情少量评价
            that.comList = res.rows
            that.rate = res.rate
            // 全部评价
            this.comDetail = res.rows
          }
        }
      })
    }
  },
  beforeDestroy() {
    // this.$refs.slider.$emit('autoplayStop')
    this.isShow = false
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.time)
  }
  // beforeDestroy() {
  //   this.$refs.slider.$emit('autoplayStop')
  //   clearInterval(this.time)
  // },
  // destroyed: function() {
  //   window.removeEventListener('scroll', this.handleScroll)
  // }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .pro_detail {
    position: relative;
    background: #f0eff1;
    overflow-x: hidden;

    .head_top {
      height: 98/100rem;
      background: transparent;
      z-index: 10;
    }

    .pro_header {
      text-align: center;
      background: #f7f7f7;
      height: 94/100rem;
      line-height: 94/100rem;
      position: fixed;
      width: 100%;
      z-index: 100;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .pro_header_left {
        margin-left: 0.1rem;

        .iconfont {
          font-size: 0.42rem;
        }
      }

      .head_between {
        width: 16%;
      }

      .pro_header_nav {
        position: relative;

        span {
          font-size: 38/100rem;
          color: #393939;
          padding: 0 28/100rem;
          line-height: 94/100rem;
          display: inline-flex;
        }

        .text_active {
          border-bottom: 5/100rem solid #ff8d97;
          color: #ff8d97;
        }
      }

      .pro_header_icon {
        color: #707070;
        font-size: 38/100rem;
        overflow: hidden;
        display: flex;
        margin-right: 0.1rem;
        justify-content: center;

        button {
          float: left;
          padding: 0;
          background: transparent;
          outline: none;
          box-shadow: none;
          margin: 0 0.1rem;

          .iconofnt {
            padding: 0;
            padding-right: 26/100rem;
          }
        }
      }
    }

    .pro_body {
      .pro_info {
        margin-bottom: 10/100rem;

        .pro_swiper {
          width: 100%;
          height: 750/100rem;

          .slide-img {
            width: 750/100rem;
            height: 750/100rem;
          }
        }

        .pro_title {
          background: #fff;
          margin-bottom: 10/100rem;

          .pro_price {
            font-family: "DIN";
            /* width: 280/100rem; */
            display: flex;
            align-items: center;
            justify-content: flex-end;
            /*增加销量然后右对齐，自成一行*/
            padding: 10/100rem 26/100rem;
            background: #fff;

            .pro_sale_num {
              font-size: 24/100rem;
              color: #b8b8b8;
            }
          }

          .pro_name {
            font-size: 38/100rem;
            background: #fff;
            padding: 0 26/100rem;
            padding-bottom: 10/100rem;

            .pro_name_icon {
              position: relative;
              float: left;
              margin-right: 10/100rem;

              span {
                position: absolute;
                font-size: 12/100rem;
                color: #fff;
                left: 50%;
                transform: translateX(-50%);
                width: 64/100rem;
                top: 27%;
                text-align: center;
              }
            }

            .iconfont {
              color: #e2002e;
              font-size: 66/100rem;
              margin-right: 5px;
            }
          }

          .group_top {
            padding-top: 40/100rem;
          }

          .pro_tips {
            font-size: 28/100rem;
            color: #707070;
            padding: 0 26/100rem;
            background: #fff;
          }

          .pro_pay_type {
            padding: 16/100rem 26/100rem;
            background: #fff;

            .pay_spec {
              button {
                margin-right: 20/100rem;
                color: #555;
                font-size: 24/100rem;
                background: #fff;
                border: 2/100rem solid #777;
                line-height: 0.52rem;
                height: 0.52rem;
                border-radius: 20/100rem;

                .iconfont {
                  display: inline-flex;
                  font-size: 24/100rem;
                }
              }

              button::after {
                border: none;
                box-shadow: none;
              }

              .button_click {
                color: #ff8d97;
                border: 2/100rem solid #ff8d97;

                .iconfont {
                  color: #ff8d97;
                }
              }
            }
          }

          .pro_price_group {
            /* justify-content: space-between; */
            display: block;
            background: #fff;
            padding: 0 26/100rem;
            padding-bottom: 10/100rem;

            .group_tags {
              font-size: 0.24rem;
              color: #121212;
              margin-right: 0.14rem;
            }

            .group_num {
              font-size: 24/100rem;
              color: #ff8d97;
              margin-right: 0;
            }
          }

          .pro_nowprice {
            font-size: 34/100rem;
            color: #313131;
            margin-right: 0;
          }

          .pro_group_img {
            margin-top: -6/100rem;

            .iconfont {
              font-size: 30/100rem;
              display: inline-flex;
              align-items: center;
            }
          }

          .pro_integral_group {
            font-size: 30/100rem;
            color: #313131;
          }

          .pro_orig_group {
            font-size: 24/100rem;
            color: #979797;
            text-decoration: line-through;
          }

          .i_level {
            position: relative;

            img {
              width: 38/100rem;
              height: 41/100rem;
            }
          }

          .pro_market {
            font-size: 28/100rem;
            color: #707070;
            padding: 0 26/100rem;
            background: #fff;
            padding-bottom: 10/100rem;
          }
        }

        .pro_title_tips {
          margin-top: -10/100rem;
          color: #666;
          font-size: 26/100rem;
          padding: 26/100rem;
          border-top: 1px solid #e0e0e0;
          background: #fff;
          margin-bottom: 10/100rem;
        }

        .pro_spec {
          height: 80/100rem;
          line-height: 80/100rem;
          padding: 0 26/100rem;
          font-size: 26/100rem;
          color: #adadad;
          /* border-top: 1px solid #eae8eb; */
          display: flex;
          justify-content: space-between;
          background: #fff;
          align-items: center;

          span {
            color: #444;
            margin-left: 10/100rem;
            /* margin-right: -20/100rem; */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 80/100rem;
          }

          .spec_icon {
            float: right;
            font-size: 30/100rem;
            font-weight: bold;

            /* width: 100/100rem; */
            i:nth-child(1) {
              color: #dcdcdc;
            }

            i:nth-child(2) {
              color: #bfbfbf;
            }

            i:nth-child(3) {
              color: #a8a8a8;
            }
          }
        }

        .pro_down_sale {
          width: 100%;
          font-size: 30/100rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-image: linear-gradient(to left, #ab0023 0%, #e4002f 100%);
          overflow: hidden;

          .pro_price {
            font-family: "DIN";
            width: 380/100rem;
            color: #fff;
            padding: 14/100rem 0;
            padding-left: 36/100rem;

            .iconfont {
              font-size: 30/100rem;
              font-weight: bold;
              display: inline-flex;
              color: #ffe790;
            }

            .group_num {
              font-size: 26/100rem;
              margin-right: 26/100rem;
            }

            .i_level {
              position: relative;

              img {
                width: 38/100rem;
                height: 41/100rem;
              }

              span {
                color: #fff;
                position: absolute;
                left: 50%;
                top: 35%;
                transform: translate(-50%, -50%);
                font-size: 18/100rem;
                font-weight: bold;
                font-family: "DIN";
              }
            }

            .peo_nowprice {
              font-size: 30/100rem;
              margin-right: 6/100rem;
            }

            .pro_integral {
              font-size: 30/100rem;
            }

            .pro_inter_img {
              display: inline-flex;

              .iconfont {
                color: #ffe790;
                font-size: 30/100rem;
                font-weight: bold;
              }
            }

            span {
              font-size: 24/100rem;
            }

            .pro_orig {
              font-size: 24/100rem;
              text-decoration: line-through;
            }

            .pro_num {
              font-size: 24/100rem;
              margin-left: 20/100rem;
              /* margin-right: 14/100rem; */
            }
          }

          .pro_right {
            background: #f7f7f7;
            padding: 20/100rem 30/100rem;

            .pro_time {
              text-align: center;

              .title {
                display: block;
                color: #e2002e;
                font-size: 24/100rem;
              }

              .time {
                color: #fff;
                background: #e2002e;
                min-width: 24/100rem;
                padding: 0 4/100rem;
                height: 32/100rem;
                display: inline-flex;
                align-content: center;
                justify-content: center;
                border-radius: 6/100rem;
                font-family: "DIN";
                margin: 0 4/100rem;
                font-size: 24/100rem;
              }

              .text {
                /* color: #ff8d97; */
                color: #e2002e;
                font-size: 26/100rem;
              }
            }

            .pro_prop {
              .prop_bg {
                width: 96%;
                height: 10/100rem;
                border-radius: 10/100rem;
                margin-top: 6/100rem;
                background: #efefef;

                span {
                  background: #ff8d97;
                  width: 60%;
                  height: 10/100rem;
                  display: flex;
                  border-radius: 10/100rem;
                }
              }
            }
          }
        }
      }

      /* 团购规则 */

      .pro_group_tips {
        background: #fff;
      }

      .pro_group_tips .group_head {
        padding: 0 26/100rem;
        height: 80/100rem;
        line-height: 80/100rem;
        border-bottom: 1px solid #eae8eb;
      }

      .group_head span {
        font-size: 26/100rem;
        color: #adadad;
      }

      .pro_group_tips .group_text {
        margin-bottom: 10/100rem;
      }

      .group_text span {
        font-size: 26/100rem;
        padding: 26/100rem;
        display: block;
        word-wrap: break-word;
        color: #333;
      }

      .pro_group {
        padding: 0 26/100rem;
        background: #fff;
        margin-bottom: 10/100rem;

        .group {
          display: flex;
          align-items: center;
          justify-content: space-between;

          div {
            font-size: 24/100rem;
            color: #313131;

            .group_img {
              width: 80/100rem;
              height: 80/100rem;
              border-radius: 50%;
              margin-right: 14/100rem;
            }

            .group_num {
              font-size: 24/100rem;
              color: #ff8d97;
            }

            .time {
              width: 28/100rem;
              display: inline-flex;
            }
          }

          .group_user {
            display: inline-flex;
            align-items: center;
            width: 340/100rem;

            span {
              color: #313131;
              font-size: 28/100rem;
            }
          }

          button {
            background: #ff8d97;
            color: #fff;
            font-size: 0.24rem;
            border-radius: 0.2rem;
            margin: 0;
          }

          button::after {
            border: none;
          }
        }
      }

      .pro_group_title {
        padding: 30/100rem 26/100rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        border-bottom: 1px solid #e0e0e0;

        span {
          font-size: 30/100rem;
          color: #333;
        }

        div {
          display: inline-flex;
          align-items: center;

          span {
            font-size: 0.24rem;
            color: #989898;
          }

          .iconfont {
            color: #989898;
            display: inline-flex;
            align-items: center;
          }
        }
      }
    }

    .pro_com {
      background: #fff;

      .com_head {
        padding: 0 26/100rem;
        height: 80/100rem;
        line-height: 80/100rem;
        border-bottom: 1px solid #eae8eb;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          font-size: 26/100rem;
          color: #adadad;
        }

        .head_right {
          float: right;
          font-size: 24/100rem;
          color: #525252;

          span {
            color: #ff8d97;
            font-family: "DIN";
          }

          i {
            color: #979797;
            // margin-left: 16/100rem;
          }
        }
      }

      .com_list {
        margin-bottom: 10/100rem;

        .com_tips {
          font-size: 26/100rem;
          padding: 26/100rem;
        }

        .com_info {
          padding: 0 26/100rem;
          border-bottom: 1px solid #eae8eb;

          .com_info_head {
            margin-top: 30/100rem;
            margin-bottom: 20/100rem;
            display: flex;
            justify-content: space-between;
            align-content: center;
            height: 52/100rem;
            line-height: 52/100rem;

            .user_info {
              img {
                width: 42/100rem;
                height: 42/100rem;
                border-radius: 50%;
                vertical-align: middle;
              }

              span {
                font-size: 20/100rem;
                color: #777;
                margin-left: 12/100rem;
              }
            }

            .star_level {
              i {
                color: #ff8d97;
              }

              .light {
                color: #ff8d97;
              }
            }
          }

          .com_content {
            span {
              font-size: 24/100rem;
              color: #555;
              word-wrap: break-word;
            }
          }

          .com_img {
            margin-top: 38/100rem;
            margin-bottom: 43/100rem;

            img {
              width: 176/100rem;
              height: 176/100rem;
              margin-right: 12/100rem;
            }
          }
        }

        .com_btn {
          text-align: center;
          padding: 30/100rem 26/100rem;

          button {
            color: #868686;
            font-size: 26/100rem;
            border: 1px solid #cbcbcb;
            background: #fff;
            width: 100%;
            height: 0.7rem;
          }

          button::after {
            border: none;
            box-shadow: none;
          }
        }
      }
    }

    .pro_show {
      background: #fff;
      padding: 20/100rem 0;
      min-height: 11rem;

      .show_head {
        text-align: center;
        color: #949494;
        font-size: 28/100rem;

        .header_nav {
          margin: 42/100rem 0;
          text-align: center;

          span {
            color: #949494;
            font-size: 26/100rem;
            padding: 0 44/100rem;
          }

          .nav_text_active {
            color: #ff8d97;
          }
        }
      }

      .pro_img {
        text-align: center;
        padding: 0 20/100rem;

        .pro_html {
          img {
            width: 100px;
          }
        }
      }
    }

    /* 商品评价详细 */

    .pro_com_detail {
      /* height: 80/100rem; */
      background: #f2f2f2;
    }

    .pro_com_detail .com_detail_head {
      padding: 0 26/100rem;
      height: 80/100rem;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 22/100rem;
    }

    .com_detail_head .com_head_left span {
      font-size: 24/100rem;
      color: #414141;
    }

    .com_detail_head .com_head_right {
      font-size: 24/100rem;
      color: #414141;
    }

    .com_detail_head .com_head_right span {
      color: #ff8d97;
    }

    .pro_com_detail .com_detail_list {
      background: #fff;
    }

    .com_detail_list .com_detail_info {
      padding: 40/100rem 26/100rem;
      border-bottom: 2/100rem solid #ebebeb;
    }

    .com_detail_info .com_detail_userinfo {
      /* padding-top: 55/100rem; */
      width: 100%;
      display: flex;
      justify-content: flex-start;
    }

    .com_detail_userinfo img {
      width: 64/100rem;
      height: 64/100rem;
      border-radius: 50%;
    }

    .com_detail_userinfo .com_detail_name {
      margin-left: 10/100rem;
    }

    .com_detail_name span {
      font-size: 26/100rem;
      color: #686868;
      font-family: 'DIN';
    }

    .com_detail_name .com_detail_star {
      display: flex;
      align-items: center;
    }

    .com_detail_name .com_detail_star .iconofnt {
      color: #ff8d97;
      font-size: 22/100rem;
      display: inline-flex;
    }

    .com_detail_name .com_detail_star .light {
      color: #ff8d97;
    }

    .com_detail_info .com_detail_com {
      padding-left: 80/100rem;
      padding-top: 30/100rem;
    }

    .com_detail_com {
      font-size: 28/100rem;
      color: #505050;
    }

    .com_detail_info .com_detail_imglist {
      padding-left: 80/100rem;
      padding-top: 30/100rem;
    }

    .com_detail_imglist img {
      width: 200/100rem;
      height: 200/100rem;
      margin-right: 6/100rem;
    }

    .com_detail_info .com_detail_pro {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }

    .com_detail_pro .com_detail_pro_info {
      padding-left: 80/100rem;
    }

    .com_detail_pro_info span {
      font-size: 22/100rem;
      color: #a4a4a4;
      font-family: 'DIN';
      display: block;
    }

    .com_detail_info .com_detaul_oper {
      font-size: 28/100rem;
      color: #373737;
      font-family: 'DIN';
      display: flex;
      /* justify-content: space-between; */
      align-items: center;
    }

    .com_detaul_oper img {
      margin-left: 36/100rem;
      margin-right: 12/100rem;
      width: 38/100rem;
      height: 30/100rem;
    }

    .com_replay {
      border: 1/100rem solid #e0e0e0;
      /* margin: 0 80/100rem; */
      /* padding: 10px; */
      font-size: 24/100rem;
      color: #666;
      margin-left: 40px;
      padding: 10/100rem;
    }

    .null_view {
      height: 100/100rem;
      background: #f2f2f2;
    }

    .pro_btn {
      box-shadow: 0 8/100rem 20/100rem 10/100rem #dadada;
      position: fixed;
      bottom: -5/100rem;
      height: 100/100rem;
      line-height: 100/100rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .btn_blcok {
        width: 34%;
        display: flex;
        background: #fff;
        justify-content: center;

        button {
          width: 50%;
          background: #fff;
          border: none;
          box-shadow: none;
        }

        .contact {
          i {
            color: #666;
            font-size: 48/100rem;
          }

          /* 客服图标按钮较小，加大到效果和购物车一致 */
        }

        .show_car {
          i {
            color: #666;
            font-size: 40/100rem;
            // position: absolute;
            // left: 50%;
            // transform: translateX(-50%);
          }

          .carNum {
            color: #ff8d97;
            top: -25/100rem;
            right: 72/100rem;
            position: absolute;
            font-size: 46/100rem;
          }

          span {
            position: absolute;
            color: #fff;
            top: -24/100rem;
            right: 47/100rem;
            font-size: 18/100rem;
            font-family: "DIN";
          }
        }

        .contact_group {
          width: auto;
          border: none;
          box-shadow: none;
        }

        .contact_group {
          i {
            color: #666;
            font-size: 48/100rem;
          }
        }
      }

      .width {
        width: 66% !important;
      }

      button::after {
        border: none;
        box-shadow: none;
      }

      button {
        color: #fff;
        height: 100/100rem;
        line-height: 100/100rem;
        border-radius: 0;
        font-size: 34/100rem;
      }

      .pro_buy {
        /* width: 300/100rem; */
        background: #ff8d97;
      }

      .pro_buy_dis {
        /* width: 300/100rem; */
        background: #d3d3d3;
      }

      .add_car {
        /* width: 300/100rem; */
        background: #ff8a00;
      }

      .add_car_group {
        /* width: 300/100rem; */
        background: #000;
      }
    }
  }

  .pro_detail_fixed {
    position: fixed;
  }

  .pro_spec_model {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 201;
  }

  .pro_spec_detail {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 202;
    min-height: 80vh;

    .spec_head {
      height: 162/100rem;
      padding: 0 26/100rem;

      .spec_close {
        position: absolute;
        right: 26/100rem;
        top: 6/100rem;
      }

      .spec_pro_img {
        position: absolute;
        width: 170/100rem;
        height: 170/100rem;
        text-align: center;
        line-height: 170/100rem;
        top: -35/100rem;
        border: 2/100rem solid #e0e0e0;
        border-radius: 10/100rem;
        background: #fff;

        img {
          width: 140/100rem;
          vertical-align: middle;
        }
      }

      .spec_pro_price {
        font-family: "DIN";
        display: flex;
        align-items: center;
        margin-left: 180/100rem;
        margin-top: 24/100rem;

        .spec_pro_nowprice {
          color: #ff8d97;
          font-size: 30/100rem;
          font-weight: bold;
        }

        .spec_pro_integral {
          font-size: 30/100rem;
          color: #ff8d97;
          font-weight: bold;
        }

        .spec_pro_inter_img {
          display: flex;
          align-items: flex-end;
          margin-left: 9/100rem;

          .iconfont {
            font-size: 30/100rem;
            display: inline-flex;
            color: #ff8d97;
            font-weight: bold;
          }
        }

        span {
          font-size: 24/100rem;
          color: #b8b8b8;
        }
      }

      .spec_pro_code {
        font-size: 26/100rem;
        color: #9d9d9d;
        margin-left: 186/100rem;
        margin-top: 10/100rem;
        display: flex;
        justify-content: space-between;

        .spec_pro_orig {
          font-size: 24/100rem;
          color: #b8b8b8;
          text-decoration: line-through;
        }
      }
    }

    .spec_body {
      padding: 0 26/100rem;
      overflow-y: scroll;
      width: 700/100rem;
      height: calc(80vh - 160px);

      .spec_title {
        color: #9d9d9d;
        font-size: 24/100rem;
        margin-bottom: 20/100rem;
      }

      .spec_type {
        margin-bottom: 30/100rem;

        button {
          margin-right: 20/100rem;
          margin-bottom: 10/100rem;
          color: #555;
          font-size: 24/100rem;
          background: #fff;
          border: 2/100rem solid #777;
          line-height: 2;
          min-width: 116/100rem;

          .iconfont {
            display: inline-flex;
            font-size: 24/100rem;
          }
        }

        button::after {
          border: none;
          box-shadow: none;
        }

        .button_click {
          color: #ff8d97;
          border: 2/100rem solid #ff8d97;

          .iconfont {
            color: #ff8d97;
          }
        }
      }

      .spec_num {
        margin-bottom: 62/100rem;

        span {
          color: #9d9d9d;
          font-size: 24/100rem;
          margin-bottom: 20/100rem;
        }

        .pro_icon {
          margin-right: 4/100rem;
          display: flex;
          border: 1px solid #ccc;
          border-radius: 6/100rem;
          float: right;
          width: 164/100rem;

          button {
            width: 44/100rem;
            height: 44/100rem;
            line-height: 42/100rem;
            padding: 0 22/100rem;
            margin: 0;
            color: #9f9f9f;
            font-size: 38/100rem;
            display: flex;
            justify-content: center;
            border-radius: 0;
            background: #f3f3f3;
          }

          button::after {
            border: none;
            box-shadow: none;
          }

          input {
            width: 70/100rem;
            height: 44/100rem;
            min-height: 44/100rem;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            padding: 0;
            font-size: 30/100rem;
            color: #565656;
            text-align: center;
            display: flex;
            align-items: center;
            font-family: "DIN";
          }
        }
      }
    }

    .spec_btn {
      display: flex;
      align-items: center;
      position: absolute;
      width: 100%;
      bottom: 0;

      .pro_buy {
        width: 50%;
        background: #ff8d97;
        color: #fff;
        font-size: 34/100rem;
        border-radius: 0;
        height: 100/100rem;
        line-height: 100/100rem;
      }

      .add_car {
        width: 50%;
        background: #ff8a00;
        color: #fff;
        height: 100/100rem;
        font-size: 34/100rem;
        border-radius: 0;
        line-height: 100/100rem;
      }

      .surebtn {
        width: 100%;
        background: #ff8d97;
        color: #fff;
        font-size: 34/100rem;
        border-radius: 0;
      }

      .surebtn_false {
        width: 100%;
        background: #d3d3d3;
        color: #fff;
        font-size: 34rpx;
        border-radius: 0;
      }

      button::after {
        border: none;
        box-shadow: none;
      }
    }
  }

  .group_model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 201;
  }

  .group_model {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 202;
    max-height: 880/100rem;

    .group_model_body {
      background: #fff;
      width: 640/100rem;
      max-height: 820/100rem;
      border-radius: 20/100rem;
      // margin: 31/100rem 60/100rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .group_model_icon {
        /* float: right; */
        position: absolute;
        top: -5%;
        right: -5%;
        height: 0.62rem;
        z-index: 10;
      }

      .group_model_title {
        text-align: center;
        font-size: 32/100rem;
        color: #040404;
        padding: 30/100rem 0;
        border-bottom: 1px solid #e0e0e0;
      }

      .group_model_list {
        padding: 0 20/100rem;
        width: 600/100rem;

        .group_block {
          height: 154/100rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e0e0e0;

          .group_block_left {
            display: inline-flex;
            align-items: center;

            .group_img {
              width: 98/100rem;
              height: 98/100rem;
              border-radius: 50%;
              margin-right: 14/100rem;
            }

            .group_name {
              display: inline-block;
              font-size: 28/100rem;
              color: #333;
              margin-right: 14/100rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 180/100rem;
            }

            .group_num {
              font-size: 20/100rem;
              color: #666;
            }

            .group_right_time {
              font-size: 22/100rem;
              color: #666;
            }
          }

          .group_block_right {
            button {
              background: #ff8d97;
              color: #fff;
              font-size: 24/100rem;
              border-radius: 20/100rem;
              margin: 0;
            }
          }
        }
      }
    }
  }

  .pro_com_img_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;
  }

  .pro_com_img {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    z-index: 203;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80%;
      vertical-align: middle;
    }
  }

</style>
