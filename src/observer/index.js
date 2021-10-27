import { def } from "../util"
import { arrayMethods } from "./array"
import Dep from "./dep"

class Observer {
    constructor(data) {
        let dep = new Dep()
        this.dep = dep
        def(data, '__ob__', this) // 追加__ob__属性
        if (Array.isArray(data)) {
            // 改变原型链  使其指向arrayMethods
            data.__proto__ = arrayMethods
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
    observeArray(item) {
        for (let i = 0; i < item.length; i++) {
            observe(item[i])
        }
    }
}
function defineReactive(data, key, value) {
    if (arguments.length === 2) {
        value = data[key]
    }
    let childOb = observe(value)

    let dep = new Dep()

    Object.defineProperty(data, key, {
        get() {
            //访问该属性  将属性跟watcher对应 
            if (Dep.target) {
                // 将当前watcher存起来
                // 订阅 依赖收集
                dep.depend()
                // console.log(dep);
                // 如果访问了子节点 递归订阅子节点
                // console.log(dep.subs);
                if (childOb) {
                    // 深度订阅
                    childOb.dep.depend()
                    // 对数组进行依赖收集  数组只能在七种方法上进行派发更新
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            if (newValue == value) return
            // 将值改为对象  为该对象进行监听
            childOb = observe(newValue)
            value = newValue
            // 发布 派发更新
            dep.notify()
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data == null) {
        return;
    }
    let ob;
    if (Object.hasOwn(data, '__ob__')) {
        ob = data.__ob__
    } else {
        ob = new Observer(data)
    }
    return ob
}
export function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i]
        e && e.__ob__ && e.__ob__.dep.depend()
        if (Array.isArray(e)) {
            dependArray(e)
        }
    }
}