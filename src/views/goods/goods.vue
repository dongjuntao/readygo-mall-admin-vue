<template>
  <div class="mod-goods">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button  type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        label="商品名称"
        width="300">
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
        label="所属品牌">
      </el-table-column>
      <el-table-column
        prop="code"
        header-align="center"
        align="center"
        label="商品编号">
      </el-table-column>

      <el-table-column
        prop="onSale"
        header-align="center"
        align="center"
        label="是否上架">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.onSale" @change="setOnSale(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="150"
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
import AddOrUpdate from './goods-add-or-update'
import { getGoodsList, deleteGoods, updateOnSale } from '@/api/mall-goods/goods'
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
      userType: null
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
      this.dataListLoading = true
      var params =  this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.dataForm.name,
        adminUserId: this.userType == 0 ? null : this.adminUserId
      })
      getGoodsList(params).then(({data}) => {
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
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    },

    //是否上架
    setOnSale(row){
      var goodsId = row.id;
      var onSale = row.onSale;
      var msg = onSale ? '上架' : '下架';
      if (onSale) row.onSale = false; else row.onSale = true;
      this.$confirm('是否确定' + msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = this.axios.paramsHandler({
          goodsId: goodsId,
          onSale: onSale
        });
        updateOnSale(params).then(async ({data}) => {
          if (data && data.code === "200") {
            this.$message({
              message: msg + '成功',
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
