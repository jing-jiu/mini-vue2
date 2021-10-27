/*render(h) {
    return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),_c('h1',null,_v('{{msg}}')))
},*/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
    // 属性处理
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach((item) => {
                let [key, value] = item.trim().split(":")
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}
function gen(node) {
    // 文本 or 标签
    if (node.type == 1) {
        // 标签节点  递归调用generate
        return generate(node)
    } else {
        let text = node.text
        // 普通文本 or 模板语法
        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})`
        }
        let tokens = [] // 存放模板代码
        let match,index;
        let lastIndex = defaultTagRE.lastIndex = 0; // 全局模式 每次将lastIndex置0 要不然会出问题
        while (match = defaultTagRE.exec(text)) {
            index = match.index  // 保存匹配到的索引
            // 说明模板语法前面还有普通的字符串  先把普通的字符串push进tokens数组
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            // 之后把模板语法的字符串加上_s() push进去
            tokens.push(`_s(${match[1].trim()})`)
            // 最后更新lastIndex的位置
            lastIndex = index + match[0].length 
        }
        // 匹配完模板语法 如果还有没匹配到的说明是普通字符串
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`;
    }
}
function genChildren(ast) {
    const children = ast.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}
export function generate(ast) {
    let children = genChildren(ast)
    let code = `_c('${ast.tag}',${
        ast.attrs.length ? `${genProps(ast.attrs)}` : 'undefined'
    }${
        children ? `,${children}` : ''
    })`;
    return code
}