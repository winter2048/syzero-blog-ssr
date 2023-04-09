import Vue from 'vue'
import Vuex from 'vuex'
import cookie from 'cookie'

Vue.use(Vuex)
const state = {
  token: '',
  counter: 0,
  counter: 0,
  loading: false,
  UserList: [111, 222, 333], //用户列表
  themeObj: 0,//主题
  aboutmeObj: '',//关于我的信息
  apiBaseURL: "http://localhost:5002",//接口路径
  //apiBaseURL: "http://localhost:53872",//接口路径
  Key: '',//关键词
  errorImg: '',
  seoBlog: '',
  webConfig: {
    other: {
      otherBanner: "",
      otherRightImg: "",
      otherLoginImg: "",
      otherGithub: "",
      otherQQ: "",
      otherWeibo: "",
      otherWx: "",
      otherCsdn: "",
      otherJianli: "",
      otherMore: ""
    },
    user: {
      name: "",
      mail: "",
      phone: null,
      sex: 1,
      addTime: "",
      lastTime: "",
      lastIP: null,
      type: 2,
      status: 1,
      nickName: "SYZERO",
      pictureUrl: "",
      description: ""
    },
    defaultUser: {
      name: "",
      mail: "",
      phone: null,
      sex: 1,
      addTime: "",
      lastTime: "",
      lastIP: null,
      type: 2,
      status: 1,
      nickName: "SYZERO",
      pictureUrl: "",
      description: ""
    }
  }
}
// 创建一个对象存储一系列
const mutations = {
  increment (state) {
    state.counter++
  },
  setToken (state, token) {
    state.token = token
  },
  setWebConfig (state, webConfig) {
    state.webConfig = webConfig
  },
  setSeoBlog (state, seoBlog) {
    state.seoBlog = seoBlog
  }
};

const actions = {
  nuxtServerInit ({ commit }, { req }) {
    // 将cookie转成json对象（自己实现该方法）

    let token = cookie.parse(req.headers.cookie || '').token || '';
    commit('setToken', token);
  }
};
const store = () => new Vuex.Store({
  strict: false,
  state: state,
  mutations: mutations,
  actions: actions
})

export default store;


