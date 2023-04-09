<!-- 首页 -->
<template>
  <div>
    <wbc-nav :navData="navigationList"></wbc-nav>
    <div class="container">
      <el-row :gutter="30">
        <el-col :sm="24"
                :md="16"
                style="transition:all .5s ease-out;margin-bottom:30px;">
          <wbc-sharelist></wbc-sharelist>
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
import header from "../components/header.vue";
import footer from "../components/footer.vue";
import temSharelist from "../components/temSharelist.vue";
import temRightlist from "../components/temRightlist.vue";
export default {
  name: "Home",
  data () {
    //选项 / 数据
    return { navigationList: "" };
  },

  async asyncData ({ params, store }) {
    let navRes = await GetNavigation();
    return { navigationList: navRes };
  },
  methods: {
    //事件处理器
  },
  components: {
    //定义组件
    "wbc-nav": header,
    "wbc-sharelist": temSharelist,
    "wbc-rightlist": temRightlist,
    "wbc-footer": footer
  },
  created () {
    //生命周期函数
  }
};
</script>

<style></style>
