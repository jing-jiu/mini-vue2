import { callHook } from "../lifecycle";
import { nextTick } from "../util";
import { popTarget, pushTarget } from "./dep";

let id = 0;
let queue = [] // 将批量更新的watcher存入一个队列 异步渲染
let has = {} // 对watcher去重
let pending = false // 定时器状态
class Watcher {
    // vm实例
    // exprOrFn vm._update(vm._render)
    // cb 钩子函数
    // 是否为渲染watcher
    constructor(vm, exprOrFn, cb, options = {}) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.user = options.user // 说明是用户自己定义的watcher
        this.isWatcher = typeof options === 'boolean'
        this.deps = [] // watcher记录当时个dep依赖自己
        this.depsId = new Set()
        this.id = id++  // 唯一标识

        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        }else{
            // 传过来的是字符串
            this.getter = function () {
                let path = exprOrFn.split('.')
                let obj = vm
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        }
        // 默认先调用一次get方法取值
        this.value = this.get() // 默认调用getter  存到value中 如果数据用get方法更新  那么此时的value就是老值
    }
    get() {
        pushTarget(this) // 将watcher实例传入 声明当前正在渲染的watcher
        let result = this.getter() // 调用exprOrFn 渲染页面
        popTarget(this) //同上
        return result
    }
    update() {
        // 异步渲染
        queueWatcher(this)
        // this.get()
    }
    addDep(dep) {
        let id = dep.id
        // 保证相同的dep只存一次
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    run() {
        let newValue = this.get() // 异步渲染逻辑
        let oldValue = this.value
        this.value = newValue
        if(this.user){
            this.cb.call(this.vm,newValue,oldValue)
        }
    }
}
function flushSchedulerQueue() {
    queue.forEach(watcher => {
        watcher.run()
        callHook(watcher.vm,'updated')
    })
    queue = []
    has = {}
    pending = false
}
function queueWatcher(watcher) {
    const id = watcher.id
    if (has[id] == null) { // 对watcher去重
        queue.push(watcher)
        if(!watcher.user){
            watcher.cb()
        }
        has[id] = true
        // 放入异步队列
        if (!pending) {// 如果还没清空定时器  就不会开启定时器
            nextTick(flushSchedulerQueue)
            pending = true
        }
    }
}

export default Watcher