// 拿到数组原型上的方法
let arrayProto = Array.prototype;

// 继承这些方法并对这些方法进行拦截

export const arrayMethods = Object.create(arrayProto);
// 定义需要重写的七种方法
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
methodsToPatch.forEach((method)=>{
    arrayMethods[method] = function (...args) {
        // this Observer中的data
        let res = arrayProto[method].apply(this,args)
        const ob = this.__ob__
        let inserted; // 要插入的数据
        switch (method) {
            case 'push'://arr.push({},{})
            case 'unshift':
                inserted = args;
                break;
            case 'splice': // vue.$set
                inserted = args.slice(2); // arr.splice(0,1,{a:1})  0 1 2 第二个是新增对象
                break;
            default:
                break;
        }
        // 对新增的值进行发布订阅 派发更新
        if(inserted) ob.observeArray(inserted);
        // console.log('调用'+method);
        ob.dep.notify()
        // 返回七种方法的返回值
        return res
    }
})