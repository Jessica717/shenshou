import request from '@/utils/index'
// 获取jssdk所需的数据
// 企业微信配置
export function wxConfig(info) {
  return request({
    url: '?m=index&a=getWeixinConfig&url=' + info,
    method: 'GET'
  })
}
// 登陆
export function appLogin(info) {
  const data = {
    openid: info.openid,
    uionId: info.uionId,
    name: info.name,
    iconurl: info.iconurl
  }
  return request({
    url: '?m=login&a=app_login',
    method: 'POST',
    data
  })
}
// 首页
// 获取首页轮播图
export function getBanner() {
  return request({
    url: '?m=activity&a=banner',
    method: 'GET'
  })
}
// 点击首页轮播图的统计
export function setBannerClick(id) {
  return request({
    url: '?m=activity&a=banner_click?id=' + id,
    method: 'GET'
  })
}
// 获取首页中奖列表
export function getWin(limit) {
  return request({
    url: '?m=activity&a=winning&limit=' + limit,
    method: 'GET'
  })
}
// 获取首页商品列表
export function getProList() {
  return request({
    url: '?m=list&a=type_recommend_goods',
    method: 'GET'
  })
}
// 获取猜你喜欢商品列表
export function getLikeList(page) {
  return request({
    url: '?m=list&a=getGuess&page=' + page,
    method: 'GET'
  })
}
// 获取首页推荐分类
export function getRecomType() {
  return request({
    url: '?m=menu',
    method: 'GET'
  })
}
// 获取首页促销列表
export function getFlashList() {
  return request({
    url: '?m=activity&a=type_promotion_goods',
    method: 'GET'
  })
}
// 获取首页弹框
export function getIndexModel() {
  return request({
    url: '?m=activity&a=index_coupon',
    method: 'GET'
  })
}
// 领取优惠券
export function rceiveCou(id) {
  return request({
    url: '?m=myinfo&a=get_discount&id=' + id,
    method: 'GET'
  })
}
// 获取热门搜索列表
export function getHotSearch(info) {
  const data = {
    pagesize: info.pagesize,
    page: info.page
  }
  return request({
    url: '?m=index&a=gethotword',
    method: 'POST',
    data
  })
}
// 发现页
// 获取发现页的文章列表
export function getFind(info) {
  const data = {
    limit: info.limit,
    page: info.page
  }
  return request({
    url: '?app=b2c&m=goodsarticle&a=index',
    method: 'POST',
    data
  })
}
// 获取发现页的文章详情
export function getArticle(id) {
  return request({
    url: '?app=b2c&m=goodsarticle&a=item&id=' + id,
    method: 'GET'
  })
}
// 分类页
// 获取分类列表
export function getTypeList(info) {
  return request({
    url: '?m=list&a=search',
    method: 'GET',
    params: {
      key: info.searchkey,
      par: info.par,
      limit: info.limit,
      fifter: info.fifter
    }
  })
}
// 购物车
// 获取购物车列表
export function getCarList() {
  return request({
    url: '?m=cart&a=cart',
    method: 'GET'
  })
}
// 获取购物车推荐列表 和 获取购物车凑单列表
export function getCarRecomList(info) {
  return request({
    url: '?m=list&a=cart_recommend',
    method: 'GET',
    params: {
      type: info.type
    }
  })
}
// 更新购物车
export function updateCar(info) {
  return request({
    url: '?m=cart&a=update',
    method: 'GET',
    params: {
      pid: info.pid,
      quantity: info.quantity
    }
  })
}
// 删除购物车商品
export function delCarPro(pid) {
  return request({
    url: '?m=cart&a=remove',
    method: 'GET',
    params: {
      pid: pid
    }
  })
}
// 促销列表
// 获取促销列表时间段列表
export function getSaleTime(info) {
  const data = {
    timeid: info.timeid,
    page: info.page,
    pagesize: info.pagesize
  }
  return request({
    url: '?m=activity&a=goods_sales_type',
    method: 'POST',
    data
  })
}
// 获取促销列表时间段列表
export function getSaleList(info) {
  const data = {
    timeid: info.timeid,
    page: info.page,
    pagesize: info.pagesize
  }
  return request({
    url: '?m=activity&a=goods_sales_list',
    method: 'POST',
    data
  })
}
// 试用列表
// 获取试用时间段和列表
export function getTryList(info) {
  const data = {
    timeid: info.timeid
  }
  return request({
    url: '?m=activity&a=goods_date_try',
    method: 'POST',
    data
  })
}
// 拼团中心
// 拼团列表
export function getGroupList(info) {
  const data = {
    timeid: info.timeid,
    page: info.page,
    pagesize: info.pagesize
  }
  return request({
    url: '?m=activity&a=goods_time_group',
    method: 'POST',
    data
  })
}
// 每日抽奖
// 获取抽奖背景图和抽奖奖品
export function getlottery() {
  return request({
    url: '?m=activity&a=lottery_index',
    method: 'POST'
  })
}
// 获取本次抽奖结果
export function getResult() {
  return request({
    url: '?m=lottery&a=cj',
    method: 'GET'
  })
}
// 获取本人抽奖记录
export function getWinList() {
  return request({
    url: '?m=lottery&a=info&page=1&type=0&limit=20',
    method: 'GET'
  })
}
// 领取非实物中奖
export function getGift(id) {
  return request({
    url: '?m=scanlottery&a=get_prize&code_id=' + id,
    method: 'GET'
  })
}
// 商品详情
// 获取商品详情
export function getProDetail(info) {
  return request({
    url: '?m=item&id=' + info.id + '&type=' + info.type,
    method: 'GET'
  })
}
// 获取商品评论详情
export function getComList(info) {
  return request({
    url: '?m=item&a=get_comment&goods_id=' + info.goods_id + '&page=' + info.page + '&limit=' + info.limit,
    method: 'GET'
  })
}
// 选择商品规格得出具体价格和库存
export function getProduct(info) {
  return request({
    url: '?m=item&a=get_product&goods_id=' + info.goods_id + '&marketing_type=0&spec=' + info.spec,
    method: 'GET'
  })
}
// 加入购物车
export function addCarofPro(info) {
  return request({
    url: '?m=cart&a=add',
    method: 'GET',
    params: {
      pid: info.pid,
      quantity: info.quantity,
      checked: info.checked,
      deal_type: info.deal_type
    }
  })
}
// 团购购买
export function addCarofGroup(info) {
  return request({
    url: '?m=grouppurchase&a=add',
    method: 'GET',
    params: {
      id: info.id,
      group_id: info.group_id,
      product_id: info.product_id,
      num: info.num,
      deal_type: info.deal_type
    }
  })
}
// 积分兑换购买
export function addCarofPoint(info) {
  return request({
    url: '?m=listexchange&a=pointadd',
    method: 'GET',
    params: {
      active: info.active,
      checked: info.checked,
      quantity: info.quantity,
      deal_type: info.deal_type
    }
  })
}
// 促销购买，立即购买
export function addCarofNormal(info) {
  return request({
    url: '?m=listexchange&a=add',
    method: 'GET',
    params: {
      pid: info.pid,
      num: info.num,
      goods_id: info.goods_id,
      deal_type: info.deal_type,
      type: info.type,
      lottery_id: info.lottery_id
    }
  })
}

// 收藏商品
export function collPro(id) {
  var data = {
    goods_id: id
  }
  return request({
    url: '?m=item&a=collect',
    method: 'POST',
    data: data
  })
}
// 取消收藏商品
export function cancleColl(id) {
  var data = {
    id: id
  }
  return request({
    url: '?m=member&a=remove_collect',
    method: 'POST',
    data: data
  })
}
// 获取生日专区列表
export function getBirthdayList(info) {
  const data = {
    type: info.type,
    page: info.page,
    pagesize: info.pagesize
  }
  return request({
    url: '?m=activity&a=goods_birthday',
    method: 'POST',
    data
  })
}
// 订单中心
// 获取订单列表
export function getOrderList(info) {
  return request({
    url: '?m=member&a=getOrders&id=' + info.id + '&page=' + info.page + '&limit=' + info.limit,
    method: 'GET'
  })
}
export function getOrder(info) {
  return request({
    url: '?m=member&a=getOrders&id=' + info.id + '&order_id=' + info.order_id,
    method: 'GET'
  })
}
// 取消订单
export function cancelOrder(id) {
  return request({
    url: '?m=order&a=order_cancel&id=' + id,
    method: 'GET'
  })
}
// 提醒发货
export function remindShip(id) {
  return request({
    url: '?m=order&a=remind_send&order_id=' + id,
    method: 'GET'
  })
}
// 确认收货
export function confirmReceipt(id) {
  return request({
    url: '?m=order&a=order_finish&order_id=' + id,
    method: 'GET'
  })
}
// 会员中心
// 我的优惠券获取我的优惠券
export function getMyCou(info) {
  var data = {
    page: info.page,
    pagesize: info.pagesize,
    type: info.type
  }
  return request({
    url: '?m=myinfo&a=my_discount',
    method: 'POST',
    data: data
  })
}
// 我的地址
// 获取地址列表
export function getMyaddrList() {
  return request({
    url: '?m=member&a=myaddress',
    method: 'GET'
  })
}
// 设置地址为默认地址
export function setDefaultAddr(info) {
  var data = {
    id: info.id,
    ship_name: info.ship_name,
    ship_mobile: info.ship_mobile,
    ship_area: info.ship_area,
    ship_addr: info.ship_addr,
    is_default: info.is_default
  }
  return request({
    url: '?m=member&a=editaddress',
    method: 'POST',
    data: data
  })
}
// 删除地址
export function delMyAddr(id) {
  return request({
    url: '?m=member&a=removeaddress&id=' + id,
    method: 'GET'
  })
}
// 我的赠品
// 获取我的赠品列表
export function getGiftList(info) {
  var data = {
    p: info.p,
    limit: info.limit,
    type: info.type
  }
  return request({
    url: '?m=scanlottery&a=my_prize',
    method: 'POST',
    data: data
  })
}
// 我的奖品
// 获取我的奖品列表
export function getPrizeList(info) {
  return request({
    url: '?m=lottery&a=info',
    method: 'GET',
    params: {
      page: info.page,
      limit: info.limit,
      type: info.type
    }
  })
}
// 我的积分明细
export function getScoreList(info) {
  var data = {
    page: info.page,
    pagesize: info.pagesize
  }
  return request({
    url: '?m=member&a=point',
    method: 'POST',
    data: data
  })
}
// 我的足迹
// 获取我的某月足迹天数和选中天数的商品足迹记录
export function getFootDays(info) {
  return request({
    url: '?m=myinfo&a=my_footprint',
    method: 'POST',
    data: info
  })
}
// 删除我的足迹
export function delFootsList(ids) {
  var data = {
    ids
  }
  return request({
    url: '?m=myinfo&a=my_footprint_remove',
    method: 'POST',
    data: data
  })
}
// 我的签到
// 获取我的签到天数
export function getSignDays() {
  return request({
    url: '?m=member&a=getsigndays',
    method: 'GET'
  })
}
// 当天签到
export function signToday() {
  return request({
    url: '?m=member&a=signin',
    method: 'GET'
  })
}
// 我的消息中心
// 获取我的消息列表
export function getNewsList(info) {
  var data = {
    type: info.type,
    page: info.page,
    pagesize: info.pagesize
  }
  return request({
    url: '?m=myinfo&a=get_messages',
    method: 'POST',
    data: data
  })
}
// 删除消息
export function delNewsList(ids) {
  var data = {
    ids
  }
  return request({
    url: '?m=myinfo&a=messages_remove',
    method: 'POST',
    data: data
  })
}
// 已读消息
export function readNew(id) {
  var data = {
    id
  }
  return request({
    url: '?m=myinfo&a=reading_message',
    method: 'POST',
    data: data
  })
}
// 个人中心
// 获取个人信息
export function getPersonInfo() {
  return request({
    url: '?m=myinfo&a=userinfo',
    method: 'POST'
  })
}
// 获取订单各数量
export function getOrderNum() {
  return request({
    url: '?m=order&a=get_orderstatus_num',
    method: 'GET'
  })
}
// 获取等级规则
export function getMemberRule() {
  return request({
    url: '?m=index&a=member_rule',
    method: 'GET'
  })
}
// 获取消息是否已读
export function getNewsRead() {
  return request({
    url: '?m=myinfo&a=check_unread',
    method: 'POST'
  })
}
// 保存个人信息
export function savePersonInfo(info) {
  var data = {
    data: info
  }
  return request({
    url: '?m=myinfo&a=usersave',
    method: 'POST',
    data
  })
}
// 获取我的关注列表
export function getMyIntersted() {
  return request({
    url: '?m=myinfo&a=hobby_type',
    method: 'POST'
  })
}
// 发送验证码
export function sendCode(code) {
  var data = {
    phone: code
  }
  return request({
    url: '?m=member&a=send_veriftcode',
    method: 'POST',
    data: data
  })
}
// 保存绑定手机号
export function savePhone(info) {
  var data = {
    phone: info.phone,
    code: info.code
  }
  return request({
    url: '?m=member&a=bind_phonenum',
    method: 'POST',
    data: data
  })
}
// 上传图片
// export function uploadHeadImg(data) {
//   return request({
//     url: '?m=myinfo&a=head_portrait',
//     method: 'POST',
//     data
//   })
// }
// 我的收藏
// 获取我的收藏列表
export function getMyCollList(info) {
  return request({
    url: '?m=member&a=get_mycollect',
    method: 'GET',
    params: {
      page: info.page,
      limit: info.limit
    }
  })
}
export function delCollList(id) {
  var data = {
    id
  }
  return request({
    url: '?m=member&a=remove_collect',
    method: 'POST',
    data: data
  })
}
// 我的评价
// 我的评价列表
export function getMyCommList(info) {
  var data = {
    page: info.page,
    limit: info.limit
  }
  return request({
    url: '?m=member&a=mycomment',
    method: 'POST',
    data: data
  })
}
// 获取未评价的列表
export function getnoCommList() {
  return request({
    url: '?m=member&a=getOrders',
    method: 'GET',
    params: {
      id: 6,
      page: 1
    }
  })
}
// 保存评价
export function saveMyComm(info) {
  return request({
    url: '?m=order&a=goods_comment_save',
    method: 'POST',
    data: info
  })
}
// 我的试用
// 我的试用列表
export function getMyTryList(info) {
  var data = {
    type: info.type,
    page: info.page,
    pagesize: info.pagesize
  }
  return request({
    url: '?m=myinfo&a=my_trygoods',
    method: 'POST',
    data: data
  })
}
// 我的团购
// 我的团购列表
export function getMyGroupList(info) {
  return request({
    url: '?m=grouppurchase&a=my_group',
    method: 'GET',
    params: {
      status: info.status,
      p: info.p,
      limit: info.limit
    }
  })
}
// 拼购详情
export function groupDetail(info) {
  return request({
    url: '?m=grouppurchase&a=my_newest_group',
    method: 'GET',
    params: {
      order_id: info.order_id,
      id: info.id
    }
  })
}
// 试用商品详情
// 获取试用商品详情
export function getTryDetail(info) {
  var data = {
    try_id: info.try_id,
    help_id: info.help_id
  }
  return request({
    url: '?m=activity&a=try_goods_info',
    method: 'POST',
    data: data
  })
}
// 试用下单
export function addCarofTry(id) {
  return request({
    url: '?m=listexchange&a=tryadd',
    method: 'GET',
    params: {
      active: id
    }
  })
}
// 发起助力活动
export function openInitiate(id) {
  return request({
    url: '?m=activity&a=try_help_sponsor',
    method: 'GET',
    params: {
      active: id
    }
  })
}
// 为他助力
export function boostHe(id) {
  return request({
    url: '?m=activity&a=try_help?id' + id,
    method: 'GET'
  })
}
// 确认订单页
// 购物车下单确认订单页
export function getOrderByCar(info) {
  return request({
    url: '?m=cart&a=checkout',
    method: 'POST',
    data: info
  })
}
// 兑换确认订单页
export function getOrderByExchange(info) {
  return request({
    url: '?m=cart&a=checkout5',
    method: 'GET',
    params: info
  })
}
// 直接下单确认订单页
export function getOrderByBuy(info) {
  return request({
    url: '?m=cart&a=checkout4',
    method: 'POST',
    data: info
  })
}
// 团购下单确认订单页
export function getOrderByGroup(info) {
  return request({
    url: '?m=cart&a=checkout3',
    method: 'POST',
    data: info
  })
}
// 根据物流，地址获取总价和邮费,使用优惠券
export function getPriceByTrack(info) {
  return request({
    url: '?m=cart&a=add_cashcoupon_code',
    method: 'GET',
    params: info
  })
}
// 取消使用优惠券
export function cancelCou(info) {
  return request({
    url: '?m=cart&a=remove_cashcoupon_code',
    method: 'GET',
    params: info
  })
}
// 提交信息，创建订单
export function submitOrder(info) {
  return request({
    url: '?m=cart&a=checkout_submit',
    method: 'POST',
    data: info
  })
}
// 提交信息，创建团购订单
export function submitGroupOrder(info) {
  return request({
    url: '?m=cart&a=checkout_submit3',
    method: 'POST',
    data: info
  })
}
// 吊起微信支付
export function wxPay(info) {
  return request({
    url: '?m=order&a=pay',
    method: 'GET',
    params: info
  })
}
// 订单详情
// 获取订单详情
export function getOrderDetail(info) {
  return request({
    url: '?m=order&a=order_details',
    method: 'GET',
    params: {
      id: info.id,
      is_sale: info.is_sale
    }
  })
}
// 获取订单物流详情
export function getOrderTrack(id) {
  return request({
    url: '?m=order&a=express',
    method: 'GET',
    params: {
      id: id
    }
  })
}
// 获取售后商品信息
export function getAfterPro(info) {
  var data = {
    order_id: info.order_id,
    product_id: info.product_id
  }
  return request({
    url: '?m=member&a=refund',
    method: 'POST',
    data: data
  })
}
// 提交售后申请
export function saveAfter(info) {
  return request({
    url: '?m=member&a=do_refund',
    method: 'POST',
    data: info
  })
}
// 取消售后申请
export function cancelAfter(info) {
  return request({
    url: '?m=member&a=cancel_refund',
    method: 'POST',
    data: info
  })
}
// 修改订单地址
export function changeAddr(info) {
  return request({
    url: '?m=order&a=order_consignee',
    method: 'POST',
    data: info
  })
}
// 扫码结果页
// 获取扫码商品
export function getScanInfo(info) {
  return request({
    url: '?m=scanlottery&a=info',
    method: 'POST',
    data: info
  })
}

// 获取设置更多
export function getSetInfo() {
  return request({
    url: '?m=index&a=about_content',
    method: 'GET'
  })
}
