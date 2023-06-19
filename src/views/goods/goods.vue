<template>
  <div class="mod-goods">

    <el-radio-group v-model="goodsStatusSelect" style="margin-bottom: 30px;" @change="getDataList">
      <el-radio-button :label="0">全部</el-radio-button>
      <el-radio-button :label="1">待审核</el-radio-button>
      <el-radio-button :label="2">已上架</el-radio-button>
      <el-radio-button :label="3">已下架</el-radio-button>
    </el-radio-group>

    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" v-if="isAuth('goods-goods-search')">查询</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()" v-if="isAuth('goods-goods-create')">新增</el-button>
        <el-button  type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0"
                    v-if="isAuth('goods-goods-batchDelete')">批量删除</el-button>
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
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="商品名称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="images"
        header-align="center"
        align="center"
        label="商品图片"
        width="100">
        <template slot-scope="scope">
          <img v-if="scope.row.images" style="width: 50px; height: 50px;" :src="scope.row.images.split(',')[0]" >
        </template>
      </el-table-column>
      <el-table-column v-if="userType === 0"
        prop="merchantName"
        header-align="center"
        align="center"
        label="所属商户">
      </el-table-column>
      <el-table-column
        prop="brandName"
        header-align="center"
        align="center"
        width="150"
        label="所属品牌">
      </el-table-column>
      <el-table-column
        prop="code"
        header-align="center"
        align="center"
        width="150"
        label="商品编号">
      </el-table-column>
      <el-table-column
        prop="goodsStatus"
        header-align="center"
        align="center"
        width="80"
        label="商品状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.goodsStatus=='NEW_CREATED'">新创建</el-button>
          <el-button type="text" v-if="scope.row.goodsStatus=='AUDIT'">待审核</el-button>
          <el-button type="text" v-if="scope.row.goodsStatus=='AUDIT_FAILED'">审核失败</el-button>
          <el-button type="text" v-if="scope.row.goodsStatus=='ON_SALE'">已上架</el-button>
          <el-button type="text" v-if="scope.row.goodsStatus=='NOT_ON_SALE'">已下架</el-button>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="applyOnSale(scope.row.id)"
                     v-if="isAuth('goods-goods-apply-on-sale')
                     && (scope.row.goodsStatus == 'NEW_CREATED'
                     ||scope.row.goodsStatus == 'AUDIT_FAILED'
                     || scope.row.goodsStatus == 'NOT_ON_SALE')">申请上架</el-button>
          <el-button type="text" size="small"
                     @click="audit(scope.row.id, true)"
                     v-if="isAuth('goods-goods-pass') && scope.row.goodsStatus == 'AUDIT'">通过</el-button>
          <el-button type="text" size="small"
                     @click="audit(scope.row.id, false)"
                     v-if="isAuth('goods-goods-reject') && scope.row.goodsStatus == 'AUDIT'">拒绝</el-button>
          <el-button type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)"
                     v-if="isAuth('goods-goods-update') && scope.row.goodsStatus !== 'ON_SALE'">修改</el-button>
          <el-button type="text" size="small"
                     @click="deleteHandle(scope.row.id)"
                     v-if="isAuth('goods-goods-delete') && scope.row.goodsStatus !== 'ON_SALE'">删除</el-button>
          <el-button type="text" size="small"
                     @click="offShelf(scope.row.id)"
                     v-if="isAuth('goods-goods-offShelf') && scope.row.goodsStatus === 'ON_SALE'">下架</el-button>
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
import AddOrUpdate from './goods-add-or-update'
import { getGoodsList, deleteGoods, applyOnSale, audit, offShelf } from '@/api/mall-goods/goods'
import { getUserInfo } from '@/utils/auth'
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
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      adminUserId: null,
      userType: null,
      goodsStatusSelect: 0
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
      var goodsStatus;
      if (this.goodsStatusSelect == 0) {
        goodsStatus = null; //全部
      } else if(this.goodsStatusSelect == 1) {
        goodsStatus = 'AUDIT'; //待审核
      } else if(this.goodsStatusSelect == 2) {
        goodsStatus = 'ON_SALE'; //已上架
      } else if(this.goodsStatusSelect == 3) {
        goodsStatus = 'NOT_ON_SALE'; //已下架
      }
      var params =  this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.dataForm.name,
        goodsStatus: goodsStatus,
        adminUserId: this.userType == 0 ? null : this.adminUserId
      })
      getGoodsList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.dataList = data.data.list
          console.log("this.dataList=",this.dataList)
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
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var deleteData = this.axios.dataHandler(ids, false);
        deleteGoods(deleteData).then(({data}) => {
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
            this.$message.error(data.message)
          }
        })
      }).catch(() => {})
    },

    //是否上架
    applyOnSale(goodsId){
      this.$confirm('是否申请上架', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = this.axios.paramsHandler({
          goodsId: goodsId
        });
        applyOnSale(params).then(async ({data}) => {
          if (data && data.code === "200") {
            this.$message({
              message: data.message + '成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }).catch(() => {})
    },

    //上架审核
    audit(goodsId, auditFlag){
      this.$confirm(auditFlag ? '审核通过' : '拒绝通过', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = this.axios.paramsHandler({
          goodsId: goodsId,
          isAudit: auditFlag ? true : false
        });
        audit(params).then(async ({data}) => {
          if (data && data.code === "200") {
            this.$message({
              message: data.message + '成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }).catch(() => {})
    },

    //上架审核
    offShelf(goodsId){
      this.$confirm('商品下架后，重新上架时需再次审核，是否确定下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = this.axios.paramsHandler({
          goodsId: goodsId
        });
        offShelf(params).then(async ({data}) => {
          if (data && data.code === "200") {
            this.$message({
              message: data.message + '成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }).catch(() => {})
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.adminUserId = userInfo.userId;
      this.userType = userInfo.userType;
    }
  }
}
</script>
