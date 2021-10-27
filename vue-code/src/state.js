import { observe } from "./observer/index";
import Watcher from "./observer/watcher";
import { nextTick, proxy } from "./util";
export function initState(vm) { // vm.$options
    const opts = vm.$options;
    if (opts.props) initProps(vm)
    if (opts.methods) initMethods(vm)
    if (opts.data) initData(vm)
    if (opts.computed) initComputed(vm)
    if (opts.watch) initWatch(vm)
}

function initProps(vm) {

}
function initMethods(vm) {
    let methods = vm.$options.methods
    vm._methods = methods
    // 将vm._data.msg => vm.msg
    for (let key in methods) {
        proxy(vm, '_methods', key)
    }
    observe(methods)
}
function initData(vm) {
    let data = vm.$options.data
    vm._data = data = typeof data == 'function' ? data.call(vm) : data;
    // 将vm._data.msg => vm.msg
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(data)
}
function initComputed(vm) {

}
function initWatch(vm) {
    let watch = vm.$options.watch
    for (const key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            // handler是数组
            handler.forEach((handle) => {
                createWatcher(vm, key, handle)
            })
        } else {
            // handler是字符串 对象 函数
            createWatcher(vm, key, handler)
        }
    }
}
function createWatcher(vm, exprOrFn, handler, options = {}) {
    // options 表示用户调用$watcher
    if (typeof handler === 'object') {
        // 'a':{
        //     handler(){

        //     },
        //     async:true
        // }
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        // watch:{
        //     'a':'getList'
        // },
        // methods: {
        //     getList(){
        //         console.log('getList');
        //     }
        // },
        handler = vm[handler]
    }
    // key handler options配置
    return vm.$watch(exprOrFn,handler,options)
}

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
        nextTick(cb)
    }
    Vue.prototype.$watch = function (exprOrFn,handler,options) {
        // 数据变化应该让这个watcher重新执行
        let watcher = new Watcher(this,exprOrFn,handler,{...options,user:true})
        if(options.immediate){
            handler() //如果是immediate 应该立刻执行
        }
    }
}