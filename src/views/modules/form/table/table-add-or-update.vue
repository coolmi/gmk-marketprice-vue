<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="80%"
    :visible.sync="visible" @close="closeDialog">
    <el-tabs type="card" >
      <el-tab-pane label="通用">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="模型类型" prop="mtype">
                <el-radio-group v-model="dataForm.mtype">
                  <el-radio label="1">表</el-radio>
                  <!--<el-radio label="2">视图</el-radio>-->
                  <!--<el-radio label="3">其他</el-radio>-->
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属模块" prop="moduleid">
                <el-select v-model="dataForm.moduleid" placeholder="">
                  <el-option
                    v-for="item in modules"
                    :key="item.mcode"
                    :label="item.mname"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="表名/模型编号" prop="tablename">
                <el-input v-model="dataForm.tablename" placeholder="" :disabled="this.dataForm.id!=0"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型名称" prop="mname">
                <el-input v-model="dataForm.mname" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="表简称" prop="tablealias">
                <el-input v-model="dataForm.tablealias" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="biz">
                <el-input v-model="dataForm.biz" placeholder="备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="字段" >
        <el-row>
          <el-button @click="addColumn">新增</el-button>
          <el-button @click="cdbColumn" v-if="dataForm.columns.length == 0">从DB加载表结构</el-button>
        </el-row>
        <el-row>
          <el-table border
            :data="dataForm.columns" height="350"
            style="width: 100%">
            <el-table-column label="字段KEY" fixed="left" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.colkey" placeholder="" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="字段名称" fixed="left" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.colname" placeholder="" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="字段类型" width="180">
              <template slot-scope="scope">
                <el-select clearable v-model="scope.row.coltype" placeholder="请选择" >
                  <el-option key="bigint" label="bigint" value="bigint"></el-option>
                  <el-option key="numeric" label="numeric" value="numeric"></el-option>
                  <el-option key="decimal" label="decimal" value="decimal"></el-option>
                  <el-option key="double" label="double" value="double"></el-option>
                  <el-option key="int" label="int" value="int"></el-option>
                  <el-option key="float" label="float" value="float"></el-option>
                  <el-option key="varchar" label="varchar" value="varchar"></el-option>
                  <el-option key="longtext" label="longtext" value="longtext"></el-option>
                  <el-option key="date" label="date" value="date"></el-option>
                  <el-option key="datetime" label="datetime" value="datetime"></el-option>
                  <el-option key="blob" label="blob" value="blob"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="长度" width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.collength" placeholder="" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="精度" width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.colprecision" placeholder="" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="默认值" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.defalutval" placeholder="" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否主键" width="80">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isprimay" true-label="1" false-label="0" >是</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="是否外键" width="80">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isforeignkey" true-label="1" false-label="0">是</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="关联表" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fortable" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="关联字段" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.forcolumn" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="关联关系" width="180">
              <template slot-scope="scope">
                <el-select clearable v-model="scope.row.fortype" placeholder="请选择">
                  <el-option key="0" label="1-1" value="0"></el-option>
                  <el-option key="1" label="1-(0,1)" value="1"></el-option>
                  <el-option key="2" label="1-(1,N)" value="2"></el-option>
                  <el-option key="3" label="1-(0,N)" value="3"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="值说明" width="180">
              <template slot-scope="scope">
                <el-select clearable v-model="scope.row.enumtype" placeholder="请选择">
                  <el-option key="0" label="删除标志位(0未删除,1已删除)" value="0"></el-option>
                  <el-option key="1" label="创建人员ITCOCE" value="1"></el-option>
                  <el-option key="2" label="创建人员姓名" value="2"></el-option>
                  <el-option key="3" label="创建日期" value="3"></el-option>
                  <el-option key="4" label="更新用户ITCODE" value="4"></el-option>
                  <el-option key="5" label="更新用户名称" value="5"></el-option>
                  <el-option key="6" label="更新日期" value="6"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="delColumn(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

      </el-tab-pane>

    </el-tabs>
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
          mtype: '',
          mname: '',
          moduleid: '',
          tablename: '',
          tablealias: '',
          biz: '',
          columns: []
        },
        dataRule: {
          mtype: [
            { required: true, message: '模型类型不能为空', trigger: 'blur' }
          ],
          mname: [
            { required: true, message: '模型名称不能为空', trigger: 'blur' }
          ],
          moduleid: [
            { required: true, message: '所属模块不能为空', trigger: 'blur' }
          ],
          tablename: [
            { required: true, message: '表名不能为空', trigger: 'blur' }
          ],
          tablealias: [
            { required: true, message: '表简称不能为空', trigger: 'blur' }
          ]
        },
        modules: []
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.dataForm.columns = []

        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/form/table/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.mtype = data.formtable.mtype
                this.dataForm.mname = data.formtable.mname
                this.dataForm.moduleid = data.formtable.moduleid
                this.dataForm.tablename = data.formtable.tablename
                this.dataForm.tablealias = data.formtable.tablealias
                this.dataForm.biz = data.formtable.biz
                this.dataForm.columns = data.formtable.columns
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
              url: this.$http.adornUrl(`/form/table/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'mtype': this.dataForm.mtype,
                'mname': this.dataForm.mname,
                'moduleid': this.dataForm.moduleid,
                'tablename': this.dataForm.tablename,
                'tablealias': this.dataForm.tablealias,
                'biz': this.dataForm.biz,
                'columns': this.dataForm.columns
              })
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
      addColumn() {
        this.dataForm.columns.push({
          colkey: '',
          colname: '',
          coltype: '',
          collength: '',
          colprecision: '',
          defalutval: '',
          isprimay: '',
          isforeignkey: '',
          fortable: '',
          forcolumn: '',
          fortype: '',
          enumtype: ''
        });
      },
      delColumn(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.columns.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      cdbColumn() {
        this.dataForm.columns = [];
        this.$http({
          url: this.$http.adornUrl(`/form/table/dbcolumns/${this.dataForm.tablename}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data.columns);
          if (data && data.code === 0) {
            var _columns = data.columns;
            if(_columns) {
              for(var c of _columns) {
                var _collength = 0;
                var _colprecision = 0;
                if(c.DATA_TYPE == 'bigint' || c.DATA_TYPE == 'decimal') {
                  _collength = c.NUMERIC_PRECISION;
                  _colprecision = c.NUMERIC_SCALE;
                }
                else {
                  _collength = c.CHARACTER_MAXIMUM_LENGTH;
                }
                var _isprimay = '0';
                if(c.COLUMN_KEY == 'PRI') {
                  _isprimay = '1';
                }

                this.dataForm.columns.push({
                  colkey: c.COLUMN_NAME,
                  colname: c.COLUMN_COMMENT,
                  coltype: c.DATA_TYPE,
                  collength: _collength,
                  colprecision: _colprecision,
                  defalutval: c.COLUMN_DEFAULT,
                  isprimay: _isprimay,
                  isforeignkey: '',
                  fortable: '',
                  forcolumn: '',
                  fortype: '',
                  enumtype: ''
                });
              }
            }
          }
        })
      },
      closeDialog() {
        this.$emit('refreshDataList')
      }
    },
    mounted() {
      this.$http({
        url: this.$http.adornUrl('/form/module/all'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.modules = data.modules;
        }
      })
    }
  }
</script>
