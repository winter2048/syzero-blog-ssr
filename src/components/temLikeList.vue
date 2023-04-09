<!-- 用户喜欢收藏列表模块 -->
<template>
  <div>
    <div class="container">
      <el-row>
        <div class="likeBoxTitle">
          <h1 v-show="like==1"><i class="fa fa-wa fa-heart"></i>喜欢的文章</h1>
          <h1 v-show="like!=1"><i class="fa fa-wa fa-star"></i>收藏的文章</h1>
        </div>
        <el-col :span="24"
                class="s-item tcommonBox"
                v-for="(item,index) in articleList"
                :key="'like'+index">
          <span class="s-round-date">
            <span class="month">{{showInitDate(item.createTime,'month')}}月</span>
            <span class="day">{{showInitDate(item.createTime,'date')}}</span>
          </span>
          <header>
            <h1>
              <a :href="'/DetailShare?aid='+item.id"
                 target="_blank">
                {{item.title}}
              </a>
            </h1>
            <h2>
              <i class="fa fa-fw fa-user"></i>发表于
              <i class="fa fa-fw fa-clock-o"></i>{{showInitDate(item.createTime,'newDate')}} •
              <i class="fa fa-fw fa-eye"></i>{{item.viewNums}} 次围观 •
              <i class="fa fa-fw fa-comments"></i>活捉 {{item.commentNums}} 条 •
              <span class="rateBox">
                <i class="fa fa-fw fa-heart"></i>{{item.likeNums?item.likeNums:0}}点赞 •
                <i class="fa fa-fw fa-star"></i>{{item.collectionNums?item.collectionNums:0}}收藏
              </span>
            </h2>
            <!-- <div class="ui label">
                            <a :href="'#/Share?classId='+item.class_id">{{item.cate_name}}</a>
                        </div> -->
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
            <a class="cancelbtn tcolors-bg"
               href="javascript:void(0);"
               @click="cancelLikeCollect(item.id)">取消{{like==1?'喜欢':'收藏'}}</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a class="tcolors-bg"
               :href="'/DetailShare/'+item.id"
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
    </div>
  </div>
</template>

<script>
import { initDate } from "@/utils/index.js";
import { CollectionBlog, GetCollectionBlog } from '@/api/server.js'

export default {
  data () { //选项 / 数据
    return {
      artId: 0,//文章id
      hasMore: true,//是否还有更多数据
      articleList: '',//文章列表
      like: 1,//
      articleName: '',
      userId: '',
      Key: '',
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
    }
  },
  methods: { //事件处理器
    showInitDate: function (oldDate, full) {
      return initDate(oldDate, full)
    },
    cancelLikeCollect: async function (id) {
      var that = this;
      let colRes = await CollectionBlog(id, that.like, false);
      if (colRes) {
        that.routeChange();
      }
    },
    showLikeCollectList: async function (initpage) {//展示数据
      var that = this;
      that.$store.state.Key = that.$route.query.Key;
      that.Key = that.$store.state.Key;//获取传参的Key
      that.like = that.$route.query.like;

      //初始化
      if (initpage) {
        that.articleList = [];
      }
      let res = await GetCollectionBlog({ Skip: that.articleList.length, Limit: 5, Key: that.Key, Type: that.like });
      that.articleList = that.articleList.concat(res.list);
      if (that.articleList.length >= res.total) {
        that.hasMore = false
      } else {
        that.hasMore = true;
      }
    },
    addMoreFun: function () {//查看更多
      this.showLikeCollectList(false);
    },
    routeChange: function () {
      var that = this;
      this.showLikeCollectList(true);
    }
  },
  components: { //定义组件

  },
  watch: {
    // 如果路由有变化，会再次执行该方法

    '$route': 'routeChange',//路由变换
    '$store.state.keywords': 'routeChange'//搜索关键词变换

  },
  created () { //生命周期函数
    // console.log(this.$route);
    var that = this;
    that.routeChange();
  }
}
</script>

<style>
.likeBoxTitle {
  text-align: center;
  padding: 40px 0;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 40px;
  background: #fff;
  border-radius: 5px;
}
.likeBoxTitle h1 {
  font-weight: 700;
}
.likeBoxTitle h1 i {
  color: #df2050;
  margin-right: 10px;
  font-size: 30px;
}
.cancelbtn {
  background: #ddd;
}
.v-note-wrapper {
  z-index: 0 !important;
  border: none !important;
}
.v-show-content {
  padding: 0px 5px 0px 5px !important;
}
</style>
