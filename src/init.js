import { compileToFunctions } from "./compiler/index"
import { callHook, mountComponent } from "./lifecycle"
import { initState } from "./state"
import { mergeOptions } from "./util"
// 在这扩展初始化方法
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this
        // vm.constructor.options == Vue.options || 子组件的options
        // 合并options到当前组件上
        vm.$options = mergeOptions(vm.constructor.options,options)
        // 将用户自定义的options与全局Vue.options合并
        callHook(vm,'beforeCreate');
        initState(vm)
        callHook(vm,'created');
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }
    // 挂载操作 render template el
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if(!options.render){
            let template = options.template
            if(!template && el){
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);
            options.render = render
        }
        mountComponent(vm,el)
    }
}