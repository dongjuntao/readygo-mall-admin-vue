import { adminLogin } from '@/api/mall-admin'
import { getToken, setToken, removeToken } from '@/utils/auth'

const admin = {
  state: {
    accessToken:{
      accessToken: "",
      tokenType: "",
      refreshToken: "",
      expiresIn: 0,
      scope: [],
      enhanceInfo: {}
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
            setToken(response.data.data.accessToken)
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
