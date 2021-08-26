import { adminLogin } from '@/api/mall-admin'
import {setToken, setUserInfo} from "@/utils/auth";

const admin = {
  state: {
    accessToken:{
      accessToken: "", //token值
      tokenType: "", //token类型
      refreshToken: "", //刷新token值
      expiresIn: 0, //token有效期
      scope: [], //范围
      enhanceInfo: {} //扩展增强信息（目前包括userName,userId,userType）
    }
  },
  mutations: {
    SET_ACCESS_TOKEN (state, accessToken) {
      state.accessToken = accessToken
    }
  },
  actions: {
    //登录
    Login({ commit }, {params, data}) {
      return new Promise((resolve, reject) => {
        adminLogin(params, data).then(response => {
          //登录后把token存到cookie中
          if (response && response.data.code === "200") {
            var result = response.data.data;
            setToken(result.enhanceInfo.userName+"_"+result.enhanceInfo.userId, result.accessToken)
            setUserInfo(result.enhanceInfo.userName+"_"+result.enhanceInfo.userId, result.enhanceInfo);
            sessionStorage.setItem("userNameKey", result.enhanceInfo.userName+"_"+result.enhanceInfo.userId)
            commit('SET_ACCESS_TOKEN',response.data.data)
            resolve();
          } else { //如果未返回200，则返回提示信息
            resolve(response);
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default admin
