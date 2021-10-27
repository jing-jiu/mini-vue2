import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this

        // 更新$el
        vm.$el = patch(vm.$el,vnode)
    }
}


export function mountComponent(vm, el) {
    callHook(vm,'beforeMount');
    // 调用render方法渲染el属性
    // 先调用render创建虚拟节点  再将虚拟节点渲染到页面上
    let updateComponent = ()=>{
        vm._update(vm._render());
    };
    // 渲染watcher 
    new Watcher(vm,updateComponent,()=>{
        callHook(vm,'beforeUpdate')
    },true)
    // 将属性跟watcher绑定在一起  一个组件对应一个watcher
    callHook(vm,'mounted');
}

export function callHook(vm,hook) {
    const handlers = vm.$options[hook]
    if(handlers){
        if(!Array.isArray(handlers)) handlers.call(vm)
        else{
            for (let i = 0; i < handlers.length; i++) {
                handlers[i].call(vm) // 调用钩子函数  指向生命周期的this
            }
        }
    }
}