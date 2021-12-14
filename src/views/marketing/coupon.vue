<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="优惠券名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('marketing-coupon-create')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('marketing-coupon-batchDelete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
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
        label="优惠券名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="优惠券类型"
        width="100">
        <template slot-scope="scope">
          {{scope.row.type == 0 ? '满减券' : '满折券'}}
        </template>
      </el-table-column>

      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="优惠券来源"
        width="250" v-if="userType == 0">
        <template slot-scope="scope">
          {{scope.row.source == 0 ? '平台' : '商户'+"【"+scope.row.merchantName +"】"}}
        </template>
      </el-table-column>

      <el-table-column
        prop="issueNumber"
        header-align="center"
        align="center"
        label="发行数量"
        width="80">
      </el-table-column>

      <el-table-column
        prop="restNumber"
        header-align="center"
        align="center"
        label="剩余数量"
        width="80">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="298"
        label="有效期">
        <template slot-scope="scope">
          {{scope.row.validStartTime | formatDateTime}}至{{scope.row.validEndTime | formatDateTime}}
        </template>
      </el-table-column>

      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="优惠额度"
        width="150" v-if="userType != 0">
        <template slot-scope="scope">
          {{scope.row.type == 0 ? scope.row.discountAmount+'元' : scope.row.discountAmount+'折'}}
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="状态"
        width="65">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeStatus(scope.row.id, scope.row.status)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('marketing-coupon-update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('marketing-coupon-delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
import { getUserInfo } from '@/utils/auth'
import AddOrUpdate from './coupon-add-or-update'
import { getCouponList, deleteCoupon, updateStatus } from '@/api/mall-coupon/coupon'
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
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      auditOrDetailVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getUserInfo();
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.dataForm.name,
        adminUserId: this.userType == 0 ? null : this.adminUserId
      })
      getCouponList(params).then(({data})=> {
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
      var couponIds = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${couponIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var postData = this.axios.dataHandler(couponIds, false);
        deleteCoupon(postData).then(({data})=>{
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
     * 修改启停状态
     */
    changeStatus(id, status) {
      var data = this.axios.paramsHandler({
        couponId: id,
        status: status
      });
      updateStatus(data).then(({data}) => {
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
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userType = userInfo.userType;
    },
  }
}
</script>
