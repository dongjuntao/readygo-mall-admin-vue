import { adminLogin } from '@/api/mall-admin'
import { getToken, setToken, removeToken } from '@/utils/auth'

const admin = {
  state: {
    id: 0, //用户id
    name:'',
    userName: '' //用户名
  },
  mutations: {
    SET_USERNAME (state, userName) {
      state.userName = userName
    },
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    }
  },
  actions: {
    //登录
    Login({ commit }, {params, data}) {
      return new Promise((resolve, reject) => {
        adminLogin(params, data).then(response => {
          //登录后把token存到cookie中
          setToken(response.data.data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default admin
