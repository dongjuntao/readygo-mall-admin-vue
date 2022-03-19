<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="板块名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
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
        label="板块名称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        label="类型"
        align="center"
        width="250">
      </el-table-column>
      <el-table-column
        prop="secondName"
        header-align="center"
        align="center"
        label="板块二级名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="maxLimit"
        header-align="center"
        align="center"
        label="板块内最大容纳量"
        width="130">
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
          <el-button :disabled="scope.row.type==='seckill'"  type="text" size="small" @click="relatedGoodsHandle(scope.row.id)">关联商品</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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

    <!-- 关联的商品，用于商城前台的商品展示 -->
    <related-goods v-if="relatedGoodsVisible" ref="relatedGoods" @refreshDataList="getDataList"></related-goods>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { getHomepagePlateList, enable } from '@/api/mall-admin/mall-homepage-plate'
import AddOrUpdate from './plate-add-or-update'
import RelatedGoods from './related-goods'

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
      relatedGoodsVisible: false, //关联的商品信息，用于在商城前台
      dataListSelections: []
    }
  },
  components: {
    AddOrUpdate,
    RelatedGoods
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
      getHomepagePlateList(params).then(({data})=> {
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

    //关联商品，用于商城前台商品展示
    relatedGoodsHandle (id) {
      this.relatedGoodsVisible = true
      this.$nextTick(() => {
        this.$refs.relatedGoods.init(id)
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

    /** 启用 禁用 */
    changeEnable(id, en) {
      //开启
      if (en) {
        var params = this.axios.paramsHandler({
          plateId: id,
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
          plateId: id,
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
