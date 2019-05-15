<template>
  <div>
    <component v-if="templateName != '' && formName != ''" v-bind:is="templateName" :form-name="formName" :form-params="formParams"></component>
  </div>
</template>

<script>
  // import customForm from './templates/custom-form'
  // import customTable from './templates/custom-table'
  // import customPagetable from './templates/custom-pagetable'

  export default {
    name: "mainForm",
    props: {
      formmenu: String
    },
    data() {
      return {
        formName: '',
        templateName: '',
        formParams: {},
      }
    },
    components: {
      // customForm, customTable, customPagetable
    },
    created() {

    },
    mounted() {
      console.log("开始加载表单:" + this.formmenu);
    },
    methods: {
      template(formmenu) {
        //加载模版
        this.$http({
          url: this.$http.adornUrl('/form/pagemenu/mcode/' + formmenu),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.formName = data.pagemenu.mainform;
            this.templateName = data.formPageInfo.template.mtcode;
          }
        })
      }
    },
    watch: {
      formmenu: {
        handler(val, oldVal) {
          if(val) {
            this.template(val);
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

</style>
