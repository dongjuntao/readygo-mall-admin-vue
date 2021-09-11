<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="品牌分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类描述" prop="remark">
        <el-input v-model="dataForm.description" placeholder="品牌分类描述"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getCategoryById,saveCategory,updateCategory } from '@/api/mall-brand/brand-category'

export default {
  data () {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: 0,
        name: '',
        description: ''
      },
      dataRule: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          var params = this.axios.paramsHandler({id: this.dataForm.id});
          getCategoryById(params).then(({data}) => {
            if (data && data.code === "200") {
              console.log()
              this.dataForm.id = data.data.id
              this.dataForm.name = data.data.name
              this.dataForm.description = data.data.description
            }
          })
        }else {
          //清空输入框
          this.dataForm.name = ""
          this.dataForm.description = ""
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = this.axios.dataHandler({
            'id': this.dataForm.id || undefined,
            'name': this.dataForm.name,
            'description': this.dataForm.description
          })
          var saveOrUpdate =  this.dataForm.id ? updateCategory : saveCategory;
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
