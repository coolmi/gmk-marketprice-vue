
export default {
  methods: {
    init() {
      this._initTable('/form/data/pagelist/' + this._formName);
    },
    initPratUI(column) {  //局部刷新
      this.init();
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
          _this.init();
        });
      }
      else if(btnFunc.function == 'deleteRows') {
        this._deleteRows(event, btnFunc, '/form/data/deleteList/' + this._formName + "?column=" + btnFunc.tableColumn, function() {
          _this.init();
        });
      }
      else if(btnFunc.function == 'openLink') {
        this._exportTable(event, btnFunc);
      }
      else {
        console.log('没有找到该按钮的方法');
      }
    },
    // sex_formatter: function(row, column, cellValue, index) {
    //   if(cellValue=='1') {
    //     return '男'
    //   }
    //   else if(cellValue=='2') {
    //     return '女'
    //   }
    //   return '';
    // }
  }
}
