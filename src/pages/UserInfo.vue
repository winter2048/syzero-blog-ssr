<!-- 用户中心 -->
<template>
  <div>
    <wbc-nav :navData="navigationList"></wbc-nav>
    <div class="container">
      <div v-show="isEdit"
           class="tcommonBox">
        <header>
          <h1>
            编辑个人资料
          </h1>
        </header>
        <section>
          <ul class="userInfoBox">
            <!-- <li class="avatarlist">
              <span class="leftTitle">头像</span>
              <el-upload class="avatar-uploader"
                         :action="`${$store.state.apiBaseURL}User/ChangeAvatar`"
                         :show-file-list="false"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload"
                         :headers="{
          Authorization: token
        }">
                <img v-if="userInfoObj.pictureUrl"
                     :src="userInfoObj.pictureUrl?userInfoObj.pictureUrl:'static/img/tou.png'"
                     :onerror="$store.state.errorImg"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip"
                     class="el-upload__tip">点击上传头像，只能上传jpg/png文件，且不超过1mb</div>
              </el-upload>
            </li> -->
            <li class="username">
              <span class="leftTitle">昵称</span>
              <el-input v-model="userInfoObj.nickName"
                        placeholder="昵称"></el-input> <i class="fa fa-wa fa-asterisk"></i>
            </li>
            <li>
              <span class="leftTitle">电子邮件</span>
              <el-input v-model="userInfoObj.mail"
                        placeholder="电子邮件"></el-input>
            </li>
            <li>
              <span class="leftTitle">性别</span>
              <template>
                <el-radio-group v-model="userInfoObj.sex">
                  <el-radio :label="0"
                            class="radio">男</el-radio>
                  <el-radio :label="1"
                            class="radio">女</el-radio>
                </el-radio-group>
              </template>
            </li>

            <li>
              <span class="leftTitle">简介</span>
              <el-input type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="userInfoObj.description">
              </el-input>
            </li>

          </ul>
          <div class=" saveInfobtn">
            <a class="tcolors-bg"
               href="javascript:void(0);"
               @click="isEdit=!isEdit">返 回</a>
            <a class="tcolors-bg"
               href="javascript:void(0);"
               @click="saveInfoFun">保 存</a>
          </div>
        </section>
      </div>
      <div v-show="!isEdit"
           class="tcommonBox">
        <header>
          <h1>
            个人中心
            <span class="gotoEdit"
                  @click="isEdit=!isEdit"><i class="fa fa-wa fa-edit"></i>编辑</span>
          </h1>

        </header>
        <section>
          <ul class="userInfoBox">
            <!-- <li class="avatarlist">
              <span class="leftTitle">头像</span>
              <div class="avatar-uploader">
                <img :src="userInfoObj.pictureUrl?userInfoObj.pictureUrl:'static/img/tou.png'"
                     :onerror="$store.state.errorImg"
                     class="avatar">
              </div>
            </li> -->
            <li class="username">
              <span class="leftTitle">昵称</span>
              <span>{{userInfoObj.nickName?userInfoObj.nickName:"无"}}</span>

            </li>
            <li>
              <span class="leftTitle">电子邮件</span>
              <span>{{userInfoObj.mail?userInfoObj.mail:"无"}}</span>
            </li>
            <li>
              <span class="leftTitle">手机号</span>
              <span>{{userInfoObj.phone?userInfoObj.phone:"无"}}</span>
            </li>
            <li>
              <span class="leftTitle">类型</span>
              <span>{{userInfoObj.level==1?"管理员":"普通用户"}}</span>
            </li>
            <li>
              <span class="leftTitle">性别</span>
              <span>{{userInfoObj.sex==0?'男':'女'}}</span>
            </li>
            <li>
              <span class="leftTitle">简介</span>
              <p class="rightInner">{{userInfoObj.description?userInfoObj.description:"无"}}</p>
            </li>
          </ul>

        </section>
      </div>
    </div>
    <wbc-footer></wbc-footer>
  </div>
</template>

<script>

import header from '@/components/header.vue'
import footer from '@/components/footer.vue'
import { GetUserInfo, UpdataUserInfo, GetNavigation } from "@/api/server.js"
import cookies from '@/plugins/js-cookie.js'
export default {
  name: 'UserInfo',
  data () { //选项 / 数据
    return {
      isEdit: false,
      userInfo: '',//本地存储的用户信
      userInfoObj: {
        name: "",
        mail: '',
        phone: '',
        sex: 0,
        type: 1,
        nickName: "",
        level: 0,
        pictureUrl: '',
        description: '',
        id: ''
      },//用户的信息
      token: cookies.get('token'),
      navigationList: ""
    }
  },
  head () {
    return {
      title: this.$store.state.webConfig.baseSeo.seoTitleStyle == 0 ? '个人中心' :
        this.$store.state.webConfig.baseSeo.seoTitleStyle == 1 ? '个人中心' + " - " + this.$store.state.webConfig.basics.blogName :
          this.$store.state.webConfig.baseSeo.seoTitleStyle == 2 ? '个人中心' + " - " + this.$store.state.webConfig.baseSeo.seoTitle :
            '个人中心',
      meta: [
        { hid: 'description', name: 'description', content: this.$store.state.webConfig.baseSeo.seoDescription },
        { hid: 'keywords', name: 'keywords', content: this.$store.state.webConfig.baseSeo.seoKeywords },
        { hid: 'author', name: 'author', content: this.$store.state.webConfig.defaultUser.nickName }
      ]
    }
  },
  async asyncData ({ params, store }) {
    let navRes = await GetNavigation();
    return { navigationList: navRes };
  },
  methods: { //事件处理器
    handleAvatarSuccess (res, file) {

      // this.userInfoObj.pictureUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    },
    saveInfoFun: async function () {//保存编辑的用户信息
      var that = this;
      if (!that.userInfoObj.nickName) { //昵称为必填
        that.$message.error('昵称为必填项，请填写昵称');
        return;
      }
      let infoRes = await UpdataUserInfo(that.userInfoObj);
      if (infoRes) {
        that.$message.success('保存成功！');
        that.isEdit = false;
        that.routeChange();
      }
    },
    routeChange: async function () {//展示页面信息
      var that = this;

      let userInfoRes = await GetUserInfo();
      that.userInfoObj = userInfoRes;
    }
  },
  components: { //定义组件
    'wbc-nav': header,
    'wbc-footer': footer
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange'
  },
  created () { //生命周期函数
    this.routeChange();
  }
}
</script>

<style>
.userInfoBox .avatarlist {
  position: relative;
}

.avatar-uploader {
  display: inline-block;
  vertical-align: top;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: block;
  object-fit: cover;
}
.gotoEdit {
  font-size: 15px;
  float: right;
  cursor: pointer;
  color: #999;
}
.gotoEdit:hover {
  color: #333;
}
/*个人设置*/
.userInfoBox .leftTitle {
  display: inline-block;
  width: 100px;
  padding: 10px 0;
}
.userInfoBox .rightInner {
  display: inline-block;
  max-width: calc(100% - 140px);
  vertical-align: top;
}
.userInfoBox li {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}
.userInfoBox li:last-child {
  border-bottom: 1px solid transparent;
}
.userInfoBox .el-input,
.userInfoBox .el-textarea {
  max-width: 300px;
  min-width: 100px;
}

.userInfoBox .el-input__inner {
  border-radius: 4px;
}
.userInfoBox .el-textarea {
  vertical-align: top;
}
.saveInfobtn {
  margin: 20px 0;
  text-align: center;
}
.saveInfobtn a {
  color: #fff;
  padding: 6px 20px;
  margin: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}
.userInfoBox .fa-asterisk {
  color: #df2050;
}
</style>
