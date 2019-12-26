import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/login/Login";
// import PageView from "@/layouts/PageView";
import MenuView from "@/layouts/MenuView";
import RouteView from "@/layouts/RouteView";
Vue.use(VueRouter);
//普通路由, 所有权限都能访问的路由部分
export const constantRouterMap = [{
    path: "/login",
    name: "登录页",
    component: Login,
    invisible: true
  },
  {
    path: "/",
    name: "首页",
    component: MenuView,
    redirect: "/home",
    icon: "none",
    children: [{
        path: "/home",
        name: "首页",
        component: () => import("@/views/home/home.vue"),
        icon: "home"
      },
      {
        path: "/userManager",
        name: "用户管理",
        component: () => import("@/views/userManager/userManager.vue"),
        icon: "userManager"
      },
      {
        path: "/order",
        name: "订单",
        component: () => import("@/views/order/order.vue"),
        icon: "order"
      },
      {
        path: "/dev",
        name: "dev",
        component: () => import("@/views/dev/dev.vue"),
        icon: "dev"
      },
    ]
  },
  {
    path: "/exception",
    name: "异常页",
    icon: "warning",
    invisible: true,
    component: RouteView,
    children: [{
        path: "/exception/404",
        name: "404",
        icon: "none",
        component: () => import("@/views/exception/404")
      },
      {
        path: "/exception/403",
        name: "403",
        icon: "none",
        component: () => import("@/views/exception/403")
      },
      {
        path: "/exception/500",
        name: "500",
        icon: "none",
        component: () => import("@/views/exception/500")
      }
    ]
  }
];
// 异步路由, 需要权限管理的路由
export const asyncRouterMap = [{
    path: "*",
    redirect: "/exception/403",
    hidden: true,
    invisible: true
  } // 404配置需放到路由配置最后
];

// 解决navigationDuplicated 路由连续点击报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
  routes: constantRouterMap
});

export default router;