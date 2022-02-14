<template>
  <div class="mod-system-region">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getRegionData()">
      <el-form-item>
        <el-input v-model="name" clearable class="region-search-input" placeholder="请输入地区名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="isAuth('logistics-region-create')" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-tree :data="dataList"
             node-key="id"
             :filter-node-method="filterNode"
             ref="tree"
             :props="props"
             :expand-on-click-node="false">

      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}（{{data.code}}）</span>
        <span>
          <el-button v-if="isAuth('logistics-region-update')"
                     type="text"
                     icon="el-icon-edit" size="small" @click="() => addOrUpdateHandle(data.id)">
            修改
          </el-button>
          <el-button v-if="isAuth('logistics-region-delete')"
                     type="text"
                     icon="el-icon-delete" size="small" @click="() => deleteHandle(data.id)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getRegionData"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './region-add-or-update'
import { getRegionList, deleteRegion } from '@/api/mall-admin/mall-region'
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      name: '',
      props: {
        id: 'id',
        label: 'name',
        children: 'children'
      }
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    //获取所有的地区数据
    this.getRegionData()
  },
  watch: {
    name (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 获取数据列表
    //获取（初始化）省份信息
    getRegionData() {
      this.dataListLoading = true
      var params =  this.axios.paramsHandler(null,false)
      getRegionList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.dataList = treeDataTranslate(data.data, 'id', 'parentId')
        }
        this.dataListLoading = false
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRegion(this.axios.paramsHandler({id: id})).then(({data}) => {
          if (data && data.code === "200") {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getRegionData()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-system-region {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
.region-search-input {
  width: 100%;
}
</style>
