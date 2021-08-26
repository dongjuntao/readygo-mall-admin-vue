<template>
  <div class="main-bg" id="mian">
    <!-- title -->
    <h1>商城后台管理系统</h1>
    <!-- //title -->
    <div class="sub-main-w3">
      <div class="image-style">
      </div>
      <!-- vertical tabs -->
      <div class="vertical-tab">
        <div id="section1" class="section-w3ls">
          <input type="radio" name="sections" id="option1" checked @click="setSubmitType(0)">
          <label for="option1" class="icon-left-w3pvt">
            <span class="fa fa-user-circle" aria-hidden="true"></span>平台管理员
          </label>
          <article>
            <el-form autoComplete="on"
                     :model="adminDataForm"
                     :rules="adminDataRule"
                     ref="adminDataForm"
                     label-position="left">
              <h3 class="legend">平台管理员登录</h3>
              <el-form-item style="margin-top: 30px;" prop="userName">
                <el-input name="userName"
                          type="text"
                          v-model="adminDataForm.userName"
                          autoComplete="on"
                          placeholder="请输入用户名"
                          size="large"
                          prefix-icon="el-icon-s-custom">
                </el-input>
              </el-form-item>
              <el-form-item prop="password" style="margin-top: 40px;">
                <el-input name="password"
                          type="password"
                          show-password
                          v-model="adminDataForm.password"
                          autoComplete="on"
                          placeholder="请输入密码"
                          size="large"
                          prefix-icon="el-icon-lock">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="rememberMe">记住密码</div> <input class="checkbox" type="checkbox"/>
              </el-form-item>
              <el-form-item>
                <el-button class="submit" type="primary" v-if="!loading" :loading="loading" @click="useVerify">登 录</el-button>
                <el-button class="submit" type="primary" :loading="loading" v-else>登 录 中</el-button>
              </el-form-item>
            </el-form>
          </article>
        </div>

        <div id="section2" class="section-w3ls">
          <input type="radio" name="sections" id="option2" @click="setSubmitType(1)">
          <label for="option2" class="icon-left-w3pvt"><span class="fa fa-user-circle" aria-hidden="true"></span>商户管理员</label>
          <article>
            <el-form autoComplete="on"
                     :model="merchantDataForm"
                     :rules="merchantDataRule"
                     ref="merchantDataForm"
                     label-position="left">
              <h3 class="legend">商户管理员登录</h3>
              <el-form-item style="margin-top: 30px;" prop="userName">
                <el-input name="userName"
                          type="text"
                          v-model="merchantDataForm.userName"
                          autoComplete="on"
                          placeholder="请输入用户名"
                          size="large"
                          prefix-icon="el-icon-s-custom">
                </el-input>
              </el-form-item>
              <el-form-item prop="password" style="margin-top: 40px;">
                <el-input name="password"
                          type="password"
                          show-password
                          v-model="merchantDataForm.password"
                          autoComplete="on"
                          placeholder="请输入密码"
                          size="large"
                          prefix-icon="el-icon-lock">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="rememberMe">记住密码</div> <input class="checkbox" type="checkbox"/>
                <el-button class="merchant-settled" type="danger"  @click="toMerchantSettled">商家入驻</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="submit" type="primary" v-if="!loading" :loading="loading" @click="useVerify">登 录</el-button>
                <el-button class="submit" type="primary" :loading="loading" v-else>登 录 中</el-button>
              </el-form-item>
            </el-form>
          </article>
        </div>
        <div id="section3" class="section-w3ls">
          <input type="radio" name="sections" id="option3">
          <label for="option3" class="icon-left-w3pvt"><span class="fa fa-lock" aria-hidden="true"></span>忘记密码?</label>
          <article>
            <el-form autoComplete="on"
                     :model="resetPasswordDataForm"
                     :rules="resetPasswordDataRule"
                     ref="resetPasswordDataForm"
                     label-position="left">
              <h3 class="legend">重置密码</h3>
              <p class="para-style">请在下面输入您的电子邮件地址，我们将给您发送一封带有说明的电子邮件，我们会通过邮件方式告知您如何重置密码。</p>

              <el-form-item style="margin-top: 30px;" prop="email">
                <el-input name="email"
                          type="text"
                          v-model="resetPasswordDataForm.email"
                          autoComplete="on"
                          placeholder="请输入邮箱"
                          size="large"
                          prefix-icon="el-icon-s-custom">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="submit" style="margin-top: 86px;" type="primary">提 交</el-button>
              </el-form-item>
            </el-form>
          </article>
        </div>
      </div>
      <!-- //vertical tabs -->
      <div class="clear"></div>
    </div>
    <div class="copyright">
      <h2>Copyright &copy; 2019 - 2021 版权所有| by
        <a href="#">Dong</a>
      </h2>
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
addEventListener("load", function () {
  setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
  window.scrollTo(0, 1);
}

import verify from '@/components/verifition/Verify'

export default {
  components: {
    verify
  },
  data() {
    return {
      adminDataForm: {
        userName: '',//用户名
        password: '',//密码
      },
      merchantDataForm: {
        userName: '',//用户名
        password: '',//密码
      },
      resetPasswordDataForm:{
        email: '' //邮箱
      },
      adminDataRule: {
        userName: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      merchantDataRule: {
        userName: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      resetPasswordDataRule: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ]
      },
      checked:false,
      loading: false,
      pwdType: 'password',
      supportDialogVisible:false,
      userType: 0,
      submitType: 0 //提交请求的类型（0：平台管理员登录 1：商户管理员登录 2：重置密码提交）
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
    // 登录提交表单提交表单
    dataFormSubmit (captchaVerification) {
      this.$refs[this.submitType == 0 ? 'adminDataForm': 'merchantDataForm'].validate((valid) => {
        if (valid) {
          this.loading=true;
          var params = this.axios.paramsHandler(captchaVerification);
          var data = this.axios.dataHandler({
            userName: this.submitType == 0 ? this.adminDataForm.userName : this.merchantDataForm.userName,
            password: this.submitType == 0 ? this.adminDataForm.password : this.merchantDataForm.password,
            userType: this.submitType == 0 ? 0 : 1 //系统管理员或商户管理员登录
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

    /**
     * 跳转到商家入驻页面
     */
    toMerchantSettled(){
      let pushData = this.$router.resolve({ path: '/merchant/settled' });
      window.open(pushData.href,"_blank")
    },
    //选择登录时，设置提交的类型（0：平台管理员登录 1：商户管理员登录 2：重置密码提交）
    setSubmitType(submitType){
      this.submitType = submitType
    },
    useVerify(){
      this.$refs.verify.show()
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../../static/login/css/style.scss";
  @import "../../../static/login/css/font-awesome.min.scss";
</style>
