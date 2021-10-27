import { initGlobalApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { stateMixin } from "./state";
import { renderMixin } from "./vdom/index";
// 在这扩展原型
function Vue(options) {
    this._init(options); // 初始化操作
}

// 原型方法

initMixin(Vue); // init
lifecycleMixin(Vue); // _update
renderMixin(Vue); // _render
stateMixin(Vue); // 更新状态  nextTick
// 静态方法
initGlobalApi(Vue);


export default Vue