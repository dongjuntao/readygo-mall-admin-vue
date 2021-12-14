<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="1100px"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="模板名称"></el-input>
      </el-form-item>
      <el-form-item label="模板类型" prop="type">
        <el-radio-group v-model="dataForm.type" @change="changeType(dataForm.type)">
          <el-radio :label="0">买家承担运费</el-radio>
          <el-radio :label="1">卖家承担运费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计费方式" prop="chargeType" v-if="dataForm.type==0">
        <el-radio-group v-model="dataForm.chargeType">
          <el-radio :label="0">按件数</el-radio>
          <el-radio :label="1">按重量</el-radio>
          <el-radio :label="2">按体积</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--运费规则表格-->
      <el-form-item v-if="dataForm.type==0">
        <el-table :data="dataForm.freightRuleEntityList" border style="width: 100%;float: right" class="table-con">
          <el-table-column header-align="center" align="center" label="设置配送区域">
            <template slot-scope="scope">
              <span v-if="!scope.row.cityList || scope.row.cityList.length==0">请选择配送区域</span>
              <span>
                <el-tag type="danger" v-for="city in scope.row.cityList" :key="city">{{city.split(":")[1]}}</el-tag>
              </span>
              <el-button type="text" size="small" @click="regionSelectHandle(scope.$index,'freightRule')">
                编辑
              </el-button>
              <el-button type="text" size="small" @click="deleteFreightRule(`${scope.$index}`)">
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" width="140" :label="tableTitle[0]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightRuleEntityList.${scope.$index}.first`">
                <el-input-number v-model="scope.row.first" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center"  width="140" :label="tableTitle[1]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightRuleEntityList.${scope.$index}.firstFreight`">
                <el-input-number v-model="scope.row.firstFreight" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" width="140" :label="tableTitle[2]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightRuleEntityList.${scope.$index}.continuation`">
                <el-input-number v-model="scope.row.continuation" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" width="140" :label="tableTitle[3]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightRuleEntityList.${scope.$index}.continuationFreight`">
                <el-input-number v-model="scope.row.continuationFreight" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-if="dataForm.type==0">
        <el-button type="primary" @click="addFreightRule()">点击添加配送区域和运费</el-button>
      </el-form-item>

      <!--设置指定包邮-->
      <el-form-item label="包邮条件" v-if="dataForm.type==0" prop="enableConditionFree">
        <el-checkbox v-model="dataForm.enableConditionFree" label="设置指定包邮条件"></el-checkbox>
      </el-form-item>
      <el-form-item v-if="dataForm.type==0 && dataForm.enableConditionFree">
        <el-table :data="dataForm.freightFreeRuleEntityList"
                  border
                  style="width: 100%;">
          <el-table-column header-align="center"
                           align="center"
                           width="400"
                           label="指定包邮区域">
            <template slot-scope="scope">
              <span v-if="!scope.row.cityList || scope.row.cityList.length==0">请选择包邮区域</span>
              <el-tag type="danger" v-for="city in scope.row.cityList" :key="city">{{city.split(":")[1]}}</el-tag>
              <el-button type="text"
                         size="small"
                         @click="regionSelectHandle(scope.$index,'freightFreeRule')">编辑</el-button>
              <el-button type="text"
                         size="small"
                         @click="deleteFreightFreeRule(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" width="280" label="选择包邮条件">
            <template slot-scope="scope">
              <el-select v-model="scope.row.freeCondition" clearable placeholder="请选择包邮条件">
                <el-option
                  v-for="item in freeCondition"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="left" label="设置包邮条件">
            <template slot-scope="scope" >
              <el-form-item v-if="scope.row.freeCondition == 0 || scope.row.freeCondition == 2 || scope.row.freeCondition == 3" :prop="`freightFreeRuleEntityList.${scope.$index}.quantity`">
                <span v-if="scope.row.freeCondition == 3 && (dataForm.chargeType==1||dataForm.chargeType==2)">不满</span>
                <span v-else>满</span>
                <el-input-number v-model="scope.row.quantity"
                                 controls-position="right" size="medium" :min="0" :max="999999">
                </el-input-number>
                <span v-if="dataForm.chargeType == 0">件包邮</span>
                <span v-if="dataForm.chargeType == 1">重量（kg）包邮</span>
                <span v-if="dataForm.chargeType == 2">体积（m³）包邮</span>
              </el-form-item>
              <el-form-item v-if="scope.row.freeCondition == 2">
                或
              </el-form-item>
              <el-form-item v-if="scope.row.freeCondition == 3">
                且
              </el-form-item>
              <el-form-item v-if="scope.row.freeCondition == 1 || scope.row.freeCondition == 2 || scope.row.freeCondition == 3" :prop="`freightFreeRuleEntityList.${scope.$index}.money`">
                满  <el-input-number v-model="scope.row.money"
                                    controls-position="right" size="medium" :min="0" :max="999999">
              </el-input-number> 元包邮
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-if="dataForm.type==0 && dataForm.enableConditionFree">
        <el-button type="primary" @click="addFreightFreeRule()">点击添加指定包邮条件</el-button>
      </el-form-item>

      <el-form-item label="默认运费" v-if="dataForm.type==0" prop="enableDefaultFreight">
        <el-checkbox v-model="dataForm.enableDefaultFreight" label="设置默认运费"></el-checkbox>
        <el-tooltip placement="top"  effect="light">
          <div slot="content">关闭默认运费，则未设置配送区域的城市或不符合指定包邮条件的城市将不支持配送</div>
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="dataForm.type==0 && dataForm.enableDefaultFreight">
        <el-table :data="dataForm.freightDefaultEntityList" border style="width: 100%;float: right" class="table-con">
          <el-table-column header-align="center" align="center" :label="tableTitle[0]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightDefaultEntityList.${scope.$index}.first`">
                <el-input-number v-model="scope.row.first" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="tableTitle[1]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightDefaultEntityList.${scope.$index}.firstFreight`">
                <el-input-number v-model="scope.row.firstFreight" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="tableTitle[2]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightDefaultEntityList.${scope.$index}.continuation`">
                <el-input-number v-model="scope.row.continuation" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="tableTitle[3]">
            <template slot-scope="scope">
              <el-form-item :prop="`freightDefaultEntityList.${scope.$index}.continuationFreight`">
                <el-input-number v-model="scope.row.continuationFreight" controls-position="right"
                                 size="medium" :min="0" :max="999999">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="是否默认" prop="isDefault">
        <el-checkbox v-model="dataForm.isDefault" label="设置为默认模板"></el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <region-select v-if="regionSelectVisible" ref="RegionSelect"  @setRegionSelect="setRegionSelect"></region-select>
  </el-dialog>

</template>

<script>
  import { getRegionList } from '@/api/mall-region'
  import { saveFreightTemplate, updateFreightTemplate, getFreightTemplateById } from '@/api/mall-freight-template'
  import { getUserInfo } from '@/utils/auth'
  import RegionSelect from './regionSelect'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          type: 0,
          chargeType: 0,
          isDefault: false,
          enableDefaultFreight: true, //默认开启默认运费
          enableConditionFree: false,
          freightDefaultEntityList:[{first: 1, firstFreight: 0, continuation:1, continuationFreight:0}], //默认运费
          freightDefaultEntity: {},
          freightRuleEntityList: [{
            cityList:[],
            freightTemplateId: null,
            regionIdNames: '',
            first: 1,
            firstFreight: 0,
            continuation: 1,
            continuationFreight: 0
          }],
          freightFreeRuleEntityList:[{
            cityList: [],
            freightTemplateId: null,
            regionIdNames: '',
            freeCondition: 0,
            money: 0,
            quantity: 0
          }]
        },
        createBy: 0, //创建人id
        dataRule: {
          name: [
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ]
        },
        regionSelectVisible: false
      }
    },
    components: {
      RegionSelect
    },
    created() {
      this.getProvinceData();
      this.getUserInfo();
    },
    computed: {
      tableTitle () {
        var titles = [
          ['首件(个)', '运费(元)', '续件(个)', '续费(元)'],
          ['首重(kg)', '运费(元)', '续重(kg)', '续费(元)'],
          ['首体积(m³)', '运费(元)', '续体积(m³)', '续费(元)']
        ]
        return titles[this.dataForm.chargeType]
      },
      //包邮条件
      freeCondition() {
        var freeCondition = [
          [{id:0, value: '满件数'}, {id:1, value: '满金额'}, {id:2, value: '满件数或满金额'}, {id:3, value: '满件数且满金额'}],
          [{id:0, value: '满重量'}, {id:1, value: '满金额'}, {id:2, value: '满重量或满金额'}, {id:3, value: '不满重量且满金额'}],
          [{id:0, value: '满体积'}, {id:1, value: '满金额'}, {id:2, value: '满体积或满金额'}, {id:3, value: '不满体积且满金额'}]
        ];
        return freeCondition[this.dataForm.chargeType]
      }
    },

    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.$nextTick(()=> {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            getFreightTemplateById(this.axios.paramsHandler({id: this.dataForm.id})).then (({data})=> {
              if (data && data.code === "200") {
                this.dataForm.name = data.data.name;
                this.dataForm.type = data.data.type;
                this.dataForm.chargeType = data.data.chargeType;
                this.dataForm.isDefault = data.data.isDefault;
                this.dataForm.enableDefaultFreight = data.data.enableDefaultFreight; //默认开启默认运费
                this.dataForm.enableConditionFree = data.data.enableConditionFree;
                //默认运费处理（freightDefault）
                this.dataForm.freightDefaultEntityList = [];
                var freightDefaultEntity = data.data.freightDefaultEntity;
                this.dataForm.freightDefaultEntityList.push(freightDefaultEntity);
                //处理运费规则
                this.dataForm.freightRuleEntityList = [];
                data.data.freightRuleEntityList.forEach(freightRule=>{
                  this.dataForm.freightRuleEntityList.push({
                    cityList: freightRule.regionIdNames.split(","),
                    regionIdNames: "",
                    first: freightRule.first,
                    firstFreight: freightRule.firstFreight,
                    continuation: freightRule.continuation,
                    continuationFreight: freightRule.continuationFreight
                  })
                });
                //处理包邮规则
                this.dataForm.freightFreeRuleEntityList = [];
                data.data.freightFreeRuleEntityList.forEach(freightFreeRule=>{
                  this.dataForm.freightFreeRuleEntityList.push({
                    cityList: freightFreeRule.regionIdNames.split(","),
                    regionIdNames: "",
                    freeCondition: freightFreeRule.freeCondition,
                    money: freightFreeRule.money,
                    quantity: freightFreeRule.quantity
                  })
                });
              }
            });
          }else {
            //清除信息
            this.setInitDataList();
          }
        })
      },

      // 添加运费项
      addFreightRule () {
        this.editVisible = true
        this.dataForm.freightRuleEntityList.push({
          cityList: [],
          regionIdNames:'',
          first: 1,
          firstFreight: 0,
          continuation:1,
          continuationFreight:0}
        )
      },
      // 删除运费项
      deleteFreightRule (rowIndex) {
        this.dataForm.freightRuleEntityList.splice(rowIndex, 1)
      },

      // 添加指定包邮条件
      addFreightFreeRule () {
        this.dataForm.freightFreeRuleEntityList.push({
          cityList: [],
          regionIdNames:'',
          freeCondition: 0,
          money: 0,
          quantity: 0 }
        )
      },
      // 删除条件包邮项
      deleteFreightFreeRule (rowIndex) {
        this.dataForm.freightFreeRuleEntityList.splice(rowIndex, 1)
      },

      getProvinceData() {
        var params = this.axios.paramsHandler({parent_id: 0},false)
        getRegionList(params).then(({data}) => {
          if (data && data.code === "200") {
            this.provinceList = data.data;
          }
        })
      },

      // 可配送区域和运费编辑
      regionSelectHandle (rowIndex, editType) {
        this.regionSelectVisible = true
        var otherCheckedCities = [];
        if (editType === 'freightRule'){ //编辑配送区域和运费
          //找出除了自已已选择的，其他已被选择的区域，需设为disable,即区域不可重复选择
          var freightRuleEntityListTemp = [];
          Object.assign(freightRuleEntityListTemp, this.dataForm.freightRuleEntityList);//克隆临时对象
          freightRuleEntityListTemp.splice(rowIndex, 1);
          freightRuleEntityListTemp.forEach(freightRule=>{
            freightRule.cityList.forEach(city=>{
              otherCheckedCities.push(city);
            });
          });
          this.$nextTick(() => {
            this.$refs.RegionSelect.init(rowIndex, this.dataForm.freightRuleEntityList[rowIndex].cityList,otherCheckedCities,0)
          })
        }else if (editType === 'freightFreeRule'){ //编辑包邮区域和包邮条件
          //找出除了自已已选择的，其他已被选择的区域，需设为disable,即区域不可重复选择
          var freightFreeRuleEntityListTemp = [];
          Object.assign(freightFreeRuleEntityListTemp, this.dataForm.freightFreeRuleEntityList);//克隆临时对象
          freightFreeRuleEntityListTemp.splice(rowIndex, 1);
          freightFreeRuleEntityListTemp.forEach(freightRule=>{
            freightRule.cityList.forEach(city=>{
              otherCheckedCities.push(city);
            });
          });
          this.$nextTick(() => {
            this.$refs.RegionSelect.init(rowIndex, this.dataForm.freightFreeRuleEntityList[rowIndex].cityList,otherCheckedCities,1)
          })
        }
      },

      setRegionSelect (row, cityList, type) {
        if (type === 0) {
          this.$set(this.dataForm.freightRuleEntityList[row], 'cityList', cityList)
        }else if (type === 1) {
          this.$set(this.dataForm.freightFreeRuleEntityList[row], 'cityList', cityList)
        }
      },

      //模板类型切换
      changeType(type){
        if (type == 0) {
          this.setInitDataList();
        }
      },

      setInitDataList(){
        this.dataForm.freightDefaultEntityList = [{
          first: 1,
          firstFreight: 0,
          continuation:1,
          continuationFreight:0}];
        this.dataForm.freightRuleEntityList = [{
          cityList:[],
          freightTemplateId: null,
          regionIdNames: '',
          first: 1,
          firstFreight: 0,
          continuation: 1,
          continuationFreight: 0
        }];
        this.dataForm.freightFreeRuleEntityList=[{
          cityList: [],
          freightTemplateId: null,
          regionIdNames: '',
          freeCondition: 0,
          money: 0,
          quantity: 0
        }]
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //区域处理
            this.dataForm.freightRuleEntityList.forEach(freightRule=>{
              freightRule.cityList.forEach(city=>{
                freightRule.regionIdNames += city+","
              });
              if (freightRule.regionIdNames){
                freightRule.regionIdNames = freightRule.regionIdNames.substring(0,freightRule.regionIdNames.length-1)
              }
            });
            this.dataForm.freightFreeRuleEntityList.forEach(freightFreeRule=>{
              freightFreeRule.cityList.forEach(city=>{
                freightFreeRule.regionIdNames += city+",";
              });
              if (freightFreeRule.regionIdNames){
                freightFreeRule.regionIdNames = freightFreeRule.regionIdNames.substring(0,freightFreeRule.regionIdNames.length-1)
              }
            });
            var saveOrUpdate = this.dataForm.id ? updateFreightTemplate : saveFreightTemplate;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              type: this.dataForm.type,
              chargeType: this.dataForm.chargeType,
              enableDefaultFreight: this.dataForm.enableDefaultFreight,
              freightDefaultEntity: this.dataForm.freightDefaultEntityList[0],
              freightRuleEntityList: this.dataForm.freightRuleEntityList,
              enableConditionFree: this.dataForm.enableConditionFree,
              adminUserId: this.createBy,
              freightFreeRuleEntityList: this.dataForm.freightFreeRuleEntityList,
              isDefault: this.dataForm.isDefault,
              createBy: this.createBy
            })
            saveOrUpdate(data).then(({data}) => {
              if (data && data.code === "200") {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            });
          }
        })
      },

      /**
       * cookie中获取当前登录的用户信息
       */
      getUserInfo() {
        var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
        this.createBy = userInfo.userId;
        this.userType = userInfo.userType;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-input-number {
    position: relative;
    display: inline-block;
    width: 120px;
    line-height: 35px;
  }
  .el-radio__label {
    font-size: 14px;
    padding-left: 5px;
  }
  .el-radio {
    margin-right: 5px;
  }

</style>
