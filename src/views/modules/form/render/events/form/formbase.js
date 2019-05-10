
export default {
  // rules() {
  //   var _this = this;
  //   var checkAge = (rule, value, callback) => {
  //     _this._request.post('/form/data/unique/'+_this._formName+'/age', _this._form.getFormData(), function(data){
  //       if(data.status == false) {
  //         callback(new Error('违反唯一性校验'));
  //       }
  //     });
  //   };
  //   return {
  //     age: [
  //       { validator: checkAge, trigger: 'blur' }
  //     ]
  //   }
  // },
  methods: {
    init() {
      let _this = this;
      this._initForm('/form/data/info/' + this._formName, function() {
        _this._initEmptyForm('/form/data/initEmptyForm/' + _this._formName);  ////初始化ID
      });
    },
    initPratUI(column) {
      //局部刷新列表
      this._initPratUI('/form/data/infoByColumn/' + this._formName + '/' + column, column)
    },
    btn_click: function(event, funcDefition) {
      var btnFunc = JSON.parse(funcDefition);
      console.log(btnFunc);

      var _this = this;
      if(btnFunc.function == 'addRow') {
        this._addRow(event, btnFunc);
      }
      else if(btnFunc.function == 'editRow') {
        this._editRow(event, btnFunc);
      }
      else if(btnFunc.function == 'viewRow') {
        this._viewRow(event, btnFunc);
      }
      else if(btnFunc.function == 'deleteRow') {
        this._deleteRow(event, btnFunc, '/form/data/delete/' + this._formName + "?column=" + btnFunc.tableColumn, function() {
          _this.initPratUI(btnFunc.tableColumn);
        });
      }
      else if(btnFunc.function == 'deleteRows') {
        this._deleteRows(event, btnFunc, '/form/data/deleteList/' + this._formName + "?column=" + btnFunc.tableColumn, function() {
          _this.initPratUI(btnFunc.tableColumn);
        });
      }
      else if(btnFunc.function == 'saveForm') {
        var _form0 = this._form;
        this._saveFormData(event, btnFunc, '/form/data/saveOrUpdate/' + this._formName, function() {
          _form0.closeAndRefreshList({
            fromFormName: btnFunc.fromFormName,
            tableColumn: btnFunc.tableColumn,
          });
        });
      }
      else {
        console.log('没有找到该按钮的方法');
      }
    }

  }
}
