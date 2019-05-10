export default {
  formName: '',
  init(formName) {
    this.formName = formName;

    return {
      demo: [
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
