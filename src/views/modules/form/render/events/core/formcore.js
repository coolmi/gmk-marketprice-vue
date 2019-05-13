// const handler = {
//   get: function(obj, prop) {
//     console.log(obj);
//     return obj.formcore[prop];
//   },
//   set: function(obj, prop, value) {
//     obj.formcore[prop] = value;
//   }
// };
//#代理Proxy请参考 https://www.cnblogs.com/wwhhq/p/8196217.html

import {get, post, adornUrl} from '@/utils/request'
import {objToUrl} from '@/utils/typeUtil'
import httpRequest from "../../../../../../utils/httpRequest";

export default function (formName, form, formconfig) {
  var formcore = {
    _formName: formName,
    _form: form,
    _request: {
      get: get,
      post: post,
    },
    validator: function() {
      let _this = this;
      return {
        unique(rule, value, callback) {   //唯一性校验
          let _message = this.message;
          _this._request.post('/form/data/unique/'+_this._formName+'/'+this.field, _this._form.getFormData(), function(data){
            if(data.status == false) {
              callback(new Error(_message));
            }
            else {
              callback();
            }
          });
        },
      }
    },
    _initTable: function(initTableUrl) {
      var _form0 = this._form;
      var _formName0 = this._formName;
      var _formParams = this._form.getFormParams();
      this._request.get(initTableUrl, _formParams, function (data) {
        if (data && data.code === 0) {
          _form0.setFormKeyData(_formName0, data.formData);
        }
        else {
          _form0.$message.error(data.msg)
        }
      });
    },
    _initForm: function(initFormUrl, initEmptyFormFunc) {
      var _form0 = this._form;
      var _formParams = this._form.getFormParams();
      this._request.get(initFormUrl, _formParams, function (data) {
        if (data && data.code === 0) {
          if(data.formData != null && typeof data.formData != 'undefined' && Object.keys(data.formData).length>0) {
            _form0.setFormData(data.formData);
          }
          else {
            if(initEmptyFormFunc) {
              initEmptyFormFunc();
            }
          }
        }
        else {
          _form0.$message.error(data.msg)
        }
      });
    },
    _initEmptyForm: function(initEmptyFormUrl) {
      var _form0 = this._form;
      var _formParams = this._form.getFormParams();
      this._request.get(initEmptyFormUrl, _formParams, function (data) {
        if (data && data.code === 0) {
          if(data.formData != null && typeof data.formData != 'undefined' && Object.keys(data.formData).length>0) {
            _form0.setFormData(data.formData);
            for(var ikey in data.formData) {
              _form0.setFormParam(ikey, data.formData[ikey]);
            }
          }
        }
        else {
          _form0.$message.error(data.msg)
        }
      });
    },
    _initPratUI(initPratUIFormUrl, column) {
      //局部刷新列表
      var _form0 = this._form;
      // var _formName0 = this._formName;
      var _formParams = this._form.getFormParams();
      this._request.get(initPratUIFormUrl, _formParams, function(data) {
        if (data && data.code === 0) {
          if(data.formData) {
            for(var nkey in data.formData) {
              _form0.setFormKeyData(nkey, data.formData[nkey]);
            }
          }
        }
      });
    },
    _addRow: function(event, btnFunc) {
      var _formParams = this._form.getFormParams();
      this._form.openSubForm(btnFunc.toFormName, btnFunc.state, _formParams);
    },
    _editRow: function(event, btnFunc) {
      var selectionList = this._form.getSelectionList(btnFunc.tableColumn);
      if(selectionList && selectionList.length == 1) {
        this._form.openSubForm(btnFunc.toFormName, btnFunc.state, selectionList[0]);
      }
      else {
        this._form.$message.error("请选择一行")
      }
    },
    _viewRow: function(event, btnFunc) {
      var selectionList = this._form.getSelectionList(btnFunc.tableColumn);
      if(selectionList && selectionList.length == 1) {
        this._form.openSubForm(btnFunc.toFormName, btnFunc.state, selectionList[0]);
      }
      else {
        this._form.$message.error("请选择一行")
      }
    },
    _deleteRow: function(event, btnFunc, deletePostUrl, callback) {
      var selectionList = this._form.getSelectionList(btnFunc.tableColumn);
      if(selectionList && selectionList.length == 1) {
				var tempForm = this._form;
        this._form.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post(deletePostUrl, selectionList[0], function (data) {
            if (data && data.code === 0) {
              tempForm.$message({
                showClose: true,
                message: '删除成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  callback();
                }
              });
            } else {
              tempForm.$message.error(data.msg)
            }
          });
        }).catch(() => {})
      }
      else {
        this._form.$message.error("请选择一行")
      }
    },
    _deleteRows: function(event, btnFunc, deletePostUrl, callback) {
      var selectionList = this._form.getSelectionList(btnFunc.tableColumn);
      if(selectionList && selectionList.length > 0) {
        var tempForm = this._form;
        this._form.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post(deletePostUrl, {
            entities: selectionList
          }, function (data) {
            if (data && data.code === 0) {
              tempForm.$message({
                showClose: true,
                message: '删除成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  callback();
                }
              });
            } else {
              tempForm.$message.error(data.msg)
            }
          });
        }).catch(() => {})
      }
      else {
        this._form.$message.error("请选择一行")
      }
    },
    _saveFormData: function(event, btnFunc, savePostUrl, callback) {
      var _form0 = this._form;
      _form0.validate(function () {
        post(savePostUrl, _form0.getFormData(), function (data) {
          if (data && data.code === 0) {
            _form0.$message({
              showClose: true,
              message: '保存成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                callback();
              }
            });
          } else {
            _form0.$message.error(data.msg)
          }
        });
      });
    },
    _exportTable: function(event, btnFunc, exportTableUrl) {
      if(!exportTableUrl) {
        exportTableUrl = btnFunc.href;
      }
      if(!exportTableUrl) {
        exportTableUrl = '/form/data/export/' + this._formName;
      }
      let link = document.createElement('a');
      link.style.display = 'none';
      var _formParams = this._form.getFormParams();
      if(exportTableUrl.indexOf('?') != -1) {
        exportTableUrl = exportTableUrl + "&" + objToUrl(_formParams);
      }
      else {
        exportTableUrl = exportTableUrl + "?" + objToUrl(_formParams);
      }
      link.href = adornUrl(exportTableUrl);
      // link.download = btnFunc.fileName;
      // document.body.appendChild(link);
      link.click();
    }
  };
  if(formconfig.methods != null && typeof formconfig.methods != 'undefined') {
    for(var methodkey in formconfig.methods) {
      formcore[methodkey] = formconfig.methods[methodkey];
    }
  }
  formcore.validator = formcore.validator();
  if(formconfig.rules != null && typeof formconfig.rules != 'undefined') {
    formcore.rules = formconfig.rules;
    formcore.rules = formcore.rules();  //方法转对象
  }
  return formcore;
}
