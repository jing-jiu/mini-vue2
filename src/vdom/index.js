export function  renderMixin(Vue) {
    // 创建元素
    Vue.prototype._c = function () {
       return createElement(...arguments) 
    }
    // stringify
    Vue.prototype._s = function (value) {
        return value == null ? '' : (typeof value == 'object') ? JSON.stringify(value) : value
    }
    // 文本元素
    Vue.prototype._v = function (text) {
        return createTextVnode(text)
    }
    // 调用render
    Vue.prototype._render = function () {
        const vm  = this
        let render = vm.$options.render
        let vnode = render.call(vm)
        return vnode
    }
}
function createElement(tag,data={},...children) {
    return vnode(tag,data,data.key,children)
}
function createTextVnode(text) {
    return vnode(undefined,undefined,undefined,undefined,text)
}
// 描述虚拟dom
function vnode(tag,data,key,children,text) {
    return {
        tag,
        data,
        key,
        children,
        text,
        // componentsInstance:'',
    }
}