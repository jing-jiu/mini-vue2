export function patch(oldVnode, newVnode) {
    let el = createElm(newVnode) // 产生真实dom
    let parentElm = oldVnode.parentNode //获取oldVnode的父元素
    parentElm.insertBefore(el, oldVnode.nextSibling);//当前的真实dom插到老元素下一个的前面
    parentElm.removeChild(oldVnode) // 删除老节点
    return el
}

function createElm(vnode) {
    let { tag, children, key, data, text } = vnode
    if (typeof tag === 'string') {
        // 创建元素  放到vnode.el上
        vnode.el = document.createElement(tag)
        // 更新属性 
        updateProperties(vnode)
        // 遍历子节点  递归调用createElm生成真实dom
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        });
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
function updateProperties(vnode) {
    let el = vnode.el
    let newProps = vnode.data || {}
    for (const key in newProps) {
        if (key == 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key == 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}