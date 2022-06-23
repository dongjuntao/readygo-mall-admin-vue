<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close='closeDialog'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="支付名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="支付名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="logo">
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
      <el-form-item label="支付类型" prop="type">
        <el-select v-model="dataForm.type" filterable placeholder="请选择">
          <el-option value="ALI_PAY">ALI_PAY</el-option>
          <el-option value="WECHAT_PAY">WECHAT_PAY</el-option>
        </el-select>
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
  import { getPayTypeById, savePayType, updatePayType } from "@/api/mall-admin/mall-pay-type";
  import { payConstant } from "../../utils/constant";
  import {  fileUpload, fileDelete } from '@/api/mall-file/file'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          name: '',
          logo: '',
          description: '',
          enable: 0
        },
        dataRule: {
          name: [
            { required: true, message: '支付名称', trigger: 'blur' }
          ],
          logo: [
            { required: true, message: '请上传图标', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择支付类型', trigger: 'blur' }
          ]
        },
        fileList:[]
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            getPayTypeById(this.axios.paramsHandler({id: this.dataForm.id})).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm.name = data.data.name
                this.dataForm.description = data.data.description
                this.dataForm.type = data.data.type
                this.dataForm.enable = data.data.enable
                this.dataForm.logo = data.data.logo
                //logo回显
                if (this.dataForm.logo) {
                  this.fileList.push({
                    name:this.dataForm.logo.substring(this.dataForm.logo.lastIndexOf("/")+20),
                    url:this.dataForm.logo
                  });
                }
              }
            });
          }
        })
      },

      /**
       * 上传前校验文件
       */
      beforeUpload(file){
        const isImg = (file.size / 1024 / 1024) < 3
        if (!isImg) {
          this.$message.error('上传logo图片大小不能超过 3MB!')
        }
        const isType = file.type === "image/png"
        const isType2 = file.type === "image/jpeg"
        if (!isType && !isType2) {
          this.$message.error('上传logo图片格式为png或jpg')
        }
        const fileNum = this.fileList.length<1;
        if (!fileNum) {
          this.$message.error('只能上传一张logo')
        }
        return (isType || isType2) && isImg && fileNum
      },

      //上传图标
      uploadFile(file){
        let formData = new FormData();
        formData.append("files", file.file);
        var params = this.axios.paramsHandler({folderName: payConstant.pay_logo_folder_name })
        fileUpload(formData, params).then(({data}) => {
          this.dataForm.logo = data.data;
          this.fileList.push({
            name:this.dataForm.logo.substring(this.dataForm.logo.lastIndexOf("/")+1),
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
          var params = this.axios.paramsHandler(
            { filePath: file.url, folderName: payConstant.pay_logo_folder_name }
          );
          fileDelete(params).then(({data}) => {
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

      //删除已上传的图标
      handleRemove(file) {
        if (this.fileList && this.fileList.length>0) {
          for (var i=0; i<this.fileList.length; i++) {
            if (file.name === this.fileList[i].name) {
              this.fileList.splice(i,1);
            }
          }
        }
        this.dataForm.logo = null;
      },

      //关闭窗口
      closeDialog() {
        this.fileList = [];
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate = this.dataForm.id ? updatePayType : savePayType;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              logo: this.dataForm.logo,
              description: this.dataForm.description,
              type: this.dataForm.type,
              enable: this.dataForm.enable
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
      }
    }
  }
</script>
<style lang="scss">
.el-upload-list__item.is-ready {
  display: none;
}
</style>
