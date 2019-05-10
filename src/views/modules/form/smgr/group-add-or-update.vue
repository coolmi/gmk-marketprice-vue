<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="50%"
    :visible.sync="visible" @close="closeDialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务组" prop="groupname">
            <el-input v-model="dataForm.groupname" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
        },
        dataRule: {
          groupname: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
        },
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
              url: this.$http.adornUrl(`/form/smgrgroup/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.groupEntity
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
              url: this.$http.adornUrl(`/form/smgrgroup/saveOrUpdate`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === 0) {
                var _id = data.id;
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
      },
      closeDialog() {
        // this.$emit('refreshDataList')
      }
    },
    mounted() {

    }
  }
</script>
