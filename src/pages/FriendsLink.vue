<!-- 友情链接 -->
<template>
  <div>
    <wbc-nav :navData="navigationList"></wbc-nav>
    <div class="container">
      <el-row :gutter="30">
        <el-col :sm="24"
                :md="16"
                style="transition:all .5s ease-out;margin-bottom:30px;">
          <wbc-friends></wbc-friends>
          <!-- <wbc-message></wbc-message> -->
        </el-col>
        <el-col :sm="24"
                :md="8">
          <wbc-rightlist></wbc-rightlist>
        </el-col>
      </el-row>
    </div>
    <wbc-footer></wbc-footer>
  </div>
</template>

<script>
import { GetNavigation } from "@/api/server";
import header from '@/components/header.vue'
import footer from '@/components/footer.vue'
import temFriends from '@/components/temFriends.vue'
import temRightlist from '@/components/temRightlist.vue'
//import temMessage from '@/components/temMessage.vue'
export default {
  name: 'FriendsLink',
  data () { //选项 / 数据
    return {

    }
  },
  head () {
    return {
      title: this.$store.state.webConfig.baseSeo.seoTitleStyle == 0 ? '伙伴' :
        this.$store.state.webConfig.baseSeo.seoTitleStyle == 1 ? '伙伴' + " - " + this.$store.state.webConfig.basics.blogName :
          this.$store.state.webConfig.baseSeo.seoTitleStyle == 2 ? '伙伴' + " - " + this.$store.state.webConfig.baseSeo.seoTitle :
            '伙伴',
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

  },
  components: { //定义组件
    'wbc-nav': header,
    // 'wbc-message':temMessage,
    'wbc-friends': temFriends,
    'wbc-rightlist': temRightlist,
    'wbc-footer': footer
  },
  created () { //生命周期函数

  }
}
</script>

<style>
</style>
