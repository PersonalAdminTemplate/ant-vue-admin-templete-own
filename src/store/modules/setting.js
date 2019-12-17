export default {
  namespaced: true,
  state: {
    isMobile: false,
    theme: "dark",
    layout: "side",
    systemName: "好易学后台管理",
    copyright: "2019 湖南都成科技",
    footerLinks: [],
    multipage: true
  },
  mutations: {
    setDevice(state, isMobile) {
      state.isMobile = isMobile;
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
    setLayout(state, layout) {
      state.layout = layout;
    },
    setMultipage(state, multipage) {
      state.multipage = multipage;
    }
  }
};