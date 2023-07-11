<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header" style="background-color: #f4f4f4">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <img class="site-navbar__brand-lg" href="javascript:;" width="160" height="40" src="../assets/img/logo.png">
        <img class="site-navbar__brand-mini" href="javascript:;" width="38" height="38" src="../assets/img/small-logo.png">
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">

        <el-menu-item v-if="userType != 0" index="1"  class="el-menu-demo" @click="$router.push({ name: 'myStore' })">
            <a style="color: #000000;" >我的店铺</a>
        </el-menu-item>

        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link" v-if="avatar">
              <img style="width: 36px; height: 36px;" :src="avatar" :alt="userName">{{ userName }}
            </span>
            <span class="el-dropdown-link"v-else>
              <img src="~@/assets/img/avatar.jpg" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePassword" :userName="userName"></update-password>
  </nav>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import { clearLoginInfo, getUserInfo } from '@/utils/auth'
import { adminLogout } from '@/api/mall-admin/mall-admin'

export default {
  data () {
    return {
      updatePasswordVisible: false,
      userName: '',
      userId: 0,
      userType: null,
      avatar: null
    }
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 修改密码
    updatePasswordHandle () {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(`确定进行【退出登录】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adminLogout().then(({data}) => {
            if (data && data.code === "200") {
              clearLoginInfo();
              //清空vuex状态（退出重新登录，直接进入home，不进入其他页面）
              this.$store.commit('common/updateMenuActiveName','');
              //系统管理员用户，退出到系统管理员等了页面
              this.$router.push({ name: "admin-login" })
            }else {
              this.$message.warning("退出失败");
            }
        });
      }).catch(() => {})
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userName = userInfo.userName;
      this.userId = userInfo.userId;
      this.userType = userInfo.userType;
      this.avatar = userInfo.avatar
    }
  }
}
</script>
<style lang="scss">
.el-menu.el-menu--horizontal {
  border-bottom: solid 0px #e6e6e6;
}
</style>
