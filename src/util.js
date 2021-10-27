export function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key]
        },
        set(newValue) {
            vm[data][key] = newValue
        }
    })
}
export function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}
export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted', -
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured'
]
const strats = {}
strats.data = function (parentValue, childValue) {
    return childValue
}
strats.computed = function () {

}
strats.watch = function (parentValue, childValue) {
    return childValue
}
// 生命周期合并
function mergeHook(parentValue, childValue) {
    if (childValue) {
        if (parentValue) {
            // 父子都有 合并
            return parentValue.concat(childValue)
        } else {
            // 只有子
            return [childValue]
        }
    } else {
        // 子无 用父
        return parentValue
    }
}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
});
export function mergeOptions(parent, child) {
    function mergeField(key) {
        if (strats[key]) {
            // 有就合并
            return options[key] = strats[key](parent[key], child[key])
        } else {
            return options[key] = child[key]
        }
        // return strats[key](parent[key],child[key])
    }
    const options = {}
    for (const key in parent) {
        // 父子都有
        options[key] = mergeField(key);
    }
    for (const key in child) {
        // 子有 父无  将子多余的合并到父上
        if (!parent.hasOwnProperty(key)) {
            options[key] = mergeField(key);
        }
    }
    return options
}
const callbacks = []
let pending = false
function flushCallbacks() {
    while (callbacks.length) {
        let cb = callbacks.shift()
        cb()
    }
    pending = false  // 已经执行完毕
}
let timerFunc;
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {
    // 可以监控dom的变化 监控完毕后异步更新
    let observe = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1)
    observe.observe(textNode, { characterData: true })
    timerFunc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks)
    }
}
// 异步只需要一次  所以也需要判定
export function nextTick(cb) {
    callbacks.push(cb)
    if (!pending) {
        timerFunc()
        pending = true
    }
}