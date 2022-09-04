<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.code" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status"  placeholder="订单状态" clearable>
          <el-option key="UNPAID" value="UNPAID" label="待付款"></el-option>
          <el-option key="PAID" value="PAID" label="已付款"></el-option>
          <el-option key="UNDELIVERED" value="UNDELIVERED" label="待发货"></el-option>
          <el-option key="DELIVERED" value="DELIVERED" label="已发货"></el-option>
          <el-option key="FINISHED" value="FINISHED" label="已完成"></el-option>
          <el-option key="CANCELLED" value="CANCELLED" label="已取消"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" v-if="isAuth('system-admin-search')">查询</el-button>
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
        prop="code"
        header-align="center"
        align="center"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="订单来源"
        :formatter="parseSource">
      </el-table-column>
      <el-table-column
        prop="memberName"
        header-align="center"
        align="center"
        label="买家名称">
      </el-table-column>
      <el-table-column
        prop="merchantName"
        header-align="center"
        align="center"
        label="商家名称">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="订单状态"
        :formatter="parseStatus">
      </el-table-column>
      <el-table-column
        prop="finalPrice"
        header-align="center"
        align="center"
        label="订单金额">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="150"
        label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="80"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="orderDetailHandle(scope.row.code)">查看</el-button>
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
    <order-detail v-if="orderDetailVisible" ref="orderDetail" @refreshDataList="getDataList"></order-detail>
  </div>
</template>

<script>
import OrderDetail from './order-detail'
import { getOrderList } from "../../api/mall-order/order";

export default {
  data () {
    return {
      dataForm: {
        code: '',
        status: ''
      },
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      userType: 0,
      dataListLoading: false,
      dataListSelections: [],
      orderDetailVisible: false
    }
  },
  components: {
    OrderDetail
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      var params = this.axios.paramsHandler({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        code: this.dataForm.code,
        status: this.dataForm.status
      })
      getOrderList(params).then(({data})=> {
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
    orderDetailHandle (code) {
      this.orderDetailVisible = true
      this.$nextTick(() => {
        this.$refs.orderDetail.init(code)
      })
    },

    //数据来源转换
    parseSource(row) {
      if (!row) {
        return null;
      }
      if ( row.source == '0') {
        return "PC端";
      }else if (row.source == '1') {
        return "APP";
      } else if (row.source == '2') {
        return "小程序";
      }
    },
    //订单状态转换
    parseStatus(row) {
      if (!row) {
        return null;
      }
      if (row.status == 'UNPAID') {
        return "待付款";
      } else if (row.status == 'PAID') {
        return "已付款";
      } else if (row.status == 'UNDELIVERED') {
        return "待发货";
      } else if (row.status == 'DELIVERED') {
        return "已发货";
      } else if (row.status == 'FINISHED') {
        return "已完成";
      }else if (row.status == 'CANCELLED') {
        return "已取消";
      }
    }
  }
}
</script>
