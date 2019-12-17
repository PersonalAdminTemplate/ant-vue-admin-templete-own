import fetch from "./fetch.js";
import {
  Modal
} from "ant-design-vue"
export const api = {
  // 1. /login
  loginV2: config =>
    fetch({
      ...config,
      url: "/app/user/loginV2",
      onGlobalFail: function (res) {
        Modal.error({
          title: '登录失败',
          content: res.message || res.msg
        })
      },
      method: "POST"
    }),
  // 2. 获取学校列表 /home, /billProduct, /billRecord, /order, /userManager
  findSchoolList: config => fetch({
    ...config,
    url: "/app/school/findSchoolList",
    method: "GET"
  }),
  // 3. 获取某学校缴费"活动" /home, /billRecord
  getBillConfigBy: config =>
    fetch({
      ...config,
      url: "/app/bill/getBillConfigBy",
      method: "POST"
    }),
  // 4. 获取某学校的缴费项目(商品) /home, /billProduct, /order
  getBillProductsByOrg: config => fetch({
    ...config,
    url: "/app/product/getBillProductsByOrg",
    method: "POST"
  }),
};