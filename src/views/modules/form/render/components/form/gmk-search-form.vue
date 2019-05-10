<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="点击展开查询信息" name="1">
        <el-form :label-width="formSchema.ui.config.labelWidth" label-position="right">
          <el-row v-for="(ritem, rindex) in rows" :key="rindex">
            <el-col v-for="(citem, cindex) in ritem" :key="cindex" :span="citem.ui.span">
              <component v-bind:is="citem.ui.component" :form-name="formName" :form-schema="citem" :form-data="formData" :state="state"></component>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button type="primary" @click="search">开始查询</el-button>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    name: "gmk-search-form",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formEvent: Object
    },
    data() {
      return {
        formData: {},
        rows: [],    //无分组用
        activeNames: []
      }
    },
    computed: {},
    components: {},
    created() {
      //无分组的情况
      this.rows = this.arrange(this.formSchema.ui.columns);
    },
    mounted() {

    },
    methods: {
      //将列排成一行一行的格式
      arrange(columns) {
        var rows = [];
        if (columns != "undefined") {
          var tempSpan = 0;
          var tempArr = new Array();
          for (var item of columns) {
            var span = item.ui.span;
            tempSpan = tempSpan + parseInt(span);
            if (tempSpan <= 24) {
              tempArr.push(item);
            } else {
              rows.push(tempArr);
              tempArr = new Array();
              tempArr.push(item);
              tempSpan = span;
            }
          }
          if (tempArr.length > 0) {
            rows.push(tempArr);
          }
        }
        return rows;
      },
      search() {
        this.$emit('search', this.formData);
      }
    }
  }
</script>

<style scoped>

</style>
