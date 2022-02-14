<template>
  <div class="mod-brand-category">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="规格名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" v-if="isAuth('goods-specifications-search')">查询</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()" v-if="isAuth('goods-specifications-create')">新增</el-button>
        <el-button  type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-if="isAuth('goods-specifications-batchDelete')">批量删除</el-button>
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
        prop="name"
        header-align="center"
        align="center"
        label="规格名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="valueList"
        header-align="center"
        align="center"
        label="规格值">
      </el-table-column>
      <el-table-column
        v-if="userType === 0"
        prop="merchantName"
        header-align="center"
        align="center"
        label="所属店铺"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="150"
        label="创建时间">
        <template  slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)" v-if="isAuth('goods-specifications-update')">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="isAuth('goods-specifications-delete')">删除</el-button>
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
import AddOrUpdate from './specifications-add-or-update'
import { getGoodsSpecificationsList,deleteGoodsSpecifications } from '@/api/mall-goods/goods-specifications'
import { getUserInfo } from '@/utils/auth'

export default {
  data () {
    return {
      dataForm: {
        name: ''
      },
      userType: null,
      userId: null,
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
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
        adminUserId: this.userType===0 ? null : this.userId
      })

      getGoodsSpecificationsList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.dataList = data.data.list
          if (this.dataList && this.dataList.length>0) {
            for (var i=0; i<this.dataList.length; i++) {
              var goodsSpecificationsDetailEntityList = this.dataList[i].goodsSpecificationsDetailEntityList;
              var value = '';
              for (var j=0; j<goodsSpecificationsDetailEntityList.length; j++) {
                value += "【"+goodsSpecificationsDetailEntityList[j].value+"】";
              }
              this.dataList[i].valueList = value;
            }
          }
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
        deleteGoodsSpecifications(deleteData).then(({data}) => {
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

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userType = userInfo.userType;
      this.userId = userInfo.userId;
      console.log("this.userType==", this.userType)
      console.log("this.userId==", this.userId)
    },
  }
}
</script>
