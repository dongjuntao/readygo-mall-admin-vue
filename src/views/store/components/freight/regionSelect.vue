<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close="close"
    :visible.sync="visible" append-to-body>

    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in cities" :label="city" :key="city" :disabled="otherCheckedCities.includes(city)" class="el-checkbox-width">
        {{city.split(":")[1]}}
      </el-checkbox>
    </el-checkbox-group>


    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" @close="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const cityOptions = [];
import { getRegionList } from '@/api/mall-admin/mall-region'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0
      },
      rowIndex:-1,
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: false,
      otherCheckedCities: [], //除了自己已选择的，其他已选择的
      type: null //选择的类型（0:运费规则表，1:包邮规则表）
    };
  },
  methods: {
    close(){
      this.cities=[]
    },
    async init(index, checkedCities,otherCheckedCities,type) {
      this.type = type;
      this.otherCheckedCities = otherCheckedCities;
      this.checkedCities=[]
      this.rowIndex = index;
      this.visible = true;
      await this.getProvinceData();
      if (checkedCities){
        this.checkedCities=checkedCities;
        this.isIndeterminate = this.checkedCities.length > 0 && this.checkedCities.length < this.cities.length;
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities=[]
      this.cities.forEach(city=>{
        this.checkedCities.push(city)
      });
      this.checkedCities = val ? this.checkedCities : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },

    async getProvinceData() {
      var params = this.axios.paramsHandler({parent_id: 0},false)
      await getRegionList(params).then(({data}) => {
        if (data && data.code === "200") {
          data.data.forEach(region=>{
            this.cities.push(region.id+":"+region.name);
          });
        }
      })
    },

    // 表单提交
    dataFormSubmit () {
      this.$emit('setRegionSelect', this.rowIndex, this.checkedCities, this.type);
      this.cities=[];
      this.visible = false
    }
  }
};
</script>
<style lang="scss" scoped>
.el-checkbox-width{
  width: 100px;
  height: 25px;
}
</style>
