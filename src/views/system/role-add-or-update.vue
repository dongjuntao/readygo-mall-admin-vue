<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          show-checkbox
          default-expand-all
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuListTree">
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import { getMenuList } from '@/api/mall-menu'
  import { getRoleInfo, saveRole, updateRole } from '@/api/mall-role'
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
          remark: ''
        },
        dataRule: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        var params = this.axios.paramsHandler();
        getMenuList(params).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'id')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(() => {
          if (this.dataForm.id) {
            getRoleInfo(this.dataForm.id).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm.name = data.data.name
                this.dataForm.remark = data.data.remark
                let that = this
                data.data.menuIdList.forEach(value => {
                  that.$refs.menuListTree.setChecked(value, true, false);
                });
              }
            })
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
              remark: this.dataForm.remark,
              menuIdList: [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys())
            })
            var saveOrUpdate =  this.dataForm.id ? updateRole : saveRole;
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
