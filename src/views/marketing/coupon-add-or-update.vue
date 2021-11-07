<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="优惠券名称"></el-input>
      </el-form-item>
      <el-form-item label="优惠券描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="优惠券描述"></el-input>
      </el-form-item>
      <el-form-item label="优惠券类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="0">满减券</el-radio>
          <el-radio :label="1">满折券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用门槛" prop="useThreshold">
        金额需满
        <el-input-number v-model="dataForm.useThreshold" controls-position="right" size="small" :min="0" :max="999999"></el-input-number>
        元
      </el-form-item>
      <el-form-item label="优惠额度" prop="discountAmount">
        <el-input-number v-model="dataForm.discountAmount" controls-position="right" size="small" :min="0" :max="999999"></el-input-number>
        元
      </el-form-item>
      <el-form-item label="使用范围" prop="useScope">
        <el-radio-group v-model="dataForm.useScope">
          <el-radio :label="0">全部商品</el-radio>
          <el-radio :label="1" v-if="userType != 0">指定商品</el-radio>
          <el-radio :label="1" v-else>指定分类</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="适用会员" prop="applicableMember" v-if="userType == 0">
        <el-checkbox-group v-model="dataForm.applicableMember">
          <el-checkbox label="普通会员"></el-checkbox>
          <el-checkbox label="青铜会员"></el-checkbox>
          <el-checkbox label="白银会员"></el-checkbox>
          <el-checkbox label="黄金会员"></el-checkbox>
          <el-checkbox label="铂金会员"></el-checkbox>
          <el-checkbox label="钻石会员"></el-checkbox>
          <el-checkbox label="最强买家"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发行数量" prop="issueNumber">
        <el-input-number v-model="dataForm.issueNumber" controls-position="right"
                         size="small" :min="0" :max="999999">
        </el-input-number>
      </el-form-item>

      <el-form-item label="有效期" prop="validDateTime">
        <el-date-picker
          v-model="validDateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="限领条件" prop="perLimit">
        每人限领
        <el-input-number v-model="dataForm.perLimit" controls-position="right"
                         size="small" :min="0" :max="999999">
        </el-input-number>
        张
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getUserInfo } from '@/utils/auth'
  import { select } from '@/api/mall-role'
  import { getUserById, saveAdmin, updateAdmin } from '@/api/mall-admin'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        userType: null,
        adminUserId: 0,
        validDateTime: null,
        dataForm: {
          id: 0,
          name: '', //优惠券名称
          description: '', //优惠券描述
          source: 0, //优惠券来源（0：平台；1：商家）
          type: 0, //优惠券类型（0：满减券；1：满折券）
          useThreshold: 0,//使用门槛（满多少钱）可以使用，0为无限制
          discountAmount: 0, //优惠额度（如果是满减券，该字段是减钱数，如果是满折券，该字段是打折数）
          useScope: 0, //使用范围（0：全部商品；1：(如果是平台优惠券，则为指定分类；如果是商家优惠券则为指定商品）
          applicableMember: [], //适用会员（普通会员，青铜会员，白银会员，黄金会员，铂金会员，钻石会员，最强买家）
          issueNumber: 0, //发行数量
          validStartTime: null, //有效起始时间
          validEndTime: null, //有效结束时间
          perLimit: 0, //每人限领多少张
          status: 0 //状态（0：禁用；1：启用）
        },
        dataRule: {
          name: [
            { required: true, message: '优惠券名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.getUserInfo();
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        select(this.axios.paramsHandler()).then(({data})=>{
          this.roleList = data && data.code === "200" ? data.data : []
        }).then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            getUserById(this.axios.paramsHandler({id: this.dataForm.id})).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm.userName = data.data.userName
                this.dataForm.email = data.data.email
                this.dataForm.mobile = data.data.mobile
                this.dataForm.roleIdList = data.data.roleIdList
                this.dataForm.status = data.data.status
              }
            });
          }
        });
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate = this.dataForm.id ? updateAdmin : saveAdmin;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              userName: this.dataForm.userName,
              password: this.dataForm.password,
              email: this.dataForm.email,
              mobile: this.dataForm.mobile,
              status: this.dataForm.status,
              roleIdList: this.dataForm.roleIdList
            })
            saveOrUpdate(data).then(({data}) => {
              if (data && data.code === "200") {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            });
          }
        })
      },

      /**
       * cookie中获取当前登录的用户信息
       */
      getUserInfo() {
        var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
        this.userType = userInfo.userType;
        this.adminUserId = userInfo.userId;
      }
    }
  }
</script>
