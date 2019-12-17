// store.router 权限管理相关store
import {
  asyncRouterMap,
  constantRouterMap
} from "@/router";
import {
  filterAsyncRouter
} from "@/assets/js/common";

export default {
  namespaced: true,
  state: {
    routes: constantRouterMap,
    addRoutes: [],
    roles: []
  },
  mutations: {
    // 角色存储
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    // 路由拼接
    SET_ROUTES(state, routes) {
      state.addRoutes = routes;
      state.routes = constantRouterMap.concat(routes);
    }
  },
  actions: {
    // 根据roles, 异步拼接路由
    GENERATE_ROUTES({
      commit
    }, data) {
      // data:当前登录账号的角色数组
      return new Promise(resolve => {
        const {
          roles
        } = data;
        let accessedRoutes;
        accessedRoutes = filterAsyncRouter(asyncRouterMap, roles);
        commit("SET_ROUTES", accessedRoutes);
        resolve();
      });
    }
  }
};