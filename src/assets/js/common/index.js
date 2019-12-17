// localStorage的 get, set, remove
import "./checkReExp"

export const getStore = val => {
  if (!val) return;
  return JSON.parse(window.localStorage.getItem(val));
};

export const setStore = (key, val) => {
  if (!key) return;
  if (typeof val !== "string") {
    val = JSON.stringify(val);
  }
  return window.localStorage.setItem(key, val);
};

export const removeStore = val => {
  if (!val) return;
  window.localStorage.removeItem(val);
};

//提取url中param
export const getUrlParam = (name, url) => {
  // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  // var r = window.location.search.substr(1).match(reg);
  // if (r != null) return unescape(r[2]);
  // return null;

  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
  if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, " "));
  return "";
};

//判断是否为安卓
export const isAndroid_ios = () => {
  var u = navigator.userAgent;
  //android终端或者uc浏览器
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
  return isAndroid == true ? true : false;
};

// 后台管理, 权限控制相关方法
// 判断是否有权限方法
export function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0);
  } else {
    return true;
  }
}
// 根据角色、过滤出路由列表
export function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

// 对象的map函数, fn参数为(key, value)
export const objMap = (obj, fn) => {
  if (typeof fn !== "function") {
    throw new TypeError(`${fn} is not a function !`);
  }
  return JSON.parse(JSON.stringify(obj, fn));
}
// 修改obj的key, obj 目标对象, map[Object] 映射对象
export const formatObjKey = (obj, map) => {
  const res = {}
  let entries = Object.entries(map)
  entries.forEach(item => {
    res[item[1]] = obj[item[0]]
  })
  return res
}

// 修改obj的key, obj 目标对象, map[Object] 映射对象
export const formatObjKeyByDel = (obj, map) => {
  let entries = Object.entries(map)
  entries.forEach(item => {
    obj[item[1]] = obj[item[0]]
    delete obj[item[0]]
  })
  return obj
}
// target中的属性与值全部在obj中存在且相等
export const isInclude = ({
  target,
  obj
}) => {
  let entries = Object.entries(target)
  return entries.every(item => {
    return item[1] === obj[item[0]]
  })
}

// const obj1 = { a: 1, b: 2, c: 3 }
// const nul = null
// const arr = []
// const obj = {}
// const und = undefined
// const num = 0
// const str = '123'
// const bool = true
// const fal = false
// const reg = /a/
// const func = function (a) { return a }
// const err = new Error()
// console.log('obj1', typeOf(obj1))
// console.log('nul', typeOf(nul))
// console.log('arr', typeOf(arr))
// console.log('obj', typeOf(obj))
// console.log('und', typeOf(und))
// console.log('num', typeOf(num))
// console.log('str', typeOf(str))
// console.log('bool', typeOf(bool))
// console.log('fal', typeOf(fal))
// console.log('reg', typeOf(reg))
// console.log('func', typeOf(func))
// console.log('err', typeOf(err))
// 
export const typeOf = i => {
  return Object.prototype.toString.call(i)
}

// deepClone
export const deepClone = (obj) => {
  if (typeof obj !== "object")
    return obj;
  else if (Array.isArray(obj))
    return obj.map(deepClone);
  return Object.fromEntries(Object.entries(obj).map(
    ([k, v]) => ([k, deepClone(v)])
  ));
}