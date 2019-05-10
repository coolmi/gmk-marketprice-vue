export default {
  formName: '',
  init(formName) {
    this.formName = formName;

    return {
      name: '段其新',
      age: '12',
      position: '开发专员',
      department: '信息部',
      sex: '0',
      tab1: [
        {
          book: 'java编程思想',
          qianbi: '红色铅笔'
        },
        {
          book: 'Python核心API',
          qianbi: '黑色铅笔'
        }
      ]
    }
  }
}
