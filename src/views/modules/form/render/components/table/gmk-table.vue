<template>
  <!-- 表格包括数据过滤、功能、数据展示功能 -->
  <div>
    <gmk-search-form v-if="isFilter()" :ref="formSchema.ui.filters.key" :form-name="formSchema.ui.filters.key" :form-schema="formSchema.ui.filters" :form-event="formEvent" :state="state" @search="search"></gmk-search-form>
    <gmk-button-area :form-name="formName" :form-schema="formSchema.ui.functions" :form-event="formEvent" :form-params="formParams" :state="state"></gmk-button-area>
    <el-table :data="tableData" @selection-change="selectionChangeHandle" border style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column v-for="(item, index) in formSchema.ui.columns" :key="index" :prop="item.key" :label="item.name"
                       header-align="center" align="center" :width="item.width" :formatter="formatterColumn"></el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name: "gmk-table",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formEvent: Object,
      formData: Object,
      formParams: Object
    },
    data() {
      return {
        // tableData: [],
        dataListSelections: []
      }
    },
    computed: {
      tableData: function() {
        if(this.formData != null && typeof this.formData != 'undefined'
          && this.formSchema.key in this.formData && this.formData[this.formSchema.key] != null && typeof this.formData[this.formSchema.key] != 'undefined') {
          return this.formData[this.formSchema.key];
        }
        return [];
      },
    },
    components: {
    },
    mounted() {

    },
    methods: {
      isFilter() {
        if(typeof this.formSchema.ui.filters != 'undefined' && this.formSchema.ui.filters != null) {
          return true;
        }
        return false;
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      getSelectionList() {
        return this.dataListSelections;
      },
      search(searchFormData) {
        this.$emit('search', searchFormData);
      },
      formatterColumn(row, column, cellValue, index) {
        var _mkey = column.property + "_formatter";
        if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
          return this.formEvent[_mkey](row, column, cellValue, index);
        }
        return cellValue;
      }
    },
    // watch: {
      // formData: {
      //   handler(val, oldval) {
      //     if (val != null && typeof val != 'undefined'
      //       && this.formSchema.key in val && val[this.formSchema.key] != null && typeof val[this.formSchema.key] != 'undefined') {
      //       this.tableData = val[this.formSchema.key];
      //     }
      //     else {
      //       this.tableData = [];
      //     }
      //   },
      //   immediate: true,
      //   deep: true
      // }
    // }
  }
</script>

<style scoped>

</style>
