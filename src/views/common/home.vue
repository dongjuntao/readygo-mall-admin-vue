<template>
  <div class="mod-home" style="text-align: center;">
    <h2 v-if="auditStatus == 0">
      管理员正在审核中，请您耐心等待3到5个工作日，留意短信或邮件邮件通知！
    </h2>
    <h2 v-if="auditStatus == 2">
      审核未通过，请根据短信或邮件提示在<el-link style="font-size: 1em;font-weight: bold; bottom: 1.2px;" type="primary" :underline="false">我的店铺</el-link>中重新填写入驻信息并申请！
    </h2>

    <el-card style="width: 24%; height: 80px;  float: right; margin-left: 15px">
      <div style="float:left; line-height: 40px;">本月销售额</div>
      <count-to :start-val="0" :end-val="count.salesVolumeThisMonth" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>
    <el-card style="width: 24%; height: 80px; float: right; margin-left: 15px">
      <div style="float:left; line-height: 40px;">订单总数</div>
      <count-to :start-val="0" :end-val="count.totalOrderCount" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>
    <el-card style="width: 24%; height: 80px; float: right; margin-left: 15px">
      <div style="float:left; line-height: 40px;">商品总数</div>
      <count-to :start-val="0" :end-val="count.totalGoodsCount" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>
    <el-card style="width: 24%; height: 80px; margin-left: auto">
      <div style="float:left; line-height: 40px;">总销售额</div>
      <count-to :start-val="0" :end-val="count.salesVolume" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>


    <el-card style="width: 24%; height: 80px;  float: right; margin-left: 15px; margin-top: 20px;">
      <div style="float:left; line-height: 40px;">今日订单数</div>
      <count-to :start-val="0" :end-val="count.todayOrderCount" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>
    <el-card style="width: 24%; height: 80px; float: right; margin-left: 15px; margin-top: 20px;">
      <div style="float:left; line-height: 40px;">昨日订单数</div>
      <count-to :start-val="0" :end-val="count.yesterdayOrderCount" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>
    <el-card style="width: 24%; height: 80px; float: right; margin-left: 15px; margin-top: 20px;">
      <div style="float:left; line-height: 40px;">近七日订单数</div>
      <count-to :start-val="0" :end-val="count.lastSevenDaysOrderCount" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>
    <el-card style="width: 24%; height: 80px; margin-left: auto; margin-top: 20px;">
      <div style="float:left; line-height: 40px;">本月订单数</div>
      <count-to :start-val="0" :end-val="count.thisMonthOrderCount" :duration="2600" style="float:right; font-size: 30px; line-height: 40px;" />
    </el-card>

    <!--统计图-->
    <el-row :gutter="10" style="margin-top: 10px;">
      <el-col :span="12">
        <el-card style="width: 99%; margin-left: 10px;">
          <div id="J_chartPieBox" class="chart-box" style="height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartLineBox" class="chart-box" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getUserInfo } from '@/utils/auth'
import { getHomepageStatisticsData, pieChartData, barChartData } from "@/api/mall-admin/mall-homepage-statistics";
export default {
  components: {
    CountTo
  },
  data () {
    return {
      userName: '',
      userId: 0,
      userType: null,
      auditStatus: null,
      count: {
        salesVolume: 0, //销售额
        totalGoodsCount: 0, //商品总数
        totalOrderCount: 0, //订单总数
        salesVolumeThisMonth: 0, //本月销售额
        thisMonthOrderCount: 0, //本月订单数
        lastSevenDaysOrderCount: 0, //近七日订单数
        yesterdayOrderCount: 0, //昨日订单数
        todayOrderCount: 0 //今日订单数
      },
      chartLine: null,
      chartPie: null
    }
  },
  created() {
    this.getUserInfo()
  },

  mounted() {
    //上方数据统计
    this.getStatisticsData();
    //折线图
    this.initBarChart()
    //饼状图
    this.initPieChart()
  },
  methods: {
    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userName = userInfo.userName;
      this.userId = userInfo.userId;
      this.userType = userInfo.userType;
      this.auditStatus = userInfo.auditStatus
    },

    /**
     * 首页上方数据统计
     */
    getStatisticsData() {
      var params =  this.axios.paramsHandler({})
      getHomepageStatisticsData(params).then(({data}) => {
        if (data && data.code === "200") {
          this.count = data.data
        }
      })
    },

    /**
     * 饼图数据
     */
    async getPieChartData() {
      var params =  this.axios.paramsHandler({})
      var result = await pieChartData(params).then(({data}) => {
        var seriesDataList = [];
        if (data.code == '200' && data.data.length>0) {
          for (var i=0; i<data.data.length; i++) {
            var seriesData = {
              value: data.data[i].count,
              name: data.data[i].categoryName
            };
            seriesDataList.push(seriesData);
          }
        }
        return seriesDataList;
      })
      return result;
    },

    /**
     * 柱状图数据
     * @returns {Promise<*>}
     */
    async getBarChartData() {
      var params =  this.axios.paramsHandler({})
      var result = await barChartData(params).then(({data}) => {
        var xData = [];
        var seriesData = [];
        var resultData = {xData: null, seriesData: null};
        if (data.code == '200' && data.data.length>0) {
          for (var i=0; i<data.data.length; i++) {
            xData.push(data.data[i].yearMonth);
            seriesData.push(data.data[i].count);
          }
          resultData.xData = xData;
          resultData.seriesData = seriesData;
        }
        return resultData;
      })
      return result;
    },

    // 柱状图
    async initBarChart () {
      var result = await this.getBarChartData();
      var option = {
        title : {
          text: '近六个月订单量',
          x: 'center',
          align: 'right'
        },//标题
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: result.xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '订单量',
            type: 'bar',
            barWidth: '60%',
            data: result.seriesData,
            backgroundStyle: {
              color: 'rgba(111, 162, 135, 0.2)'
            },
            itemStyle: {
              normal: {
                color: '#194faa'  //这里是颜色
              }
            }
          },
          {
            data: result.seriesData,
            type: 'line',
            tooltip:{ show: false},
            symbol: 'circle',//拐点样式
            symbolSize: 3,//拐点大小
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,//折线宽度
                  color: '#5606db'//折线颜色
                },
                color: "#0324c9",//拐点颜色
                borderColor: '#000000',//拐点边框颜色
                borderWidth: 1//拐点边框大小
              },
              emphasis: {
                color: '#000000'//hover拐点颜色定义
              }
            }
          }
        ]
      };
      this.chartLine = this.echarts.init(document.getElementById('J_chartLineBox'))
      this.chartLine.setOption(option)
      window.addEventListener('resize', () => {
        this.chartLine.resize()
      })
    },
    // 饼状图
    async initPieChart () {
      var result = await this.getPieChartData();
      var option = {
        title: {
          text: '商品分析',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            left: '0%',
            center: ['50%', '60%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
            radius: ['30%', '70%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
            hoverAnimation: true,
            data: result,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.chartPie = this.echarts.init(document.getElementById('J_chartPieBox'))
      this.chartPie.setOption(option)
      window.addEventListener('resize', () => {
        this.chartPie.resize()
      })
    }
  }
}
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>

