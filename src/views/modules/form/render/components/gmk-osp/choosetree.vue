<template>
  <div>

    <el-row>
      <el-col :span="12">
        <el-input class="input_inlie" style="width: 57%" size="mini"
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>
        <el-button size="mini" style="width: 40%" v-if="chooseType === 'S'" type="primary" @click="searchPostByItcode">搜索岗位</el-button>
        <el-button size="mini" style="width: 40%" v-if="chooseType === 'O'" type="primary" @click="searchOrg">搜索组织</el-button>
        <el-button size="mini" style="width: 40%" v-if="chooseType === 'P'" type="primary" @click="searchItcode">搜索人员</el-button>

        <div style="height:320px;overflow: auto;padding: 10px 0px; border: 1px solid #eee; margin-top: 10px">
          <el-tree v-if="mulCheck"
                   class="filter-tree"
                   :lazy="true"
                   :data="data2"
                   :load="loadNode"
                   :props="defaultProps"
                   :expand-on-click-node="false"
                   :check-on-click-node="true"
                   :check-strictly="true"
                   accordion
                   show-checkbox
                   highlight-current
                   node-key="id"
                   @check-change="checkChange1"
                   :default-expanded-keys="idArr"
                   ref="tree">
          </el-tree>

          <!--tree2实现了单选 设置点击节点才会展开树 by zbm 2018-09-13 19:47:06 -->
          <el-tree v-if="!mulCheck" style="margin-top: 15px"
                   class="filter-tree"
                   :lazy="true"
                   :data="data2"
                   :load="loadNode"
                   :props="defaultProps"
                   :expand-on-click-node="false"
                   accordion
                   highlight-current
                   node-key="id"
                   @node-click="nodeClick"
                   :default-expanded-keys="idArr"
                   ref="tree2">
          </el-tree>
          <!-- tree 实现了多选 check-strictly属性设置为true,父子不相关 选择组织的时候不会把子组织的属性同时也带进来 by zbm 2018-09-14 08:41:48 -->
        </div>
      </el-col>

      <el-col :span="12">
        <div style="height: 20px">
          已选部门/人员<br/>
          (单击或双击即可去除某一项):
        </div>
        <div
          style="height:300px;overflow: auto;padding:0px 15px; border: 0px solid #eee; margin-top: 40px;margin-left: 10px">
          <el-radio-group v-model="radioValue" size="small" @change="onRadioChange">
            <el-radio
              v-for="(item, index) in vplist"
              :key="index"
              :label="item.value"
              :value="item.label">{{item.label}}
            </el-radio>
          </el-radio-group>
        </div>

      </el-col>
    </el-row>


  </div>


</template>
<script>
  import common from './common'

  export default {
    name: 'choosetree',
    props: {
      mulCheck: {
        type: Boolean,
        default: false
      },
      chooseType: {
        type: String,
        default: 'S'
      },
      rootorg: {
        type: String
      },
      isxskg: {
        type: Boolean,
        default: false
      },
      isonlyxskg: {
        type: Boolean,
        default: false
      },
      isinitpost: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      filterText() {
        this.filterText = this.filterText.trim()
      },
      data2() {
        let _that = this
        _that.renderCheckNode()
        if (this.data2 !== null) {
          let data = this.data2[0]
          let type = data.pId
          if (type === 'O') {
            let id = data.id
            // 'O11000000#OOSP#-1#DOWN'
            // id = id.substr(1, id.indexOf('%') - 1)
            this.idArr.push(id)
          }
        }
      },
      editCheckId() {
        let _that = this
        if (_that.editCheckId === '') {
          _that.vplist = []
        } else {
          _that.vplist = []
          this.plist = _that.editCheckId.split(',')
          this.txtplist = _that.editCheckName.split(',')
          for (let i = 0; i < _that.plist.length; i++) {
            const rerulist = {
              value: this.plist[i],
              label: this.txtplist[i]
            }
            _that.vplist.push(rerulist)
          }
        }
      }
    },
    methods: {
      init() {
        this.vplist = []
        this.getInitZtreeData()
      },
      onRadioChange(val) {
        let v = {}
        v = this.vplist.find((item) => {
          return item.value === val
        })
        let txt = v.label
        this.tagClose(val)
        this.tagNameClose(txt)

        this.$emit('trasferVal', this.editCheckId, this.editCheckName)
        this.$emit('input', this.editCheckId)

        this.radioValue = ''
      },
      // 这个过滤的钩子函数是根据返回true or false 来确定是否显示节点 并不适用 改成了 按钮返回数据重新渲染
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 标签删除函数
      tagClose(tag) {
        // 取消选中
        let index = this.editCheckId.indexOf(tag)
        // 取消选择第一个
        if (index === 0) {
          let temp = this.editCheckId.indexOf(',', index)
          // 如果长度为1 直接置空
          if (temp === -1) {
            this.editCheckId = ''
          } else {
            // 如果长度大于1 从 temp+1 位置开始截取 此处不能用 10 ，因为岗位长度不规定 by zbm 2018-09-03 17:09:16
            this.editCheckId = this.editCheckId.substr(temp + 1)
          }
          // 取消选择最后一个
        } else {
          let index = this.editCheckId.indexOf(tag)
          let taglength = tag.length + 1
          if (this.editCheckId.substr((index + taglength), this.editCheckId.length) === '') {
            this.editCheckId = this.editCheckId.substr(0, index - 1)
          } else {
            this.editCheckId = this.editCheckId.substr(0, index) + this.editCheckId.substr((index + taglength), this.editCheckId.length)
          }
        }
      },
      // 标签删除函数
      tagNameClose(tag) {
        // 取消选中
        let index = this.editCheckName.indexOf(tag)
        // 取消选择第一个
        if (index === 0) {
          let temp = this.editCheckName.indexOf(',', index)
          // 如果长度为1 直接置空
          if (temp === -1) {
            this.editCheckName = ''
          } else {
            // 如果长度大于1 从 temp+1 位置开始截取 此处不能用 10 ，因为岗位长度不规定 by zbm 2018-09-03 17:09:16
            this.editCheckName = this.editCheckName.substr(temp + 1)
          }
          // 取消选择最后一个
        } else {
          let index = this.editCheckName.indexOf(tag)
          let taglength = tag.length + 1
          if (this.editCheckName.substr((index + taglength), this.editCheckName.length) === '') {
            this.editCheckName = this.editCheckName.substr(0, index - 1)
          } else {
            this.editCheckName = this.editCheckName.substr(0, index) + this.editCheckName.substr((index + taglength), this.editCheckName.length)
          }
        }
      },
      // 渲染选中的节点，放在初始化节点
      renderCheckNode() {
        let _that = this
        for (let item in _that.data2) {
          if (_that.editCheckId.indexOf(item.id) > -1) {
            if (_that.mulCheck) {
              _that.$refs.tree2.setCheckedKeys([item.id])
            }
            _that.$refs.tree.setCheckedKeys([item.id])
          }
        }
      },
      getInitZtreeData() {
        let _that = this
        common.getInitZtreeParamData(this.rootorg, this.isinitpost, this.isxskg, this.isonlyxskg).then(res => {
          _that.data2 = res.data
        })
      },
      // 根据岗位信息获取 itcode信息 by zbm 2018-09-13 19:08:21
      getItcodeByPostid(objid, item, node) {
        let _that = this
        common.getItcodeByPostid(objid).then(res => {
          let _data = res.data;
          if (_data.loginName !== undefined) {
            if (_that.mulCheck) {
              if (_that.editCheckId === '') {
                _that.editCheckId += _data.loginName
              } else {
                _that.editCheckId += ',' + _data.loginName
              }
            } else {
              _that.editCheckId = _data.loginName
            }
          } else {
            // 岗位没有人时，取消掉点击时的选中状态 by zbm 2018年09月14日10:55:02
            this.$refs.tree.setChecked(item.id, false, false)
            this.$message('该岗位暂无人员，请重新选择')
            return
          }
        })
      },
      /**
       * 点击节点 根据节点加载数据
       */
      getZtreeDataByNode(node, resolve) {
        // #在接收时会被截断 发现后台使用的是 替换 所以 这个地方也使用替换
        let id = node.data.id.replace(/#/g, '%23')
        common.getZtreeDataParmByNode(id, this.rootorg, this.isinitpost, this.isxskg, this.isonlyxskg).then(res => {
          let list = res.data
          let data = []
          for (let item of list) {
            data.push({
              id: item.id,
              name: item.name
            })
          }
          // ****** 注意 此处是加载子节点数据
          resolve(data)
        })
      },
      // 根据人名或者itcode 搜索
      searchPostByItcode() {
        let _that = this
        common.getZtreeDataPramByItcode(_that.filterText, this.rootorg, this.isinitpost, this.isxskg, this.isonlyxskg).then(res => {
          _that.data2 = res.data
        })
      },
      // 根据组织搜索
      searchOrg() {
        let _that = this
        common.getZtreeDataPramByOrg(_that.filterText, this.rootorg, this.isinitpost, this.isxskg, this.isonlyxskg).then(res => {
          _that.data2 = res.data
        })
      },
      // 搜索itcode
      searchItcode() {
        let _that = this
        common.getZtreeDataPramByItcode(_that.filterText, this.rootorg, this.isinitpost, this.isxskg, this.isonlyxskg).then(res => {
          _that.data2 = res.data
        })
      },
      // 点击加载子节点数据
      loadNode(node, resolve) {
        let _that = this
        if (node.level === 0) {
          _that.getInitZtreeData()
        } else {
          _that.getZtreeDataByNode(node, resolve)
        }
      },
      // 节点点击
      nodeClick(item, node, self) {
        let _that = this
        let nodeid = item.id
        if (nodeid.indexOf('#') !== -1) {
          nodeid = nodeid.substring(0, nodeid.indexOf('#'))
        }
        let otype = nodeid.substring(0, 1) // 选中的类型  O S
        let objid = nodeid.substring(1, nodeid.length) // 编号
        // 判断是否可以 by zbm 2018-09-13 18:50:49
        if (_that.chooseType === 'O') {
          if (otype !== 'O') {
            this.$message('选择类型不对')
            this.$refs.tree2.setChecked(item.id, false, false)
            return
          }
        } else if (_that.chooseType === 'S') {
          if (otype !== 'S') {
            this.$message('选择类型不对')
            this.$refs.tree2.setChecked(item.id, false, false)
            return
          }
        } else if (_that.chooseType === 'P') {
          if (otype !== 'S') {
            this.$message('选择类型不对')
            this.$refs.tree2.setChecked(item.id, false, false)
            return
          }
        }
        // 如果是选择itcode 那么 需要传递 objid 获取人员itcode  by zbm 2018-09-13 19:04:23
        if (_that.chooseType === 'P') {
          common.getItcodeByPostid(objid).then(res => {
            let _data = res.data;
            if (_data.loginName !== undefined) {
              if (_that.mulCheck) {
                if (_that.editCheckId === '') {
                  _that.editCheckId += _data.loginName
                } else {
                  _that.editCheckId += ',' + _data.loginName
                }
              } else {
                _that.editCheckId = _data.loginName
              }
              this.editCheckName = item.name
              this.$refs.tree2.setCheckedKeys([item.id])
              this.$emit('trasferVal', this.editCheckId, this.editCheckName)
              this.$emit('input', this.editCheckId)
            } else {
              // 岗位没有人时，取消掉点击时的选中状态 by zbm 2018年09月14日10:55:02
              this.$refs.tree.setChecked(item.id, false, false)
              this.$message('该岗位暂无人员，请重新选择')
              return
            }
          })
        } else {
          this.editCheckId = objid
          this.editCheckName = item.name
          this.$refs.tree2.setCheckedKeys([item.id])
          this.$emit('trasferVal', this.editCheckId, this.editCheckName)
          this.$emit('input', this.editCheckId)
        }
      },
      // 取消选中
      unCheck(objid) {
        let _that = this
        let index = _that.editCheckId.indexOf(objid)
        let len = objid.length
        // 取消选择第一个
        if (index === 0) {
          let temp = _that.editCheckId.indexOf(',', index)
          // 如果长度为1 直接置空
          if (temp === -1) {
            _that.editCheckId = ''
            _that.editCheckName = ''
          } else {
            // 如果长度大于1 从 temp+1 位置开始截取 此处不能用 10 ，因为岗位长度不规定
            _that.editCheckId = _that.editCheckId.substr(temp + 1)
            _that.editCheckName = _that.editCheckName.substr(temp + 1)
          }
          // 取消选择最后一个
        } else if (index + len === _that.editCheckId.length) {
          _that.editCheckId = _that.editCheckId.substr(0, index - 1)
          _that.editCheckName = _that.editCheckName.substr(0, index - 1)
          // 取消选择其他
        } else {
          let temp = _that.editCheckId.indexOf(',', index)
          _that.editCheckId = _that.editCheckId.substr(0, index) + _that.editCheckId.substr(temp + 1)
          _that.editCheckName = _that.editCheckName.substr(0, index) + _that.editCheckName.substr(temp + 1)
        }
      },
      // 取消选中
      unCheck2(objid) {
        let _that = this
        let index = _that.editCheckId.indexOf(objid)
        // 取消选择第一个
        if (index === 0) {
          let temp = _that.editCheckId.indexOf(',', index)
          // 如果长度为1 直接置空
          if (temp === -1) {
            _that.editCheckId = ''
          } else {
            // 如果长度大于1 从 temp+1 位置开始截取 此处不能用 10 ，因为岗位长度不规定
            _that.editCheckId = _that.editCheckId.substr(temp + 1)
          }
          // 取消选择最后一个
        } else {
          let index = this.editCheckId.indexOf(objid)
          let taglength = objid.length + 1
          if (this.editCheckId.substr((index + taglength), this.editCheckId.length) === '') {
            this.editCheckId = this.editCheckId.substr(0, index - 1)
          } else {
            this.editCheckId = this.editCheckId.substr(0, index) + this.editCheckId.substr((index + taglength), this.editCheckId.length)
          }
        }
      },
      // 取消选中
      unNameCheck(objid) {
        let _that = this
        let index = _that.editCheckName.indexOf(objid)
        // 取消选择第一个
        if (index === 0) {
          let temp = _that.editCheckName.indexOf(',', index)
          // 如果长度为1 直接置空
          if (temp === -1) {
            _that.editCheckName = ''
          } else {
            // 如果长度大于1 从 temp+1 位置开始截取 此处不能用 10 ，因为岗位长度不规定
            _that.editCheckName = _that.editCheckName.substr(temp + 1)
          }
          // 取消选择最后一个
        } else {
          let index = this.editCheckName.indexOf(objid)
          let taglength = objid.length + 1
          if (this.editCheckName.substr((index + taglength), this.editCheckName.length) === '') {
            this.editCheckName = this.editCheckName.substr(0, index - 1)
          } else {
            this.editCheckName = this.editCheckName.substr(0, index) + this.editCheckName.substr((index + taglength), this.editCheckName.length)
          }
        }
      },
      // 多选
      checkChange1(item, node, self) {
        this.radioValue = ''
        let _that = this
        let nodeid = item.id
        if (nodeid.indexOf('#') !== -1) {
          nodeid = nodeid.substring(0, nodeid.indexOf('#'))
        }
        let otype = nodeid.substring(0, 1) // 选中的类型  O S
        let objid = nodeid.substring(1, nodeid.length) // 编号
        // 点击节点 是否与所选择的类型匹配
        if (_that.chooseType === 'O') {
          if (otype !== 'O') {
            this.$message('选择类型不对')
            this.$refs.tree.setChecked(item.id, false, false)
            return
          }
        } else if (_that.chooseType === 'S') {
          if (otype !== 'S') {
            this.$message('选择类型不对')
            this.$refs.tree.setChecked(item.id, false, false)
            return
          }
        } else if (_that.chooseType === 'P') {
          if (otype !== 'S') {
            this.$message('选择类型不对')
            this.$refs.tree.setChecked(item.id, false, false)
            return
          }
        }
        if (node === true) { // 点击未选中复选框
          // 如果选人时
          if (_that.chooseType === 'P') {
            common.getItcodeByPostid(objid).then(res => {
              let _data = res.data;
              if (_data.loginName !== undefined) {
                if (_that.mulCheck) {
                  if (_that.editCheckId.indexOf(_data.loginName) !== -1) {
                    this.$message('itcode人员重复')
                    _that.$refs.tree.setChecked(item.id, false, false)
                  }
                  if (_that.editCheckId === '') {
                    _that.editCheckId += _data.loginName
                    _that.editCheckName += item.name
                  } else {
                    _that.editCheckId += ',' + _data.loginName
                    _that.editCheckName += ',' + item.name
                  }
                } else {
                  _that.editCheckId = _data.loginName
                  _that.editCheckName = item.name
                }
              } else {
                // 岗位没有人时，取消掉点击时的选中状态 by zbm 2018年09月14日10:55:02
                this.$refs.tree.setChecked(item.id, false, false)
                this.$message('该岗位暂无人员，请重新选择')
                return
              }
              this.$emit('trasferVal', this.editCheckId, this.editCheckName)
              this.$emit('input', this.editCheckId)
            })
          } else {
            if (_that.editCheckId === '') {
              _that.editCheckId += objid
              _that.editCheckName += item.name
            } else {
              _that.editCheckId += ',' + objid
              _that.editCheckName += ',' + item.name
            }
            this.$emit('trasferVal', this.editCheckId, this.editCheckName)
            this.$emit('input', this.editCheckId)
          }
        } else {
          // 取消选中 itcode时
          if (_that.chooseType === 'P') {
            common.getItcodeByPostid(objid).then(res => {
              let _data = res.data;
              if (_data.loginName !== undefined) {
                if (this.editCheckId.indexOf(_data.loginName) !== -1) {
                  _that.unCheck2(_data.loginName)
                  _that.unNameCheck(item.name)
                  this.$emit('trasferVal', this.editCheckId, this.editCheckName)
                  this.$emit('input', this.editCheckId)
                }
              } else {
                // 岗位没有人时，取消掉点击时的选中状态 by zbm 2018年09月14日10:55:02
                this.$refs.tree.setChecked(item.id, false, false)
                this.$message('该岗位暂无人员，请重新选择')
                return
              }
            })
          } else {
            if (this.editCheckId.indexOf(objid) !== -1) {
              _that.unCheck2(objid)
              _that.unNameCheck(item.name)
              this.$emit('trasferVal', this.editCheckId, this.editCheckName)
              this.$emit('input', this.editCheckId)
            }
          }
        }
      }
    },
    data() {
      return {
        plist: [],
        txtplist: [],
        vplist: [],
        editCheckId: '',
        editCheckName: '',
        filterText: '',
        data2: [],
        idArr: [],
        radioValue: '',
        defaultProps: {
          label: 'name',
          id: 'id',
          children: 'children'
        }
      }
    }
  }
</script>
<style scoped>
  .input_inlie {
    width: calc(100% - 105px)
  }

  .el-radio {
    margin-left: 30px;
  }
</style>
