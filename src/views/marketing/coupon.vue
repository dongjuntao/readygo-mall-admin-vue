<template>
  <div class="mod-user">

    <el-radio-group v-model="couponSelect" style="margin-bottom: 30px;" @change="getDataList">
      <el-radio-button :label="0">全部</el-radio-button>
      <el-radio-button :label="1">待审核</el-radio-button>
      <el-radio-button :label="2">已通过</el-radio-button>
      <el-radio-button :label="3">已拒绝</el-radio-button>
    </el-radio-group>

    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="优惠券名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" v-if="isAuth('marketing-coupon-search')">查询</el-button>
        <el-button v-if="isAuth('marketing-coupon-create')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('marketing-coupon-batchDelete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        label="优惠券名称"
        width="200" :key="2">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="优惠券类型"
        width="95" :key="3">
        <template slot-scope="scope">
          {{scope.row.type == 0 ? '满减券' : '满折券'}}
        </template>
      </el-table-column>

      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="优惠券来源"
        width="250"
        v-if="userType == 0" :key="4">
        <template slot-scope="scope">
          {{scope.row.source == 0 ? '平台' : '商户'+"【"+scope.row.merchantName +"】"}}
        </template>
      </el-table-column>

      <el-table-column
        prop="issueNumber"
        header-align="center"
        align="center"
        label="发行数量"
        width="78" :key="5">
      </el-table-column>

<!--      <el-table-column-->
<!--        prop="restNumber"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="剩余数量"-->
<!--        width="78" :key="6">-->
<!--      </el-table-column>-->

      <el-table-column
        header-align="center"
        align="center"
        width="280"
        label="有效期" :key="7">
        <template slot-scope="scope">
          {{ scope.row.validPeriodStart | formatDateTime }}至{{ scope.row.validPeriodEnd | formatDateTime}}
        </template>
      </el-table-column>

      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="优惠额度"
        width="150"
        v-if="userType != 0" :key="8">
        <template slot-scope="scope">
          {{scope.row.type == 0 ? scope.row.discountAmount+'元' : scope.row.discountAmount+'折'}}
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="状态"
        width="65" :key="9">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeStatus(scope.row.id, scope.row.status)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="审核状态"
        width="80"
        v-if="userType != 0" :key="10">
        <template slot-scope="scope">
          <span v-if="scope.row.authStatus == 0">待审核</span>
          <span v-else-if="scope.row.authStatus == 1">已通过</span>
          <span v-else>已拒绝</span>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="操作" :key="11">
        <template slot-scope="scope">
          <el-button v-if="isAuth('marketing-coupon-receiveDetail')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">领取情况</el-button>
          <el-button v-if="scope.row.authStatus==2 && isAuth('marketing-coupon-opinion')" type="text" size="mini" @click="authOpinionHandle(scope.row.id)" >拒绝原因</el-button>
          <el-button v-if="isAuth('marketing-coupon-update')" type="text" size="mini" @click="addOrUpdateHandle(scope.row.id)" :disabled="userType!=0&&scope.row.authStatus==1">修改</el-button>
          <el-button v-if="isAuth('marketing-coupon-delete')" type="text" size="mini" @click="deleteHandle(scope.row.id)" :disabled="userType!=0&&scope.row.authStatus==1">删除</el-button>
          <el-button v-if="isAuth('marketing-coupon-auth') && userType==0 && scope.row.authStatus==0" type="text" size="mini" @click="authHandle(scope.row.id)">审核</el-button>
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
import AddOrUpdate from './coupon-add-or-update'
import Auth from './coupon-auth'
import AuthOpinion from './coupon-auth-opinion'
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
      adminUserId:0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      authVisible: false,
      couponSelect: 0,
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
      if (this.couponSelect == 0) {
        authStatus = null; //全部
      } else if(this.couponSelect == 1) {
        authStatus = 0; //待审核
      } else if(this.couponSelect == 2) {
        authStatus = 1; //已通过
      } else if(this.couponSelect == 3) {
        authStatus = 2; //已拒绝
      }
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.dataForm.name,
        adminUserId: this.userType == 0 ? null : this.adminUserId,
        authStatus: authStatus
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
      this.adminUserId = userInfo.userId;
    },
  }
}
</script>
