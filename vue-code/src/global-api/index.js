import { mergeOptions } from "../util";

export function initGlobalApi(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
        // 选项合并
        this.options = mergeOptions(this.options,mixin)
    }
} 