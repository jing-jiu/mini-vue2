import { generate } from "./generate";
import { parseHTML } from "./parse";


export function compileToFunctions(template) {
    let ast = parseHTML(template) // 解析HTML成ast语法树
    
    //优化静态节点 
    let code = generate(ast)// 通过ast树 重新生成html代码
    
    // 用with取this身上的值
    let render = new Function(`with(this){return ${code}}`)// 将字符串变成可执行的函数
    
    return render
}