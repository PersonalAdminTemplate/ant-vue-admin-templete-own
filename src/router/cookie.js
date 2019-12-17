import Cookies from 'js-cookie'

const userInfo = 'userInfo'

let getUserInfo
let setUserInfo
let removeUserInfo

if (process.env.NODE_ENV == "production") {
  getUserInfo = () => {
    let user = Cookies.get(userInfo)
    if (user) user = JSON.parse(user)
    return user
  }

  setUserInfo = info => {
    return Cookies.set(userInfo, JSON.stringify(info), {
      expires: 7
    })
  }

  removeUserInfo = () => {
    return Cookies.remove(userInfo)
  }

} else if (process.env.NODE_ENV == "development") {
  getUserInfo = () => {
    if (!userInfo) return;
    return JSON.parse(sessionStorage.getItem(userInfo));
  }

  setUserInfo = info => {
    if (typeof info !== "string") {
      info = JSON.stringify(info);
    }
    return sessionStorage.setItem(userInfo, info);
  }

  removeUserInfo = () => {
    if (!userInfo) return;
    sessionStorage.removeItem(userInfo);
  }
}

export {
  getUserInfo,
  setUserInfo,
  removeUserInfo
}