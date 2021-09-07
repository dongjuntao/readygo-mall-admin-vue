<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item label="发货人姓名">
        <el-input v-model="searchForm.name" placeholder="发货人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="searchForm.mobile" placeholder="手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属商户" prop="adminUserId" v-if="userType == 0">
        <el-select v-model="searchForm.adminUserId" clearable placeholder="请选择">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isAuth('store-shippingInfo-search')" @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('store-shippingInfo-create')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('store-shippingInfo-batchDelete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        label="发货人姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号码"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fixedTelephone"
        header-align="center"
        align="center"
        label="固定电话"
        width="190"
        v-if="userType != 0">
      </el-table-column>
      <el-table-column
        prop="merchant"
        header-align="center"
        align="center"
        label="所属商户"
        width="190"
        v-if="userType == 0">
      </el-table-column>
      <el-table-column
        prop="regionNames"
        header-align="center"
        align="center"
        label="发货地区"
        width="300">
      </el-table-column>
      <el-table-column
        prop="postalCode"
        header-align="center"
        align="center"
        label="邮政编码"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="160"
        label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('store-shippingInfo-setDefault') && !scope.row.isDefault" type="text" size="small" @click="isDefaultHandle(scope.row.id, true)">设为默认</el-button>
          <el-button v-if="isAuth('store-shippingInfo-cancelDefault') && scope.row.isDefault" type="text" style="color: red" size="small" @click="isDefaultHandle(scope.row.id, false)">取消默认</el-button>
          <el-button v-if="isAuth('store-shippingInfo-detail')" type="text" size="small" @click="detailHandle(scope.row.id, 'detail')">详情</el-button>
          <el-button v-if="isAuth('store-shippingInfo-update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('store-shippingInfo-delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 详情-->
    <detail v-if="detailVisible" ref="detail" @refreshDataList="getDataList"></detail>
  </div>
</template>

<script>
import AddOrUpdate from './shippingInfo-add-or-update'
import Detail from './shipping-detail'
import { getShippingInfoList, deleteShippingInfo, updateIsDefault } from '@/api/mall-shipping-info'
import { getUserInfo } from '@/utils/auth'
import { getAdminListAll } from '@/api/mall-admin'
export default {
  data () {
    return {
      searchForm: {
        name: '',
        adminUserId: null,
        mobile: ''
      },
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      userType: null,
      adminUserId: null,
      merchantList:[], //商户列表（userType为1的管理员列表）
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      detailVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Detail
  },
  async activated () {
    await this.getUserInfo();
    await this.getDataList();
    this.getMerchantList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.searchForm.name,
        adminUserId: this.userType == 0 ? (this.searchForm.adminUserId ? this.searchForm.adminUserId : null) : this.adminUserId,
        mobile: this.searchForm.mobile
      })
      getShippingInfoList(params).then(({data})=> {
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

    // 详情
    detailHandle (id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id)
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
        deleteShippingInfo(postData).then(({data})=>{
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
     * 设为默认 1/ 取消默认2
     */
    isDefaultHandle(id, isDefault){
      var params = this.axios.paramsHandler({isDefault: isDefault}, false);
      updateIsDefault(id, params).then(({data}) => {
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

    //获取商户列表（userType=1且auditStatus=1）
    getMerchantList(){
      var params =  this.axios.paramsHandler({userType: 1, auditStatus: 1},false)
      getAdminListAll(params).then(({data}) => {
        if (data && data.code === "200") {
          this.merchantList = data.data
        }
      })
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userType = userInfo.userType;
      this.adminUserId = userInfo.userId;
    }
  }
}
</script>
