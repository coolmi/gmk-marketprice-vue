<template>
  <!--
  普通列表模版
  -->
  <div>
    <gmk-table :ref="formName" v-if="Object.keys(formSchema).length>0" :form-name="formName" :form-schema="formSchema" :form-event="formEvent" :form-data="formData" :form-params="formParams" :state="state" @search="search"></gmk-table>
    <component :is="subFormTemplateName" ref="subForm" :form-name="subFormName" :state="subFormState" :form-params="subFormParams" @close="closeSubForm" @closeAndRefreshList="initPratUI" v-if="subFormVisible"></component>
    <remote-script :src="scriptUrl" @load="loadScript"></remote-script>
  </div>
</template>

<script>
  import Vue from 'vue'

  import events from '../events/index'
  // import customDialogForm from './custom-dialog-form'
  // import customForm from './custom-form'

  export default {
    name: "custom-table",
    props: {
      formName: String,
      state: String,
      formParams: Object
    },
    components: {
      // customDialogForm, customForm
    },
    data () {
      return {
        formSchema: {
          ui: {
            component: ''
          }
        },
        formData: {},
        formEvent: {},
        subFormName: '',
        subFormState: '',
        subFormParams: {},
        subFormTemplateName: '',
        subFormVisible: false,
        tempData: {}   //临时数据保存区
      }
    },
    computed: {
      scriptUrl: function() {
        return this.$http.adornUrl('/api/form/javascript/'+this.formName+'?token=' + Vue.cookie.get('token'));
      },
    },
    async created(){
      var _this = this;
      this.formEvent = events(this.formName, _this, 'table');

      let res = await this.$http.get(this.$http.adornUrl('/form/schema/table/' + this.formName));
      if (res.data && res.data.code === 0) {
        this.formSchema = res.data.schema;
      }
    },
    mounted() {

    },
    methods: {
      loadScript() {
        var _formevt0 = window[this.formName];
        if(_formevt0 != null && typeof _formevt0 != 'undefined' && Object.keys(_formevt0).length>0) {
          this.formEvent.rules = _formevt0.rules;
          if(_formevt0.methods != null && typeof _formevt0.methods != 'undefined') {
            for(var methodkey in _formevt0.methods) {
              this.formEvent[methodkey] = _formevt0.methods[methodkey];
            }
          }
        }

        this.$nextTick(() => {
          this.initData();
        })
      },
      initData() {
        if(this.formEvent != null && typeof this.formEvent != 'undefined'
          && 'init' in this.formEvent) {
          this.formEvent.init();
        }
      },
      initPratUI(forminfo) {  //局部刷新
        this.closeSubForm();
        if(this.formEvent != null && typeof this.formEvent != 'undefined' && 'initPratUI' in this.formEvent) {
          if(forminfo.tableColumn) {
            this.formEvent.initPratUI(forminfo.tableColumn);
          }
          else {
            this.formEvent.initPratUI(this.formName);
          }
        }
      },
      getFormParams() {
        return this.formParams;
      },
      setFormParam(key, value) {
        Vue.set(this.formParams, key, value);
      },
      setFormData(formData) {
        for(var _key in formData) {
          Vue.set(this.formData, _key, formData[_key]);
        }
      },
      setFormKeyData(key, value) {
        Vue.set(this.formData, key, value);
      },
      getFormKeyData(key) {
        if(key in this.formData) {
          return this.formData[key];
        }
        return null;
      },
      getFormData() {
        return this.formData;
      },
      clearFormData() {
        for(var _key in this.formData){
          delete this.formData[_key];
        }
      },
      setTempKeyData(key, value) {
        Vue.set(this.tempData, key, value);
      },
      getTempKeyData(key) {
        if(key in this.tempData) {
          return this.tempData[key];
        }
        return null;
      },
      getTempData() {
        return this.tempData;
      },
      nextTick(callback) {
        this.$nextTick(() => {
          callback();
        })
      },
      openSubForm(subFormName, state, params) {
        this.$http({
          url: this.$http.adornUrl('/form/pageinfo/wcode/' + subFormName),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.subFormName = subFormName;
            this.subFormState = state;
            this.subFormParams = {};
            for(var skey in params) {
              Vue.set(this.subFormParams, skey, params[skey]);
            }

            this.subFormTemplateName = data.formPageInfo.template.mtcode;
            this.subFormVisible = true;

            this.$nextTick(() => {
              this.$refs.subForm.showForm();
            })
          }
        })
      },
      getSelectionList(column) {
        if(column) {
          return this.$refs[column].getSelectionList();
        }
        else {
          return this.$refs[this.formName].getSelectionList();
        }
      },
      search(searchDataForm) {
        if(searchDataForm != null && typeof searchDataForm != "undefined") {
          for(var column in searchDataForm) {
            this.setFormParam(column, searchDataForm[column]);
          }
        }
        this.initData();
      },
      showForm() {
        //无方法体
      },
      closeSubForm() {
        this.subFormVisible = false;  //重新绘制子组件
      },
      closeAndRefreshList(forminfo) {
        this.$emit('closeAndRefreshList', forminfo);
      }
    },
  }
</script>

<style scoped>

</style>
