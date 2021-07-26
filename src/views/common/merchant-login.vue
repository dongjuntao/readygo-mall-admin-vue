<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               label-position="left">
        <h1 class="login-title">商城商户管理系统</h1>

        <el-form-item style="margin-top: 30px;" prop="userName">
          <el-input name="userName"
                    type="text"
                    v-model="dataForm.userName"
                    autoComplete="on"
                    placeholder="请输入用户名">
          </el-input>
        </el-form-item>

        <el-form-item prop="password" style="margin-top: 40px;">
          <el-input name="password"
                    type="password"
                    show-password
                    v-model="dataForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          </el-input>
        </el-form-item>

        <el-form-item style="margin-top: 50px;text-align: center">
          <el-button v-if="!loading" style="width: 100%" type="primary" :loading="loading" @click="useVerify">登 录</el-button>
          <el-button style="width: 100%" type="primary" :loading="loading" v-else>登 录 中</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_background" class="login-center-layout">

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
  import verify from '@/components/verifition/Verify'
  import login_background from '@/assets/img/merchant_login_background.png';

  export default {
    components: {
      verify
    },
    data () {
      return {
        loginType: 'merchant',
        dataForm: {
          userName: '',//用户名
          password: ''//密码
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        loading: false,
        pwdType: 'password',
        login_background,
        supportDialogVisible:false,
        userType: 1
      }
    },
    mounted () {
      document.onkeydown = (e) => {
        if (window.event === undefined) {
          var key = e.keyCode
        } else {
          var key = window.event.keyCode
        }
        if (key === 13) {
          this.useVerify()
        }
      }
    },
    methods: {
      // 提交表单
      dataFormSubmit (captchaVerification) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loading=true;
            var params = this.axios.paramsHandler(captchaVerification);
            var data = this.axios.dataHandler({
              userName: this.dataForm.userName,
              password: this.dataForm.password,
              userType: 1 //商户管理员
            });
            this.$store.dispatch('Login', {params, data}).then((response) => {
              this.loading = false
              if (!response) {
                this.$router.replace({ name: 'home' })
              }else {
                this.$message.warning(response.data.message);
              }
            }).catch(() => {
              this.loading = false
              this.$message.warning("登录失败");
            })
          }
        })
      },

      useVerify(){
        this.$refs.verify.show()
      }
    }
  }
</script>

<style lang="scss">
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  top: 100px;
  width: 400px;
  height: 350px;
  margin: 100px auto;
  border-top: 3px solid #3399ff;
  background-color: #FFFFFFFF;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  overflow: hidden;
  position: fixed;
  width:100%;
  height:100%;
  background-size:cover;
  z-index: -1;
}
</style>
