<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="公司全称" prop="name">
        <el-input v-model="dataForm.name" placeholder="物流公司全称"></el-input>
      </el-form-item>
      <el-form-item label="公司简称" prop="abbreviation">
        <el-input v-model="dataForm.abbreviation" placeholder="物流公司简称"></el-input>
      </el-form-item>
      <el-form-item label="公司编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="物流公司编码"></el-input>
      </el-form-item>
      <el-form-item label="公司网址" prop="url">
        <el-input v-model="dataForm.url" placeholder="物流公司网址"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { select } from '@/api/mall-role'
  import { getLogisticsCompanyById, saveLogisticsCompany, updateLogisticsCompany } from '@/api/mall-logistics-company'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          name: '',
          abbreviation: '',
          code: '',
          url: '',
          orderNum: null
        },
        dataRule: {
          name: [
            { required: true, message: '公司全称不能为空', trigger: 'blur' }
          ],
          abbreviation: [
            { required: true, message: '公司简称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '公司编码', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '公司网址', trigger: 'blur' }
          ]
        }
      }
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
            getLogisticsCompanyById(this.axios.paramsHandler({id: this.dataForm.id})).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm.name = data.data.name
                this.dataForm.abbreviation = data.data.abbreviation
                this.dataForm.code = data.data.code
                this.dataForm.url = data.data.url
                this.dataForm.orderNum = data.data.orderNum
              }
            });
          }
        });
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate = this.dataForm.id ? updateLogisticsCompany : saveLogisticsCompany;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              abbreviation: this.dataForm.abbreviation,
              code: this.dataForm.code,
              url: this.dataForm.url,
              orderNum: this.dataForm.orderNum
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
