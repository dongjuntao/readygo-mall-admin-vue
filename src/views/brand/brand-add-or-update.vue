<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close='closeDialog'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="品牌描述"></el-input>
      </el-form-item>
      <el-form-item label="品牌logo" prop="logo">
        <el-upload
          v-model="dataForm.logo"
          action="#"
          list-type="picture"
          :multiple="false"
          :show-file-list="true"
          :file-list="fileList"
          :http-request="uploadFile"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :before-remove="beforeRemove">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3MB</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="品牌分类" prop="brandCategoryId">
        <el-select v-model="dataForm.brandCategoryId" placeholder="品牌分类">
          <el-option
            v-for="item in brandCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
import { getBrandById, saveBrand, updateBrand } from '@/api/mall-brand/brand'
import { getBrandCategoryListAll } from '@/api/mall-brand/brand-category'
import {  uploadLogo, deleteLogo } from '@/api/mall-brand/file'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        description: '',
        logo: '',
        brandCategoryId: null,
        enable: true
      },
      dataRule: {
        name: [
          { required: true, message: '品牌名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '品牌描述不能为空', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传品牌logo', trigger: 'blur' }
        ],
        brandCategoryId: [
          { required: true, message: '请选择品牌分类', trigger: 'blur' }
        ]
      },
      tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      fileList:[],
      brandCategoryList: []//所有品牌分类
    }
  },

  mounted() {
    this.brandCategoryListAll();
  },

  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          var params = this.axios.paramsHandler({id: this.dataForm.id});
          getBrandById(params).then(({data}) => {
            if (data && data.code === "200") {
              this.dataForm.id = data.data.id
              this.dataForm.name = data.data.name
              this.dataForm.description = data.data.description
              this.dataForm.logo = data.data.logo
              this.dataForm.brandCategoryId = data.data.brandCategoryId
              this.dataForm.enable = data.data.enable
              //logo回显
              if (this.dataForm.logo) {
                this.fileList.push({
                  name:this.dataForm.logo.substring(this.dataForm.logo.lastIndexOf("/")+20),
                  url:this.dataForm.logo
                });
              }
            }
          })
        }
      })
    },
    //关闭窗口
    closeDialog() {
      this.fileList = [];
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = this.axios.dataHandler({
            id: this.dataForm.id || undefined,
            name: this.dataForm.name,
            description: this.dataForm.description,
            logo: this.dataForm.logo,
            brandCategoryId: this.dataForm.brandCategoryId,
            enable: this.dataForm.enable
          })
          var saveOrUpdate =  this.dataForm.id ? updateBrand : saveBrand;
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
    },
    /**
     * 获取所有品牌分类列表
     */
    brandCategoryListAll() {
      getBrandCategoryListAll().then(({data}) => {
        this.brandCategoryList = data.data;
      })
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
      console.log("this.fileList.length == ",this.fileList.length)
      const fileNum = this.fileList.length<1;
      if (!fileNum) {
        this.$message.error('只能上传一张logo')
      }
      return (isType || isType2) && isImg && fileNum
    },

    //上传文件
    uploadFile(file){
      let formData = new FormData();
      formData.append("file", file.file);
      uploadLogo(formData).then(({data}) => {
        this.dataForm.logo = data.data;
        this.fileList.push({
          name:this.dataForm.logo.substring(this.dataForm.logo.lastIndexOf("/")),
          url:this.dataForm.logo
        });
      })
    },
    /**
     * 删除前确认
     * @param file
     * @returns {Promise<MessageBoxData>}
     */
    beforeRemove(file) {
      return this.$confirm("此操作将永久删除该图片，需要重新上传，是否继续?", "系统提示",{
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        var params = this.axios.paramsHandler({filePath: file.url});
        deleteLogo(params).then(({data}) => {
          if (data && data.code === "200") {
            this.$message({
              type: "success",
              message: "删除成功"
            });
          } else {
            this.$message.error("删除失败")
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除!"
        });
        reject();
      });
    },

    //删除已上传的logo
    handleRemove(file) {
      console.log("file ==handleRemove= ",file)
      if (this.fileList && this.fileList.length>0) {
        for (var i=0; i<this.fileList.length; i++) {
         if (file.name === this.fileList[i].name) {
           this.fileList.splice(i,1);
         }
        }
      }
      this.dataForm.logo = null;
    }
  }
}
</script>
