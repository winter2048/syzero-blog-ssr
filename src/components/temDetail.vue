<!-- 文章详情模块 -->
<template>
  <div class="detailBox tcommonBox">
    <span class="s-round-date">
      <span class="month"
            v-html="showInitDate(data.createTime, 'month') + '月'"></span>
      <span class="day"
            v-html="showInitDate(data.createTime, 'date')"></span>
    </span>
    <header>
      <h1>
        <a :href="'#/DetailShare?aid=' + data.id"
           target="_blank">
          {{ data.title }}
        </a>
      </h1>
      <h2>
        <i class="fa fa-fw fa-user"></i>发表于
        <span>{{ showInitDate(data.createTime, "all") }}</span> •
        <i class="fa fa-fw fa-eye"></i>{{ data.viewNums }} 次围观 •
        <i class="fa fa-fw fa-comments"></i>活捉 {{ data.commentNums }} 条 •
        <span class="rateBox">
          <i class="fa fa-fw fa-heart"></i>{{ likeCount }}点赞
          <i class="fa fa-fw fa-star"></i>{{ collectCount }}收藏
        </span>
      </h2>
      <div class="ui label">
        <a :href="'/Share?classId=' + data.categoryId">{{
          data.categoryName
        }}</a>
      </div>
    </header>
    <div class="article-content">
      <mavon-editor :value="data.content"
                    :ishljs="true"
                    :subfield="false"
                    :boxShadow="false"
                    defaultOpen="preview"
                    :toolbarsFlag="false"
                    previewBackground="#ffffff"
                    :externalLink="externalLink"></mavon-editor>
    </div>

    <div class="dshareBox bdsharebuttonbox"
         data-tag="share_1">
      分享到:
      <a href="javascript:void(0);"
         class="ds-weibo fa fa-fw fa-weibo"
         data-cmd="tsina"></a>
      <a href="javascript:void(0);"
         class="ds-qq fa fa-fw fa-qq"
         data-cmd="tqq"></a>
      <a href="javascript:void(0);"
         class="ds-wechat fa fa-fw fa-wechat"
         data-cmd="weixin"></a>
      <div class="dlikeColBox">
        <div class="dlikeBox"
             @click="likecollectHandle(1)">
          <i :class="likeArt ? 'fa fa-fw fa-heart' : 'fa fa-fw fa-heart-o'"></i>喜欢 | {{ likeCount }}
        </div>
        <div class="dcollectBox"
             @click="likecollectHandle(2)">
          <i :class="collectArt ? 'fa fa-fw fa-star' : 'fa fa-fw fa-star-o'"></i>收藏 | {{ collectCount }}
        </div>
      </div>
    </div>
    <div class="donate">
      <div class="donate-word">
        <span @click="pdonate = !pdonate">赞赏</span>
      </div>
      <el-row :class="pdonate ? 'donate-body' : 'donate-body donate-body-show'"
              :gutter="30">
        <el-col :span="12"
                class="donate-item">
          <div class="donate-tip">
            <img :src="
                data.wechat_image ? data.wechat_image : 'static/img/tou.jpg'
              "
                 :onerror="$store.state.errorImg" />
            <span>微信扫一扫，向我赞赏</span>
          </div>
        </el-col>
        <el-col :span="12"
                class="donate-item">
          <div class="donate-tip">
            <img :src="
                data.alipay_image ? data.alipay_image : 'static/img/tou.jpg'
              "
                 :onerror="$store.state.errorImg" />
            <span>支付宝扫一扫，向我赞赏</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { initDate } from "@/utils/index.js";
import {
  GetBlogInfo,
  CollectionBlog,
  IsCollectionBlog
} from "../api/server.js";


export default {
  props: ["data"],
  data () {
    //选项 / 数据
    return {
      aid: "", //文章ID
      pdonate: true, //打开赞赏控制,
      detailObj: "", //返回详情数据
      likeArt: false, //是否点赞
      likeCount: 400, //点赞数量
      collectCount: 500, //收藏数量
      collectArt: false, //是否收藏
      haslogin: false, //是否已经登录
      userId: "", //用户id
      create_time: "",
      externalLink: {
        markdown_css: function () {
          // 这是你的代码高亮配色文件路径
          return 'https://cdn.bootcdn.net/ajax/libs/github-markdown-css/2.9.0/github-markdown.min.css';
        },
        hljs_js: function () {
          // 这是你的hljs文件路径
          return 'https://cdn.bootcdn.net/ajax/libs/highlight.js/9.12.0/highlight.min.js';
        },
        hljs_css: function(css) {
          // 这是你的代码高亮配色文件路径
          return 'https://cdn.bootcdn.net/ajax/libs/highlight.js/9.12.0/styles/' + css + '.min.css';
        },
        hljs_lang: function (lang) {
          // 这是你的代码高亮语言解析路径
          return 'https://cdn.bootcdn.net/ajax/libs/highlight.js/9.12.0/languages/' + lang + '.min.js';
        },
        katex_css: function () {
          // 这是你的katex配色方案路径路径
          return 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.8.3/katex.min.css';
        },
        katex_js: function () {
          // 这是你的katex.js路径
          return 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.8.3/katex.min.js';
        }
      }
    };
  },
  methods: {
    //事件处理器
    showInitDate: function (date, full) {
      //年月日的编辑
      return initDate(date, full);
    },
    likecollectHandle: async function (islike) {
      // //用户点击喜欢0,用户点击收藏1
      // var that = this;
      // if (cookies.get("token")) {
      //   //判断是否登录
      //   var tip = "";
      //   if (islike == 1) {
      //     if (!that.likeArt) {
      //       await CollectionBlog(that.detailObj.id, islike, true);
      //       that.likeCount += 1;
      //       that.likeArt = true;
      //       tip = "已点赞";
      //     } else {
      //       await CollectionBlog(that.detailObj.id, islike, false);
      //       that.likeCount -= 1;
      //       that.likeArt = false;
      //       tip = "已取消点赞";
      //     }
      //   } else {
      //     if (!that.collectArt) {
      //       await CollectionBlog(that.detailObj.id, islike, true);
      //       that.collectCount += 1;
      //       that.collectArt = true;
      //       tip = "已收藏";
      //     } else {
      //       await CollectionBlog(that.detailObj.id, islike, false);
      //       that.collectCount -= 1;
      //       that.collectArt = false;
      //       tip = "已取消收藏";
      //     }
      //   }
      //   that.$message({
      //     message: tip,
      //     type: "success"
      //   });
      // } else {
      //   //未登录 前去登录。
      //   that
      //     .$confirm("登录后即可点赞和收藏，是否前往登录页面?", "提示", {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     })
      //     .then(() => {
      //       //确定，跳转至登录页面
      //       //储存当前页面路径，登录成功后跳回来
      //       // localStorage.setItem("logUrl", that.$route.fullPath);
      //       // that.$router.push({ path: "/Login?login=1" });
      //     })
      //     .catch(() => {
      //       //取消关闭弹窗
      //     });
      // }
    },
    async routeChange () {
      // var that = this;
      // that.aid = that.$route.query.aid == undefined ? 1 : that.$route.query.aid; //获取传参的aid
      // //判断用户是否存在
      // if (cookies.get("token")) {
      //   //存储用户信息
      //   that.haslogin = true;
      // } else {
      //   that.haslogin = false;
      // }

      this.likeCount = this.data.likeNums;
      this.collectCount = this.data.collectionNums;
      try {
        this.likeArt = await IsCollectionBlog(that.aid, 1);
        this.collectArt = await IsCollectionBlog(that.aid, 2);
      } catch (error) { }
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // $route: "routeChange"
  },
  components: {},
  async created () {
    //生命周期函数
    //  var that = this;
    await this.routeChange();
  }
};
</script>

<style lang="less">
.detailBox .article-content {
  font-size: 15px;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  overflow-x: hidden;
}
.detailBox .article-content p {
  margin: 10px 0;
  line-height: 24px;
  word-wrap: break-word;
  word-break: break-all;
  overflow-x: hidden;
}
.detailBox .article-content pre {
  word-wrap: break-word;
  word-break: break-all;
  overflow-x: hidden;
}
.detailBox .article-content img {
  max-width: 100% !important;
  height: auto !important;
  overflow-x: hidden;
}
.detailBox .article-content a {
  color: #df2050 !important;
}
.detailBox .article-content a:hover {
  text-decoration: underline;
  color: #f00 !important;
}
.detailBox .article-content i {
  font-style: italic;
}
.detailBox .article-content strong {
  font-weight: bold;
}
.detailBox .article-content ul {
  list-style-type: disc !important;
  list-style: disc !important;
  padding-left: 40px !important;
  li {
    list-style-type: disc !important;
    list-style: disc !important;
  }
}
.detailBox .article-content h1,
.detailBox .article-content h2,
.detailBox .article-content h3 {
  font-size: 200%;
  font-weight: bold;
}
.detailBox .article-content h4,
.detailBox .article-content h5,
.detailBox .article-content h6 {
  font-size: 150%;
  font-weight: bold;
}
.detailBox .viewdetail {
  margin: 10px 0;
  line-height: 24px;
  text-align: center;
}
/*分享图标*/
.dshareBox {
  margin-top: 40px;
  position: relative;
}
.dshareBox a {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 32px;
  font-size: 18px;
  border-radius: 50%;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  margin: 4px;
  background: #fff;
  transition: background 0.6s ease-out;
}
.dshareBox .ds-weibo {
  border: 1px solid #ff763b;
  color: #ff763b;
}
.dshareBox .ds-weibo:hover {
  color: #fff;
  background: #ff763b;
}
.dshareBox .ds-qq {
  color: #56b6e7;
  border: 1px solid #56b6e7;
}
.dshareBox .ds-qq:hover {
  color: #fff;
  background: #56b6e7;
}
.dshareBox .ds-wechat {
  color: #7bc549;
  border: 1px solid #7bc549;
}
.dshareBox .ds-wechat:hover {
  color: #fff;
  background: #7bc549;
}
.dshareBox .ds-wechat:hover .wechatShare {
  opacity: 1;
  visibility: visible;
}
.detailBox .bdshare-button-style0-32 a {
  float: none;
  background-image: none;
  text-indent: inherit;
}
/*点赞 收藏*/
.dlikeColBox {
  display: inline-block;
  float: right;
}
.dlikeBox,
.dcollectBox {
  display: inline-block;
  padding: 0 10px;
  height: 35px;
  color: #e26d6d;
  line-height: 35px;
  border-radius: 35px;
  border: 1px solid #e26d6d;
  cursor: pointer;
}

/*赞赏*/
.donate-word {
  margin: 40px 0;
  text-align: center;
}
.donate-word span {
  display: inline-block;
  width: 80px;
  height: 34px;
  line-height: 34px;
  color: #fff;
  background: #e26d6d;
  margin: 0 auto;
  border-radius: 4px;
  cursor: pointer;
}
.donate-body {
  display: none;
}
.donate-body-show {
  display: block;
}
.donate-item {
  text-align: right;
}
.donate-item:last-child {
  text-align: left;
}
.donate-item img {
  width: 100%;
  display: block;
  height: auto;
}
.donate-item div {
  display: inline-block;
  width: 150px;
  padding: 0 6px;
  box-sizing: border-box;
  text-align: center;
}
.donate-item div span {
  display: inline-block;
  width: 100%;
  margin: 10px 0;
  text-align: center;
}
.donate-body .donate-item:first-of-type div {
  color: #44b549;
}
.donate-body .donate-item:nth-of-type(2) div {
  color: #00a0e9;
}

.bd_weixin_popup {
  position: fixed !important;
}
.v-note-wrapper {
  z-index: 0 !important;
  border: none !important;
}
.v-show-content {
  padding: 0px 5px 0px 5px !important;
}
</style>
