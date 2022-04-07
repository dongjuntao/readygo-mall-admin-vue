<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="板块名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="板块名称"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input disabled v-model="dataForm.type" placeholder="类型"></el-input>
      </el-form-item>
      <el-form-item label="板块二级名称" prop="secondName">
        <el-input v-model="dataForm.secondName" placeholder="板块二级名称"></el-input>
      </el-form-item>
      <el-form-item label="板块背景色" prop="bgColor">
        <el-color-picker v-model="dataForm.bgColor" placeholder="板块背景色"></el-color-picker>
      </el-form-item>
      <el-form-item label="最大容纳商品量" prop="maxLimit">
        <el-input-number v-model="dataForm.maxLimit" controls-position="right" size="small" :min="0" :max="999999"></el-input-number>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
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
  import { getHomepagePlateById, saveHomepagePlate, updateHomepagePlate } from '@/api/mall-admin/mall-homepage-plate'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '', //板块名称
          type: '', //类型
          secondName: '', //板块二级名称
          bgColor: '', //板块背景色
          maxLimit: null,//最大容纳商品量
          enable: false //状态（false：禁用；true：启用）
        },
        dataRule: {
          name: [
            { required: true, message: '板块名称', trigger: 'blur' }
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
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();//清空选择框
          if (this.dataForm.id) {
            getHomepagePlateById(this.axios.paramsHandler({homepagePlateId: this.dataForm.id})).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm = data.data
              }
            });
          }
        })
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate = this.dataForm.id ? updateHomepagePlate : saveHomepagePlate;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              type: this.dataForm.type,
              secondName: this.dataForm.secondName,
              bgColor: this.dataForm.bgColor,
              maxLimit: this.dataForm.maxLimit,
              enable: this.dataForm.enable,
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
                this.$message.error(data.message)
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
        if(this.userType != 0) {
          this.dataForm.source = 1;
        }
        //如果是商户管理员，设置默认的商户管理员id,如果是平台管理员，无需设置
        if (this.userType != 0) {
          this.dataForm.adminUserId = userInfo.userId;
        }
      }

    }
  }
</script>
