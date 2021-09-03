<template>
  <div class="mod-home" style="text-align: center;">
    <h2 v-if="auditStatus == 0">
      管理员正在审核中，请您耐心等待3到5个工作日，留意短信或邮件邮件通知！
    </h2>
    <h2 v-if="auditStatus == 2">
      审核未通过，请根据短信或邮件提示在<el-link style="font-size: 1em;font-weight: bold; bottom: 1.2px;" type="primary" :underline="false">我的店铺</el-link>中重新填写入驻信息并申请！
    </h2>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
export default {
  data () {
    return {
      userName: '',
      userId: 0,
      userType: null,
      auditStatus: null
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userName = userInfo.userName;
      this.userId = userInfo.userId;
      this.userType = userInfo.userType;
      this.auditStatus = userInfo.auditStatus
    }
  }
}
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>

