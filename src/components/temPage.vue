<!-- 页面详情 -->
<template>
  <div class="tcommonBox">
    <header>
      <h1>
        <a href="/DetailShare"
           target="_blank">
          {{data.title}}
        </a>
      </h1>
    </header>
    <section>
      <mavon-editor :value="data.content"
                    :ishljs="true"
                    :subfield="false"
                    :boxShadow="false"
                    defaultOpen="preview"
                    :toolbarsFlag="false"
                    previewBackground="#ffffff"></mavon-editor>
    </section>
  </div>
</template>

<script>
import { initDate } from '@/utils/index.js'
import { GetBlogInfo } from '@/api/server.js'

export default {
  props: ["data"],
  data () { //选项 / 数据
    return {
      detailObj: '',//返回详情数据
      aid: ''
    }
  },
  methods: { //事件处理器

  },
  watch: {

  },
  components: { //定义组件

  },
  created () { //生命周期函数

  },
  methods: {

  }
}
</script>

<style>
.aboutmeImg {
  max-width: 100%;
  /*height:300px;*/
}
.tcommonBox p a {
  color: #01aaed !important;
}
.tcommonBox p a:hover {
  color: #48456d !important;
}
.tcommonBox p i {
  font-style: italic;
}
.tcommonBox p b {
  font-weight: bold;
}

.v-note-wrapper {
  z-index: 0 !important;
  border: none !important;
}
.v-show-content {
  padding: 0px 5px 0px 5px !important;
}
</style>
