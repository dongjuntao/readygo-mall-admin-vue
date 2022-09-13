<template>
  <el-dialog
    title="拒绝原因"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="拒绝原因" style="font-weight: 500">
        <div>{{dataForm.authOpinion}}</div>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSeckillConfigById } from "@/api/mall-seckill/seckill-config";

export default {
  data () {
    return {
      visible: false,
      userType: null,
      dataForm: {
        id: 0,
        authOpinion: 0 //审核意见(拒绝原因)
      }
    }
  },

  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true;
      this.$nextTick(() => {
        if (this.dataForm.id) {
          getSeckillConfigById(this.axios.paramsHandler({seckillConfigId: this.dataForm.id})).then(({data}) => {
            if (data && data.code === "200") {
              this.dataForm.authOpinion = data.data.authOpinion
            }
          });
        }
      })
    }
  }
}
</script>
