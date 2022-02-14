<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="地区名称" prop="name">
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>
      <el-form-item label="地区编码" prop="code">
        <el-input v-model="dataForm.code"></el-input>
      </el-form-item>
      <el-form-item label="上级地区" prop="parentId">
        <el-cascader
          expand-trigger="hover"
          :options="regionList"
          change-on-select
          :props="{ value: 'id',label: 'name',children: 'children'}"
          filterable
          clearable
          v-model="selectedOptions"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false" size="mini">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" size="mini">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import { getRegionById, getRegionList, saveRegion,updateRegion } from '@/api/mall-admin/mall-region'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        name: null,
        code: '',
        parentId: null,
      },
      dataRule: {
        name: [
          { required: true, message: '区域名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '区域编码不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '上级地区不能为空', trigger: 'blur' }
        ]
      },
      regionList: [],
      selectedOptions: []
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.selectedOptions = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          var params =  this.axios.paramsHandler({id: this.dataForm.id},false)
          getRegionById(params).then(({data}) => {
            if (data && data.code === "200") {
              this.dataForm = data.data
              this.selectedOptions.push(this.dataForm.parentId)
            }
          })
        }
        var params2 =  this.axios.paramsHandler(null,false)
        getRegionList(params2).then(({data}) => {
          if (data && data.code === "200") {
            //上级区域不能选择区县，只能选择省、市，所以需要过滤掉区县
            var result = data.data.filter(item=>{return item.regionType != 'area'})
            this.regionList = treeDataTranslate(result, 'id', 'parentId')
          }
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var regionType = '';
          if (this.selectedOptions.length==1){
            regionType = 'city';
          }else if (this.selectedOptions.length==2){
            regionType = 'area';
          }
          var saveOrUpdate =  this.dataForm.id ? updateRegion : saveRegion;
          var data = this.axios.dataHandler({
            id: this.dataForm.id || undefined,
            name: this.dataForm.name,
            code: this.dataForm.code,
            parentId: this.dataForm.parentId,
            regionType: regionType
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
          })


        }
      })
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    }
  }
}
</script>
<style lang="scss">
.el-cascader-menu {
  height: 450px;
}
.el-cascader {
  width: 628px;
}
.el-cascader-menu__wrap {
  height: 500px;
}

</style>
