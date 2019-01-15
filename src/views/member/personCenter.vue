<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div style="height:0.9rem" id='person'></div>
    <div class='p_center'>
      <div class='pc_body'>
        <div class='pc_info'>
          <span class='info_title'>头像</span>
          <div class='info_more' @click='editavatat'>
            <img :src="personInfo.image" class='pc_avatar' />
            <i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>
        <div class='pc_info'>
          <span class='info_title'>昵称</span>
          <div class='info_more' @click="edit('nickname','/editInfo?code=nickname&codename=修改昵称&isInput=0&value=',personInfo.nickname)">
            <span>{{personInfo.nickname==null?'':personInfo.nickname}}</span>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>
        <div class='pc_info'>
          <span class='info_title'>性别</span>
          <div class='info_more'>
            <span>{{personInfo.sex==null?'':(personInfo.sex=='male'?'男':'女')}}</span>
            <!-- <i class='iconfont icon-youjiantou1'></i> -->
          </div>
        </div>
        <div class='pc_info'>
          <span class='info_title'>生日</span>
          <div class='info_more' @click="edit('birthday','/improveInfo?visit=1','')">
            <span>{{personInfo.birthday!=null?personInfo.birthday:''}}</span>
            <i class='iconfont icon-youjiantou1' v-if='personInfo.birthday==null'></i>
          </div>
        </div>
        <div class='pc_info'>
          <span class='info_title'>电子邮箱</span>
          <div class='info_more' @click="edit('email','/editInfo?code=email&codename=修改电子邮箱&isInput=0&value=',personInfo.email)">
            <span>{{personInfo.email==null?'':personInfo.email}}</span>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>
        <div class='pc_info'>
          <span class='info_title'>收货地址</span>
          <div class='info_more' @click="edit('address','/editInfo?code=address&codename=我的地址&isInput=1','')">
            <span>{{personInfo.ship_area==null?'':personInfo.ship_area}}{{personInfo.ship_addr==null?'':personInfo.ship_addr}}</span>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>
        <div class='pc_info'>
          <span class='info_title'>绑定手机</span>
          <div class='info_more' @click="edit('tel','/bind?code=tel&visit=1','')">
            <span>{{personInfo.mobile==null?'':personInfo.mobile}}</span>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>
        <div class='pc_info'>
          <span class='info_title'>我的关注</span>
          <div class='info_attList' @click="edit('myIntersted','/myIntersted?visit=1','')">
            <div class='info_att'>
              <span v-if="personInfo.tag_ids!=''" v-for='(item,index) in personInfo.tag_list' :key='index'>{{item.name}}</span>
            </div>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>

      </div>
      <div class='exit_btn'>
        <mt-button form-type='submit' size='normal' @click='exit'>注销登录</mt-button>
      </div>
      <!-- 弹出框 -->
      <div class='avatar_model_bg' :hidden='hiddenavatar' @click='hiddenModel'>
      </div>
      <div class='avatar_model' :hidden='hiddenavatar'>
        <div class='avatar_title'>
          <span>修改头像</span>
        </div>
        <div class='avatar_info' @click='choseAlbum'>
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
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import axios from 'axios'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Spinner,
  Toast
} from 'mint-ui'
import {
  getPersonInfo
} from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  parseTime
} from '@/store/pubilc.js'
export default {
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Spinner,
    Toast
  },
  data() {
    return {
      avatarUrl: '@/assets/img/com/pc_avatar.png',
      hiddenavatar: true,
      personInfo: [],
      h_title: '个人中心',
      aweixin: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取个人信息
    let storage = window.localStorage
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      this.getInfo()
    }
    let that = this
    let System = window.plus
    System.oauth.getServices(
      function (services) {
        let auths = services
        console.log(auths)
        if (services[0].id === 'weixin') {
          that.aweixin = services[0]
        }
      },
      function (e) {
        alert('获取分享服务列表失败：' + e.message + ' - ' + e.code)
      }
    )
  },
  methods: {
    ...mapMutations({
      setIsbind: 'SET_ISBIND',
      setUserInfo: 'SET_USERINFO'
    }),
    exit() {
      let that = this
      if (window.plus) {
        console.log('app端')
        this.aweixin.logout(function(e) {
          console.log('注销登录认证成功！')
        }, function(e) {
          console.log(e)
          console.log('注销登录认证失败！')
        })
        let storage = window.localStorage
        storage.clear()
        console.log(storage)
        storage.setItem('token', null)
        storage.setItem('isLogin', false)
        console.log(storage)
        // this.setUserInfo(userInfo)
        console.log('开始清空vuex')
        console.log('重置页面')
        that.$router.replace({
          path: '/member'
        })
        window.location.reload()
        // window.plus.runtime.restart()
      } else {
        console.log('浏览器端')
        window.location.reload()
        let storage = window.localStorage
        storage.clear()
        console.log(storage)
        storage.setItem('token', null)
        storage.setItem('isLogin', false)
        console.log(storage)
        // eslint-disable-next-line no-useless-escape
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
        if (keys) {
          for (var i = keys.length; i--;) { document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() }
        }
        console.log('开始清空vuex')
        console.log('重置页面')
        this.$router.replace({
          path: '/member'
        })
      }
    },
    editavatat: function () {
      this.hiddenavatar = !this.hiddenavatar
    },
    edit(type, url, value) {
      console.log(type)
      if (type === 'birthday') {
        if (this.personInfo.birthday == null) {
          this.$router.togo({
            path: url + '&sex=' + this.personInfo.sex + '&birthday=' + this.personInfo.birthday
          })
        }
      } else {
        if (value !== '') {
          url = url + value
        }
        console.log(url)
        this.$router.togo({
          path: url
        })
      }
    },
    choseAlbum: function () {
      console.log('选择相册')
      var that = this
      var imginput = document.getElementById('album')
      imginput.onchange = function (e) {
        let file = e.target.files[0]
        console.log(file)
        if (file.size > 5242880) {
          Toast({
            message: '头像大小不能大于5MB！',
            duration: 1000
          })
        } else {
          that.uploadImg(file)
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
                if (file.size > 657920) {
                  Toast({
                    message: '头像必须小于5MB！',
                    duration: 1000
                  })
                } else {
                  let fileReader = new System.io.FileReader()
                  fileReader.readAsDataURL(file)
                  fileReader.onloadend = function(e) {
                    // console.log(e.target.result.toString())
                    let files = that.dataURLtoBlob(e.target.result.toString())
                    files.name = file.name
                    console.log(files)
                    that.uploadImg(files)
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
    // choseCra(){
    //   var imginput = document.getElementById('camera')
    //   imginput.onchange = function (e) {
    //     let file = e.target.files[0]
    //     if (file.size > 5242880) {
    //       Toast({
    //         message: '头像必须小于5MB！',
    //         duration: 1000
    //       })
    //     } else {
    //       that.uploadImg(file)
    //     }
    //   }
    // },
    uploadImg(file) {
      console.log(file)
      var that = this
      // Indicator.open('上传中...')
      let param = new FormData() // 创建form对象
      param.append('file', file, file.name) // 通过append向form对象添加数据
      // console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: {'Content-Type': 'multipart/form-data'},
        withCredentials: true
      }
      let url = '?m=myinfo&a=head_portrait'
      if (process.env.NODE_ENV === 'development') {
        url = '/api' + url
      } else {
        url = process.env.BASE_URL + url
      }
      console.log('请求上传接口啦')
      axios.post(url, param, config)
        .then(response => {
          console.log(response)
          // Indicator.close()
          // const url = URL.createObjectURL(file)
          // that.personInfo.image = url
          // that.hiddenavatar = true
          if (response.data.isSuccess) {
            that.getInfo()
          }
        }).catch(res => {
          console(res)
        })
    },
    hiddenModel: function () {
      this.hiddenavatar = true
    },
    getInfo: function () {
      var that = this
      // 查看个人信息列表
      getPersonInfo().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          console.log(res.data.birthday)
          if (res.data.birthday != null) {
            res.data.birthday = parseTime(parseInt(res.data.birthday) * 1000, '{y}-{m}-{d}')
          }
          console.log(res.data.birthday)
          that.personInfo = res.data
          that.hiddenavatar = true
          let userInfo = {}
          console.log(that.personInfo)
          if (that.personInfo.image.indexOf('http') === -1) {
            userInfo.avatar = process.env.BASE_URL + that.personInfo.image
          } else {
            userInfo.avatar = that.personInfo.image
          }
          userInfo.level = that.personInfo.rankName
          userInfo.isShow = 1
          userInfo.nickname = that.personInfo.nickname
          if (that.personInfo.mobile !== '' && that.personInfo.mobile != null) {
            that.setIsbind(true)
          }
          that.setUserInfo(userInfo)
        }
      })
    }
  },
  computed: {
    ...mapGetters(['number', 'carnum', 'isbind', 'score', 'news', 'newsnum', 'issign'])
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .p_center {
    /* padding: 0 26/100rem; */
    font-family: SimHei;
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .pc_header {
    text-align: center;
    /* padding-top: 40/100rem; */
    background: #ff8d97;
    height: 94/100rem;
    line-height: 94/100rem;
  }

  .pc_header i {
    float: left;
    padding-left: 13px;
    color: #fff;
  }

  .pc_header span {
    color: #fff;
    font-size: 38/100rem;
    margin-left: -26/100rem;
  }

  .pc_body {
    padding: 0 18/100rem;
    background: #fff;
  }

  .pc_info {
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    padding: 20/100rem 0;
  }

  .pc_info .info_title {
    font-size: 28/100rem;
    color: #4d4d4d;
    width: 116/100rem;
    text-align: left;
    display: inline-block;
    margin-right: 30/100rem;
  }

  .pc_info .info_more {
    width: 590/100rem;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
  }

  .pc_info .info_more span {
    color: #bcbcbc;
    font-size: 26/100rem;
    font-family: 'DIN';
  }

  .pc_info .info_more .pc_avatar {
    width: 98/100rem;
    height: 98/100rem;
    border-radius: 50%;
  }

  .pc_info .info_more i {
    color: #bebebe;
  }

  .pc_info:last-child {
    border: none;
    display: flex;
    align-items: flex-start;
  }

  .pc_info:last-child .info_title {
    margin-top: 18/100rem;
  }

  .pc_info .info_attList {
    width: 590/100rem;
    display: inline-flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .pc_info .info_attList .info_att span {
    border: 1px solid #bcbcbc;
    border-radius: 20/100rem;
    font-size: 28/100rem;
    color: #bcbcbc;
    padding: 12/100rem 20/100rem;
    display: inline-block;
    margin: 12/100rem 0;
    margin-right: 22/100rem;
  }

  .pc_info .info_attList i {
    color: #bebebe;
  }

  /* 弹出层 */

  .avatar_model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 50;
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
    z-index: 60;
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
  .exit_btn{
    position: fixed;
    bottom: 0;
    height: 138/100rem;
    width: 100%;
    background: #f2f2f2;
    text-align: center;
  }
    .exit_btn button {
    width: 460/100rem;
    height: 78/100rem;
    line-height: 78/100rem;
    border: none;
    background: #ff8d97;
    color: #fff;
    outline: none;
    font-size: 40/100rem;
    border-radius: 20/100rem;
    margin-top: 45/100rem;
  }

</style>
