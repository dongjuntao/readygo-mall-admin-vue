<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="所属店铺" prop="adminUserId" v-if="userType == 0">
        <el-select v-model="dataForm.adminUserId" clearable placeholder="请选择所属店铺">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="规格名称"></el-input>
      </el-form-item>
      <el-form-item label="规格描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="规格描述"></el-input>
      </el-form-item>

      <el-form-item label="规格值">
        <el-button type="primary" plain @click="addHandle">新增+</el-button>
      </el-form-item>
      <el-table
        :data="dataForm.goodsSpecificationsDetailEntityList"
        border
        @selection-change=""
        style="width: 100%;">
        <el-table-column
          header-align="center"
          align="center"
          label="规格值"
          width="400">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" placeholder="请输入规格值" ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="enable"
          header-align="center"
          align="center"
          width="150"
          label="是否启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandle(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getGoodsSpecificationsById,saveGoodsSpecifications,updateGoodsSpecifications } from '@/api/mall-goods/goods-specifications'
import { fileUpload, fileDelete } from '@/api/mall-file/file'
import { goodsConstant } from '@/utils/constant';
import { getUserInfo } from '@/utils/auth'
import { getAdminListAll } from '@/api/mall-admin/mall-admin'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        description: '',
        adminUserId: null,
        goodsSpecificationsDetailEntityList: [],
      },
      userType: null,
      merchantList: [], //所属商户
      dataRule: {
        name: [
          { required: true, message: '规格名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getMerchantList();
    this.getUserInfo();
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          var params = this.axios.paramsHandler({id: this.dataForm.id});
          getGoodsSpecificationsById(params).then(({data}) => {
            if (data && data.code === "200") {
              console.log("data.data==",data.data)
              this.dataForm.id = data.data.id
              this.dataForm.name = data.data.name
              this.dataForm.description = data.data.description
              this.dataForm.adminUserId = data.data.adminUserId;
              this.dataForm.goodsSpecificationsDetailEntityList = data.data.goodsSpecificationsDetailEntityList
            }
          })
        }else {
          //清空输入框
          this.dataForm.id = 0
          this.dataForm.name = ''
          this.dataForm.description = ''
          this.dataForm.adminUserId = null
          this.dataForm.goodsSpecificationsDetailEntityList = []
        }
      })
    },

    /**
     * 新增行
     */
    addHandle() {
      var goodsSpecificationsDetail = {
        goodsSpecificationsId: 0,
        value: '',
        enable: true
      }
      this.dataForm.goodsSpecificationsDetailEntityList.push(goodsSpecificationsDetail);
    },
    /**
     * 移除行
     * @param index
     */
    deleteHandle(index) {
      this.dataForm.goodsSpecificationsDetailEntityList.splice(index,1);
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userType = userInfo.userType;
      this.dataForm.adminUserId = userInfo.userId;
    },

    //获取所有商户列表（userType=1,auditStatus=1）
    getMerchantList(){
      var params =  this.axios.paramsHandler({userType: 1, authStatus: 1},false)
      getAdminListAll(params).then(({data}) => {
        if (data && data.code === "200") {
          this.merchantList = data.data
        }
      })
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = this.axios.dataHandler({
            id: this.dataForm.id || undefined,
            name: this.dataForm.name,
            description: this.dataForm.description,
            adminUserId: this.dataForm.adminUserId,
            goodsSpecificationsDetailEntityList: this.dataForm.goodsSpecificationsDetailEntityList
          })
          var saveOrUpdate =  this.dataForm.id ? updateGoodsSpecifications : saveGoodsSpecifications;
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
          })
        }
      })
    }
  }
}
</script>
