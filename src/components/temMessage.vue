<!-- 留言评论模块 -->
<template>
  <div class="tmsgBox"
       ref="tmsgBox">
    <div class="tmsg-respond"
         ref="respondBox">
      <h3>发表评论 <small v-show="isRespond"
               class="tcolorm"
               @click="removeRespond">取消回复</small></h3>
      <form class="">
        <el-input type="textarea"
                  :rows="2"
                  placeholder="说点什么呢``"
                  v-model="textarea">
        </el-input>
        <div :class="pBody?'OwO':'OwO OwO-open'">
          <div class="OwO-logo"
               @click="pBody=!pBody">
            <span>OwO表情</span>
          </div>
          <div class="OwO-body">
            <ul class="OwO-items OwO-items-show">
              <li class="OwO-item"
                  v-for="(oitem,index) in OwOlist"
                  :key="'oitem'+index"
                  @click="choseEmoji(oitem.title)">
                <img :src="'/img/emot/image/'+oitem.url"
                     alt="">
              </li>
            </ul>
            <div class="OwO-bar">
              <ul class="OwO-packages">
                <li class="OwO-package-active">Emoji</li>
              </ul>
            </div>
          </div>
        </div>
        <el-row class="tmsg-r-info">
          <el-col :span="24"
                  class="info-submit">
            <p class="tcolors-bg"
               @click="sendMsg">{{sendTip}}</p>
          </el-col>
        </el-row>
      </form>
    </div>
    <div class="tmsg-comments"
         ref="listDom">
      <a href="#"
         class="tmsg-comments-tip">活捉 {{commentList?commentList.length:0}} 条</a>
      <div class="tmsg-commentshow">
        <ul class="tmsg-commentlist">
          <li class="tmsg-c-item"
              v-for="(item,index) in commentList"
              :key="'common'+index">
            <article class="">
              <header>
                <img :src="item.pictureUrl?item.pictureUrl:'/img/tou.png'"
                     :onerror="$store.state.errorImg">
                <div class="i-name">
                  {{item.author}}
                </div>
                <!-- <div class="i-class">
                  {{item.label}}
                </div> -->
                <div class="i-time">
                  <time>{{showInitDate(item.createTime, "yyyy-MM-dd hh:mm:ss")}}</time>
                </div>
              </header>
              <section>
                <p v-html="analyzeEmoji(item.content)">{{analyzeEmoji(item.content)}}</p>
                <div v-if="haslogin"
                     class="tmsg-replay"
                     @click="respondMsg(item.id)">
                  回复
                </div>
              </section>
            </article>
            <ul v-show="item.childs"
                class="tmsg-commentlist"
                style="padding-left:60px;">
              <li class="tmsg-c-item"
                  v-for="(citem,cindex) in item.childs"
                  :key="'citem'+cindex">
                <article class="">
                  <header>
                    <img :src="citem.pictureUrl?citem.pictureUrl:'/img/tou.png'"
                         :onerror="$store.state.errorImg">
                    <div class="i-name">
                      {{citem.author}} <span>回复</span> {{citem.targetAuthor}}
                    </div>
                    <!-- <div class="i-class">
                      {{citem.label}}
                    </div> -->
                    <div class="i-time">
                      <time>{{showInitDate(citem.createTime, "yyyy-MM-dd hh:mm:ss")}}</time>
                    </div>
                  </header>
                  <section>
                    <p v-html="analyzeEmoji(citem.content)">{{citem.content}}</p>
                    <div v-show="haslogin"
                         class="tmsg-replay"
                         @click="respondMsg(citem.id)">
                      回复
                    </div>
                  </section>
                </article>
              </li>
            </ul>
          </li>

        </ul>
        <h1 v-show='hasMore'
            class="tcolors-bg"
            @click="addMoreFun">查看更多</h1>
        <h1 v-show='!hasMore'
            class="tcolors-bg">没有更多</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { initDate } from "@/utils/index.js";
import { GetBlogComment, SendComment } from "@/api/server.js";
// import {ArticleComment,OtherComment,setArticleComment,setOuthComment} from '../utils/server.js'
export default {
  data () { //选项 / 数据
    return {
      respondBox: '',//评论表单
      listDom: '',//评论列表
      tmsgBox: '',//总评论盒子
      isRespond: false,
      textarea: '',//文本框输入内容
      pBody: true,//表情打开控制
      commentList: '',//评论列表数据
      pageId: 0,//当前第几页
      aid: '',//文章id
      hasMore: true,
      haslogin: false,
      userId: '',//用户id
      leaveId: 0,//回复评论的当前的commentId
      leavePid: '',//赞赏等其他模块的分类id
      cid: '',//回复评论的一级commentId
      sendTip: '发送~',
      OwOlist: [//表情包和表情路径
        { 'title': '微笑', 'url': 'weixiao.gif' },
        { 'title': '嘻嘻', 'url': 'xixi.gif' },
        { 'title': '哈哈', 'url': 'haha.gif' },
        { 'title': '可爱', 'url': 'keai.gif' },
        { 'title': '可怜', 'url': 'kelian.gif' },
        { 'title': '挖鼻', 'url': 'wabi.gif' },
        { 'title': '吃惊', 'url': 'chijing.gif' },
        { 'title': '害羞', 'url': 'haixiu.gif' },
        { 'title': '挤眼', 'url': 'jiyan.gif' },
        { 'title': '闭嘴', 'url': 'bizui.gif' },
        { 'title': '鄙视', 'url': 'bishi.gif' },
        { 'title': '爱你', 'url': 'aini.gif' },
        { 'title': '泪', 'url': 'lei.gif' },
        { 'title': '偷笑', 'url': 'touxiao.gif' },
        { 'title': '亲亲', 'url': 'qinqin.gif' },
        { 'title': '生病', 'url': 'shengbing.gif' },
        { 'title': '太开心', 'url': 'taikaixin.gif' },
        { 'title': '白眼', 'url': 'baiyan.gif' },
        { 'title': '右哼哼', 'url': 'youhengheng.gif' },
        { 'title': '左哼哼', 'url': 'zuohengheng.gif' },
        { 'title': '嘘', 'url': 'xu.gif' },
        { 'title': '衰', 'url': 'shuai.gif' },
        { 'title': '吐', 'url': 'tu.gif' },
        { 'title': '哈欠', 'url': 'haqian.gif' },
        { 'title': '抱抱', 'url': 'baobao.gif' },
        { 'title': '怒', 'url': 'nu.gif' },
        { 'title': '疑问', 'url': 'yiwen.gif' },
        { 'title': '馋嘴', 'url': 'chanzui.gif' },
        { 'title': '拜拜', 'url': 'baibai.gif' },
        { 'title': '思考', 'url': 'sikao.gif' },
        { 'title': '汗', 'url': 'han.gif' },
        { 'title': '困', 'url': 'kun.gif' },
        { 'title': '睡', 'url': 'shui.gif' },
        { 'title': '钱', 'url': 'qian.gif' },
        { 'title': '失望', 'url': 'shiwang.gif' },
        { 'title': '酷', 'url': 'ku.gif' },
        { 'title': '色', 'url': 'se.gif' },
        { 'title': '哼', 'url': 'heng.gif' },
        { 'title': '鼓掌', 'url': 'guzhang.gif' },
        { 'title': '晕', 'url': 'yun.gif' },
        { 'title': '悲伤', 'url': 'beishang.gif' },
        { 'title': '抓狂', 'url': 'zhuakuang.gif' },
        { 'title': '黑线', 'url': 'heixian.gif' },
        { 'title': '阴险', 'url': 'yinxian.gif' },
        { 'title': '怒骂', 'url': 'numa.gif' },
        { 'title': '互粉', 'url': 'hufen.gif' },
        { 'title': '书呆子', 'url': 'shudaizi.gif' },
        { 'title': '愤怒', 'url': 'fennu.gif' },
        { 'title': '感冒', 'url': 'ganmao.gif' },
        { 'title': '心', 'url': 'xin.gif' },
        { 'title': '伤心', 'url': 'shangxin.gif' },
        { 'title': '猪', 'url': 'zhu.gif' },
        { 'title': '熊猫', 'url': 'xiongmao.gif' },
        { 'title': '兔子', 'url': 'tuzi.gif' },
        { 'title': '喔克', 'url': 'ok.gif' },
        { 'title': '耶', 'url': 'ye.gif' },
        { 'title': '棒棒', 'url': 'good.gif' },
        { 'title': '不', 'url': 'no.gif' },
        { 'title': '赞', 'url': 'zan.gif' },
        { 'title': '来', 'url': 'lai.gif' },
        { 'title': '弱', 'url': 'ruo.gif' },
        { 'title': '草泥马', 'url': 'caonima.gif' },
        { 'title': '神马', 'url': 'shenma.gif' },
        { 'title': '囧', 'url': 'jiong.gif' },
        { 'title': '浮云', 'url': 'fuyun.gif' },
        { 'title': '给力', 'url': 'geili.gif' },
        { 'title': '围观', 'url': 'weiguan.gif' },
        { 'title': '威武', 'url': 'weiwu.gif' },
        { 'title': '话筒', 'url': 'huatong.gif' },
        { 'title': '蜡烛', 'url': 'lazhu.gif' },
        { 'title': '蛋糕', 'url': 'dangao.gif' },
        { 'title': '发红包', 'url': 'fahongbao.gif' }
      ]
    }
  },
  methods: { //事件处理器
    showInitDate: function (oldDate, full) {
      //console.log(oldDate, full);
      return initDate(oldDate, full);
    },
    //选择表情包
    choseEmoji: function (inner) {
      this.textarea += '[' + inner + ']';
    },
    analyzeEmoji: function (cont) {//编译表情替换成图片展示出来
      var pattern1 = /\[[\u4e00-\u9fa5]+\]/g;
      var pattern2 = /\[[\u4e00-\u9fa5]+\]/;
      var content = cont.match(pattern1);
      var str = cont;
      if (content) {
        for (var i = 0; i < content.length; i++) {
          for (var j = 0; j < this.OwOlist.length; j++) {
            if ("[" + this.OwOlist[j].title + "]" == content[i]) {
              var src = this.OwOlist[j].url;
              break;
            }
          }
          str = str.replace(pattern2, '<img src="/img/emot/image/' + src + '"/>');
        }
        // console.log(str);
      }
      return str;
    },
    //发送留言
    async sendMsg () {//留言
      var that = this;
      if (that.textarea) {
        that.sendTip = '咻~~';
        let sendRes = await SendComment(that.aid, { content: that.textarea, parentId: that.cid });
        if (sendRes) {
          that.textarea = '';
          that.routeChange();
          that.removeRespond();
          var timer02 = setTimeout(function () {
            that.sendTip = '发送~';
            clearTimeout(timer02);
          }, 1000)
        }
      } else {
        that.sendTip = '内容不能为空~'
        var timer = setTimeout(function () {
          that.sendTip = '发送~';
          clearTimeout(timer);
        }, 3000)
      }
    },
    respondMsg: function (cid) {//回复留言

      var that = this;
      if (this.$store.state.token) {
        var dom = event.currentTarget;
        dom = dom.parentNode;
        this.isRespond = true;

        this.cid = cid;
        dom.appendChild(this.$refs.respondBox);
      } else {
        that.$confirm('登录后即可点赞和收藏，是否前往登录页面?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {//确定，跳转至登录页面
          //储存当前页面路径，登录成功后跳回来
          localStorage.setItem('logUrl', that.$route.fullPath);
          that.$router.push({ path: '/Login?login=1' });
        }).catch(() => {

        });
      }
    },
    removeRespond: function () {//取消回复留言
      this.isRespond = false;
      this.cid = '';
      this.$refs.tmsgBox.insertBefore(this.$refs.respondBox, this.$refs.listDom);
    },
    async showCommentList (initData) {//评论列表
      var that = this;
      that.aid = that.$route.params.aid == undefined ? '' : that.$route.params.aid;//获取传参的aid
      //判断当前用户是否登录
      if (this.$store.state.token) {
        that.haslogin = true;
      } else {
        that.haslogin = false;
      }
      //初始化
      if (initData) {
        that.commentList = [];
        that.hasMore = true;
      }
      let commentRes = await GetBlogComment(that.aid, {
        Skip: that.commentList.length,
        Limit: 10
      });
      that.commentList = that.commentList.concat(commentRes.list);
      if (that.commentList.length >= commentRes.total) {
        that.hasMore = false;
      } else {
        that.hasMore = true;
      }

    },
    addMoreFun: function () {//查看更多
      this.showCommentList(false);
    },
    async routeChange () {//重新加载
      var that = this;
      await this.showCommentList(true);
    }
  },
  components: { //定义组件

  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // '$route':'routeChange'
  },
  created () { //生命周期函数
    // console.log(this.$route);

  },
  async mounted () {//页面加载完成后
    var that = this;
    await that.routeChange();
  }
}
</script>

<style>
.tmsgBox {
  position: relative;
  background: #fff;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}
.tmsg-respond h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}
.tmsg-respond h3 small {
  font-size: smaller;
  cursor: pointer;
}
.tmsg-respond textarea {
  background: #f4f6f7;
  height: 100px;
  margin-bottom: 10px;
}
.OwO {
  position: relative;
  z-index: 1;
}
.OwO .OwO-logo {
  position: relative;
  border-radius: 4px;
  color: #444;
  display: inline-block;
  background: #fff;
  border: 1px solid #ddd;
  font-size: 13px;
  padding: 0 6px;
  cursor: pointer;
  height: 30px;
  box-sizing: border-box;
  z-index: 2;
  line-height: 30px;
}
.OwO .OwO-logo:hover {
  animation: a 5s infinite ease-in-out;
  -webkit-animation: a 5s infinite ease-in-out;
}
.OwO .OwO-body {
  position: absolute;
  background: #fff;
  border: 1px solid #ddd;
  z-index: 1;
  top: 29px;
  border-radius: 0 4px 4px 4px;
  display: none;
}
.OwO-open .OwO-body {
  display: block;
}
.OwO-open .OwO-logo {
  border-radius: 4px 4px 0 0;
  border-bottom: none;
}
.OwO-open .OwO-logo:hover {
  animation: none;
  -webkit-animation: none;
}
.OwO .OwO-items {
  max-height: 197px;
  overflow: scroll;
  font-size: 0;
  padding: 10px;
  z-index: 1;
}
.OwO .OwO-items .OwO-item {
  background: #f7f7f7;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin: 0 10px 12px 0;
  transition: 0.3s;
  line-height: 19px;
  font-size: 20px;
  cursor: pointer;
}
.OwO .OwO-items .OwO-item:hover {
  background: #eee;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  animation: a 5s infinite ease-in-out;
  -webkit-animation: a 5s infinite ease-in-out;
}
.OwO .OwO-body .OwO-bar {
  width: 100%;
  height: 30px;
  border-top: 1px solid #ddd;
  background: #fff;
  border-radius: 0 0 4px 4px;
  color: #444;
}
.OwO .OwO-body .OwO-bar .OwO-packages li {
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
  margin-right: 3px;
  text-align: center;
}
.OwO .OwO-body .OwO-bar .OwO-packages li:first-of-type {
  border-radius: 0 0 0 3px;
}
@-webkit-keyframes a {
  2% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg);
  }
  4% {
    -webkit-transform: translateY(-1.5px) rotate(-0.5deg);
    transform: translateY(-1.5px) rotate(-0.5deg);
  }
  6% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg);
  }
  8% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg);
  }
  10% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg);
  }
  12% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  14% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg);
  }
  16% {
    -webkit-transform: translateY(-0.5px) rotate(-1.5deg);
    transform: translateY(-0.5px) rotate(-1.5deg);
  }
  18% {
    -webkit-transform: translateY(0.5px) rotate(-1.5deg);
    transform: translateY(0.5px) rotate(-1.5deg);
  }
  20% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg);
  }
  22% {
    -webkit-transform: translateY(0.5px) rotate(-1.5deg);
    transform: translateY(0.5px) rotate(-1.5deg);
  }
  24% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg);
  }
  26% {
    -webkit-transform: translateY(0.5px) rotate(0.5deg);
    transform: translateY(0.5px) rotate(0.5deg);
  }
  28% {
    -webkit-transform: translateY(0.5px) rotate(1.5deg);
    transform: translateY(0.5px) rotate(1.5deg);
  }
  30% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  32%,
  34% {
    -webkit-transform: translateY(1.5px) rotate(-0.5deg);
    transform: translateY(1.5px) rotate(-0.5deg);
  }
  36% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg);
  }
  38% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg);
  }
  40% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  42% {
    -webkit-transform: translateY(2.5px) rotate(-1.5deg);
    transform: translateY(2.5px) rotate(-1.5deg);
  }
  44% {
    -webkit-transform: translateY(1.5px) rotate(0.5deg);
    transform: translateY(1.5px) rotate(0.5deg);
  }
  46% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg);
  }
  48% {
    -webkit-transform: translateY(-0.5px) rotate(0.5deg);
    transform: translateY(-0.5px) rotate(0.5deg);
  }
  50% {
    -webkit-transform: translateY(0.5px) rotate(0.5deg);
    transform: translateY(0.5px) rotate(0.5deg);
  }
  52% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg);
  }
  54% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg);
  }
  56% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg);
  }
  58% {
    -webkit-transform: translateY(0.5px) rotate(2.5deg);
    transform: translateY(0.5px) rotate(2.5deg);
  }
  60% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg);
  }
  62% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  64% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  66% {
    -webkit-transform: translateY(1.5px) rotate(-0.5deg);
    transform: translateY(1.5px) rotate(-0.5deg);
  }
  68% {
    -webkit-transform: translateY(-1.5px) rotate(-0.5deg);
    transform: translateY(-1.5px) rotate(-0.5deg);
  }
  70% {
    -webkit-transform: translateY(1.5px) rotate(0.5deg);
    transform: translateY(1.5px) rotate(0.5deg);
  }
  72% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg);
  }
  74% {
    -webkit-transform: translateY(-0.5px) rotate(0.5deg);
    transform: translateY(-0.5px) rotate(0.5deg);
  }
  76% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  78% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  80% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg);
  }
  82% {
    -webkit-transform: translateY(-0.5px) rotate(0.5deg);
    transform: translateY(-0.5px) rotate(0.5deg);
  }
  84% {
    -webkit-transform: translateY(1.5px) rotate(2.5deg);
    transform: translateY(1.5px) rotate(2.5deg);
  }
  86% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg);
  }
  88% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  90% {
    -webkit-transform: translateY(2.5px) rotate(-0.5deg);
    transform: translateY(2.5px) rotate(-0.5deg);
  }
  92% {
    -webkit-transform: translateY(0.5px) rotate(-0.5deg);
    transform: translateY(0.5px) rotate(-0.5deg);
  }
  94% {
    -webkit-transform: translateY(2.5px) rotate(0.5deg);
    transform: translateY(2.5px) rotate(0.5deg);
  }
  96% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  98% {
    -webkit-transform: translateY(-1.5px) rotate(-0.5deg);
    transform: translateY(-1.5px) rotate(-0.5deg);
  }
  0%,
  to {
    -webkit-transform: translate(0) rotate(0deg);
    transform: translate(0) rotate(0deg);
  }
}
@keyframes a {
  2% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg);
  }
  4% {
    -webkit-transform: translateY(-1.5px) rotate(-0.5deg);
    transform: translateY(-1.5px) rotate(-0.5deg);
  }
  6% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg);
  }
  8% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg);
  }
  10% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg);
  }
  12% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  14% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg);
  }
  16% {
    -webkit-transform: translateY(-0.5px) rotate(-1.5deg);
    transform: translateY(-0.5px) rotate(-1.5deg);
  }
  18% {
    -webkit-transform: translateY(0.5px) rotate(-1.5deg);
    transform: translateY(0.5px) rotate(-1.5deg);
  }
  20% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg);
  }
  22% {
    -webkit-transform: translateY(0.5px) rotate(-1.5deg);
    transform: translateY(0.5px) rotate(-1.5deg);
  }
  24% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg);
  }
  26% {
    -webkit-transform: translateY(0.5px) rotate(0.5deg);
    transform: translateY(0.5px) rotate(0.5deg);
  }
  28% {
    -webkit-transform: translateY(0.5px) rotate(1.5deg);
    transform: translateY(0.5px) rotate(1.5deg);
  }
  30% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  32%,
  34% {
    -webkit-transform: translateY(1.5px) rotate(-0.5deg);
    transform: translateY(1.5px) rotate(-0.5deg);
  }
  36% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg);
  }
  38% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg);
  }
  40% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  42% {
    -webkit-transform: translateY(2.5px) rotate(-1.5deg);
    transform: translateY(2.5px) rotate(-1.5deg);
  }
  44% {
    -webkit-transform: translateY(1.5px) rotate(0.5deg);
    transform: translateY(1.5px) rotate(0.5deg);
  }
  46% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg);
  }
  48% {
    -webkit-transform: translateY(-0.5px) rotate(0.5deg);
    transform: translateY(-0.5px) rotate(0.5deg);
  }
  50% {
    -webkit-transform: translateY(0.5px) rotate(0.5deg);
    transform: translateY(0.5px) rotate(0.5deg);
  }
  52% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg);
  }
  54% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg);
  }
  56% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg);
  }
  58% {
    -webkit-transform: translateY(0.5px) rotate(2.5deg);
    transform: translateY(0.5px) rotate(2.5deg);
  }
  60% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg);
  }
  62% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  64% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  66% {
    -webkit-transform: translateY(1.5px) rotate(-0.5deg);
    transform: translateY(1.5px) rotate(-0.5deg);
  }
  68% {
    -webkit-transform: translateY(-1.5px) rotate(-0.5deg);
    transform: translateY(-1.5px) rotate(-0.5deg);
  }
  70% {
    -webkit-transform: translateY(1.5px) rotate(0.5deg);
    transform: translateY(1.5px) rotate(0.5deg);
  }
  72% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg);
  }
  74% {
    -webkit-transform: translateY(-0.5px) rotate(0.5deg);
    transform: translateY(-0.5px) rotate(0.5deg);
  }
  76% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  78% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  80% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg);
  }
  82% {
    -webkit-transform: translateY(-0.5px) rotate(0.5deg);
    transform: translateY(-0.5px) rotate(0.5deg);
  }
  84% {
    -webkit-transform: translateY(1.5px) rotate(2.5deg);
    transform: translateY(1.5px) rotate(2.5deg);
  }
  86% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg);
  }
  88% {
    -webkit-transform: translateY(-0.5px) rotate(2.5deg);
    transform: translateY(-0.5px) rotate(2.5deg);
  }
  90% {
    -webkit-transform: translateY(2.5px) rotate(-0.5deg);
    transform: translateY(2.5px) rotate(-0.5deg);
  }
  92% {
    -webkit-transform: translateY(0.5px) rotate(-0.5deg);
    transform: translateY(0.5px) rotate(-0.5deg);
  }
  94% {
    -webkit-transform: translateY(2.5px) rotate(0.5deg);
    transform: translateY(2.5px) rotate(0.5deg);
  }
  96% {
    -webkit-transform: translateY(-0.5px) rotate(1.5deg);
    transform: translateY(-0.5px) rotate(1.5deg);
  }
  98% {
    -webkit-transform: translateY(-1.5px) rotate(-0.5deg);
    transform: translateY(-1.5px) rotate(-0.5deg);
  }
  0%,
  to {
    -webkit-transform: translate(0) rotate(0deg);
    transform: translate(0) rotate(0deg);
  }
}
/*用户输入表单*/
.tmsg-r-info {
  margin: 10px 0;
}
.tmsg-r-info input {
  height: 30px;
  border-radius: 4px;
  background: #f4f6f7;
}
.tmsg-r-info .info-submit {
  margin: 10px 0;
  text-align: center;
}
.tmsg-r-info .info-submit p,
.tmsg-commentshow h1 {
  /*background: #97dffd;*/
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  /*transition: all .3s ease-in-out;*/
  height: 30px;
  line-height: 30px;
  text-align: center;
}
/*.tmsg-r-info .info-submit p:hover{
    background: #47456d;
}*/
/*评论列表*/
.tmsg-comments .tmsg-comments-tip {
  display: block;
  border-left: 2px solid #363d4c;
  padding: 0 10px;
  margin: 40px 0;
  font-size: 20px;
}
.tmsg-commentlist {
  margin-bottom: 20px;
}
.tmsg-commentshow > .tmsg-commentlist {
  border-bottom: 1px solid #e5eaed;
}
.tmsg-c-item {
  border-top: 1px solid #e5eaed;
}
.tmsg-c-item article {
  margin: 20px 0;
}
.tmsg-c-item article header {
  margin-bottom: 10px;
}
.tmsg-c-item article header img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  float: left;
  transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  margin-right: 15px;
  object-fit: cover;
}
.tmsg-c-item article header img:hover {
  transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
}
.tmsg-c-item article header .i-name {
  font-size: 14px;
  margin: 5px 8px 7px 0;
  color: #444;
  font-weight: bold;
  display: inline-block;
}
.tmsg-c-item article header .i-class {
  display: inline-block;
  margin-left: 10px;
  background: #dff0d8;
  color: #3c763d;
  border-radius: 5px;
  padding: 3px 6px;
  font-size: 12px;
  font-weight: 400;
}
.tmsg-c-item article header .i-time {
  color: #aaa;
  font-size: 12px;
}
.tmsg-c-item article section {
  margin-left: 80px;
}
.tmsg-c-item article section p img {
  vertical-align: middle;
}
.tmsg-c-item article section .tmsg-replay {
  margin: 10px 0;
  font-size: 12px;
  color: #64609e;
  cursor: pointer;
}
</style>
