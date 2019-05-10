<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="菜单编号" prop="mcode">
      <el-input v-model="dataForm.mcode" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="菜单名称" prop="mname">
      <el-input v-model="dataForm.mname" placeholder=""></el-input>
    </el-form-item>
      <el-form-item label="主表单CODE" prop="mainform">
        <el-input v-model="dataForm.mainform" placeholder=""></el-input>
      </el-form-item>
    <el-form-item label="备注" prop="biz">
      <el-input v-model="dataForm.biz" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          mcode: '',
          mname: '',
          mainform: '',
          biz: '',
          isdel: ''
        },
        dataRule: {
          mcode: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          mname: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          mainform: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/form/pagemenu/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.mcode = data.formpagemenu.mcode
                this.dataForm.mname = data.formpagemenu.mname
                this.dataForm.mainform = data.formpagemenu.mainform
                this.dataForm.biz = data.formpagemenu.biz
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/form/pagemenu/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'mcode': this.dataForm.mcode,
                'mname': this.dataForm.mname,
                'mainform': this.dataForm.mainform,
                'biz': this.dataForm.biz
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
