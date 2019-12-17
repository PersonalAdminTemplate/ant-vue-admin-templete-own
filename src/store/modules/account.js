import {
  getUserInfo,
  removeUserInfo
} from "@/router/cookie"
// 账户相关
export default {
  namespaced: true,
  state: {
    userInfo: {},
    isLogin: false
  },
  mutations: {
    SET_USER(state) {
      // const userInfo = JSON.parse(sessionStorage.getItem("user"));
      const userInfo = getUserInfo()
      state.userInfo = userInfo;
      state.isLogin = (userInfo && !!userInfo.userId) || false;
    },
    REMOVE_USER(state) {
      state.userInfo = {};
      state.isLogin = false;
      removeUserInfo()
      // sessionStorage.setItem("user", JSON.stringify({}));
    }
  }
};