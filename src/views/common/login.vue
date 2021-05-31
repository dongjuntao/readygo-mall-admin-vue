<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">商城管理系统</h2>
          <p class="brand-info__intro">欢迎登录商城后台管理系统</p>
        </div>
        <div class="login-main">
          <h3 class="login-title">管理员登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="useVerify">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!--验证码-->
    <verify
      @success="dataFormSubmit"
      :captchaType="'blockPuzzle'"
      :imgSize="{width:'400px',height:'200px'}"
      ref="verify">
    </verify>
  </div>


</template>

<script>
  import { getUUID } from '@/utils'
  import verify from '@/components/verifition/Verify'
  import { adminLogin } from "../../api/mall-admin";

  export default {
    components: {
      verify
    },
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {

    },
    methods: {
      // 提交表单
      dataFormSubmit (captchaVerification) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = this.$axios.adornParams(captchaVerification);
            var data = this.$axios.adornData({
              userName: this.dataForm.userName,
              password: this.dataForm.password
            });
            this.$store.dispatch('Login', {params, data}).then(() => {
              this.loading = false
              this.$router.replace({ name: 'home' })
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },

      handerKeyup(e){
        var keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13) {
          this.checkPrama();
        }
      },

      useVerify(){
        this.$refs.verify.show()
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 80%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>
