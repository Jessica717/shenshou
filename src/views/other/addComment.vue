<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='AddComment'></div>
    <div class='add_com' v-if='!morePro'>
      <div class='addComlist'>
        <div class='comInfo'>
          <div class='comPro'>
            <div class='pro_img'>
              <img :src='proInfo.product_img_src' />
            </div>
            <div class='pro_info'>
              <div class='pro_title'>{{proInfo.name}}</div>
              <div class='pro_spec'>
                <div class='pro_price'>
                  <div style='display:flex;align-items:center;'>
                    <div class='pro_inter_img' v-if='proInfo.point>0'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral' v-if='proInfo.point>0'>{{proInfo.point}}</span>
                    <span class='pro_integral' v-if='proInfo.point>0&&proInfo.price>0'>+</span>
                    <span class='peo_nowprice' v-if='proInfo.price>0'>¥{{proInfo.price}}</span>
                  </div>
                </div>
                <div class='pro_weight'>
                  <span>{{proInfo.title}}*{{proInfo.nums}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class='comText'>
            <textarea @blur="bindTextAreaBlur(procomm)" v-model='procomm' auto-height placeholder="商品是否满足您的期待？说说它的优点或美中不足吧"
              maxlength='-1' placeholder-class="phcolor" />
            <div class='com_imgList'>
                <div class='imgBlock' v-for="(item,index) in imgs" :key="index">
                    <i class='iconfont icon-to-remove' @click='delImg(index)'></i>
                    <span></span>
                    <img :src='item' @click="previewImg(item)"/>
                </div>
            <div @click='showUpload' class='hidden_input'>
                <!-- <input type="file" accept="image/*" id='album' name="pic"> -->
                <i class='iconfont icon-addpictures addicon' :hidden='imgs.length==9'></i>
            </div>
            </div>
        </div>
        <div class='comStar'>
            <div class='title'>
                <i class='iconfont icon-shop'></i>
                <span>商品评分：</span>
            </div>
            <div class='starInfo'>
                <div class='starTitle'>
                <span>商品描述：</span>
                </div>
                <div class='star'>
                    <i :class="index<pNum?'iconfont icon-xingping light':'iconfont icon-star'" v-for='(item,index) in 5' :key='index' @click="choseStar('p',index)"></i>
                </div>
            </div>
            <div class='starInfo'>
                <div class='starTitle'>
                    <span>物流服务：</span>
                </div>
                <div class='star'>
                    <i :class=" index<wNum?'iconfont icon-xingping light':'iconfont icon-star'" v-for='(item,index) in 5' :key='index' @click="choseStar('w',index)"></i>
                </div>
            </div>
            <div class='starInfo'>
                <div class='starTitle'>
                    <span>服务评价：</span>
                </div>
                <div class='star'>
                    <i :class="index<fNum?'iconfont icon-xingping light':'iconfont icon-star'" v-for='(item,index) in 5' :key='index' @click="choseStar('f',index)"></i>
                </div>
            </div>
        </div>
        </div>
        <div class='comBtn'>
        <mt-button size='normal' @click='saveCom(proInfo.goods_id,proInfo.product_id)' id='proInfo.goods_id' data-pid='proInfo.product_id'>完成</mt-button>
        </div>
      </div>
    </div>
    <div class='comlist' v-if='morePro'>
        <div class='addComlist'>
            <div class='comInfo'>
                <div class='comPro' v-for='(item,index) in orderInfo' :key='index'>
                    <div class='pro_img'>
                        <img :src='item.product_img_src'/>
                    </div>
                    <div class='pro_info'>
                        <div class='pro_title'>{{item.name}}</div>
                        <div class='pro_spec'>
                            <div class='pro_weight'>
                                <span>规格：{{item.title}}</span>
                                <span>数量：{{item.nums}}</span>
                            </div>
                            <div class='pro_btn'>
                                <mt-button size='small' class='btn_red' @click='addComm(item.product_id)' v-if='item.iscomment==0&&item.is_up!=null'>评价晒单</mt-button>
                                <mt-button size='small' class='btn_default' v-if='item.iscomment==1&&item.is_up!=null'>已评价</mt-button>
                            </div>
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
    <!-- 弹出框 -->
    <div class='avatar_model_bg' :hidden='hiddenUploadImg' @click='hiddenModel'>
    </div>
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
import {
  getOrder, saveMyComm
} from '@/api/index'
import axios from 'axios'
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
  name: 'AddComment',
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
      h_title: '提交评价',
      morePro: false,
      proNum: 1,
      wNum: 0,
      pNum: 5,
      fNum: 0,
      orderInfo: [],
      orderId: '',
      proInfo: {},
      procomm: '',
      tempFilePaths: [],
      imgs: [],
      allComm: 0,
      uploadimgList: [],
      uploadOk: false,
      imgShow: false,
      img_show_big: '',
      hiddenUploadImg: true,
      showToast: false

    }
  },
  mounted() {
    // Indicator.open('加载中...')
    console.log(this.$route.query)
    var options = this.$route.query
    this.proNum = options.num
    this.orderId = options.orderId
    if (options.num > 1) {
      this.h_title = '评价晒单'
      this.morePro = true
    } else {
      this.h_title = '提交评价'
      this.morePro = false
    }
    console.log(this.orderId)
    this.getOrder()
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
      document.getElementById('AddComment').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    choseStar(type, id) {
      if (type === 'w') {
        this.wNum = parseInt(id) + 1
      }
      if (type === 'p') {
        this.pNum = parseInt(id) + 1
      }
      if (type === 'f') {
        this.fNum = parseInt(id) + 1
      }
    },
    bindTextAreaBlur(value) {
      this.procomm = value
    },
    getOrder: function() {
      var that = this
      let info = {
        id: 0,
        order_id: that.orderId
      }
      getOrder(info).then(res => {
        if (res.isSuccess) {
          if (res.rows != null) {
            if (that.proNum > 1) {
              that.allComm = res.rows[0].iscomment
              that.orderInfo = res.rows[0].order_items
            } else {
              that.allComm = res.rows[0].iscomment
              that.proInfo = res.rows[0].order_items[0]
            }
          }
        }
      })
    },
    addComm(id) {
      for (var i = 0, len = this.orderInfo.length; i < len; i++) {
        if (id === this.orderInfo[i].product_id) {
          this.proInfo = this.orderInfo[i]
        }
      }
      this.morePro = false
    },
    addImg() {
      console.log('选择相册')
      var that = this
      var imginput = document.getElementById('album')
      imginput.onchange = function (e) {
        console.log(e)
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
      console.log(cmr)
      cmr.captureImage(function(path) {
        console.log(path)
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
                    console.log(files)
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
            if (that.uploadOk) {
              let info = {
                order_id: this.orderId,
                goods_id: data.id,
                product_id: data.pid,
                score: this.pNum,
                server_score: this.wNum,
                express_score: this.fNum,
                goods_comment: this.procomm,
                file_path: that.uploadimgList.join(',')
              }
              saveMyComm(info).then(res => {
                if (res.isSuccess) {
                  Indicator.close()
                  that.showToast = false
                  Toast({
                    message: '评价成功',
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
    },
    delImg(index) {
      this.imgs.splice(index, 1)
      this.tempFilePaths.splice(index, 1)
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
    saveCom(id, pid) {
      console.log(this.orderId) // 订单id
      console.log(id) // goods-id
      console.log(pid) // pid
      console.log(this.procomm) // 评价
      console.log(this.pNum) // 商品
      console.log(this.wNum) // 物流
      console.log(this.fNum) // 服务
      if (this.pNum === 0 || this.wNum === 0 || this.fNum === 0) {
        Toast({
          message: '请对商品进行评分',
          duration: 1000
        })
      } else {
        Indicator.open('提交中...')
        this.showToast = true
        var that = this
        if (that.tempFilePaths.length <= 0) {
          let info = {
            order_id: that.orderId,
            goods_id: id,
            product_id: pid,
            score: that.pNum,
            server_score: that.wNum,
            express_score: that.fNum,
            goods_comment: that.procomm
          }
          saveMyComm(info).then(res => {
            if (res.isSuccess) {
              Indicator.close()
              that.showToast = false
              // 提交成功的提示
              Toast({
                message: '感谢您的评价，评价已提交',
                iconClass: 'iconfont icon-dui1',
                duration: 1000
              })
              //   wx.showToast({
              //     title: '感谢您的评价，评价已提交',
              //     icon: 'none',
              //     duration: 1000,
              //     mask: true
              //   })
              setTimeout(function() {
                if (that.allComm === '0') {
                  if (that.proNum > 1) {
                    that.morePro = !that.morePro
                    that.tempFilePaths = []
                    that.imgs = []
                    that.wNum = 0
                    that.pNum = 5
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
        } else {
          that.uploadImg({
            path: that.tempFilePaths.slice(0, 9), // 这里是选取的图片的地址数组，只选取前九张
            id: id,
            pid: pid
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~styles/index.less';
@import '~styles/variable.less';
.add_com {
  height: 100%;
  background: #f2f2f2;
}

.comInfo {
  background: #fff;
}

.comInfo .comPro {
  padding: 0 26/100rem;
  height: 230/100rem;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  align-items: center;
}

.comPro .pro_img {
  float: left;
  margin-left: 18/100rem;
  margin-right: 30/100rem;
  position: relative;
}

.pro_img img {
  width: 190/100rem;
  height: 186/100rem;
}

.pro_img .pro_tips {
  width: 190/100rem;
  height: 52/100rem;
  background: rgba(0, 0, 0, 0.6);
  line-height: 52/100rem;
  text-align: center;
  position: absolute;
  bottom: 0;
}

.pro_tips span {
  color: #fff;
  font-size: 24/100rem;
}

.comPro .pro_info {
  width: 100%;
}

.pro_info .pro_title {
  font-size: 30/100rem;
  /* font-weight: bold; */
  color: #444;
  margin-top: 30/100rem;
  height: 80/100rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.pro_info .pro_spec {
  overflow: hidden;
  height: 82/100rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pro_spec .pro_price {
  font-family: 'DIN';
  width: 240/100rem;
}

.pro_price .peo_nowprice {
  color: #ff8d97;
  font-size: 30/100rem;font-weight: bold;
}

.pro_price .pro_integral {
  font-size: 30/100rem;font-weight: bold;
  color: #ff8d97;
}

.pro_price .pro_inter_img {
  display: inline-flex;
  align-items: flex-end;
  /* margin-right: 30/100rem; */
}

.pro_price .pro_inter_img .iconfont {
  font-size: 30/100rem;font-weight: bold;
  color: #ff8d97;
  display: inline-flex;
}

/* .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

.pro_price .pro_orig {
  font-size: 24/100rem;
  color: #b8b8b8;
  text-decoration: line-through;
}

.pro_weight span {
  font-size: 20/100rem;
  color: #888;
  font-weight: 'DIN';
  margin-right: 10/100rem;
}

.pro_btn {
  display: inline-flex;
}

.pro_btn button {
  margin-right: 16/100rem;
  border: 1px solid #808080;
  color: #808080;
  background: transparent;
  border-radius: 50/100rem;
  font-size: 26/100rem;
  width: 160/100rem;
  padding: 0 26/100rem;
}

.pro_btn .btn_red {
  border-color: #f06b90;
  color: #f06b90;
  font-size: 24/100rem;
}

.pro_btn .btn_default {
  font-size: 24/100rem;
}

.comText {
  padding: 26/100rem;
  border-bottom: 1px solid #ebebeb;
}

.comText .phcolor {
  font-size: 30/100rem;
  /* font-weight: bold; */
}

.comText textarea {
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

.imgBlock span {
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

/* 评价星星 */

.comStar {
  padding: 26/100rem;
  border-bottom: 1px solid #ebebeb;
}

.comStar .title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 30/100rem;
  /* font-weight: bold; */
  margin-bottom: 20/100rem;
}

.title .iconfont {
  display: inline-flex;
  color: #a4a4a4;
  margin-right: 10/100rem;
  font-size: 30/100rem;
  /* font-weight: bold; */
}

.comStar .starInfo {
  display: flex;
  align-items: center;
  padding: 14/100rem 0;
}

.starInfo .starTitle {
  font-size: 30/100rem;
  /* font-weight: bold; */
  color: #444;
}

.starInfo .star {
  display: inline-flex;
}

.starInfo .star .iconfont {
  display: inline-flex;
  margin: 0 4/100rem;
}

.starInfo .star .light {
  color: #ff8d97;
}

.comBtn {
  margin-top: 40/100rem;
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
