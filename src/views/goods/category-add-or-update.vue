<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop="parentName">
        <el-popover
          ref="goodsCategoryListPopover"
          placement="bottom-start"
          trigger="click">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-scrollbar style="height:600px">
            <el-tree
              style="width: 250px;"
              :data="goodsCategoryList"
              :props="goodsCategoryListTreeProps"
              node-key="id"
              ref="goodsCategoryListTree"
              @current-change="goodsCategoryListTreeCurrentChangeHandle"
              :default-expand-all="true"
              :highlight-current="true"
              :expand-on-click-node="false"
              :filter-node-method="filterNode">
            </el-tree>
          </el-scrollbar>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:goodsCategoryListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="分组号" prop="groupNum" v-if="dataForm.parentId == 0">
        <el-input-number v-model="dataForm.groupNum" controls-position="right" :min="0" label="分组号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { select, getGoodsCategoryInfo, saveGoodsCategory, updateGoodsCategory} from '@/api/mall-goods/goods-category'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          parentId: 0,
          parentName: '',
          orderNum: 0,
          groupNum: 0
        },
        dataRule: {
          name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级分类不能为空', trigger: 'change' }
          ]
        },
        goodsCategoryList: [],
        goodsCategoryListTreeProps: {
          label: 'name',
          children: 'children'
        },
        filterText:''
      }
    },
    created () {
    },
    watch: {
      filterText(val) {
        this.$refs.goodsCategoryListTree.filter(val);
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        var params = this.axios.paramsHandler()
        select(params).then(({data}) => {
          this.goodsCategoryList = data.data
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.goodsCategoryListTreeSetCurrentNode()
          } else {
            // 修改
            getGoodsCategoryInfo(this.dataForm.id).then(({data}) => {
              this.dataForm.id = data.data.goodsCategoryEntity.id
              this.dataForm.name = data.data.goodsCategoryEntity.name
              this.dataForm.parentId = data.data.goodsCategoryEntity.parentId
              this.dataForm.orderNum = data.data.goodsCategoryEntity.orderNum
              if (this.dataForm.parentId == 0) {
                this.dataForm.groupNum = data.data.goodsCategoryEntity.groupNum
              }
              this.goodsCategoryListTreeSetCurrentNode()
            })
          }
        })
      },
      // 菜单树选中
      goodsCategoryListTreeCurrentChangeHandle (data, node) {
        console.log("parentId==",data.id)
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      goodsCategoryListTreeSetCurrentNode () {
        this.$refs.goodsCategoryListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.goodsCategoryListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate =  this.dataForm.id ? updateGoodsCategory : saveGoodsCategory;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              parentId: this.dataForm.parentId,
              orderNum: this.dataForm.orderNum,
              groupNum: this.dataForm.parentId==0 ? this.dataForm.groupNum : null
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
      /**
       * 按分类名称模糊搜索分类
       * @param value
       * @param data
       * @returns {boolean}
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    }
  }
</script>

<style lang="scss">
  .mod-goods-category {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
  //去除el-scrollbar下方横向滚动条
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
