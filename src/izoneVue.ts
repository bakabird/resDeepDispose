const izoneVue: any = {};
import axios from 'axios'

izoneVue.install = (Vue: any, options: any) => {
  // 1. 添加全局方法或属性
  Vue.isDev = process.env.NODE_ENV === 'development'
  // production
  Vue.rootPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8360' : '';
  // Vue.myGlobalMethod = function () {
  //   // 逻辑...
  // }
  Vue.getNetVal = (key: string) => {
    return axios.get(`${Vue.rootPath}/util/getVal?key=${key}`)
  }

  Vue.log = (firstArg, ...restArg) => {
    if (Vue.isDev) {
      // tslint:disable-next-line
      console.log(firstArg, ...restArg)
    }
  }
  Vue.error = (firstArg, ...restArg) => {
    if (Vue.isDev) {
      // tslint:disable-next-line
      console.error(firstArg, ...restArg)
    }
  }
  Vue.members = {
    圆: '🐰',
    樱: '🌸',
    柔: '🐹',
    椰: '🐥',
    安: '🐶',
    奈: '🐦',
    权: '🍊',
    惠: '🍴',
    仁: '🍓',
    彩: '👗',
    珉: '🐸',
    燕: '💃',
  }


  // // 2. 添加全局资源
  // Vue.directive('my-directive', {
  //   bind (el, binding, vnode, oldVnode) {
  //     // 逻辑...
  //   }
  //   ...
  // })

  // // 3. 注入组件
  // Vue.mixin({
  //   created: function () {
  //     // 逻辑...
  //   }
  //   ...
  // })

  // // 4. 添加实例方法
  Vue.prototype.$record = (a, b, c, d) => {
    if (!Vue.isDev) {
      const _hmt: any = (window as any)._hmt;
      _hmt.push(['_trackEvent', a, b, c, d]);
    }
  }
}
export default izoneVue;
