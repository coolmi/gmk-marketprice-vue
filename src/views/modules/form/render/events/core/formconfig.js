/*
* 返回对象，代表全局通用一个对象
* */
var formcore = {
  crMap: new Map(),
  add(formName, formCore) {
    this.crMap.set(formName, formCore);
  },
  get(formName) {
    return this.crMap.get(formName);
  },
  has(formName) {
    return this.crMap.has(formName)
  }
}
export default formcore

