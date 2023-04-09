<!-- 登录注册 -->
<template>
  <div>
    <div class="container loginbg"
         :style="{backgroundImage:this.$store.state.webConfig.other.otherLoginImg?'url('+this.$store.state.webConfig.other.otherLoginImg+')':''}">
      <h1 class="loginTitle">
        <a href="/">{{this.$store.state.webConfig.defaultUser.nickName}} 的博客</a>
      </h1>
      <!-- 登录注册 -->
      <div v-show="!err2005"
           class="">
        <div v-if="login==1"
             class="loginBox">
          <div class="lr-title">
            <h1>登录</h1>
            <p>
              新用户<a href="/Login?login=0"
                 class="tcolors">注册</a>
            </p>
          </div>
          <el-alert v-show="loginErr"
                    :title="loginTitle"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <el-input type="text"
                    placeholder="手机号/用户名"
                    v-model="name">
          </el-input>
          <el-alert v-show="nameErr"
                    title="请输入手机号/用户名"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <el-input type="password"
                    placeholder="密码"
                    @keyup.enter.native="loginEnterFun"
                    v-model="password">
          </el-input>
          <el-alert v-show="passwordErr"
                    title="请输入密码"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <h3><a href="">忘记密码？</a></h3>
          <div class="lr-btn tcolors-bg"
               @click="gotoHome">登录</div>
          <div class="otherLogin">
            <a href="javascript:void(0)"><i class="fa fa-fw fa-wechat"></i></a>
            <a href="javascript:void(0)"><i class="fa fa-fw fa-qq"></i></a>
            <a href="javascript:void(0)"><i class="fa fa-fw fa-weibo"></i></a>
          </div>
        </div>
        <div v-else
             class="registerBox">
          <div class="lr-title">
            <h1>注册</h1>
            <p>
              已有账号<a href="/Login?login=1"
                 class="tcolors">登录</a>
            </p>
          </div>
          <el-alert v-show="registerErr"
                    :title="registerTitle"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <el-input type="text"
                    placeholder="用户名"
                    v-model="nusername">
          </el-input>
          <el-alert v-show="nusernameErr"
                    title="用户名错误"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <el-input type="phone"
                    placeholder="手机号"
                    v-model="nphone">
          </el-input>
          <el-alert v-show="nphoneErr"
                    title="手机号错误"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <el-input type="text"
                    placeholder="验证码"
                    v-model="ncode"
                    style="width:60%">
          </el-input>
          <el-button style="width:38%"
                     type="warning"
                     size="medium"
                     @click="GetVCode"
                     :disabled="codeTime>0">{{codeTime>0?codeTime:"获取验证码"}}</el-button>
          <el-alert v-show="ncodeErr"
                    title="验证码错误"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <el-input type="password"
                    placeholder="密码:6-12位英文、数字、下划线"
                    v-model="npassword">
          </el-input>
          <el-alert v-show="npasswordErr"
                    title="密码错误"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <el-input type="password"
                    placeholder="确认密码"
                    @keyup.enter.native="registerEnterFun"
                    v-model="npassword2">
          </el-input>
          <el-alert v-show="npassword2Err"
                    title="重复密码有误"
                    type="error"
                    show-icon
                    :closable="false">
          </el-alert>
          <div class="lr-btn tcolors-bg"
               @click="newRegister"
               v-loading.fullscreen.lock="fullscreenLoading"
               element-loading-text="提交中">注册</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import { GetVerificationCode, Register, Login, GetWebConfig } from "@/api/server.js"
import cookies from '@/plugins/js-cookie.js'
export default {
  name: 'Login',
  data () { //选项 / 数据
    return {
      username: '',//用户名
      name: '',//用户名
      password: '',//密码
      nusername: '',//新用户注册名
      nphone: '',//新用户注册手机号
      ncode: '',//注册验证码
      codeTime: 0,
      npassword: '',//新用户注册密码
      npassword2: '',//新用户注册重复密码
      login: 0,//是否已经登录
      nameErr: false,//登录用户名错误
      passwordErr: false,//的轮毂密码错误
      loginErr: false,//登录错误
      loginTitle: '用户名或密码错误',
      nusernameErr: false,//新用户注册用户名错误
      nphoneErr: false,//新用户注册手机号错误
      npasswordErr: false,//新用户注册密码错误
      npassword2Err: false,//新用户注册重复密码错误
      registerErr: false,//已注册错误
      registerTitle: '该手机号已注册',
      err2005: false,//是否展示注册进度条状态
      step: 1,//注册进度
      fullscreenLoading: false,//全屏loading
      urlstate: 0,//重新注册
    }
  },
  head () {
    return {
      title: this.$store.state.webConfig.baseSeo.seoTitleStyle == 0 ? (this.login == 1 ? '登录' : '注册') :
        this.$store.state.webConfig.baseSeo.seoTitleStyle == 1 ? (this.login == 1 ? '登录' : '注册') + " - " + this.$store.state.webConfig.basics.blogName :
          this.$store.state.webConfig.baseSeo.seoTitleStyle == 2 ? (this.login == 1 ? '登录' : '注册') + " - " + this.$store.state.webConfig.baseSeo.seoTitle :
            (this.login == 1 ? '登录' : '注册'),
      meta: [
        { hid: 'description', name: 'description', content: this.$store.state.webConfig.baseSeo.seoDescription },
        { hid: 'keywords', name: 'keywords', content: this.$store.state.webConfig.baseSeo.seoKeywords },
        { hid: 'author', name: 'author', content: this.$store.state.webConfig.defaultUser.nickName }
      ]
    }
  },
  methods: { //事件处理器
    routeChange: function () {
      var that = this;
      that.login = that.$route.query.login == undefined ? 1 : parseInt(that.$route.query.login);//获取传参的login
      that.urlstate = that.$route.query.urlstate == undefined ? 0 : that.$route.query.urlstate;//获取传参的usrlstate状态码
      // console.log(that.login,that.urlstate);
      if (that.urlstate == 0) {
        that.err2005 = false;
        that.step = 1;
      } else if (that.urlstate == 'urlInvalid') {
        that.err2005 = true;
        that.step = 2
      } else if (that.urlstate == 'urlErr') {
        that.err2005 = true;
        that.step = 1;
      }
    },
    loginEnterFun: function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      // console.log('回车登录',keyCode,e);
      if (keyCode == 13) {
        this.gotoHome();
      }
    },
    gotoHome: async function () {//用户登录
      var that = this;
      var preg = /^(\w){6,12}$/;
      if (that.name) {
        that.nameErr = false;
      } else {
        that.nameErr = true;
      }
      if (that.password && preg.test(that.password)) {
        that.passwordErr = false;
      } else {
        that.passwordErr = true;
      }
      if (!that.nameErr && !that.passwordErr) {
        try {
          let loginRes = await Login({ username: that.name, password: that.password });
          console.log(loginRes)
          if (loginRes) {
            cookies.set('token', loginRes.token)
            this.$store.commit('setToken', loginRes.token);
            let webconfigRes = await GetWebConfig();
            this.$store.commit('setWebConfig', webconfigRes)
            if (localStorage.getItem('logUrl')) {
              that.$router.push({ path: localStorage.getItem('logUrl') });
            } else {
              that.$router.push({ path: '/' });
            }
          }
        } catch (err) {

        }
      }
    },
    registerEnterFun: function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      // console.log('回车注册',keyCode,e);
      if (keyCode == 13) {
        this.newRegister();
      }
    },
    newRegister: async function () {//注册提交
      var that = this;
      var reg = /^1[3456789]\d{9}$/;
      var preg = /^(\w){6,12}$/;
      if (that.nusername) {
        that.nusernameErr = false;
      } else {
        that.nusernameErr = true;
      }
      if (reg.test(that.nphone)) {
        that.nphoneErr = false;
      } else {
        that.nphoneErr = true;
      }
      if (that.npassword && preg.test(that.npassword)) {
        that.npasswordErr = false;
        if (that.npassword == that.npassword2) {
          that.npassword2Err = false;
        } else {
          that.npassword2Err = true;
        }
      } else {
        that.npasswordErr = true;
      }
      if (!that.nusernameErr && !that.nphoneErr && !that.npasswordErr && !that.npassword2Err) {
        that.fullscreenLoading = true;
        try {
          let registerRes = await Register({            userName: that.nusername,
            passWord: that.npassword,
            code: that.ncode,
            phone: that.nphone
          });
          that.fullscreenLoading = false;
          if (registerRes) {
            this.$message({
              showClose: true,
              message: '恭喜你，注册成功，快去登录！',
              type: 'success'
            });
            setTimeout(() => {
              that.err2005 = false;
              that.$router.push({ path: '/Login?login=1' });
            }, 1000)
          }
        } catch (err) {
          that.fullscreenLoading = false;
        }
      }
    },
    goLogin: function () {//手机号验证成功,去登陆
      this.err2005 = false;
      this.$router.push({ path: '/Login?login=1' });
    },
    goRegister: function () {//去注册
      this.err2005 = false;
      this.$router.push({ path: '/Login?login=0' });
    },
    async GetVCode () {
      var that = this;
      var reg = /^1[3456789]\d{9}$/;
      if (reg.test(that.nphone)) {
        that.nphoneErr = false;
      } else {
        that.nphoneErr = true;
      }
      if (!that.nphoneErr) {
        let codeRes = await GetVerificationCode(that.nphone);
        if (JSON.parse(codeRes).Code == "OK") {
          that.codeTime = 60;
        } else {
          alert(JSON.parse(codeRes).Message);
        }
      }

    }
  },
  components: { //定义组件

  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange'
  },
  async created () { //生命周期函数
    var that = this;
    that.routeChange();
    setInterval(() => {
      if (that.codeTime > 0) {
        that.codeTime--;
      }
    }, 1000)
    let webconfigRes = await GetWebConfig();
    this.$store.state.webConfig = webconfigRes;
  }
}
</script>

<style>
/*登录注册标题*/
.loginbg {
  height: 100vh;
  width: auto !important;
  max-width: none !important;
  background-size: cover;
  background-position: center 50%;
  background-repeat: no-repeat;
}
.loginTitle {
  text-align: center;
  font-size: 26px;
  padding-top: 50px;
  margin-bottom: 20px;
}
.loginBox,
.registerBox {
  background: #fff;
  padding: 40px;
  max-width: 320px;
  margin: 0 auto;
}
.loginBox {
  padding-bottom: 0;
}
.lr-title {
  position: relative;
  height: 32px;
  line-height: 32px;
  margin-bottom: 20px;
}
.lr-title h1 {
  font-size: 24px;
  color: #666;
  font-weight: bold;
  /*width:50%;*/
}
.lr-title p {
  font-size: 12px;
  color: #999;
  position: absolute;
  right: 0;
  top: 0;
}
.lr-btn {
  color: #fff;
  text-align: center;
  letter-spacing: 5px;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 30px;
}
.loginBox .el-input,
.registerBox .el-input {
  margin-bottom: 20px;
}
.loginBox .el-alert,
.registerBox .el-alert {
  top: -18px;
  background-color: #888;
}
.loginBox .el-input input,
.registerBox .el-input input {
  border-radius: 4px;
}
.loginBox h3,
.registerBox h3 {
  text-align: right;
  margin-bottom: 20px;
}
.loginBox h3 a,
.registerBox h3 a {
  font-size: 13px;
  color: #999;
}
.loginBox .otherLogin {
  max-width: 320px;
  padding: 30px 40px;
  background: #ddd;
  text-align: center;
  margin-left: -40px;
  margin-right: -40px;
  visibility: hidden;
}
.loginBox .otherLogin p {
  margin-bottom: 20px;
  font-size: 16px;
}
.loginBox .otherLogin a i {
  display: inline-block;
  width: 42px;
  height: 42px;
  line-height: 42px;
  font-size: 18px;
  border-radius: 50%;
  color: #fff;
  margin: 0 10px;
}
.loginBox .otherLogin a i.fa-wechat {
  background: #7bc549;
}
.loginBox .otherLogin a i.fa-qq {
  background: #56b6e7;
}
.loginBox .otherLogin a i.fa-weibo {
  background: #ff763b;
}

/*登录成功*/
.registerSuc {
  padding: 40px;
  margin: 0 auto;
}
.registerSuc .sucIcon {
  text-align: center;
  margin-bottom: 30px;
  padding-left: 60px;
}
.registerSuc .sucContent {
  line-height: 1.5;
  font-size: 15px;
  text-align: center;
}
.registerSuc .sucContent p {
  margin-top: 10px;
  font-size: 13px;
  color: #999;
}
.registerSuc .sucContent .lastbtn {
  display: inline-block;
  font-size: 14px;
  padding: 3px 10px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}
.registerSuc .sucContent .el-icon-close {
  fong-size: 13px;
}
</style>
