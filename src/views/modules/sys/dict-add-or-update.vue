<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="编号" prop="keycode">
        <el-input v-model="dataForm.keycode" placeholder="编号"></el-input>
      </el-form-item>
      <el-form-item label="键值" prop="keyval">
        <el-input v-model="dataForm.keyval" placeholder="键值"></el-input>
      </el-form-item>
      <el-form-item label="键名称" prop="keyname">
        <el-input v-model="dataForm.keyname" placeholder="键名称"></el-input>
      </el-form-item>
      <el-form-item label="所属组" prop="groupcode">
        <el-input v-model="dataForm.groupcode" placeholder="所属组"></el-input>
      </el-form-item>
      <el-form-item label="所属组名称" prop="groupname">
        <el-input v-model="dataForm.groupname" placeholder="所属组名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
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
          keycode: '',
          keyval: '',
          keyname: '',
          groupcode: '',
          groupname: '',
          sort: ''
        },
        dataRule: {
          keycode: [
            { required: true, message: '编号不能为空', trigger: 'blur' }
          ],
          keyval: [
            { required: true, message: '键值不能为空', trigger: 'blur' }
          ],
          keyname: [
            { required: true, message: '键名称不能为空', trigger: 'blur' }
          ],
          groupcode: [
            { required: true, message: '所属组不能为空', trigger: 'blur' }
          ],
          groupname: [
            { required: true, message: '所属组名称不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/sys/dict/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.dict
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
              url: this.$http.adornUrl(`/sys/dict/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'keycode': this.dataForm.keycode,
                'keyval': this.dataForm.keyval,
                'keyname': this.dataForm.keyname,
                'groupcode': this.dataForm.groupcode,
                'groupname': this.dataForm.groupname,
                'sort': this.dataForm.sort,
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
