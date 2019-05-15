<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-date-picker v-model="dataForm.beginDate" type="date" placeholder="开始日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dataForm.endDate" type="date" placeholder="结束日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.product" multiple placeholder="商品">
          <el-option v-for="item in productList" :key="item.prodcode" :label="item.prodname" :value="item.prodcode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.merchant" multiple placeholder="商家">
          <el-option v-for="item in merchantList" :key="item.merctcode" :label="item.merctname" :value="item.merctcode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.weight" multiple placeholder="规格">
          <el-option v-for="item in specificationList" :key="item.speccode" :label="item.specname" :value="item.speccode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.platform" multiple placeholder="平台">
          <el-option v-for="item in platformList" :key="item.platcode" :label="item.platname" :value="item.platcode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>

      </el-form-item>
    </el-form>

    <!--<el-alert-->
    <!--title="提示："-->
    <!--type="warning"-->
    <!--:closable="false">-->
    <!--<div slot-scope="description">-->
    <!--<p class="el-alert__description">1. 此Demo只提供ECharts官方使用文档，入门部署和体验功能。具体使用请参考：http://echarts.baidu.com/index.html</p>-->
    <!--</div>-->
    <!--</el-alert>-->

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="J_chartLineBox" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  let today = new Date()
  let lastWeekTime = today.getTime() - 7 * 24 * 60 * 60 * 1000
  let lastWeek = new Date(lastWeekTime)

  export default {
    data () {
      return {
        dataForm: {
          beginDate: lastWeek.toLocaleDateString(),
          endDate: today.toLocaleDateString(),
          platform: '',
          merchant: '',
          product: '',
          weight: ''
        },
        dataList: [],
        productList: [],
        merchantList: [],
        specificationList: [],
        platformList: [],
        chartLine: null
      }
    },
    created: function () {
      this.getSelectOptions()
    },

    activated () {
      if (this.chartLine) {
        this.chartLine.resize()
      }
    },

    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/mpc/mpcOnlinesales/list'),
          method: 'get',
          params: this.$http.adornParams({
            'beginDate': this.dataForm.beginDate,
            'endDate': this.dataForm.endDate,
            'weight': this.dataForm.weight.toString(),
            'platform': this.dataForm.platform.toString(),
            'merchant': this.dataForm.merchant.toString(),
            'product': this.dataForm.product.toString()
          })
        }).then(({data}) => {
          // debugger
          console.log(data)
          if (data && data.code === 0) {
            // this.dataList = data.list
            this.initChartLine(data)
          } else {
            this.dataList = []
          }
        })
      },
      getSelectOptions () {
        this.$http({
          url: this.$http.adornUrl('/mpc/mpcOnlinesales/selectOptions'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.productList = data.productList
            this.merchantList = data.merchantList
            this.specificationList = data.specificationList
            this.platformList = data.platformList
          }
        })
      },
      initChartLine (data) {
        let seriesData = []

        for (let i = 0; i < data.legendData.length; i++) {
          seriesData.push({
            'type': 'line',
            // 'seriesLayoutBy': 'column',
            'connectNulls': true
          })
        }
        let sourceData = []

        for(let k =0; k < data.reportList.length; k ++){
          // var sourceItem = '{'
          // for (let j = 0; j < data.legendData.length; j++) {
          //   debugger
          //   sourceItem = sourceItem +  data.legendData[j] + ':' + data.reportList[k].map[data.legendData[j]] + ','
          // }
          // sourceItem =  sourceItem + '}
          let sourceItem = JSON.stringify(data.reportList[k])
          sourceData.push(sourceItem)
        }
        let dataset = {
          dimensions: data.legendData,
          source: sourceData
        }
        let option = {
          'title': {
            'text': '价格跟踪折线图'
          },
          'tooltip': {
            // 'trigger': 'axis'
          },
          'legend': {
            // 'data': data.legendData
          },
          'grid': {
            'left': '3%',
            'right': '4%',
            'bottom': '3%',
            'containLabel': true
          },
          'toolbox': {
            'feature': {
              'saveAsImage': { }
            }
          },
          'xAxis': {
            'type': 'category'
          },
          'yAxis': {

          },
          'dataset': dataset,
          'series': seriesData
        }
        debugger
        this.chartLine = echarts.init(document.getElementById('J_chartLineBox'))
        console.log(option.toString())
        this.chartLine.setOption(option)
        window.addEventListener('resize', () => {
          this.chartLine.resize()
        })
      }
    }
  }
</script>
<style lang="scss">
  .mod-demo-echarts {
    /*> .el-alert {*/
    /*margin-bottom: 10px;*/
    /*}*/
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
