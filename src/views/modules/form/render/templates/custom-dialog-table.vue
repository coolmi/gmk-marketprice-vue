<template>
  <el-dialog
    :title="title" :width="width"
    :close-on-click-modal="false"
    :visible.sync="visible" :append-to-body="true" @close="closeForm">
    <custom-table ref="customTable" :form-name="formName" :state="state" :form-params="formParams" @closeAndRefreshList="closeAndRefreshList" v-if="formName != ''"/>
  </el-dialog>
</template>

<script>

  export default {
    name: "custom-dialog-table",
    props: {
      formName: String,
      state: String,
      formParams: Object
    },
    components: {
    },
    data() {
      return {
        visible: false,
        title: '',
        width: '80%'
      }
    },
    computed: {},
    created() {
    },
    mounted() {
      this.$http({
        url: this.$http.adornUrl('/form/pageinfo/wcode/' + this.formName),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.title = data.formPageInfo.wname;
          if('pageattributes' in data.formPageInfo) {
            var _pageattributes = data.formPageInfo.pageattributes;
            if(_pageattributes != null && typeof _pageattributes != 'undefined'
              && _pageattributes.length > 0) {
              for(var i = 0; i < _pageattributes.length; i++) {
                if(_pageattributes[i].atrkey == 'width' && _pageattributes[i].templateatrval != '') {
                  this.width = _pageattributes[i].templateatrval + "%";
                }
              }
            }
          }
        }
      })
    },
    methods: {
      initData () {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['customTable'].initData();
        })
      },
      showForm() {
        this.visible = true
      },
      closeForm() {
        this.visible = false
        this.$emit('close')
      },
      closeAndRefreshList(forminfo) {
        this.visible = false
        this.$emit('closeAndRefreshList', forminfo)
      }
    }
  }
</script>

<style scoped>

</style>
