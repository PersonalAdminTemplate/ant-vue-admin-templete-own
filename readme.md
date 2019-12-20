# 基于antd的后台管理系统自用模板

### 启动

  ```
    $npm i

    $npm run serve
  ```

### 注意
  - 项目基于    [antd-of-vue](https://www.antdv.com/docs/vue/introduce-cn/)
  - 项目封装了api调用方法: /src/api
  - 项目配置了权限管理: /src/router
  - 修改了原模板sideMenu中menu.js渲染侧边栏导航, 原项目渲染为a标签导航, 存在一些未预料滚动问题,故修改为router.push形式的路由跳转
  - 修改了原模板的布局, 通过100vh, min-width:1024px等 限制了页面的样式.
  - 制作了分页请求缓存, /userManager @getUsers @Cache