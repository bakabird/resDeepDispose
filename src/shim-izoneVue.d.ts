import Vue from 'vue'

declare module 'vue/types/vue' {
  // 可以使用 `VueConstructor` 接口
  // 来声明全局属性
  interface VueConstructor {
    isDev: boolean
    rootPath: string
    domain: string
    members: any
    canUseWebp: boolean
    log(...args: any): any;
    error(...args: any): any;
    getNetVal(key: string): Promise<any>
    setNetVal(key: string, value: string): Promise<any>
    getMsg(serviceName: string, pac: any): Promise<any>
  }
  interface Vue {
    $record(a: string , b: string, c: string, d?: string): void;
  }
}


