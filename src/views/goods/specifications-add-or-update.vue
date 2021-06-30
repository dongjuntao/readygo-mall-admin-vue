<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
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
          width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" placeholder="请输入规格值" ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="bindImage"
          header-align="center"
          align="center"
          label="绑定图片">
          <template slot-scope="scope">
            <el-upload
              class="avatar-uploader"
              action="#"
              :multiple="false"
              :show-file-list="false"
              :http-request="uploadFile"
              :data="{index: scope.$index}"
              :before-upload="beforeUpload">
              <img style="width: 50px; height: 50px;" v-if="scope.row.bindImage" :src="scope.row.bindImage" class="avatar">
              <i v-else >
                <el-button type="primary" plain>上传图片</el-button>
              </i>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column
          prop="enable"
          header-align="center"
          align="center"
          width="100"
          label="是否启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="100"
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
import { uploadSpecificationBindImage, deleteSpecificationBindImage } from '@/api/mall-goods/file'
import { goodsConstant } from '@/utils/constant';
import { getUserInfo } from '@/utils/auth'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        description: '',
        creatorId: 0,
        creatorName: '',
        goodsSpecificationsDetailEntityList: [],
      },
      dataRule: {
        name: [
          { required: true, message: '规格名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
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
              this.dataForm.id = data.data.id
              this.dataForm.name = data.data.name
              this.dataForm.description = data.data.description
              this.dataForm.creatorId = data.data.creatorId;
              this.dataForm.creatorName = data.data.creatorName;
              this.dataForm.goodsSpecificationsDetailEntityList = data.data.goodsSpecificationsDetailEntityList
            }
          })
        }else {
          //清空输入框
          this.dataForm.id = 0
          this.dataForm.name = ''
          this.dataForm.description = ''
          this.dataForm.creatorId = 0
          this.dataForm.creatorName = ''
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
        bindImage: '',
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
     * 上传前校验文件
     */
    beforeUpload(file){
      const isImg = (file.size / 1024 / 1024) < 3
      if (!isImg) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
      const isType = file.type === "image/png"
      const isType2 = file.type === "image/jpeg"
      if (!isType && !isType2) {
        this.$message.error('上传logo图片格式为png或jpg')
      }
      return (isType || isType2) && isImg
    },

    //上传商品规格绑定图
    uploadFile(file){
      let index = file.data.index;
      let formData = new FormData();
      formData.append("files", file.file);
      var params = this.axios.paramsHandler({ folderName: goodsConstant.goods_specifications_folder_name })
      uploadSpecificationBindImage(formData, params).then(({data}) => {
        this.dataForm.goodsSpecificationsDetailEntityList[index].bindImage = data.data;
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
            creatorId: JSON.parse(getUserInfo()).userId,
            creatorName: JSON.parse(getUserInfo()).name,
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
