<!-- 文章列表 -->
<template>
  <el-row class="sharelistBox">
    <div v-if="this.$route.name == 'Share' && !this.$route.query.Key"
         class="shareTitle">
      <div class="ui label">
        <a :href="'/Share?class=' + (sonclassList.alias || sonclassList.id)">{{
          sonclassList.name
        }}</a>
      </div>
      <ul v-if="sonclassList"
          class="shareclassTwo">
        <li v-for="(citem, index) in sonclassList.childs"
            :key="index">
          <a :href="'/Share?class=' + (citem.alias || citem.id)"
             :class="citem.alias == Class || citem.id == Class ? 'active' : ''">{{ citem.name }}</a>
        </li>
      </ul>
    </div>

    <el-col :span="24"
            class="s-item tcommonBox"
            v-for="(item, index) in articleList"
            :key="'article' + index">
      <span class="s-round-date">
        <span class="month"
              v-html="showInitDate(item.createTime, 'month') + '月'"></span>
        <span class="day"
              v-html="showInitDate(item.createTime, 'date')"></span>
      </span>
      <header>
        <h1>
          <a :href="'#/DetailShare?aid=' + item.id"
             target="_blank">
            {{ item.title }}
          </a>
        </h1>
        <h2>
          <i class="fa fa-fw fa-user"></i>发表于
          <i class="fa fa-fw fa-clock-o"></i><span v-html="showInitDate(item.createTime, 'all')">{{
            showInitDate(item.createTime, "all")
          }}</span>
          • <i class="fa fa-fw fa-eye"></i>{{ item.viewNums }} 次围观 •
          <i class="fa fa-fw fa-comments"></i>活捉 {{ item.commentNums }} 条 •
          <span class="rateBox">
            <i class="fa fa-fw fa-heart"></i>{{ item.likeNums ? item.likeNums : 0 }}点赞 •
            <i class="fa fa-fw fa-star"></i>{{ item.collectionNums ? item.collectionNums : 0 }}收藏
          </span>
        </h2>
        <div class="ui label">
          <a :href="'/Share?class=' + (item.categoryAlias || item.categoryId)">{{ item.categoryName }}</a>
        </div>
      </header>
      <div class="article-content">
        <mavon-editor :value="item.describe"
                      :ishljs="true"
                      :subfield="false"
                      :boxShadow="false"
                      defaultOpen="preview"
                      :toolbarsFlag="false"
                      previewBackground="#ffffff"
                      :externalLink="externalLink"></mavon-editor>
      </div>
      <div class="viewdetail">
        <a class="tcolors-bg"
           :href="'/DetailShare/' + item.id"
           target="_blank">
          阅读全文>>
        </a>
      </div>
    </el-col>
    <el-col class="viewmore">
      <a v-show="hasMore"
         class="tcolors-bg"
         href="javascript:void(0);"
         @click="addMoreFun">点击加载更多</a>
      <a v-show="!hasMore"
         class="tcolors-bg"
         href="javascript:void(0);">暂无更多数据</a>
    </el-col>
  </el-row>
</template>

<script>
import { initDate } from "@/utils/index.js";
import { GetBlog, GetBlogCategory } from "@/api/server";

export default {
  name: "Share",
  data () {
    //选项 / 数据
    return {
      artId: 0,
      Class: 0,
      sonclassList: "", //二级分类
      classtwoId: 5,
      Key: "",
      hasMore: true,
      level: 1,
      shareClass: [],
      queryClass: 1,
      articleList: [],
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
    showInitDate: function (oldDate, full) {
      //console.log(oldDate, full);
      return initDate(oldDate, full);
    },
    showSearchShowList: async function (initpage) {
      //展示数据
      var that = this;
      that.Class =
        that.$route.query.class == undefined ? "" : that.$route.query.class; //获取传参的class
      that.$store.state.Key =
        that.$route.query.Key == undefined ? "" : that.$route.query.Key;
      that.Key = that.$store.state.Key; //获取传参的Key

      //判断当前显示的分类名称 以及子分类
      let classList = await GetBlogCategory();
      that.shareClass = classList.list;
      console.log("mmmmmmm", classList);
      for (var i = 0; i < that.shareClass.length; i++) {
        if (
          that.Class == that.shareClass[i].id ||
          that.Class == that.shareClass[i].alias
        ) {
          that.sonclassList = that.shareClass[i];
        } else {
          if (
            that.shareClass[i].childs &&
            that.shareClass[i].childs.length > 0
          ) {
            that.shareClass[i].childs.forEach(currentItem => {
              if (
                that.Class == currentItem.id ||
                that.Class == currentItem.alias
              ) {
                that.sonclassList = that.shareClass[i];
              }
            });
          }
        }
      }
      //初始化
      if (initpage) {
        that.articleList = [];
        that.hasMore = true;
      }
      let res = await GetBlog({
        Skip: that.articleList.length,
        Limit: 5,
        Class: that.Class,
        Key: that.Key
      });
      that.articleList = that.articleList.concat(res.list);
      if (that.articleList.length >= res.total) {
        that.hasMore = false;
      } else {
        that.hasMore = true;
      }
    },
    addMoreFun: function () {
      //查看更多
      this.showSearchShowList(false);
    },
    routeChange: function () {
      var that = this;
      this.showSearchShowList(true);
    }
  },
  components: {},
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "routeChange",
    "$store.state.Key": "routeChange"
  },
  created () {
    //生命周期函数
    // console.log(this.$route);
    var that = this;
    that.routeChange();
  }
};
</script>

<style>
/*分享标题*/
.shareTitle {
  margin-bottom: 40px;
  position: relative;
  border-radius: 5px;
  background: #fff;
  padding: 15px;
}
.shareclassTwo {
  width: 100%;
}
.shareclassTwo li {
  display: inline-block;
}
.shareclassTwo li a {
  display: inline-block;
  padding: 3px 7px;
  margin: 5px 10px;
  color: #fff;
  border-radius: 4px;
  background: #64609e;
  border: 1px solid #64609e;
  transition: transform 0.2s linear;
  -webkit-transition: transform 0.2s linear;
}
.shareclassTwo li a:hover {
  transform: translate(0, -3px);
  -webkit-transform: translate(0, -3px);
}
.shareclassTwo li a.active {
  background: #fff;
  color: #64609e;
}
/*文章列表*/
.sharelistBox {
  transition: all 0.5s ease-out;
  font-size: 15px;
}
.v-note-wrapper {
  z-index: 0 !important;
  border: none !important;
}
.v-show-content {
  padding: 0px 5px 0px 5px !important;
}
/*.sharelistBox .viewmore a:hover,.s-item .viewdetail a:hover{
        background: #48456C;
    }*/
</style>
