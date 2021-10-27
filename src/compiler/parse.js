const ncname = '[a-zA-Z_][\\w\\-\\.]*'
// 匹配标签名 <a-b> </a-b>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// ?:匹配但不捕获 <my:xxx> </my:xxx>
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

export function parseHTML(html) {
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1,
            children: [],
            attrs,
            parent: null
        }
    }
    function start(tagName, attrs) {
        let element = createASTElement(tagName, attrs)
        if (!root) {
            root = element
        }
        currentParent = element
        stack.push(element)
        // console.log(tagName, attrs, '— — — — — — — — — 开始标签 — — — — — — — — —');
    }
    function end(tagName) {
        // 标签闭合的时候  确定谁是谁的爹 谁是谁的儿
        let element = stack.pop()
        currentParent = stack[stack.length - 1]
        if (currentParent) {
            element.parent = currentParent
            currentParent.children.push(element)
        }
        // console.log(tagName, '— — — — — — — — — 结束标签 — — — — — — — — —');
    }
    function chars(text) {
        text = text.trim();
        if (text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
        // console.log(text, '— — — — — 文本标签 — — — — —');
    }
    function parseStartTag() {
        // 匹配开头
        let start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length) // 删除开始标签
            let end, attr;
            // 不是结尾标签  且能匹配到属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
                return match
            }
        }
    }
    function advance(n) {
        // 将解析的字符串删掉  更新字符串
        html = html.substring(n)
    }
    // <div id="app">
    //     <h1>{{msg}}</h1>
    // </div>

    // ast语法树

    // {
    //     tag:'div',
    //     attrs:[{id:'app'}],
    //     parent:null,
    //     type:1,
    //     children:[
    //         {
    //             attrs:[],
    //             tag:'h1',
    //             children:[],
    //             text:{{msg}},
    //             parent:父div
    //         }
    //     ]
    // }  
    let root, currentParent, stack = [];
    while (html) {
        //只要html不为空就一直解析   
        let textEnd = html.indexOf('<')
        // 肯定是标签  有可能是开始  也有可能是结束
        if (textEnd == 0) {
            let startTagMatch = parseStartTag(); // 开始标签匹配的结果
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }

            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        let text;
        if (textEnd > 0) {
            // 文本节点  因为textEnd > 0 此时的textEnd的位置应该是结束标签的位置   因此截取从0到结束标签前  都是文本节点
            text = html.substring(0, textEnd)
            if (text) {
                advance(text.length)
                chars(text);
                continue
            }
        }
    }
    return root
}