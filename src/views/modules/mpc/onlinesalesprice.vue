<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-date-picker v-model="dataForm.beginDate" type="date" placeholder="开始日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dataForm.endDate" type="date" placeholder="结束日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item >
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

    <el-tabs>
      <el-tab-pane label="列表">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="price"
            header-align="center"
            align="center"
            label="价格">
          </el-table-column>
          <el-table-column
            prop="promotionPrice"
            header-align="center"
            align="center"
            label="活动价格">
          </el-table-column>
          <el-table-column
            prop="salesVolume"
            header-align="center"
            align="center"
            label="销量">
          </el-table-column>
          <el-table-column
            prop="salesDate"
            header-align="center"
            align="center"
            label="销售日期">
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="价格折线图">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card>
              <div id="J_chartLineBox" class="chart-box"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="销量柱状图">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card>
              <div id="J_chartBarBox" class="chart-box"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
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
        chartLine: null,
        dataListLoading: false,
        dataRule: {
          product : [{ required: true, message: '商品不能为空',trigger: 'blur' }]
        }
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
        this.dataListLoading = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
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
              if (data && data.code === 0) {
                this.dataList = data.list
                this.initChartLine(data)
              } else {
                this.dataList = []
              }
            })
          }
        })
        this.dataListLoading = false
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
        debugger
        for (let i = 0; i < data.legendData.length; i++) {
          seriesData.push({
            'type': 'line',
            'seriesLayoutBy': 'column',
            'connectNulls': true
          })
        }

        for(let i = 0; i < data.reportList.length; i++){
          var lineData = data.reportList[i]
          for (let k of Object.keys(lineData)) {
            if(k == 'salesDate'){
              lineData[k] = this.stringToDate(lineData[k]);
            }
          }
        }

        let dataset = {
          dimensions: data.legendData,
          source: data.reportList
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
            'type': 'time',
            formatter (value, index) {
              // 格式化成月/日，只在第一个刻度显示年份
              var date = new Date(value)
              var texts = [(date.getMonth() + 1), date.getDate()]
              if (index === 0) {
                texts.unshift(date.getYear())
              }
              return texts.join('/')
            }
          },
          'yAxis': {
              type:'value'
          },
          'dataset': dataset,
          'series': seriesData
        }
        this.chartLine = echarts.init(document.getElementById('J_chartLineBox'))
        console.log(JSON.stringify(option))
        this.chartLine.setOption(option)
        window.addEventListener('resize', () => {
          this.chartLine.resize()
        })
      },
      stringToDate (dateStr, separator) {
        if (!separator) {
          separator = '-'
        }
        let dateArr = dateStr.split(separator)
        let year = parseInt(dateArr[0])
        let month
        // 处理月份为04这样的情况
        if (dateArr[1].indexOf('0') === 0) {
          month = parseInt(dateArr[1].substring(1))
        } else {
          month = parseInt(dateArr[1])
        }
        let day = parseInt(dateArr[2])
        let date = new Date(year, month, day)
        return date
      },
      objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
          strMap.set(k, obj[k]);
        }
        return strMap;
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
