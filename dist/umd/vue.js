(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function proxy(vm, data, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[data][key];
        },
        set: function set(newValue) {
          vm[data][key] = newValue;
        }
      });
    }
    function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
      });
    }
    var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', -'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured'];
    var strats = {};

    strats.data = function (parentValue, childValue) {
      return childValue;
    };

    strats.computed = function () {};

    strats.watch = function (parentValue, childValue) {
      return childValue;
    }; // 生命周期合并


    function mergeHook(parentValue, childValue) {
      if (childValue) {
        if (parentValue) {
          // 父子都有 合并
          return parentValue.concat(childValue);
        } else {
          // 只有子
          return [childValue];
        }
      } else {
        // 子无 用父
        return parentValue;
      }
    }

    LIFECYCLE_HOOKS.forEach(function (hook) {
      strats[hook] = mergeHook;
    });
    function mergeOptions(parent, child) {
      function mergeField(key) {
        if (strats[key]) {
          // 有就合并
          return options[key] = strats[key](parent[key], child[key]);
        } else {
          return options[key] = child[key];
        } // return strats[key](parent[key],child[key])

      }

      var options = {};

      for (var key in parent) {
        // 父子都有
        options[key] = mergeField(key);
      }

      for (var _key in child) {
        // 子有 父无  将子多余的合并到父上
        if (!parent.hasOwnProperty(_key)) {
          options[_key] = mergeField(_key);
        }
      }

      return options;
    }
    var callbacks = [];
    var pending$1 = false;

    function flushCallbacks() {
      while (callbacks.length) {
        var cb = callbacks.shift();
        cb();
      }

      pending$1 = false; // 已经执行完毕
    }

    var timerFunc;

    if (Promise) {
      timerFunc = function timerFunc() {
        Promise.resolve().then(flushCallbacks);
      };
    } else if (MutationObserver) {
      // 可以监控dom的变化 监控完毕后异步更新
      var observe$1 = new MutationObserver(flushCallbacks);
      var textNode = document.createTextNode(1);
      observe$1.observe(textNode, {
        characterData: true
      });

      timerFunc = function timerFunc() {
        textNode.textContent = 2;
      };
    } else if (setImmediate) {
      timerFunc = function timerFunc() {
        setImmediate(flushCallbacks);
      };
    } else {
      timerFunc = function timerFunc() {
        setTimeout(flushCallbacks);
      };
    } // 异步只需要一次  所以也需要判定


    function nextTick(cb) {
      callbacks.push(cb);

      if (!pending$1) {
        timerFunc();
        pending$1 = true;
      }
    }

    function initGlobalApi(Vue) {
      Vue.options = {};

      Vue.mixin = function (mixin) {
        // 选项合并
        this.options = mergeOptions(this.options, mixin);
      };
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    /*render(h) {
        return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),_c('h1',null,_v('{{msg}}')))
    },*/
    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    function genProps(attrs) {
      // 属性处理
      var str = '';

      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        if (attr.name === 'style') {
          (function () {
            var obj = {};
            attr.value.split(';').forEach(function (item) {
              var _item$trim$split = item.trim().split(":"),
                  _item$trim$split2 = _slicedToArray(_item$trim$split, 2),
                  key = _item$trim$split2[0],
                  value = _item$trim$split2[1];

              obj[key] = value;
            });
            attr.value = obj;
          })();
        }

        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      }

      return "{".concat(str.slice(0, -1), "}");
    }

    function gen(node) {
      // 文本 or 标签
      if (node.type == 1) {
        // 标签节点  递归调用generate
        return generate(node);
      } else {
        var text = node.text; // 普通文本 or 模板语法

        if (!defaultTagRE.test(text)) {
          return "_v(".concat(JSON.stringify(text), ")");
        }

        var tokens = []; // 存放模板代码

        var match, index;
        var lastIndex = defaultTagRE.lastIndex = 0; // 全局模式 每次将lastIndex置0 要不然会出问题

        while (match = defaultTagRE.exec(text)) {
          index = match.index; // 保存匹配到的索引
          // 说明模板语法前面还有普通的字符串  先把普通的字符串push进tokens数组

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          } // 之后把模板语法的字符串加上_s() push进去


          tokens.push("_s(".concat(match[1].trim(), ")")); // 最后更新lastIndex的位置

          lastIndex = index + match[0].length;
        } // 匹配完模板语法 如果还有没匹配到的说明是普通字符串


        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }

    function genChildren(ast) {
      var children = ast.children;

      if (children) {
        return children.map(function (child) {
          return gen(child);
        }).join(',');
      }
    }

    function generate(ast) {
      var children = genChildren(ast);
      var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length ? "".concat(genProps(ast.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
      return code;
    }

    var ncname = '[a-zA-Z_][\\w\\-\\.]*'; // 匹配标签名 <a-b> </a-b>

    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // ?:匹配但不捕获 <my:xxx> </my:xxx>

    var startTagOpen = new RegExp("^<".concat(qnameCapture));
    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var startTagClose = /^\s*(\/?)>/;
    function parseHTML(html) {
      function createASTElement(tagName, attrs) {
        return {
          tag: tagName,
          type: 1,
          children: [],
          attrs: attrs,
          parent: null
        };
      }

      function start(tagName, attrs) {
        var element = createASTElement(tagName, attrs);

        if (!root) {
          root = element;
        }

        currentParent = element;
        stack.push(element); // console.log(tagName, attrs, '— — — — — — — — — 开始标签 — — — — — — — — —');
      }

      function end(tagName) {
        // 标签闭合的时候  确定谁是谁的爹 谁是谁的儿
        var element = stack.pop();
        currentParent = stack[stack.length - 1];

        if (currentParent) {
          element.parent = currentParent;
          currentParent.children.push(element);
        } // console.log(tagName, '— — — — — — — — — 结束标签 — — — — — — — — —');

      }

      function chars(text) {
        text = text.trim();

        if (text) {
          currentParent.children.push({
            type: 3,
            text: text
          });
        } // console.log(text, '— — — — — 文本标签 — — — — —');

      }

      function parseStartTag() {
        // 匹配开头
        var start = html.match(startTagOpen);

        if (start) {
          var match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length); // 删除开始标签

          var _end, attr; // 不是结尾标签  且能匹配到属性


          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
          }

          if (_end) {
            advance(_end[0].length);
            return match;
          }
        }
      }

      function advance(n) {
        // 将解析的字符串删掉  更新字符串
        html = html.substring(n);
      } // <div id="app">
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


      var root,
          currentParent,
          stack = [];

      while (html) {
        //只要html不为空就一直解析   
        var textEnd = html.indexOf('<'); // 肯定是标签  有可能是开始  也有可能是结束

        if (textEnd == 0) {
          var startTagMatch = parseStartTag(); // 开始标签匹配的结果

          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }

          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]);
            continue;
          }
        }

        var text = void 0;

        if (textEnd > 0) {
          // 文本节点  因为textEnd > 0 此时的textEnd的位置应该是结束标签的位置   因此截取从0到结束标签前  都是文本节点
          text = html.substring(0, textEnd);

          if (text) {
            advance(text.length);
            chars(text);
            continue;
          }
        }
      }

      return root;
    }

    function compileToFunctions(template) {
      var ast = parseHTML(template); // 解析HTML成ast语法树
      //优化静态节点 

      var code = generate(ast); // 通过ast树 重新生成html代码
      // 用with取this身上的值

      var render = new Function("with(this){return ".concat(code, "}")); // 将字符串变成可执行的函数

      return render;
    }

    var id$1 = 0;

    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);

        this.subs = [];
        this.id = id$1++;
      }

      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          // watcher也要存dep 然后在watcher中调addDep在dep存watcher
          Dep.target.addDep(this);
        }
      }, {
        key: "notify",
        value: function notify() {
          this.subs.forEach(function (watcher) {
            watcher.update();
          });
        }
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          // watcher是渲染使用的  因此可以有多个 猜想在这里要使用nextTick 只渲染最新的watcher
          this.subs.push(watcher);
        }
      }]);

      return Dep;
    }();

    Dep.target = null;
    function pushTarget(watcher) {
      Dep.target = watcher; // 使当前的watcher成为活跃的watcher
    }
    function popTarget(watcher) {
      Dep.target = null;
    } // 一个属性就有一个dep 用来收集watcher

    var id = 0;
    var queue = []; // 将批量更新的watcher存入一个队列 异步渲染

    var has = {}; // 对watcher去重

    var pending = false; // 定时器状态

    var Watcher = /*#__PURE__*/function () {
      // vm实例
      // exprOrFn vm._update(vm._render)
      // cb 钩子函数
      // 是否为渲染watcher
      function Watcher(vm, exprOrFn, cb) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, Watcher);

        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options;
        this.isWatcher = !!options;
        this.deps = []; // watcher记录当时个dep依赖自己

        this.depsId = new Set();
        this.id = id++; // 唯一标识

        if (typeof exprOrFn === 'function') {
          this.getter = exprOrFn;
        }

        this.get(); // 默认调用getter
      }

      _createClass(Watcher, [{
        key: "get",
        value: function get() {
          pushTarget(this); // 将watcher实例传入 声明当前正在渲染的watcher

          this.getter(); // 调用exprOrFn 渲染页面

          popTarget(); //同上
        }
      }, {
        key: "update",
        value: function update() {
          // 异步渲染
          queueWatcher(this); // this.get()
        }
      }, {
        key: "addDep",
        value: function addDep(dep) {
          var id = dep.id; // 保证相同的dep只存一次

          if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
          }
        }
      }, {
        key: "run",
        value: function run() {
          this.get(); // 异步渲染逻辑
        }
      }]);

      return Watcher;
    }();

    function flushSchedulerQueue() {
      queue.forEach(function (watcher) {
        watcher.run();
        callHook(watcher.vm, 'updated');
      });
      queue = [];
      has = {};
      pending = false;
    }

    function queueWatcher(watcher) {
      var id = watcher.id;

      if (has[id] == null) {
        // 对watcher去重
        queue.push(watcher);
        watcher.cb();
        has[id] = true; // 放入异步队列

        if (!pending) {
          // 如果还没清空定时器  就不会开启定时器
          nextTick(flushSchedulerQueue);
          pending = true;
        }
      }
    }

    function patch(oldVnode, newVnode) {
      var el = createElm(newVnode); // 产生真实dom

      var parentElm = oldVnode.parentNode; //获取oldVnode的父元素

      parentElm.insertBefore(el, oldVnode.nextSibling); //当前的真实dom插到老元素下一个的前面

      parentElm.removeChild(oldVnode); // 删除老节点

      return el;
    }

    function createElm(vnode) {
      var tag = vnode.tag,
          children = vnode.children;
          vnode.key;
          vnode.data;
          var text = vnode.text;

      if (typeof tag === 'string') {
        // 创建元素  放到vnode.el上
        vnode.el = document.createElement(tag); // 更新属性 

        updateProperties(vnode); // 遍历子节点  递归调用createElm生成真实dom

        children.forEach(function (child) {
          vnode.el.appendChild(createElm(child));
        });
      } else {
        vnode.el = document.createTextNode(text);
      }

      return vnode.el;
    }

    function updateProperties(vnode) {
      var el = vnode.el;
      var newProps = vnode.data || {};

      for (var key in newProps) {
        if (key == 'style') {
          for (var styleName in newProps.style) {
            el.style[styleName] = newProps.style[styleName];
          }
        } else if (key == 'class') {
          el.className = newProps["class"];
        } else {
          el.setAttribute(key, newProps[key]);
        }
      }
    }

    function lifecycleMixin(Vue) {
      Vue.prototype._update = function (vnode) {
        var vm = this; // 更新$el

        vm.$el = patch(vm.$el, vnode);
      };
    }
    function mountComponent(vm, el) {
      callHook(vm, 'beforeMount'); // 调用render方法渲染el属性
      // 先调用render创建虚拟节点  再将虚拟节点渲染到页面上

      var updateComponent = function updateComponent() {
        vm._update(vm._render());
      }; // 渲染watcher 


      new Watcher(vm, updateComponent, function () {
        callHook(vm, 'beforeUpdate');
      }, true); // 将属性跟watcher绑定在一起  一个组件对应一个watcher

      callHook(vm, 'mounted');
    }
    function callHook(vm, hook) {
      var handlers = vm.$options[hook];

      if (handlers) {
        if (!Array.isArray(handlers)) handlers.call(vm);else {
          for (var i = 0; i < handlers.length; i++) {
            handlers[i].call(vm); // 调用钩子函数  指向生命周期的this
          }
        }
      }
    }

    // 拿到数组原型上的方法
    var arrayProto = Array.prototype; // 继承这些方法并对这些方法进行拦截

    var arrayMethods = Object.create(arrayProto); // 定义需要重写的七种方法

    var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    methodsToPatch.forEach(function (method) {
      arrayMethods[method] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // this Observer中的data
        var res = arrayProto[method].apply(this, args);
        var ob = this.__ob__;
        var inserted; // 要插入的数据

        switch (method) {
          case 'push': //arr.push({},{})

          case 'unshift':
            inserted = args;
            break;

          case 'splice':
            // vue.$set
            inserted = args.slice(2); // arr.splice(0,1,{a:1})  0 1 2 第二个是新增对象

            break;
        } // 对新增的值进行发布订阅 派发更新


        if (inserted) ob.observeArray(inserted); // console.log('调用'+method);

        ob.dep.notify(); // 返回七种方法的返回值

        return res;
      };
    });

    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);

        var dep = new Dep();
        this.dep = dep;
        def(data, '__ob__', this); // 追加__ob__属性

        if (Array.isArray(data)) {
          // 改变原型链  使其指向arrayMethods
          data.__proto__ = arrayMethods;
          this.observeArray(data);
        } else {
          this.walk(data);
        }
      }

      _createClass(Observer, [{
        key: "walk",
        value: function walk(obj) {
          var keys = Object.keys(obj);

          for (var i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
          }
        }
      }, {
        key: "observeArray",
        value: function observeArray(item) {
          for (var i = 0; i < item.length; i++) {
            observe(item[i]);
          }
        }
      }]);

      return Observer;
    }();

    function defineReactive(data, key, value) {
      if (arguments.length === 2) {
        value = data[key];
      }

      var childOb = observe(value);
      var dep = new Dep();
      Object.defineProperty(data, key, {
        get: function get() {
          //访问该属性  将属性跟watcher对应 
          if (Dep.target) {
            // 将当前watcher存起来
            // 订阅 依赖收集
            dep.depend();
            console.log(dep); // 如果访问了子节点 递归订阅子节点
            // console.log(dep.subs);

            if (childOb) {
              // 深度订阅
              childOb.dep.depend(); // 对数组进行依赖收集  数组只能在七种方法上进行派发更新

              if (Array.isArray(value)) {
                dependArray(value);
              }
            }
          }

          return value;
        },
        set: function set(newValue) {
          if (newValue == value) return; // 将值改为对象  为该对象进行监听

          childOb = observe(newValue);
          value = newValue; // 发布 派发更新

          dep.notify();
        }
      });
    }

    function observe(data) {
      if (_typeof(data) !== 'object' || data == null) {
        return;
      }

      var ob;

      if (Object.hasOwn(data, '__ob__')) {
        ob = data.__ob__;
      } else {
        ob = new Observer(data);
      }

      return ob;
    }
    function dependArray(value) {
      for (var e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();

        if (Array.isArray(e)) {
          dependArray(e);
        }
      }
    }

    function initState(vm) {
      // vm.$options
      var opts = vm.$options;
      if (opts.props) ;
      if (opts.methods) initMethods(vm);
      if (opts.data) initData(vm);
      if (opts.computed) ;
      if (opts.watch) initWatch(vm);
    }

    function initMethods(vm) {
      var methods = vm.$options.methods;
      vm._methods = methods; // 将vm._data.msg => vm.msg

      for (var key in methods) {
        proxy(vm, '_methods', key);
      }

      observe(methods);
    }

    function initData(vm) {
      var data = vm.$options.data;
      vm._data = data = typeof data == 'function' ? data.call(vm) : data; // 将vm._data.msg => vm.msg

      for (var key in data) {
        proxy(vm, '_data', key);
      }

      observe(data);
    }

    function initWatch(vm) {
      var watch = vm.$options.watch;

      var _loop = function _loop(key) {
        var handler = watch[key];

        if (Array.isArray(handler)) {
          // handler是数组
          handler.forEach(function (handle) {
            createWatcher(vm, key, handle);
          });
        } else {
          // handler是字符串 对象 函数
          createWatcher(vm, key, handler);
        }
      };

      for (var key in watch) {
        _loop(key);
      }
    }

    function createWatcher(vm, exprOrFn, handler) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      // options 表示用户调用$watcher
      if (_typeof(handler) === 'object') {
        // 'a':{
        //     handler(){
        //     },
        //     async:true
        // }
        options = handler;
        handler = handler.handler;
      }

      if (typeof handler === 'string') {
        // watch:{
        //     'a':'getList'
        // },
        // methods: {
        //     getList(){
        //         console.log('getList');
        //     }
        // },
        handler = vm[handler];
      } // key handler options配置


      return vm.$watch(exprOrFn, handler, options);
    }

    function stateMixin(Vue) {
      Vue.prototype.$nextTick = function (cb) {
        nextTick(cb);
      };

      Vue.prototype.$watch = function (exprOrFn, handler, options) {
        console.log(exprOrFn, handler, options);
        console.log(123);
      };
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this; // vm.constructor.options == Vue.options || 子组件的options
        // 合并options到当前组件上

        vm.$options = mergeOptions(vm.constructor.options, options); // 将用户自定义的options与全局Vue.options合并

        callHook(vm, 'beforeCreate');
        initState(vm);
        callHook(vm, 'created');

        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      }; // 挂载操作 render template el


      Vue.prototype.$mount = function (el) {
        var vm = this;
        var options = vm.$options;
        el = document.querySelector(el);
        vm.$el = el;

        if (!options.render) {
          var template = options.template;

          if (!template && el) {
            template = el.outerHTML;
          }

          var render = compileToFunctions(template);
          options.render = render;
        }

        mountComponent(vm);
      };
    }

    function renderMixin(Vue) {
      // 创建元素
      Vue.prototype._c = function () {
        return createElement.apply(void 0, arguments);
      }; // stringify


      Vue.prototype._s = function (value) {
        return value == null ? '' : _typeof(value) == 'object' ? JSON.stringify(value) : value;
      }; // 文本元素


      Vue.prototype._v = function (text) {
        return createTextVnode(text);
      }; // 调用render


      Vue.prototype._render = function () {
        var vm = this;
        var render = vm.$options.render;
        var vnode = render.call(vm);
        return vnode;
      };
    }

    function createElement(tag) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }

      return vnode(tag, data, data.key, children);
    }

    function createTextVnode(text) {
      return vnode(undefined, undefined, undefined, undefined, text);
    } // 描述虚拟dom


    function vnode(tag, data, key, children, text) {
      return {
        tag: tag,
        data: data,
        key: key,
        children: children,
        text: text // componentsInstance:'',

      };
    }

    function Vue(options) {
      this._init(options); // 初始化操作

    } // 原型方法


    initMixin(Vue); // init

    lifecycleMixin(Vue); // _update

    renderMixin(Vue); // _render

    stateMixin(Vue); // 更新状态  nextTick
    // 静态方法

    initGlobalApi(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
