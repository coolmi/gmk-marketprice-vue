<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="80%"
    :visible.sync="visible" @close="closeDialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务名" prop="aname">
            <el-input v-model="dataForm.aname" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="编号" prop="acode">
            <el-input v-model="dataForm.acode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="接口类型" prop="atype">
            <el-radio-group v-model="dataForm.atype">
              <el-radio label="1">翻页列表查询</el-radio>
              <el-radio label="2">普通列表查询</el-radio>
              <el-radio label="3">根据主键获取信息</el-radio>
              <el-radio label="4">插入</el-radio>
              <el-radio label="5">更新</el-radio>
              <el-radio label="6">删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="类型" prop="sqltype">
            <el-radio-group v-model="dataForm.sqltype">
              <el-radio label="0">静态SQL</el-radio>
              <el-radio label="1">动态SQL</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="SQL文本" prop="sqltext">
            <el-input v-model="dataForm.sqltext" type="textarea" rows="10" placeholder=""></el-input>
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
          apitype: '1',
          groupid: 0,
          sqltype: '',
          atype: ''
        },
        dataRule: {
          aname: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          acode: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          atype: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          sqltype: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          sqltext: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      init (groupId, id) {
        this.dataForm.id = id || 0
        this.dataForm.groupid = groupId;
        this.dataForm.apitype = '1';

        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/form/smgrapiinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.infovo
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
              url: this.$http.adornUrl('/form/smgrapiinfo/saveOrUpdate'),
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
