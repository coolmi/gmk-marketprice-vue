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
          <el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
export default {
  data () {
    return {
      dataForm: {
        beginDate: '',
        endDate: '',
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
      debugger
      this.$http({
        url: this.$http.adornUrl('/mpc/mpcOnlinesales/list'),
        method: 'get',
        params: this.$http.adornParams({
          'beginDate': this.dataForm.beginDate,
          'endDate': this.dataForm.endDate,
          'weight': JSON.stringify(this.dataForm.weight),
          'platform': JSON.stringify(this.dataForm.platform),
          'merchant': JSON.stringify(this.dataForm.merchant),
          'product': JSON.stringify(this.dataForm.product)
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.list
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
          console.log(data.merchantList)
          this.specificationList = data.specificationList
          this.platformList = data.platformList
        }
        this.initChartLine()
      })
    },
    initChartLine () {
      var option = {
        'title': {
          'text': '价格跟踪折线图'
        },
        'tooltip': {
          'trigger': 'axis'
        },
        'legend': {
          'data': [ '邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎' ]
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
          'type': 'value'
        },
        'yAxis': {
          'type': 'value'
        },
        'series': [
          {
            'name': '邮件营销',
            'type': 'line',
            'stack': '总量',
            'data': [ 120, 132, 101, 134, 90, 230, 210 ]
          },
          {
            'name': '联盟广告',
            'type': 'line',
            'stack': '总量',
            'data': [ 220, 182, 191, 234, 290, 330, 310 ]
          },
          {
            'name': '视频广告',
            'type': 'line',
            'stack': '总量',
            'data': [ 150, 232, 201, 154, 190, 330, 410 ]
          },
          {
            'name': '直接访问',
            'type': 'line',
            'stack': '总量',
            'data': [ 320, 332, 301, 334, 390, 330, 320 ]
          },
          {
            'name': '搜索引擎',
            'type': 'line',
            'stack': '总量',
            'data': [ 820, 932, 901, 934, 1290, 1330, 1320 ]
          }
        ]
      }
      this.chartLine = echarts.init(document.getElementById('J_chartLineBox'))
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
