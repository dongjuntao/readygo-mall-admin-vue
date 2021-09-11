<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item label="公司全称">
        <el-input v-model="searchForm.name" placeholder="公司全称" clearable></el-input>
      </el-form-item>
      <el-form-item label="公司简称">
        <el-input v-model="searchForm.abbreviation" placeholder="公司简称" clearable></el-input>
      </el-form-item>
      <el-form-item label="公司编码">
        <el-input v-model="searchForm.code" placeholder="公司编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="公司全称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="abbreviation"
        header-align="center"
        align="center"
        label="公司简称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="code"
        header-align="center"
        align="center"
        label="公司编码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="公司网址"
        width="400">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="是否启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" @change="changeEnable(scope.row.id, scope.row.enable)"></el-switch>
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
  </div>
</template>

<script>
import { getListWithExpressSetting } from '@/api/mall-logistics-company'
import { getUserInfo } from '@/utils/auth'
import { saveExpressSetting, deleteExpressSetting } from '@/api/mall-expressSetting'
export default {
  data () {
    return {
      searchForm: {
        name:'',
        abbreviation: '',
        code: ''
      },
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      userType: 1,
      adminUserId: null,
      auditStatus: 1,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  components: {
  },
  activated () {
    this.getUserInfo()
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.searchForm.name,
        abbreviation: this.searchForm.abbreviation,
        code: this.searchForm.code,
        adminUserId: this.adminUserId
      })
      getListWithExpressSetting(params).then(({data})=> {
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

    changeEnable(id, enable) {
      var data = this.axios.dataHandler({
        adminUserId: this.adminUserId,
        logisticsCompanyId: id,
        enable: true
      });
      //开启
      if (enable) {
        saveExpressSetting(data).then(({data}) => {
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
      } else { //关闭
        var params = this.axios.paramsHandler({
          adminUserId: this.adminUserId,
          logisticsCompanyId: id
        });
        deleteExpressSetting(params).then(({data})=>{
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
      }
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
