<template>
  <div class="mod-user">
    <el-radio-group v-model="merchantSelect" style="margin-bottom: 30px;" @change="getDataList">
      <el-radio-button :label="0">全部</el-radio-button>
      <el-radio-button :label="1">待审核</el-radio-button>
      <el-radio-button :label="2">已通过</el-radio-button>
      <el-radio-button :label="3">已拒绝</el-radio-button>
    </el-radio-group>

    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" v-if="isAuth('merchant-merchant-search')">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" v-if="isAuth('merchant-merchant-create')">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0"
                   v-if="isAuth('merchant-merchant-batchDelete')">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :header-cell-style="{'font-size': '13px','background-color': '#f8f8f9', 'height': '50px','color':'#515a6e'}"
      :cell-style="{'font-size':'13px'}"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="店铺名称"
        width="250">
      </el-table-column>
      <el-table-column header-align="center" align="center" label="商家头像" width="80px;">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="height: 50px; width: 50px;">
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="authStatus"
        header-align="center"
        align="center"
        label="审核状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.authStatus === 0" size="small" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.authStatus === 1" size="small" type="success">已通过</el-tag>
          <el-tag v-else-if="scope.row.authStatus === 2" size="danger">已拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="店铺状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="(!scope.row.authStatus || scope.row.authStatus === 0) && isAuth('merchant-merchant-auth')"
                     type="text" size="small" @click="auditOrDetailHandle(scope.row.id, 'auth')">审核</el-button>
          <el-button v-if="(scope.row.auditStatus === 1 || scope.row.auditStatus === 2) && isAuth('merchant-merchant-detail')"
                     type="text" size="small" @click="auditOrDetailHandle(scope.row.id, 'detail')">详情</el-button>
          <el-button v-if="isAuth('merchant-merchant-update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('merchant-merchant-delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗, 审核 / 详情-->
    <audit-or-detail v-if="auditOrDetailVisible" ref="auditOrDetail" @refreshDataList="getDataList"></audit-or-detail>
  </div>
</template>

<script>
import AddOrUpdate from './merchant-add-or-update'
import AuditOrDetail from './merchant-audit-or-detail'
import { getAdminList, deleteAdmin } from '@/api/mall-admin/mall-admin'
export default {
  data () {
    return {
      dataForm: {
        userName: ''
      },
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      userType: 1,
      merchantType: 0,
      auditStatus: 1,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      auditOrDetailVisible: false,
      merchantSelect: 0
    }
  },
  components: {
    AddOrUpdate,
    AuditOrDetail
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      var authStatus;
      if (this.merchantSelect == 0) {
        authStatus = null; //全部
      } else if(this.merchantSelect == 1) {
        authStatus = 0; //待审核
      } else if(this.merchantSelect == 2) {
        authStatus = 1; //已通过
      } else if(this.merchantSelect == 3) {
        authStatus = 2; //已拒绝
      }
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userName: this.dataForm.userName,
        userType: this.userType, //用户类型:【店铺管理员】
        merchantType: this.merchantType, //店铺类型【入驻店铺】
        authStatus: authStatus //审核状态
      })
      getAdminList(params).then(({data})=> {
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },

    // 审核 / 详情
    auditOrDetailHandle (id, type) {
      this.auditOrDetailVisible = true
      this.$nextTick(() => {
        this.$refs.auditOrDetail.init(id, type)
      })
    },
    // 删除
    deleteHandle (id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var postData = this.axios.dataHandler(userIds, false);
        deleteAdmin(postData).then(({data})=>{
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
    }
  }
}
</script>
