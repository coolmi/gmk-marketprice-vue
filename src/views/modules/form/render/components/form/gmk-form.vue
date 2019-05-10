<template>
  <div>
    <el-form :model="formData" :ref="formRef"
             :label-width="labelWidth" label-position="right">
      <!--分组-->
      <el-card class="box-card" v-if="isGroup()"
               v-for="(gitem, gindex) in groups" :key="gindex">
        <div slot="header" class="clearfix">
          <span>{{ gitem.title }}</span>
        </div>
        <el-row v-for="(ritem, rindex) in gitem.rows" :key="rindex">
          <el-col v-for="(citem, cindex) in ritem" :key="cindex" :span="citem.ui.span">
            <component :ref="citem.key" v-bind:is="citem.ui.component" :form-name="formName" :form-schema="citem" :form-data="formData" :form-event="formEvent" :form-params="formParams" :state="state"></component>
          </el-col>
        </el-row>
      </el-card>

      <!--无分组-->
      <el-row v-for="(ritem, rindex) in rows" :key="rindex" v-if="!isGroup()">
        <el-col v-for="(citem, cindex) in ritem" :key="cindex" :span="citem.ui.span">
          <component :ref="citem.key" v-bind:is="citem.ui.component" :form-name="formName" :form-schema="citem" :form-data="formData" :form-event="formEvent" :form-params="formParams" :state="state"></component>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>

  export default {
    name: "gmk-form",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formData: Object,
      formEvent: Object,
      formParams: Object
    },
    data () {
      return {
        rows: []    //无分组用
      }
    },
    computed: {
      formRef() {
        return this.formName + 'Form';
      },
      labelWidth() {
        if(this.formSchema.ui.config != null && typeof this.formSchema.ui.config != 'undefined') {
          return this.formSchema.ui.config.labelWidth;
        }
        return '120px';
      },
      groups() {
        if(this.formSchema.ui.groups != null && typeof this.formSchema.ui.groups != 'undefined' && this.formSchema.ui.groups.length > 0) {
          return this.formSchema.ui.groups;
        }
        return [];
      }
    },
    components: {

    },
    created(){
      if(this.isGroup()
        && this.formSchema.ui.columns) {
        var groupColumns = {};
        //如果分组了，先分组，不分组的字段不支持
        for(var citem of this.formSchema.ui.columns) {
          if(citem.group) {
            var citemColumns = groupColumns[citem.group];
            citemColumns = citemColumns ? citemColumns : [];
            citemColumns.push(citem);
            groupColumns[citem.group] = citemColumns;
          }
        }

        for(var gitem of this.formSchema.ui.groups) {
          gitem.rows = this.arrange(groupColumns[gitem.name])
        }
      }
      else {
        //无分组的情况
        this.rows = this.arrange(this.formSchema.ui.columns);
      }

    },
    mounted() {

    },
    methods: {
      //将列排成一行一行的格式
      arrange(columns) {
        var rows = [];
        if(columns != null && typeof columns != "undefined") {
          var tempSpan = 0;
          var tempArr = new Array();
          for(var item of columns) {
            var span = item.ui.span;
            tempSpan = tempSpan + parseInt(span);
            if(tempSpan <= 24) {
              tempArr.push(item);
            }
            else {
              rows.push(tempArr);
              tempArr = new Array();
              tempArr.push(item);
              tempSpan = span;
            }
          }
          if(tempArr.length > 0) {
            rows.push(tempArr);
          }
        }
        return rows;
      },
      isGroup() {
        if(this.formSchema.ui.groups != null && typeof this.formSchema.ui.groups != 'undefined' && this.formSchema.ui.groups.length > 0) {
          return true;
        }
        return false;
      },
      validate(callback) {
        this.$refs[this.formRef].validate((valid) => {
          if (valid) {
            callback();
          }
        });
      },
      resetForm() {
        this.$refs[this.formRef].resetFields();
      },
      getFormData() {
        return this.formData;
      },
      getSelectionList(column) {
        if(this.$refs[column].length > 0) {
          return this.$refs[column][0].getSelectionList();
        }
        return [];
      }
    }
  }
</script>

<style scoped>

</style>
