<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="导航栏名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
      :header-cell-style="{'font-size': '13px','background-color': '#f8f8f9', 'height': '50px','color':'#515a6e'}"
      :cell-style="{'font-size':'13px'}">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="导航栏名称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="linkUrl"
        header-align="center"
        align="center"
        label="链接地址"
        width="350">
      </el-table-column>
      <el-table-column
        prop="sortNum"
        header-align="center"
        align="center"
        label="排序"
        width="150">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="是否启用"
        width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" @change="changeEnable(scope.row.id, scope.row.enable)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import AddOrUpdate from './navbar-add-or-update'
import { getHomepageNavbarList, enable, deleteHomepageNavbar } from '@/api/mall-admin/mall-homepage-navbar'

export default {
  data () {
    return {
      searchForm: {
        name:''
      },
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataListSelections: [],
    }
  },
  components: {
    AddOrUpdate,
  },
  activated () {
    // this.getUserInfo()
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.searchForm.name
      })
      getHomepageNavbarList(params).then(({data})=> {
        if (data && data.code === "200") {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },

    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNum = val
      this.getDataList()
    },

    /** 启用 禁用 */
    changeEnable(id, en) {
      //开启
      if (en) {
        var params = this.axios.paramsHandler({
          navbarId: id,
          enable: true
        });
        enable(params).then(({data}) => {
          if (data && data.code === "200") {
            this.$message({
              message: '启用成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        });
      } else { //关闭
        var params = this.axios.paramsHandler({
          navbarId: id,
          enable: false
        });
        enable(params).then(({data})=>{
          if (data && data.code === "200") {
            this.$message({
              message: '禁用成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        });
      }
    },

    // 删除
    deleteHandle (id) {
      var navbarIds = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${navbarIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var postData = this.axios.dataHandler(navbarIds, false);
        deleteHomepageNavbar(postData).then(({data})=>{
          if (data && data.code === "200") {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        });
      }).catch(() => {})
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.adminUserId = userInfo.userId;
    }

  }
}
</script>
