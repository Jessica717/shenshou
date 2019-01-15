<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='sale_after'>
      <div class='after_head'>
        <span>本次售后服务由</span>
        <span class='name'>公主购</span>为您提供
      </div>
      <div class='after_type'>
        <div class="after_title">服务类型</div>
        <div class='type_list'>
          <span :class="ischose=='refunds'?'text_active':''" @click="choseType('refunds')" v-if='order_type==5'>退款</span>
          <span :class="ischose=='reship'?'text_active':''" @click="choseType('reship')" v-if='order_type!=5'>退货退款</span>
          <span :class="ischose=='barter'?'text_active':''" @click="choseType('barter')" v-if='order_type!=5'>换货</span>
          <span :class="ischose=='refunds'?'text_active':''" @click="choseType('refunds')" v-if='order_type!=5'>仅退款</span>
        </div>
        <i class='iconfont icon-jinggao type_tips'></i>
        <span v-if="ischose=='refunds'" class='type_tips'>此项仅在未收到货，或卖家协商同意前提下进行</span>
        <span v-if="ischose=='reship'" class='type_tips'>此项仅在已收到货，需要退换已收到的货物的情况下进行</span>
        <span v-if="ischose=='barter'" class='type_tips'>此项仅在商品存在质量问题，联系卖家协商换货的情况下进行</span>
      </div>
      <div class='after_pro'>
        <div class='car_pro'>
          <div class='pro_img'>
            <img :src='orderInfo.img' v-if="orderInfo.img!=null&&orderInfo.img!=''" />
            <img src='@/assets/img/pro/static.png' v-else />
          </div>
          <div class='pro_info'>
            <div class='pro_title'>
              <span>{{orderInfo.name}}</span>
            </div>
            <div class='pro_spec'>
              <div class='pro_price'>
                <div class='spec_info' v-if="orderInfo.title!=''&&orderInfo.title!=null">规格:{{orderInfo.title}}</div>
                <div style='display:flex;align-items:center;'>
                  <div class='pro_inter_img' v-if='orderInfo.point>0'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='orderInfo.point>0'>{{orderInfo.point}}</span>
                  <span class='pro_integral' v-if='orderInfo.point>0&&orderInfo.price>0'>+</span>
                  <span class='peo_nowprice' v-if='orderInfo.price>0'>￥{{orderInfo.price}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='after_com'>
        <textarea auto-height placeholder="请您在此描述您的问题,尽可能详细（大于10个字），通过的概率会更大" maxlength='-1' placeholder-class="phcolor"
          v-model='procomm' />
        <div class='com_imgList'>
            <div class='imgBlock' v-for="(item,index) in imgs" :key='index' >
                <i class='iconfont icon-to-remove' @click='delImg(index)'></i>
                <span></span>
                <img :src='item' @click="previewImg(item)"/>
            </div>
            <div @click='showUpload' class='hidden_input'>
                <!-- <input type="file" accept="image/*" id='album' name="pic"> -->
                <i class='iconfont icon-addpictures addicon' :hidden='imgs.length==5'></i>
            </div>
        </div>
      </div>
      <div class='after_tips'>
        提交服务单后，售后专员可能会和您电话联系，请保持电话畅通
      </div>
      <div class='after_tracking' v-if="ischose!='refunds'&&flag>=2">
         <span>快递公司：</span>
         <input placeholder="请输入快递公司" placeholder-class="trackText" v-model='track_name'/>
      </div>
      <div class='after_tracking' v-if="ischose!='refunds'&&flag>=2">
        <span>快递单号：</span>
        <input placeholder="请输入物流单号" type='number' placeholder-class="trackText" v-model='track_number'/>
      </div>
      <div class='comBtn'>
        <mt-button size='normal' @click='saveAfter(orderInfo.goods_id,orderInfo.product_id)' v-if='orderInfo.flag==0||orderInfo.flag==-1'>提交</mt-button>
        <mt-button size='normal' v-else @click='saveAfter(orderInfo.goods_id,orderInfo.product_id)' >提交修改</mt-button>
      </div>
    </div>
    <div class='pro_com_img_bg' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg"></div>
      <div class='pro_com_img' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg">
        <img :src="img_show_big" alt="" @click="hiddenImg">
    </div>
    <!-- 弹出框 -->
    <div class='avatar_model_bg' :hidden='hiddenUploadImg' @click='hiddenModel'></div>
    <div class='avatar_model' :hidden='hiddenUploadImg'>
      <div class='avatar_title'>
        <span>上传图片</span>
      </div>
      <div class='avatar_info' @click='addImg'>
        <input type="file" accept="image/*" id='album' name="pic">
        <img src='@/assets/img/com/cra.png' />
        <span>相册</span>
      </div>
      <div class='avatar_info' @click='choseCra'>
        <!-- <input type="file" accept="image/*" capture="camera" id='camera'> -->
        <img src='@/assets/img/com/cra1.png' />
        <span>拍照</span>
      </div>
    </div>
    <div class='toast_model' v-if='showToast'></div>

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
import axios from 'axios'
import {
  getAfterPro, saveAfter
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
  name: 'SaleAfter',
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
      h_title: '申请售后服务',
      procomm: '',
      track_name: '',
      track_number: '',
      uploadimg: [], // 保存售后信息时原来的数据
      uploadOk: false,
      imgShow: false,
      img_show_big: '',
      tempFilePaths: [], // 传给后台的图片列表
      uploadimgList: [], // 保存售后信息传给后台的字段
      imgs: [], // 页面显示图片
      ischose: 'refunds',
      pid: '',
      order_Id: '',
      orderInfo: '',
      flag: 0,
      order_type: '',
      hiddenUploadImg: true,
      showToast: false
    }
  },
  mounted() {
    Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    this.pid = options.pid
    this.order_Id = options.orderId
    this.order_type = options.order_type
    this.getInfo()
  },
  methods: {
    showUpload() {
      this.hiddenUploadImg = false
    },
    hiddenModel() {
      this.hiddenUploadImg = true
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    // bindTextAreaBlur(e) {
    //   console.log(e)
    //   console.log(this.procomm)
    //   this.procomm = e
    // },
    // saveTrackName(e) {
    //   this.track_name = e
    // },
    // saveTrackNumber(e) {
    //   this.track_number = e
    // },
    choseType(id) {
      this.ischose = id
    },
    addImg() {
      console.log('选择相册')
      var that = this
      var imginput = document.getElementById('album')
      imginput.onchange = function (e) {
        let file = e.target.files[0]
        console.log(file)
        if (file.size > 5242880) {
          Toast({
            message: '图片必须小于5MB！',
            duration: 1000
          })
        } else {
          that.imgs.push(URL.createObjectURL(file))
          that.tempFilePaths.push(file)
          that.hiddenUploadImg = true
          console.log(that.imgs)
          console.log(that.uploadimg)
        //   that.uploadImg(file) 上传图片
        }
      }
    },
    choseCra() {
      var that = this
      console.log('选择拍照')
      let System = window.plus
      var cmr = System.camera.getCamera()
      var res = cmr.supportedImageResolutions[0]
      var fmt = cmr.supportedImageFormats[0]
      console.log('Resolution: ' + res + ', Format: ' + fmt)
      cmr.captureImage(function(path) {
        System.io.resolveLocalFileSystemURL(path, function (entry) {
          // 压缩图片
          let name = '_doc/upload/' + entry.name
          System.zip.compressImage({
            src: entry.toLocalURL(), // src: (String 类型 )压缩转换原始图片的路径
            dst: name, // 压缩转换目标图片的路径
            quality: 40, // quality: (Number 类型 )压缩图片的质量.取值范围为1-100
            overwrite: true// overwrite: (Boolean 类型 )覆盖生成新文件
          },
          function(zip) {
            console.log(zip)
            // 页面显示图片
            System.io.resolveLocalFileSystemURL(zip.target, function(url) {
              console.log(url)
              url.file(function(file) {
                console.log(file)
                if (file.size > 5242880) {
                  Toast({
                    message: '图片必须小于5MB！',
                    duration: 1000
                  })
                } else {
                  let fileReader = new System.io.FileReader()
                  fileReader.readAsDataURL(file)
                  fileReader.onloadend = function(e) {
                    let files = that.dataURLtoBlob(e.target.result.toString())
                    files.name = file.name
                    that.imgs.push(e.target.result.toString())
                    that.tempFilePaths.push(files)
                    that.hiddenUploadImg = true
                    // that.uploadImg(files)
                  }
                }
              })
            })
          // eslint-disable-next-line handle-callback-err
          }, function(error) {
            alert('压缩图片失败，请稍候再试')
          })
        }, function (e) {
          alert('读取拍照文件错误：' + e.message)
        })
      },
      function(error) {
        alert('Capture image failed: ' + error.message)
      },
      {resolution: res, format: fmt}
      )
    },
    dataURLtoBlob (dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1].replace(/\s/g, ''))
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    delImg(e) {
      var imgs = this.imgs
      var index = e
      imgs.splice(index, 1)
      this.imgs = imgs
      this.uploadimg.splice(index, 1)
      if (this.tempFilePaths.length > 0 && (index - this.uploadimg.length) < this.tempFilePaths.length && (index - this.uploadimg.length) >= 0) {
        this.tempFilePaths.splice((index - this.uploadimg.length), 1)
      }
    },
    previewImg(url) {
      if (this.showToast === false) {
        this.imgShow = true
        this.img_show_big = url
      }
    },
    hiddenImg() {
      this.imgShow = false
    },
    getInfo() {
      var that = this
      let info = {
        order_id: that.order_Id,
        product_id: that.pid
      }
      getAfterPro(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.orderInfo = res.data
          that.ischose = res.data.refund_info.type === undefined ? 'refunds' : res.data.refund_info.type
          that.procomm = res.data.refund_info.content === undefined ? '' : res.data.refund_info.content
          that.imgs = [...res.data.refund_info.img === undefined || res.data.refund_info.img === null ? [] : res.data.refund_info.img]
          that.uploadimg = [...res.data.refund_info.img === undefined || res.data.refund_info.img === null ? [] : res.data.refund_info.img]
          that.flag = res.data.flag
          that.track_name = res.data.refund_info.express === undefined ? '' : res.data.refund_info.express
          that.track_number = res.data.refund_info.express_no === undefined ? '' : res.data.refund_info.express_no
        }
      })
    },
    saveAfter(id, pid) {
      console.log(this.order_Id) // 订单id
      console.log(id) // goods-id
      console.log(pid) // pid
      console.log(this.procomm) // 申请
      console.log(this.ischose) // 服务类型
      if (this.ischose === '') {
        Toast({
          message: '请选择服务类型',
          duration: 1000
        })
      } else if (this.flag === 2 && this.track_name === '' && this.ischose !== 'refunds') {
        Toast({
          message: '请填写快递公司',
          duration: 1000
        })
      } else if (this.flag === 2 && this.track_number === '' && this.ischose !== 'refunds') {
        Toast({
          message: '请填写快递单号',
          duration: 1000
        })
      } else if (this.procomm.length <= 10) {
        Toast({
          message: '售后理由必须大于10个字',
          duration: 1000
        })
      } else {
        Indicator.open('提交中...')
        this.showToast = true
        var that = this
        console.log(that.tempFilePaths)
        console.log(that.uploadimg)
        if (that.tempFilePaths.length <= 0) {
          let info = {
            order_id: this.order_Id,
            type: this.ischose,
            product_id: pid,
            content: this.procomm,
            express: this.track_name,
            express_no: this.track_number,
            file_path: this.uploadimg.join(',')
          }
          saveAfter(info).then(res => {
            Indicator.close()
            that.showToast = false
            if (res.isSuccess) {
              Toast({
                message: '提交成功',
                iconClass: 'iconfont icon-dui1',
                duration: 1000
              })
              setTimeout(function() {
                that.$router.back()
              }, 1000)
            } else {
              Toast({
                message: res.msg,
                duration: 1000
              })
            }
          })
        } else {
          that.uploadImg({
            path: that.tempFilePaths.slice(0, 5 - that.uploadimg.length), // 这里是选取的图片的地址数组
            id: id,
            pid: pid
          })
        }
      }
    },
    uploadImg(data) {
      let that = this
      let i = data.i ? data.i : 0
      let success = data.success ? data.success : 0
      let fail = data.fail ? data.fail : 0
      // Indicator.open('上传中...')
      let param = new FormData() // 创建form对象
      param.append('file', data.path[i], data.path[i].name) // 通过append向form对象添加数据
      let config = {
        headers: {'Content-Type': 'multipart/form-data'},
        withCredentials: true
      }
      let url = '?m=order&a=imgsave'
      if (process.env.NODE_ENV === 'development') {
        url = '/api' + url
      } else {
        url = process.env.BASE_URL + url
      }
      console.log('请求上传接口啦')
      axios.post(url, param, config)
        .then(response => {
          console.log(response)
          if (response.data.isSuccess) {
            // that.getInfo()
            success++
            that.uploadimgList.push(response.data.data[0])
          } else {
            fail++
            console.log('fail:' + i + 'fail:' + fail)
          }
          i++
          if (i === data.path.length) { // 当图片传完时，停止调用
            console.log('成功：' + success + ' 失败：' + fail)
            that.uploadOk = true
            console.log(that.uploadimg)
            console.log(that.uploadimgList)
            that.uploadimgList = that.uploadimgList.concat(that.uploadimg)
            if (that.uploadOk) {
              let info = {
                order_id: that.order_Id,
                type: that.ischose,
                product_id: data.pid,
                content: that.procomm,
                express: that.track_name,
                express_no: that.track_number,
                file_path: that.uploadimgList.join(',')
              }
              saveAfter(info).then(res => {
                if (res.isSuccess) {
                  Indicator.close()
                  that.showToast = false
                  Toast({
                    message: '售后申请提交成功',
                    iconClass: 'iconfont icon-dui1',
                    duration: 1000
                  })
                  setTimeout(function() {
                    if (that.allComm === '0') {
                      if (that.proNum > 1) {
                        that.morePro = !that.morePro
                        that.tempFilePaths = []
                        that.imgs = []
                        that.pNum = 5
                        that.wNum = 0
                        that.fNum = 0
                        that.getOrder()
                      } else {
                        that.$router.back()
                      }
                    } else {
                      that.$router.back()
                    }
                  }, 1000)
                } else {
                  Toast({
                    message: res.msg,
                    duration: 1000
                  })
                }
              })
            }
          } else { // 若图片还没有传完，则继续调用函数
            data.i = i
            data.success = success
            data.fail = fail
            that.uploadImg(data)
          }
        }).catch(res => {
          console.log('请求出错')
        })
    }
  }
}
</script>

<style scoped lang="less">
@import '~styles/index.less';
@import '~styles/variable.less';
.after_head {
  font-size: 26/100rem;
  text-align: center;
  background: #f2f2f2;
  height: 50/100rem;
  color: #808080;
  line-height: 50/100rem;
}

.after_head .name {
  color: #ff8d97;
  margin: 0 8/100rem;
}

.after_type {
  background: #fff;
  font-size: 30/100rem;
  padding: 20/100rem 26/100rem;
  margin-bottom: 20/100rem;
}

.after_type .type_list {
  overflow: hidden;
  height: 70/100rem;
  line-height: 70/100rem;
  margin-top: 10/100rem;
}

.after_type .type_list span{
  padding: 10/100rem 30/100rem;
  border: 1px solid #c9c9c9;
  margin-right: 20/100rem;
  font-size: 26/100rem;
}

.type_tips {
  color: #a4a4a4;
  font-size: 24/100rem;
  margin-right:0.1rem;

}

.after_type .type_list .text_active {
  border: 1px solid #ff8d97;
  color: #ff8d97;
}

.after_pro .car_pro {
  padding: 0 26/100rem;
  height: 262/100rem;
  background: #fff;
  margin-bottom: 20/100rem;
  display: flex;
  align-items: center;
}

.car_pro .pro_img {
  float: left;
  /* margin-left: 18/100rem; */
  margin-right: 30/100rem;
  position: relative;
}

.pro_img img {
  width: 190/100rem;
  height: 186/100rem;
}

.car_pro .pro_info {
  width: 100%;
}

.pro_info .pro_title {
  font-size: 26/100rem;
  color: #444;
  /* margin-top: 30/100rem; */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.pro_title .title_icon {
  /* border: 2/100rem solid #ff8d97; */
  background: #ff8d97;
  height: 26/100rem;
  /* width: 48/100rem; */
  font-size: 20/100rem;
  color: #fff;
  border-radius: 8/100rem;
  line-height: 26/100rem;
  text-align: center;
  display: inline-block;
  margin-right: 10/100rem;
  padding: 0 6/100rem;
}

.pro_info .pro_spec {
  overflow: hidden;
  /* height: 64/100rem; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14/100rem;
}

.pro_spec .pro_price {
  font-family: 'DIN';
  width: 240/100rem;
}

.pro_price .peo_nowprice {
  color: #ff8d97;
  font-size: 30/100rem;
}

.pro_price .pro_integral {
  font-size: 30/100rem;
  color: #ff8d97;
}

.pro_price .pro_inter_img {
  display: inline-flex;
  align-items: flex-end;
  /* margin-left: 20/100rem; *//* margin-right: 30/100rem; */
}

.pro_price .pro_inter_img .iconfont {
  font-size: 30/100rem;
  color: #ff8d97;
  display: inline-flex;
}

.pro_price .pro_orig {
  font-size: 24/100rem;
  color: #b8b8b8;
  text-decoration: line-through;
}

.pro_price .spec_info {
  font-size: 20/100rem;
  color: #999;
}

.pro_weight span{
  font-size: 20/100rem;
  color: #888;
  font-weight: 'DIN';
}

.pro_spec .pro_btn {
  display: inline-flex;
  align-items: center;
}

.pro_spec .pro_btn button {
  min-width: 150/100rem;
  height: 52/100rem;
  border: 1px solid #808080;
  color: #808080;
  background: transparent;
  font-size: 24/100rem;
  padding: 0/100rem 20/100rem;
  line-height: 52/100rem;
  border-radius: 18/100rem;
}

.pro_spec .pro_btn button::after {
  border: none;
}

.after_com {
  padding: 26/100rem;
  background: #fff;
  margin-bottom: 10/100rem;
}

.after_com .phcolor {
  font-size: 30/100rem;
}

.after_com textarea {
  min-height: 180/100rem;
  width: 100%;
  outline: none;
  border: none;
}

.com_imgList {
  /* display: flex;
  justify-content: flex-start;
  align-items: center; */
  overflow: hidden;
  padding: 10/100rem 0;
}
.com_imgList .hidden_input{
  float: left;
  position: relative;
      width: 1.3rem;
    height: 1.3rem;
}
.hidden_input input{
    width: 1.23rem;
    height: 1.23rem;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
.com_imgList .imgBlock {
  position: relative;
  margin: 10/100rem;
  /* display: inline-flex; */
  float: left;
}

.imgBlock .iconfont {
  position: absolute;
  top: -28/100rem;
  right: 0;
  color: #ff8d97;
  z-index: 20;
}

.imgBlock span{
  display: blcok;
  position: absolute;
  top: -3/100rem;
  right: 6/100rem;
  background: #fff;
  width: 20/100rem;
  height: 20/100rem;
  border-radius: 50%;
  z-index: 10;
}

.imgBlock img {
  width: 130/100rem;
  height: 130/100rem;
}
.com_imgList .addicon {
  font-size: 125/100rem;
  color: #a4a4a4;
  position: absolute;
  top: -0.1rem;
}

.after_tips {
  color: #a4a4a4;
  font-size: 24/100rem;
  padding: 10/100rem 20/100rem;
}

.after_tracking {
  background: #fff;
  margin: 20/100rem 0;
  padding-left: 26/100rem;
  display: flex;
  align-items: center;
  height: 80/100rem;
}

.after_tracking span{
  font-size: 28/100rem;
  width: 21%;
}

.after_tracking input {
  font-size: 28/100rem;
  outline: none;
}

.after_tracking .trackText {
  font-size: 28/100rem;
}

.comBtn {
  margin-top: 30/100rem;
  margin-bottom: 40/100rem;
text-align: center;
}

.comBtn button {
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
    /* 弹出层 */

  .avatar_model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 150;
  }

  .avatar_model {
    width: 548/100rem;
    height: 328/100rem;
    border-radius: 10/100rem;
    position: fixed;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 160;
    background: #fff;
    /* text-align: center; */
  }

  .avatar_title {
    height: 82/100rem;
    margin-top: 20/100rem;
    padding-left: 30/100rem;
    border-bottom: 3/100rem solid #e2e2e2;
    display: flex;
    align-items: center;
  }

  .avatar_title span {
    font-size: 32/100rem;
    color: #333;
  }

  .avatar_info {
    height: 112/100rem;
    display: flex;
    align-items: center;
    padding-left: 30/100rem;
    border-bottom: 1px solid #e2e2e2 !important;
    position: relative;
  }
  .avatar_info input{
      position: absolute;
    z-index: 10;
    opacity: 0;
  }

  .avatar_info:last-child {
    border: none !important;
  }

  .avatar_info img {
    width: 34/100rem;
    height: 30/100rem;
  }

  .avatar_info span {
    font-size: 28/100rem;
    color: #555;
    margin-left: 20/100rem;
  }
    .toast_model{
    position: fixed;
    background: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 500;
  }
</style>
