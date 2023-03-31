<template>

  <el-dialog
    title="领取情况"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="mod-user">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="memberId"
          header-align="center"
          align="center"
          label="会员id">
        </el-table-column>
        <el-table-column
          prop="memberName"
          header-align="center"
          align="center"
          label="会员名称">
        </el-table-column>
        <el-table-column
          prop="useStatus"
          header-align="center"
          :formatter="useStatusFormat"
          align="center"
          label="使用状态">
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="领取时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatDateTime }}
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
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getUserInfo } from '@/utils/auth'
import { getAdminListAll } from '@/api/mall-admin/mall-admin'
import { getCouponReceivedList } from "@/api/mall-coupon/coupon";

export default {
  data () {
    return {
      visible: false,
      isIndeterminate: false,
      checkAll: false,
      userType: null,
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataList: [],
      merchantList: [], //商户列表
      dataForm: {
        id: 0,
        createTime: null
      }
    }
  },
  activated () {
    this.getUserInfo();
    this.getMerchantList();
  },
  methods: {
    // 获取数据列表
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true;
      this.dataListLoading = true;
      this.$nextTick(() => {
        var params = this.axios.paramsHandler({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          couponId: this.dataForm.id
        })
        if (this.dataForm.id) {
          getCouponReceivedList(this.axios.paramsHandler(params)).then(({data}) => {
            if (data && data.code === "200") {
              this.dataList = data.data.list
              this.totalPage = data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          });
        }
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

    useStatusFormat(useStatus) {
      if (useStatus == 0) {
        return "待使用"
      } else if (useStatus == 1) {
        return "已使用"
      } else {
        return "已过期"
      }
    }
  }
}
</script>
