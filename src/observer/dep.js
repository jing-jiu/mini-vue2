let id = 0;

class Dep {
    constructor(){
        this.subs = []
        this.id = id++
    }
    depend(){
        // watcher也要存dep 然后在watcher中调addDep在dep存watcher
        Dep.target.addDep(this)
    }
    notify(){
        this.subs.forEach((watcher)=>{
            watcher.update()
        })
    }
    addSub(watcher){
        // watcher是渲染使用的  因此可以有多个 猜想在这里要使用nextTick 只渲染最新的watcher
        this.subs.push(watcher)
    }
}
Dep.target = null
export function pushTarget(watcher) {
    Dep.target = watcher // 使当前的watcher成为活跃的watcher
}

export function popTarget(watcher) {
    Dep.target = null
}
// 一个属性就有一个dep 用来收集watcher
export default Dep