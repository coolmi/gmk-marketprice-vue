<template>
  <div class="mod-role">
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

  </div>
</template>

<script>
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
      platformList: []
    }
  },
  created: function () {
    this.getSelectOptions()
  },

  activated () {
    this.getDataList()
  },

  methods: {
    // 获取数据列表
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/sys/role/list2'),
        method: 'get',
        params: this.$http.adornParams({
          'beginDate': this.dataForm.beginDate,
          'endDate': this.dataForm.endDate,
          'weight': this.dataForm.weight,
          'platform': this.dataForm.platform,
          'merchant': this.dataForm.merchant,
          'product': this.dataForm.product
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
        url: this.$http.adornUrl('/sys/role/selectOptions'),
        method: 'get'
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          this.productList = data.productList
          this.merchantList = data.merchantList
          console.log(data.merchantList)
          this.specificationList = data.specificationList
          this.platformList = data.platformList
        }
      })
    }
  }
}
</script>
