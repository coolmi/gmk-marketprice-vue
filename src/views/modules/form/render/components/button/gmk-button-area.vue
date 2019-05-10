<template>
  <el-row type="flex" :justify="justify">
    <component v-for="(item, index) in buttons" :key="index" v-bind:is="item.ui.component"  :form-name="formName" :form-schema="item" :form-event="formEvent" :form-params="formParams" :state="state"></component>
  </el-row>
</template>

<script>
  export default {
    name: "gmk-button-area",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formEvent: Object,
      formParams: Object
    },
    computed: {
      justify() {
        if(this.formSchema != null && typeof this.formSchema != 'undefined'
          && 'config' in this.formSchema && this.formSchema.config != null && typeof this.formSchema.config != 'undefined') {
          return this.formSchema.config.justify;
        }
        return 'center';
      },
      buttons() {
        if(this.formSchema != null && typeof this.formSchema != 'undefined'
          && 'buttons' in this.formSchema && this.formSchema.buttons != null && typeof this.formSchema.buttons != 'undefined') {
          return this.formSchema.buttons;
        }
        return [];
      }
    },
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
