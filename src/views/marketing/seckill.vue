<template>
  <div class="mod-user">

    <el-radio-group v-model="seckillConfigSelect" style="margin-bottom: 30px;" @change="getDataList">
      <el-radio-button :label="0">全部</el-radio-button>
      <el-radio-button :label="1">待审核</el-radio-button>
      <el-radio-button :label="2">已通过</el-radio-button>
      <el-radio-button :label="3">已拒绝</el-radio-button>
    </el-radio-group>

    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="秒杀商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" v-if="isAuth('marketing-seckill-search')">查询</el-button>
        <el-button v-if="isAuth('marketing-seckill-create')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('marketing-seckill-batchDelete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      :header-cell-style="{'font-size': '13px','background-color': '#f8f8f9', 'height': '50px','color':'#515a6e'}"
      :cell-style="{'font-size':'13px'}"
      element-loading-text="正在查询中...">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50" :key="1">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="秒杀名称"
        width="400" :key="2">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="200"
        label="秒杀起始日期" :key="3">
        <template slot-scope="scope">
          {{ scope.row.seckillStartDate|formatDate }} - {{ scope.row.seckillEndDate|formatDate }}
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="200"
        label="秒杀起始时间" :key="4">
        <template slot-scope="scope">
          {{ scope.row.seckillStartTime }} - {{ scope.row.seckillEndTime }}
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="状态"
        width="90"
        :formatter="formatAuthStatus">
      </el-table-column>

      <el-table-column
        prop="perLimit"
        header-align="center"
        align="center"
        label="限购"
        width="78" :key="6">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="操作" :key="7">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="apply(scope.row.id)"
                     v-if="scope.row.authStatus == 'NEW_CREATED'
                     ||scope.row.authStatus == 'AUDIT_FAILED'
                     || scope.row.authStatus == 'CANCELED'">秒杀申请</el-button>
          <el-button v-if="isAuth('marketing-seckill-auth') && userType==0 && scope.row.authStatus=='AUDIT'"
                     type="text" size="mini" @click="authHandle(scope.row.id)">审核</el-button>
          <el-button v-if="isAuth('marketing-seckill-update') && scope.row.authStatus !== 'AUDIT_SUCCESS'"
                     type="text" size="mini"
                     @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('marketing-seckill-delete') && scope.row.authStatus !== 'AUDIT_SUCCESS'"
                     type="text" size="mini"
                     @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.authStatus=='AUDIT_FAILED' && isAuth('marketing-seckill-opinion')"
                     type="text" size="mini" @click="authOpinionHandle(scope.row.id)" >拒绝原因</el-button>
          <el-button v-if="scope.row.authStatus=='AUDIT_SUCCESS'"
                     type="text" size="mini" @click="cancelHandle(scope.row.id)" >取消</el-button>
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
    <!-- 弹窗, 审核 -->
    <auth v-if="authVisible" ref="auth" @refreshDataList="getDataList"></auth>
    <!-- 弹窗, 拒绝原因 -->
    <auth-opinion v-if="authOpinionVisible" ref="authOpinion" @refreshDataList="getDataList"></auth-opinion>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import AddOrUpdate from './seckill-add-or-update'
import Auth from './seckill-auth'
import AuthOpinion from './seckill-auth-opinion'
import { getSeckillConfigList, deleteSeckillConfig, apply,cancel } from '@/api/mall-seckill/seckill-config'

export default {
  data () {
    return {
      dataForm: {
        name: ''
      },
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      userType: 0,
      adminUserId:0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      authVisible: false,
      seckillConfigSelect: 0,
      authOpinionVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Auth,
    AuthOpinion
  },
  activated () {
    this.getUserInfo();
    this.getDataList();
  },

  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      var authStatus;
      if (this.seckillConfigSelect == 0) {
        authStatus = null; //全部
      } else if(this.seckillConfigSelect == 1) {
        authStatus = "AUDIT"; //待审核
      } else if(this.seckillConfigSelect == 2) {
        authStatus = "AUDIT_SUCCESS"; //已通过
      } else if(this.seckillConfigSelect == 3) {
        authStatus = "AUDIT_FAILED"; //已拒绝
      }
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.dataForm.name,
        adminUserId: this.userType == 0 ? null : this.adminUserId,
        authStatus: authStatus
      })
      getSeckillConfigList(params).then(({data})=> {
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

    //秒杀申请
    apply(id) {
        var data = this.axios.paramsHandler({
          seckillConfigId: id
        });
        apply(data).then(({data}) => {
          if (data && data.code === "200") {
            this.$message({
              message: '申请成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        });
    },
    // 审核
    authHandle (id, type) {
      this.authVisible = true
      this.$nextTick(() => {
        this.$refs.auth.init(id, type)
      })
    },

    // 拒绝原因
    authOpinionHandle (id, type) {
      this.authOpinionVisible = true
      this.$nextTick(() => {
        this.$refs.authOpinion.init(id, type)
      })
    },

    // 删除
    deleteHandle (id) {
      var seckillConfigIds = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${seckillConfigIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var postData = this.axios.dataHandler(seckillConfigIds, false);
        deleteSeckillConfig(postData).then(({data})=>{
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


    // 取消（即下架该活动）
    cancelHandle (id) {
      this.$confirm(`确定取消秒杀？取消后，再次申请，需要重新审核！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = this.axios.paramsHandler({
          seckillConfigId: id
        });
        cancel(data).then(({data})=>{
          if (data && data.code === "200") {
            this.$message({
              message: '取消成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        });
      }).catch(() => {})
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userType = userInfo.userType;
      this.adminUserId = userInfo.userId;
    },

    /**
     * 数据转换
     * @param row
     * @returns {string}
     */
    formatAuthStatus(row) {
      if (!row || !row.authStatus) {
        return '';
      } else if (row.authStatus === 'NEW_CREATED'){
        return '新创建'
      } else if (row.authStatus === 'AUDIT'){
        return '待审核'
      } else if (row.authStatus === 'AUDIT_FAILED'){
        return '审核不通过'
      } else if (row.authStatus === 'AUDIT_SUCCESS'){
        return '审核通过'
      } else if (row.authStatus === 'CANCELED'){
        return '已取消'
      }
    }
  }
}
</script>
