webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    var vm = avalon.define({
	        $id: "root"
	    });

	    avalon.state("app", { //公共模板页
	        url: "/",
	        abstract: true,
	        views: {
	            "": {
	                templateProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(1, function(tt) {
	                            rs(__webpack_require__(9))
	                        })
	                    })
	                },
	                controllerProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(2, function(tt) {
	                            rs(__webpack_require__(10))
	                        })
	                    })
	                }
	            }
	        }
	    }).state("app.home", { //首页
	        url: "home",
	        views: {
	            "": {
	                templateProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(3, function(tt) {
	                            rs(__webpack_require__(11))
	                        })
	                    })
	                },
	                controllerProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(4, function(tt) {
	                            rs(__webpack_require__(12))
	                        })
	                    })
	                }
	            }
	        }
	    }).state("app.aaa", { //aaa
	        url: "aaa",
	        views: {
	            "": {
	                templateProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(5, function(tt) {
	                            rs(__webpack_require__(13))
	                        })
	                    })
	                },
	                controllerProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(6, function(tt) {
	                            rs(__webpack_require__(14))
	                        })
	                    })
	                }
	            }
	        }
	    }).state("app.bbb", { //bbb
	        url: "bbb",
	        views: {
	            "": {
	                templateProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(7, function(tt) {
	                            rs(__webpack_require__(15))
	                        })
	                    })
	                },
	                controllerProvider: function() {
	                    return new Promise(function(rs) {
	                        __webpack_require__.e/* nsure */(8, function(tt) {
	                            rs(__webpack_require__(16))
	                        })
	                    })
	                }
	            }
	        }
	    });

	    avalon.state.config({
	        onError: function() {
	            console.log(arguments)
	        }
	    });
	    avalon.router.error(function() {
	        avalon.router.navigate('home')
	    });
	    avalon.history.start();
	    avalon.scan(0, vm);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * verson 0.9
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	//重写mmRouter中的route方法     
	    avalon.router.route = function (method, path, query, options) {
	        path = path.trim()
	        var states = this.routingTable[method]
	        for (var i = 0, el; el = states[i++]; ) {//el为一个个状态对象，状态对象的callback总是返回一个Promise
	            var args = path.match(el.regexp)
	            if (args && el.abstract !== true) {//不能是抽象状态
	                var newParams = {params: {}}
	                avalon.mix(newParams.params, el.params)
	                newParams.keys = el.keys
	                newParams.params.query = query || {}
	                args.shift()
	                if (el.keys.length) {
	                    this._parseArgs(args, newParams)
	                }
	                if (el.stateName) {
	                    mmState.transitionTo(mmState.currentState, el, newParams.params, options)
	                } else {
	                    el.callback.apply(el, args)
	                }
	                return
	            }
	        }
	        if (this.errorback) {
	            this.errorback()
	        }
	    }
	    var _root, undefine, _controllers = {}, _states = {}
	    /*
	     *  @interface avalon.router.go 跳转到一个已定义状态上，params对参数对象
	     *  @param toName 状态name
	     *  @param params 附加参数
	     *  @param params.query 在hash后面附加的类似search的参数对
	     *  @param options 扩展配置
	     *  @param options.reload true强制reload，即便url、参数并未发生变化
	     *  @param options.replace true替换history，否则生成一条新的历史记录
	     *  @param options.confirmed true不触发onBeforeUnload,$onBeforeUnload,onBeforeExit
	     */
	    avalon.router.go = function (toName, params, options) {
	        var from = mmState.currentState,
	                to = StateModel.is(toName) ? toName : getStateByName(toName),
	                params = params || {}
	        var params = avalon.mix(true, {}, to.params, params)
	        if (to) {
	            mmState.transitionTo(from, to, params, options)
	        }
	    }
	    // 事件管理器
	    var Event = window.$eventManager = avalon.define("$eventManager", function (vm) {
	        vm.$flag = 0;
	        vm.uiqKey = function () {
	            vm.$flag++
	            return "flag" + vm.$flag++
	        }
	    })
	    function removeOld() {
	        var nodes = mmState.oldNodes
	        while (nodes.length) {
	            var i = nodes.length - 1,
	                    node = nodes[i]
	            node.parentNode && node.parentNode.removeChild(node)
	            nodes.splice(i, 1)
	            node = null
	        }
	    }
	    Event.$watch("onAbort", removeOld)
	    var mmState = window.mmState = {
	        prevState: NaN,
	        currentState: NaN, // 当前状态，可能还未切换到该状态
	        activeState: NaN, // 当前实际处于的状态
	        oldNodes: [],
	        query: {}, // 从属于currentState
	        popOne: function (chain, params, callback, notConfirmed) {
	            if (mmState._toParams !== params)
	                return callback(false, {type: "abort"})
	            var cur = chain.pop(), me = this
	            if (!cur)
	                return callback()
	            // 阻止退出
	            if (notConfirmed && cur.onBeforeExit() === false)
	                return callback(false)
	            me.activeState = cur.parentState || _root
	            cur.done = function (success) {
	                cur._pending = false
	                cur.done = null
	                cur._local = null
	                if (success !== false) {
	                    if (me.activeState)
	                        return me.popOne(chain, params, callback, notConfirmed)
	                }
	                return callback(success)
	            }
	            var success = cur.onExit()
	            if (!cur._pending && cur.done)
	                cur.done(success)
	        },
	        pushOne: function (chain, params, callback, _local, toLocals) {
	            if (mmState._toParams !== params)
	                return callback(false, {type: "abort"})
	            var cur = chain.shift(), me = this
	            // 退出
	            if (!cur) {
	                chain = null
	                return callback()
	            }
	            cur.syncParams(params)
	            // 阻止进入该状态
	            if (cur.onBeforeEnter() === false) {
	                // 恢复params
	                cur.syncParams(cur.oldParams)
	                return callback(false)
	            }
	            var _local = inherit(_local)
	            me.activeState = cur // 更新当前实际处于的状态
	            cur.done = function (success) {
	                // 防止async处触发已经销毁的done
	                if (!cur.done)
	                    return
	                cur._pending = false
	                cur.done = null
	                cur.visited = true
	                // 退出
	                if (success === false) {
	                    // 这里斟酌一下 - 去掉
	                    // cur.callback.apply(cur, [params, _local])
	                    return callback(success)
	                }
	                var resolved = cur.callback.apply(cur, [params, _local])
	                resolved.$then(function (res) {
	                    // sync params to oldParams
	                    avalon.mix(true, cur.oldParams, cur.params)
	                    // 继续状态链
	                    me.pushOne(chain, params, callback, _local)
	                })
	            }
	            // 一般在这个回调里准备数据
	            var args = []
	            avalon.each(cur.keys, function (index, item) {
	                var key = item.name
	                args.push(cur.params[key])
	            })
	            cur._onEnter.apply(cur, args)
	            if (!cur._pending && cur.done)
	                cur.done()
	        },
	        transitionTo: function (fromState, toState, toParams, options) {
	            var toParams = toParams || toState.params, fromAbort
	            // state machine on transition
	            if (this.activeState && (this.activeState != this.currentState)) {
	                avalon.log("navigating to [" +
	                        this.currentState.stateName +
	                        "] will be stopped, redirect to [" +
	                        toState.stateName + "] now")
	                this.activeState.done && this.activeState.done(!"stopped")
	                fromState = this.activeState // 更新实际的fromState
	                fromAbort = true
	            }
	            mmState.oldNodes = []
	            var info = avalon.router.urlFormate(toState.url, toParams, toParams.query),
	                    me = this,
	                    options = options || {},
	                    // 是否强制reload，参照angular，这个时候会触发整个页面重刷
	                    reload = options.reload,
	                    over,
	                    fromChain = fromState && fromState.chain || [],
	                    toChain = toState.chain,
	                    i = 0,
	                    changeType, // 是params变化？query变化？这个东西可以用来配置是否屏蔽视图刷新逻辑
	                    state = toChain[i],
	                    _local = _root.sourceLocal,
	                    toLocals = []
	            if (!reload) {
	                // 找到共有父状态chain，params未变化
	                while (state && state === fromChain[i] && !state.paramsChanged(toParams)) {
	                    _local = toLocals[i] = state._local
	                    i++
	                    state = toChain[i]
	                }
	            }
	            var exitChain = fromChain.slice(i), // 需要退出的chain
	                    enterChain = toChain.slice(i), // 需要进入的chain
	                    commonLocal = _local
	            // 建立toLocals，用来计算哪些view会被替换
	            while (state = toChain[i]) {
	                _local = toLocals[i] = inherit(_local, state.sourceLocal)
	                i++
	            }
	            mmState._local = _local
	            done = function (success, e) {
	                if (over)
	                    return
	                over = true
	                me.currentState = me.activeState
	                enterChain = exitChain = commonLocal = _local = toParams = null
	                mmState.oldNodes = []
	                if (success !== false) {
	                    mmState.lastLocal = mmState.currentState._local
	                    _root.fire("updateview", me.currentState, changeType)
	                    avalon.log("transitionTo " + toState.stateName + " success")
	                    callStateFunc("onLoad", me, fromState, toState)
	                } else {
	                    return callStateFunc("onError", me, {
	                        type: "transition",
	                        message: "transitionTo " + toState.stateName + " faild",
	                        error: e,
	                        fromState: fromState,
	                        toState: toState,
	                        params: toParams
	                    }, me.currentState)
	                }
	            }
	            toState.path = ("/" + info.path).replace(/^[\/]{2,}/g, "/")
	            if (!reload && fromState === toState) {
	                changeType = toState.paramsChanged(toParams)
	                if (!changeType) {
	                    // redirect的目的状态 == this.activeState && abort
	                    if (toState == this.activeState && fromAbort)
	                        return done()
	                    // 重复点击直接return
	                    return
	                }
	            }

	            mmState.query = avalon.mix({}, toParams.query)

	            // onBeforeUnload check
	            if (options && !options.confirmed && (callStateFunc("onBeforeUnload", this, fromState, toState) === false || broadCastBeforeUnload(exitChain, enterChain, fromState, toState) === false)) {
	                return callStateFunc("onAbort", this, fromState, toState)
	            }
	            if (over === true) {
	                return
	            }
	            avalon.log("begin transitionTo " + toState.stateName + " from " + (fromState && fromState.stateName || "unknown"))
	            callStateFunc("onUnload", this, fromState, toState)
	            this.currentState = toState
	            this.prevState = fromState
	            mmState._toParams = toParams
	            if (info && avalon.history) {
	                if (avalon.history.updateLocation) {
	                    avalon.history.updateLocation(info.path + info.query,
	                            avalon.mix({silent: true}, options), !fromState && location.hash)
	                } else {
	                    avalon.history.navigate(info.path + info.query,
	                            avalon.mix({silent: true}, options))
	                }
	            }
	            callStateFunc("onBegin", this, fromState, toState)
	            this.popOne(exitChain, toParams, function (success) {
	                // 中断
	                if (success === false)
	                    return done(success)
	                me.pushOne(enterChain, toParams, done, commonLocal, toLocals)
	            }, !(options && options.confirmed))
	        }
	    }
	    //将template,templateUrl,templateProvider等属性从opts对象拷贝到新生成的view对象上的
	    function copyTemplateProperty(newObj, oldObj, name) {
	        if (name in oldObj) {
	            newObj[name] = oldObj[name]
	            delete  oldObj[name]
	        }
	    }
	    function getCacheContainer() {
	        return document.getElementsByTagName("avalon")[0]
	    }
	    var templateCache = {},
	            cacheContainer = getCacheContainer()
	    function loadCache(name) {
	        var fragment = document.createDocumentFragment(),
	                divPlaceHolder = document.getElementById(name),
	                f,
	                eles = divPlaceHolder.eles,
	                i = 0
	        if (divPlaceHolder) {
	            while (f = eles[i]) {
	                fragment.appendChild(f)
	                i++
	            }
	        }
	        return fragment
	    }
	    function setCache(name, element) {
	        var fragment = document.createDocumentFragment(),
	                divPlaceHolder = document.getElementById(name),
	                f
	        if (!divPlaceHolder) {
	            divPlaceHolder = document.createElement("div")
	            divPlaceHolder.id = name
	            cacheContainer.appendChild(divPlaceHolder)
	        }
	        // 引用
	        if (divPlaceHolder.eles) {
	            avalon.each(divPlaceHolder.eles, function (index, ele) {
	                fragment.appendChild(ele)
	            })
	        } else {
	            divPlaceHolder.eles = []
	            while (f = element.firstChild) {
	                fragment.appendChild(f)
	                divPlaceHolder.eles.push(f)
	            }
	            templateCache[name] = true
	        }
	        divPlaceHolder.appendChild(fragment)
	    }
	    function broadCastBeforeUnload(exitChain, enterChain, fromState, toState) {
	        var lastLocal = mmState.lastLocal
	        if (!lastLocal || !enterChain[0] && !exitChain[0])
	            return
	        var newLocal = mmState._local,
	                cacheQueue = []
	        for (var i in lastLocal) {
	            var local = lastLocal[i]
	            // 所有被更新的view
	            if (!(i in newLocal) || newLocal[i] != local) {
	                if (local.$ctrl && ("$onBeforeUnload" in local.$ctrl)) {
	                    if (local.$ctrl.$onBeforeUnload(fromState, toState) === false)
	                        return false
	                }
	                if (local.element && (exitChain[0] != enterChain[0]))
	                    cacheQueue.push(local)
	            }
	        }
	        avalon.each(cacheQueue, function (index, local) {
	            var ele = local.element,
	                    name = avalon(ele).data("currentCache")
	            if (name) {
	                setCache(name, ele)
	            }
	        })
	        cacheQueue = null
	    }
	    // 靠谱的解决方法
	    avalon.bindingHandlers.view = function (data) {
	        var vmodels = data.vmodels || arguments[1]
	        var currentState = mmState.currentState,
	                element = data.element,
	                $element = avalon(element),
	                viewname = data.value || data.expr || "",
	                comment = document.createComment("ms-view:" + viewname),
	                par = element.parentNode,
	                defaultHTML = element.innerHTML,
	                statename = $element.data("statename") || "",
	                parentState = getStateByName(statename) || _root,
	                currentLocal = {},
	                oldElement = element,
	                tpl = element.outerHTML
	        element.removeAttribute("ms-view") // remove right now
	        par.insertBefore(comment, element)
	        function update(firsttime, currentState, changeType) {
	            // node removed, remove callback
	            if (!document.contains(comment)) {
	                data = vmodels = element = par = comment = $element = oldElement = update = null
	                return !"delete from watch"
	            }
	            var definedParentStateName = $element.data("statename") || "",
	                    parentState = getStateByName(definedParentStateName) || _root,
	                    _local
	            if (viewname.indexOf("@") < 0)
	                viewname += "@" + parentState.stateName
	            _local = mmState.currentState._local && mmState.currentState._local[viewname]
	            if (firsttime && !_local || currentLocal === _local)
	                return
	            currentLocal = _local
	            _currentState = _local && _local.state
	            // 缓存，如果加载dom上，则是全局配置，针对template还可以开一个单独配置
	            var cacheTpl = $element.data("viewCache"),
	                    lastCache = $element.data("currentCache")
	            if (_local) {
	                cacheTpl = (_local.viewCache === false ? false : _local.viewCache || cacheTpl) && (viewname + "@" + _currentState.stateName)
	            } else if (cacheTpl) {
	                cacheTpl = viewname + "@__default__"
	            }
	            // stateB->stateB，配置了参数变化不更新dom
	            if (_local && _currentState === currentState && _local.ignoreChange && _local.ignoreChange(changeType, viewname))
	                return
	            // 需要load和使用的cache是一份
	            if (cacheTpl && cacheTpl === lastCache)
	                return
	            compileNode(tpl, element, $element, _currentState)
	            var html = _local ? _local.template : defaultHTML,
	                    fragment
	            if (cacheTpl) {
	                if (_local) {
	                    _local.element = element
	                } else {
	                    mmState.currentState._local[viewname] = {
	                        state: mmState.currentState,
	                        template: defaultHTML,
	                        element: element
	                    }
	                }
	            }
	            avalon.clearHTML(element)
	            // oldElement = element
	            element.removeAttribute("ms-view")
	            element.setAttribute("ui-view", data.value || data.expr || "")
	            // 本次更新的dom需要用缓存
	            if (cacheTpl) {
	                // 已缓存
	                if (templateCache[cacheTpl]) {
	                    fragment = loadCache(cacheTpl)
	                    // 未缓存
	                } else {
	                    fragment = avalon.parseHTML(html)
	                }
	                element.appendChild(fragment)
	                // 更新现在使用的cache名字
	                $element.data("currentCache", cacheTpl)
	                if (templateCache[cacheTpl])
	                    return
	            } else {
	                element.innerHTML = html
	                $element.data("currentCache", false)
	            }
	            // default
	            if (!_local && cacheTpl)
	                $element.data("currentCache", cacheTpl)
	            avalon.each(getViewNodes(element), function (i, node) {
	                avalon(node).data("statename", _currentState && _currentState.stateName || "")
	            })
	            // merge上下文vmodels + controller指定的vmodels
	            avalon.scan(element, (_local && _local.vmodels || []).concat(vmodels || []))
	            // 触发视图绑定的controller的事件
	            if (_local && _local.$ctrl) {
	                _local.$ctrl.$onRendered && _local.$ctrl.$onRendered.apply(element, [_local])
	            }
	        }
	        update("firsttime")
	        _root.watch("updateview", function (state, changeType) {
	            return update.call(this, undefine, state, changeType)
	        })
	    }
	    if (avalon.directives) {
	        avalon.directive("view", {
	            init: avalon.bindingHandlers.view
	        })
	    }
	    function compileNode(tpl, element, $element, _currentState) {
	        if ($element.hasClass("oni-mmRouter-slide")) {
	            // 拷贝一个镜像
	            var copy = element.cloneNode(true)
	            copy.setAttribute("ms-skip", "true")
	            avalon(copy).removeClass("oni-mmRouter-enter").addClass("oni-mmRouter-leave")
	            avalon(element).addClass("oni-mmRouter-enter")
	            element.parentNode.insertBefore(copy, element)
	            mmState.oldNodes.push(copy)
	            callStateFunc("onViewEnter", _currentState, element, copy)
	        }
	        return element
	    }

	    function inherit(parent, extra) {
	        return avalon.mix(new (avalon.mix(function () {
	        }, {prototype: parent}))(), extra);
	    }

	    /*
	     * @interface avalon.state 对avalon.router.get 进行重新封装，生成一个状态对象
	     * @param stateName 指定当前状态名
	     * @param opts 配置
	     * @param opts.url  当前状态对应的路径规则，与祖先状态们组成一个完整的匹配规则
	     * @param {Function} opts.ignoreChange 当mmState.currentState == this时，更新视图的时候调用该函数，return true mmRouter则不会去重写视图和scan，请确保该视图内用到的数据没有放到avalon vmodel $skipArray内
	     * @param opts.controller 如果不写views属性,则默认view为""，为默认的view指定一个控制器，该配置会直接作为avalon.controller的参数生成一个$ctrl对象
	     * @param opts.controllerUrl 指定默认view控制器的路径，适用于模块化开发，该情形下默认通过avalon.controller.loader去加载一个符合amd规范，并返回一个avalon.controller定义的对象，传入opts.params作参数
	     * @param opts.controllerProvider 指定默认view控制器的提供者，它可以是一个Promise，也可以为一个函数，传入opts.params作参数
	     @param opts.viewCache 是否缓存这个模板生成的dom，设置会覆盖dom元素上的data-view-cache，也可以分别配置到views上每个单独的view上
	     * @param opts.views: 如果不写views属性,则默认view【ms-view=""】为""，也可以通过指定一个viewname属性来配置【ms-view="viewname"】，对多个[ms-view]容器进行处理,每个对象应拥有template, templateUrl, templateProvider，可以给每个对象搭配一个controller||controllerUrl||controllerProvider属性
	     *     views的结构为
	     *<pre>
	     *     {
	     *        "": {template: "xxx"}
	     *        "aaa": {template: "xxx"}
	     *        "bbb@": {template: "xxx"}
	     *     }
	     *</pre>
	     *     views的每个键名(keyname)的结构为viewname@statename，
	     *         如果名字不存在@，则viewname直接为keyname，statename为opts.stateName
	     *         如果名字存在@, viewname为match[0], statename为match[1]
	     * @param opts.views.{viewname}.template 指定当前模板，也可以为一个函数，传入opts.params作参数，* @param opts.views.viewname.cacheController 是否缓存view的控制器，默认true
	     * @param opts.views.{viewname}.templateUrl 指定当前模板的路径，也可以为一个函数，传入opts.params作参数
	     * @param opts.views.{viewname}.templateProvider 指定当前模板的提供者，它可以是一个Promise，也可以为一个函数，传入opts.params作参数
	     * @param opts.views.{viewname}.ignoreChange 用法同state.ignoreChange，只是针对的粒度更细一些，针对到具体的view
	     * @param {Function} opts.onBeforeEnter 切入某个state之前触发，this指向对应的state，如果return false则会中断并退出整个状态机
	     * @param {Function} opts.onEnter 进入状态触发，可以返回false，或任意不为true的错误信息或一个promise对象，用法跟视图的$onEnter一致
	     * @param {Function} onEnter.params 视图所属的state的参数
	     * @param {Function} onEnter.resolve $onEnter return false的时候，进入同步等待，直到手动调用resolve
	     * @param {Function} onEnter.reject 数据加载失败，调用
	     * @param {Function} opts.onBeforeExit state退出前触发，this指向对应的state，如果return false则会中断并退出整个状态机
	     * @param {Function} opts.onExit 退出后触发，this指向对应的state
	     * @param opts.ignoreChange.changeType 值为"param"，表示params变化，值为"query"，表示query变化
	     * @param opts.ignoreChange.viewname 关联的ms-view name
	     * @param opts.abstract  表示它不参与匹配，this指向对应的state
	     * @param {private} opts.parentState 父状态对象（框架内部生成）
	     */
	    avalon.state = function (stateName, opts) {
	        var state = StateModel(stateName, opts)
	        avalon.router.get(state.url, function (params, _local) {
	            var me = this, promises = [], _resovle, _reject, _data = [], _callbacks = []
	            state.resolved = getPromise(function (rs, rj) {
	                _resovle = rs
	                _reject = rj
	            })
	            avalon.each(state.views, function (name, view) {
	                var params = me.params,
	                        reason = {
	                            type: "view",
	                            name: name,
	                            params: params,
	                            state: state,
	                            view: view
	                        },
	                viewLocal = _local[name] = {
	                    name: name,
	                    state: state,
	                    params: state.filterParams(params),
	                    ignoreChange: "ignoreChange" in view ? view.ignoreChange : me.ignoreChange,
	                    viewCache: "viewCache" in view ? view.viewCache : me.viewCache
	                },
	                promise = fromPromise(view, params, reason)
	                promises.push(promise)
	                // template不能cache
	                promise.then(function (s) {
	                    viewLocal.template = s
	                }, avalon.noop) // 捕获模板报错
	                var prom,
	                        callback = function ($ctrl) {
	                            viewLocal.vmodels = $ctrl.$vmodels
	                            view.$controller = viewLocal.$ctrl = $ctrl
	                            resolveData()
	                        },
	                        resolveData = function () {
	                            var $onEnter = view.$controller && view.$controller.$onEnter
	                            if ($onEnter) {
	                                var innerProm = getPromise(function (rs, rj) {
	                                    var reason = {
	                                        type: "data",
	                                        state: state,
	                                        params: params
	                                    },
	                                    res = $onEnter(params, rs, function (message) {
	                                        reason.message = message
	                                        rj(reason)
	                                    })
	                                    // if promise
	                                    if (res && res.then) {
	                                        _data.push(res)
	                                        res.then(function () {
	                                            rs(res)
	                                        })
	                                        // error msg
	                                    } else if (res && res !== true) {
	                                        reason.message = res
	                                        rj(reason)
	                                    } else if (res === undefine) {
	                                        rs()
	                                    }
	                                    // res === false will pause here
	                                })
	                                innerProm = innerProm.then(function (cb) {
	                                    avalon.isFunction(cb) && _callbacks.push(cb)
	                                })
	                                _data.push(innerProm)
	                            }
	                        }
	                // controller似乎可以缓存着
	                if (view.$controller && view.cacheController !== false) {
	                    return callback(view.$controller)
	                }
	                // 加载controller模块
	                if (view.controller) {
	                    prom = promise.then(function () {
	                        callback(avalon.controller(view.controller))
	                    })
	                } else if (view.controllerUrl) {
	                    prom = getPromise(function (rs, rj) {
	                        var url = avalon.isFunction(view.controllerUrl) ? view.controllerUrl(params) : view.controllerUrl
	                        url = url instanceof Array ? url : [url]
	                        avalon.controller.loader(url, function ($ctrl) {
	                            promise.then(function () {
	                                callback($ctrl)
	                                rs()
	                            })
	                        })
	                    })
	                } else if (view.controllerProvider) {
	                    var res = avalon.isFunction(view.controllerProvider) ? view.controllerProvider(params) : view.controllerProvider
	                    prom = getPromise(function (rs, rj) {
	                        // if promise
	                        if (res && res.then) {
	                            _data.push(res)
	                            res.then(function (r) {
	                                promise.then(function () {
	                                    callback(r)
	                                    rs()
	                                })
	                            }, function (e) {
	                                reason.message = e
	                                rj(reason)
	                            })
	                            // error msg
	                        } else {
	                            promise.then(function () {
	                                callback(res)
	                                rs()
	                            })
	                        }
	                    })
	                }
	                // is promise
	                if (prom && prom.then) {
	                    promises.push(prom)
	                }
	            })
	            // 模板和controller就绪
	            getPromise(promises).$then(function (values) {
	                state._local = _local
	                // 数据就绪
	                getPromise(_data).$then(function () {
	                    avalon.each(_callbacks, function (i, func) {
	                        func()
	                    })
	                    promises = _data = _callbacks = null
	                    _resovle()
	                })
	            })
	            return state.resolved

	        }, state)

	        return this
	    }

	    function isError(e) {
	        return e instanceof Error
	    }

	    // 将所有的promise error适配到这里来
	    function promiseError(e) {
	        if (isError(e)) {
	            throw e
	        } else {
	            callStateFunc("onError", mmState, e, e && e.state)
	        }
	    }

	    function getPromise(excutor) {
	        var prom = avalon.isFunction(excutor) ? new Promise(excutor) : Promise.all(excutor)
	        return prom
	    }
	    Promise.prototype.$then = function (onFulfilled, onRejected) {
	        var prom = this.then(onFulfilled, onRejected)
	        prom["catch"](promiseError)
	        return prom
	    }
	    avalon.state.onViewEntered = function (newNode, oldNode) {
	        if (newNode != oldNode)
	            oldNode.parentNode.removeChild(oldNode)
	    }
	    /*
	     *  @interface avalon.state.config 全局配置
	     *  @param {Object} config 配置对象
	     *  @param {Function} config.onBeforeUnload 开始切前的回调，this指向router对象，第一个参数是fromState，第二个参数是toState，return false可以用来阻止切换进行
	     *  @param {Function} config.onAbort onBeforeUnload return false之后，触发的回调，this指向mmState对象，参数同onBeforeUnload
	     *  @param {Function} config.onUnload url切换时候触发，this指向mmState对象，参数同onBeforeUnload
	     *  @param {Function} config.onBegin  开始切换的回调，this指向mmState对象，参数同onBeforeUnload，如果配置了onBegin，则忽略begin
	     *  @param {Function} config.onLoad 切换完成并成功，this指向mmState对象，参数同onBeforeUnload
	     *  @param {Function} config.onViewEnter 视图插入动画函数，有一个默认效果
	     *  @param {Node} config.onViewEnter.arguments[0] 新视图节点
	     *  @param {Node} config.onViewEnter.arguments[1] 旧的节点
	     *  @param {Function} config.onError 出错的回调，this指向对应的state，第一个参数是一个object，object.type表示出错的类型，比如view表示加载出错，object.name则对应出错的view name，object.xhr则是当使用默认模板加载器的时候的httpRequest对象，第二个参数是对应的state
	     */
	    avalon.state.config = function (config) {
	        avalon.mix(avalon.state, config || {})
	        return avalon
	    }
	    function callStateFunc(name, state) {
	        Event.$fire.apply(Event, arguments)
	        return avalon.state[name] ? avalon.state[name].apply(state || mmState.currentState, [].slice.call(arguments, 2)) : 0
	    }
	    // 状态原型，所有的状态都要继承这个原型
	    function StateModel(stateName, options) {
	        if (this instanceof StateModel) {
	            this.stateName = stateName
	            this.formate(options)
	        } else {
	            var state = _states[stateName] = new StateModel(stateName, options || {})
	            return state
	        }
	    }
	    StateModel.is = function (state) {
	        return state instanceof StateModel
	    }
	    StateModel.prototype = {
	        formate: function (options) {
	            avalon.mix(true, this, options)
	            var stateName = this.stateName,
	                    me = this,
	                    chain = stateName.split("."),
	                    len = chain.length - 1,
	                    sourceLocal = me.sourceLocal = {}
	            this.chain = []
	            avalon.each(chain, function (key, name) {
	                if (key == len) {
	                    me.chain.push(me)
	                } else {
	                    var n = chain.slice(0, key + 1).join("."),
	                            state = getStateByName(n)
	                    if (!state)
	                        throw new Error("必须先定义" + n)
	                    me.chain.push(state)
	                }
	            })
	            if (this.url === void 0) {
	                this.abstract = true
	            }
	            var parent = this.chain[len - 1] || _root
	            if (parent) {
	                this.url = parent.url + (this.url || "")
	                this.parentState = parent
	            }
	            if (!this.views && stateName != "") {
	                var view = {}
	                "template,templateUrl,templateProvider,controller,controllerUrl,controllerProvider,viewCache".replace(/\w+/g, function (prop) {
	                    copyTemplateProperty(view, me, prop)
	                })
	                var viewname = "viewname" in this ? this.viewname : ""
	                this.views = {}
	                this.views[viewname] = view
	            }
	            var views = {},
	                    viewsIsArray = this.views instanceof Array // 如果是一个数组

	            avalon.each(this.views, function (maybeName, view) {
	                var name = viewsIsArray ? view.name || "" : maybeName // 默认缺省
	                if (name.indexOf("@") < 0) {
	                    name += "@" + (parent ? parent.stateName || "" : "")
	                }
	                views[name] = view
	                sourceLocal[name] = {}
	            })
	            this.views = views
	            this._self = options
	            this._pending = false
	            this.visited = false
	            this.params = inherit(parent && parent.params || {})
	            this.oldParams = {}
	            this.keys = []

	            this.events = {}
	        },
	        watch: function (eventName, func) {
	            var events = this.events[eventName] || []
	            this.events[eventName] = events
	            events.push(func)
	            return func
	        },
	        fire: function (eventName, state) {
	            var events = this.events[eventName] || [], i = 0
	            while (events[i]) {
	                var res = events[i].apply(this, [].slice.call(arguments, 1))
	                if (res === false) {
	                    events.splice(i, 1)
	                } else {
	                    i++
	                }
	            }
	        },
	        unwatch: function (eventName, func) {
	            var events = this.events[eventName]
	            if (!events)
	                return
	            var i = 0
	            while (events[i]) {
	                if (events[i] == func)
	                    return events.splice(i, 1)
	                i++
	            }
	        },
	        paramsChanged: function (toParams) {
	            var changed = false, keys = this.keys, me = this, params = this.params
	            avalon.each(keys, function (index, item) {
	                var key = item.name
	                if (params[key] != toParams[key])
	                    changed = "param"
	            })
	            // query
	            if (!changed && mmState.currentState === this) {
	                changed = !objectCompare(toParams.query, mmState.query) && "query"
	            }
	            return changed
	        },
	        filterParams: function (toParams) {
	            var params = avalon.mix(true, {}, this.params), keys = this.keys
	            avalon.each(keys, function (index, item) {
	                params[item.name] = toParams[item.name]
	            })
	            return params
	        },
	        syncParams: function (toParams) {
	            var me = this
	            avalon.each(this.keys, function (index, item) {
	                var key = item.name
	                if (key in toParams)
	                    me.params[key] = toParams[key]
	            })
	        },
	        _onEnter: function () {
	            this.query = this.getQuery()
	            var me = this,
	                    arg = Array.prototype.slice.call(arguments),
	                    done = me._async(),
	                    prom = getPromise(function (rs, rj) {
	                        var reason = {
	                            type: "data",
	                            state: me,
	                            params: me.params
	                        },
	                        _reject = function (message) {
	                            reason.message = message
	                            done.apply(me, [false])
	                            rj(reason)
	                        },
	                                _resovle = function () {
	                                    done.apply(me)
	                                    rs()
	                                },
	                                res = me.onEnter.apply(me, arg.concat([_resovle, _reject]))
	                        // if promise
	                        if (res && res.then) {
	                            res.then(_resovle)["catch"](promiseError)
	                            // error msg
	                        } else if (res && res !== true) {
	                            _reject(res)
	                        } else if (res === undefine) {
	                            _resovle()
	                        }
	                        // res === false will pause here
	                    })
	        },
	        /*
	         * @interface state.getQuery 获取state的query，等价于state.query
	         *<pre>
	         *  onEnter: function() {
	         *      var query = this.getQuery()
	         *      or
	         *      this.query
	         *  }
	         *</pre> 
	         */
	        getQuery: function () {
	            return mmState.query
	        },
	        /*
	         * @interface state.getParams 获取state的params，等价于state.params
	         *<pre>
	         *  onEnter: function() {
	         *      var params = this.getParams()
	         *      or
	         *      this.params
	         *  }
	         *</pre> 
	         */
	        getParams: function () {
	            return this.params
	        },
	        _async: function () {
	            // 没有done回调的时候，防止死球
	            if (this.done)
	                this._pending = true
	            return this.done || avalon.noop
	        },
	        onBeforeEnter: avalon.noop, // 切入某个state之前触发
	        onEnter: avalon.noop, // 切入触发
	        onBeforeExit: avalon.noop, // state退出前触发
	        onExit: avalon.noop // 退出后触发
	    }

	    _root = StateModel("", {
	        url: "",
	        views: null,
	        "abstract": true
	    })

	    /*
	     * @interface avalon.controller 给avalon.state视图对象配置控制器
	     * @param name 控制器名字
	     * @param {Function} factory 控制器函数，传递一个内部生成的控制器对象作为参数
	     * @param {Object} factory.arguments[0] $ctrl 控制器的第一个参数：实际生成的控制器对象
	     * @param {Object} $ctrl.$vmodels 给视图指定一个scan的vmodels数组，实际scan的时候$vmodels.concat(dom树上下文继承的vmodels)
	     * @param {Function} $ctrl.$onBeforeUnload 该视图被卸载前触发，return false可以阻止视图卸载，并阻止跳转
	     * @param {Function} $ctrl.$onEnter 给该视图加载数据，可以返回false，或任意不为true的错误信息或一个promise对象，传递3个参数
	     * @param {Object} $ctrl.$onEnter.arguments[0] params第一个参数：视图所属的state的参数
	     * @param {Function} $ctrl.$onEnter.arguments[1] resolve $onEnter 第二个参数：return false的时候，进入同步等待，直到手动调用resolve
	     * @param {Function} $ctrl.$onEnter.arguments[2] reject 第三个参数：数据加载失败，调用
	     * @param {Function} $ctrl.$onRendered 视图元素scan完成之后，调用
	     */
	    avalon.controller = function () {
	        var first = arguments[0],
	                second = arguments[1]
	        if (first && (first instanceof _controller))
	            return first
	        var $ctrl = _controller()
	        if (avalon.isFunction(first)) {
	            first($ctrl)
	        } else if (avalon.isFunction(second)) {
	            $ctrl.name = first
	            second($ctrl)
	        } else if (typeof first == "string" || typeof first == "object") {
	            first = first instanceof Array ? first : Array.prototype.slice.call(arguments)
	            avalon.each(first, function (index, item) {
	                if (typeof item == "string") {
	                    first[index] = avalon.vmodels[item]
	                }
	                item = first[index]
	                if ("$onRendered" in item)
	                    $ctrl.$onRendered = item["$onRendered"]
	                if ("$onEnter" in  item)
	                    $ctrl.$onEnter = item["$onEnter"]
	            })
	            $ctrl.$vmodels = first
	        } else {
	            throw new Error("参数错误" + arguments)
	        }
	        return $ctrl
	    }
	    /*
	     *  @interface avalon.controller.loader avalon.controller异步引入模块的加载器，默认是通过avalon.require加载
	     */
	    avalon.controller.loader = function (url, callback) {
	        // 没有错误回调...
	        function wrapper($ctrl) {
	            callback && callback($ctrl)
	        }
	        if (window.requirejs) {
	            requirejs([url], wrapper)
	        } else if ("function" === "function" && __webpack_require__(7).ensure) {
	            __webpack_require__(7).ensure([url], wrapper)
	        } else if (avalon.require) {
	            avalon.require([url], wrapper)
	        }
	    }

	    function _controller() {
	        if (!(this instanceof _controller))
	            return new _controller
	        this.$vmodels = []
	    }
	    _controller.prototype = {
	    }

	    function objectCompare(objA, objB) {
	        for (var i in objA) {
	            if (!(i in objB) || objA[i] !== objB[i])
	                return false
	        }
	        for (var i in objB) {
	            if (!(i in objA) || objA[i] !== objB[i])
	                return false
	        }
	        return true
	    }

	    //【avalon.state】的辅助函数，确保返回的是函数
	    function getFn(object, name) {
	        return typeof object[name] === "function" ? object[name] : avalon.noop
	    }

	    function getStateByName(stateName) {
	        return _states[stateName]
	    }
	    function getViewNodes(node, query) {
	        var nodes, query = query || "ms-view"
	        if (node.querySelectorAll) {
	            nodes = node.querySelectorAll("[" + query + "]")
	        } else {
	            nodes = Array.prototype.filter.call(node.getElementsByTagName("*"), function (node) {
	                return typeof node.getAttribute(query) === "string"
	            })
	        }
	        return nodes
	    }

	    // 【avalon.state】的辅助函数，opts.template的处理函数
	    function fromString(template, params, reason) {
	        var promise = getPromise(function (resolve, reject) {
	            var str = typeof template === "function" ? template(params) : template
	            if (typeof str == "string") {
	                resolve(str)
	            } else {
	                reason.message = "template必须对应一个字符串或一个返回字符串的函数"
	                reject(reason)
	            }
	        })
	        return promise
	    }
	    // 【fromUrl】的辅助函数，得到一个XMLHttpRequest对象
	    var getXHR = function () {
	        return new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP")
	    }/*
	     *  @interface avalon.state.templateLoader 通过url异步加载模板的函数，默认是通过内置的httpRequest去加载，但是在node-webkit环境是不work的，因此开放了这个配置，用以自定义url模板加载器，会在一个promise实例里调用这个方法去加载模板
	     *  @param url 模板地址
	     *  @param resolve 加载成功，如果需要缓存模板，请调用<br>
	     resolve(avalon.templateCache[url] = templateString)<br>
	     否则，请调用<br>
	     resolve(templateString)<br>
	     *  @param reject 加载失败，请调用reject(reason)
	     *  @param reason 挂在失败原因的对象
	     */
	    avalon.state.templateLoader = function (url, resolve, reject, reason) {
	        var xhr = getXHR()
	        xhr.onreadystatechange = function () {
	            if (xhr.readyState === 4) {
	                var status = xhr.status;
	                if (status > 399 && status < 600) {
	                    reason.message = "templateUrl对应资源不存在或没有开启 CORS"
	                    reason.status = status
	                    reason.xhr = xhr
	                    reject(reason)
	                } else {
	                    resolve(avalon.templateCache[url] = xhr.responseText)
	                }
	            }
	        }
	        xhr.open("GET", url, true)
	        if ("withCredentials" in xhr) {
	            xhr.withCredentials = true
	        }
	        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
	        xhr.send()
	    }
	    // 【avalon.state】的辅助函数，opts.templateUrl的处理函数
	    function fromUrl(url, params, reason) {
	        var promise = getPromise(function (resolve, reject) {
	            if (typeof url === "function") {
	                url = url(params)
	            }
	            if (typeof url !== "string") {
	                reason.message = "templateUrl必须对应一个URL"
	                return reject(reason)
	            }
	            if (avalon.templateCache[url]) {
	                return  resolve(avalon.templateCache[url])
	            }
	            avalon.state.templateLoader(url, resolve, reject, reason)
	        })
	        return promise
	    }
	    // 【avalon.state】的辅助函数，opts.templateProvider的处理函数
	    function fromProvider(fn, params, reason) {
	        var promise = getPromise(function (resolve, reject) {
	            if (typeof fn === "function") {
	                var ret = fn(params)
	                if (ret && ret.then || typeof ret == "string") {
	                    resolve(ret)
	                } else {
	                    reason.message = "templateProvider为函数时应该返回一个Promise或thenable对象或字符串"
	                    reject(reason)
	                }
	            } else if (fn && fn.then) {
	                resolve(fn)
	            } else {
	                reason.message = "templateProvider不为函数时应该对应一个Promise或thenable对象"
	                reject(reason)
	            }
	        })
	        return promise
	    }
	    // 【avalon.state】的辅助函数，将template或templateUrl或templateProvider转换为可用的Promise对象
	    function fromPromise(config, params, reason) {
	        return config.template ? fromString(config.template, params, reason) :
	                config.templateUrl ? fromUrl(config.templateUrl, params, reason) :
	                config.templateProvider ? fromProvider(config.templateProvider, params, reason) :
	                getPromise(function (resolve, reject) {
	                    reason.message = "必须存在template, templateUrl, templateProvider中的一个"
	                    reject(reason)
	                })
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (avalon) {
	//chrome36的原生Promise还多了一个defer()静态方法，允许不通过传参就能生成Promise实例，
	//另还多了一个chain(onSuccess, onFail)原型方法，意义不明
	//目前，firefox24, opera19也支持原生Promise(chrome32就支持了，但需要打开开关，自36起直接可用)
	//本模块提供的Promise完整实现ECMA262v6 的Promise规范
	//2015.3.12 支持async属性
	    function ok(val) {
	        return val
	    }
	    function ng(e) {
	        throw e
	    }

	    function done(onSuccess) {//添加成功回调
	        return this.then(onSuccess, ng)
	    }
	    function fail(onFail) {//添加出错回调
	        return this.then(ok, onFail)
	    }
	    function defer() {
	        var ret = {};
	        ret.promise = new this(function (resolve, reject) {
	            ret.resolve = resolve
	            ret.reject = reject
	        });
	        return ret
	    }
	    var msPromise = function (executor) {
	        this._callbacks = []
	        var me = this
	        if (typeof this !== "object")
	            throw new TypeError("Promises must be constructed via new")
	        if (typeof executor !== "function")
	            throw new TypeError("not a function")

	        executor(function (value) {
	            _resolve(me, value)
	        }, function (reason) {
	            _reject(me, reason)
	        })
	    }
	    function fireCallbacks(promise, fn) {
	        if (typeof promise.async === "boolean") {
	            var isAsync = promise.async
	        } else {
	            isAsync = promise.async = true
	        }
	        if (isAsync) {
	            window.setTimeout(fn, 0)
	        } else {
	            fn()
	        }
	    }
	//返回一个已经处于`resolved`状态的Promise对象
	    msPromise.resolve = function (value) {
	        return new msPromise(function (resolve) {
	            resolve(value)
	        })
	    }
	//返回一个已经处于`rejected`状态的Promise对象
	    msPromise.reject = function (reason) {
	        return new msPromise(function (resolve, reject) {
	            reject(reason)
	        })
	    }

	    msPromise.prototype = {
	//一个Promise对象一共有3个状态：
	//- `pending`：还处在等待状态，并没有明确最终结果
	//- `resolved`：任务已经完成，处在成功状态
	//- `rejected`：任务已经完成，处在失败状态
	        constructor: msPromise,
	        _state: "pending",
	        _fired: false, //判定是否已经被触发
	        _fire: function (onSuccess, onFail) {
	            if (this._state === "rejected") {
	                if (typeof onFail === "function") {
	                    onFail(this._value)
	                } else {
	                    throw this._value
	                }
	            } else {
	                if (typeof onSuccess === "function") {
	                    onSuccess(this._value)
	                }
	            }
	        },
	        _then: function (onSuccess, onFail) {
	            if (this._fired) {//在已有Promise上添加回调
	                var me = this
	                fireCallbacks(me, function () {
	                    me._fire(onSuccess, onFail)
	                });
	            } else {
	                this._callbacks.push({onSuccess: onSuccess, onFail: onFail})
	            }
	        },
	        then: function (onSuccess, onFail) {
	            onSuccess = typeof onSuccess === "function" ? onSuccess : ok
	            onFail = typeof onFail === "function" ? onFail : ng
	            var me = this//在新的Promise上添加回调
	            var nextPromise = new msPromise(function (resolve, reject) {
	                me._then(function (value) {
	                    try {
	                        value = onSuccess(value)
	                    } catch (e) {
	                        // https://promisesaplus.com/#point-55
	                        reject(e)
	                        return
	                    }
	                    resolve(value)
	                }, function (value) {
	                    try {
	                        value = onFail(value)
	                    } catch (e) {
	                        reject(e)
	                        return
	                    }
	                    resolve(value)
	                })
	            })
	            for (var i in me) {
	                if (!personal[i]) {
	                    nextPromise[i] = me[i]
	                }
	            }
	            return nextPromise
	        },
	        "done": done,
	        "catch": fail,
	        "fail": fail
	    }
	    var personal = {
	        _state: 1,
	        _fired: 1,
	        _value: 1,
	        _callbacks: 1
	    }
	    function _resolve(promise, value) {//触发成功回调
	        if (promise._state !== "pending")
	            return;
	        if (value && typeof value.then === "function") {
	//thenable对象使用then，Promise实例使用_then
	            var method = value instanceof msPromise ? "_then" : "then"
	            value[method](function (val) {
	                _transmit(promise, val, true)
	            }, function (reason) {
	                _transmit(promise, reason, false)
	            });
	        } else {
	            _transmit(promise, value, true);
	        }
	    }
	    function _reject(promise, value) {//触发失败回调
	        if (promise._state !== "pending")
	            return
	        _transmit(promise, value, false)
	    }
	//改变Promise的_fired值，并保持用户传参，触发所有回调
	    function _transmit(promise, value, isResolved) {
	        promise._fired = true;
	        promise._value = value;
	        promise._state = isResolved ? "fulfilled" : "rejected"
	        fireCallbacks(promise, function () {
	            promise._callbacks.forEach(function (data) {
	                promise._fire(data.onSuccess, data.onFail);
	            })
	        })
	    }
	    function _some(any, iterable) {
	        iterable = Array.isArray(iterable) ? iterable : []
	        var n = 0, result = [], end
	        return new msPromise(function (resolve, reject) {
	            // 空数组直接resolve
	            if (!iterable.length)
	                resolve(result)
	            function loop(a, index) {
	                a.then(function (ret) {
	                    if (!end) {
	                        result[index] = ret//保证回调的顺序
	                        n++
	                        if (any || n >= iterable.length) {
	                            resolve(any ? ret : result)
	                            end = true
	                        }
	                    }
	                }, function (e) {
	                    end = true
	                    reject(e)
	                })
	            }
	            for (var i = 0, l = iterable.length; i < l; i++) {
	                loop(iterable[i], i)
	            }
	        })
	    }

	    msPromise.all = function (iterable) {
	        return _some(false, iterable)
	    }
	    msPromise.race = function (iterable) {
	        return _some(true, iterable)
	    }
	    msPromise.defer = defer



	    avalon.Promise = msPromise
	    var nativePromise = window.Promise
	    if (/native code/.test(nativePromise)) {
	        nativePromise.prototype.done = done
	        nativePromise.prototype.fail = fail
	        if (!nativePromise.defer) { //chrome实现的私有方法
	            nativePromise.defer = defer
	        }
	    }
	    return window.Promise = nativePromise || msPromise

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	//https://github.com/ecomfe/er/blob/master/src/Deferred.js
	//http://jser.info/post/77696682011/es6-promises


/***/ },
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * 
	 * version 0.9
	 * built in 2015.11.19
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function () {

	    function Router() {
	        var table = {}
	        "get,post,delete,put".replace(avalon.rword, function (name) {
	            table[name] = []
	        })
	        this.routingTable = table
	    }

	    function parseQuery(url) {
	        var array = url.split("?"), query = {}, path = array[0], querystring = array[1]
	        if (querystring) {
	            var seg = querystring.split("&"),
	                    len = seg.length, i = 0, s;
	            for (; i < len; i++) {
	                if (!seg[i]) {
	                    continue
	                }
	                s = seg[i].split("=")
	                query[decodeURIComponent(s[0])] = decodeURIComponent(s[1])
	            }
	        }
	        return {
	            path: path,
	            query: query
	        }
	    }


	    function queryToString(obj) {
	        if (typeof obj == 'string')
	            return obj
	        var str = []
	        for (var i in obj) {
	            if (i == "query")
	                continue
	            str.push(i + '=' + encodeURIComponent(obj[i]))
	        }
	        return str.length ? '?' + str.join("&") : ''
	    }

	    var placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g
	    Router.prototype = {
	        error: function (callback) {
	            this.errorback = callback
	        },
	        _pathToRegExp: function (pattern, opts) {
	            var keys = opts.keys = [],
	                    //      segments = opts.segments = [],
	                    compiled = '^', last = 0, m, name, regexp, segment;

	            while ((m = placeholder.exec(pattern))) {
	                name = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
	                regexp = m[4] || (m[1] == '*' ? '.*' : 'string')
	                segment = pattern.substring(last, m.index);
	                var type = this.$types[regexp]
	                var key = {
	                    name: name
	                }
	                if (type) {
	                    regexp = type.pattern
	                    key.decode = type.decode
	                }
	                keys.push(key)
	                compiled += quoteRegExp(segment, regexp, false)
	                //  segments.push(segment)
	                last = placeholder.lastIndex
	            }
	            segment = pattern.substring(last);
	            compiled += quoteRegExp(segment) + (opts.strict ? opts.last : "\/?") + '$';
	            var sensitive = typeof opts.caseInsensitive === "boolean" ? opts.caseInsensitive : true
	            //  segments.push(segment);
	            opts.regexp = new RegExp(compiled, sensitive ? 'i' : undefined);
	            return opts

	        },
	        //添加一个路由规则
	        add: function (method, path, callback, opts) {
	            var array = this.routingTable[method.toLowerCase()]
	            if (path.charAt(0) !== "/") {
	                throw "path必须以/开头"
	            }
	            opts = opts || {}
	            opts.callback = callback
	            if (path.length > 2 && path.charAt(path.length - 1) === "/") {
	                path = path.slice(0, -1)
	                opts.last = "/"
	            }
	            avalon.Array.ensure(array, this._pathToRegExp(path, opts))
	        },
	        //判定当前URL与已有状态对象的路由规则是否符合
	        route: function (method, path, query) {
	            path = path.trim()
	            var states = this.routingTable[method]
	            for (var i = 0, el; el = states[i++]; ) {
	                var args = path.match(el.regexp)
	                if (args) {
	                    el.query = query || {}
	                    el.path = path
	                    el.params = {}
	                    var keys = el.keys
	                    args.shift()
	                    if (keys.length) {
	                        this._parseArgs(args, el)
	                    }
	                    return  el.callback.apply(el, args)
	                }
	            }
	            if (this.errorback) {
	                this.errorback()
	            }
	        },
	        _parseArgs: function (match, stateObj) {
	            var keys = stateObj.keys
	            for (var j = 0, jn = keys.length; j < jn; j++) {
	                var key = keys[j]
	                var value = match[j] || ""
	                if (typeof key.decode === "function") {//在这里尝试转换参数的类型
	                    var val = key.decode(value)
	                } else {
	                    try {
	                        val = JSON.parse(value)
	                    } catch (e) {
	                        val = value
	                    }
	                }
	                match[j] = stateObj.params[key.name] = val
	            }
	        },
	        getLastPath: function () {
	            return getCookie("msLastPath")
	        },
	        setLastPath: function (path) {
	            setCookie("msLastPath", path)
	        },
	        /*
	         *  @interface avalon.router.redirect
	         *  @param hash 访问的url hash
	         */
	        redirect: function (hash) {
	            this.navigate(hash, {replace: true})
	        },
	        /*
	         *  @interface avalon.router.navigate
	         *  @param hash 访问的url hash
	         *  @param options 扩展配置
	         *  @param options.replace true替换history，否则生成一条新的历史记录
	         *  @param options.silent true表示只同步url，不触发url变化监听绑定
	         */
	        navigate: function (hash, options) {
	            var parsed = parseQuery((hash.charAt(0) !== "/" ? "/" : "") + hash),
	                    options = options || {}
	            if (hash.charAt(0) === "/")
	                hash = hash.slice(1)// 修正出现多扛的情况 fix http://localhost:8383/index.html#!//
	            // 在state之内有写history的逻辑
	            avalon.history && avalon.history.navigate(hash, false)
	            // 只是写历史而已
	            if (!options.silent && this.lastHash !== hash) {
	                this.lastHash = hash
	                this.route("get", parsed.path, parsed.query, options)
	            }
	        },
	        /*
	         *  @interface avalon.router.when 配置重定向规则
	         *  @param path 被重定向的表达式，可以是字符串或者数组
	         *  @param redirect 重定向的表示式或者url
	         */
	        when: function (path, redirect) {
	            var me = this,
	                    path = path instanceof Array ? path : [path]
	            avalon.each(path, function (index, p) {
	                me.add("get", p, function () {
	                    var info = me.urlFormate(redirect, this.params, this.query)
	                    me.navigate(info.path + info.query, {replace: true})
	                })
	            })
	            return this
	        },
	        /*
	         *  @interface avalon.router.get 添加一个router规则
	         *  @param path url表达式
	         *  @param callback 对应这个url的回调
	         */
	        get: function (path, callback) {
	        },
	        urlFormate: function (url, params, query) {
	            var query = query ? queryToString(query) : "",
	                    hash = url.replace(placeholder, function (mat) {
	                        var key = mat.replace(/[\{\}]/g, '').split(":")
	                        key = key[0] ? key[0] : key[1]
	                        return params[key] !== undefined ? params[key] : ''
	                    }).replace(/^\//g, '')
	            return {
	                path: hash,
	                query: query
	            }
	        },
	        /* *
	         `'/hello/'` - 匹配'/hello/'或'/hello'
	         `'/user/:id'` - 匹配 '/user/bob' 或 '/user/1234!!!' 或 '/user/' 但不匹配 '/user' 与 '/user/bob/details'
	         `'/user/{id}'` - 同上
	         `'/user/{id:[^/]*}'` - 同上
	         `'/user/{id:[0-9a-fA-F]{1,8}}'` - 要求ID匹配/[0-9a-fA-F]{1,8}/这个子正则
	         `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
	         path into the parameter 'path'.
	         `'/files/*path'` - ditto.
	         */
	        // avalon.router.get("/ddd/:dddID/",callback)
	        // avalon.router.get("/ddd/{dddID}/",callback)
	        // avalon.router.get("/ddd/{dddID:[0-9]{4}}/",callback)
	        // avalon.router.get("/ddd/{dddID:int}/",callback)
	        // 我们甚至可以在这里添加新的类型，avalon.router.$type.d4 = { pattern: '[0-9]{4}', decode: Number}
	        // avalon.router.get("/ddd/{dddID:d4}/",callback)
	        $types: {
	            date: {
	                pattern: "[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])",
	                decode: function (val) {
	                    return new Date(val.replace(/\-/g, "/"))
	                }
	            },
	            string: {
	                pattern: "[^\\/]*"
	            },
	            bool: {
	                decode: function (val) {
	                    return parseInt(val, 10) === 0 ? false : true;
	                },
	                pattern: "0|1"
	            },
	            'int': {
	                decode: function (val) {
	                    return parseInt(val, 10);
	                },
	                pattern: "\\d+"
	            }
	        }
	    }

	    "get,put,delete,post".replace(avalon.rword, function (method) {
	        return  Router.prototype[method] = function (a, b, c) {
	            this.add(method, a, b, c)
	        }
	    })
	    function quoteRegExp(string, pattern, isOptional) {
	        var result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
	        if (!pattern)
	            return result;
	        var flag = isOptional ? '?' : '';
	        return result + flag + '(' + pattern + ')' + flag;
	    }
	    function supportLocalStorage() {
	        try {
	            localStorage.setItem("avalon", 1)
	            localStorage.removeItem("avalon")
	            return true
	        } catch (e) {
	            return false
	        }
	    }

	    if (supportLocalStorage()) {
	        Router.prototype.getLastPath = function () {
	            return localStorage.getItem("msLastPath")
	        }
	        var cookieID
	        Router.prototype.setLastPath = function (path) {
	            if (cookieID) {
	                clearTimeout(cookieID)
	                cookieID = null
	            }
	            localStorage.setItem("msLastPath", path)
	            cookieID = setTimeout(function () {
	                localStorage.removItem("msLastPath")
	            }, 1000 * 60 * 60 * 24)
	        }
	    }



	    function escapeCookie(value) {
	        return String(value).replace(/[,;"\\=\s%]/g, function (character) {
	            return encodeURIComponent(character)
	        });
	    }
	    function setCookie(key, value) {
	        var date = new Date()//将date设置为1天以后的时间 
	        date.setTime(date.getTime() + 1000 * 60 * 60 * 24)
	        document.cookie = escapeCookie(key) + '=' + escapeCookie(value) + ";expires=" + date.toGMTString()
	    }
	    function getCookie(name) {
	        var m = String(document.cookie).match(new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')) || ["", ""]
	        return decodeURIComponent(m[1])
	    }

	    avalon.router = new Router

	    return avalon
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	/*
	 <!DOCTYPE html>
	 <html>
	 <head>
	 <meta charset="utf-8">
	 <title>路由系统</title>
	 <script src="avalon.js"></script>
	 <script>
	 require(["mmRouter"], function() {
	 var model = avalon.define({
	    $id: 'xxx',
	    currPath: ''
	 })
	 avalon.router.get("/aaa", function(a) {
	 model.currPath = this.path
	 })
	 avalon.router.get("/bbb", function(a) {
	 model.currPath = this.path
	 })
	 avalon.router.get("/ccc", function(a) {
	 model.currPath = this.path
	 })
	 avalon.router.get("/ddd/:ddd", function(a) {//:ddd为参数
	 avalon.log(a)
	 model.currPath = this.path
	 })
	 avalon.router.get("/eee", function(a) {
	 model.currPath = this.path
	 })
	 avalon.history.start({
	 html5Mode: true,
	 basepath: "/avalon"
	 })
	 avalon.scan()
	 })
	 </script>
	 </head>
	 <body >
	 <div ms-controller="xxx">
	 <ul>
	 <li><a href="#!/aaa">aaa</a></li>
	 <li><a href="#!/bbb">bbb</a></li>
	 <li><a href="#!/ccc">ccc</a></li>
	 <li><a href="#!/ddd/222">ddd</a></li>
	 <li><a href="#!/eee">eee</a></li>
	 </ul>
	 <div style="color:red">{{currPath}}</div>
	 <div style="height: 600px;width:1px;">
	 
	 </div>
	 <p id="eee">会定位到这里</p>
	 </div>
	 
	 </body>
	 </html>
	 
	 */


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * 
	 * version 0.9
	 * built in 2015.11.19
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (avalon) {

	    var History = avalon.History = function () {
	        this.location = window.location
	        this.history = window.history
	    }

	    History.started = false
	//取得当前IE的真实运行环境
	    History.IEVersion = (function () {
	        var mode = document.documentMode
	        return mode ? mode : window.XMLHttpRequest ? 7 : 6
	    })()

	    History.defaults = {
	        root: "/",
	        html5Mode: false,
	        hashPrefix: "!",
	        iframeID: null, //IE6-7，如果有在页面写死了一个iframe，这样似乎刷新的时候不会丢掉之前的历史
	        interval: 50, //IE6-7,使用轮询，这是其时间时隔
	        fireAnchor: true, //决定是否将滚动条定位于与hash同ID的元素上
	        routeElementJudger: avalon.noop // 判断a元素是否是触发router切换的链接
	    }
	    var oldIE = window.VBArray && History.IEVersion <= 7
	    var supportPushState = !!(window.history.pushState)
	    var supportHashChange = !!("onhashchange" in window && (!window.VBArray || !oldIE))


	    History.started = false;

	    History.prototype = {
	        constructor: History,
	        atRoot: function () {
	            //判定当前地址栏不存在hash与search
	            var path = this.location.pathname.replace(/[^\/]$/, '$&/')
	            return path === this.root && !this.getSearch()
	        },
	        // 判定pathname是否匹配我们的root参数
	        matchRoot: function () {
	            var path = this.decodeFragment(this.location.pathname)
	            var root = path.slice(0, this.root.length - 1) + '/'
	            return root === this.root;
	        },
	        // 变经过编辑的东西变回我们可识别的文字
	        decodeFragment: function (fragment) {
	            return decodeURI(fragment.replace(/%25/g, '%2525'))
	        },
	        // 取得查询字符串, 注意IE6下search可能包含hash
	        getSearch: function () {
	            var match = this.location.href.replace(/#.*/, '').match(/\?.+/)
	            return match ? match[0] : '';
	        },
	        // 从location.href中抽取hash,不能直接使用location.hash,因为firefox会对它进行decoded
	        getHash: function (window) {
	            // IE6直接用location.hash取hash，可能会取少一部分内容
	            // 比如 http://www.cnblogs.com/rubylouvre#stream/xxxxx?lang=zh_c
	            // ie6 => location.hash = #stream/xxxxx
	            // 其他浏览器 => location.hash = #stream/xxxxx?lang=zh_c
	            // firefox 会自作多情对hash进行decodeURIComponent
	            // 又比如 http://www.cnblogs.com/rubylouvre/#!/home/q={%22thedate%22:%2220121010~20121010%22}
	            // firefox 15 => #!/home/q={"thedate":"20121010~20121010"}
	            // 其他浏览器 => #!/home/q={%22thedate%22:%2220121010~20121010%22}
	            var path = (window || this).location.href
	            return this._getHash(path.slice(path.indexOf("#")))
	        },
	        _getHash: function (path) {
	            if (path.indexOf("#/") === 0) {
	                return decodeURI(path.slice(2))
	            }
	            if (path.indexOf("#!/") === 0) {
	                return decodeURI(path.slice(3))
	            }
	            return ""
	        },
	        // Get the pathname and search params, without the root.
	        getPath: function () {
	            var path = this.decodeFragment(
	                    this.location.pathname + this.getSearch()
	                    ).slice(this.root.length - 1);
	            return path.charAt(0) === '/' ? path.slice(1) : path
	        },
	        // 根据浏览器对路由器事件的支持情况截取hash或path
	        getFragment: function (fragment) {
	            if (fragment == null) {
	                if (this.monitorMode === "popstate") {
	                    fragment = this.getPath()
	                } else {
	                    fragment = this.getHash()
	                }
	            }
	            return  fragment.replace(/^[#\/]|\s+$/g, "")
	        },
	        /*
	         * @interface avalon.history.start 开始监听历史变化
	         * @param options 配置参数
	         * @param options.hashPrefix hash以什么字符串开头，默认是 "!"，对应实际效果就是"#!"
	         * @param options.routeElementJudger 判断a元素是否是触发router切换的链接的函数，return true则触发切换，默认为avalon.noop，history内部有一个判定逻辑，是先判定a元素的href属性是否以hashPrefix开头，如果是则当做router切换元素，因此综合判定规则是 href.indexOf(hashPrefix) == 0 || routeElementJudger(ele, ele.href)，如果routeElementJudger返回true则跳转至href，如果返回的是字符串，则跳转至返回的字符串，如果返回false则返回浏览器默认行为
	         * @param options.html5Mode 是否采用html5模式，即不使用hash来记录历史，默认false
	         * @param options.fireAnchor 决定是否将滚动条定位于与hash同ID的元素上，默认为true
	         * @param options.basepath 根目录，默认为"/"
	         * @param options.silent 不触发回调，默认false
	         */
	        start: function (options) {
	            if (History.started)
	                throw new Error('avalon.history has already been started')
	            options = options || {}
	            if (options.basepath) {
	                options.root = options.basepath
	                delete options.basepath
	            }


	            History.started = true
	            this.options = avalon.mix({root: '/'}, History.defaults, options)

	            //IE6不支持maxHeight, IE7支持XMLHttpRequest, IE8支持window.Element，querySelector, 
	            //IE9支持window.Node, window.HTMLElement, IE10不支持条件注释
	            //确保html5Mode属性存在,并且是一个布尔
	            this.html5Mode = !!this.options.html5Mode
	            //监听模式
	            this.monitorMode = this.html5Mode ? "popstate" : "hashchange"
	            if (!supportPushState) {
	                if (this.html5Mode) {
	                    avalon.log("如果浏览器不支持HTML5 pushState，强制使用hash hack!")
	                    this.html5Mode = false
	                }
	                this.monitorMode = "hashchange"
	            }
	            if (!supportHashChange) {
	                this.monitorMode = "iframepoll"
	            }


	            this.fragment = this.getFragment()
	            this.prefix = "#" + this.options.hashPrefix + "/"
	            // 将前后出现的//变成/
	            this.root = ('/' + this.options.root + '/').replace(/^\/+|\/+$/g, '/')
	            var hasHash = this.atRoot()
	            if (this.monitorMode === "popstate" && supportPushState && hasHash) {
	                this.navigate(this.getHash(), {replace: true})
	            }


	            var that = this
	            function checkUrlChange() {
	                if (!History.started) {
	                    return false
	                }
	                var current = that.getFragment()// 取得主窗口的hash
	                // 如果用户按下后退按钮,那么iframe中的hash会发生改变,那么我们将使用
	                // 它来更新主窗口的hash
	                if (current === that.fragment && that.iframe) {
	                    current = that.getHash(that.iframe.contentWindow)// 取得iframe的hash
	                }
	                if (current === that.fragment) {
	                    return false
	                }
	                if (that.iframe) {
	                    that.navigate(current)
	                }
	                that.fireUrlChange()
	            }

	            // 支持popstate 就监听popstate
	            // 支持hashchange 就监听hashchange(IE8,IE9,FF3)
	            // 否则的话只能每隔一段时间进行检测了(IE6, IE7)
	            switch (this.monitorMode) {
	                case "popstate" :
	                    this._checkUrlChange = avalon.bind(window, 'popstate', checkUrlChange)
	                    break
	                case "hashchange":
	                    this._checkUrlChange = avalon.bind(window, 'hashchange', checkUrlChange)
	                    break
	                case "iframepoll":
	                    this._intervalID = setInterval(checkUrlChange, this.interval)
	                    avalon.ready(function () {
	                        var iframe = that.iframe = document.createElement('iframe')
	                        iframe.src = 'javascript:0'
	                        iframe.style.display = 'none'
	                        iframe.tabIndex = -1
	                        var body = document.body
	                        var iWindow = body.insertBefore(iframe, body.firstChild).contentWindow
	                        iWindow.document.open()
	                        iWindow.document.close()
	                        iWindow.location.hash = that.prefix + that.fragment
	                    })
	                    break
	            }
	            if (!this.options.silent) {
	                return this.fireUrlChange()
	            }
	        },
	        // 中断URL的监听
	        stop: function () {
	            switch (this.monitorMode) {
	                case "popstate" :
	                    avalon.unbind(window, 'popstate', this._checkUrlChange)
	                    break
	                case "hashchange":
	                    avalon.unbind(window, 'hashchange', this._checkUrlChange)
	                    break
	                case "iframepoll":
	                    if (this.iframe) {
	                        document.body.removeChild(this.iframe)
	                        this.iframe = null
	                    }
	                    clearInterval(this._intervalID)
	                    break
	            }
	            History.started = false
	        },
	        // 触发预先绑定的回调
	        fireUrlChange: function (fragment) {
	//            if (!this.matchRoot()) {
	//                return false
	//            }
	            fragment = this.fragment = this.getFragment(fragment)

	            if (avalon.router) {
	                avalon.router.setLastPath(fragment)//保存到本地储存或cookie
	                avalon.router.navigate(fragment)
	            }
	            if (this.options.fireAnchor) {
	                scrollToAnchorId(fragment.replace(/\?.*/g, ""))
	            }
	        },
	        // 用动触发回调并更新地址栏, options里面 replace, trigger

	        navigate: function (fragment, options) {
	            if (!History.started)
	                return false
	            if (!options || options === true) {
	                options = {trigger: options}
	            }
	            // Normalize the fragment.
	            fragment = this.getFragment(fragment || '')

	            // Don't include a trailing slash on the root.
	            var root = this.root;
	            if (fragment === '' || fragment.charAt(0) === '?') {
	                root = root.slice(0, -1) || '/';
	            }
	            var url = root + fragment

	            // Strip the hash and decode for matching.
	            fragment = this.decodeFragment(fragment.replace(/#.*$/, ''));
	            if (this.fragment === fragment)
	                return
	            this.fragment = fragment

	            if (this.monitorMode === "popstate") {
	                this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
	            } else if (!this.options.html5Mode) {
	                this._updateHash(this.location, fragment, options.replace);
	                if (this.iframe && (fragment !== this.getHash(this.iframe.contentWindow))) {
	                    var iWindow = this.iframe.contentWindow
	                    // IE67需要通过iframe创建一个历史记录
	                    if (!options.replace) {
	                        iWindow.document.open();
	                        iWindow.document.close();
	                    }
	                    this._updateHash(iWindow.location, fragment, options.replace)
	                }
	            } else {
	                return this.location.assign(url)
	            }
	            if (options.trigger) {
	                return this.fireUrlChange(fragment)
	            }
	        },
	        // 更新hash或地址的某一部分
	        _updateHash: function (location, fragment, replace) {
	            if (replace) {
	                var href = location.href.replace(/(javascript:|#).*$/, '');
	                location.replace(href + this.prefix + fragment);
	            } else {
	                location.hash = this.prefix + fragment
	            }
	        }

	    }
	    avalon.history = new History

	//https://github.com/asual/jquery-address/blob/master/src/jquery.address.js

	//劫持页面上所有点击事件，如果事件源来自链接或其内部，
	//并且它不会跳出本页，并且以"#/"或"#!/"开头，那么触发updateLocation方法
	    avalon.bind(document, "click", function (event) {
	        var defaultPrevented = "defaultPrevented" in event ? event['defaultPrevented'] : event.returnValue === false

	        if (!History.started || defaultPrevented || event.ctrlKey
	                || event.metaKey || event.which === 2)
	            return
	        var target = event.target
	        while (target.nodeName !== "A") {
	            target = target.parentNode
	            if (!target || target.tagName === "BODY") {
	                return
	            }
	        }

	        if (targetIsThisWindow(target.target)) {
	            var href = target.getAttribute("href", 2) || target.getAttribute("xlink:href")

	            var prefix = avalon.history.prefix
	            if (href === null) { // href is null if the attribute is not present
	                return
	            }
	            var hash = href.replace(prefix, "").trim()
	            if (!(href.indexOf(prefix) === 0 && hash !== "")) {
	                var routeElementJudger = avalon.history.options.routeElementJudger
	                hash = routeElementJudger(target, href)
	                if (hash === true)
	                    hash = href
	            }
	            if (hash) {
	                event.preventDefault()
	                avalon.history.navigate(hash, true)
	            }
	        }
	    })

	//判定A标签的target属性是否指向自身
	//thanks https://github.com/quirkey/sammy/blob/master/lib/sammy.js#L219
	    function targetIsThisWindow(targetWindow) {
	        if (!targetWindow || targetWindow === window.name || targetWindow === '_self' || (targetWindow === 'top' && window == window.top)) {
	            return true
	        }
	        return false
	    }
	//得到页面第一个符合条件的A标签
	    function getFirstAnchor(list) {
	        for (var i = 0, el; el = list[i++]; ) {
	            if (el.nodeName === "A") {
	                return el
	            }
	        }
	    }

	    function scrollToAnchorId(hash, el) {
	        if ((el = document.getElementById(hash))) {
	            el.scrollIntoView()
	        } else if ((el = getFirstAnchor(document.getElementsByName(hash)))) {
	            el.scrollIntoView()
	        } else {
	            window.scrollTo(0, 0)
	        }
	    }
	    return avalon
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./mmHistory": 6,
		"./mmHistory.js": 6,
		"./mmPromise": 2,
		"./mmPromise.js": 2,
		"./mmRouter": 5,
		"./mmRouter.js": 5,
		"./mmState": 1,
		"./mmState.js": 1
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 7;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//=========================================
	//  数据交互模块 by 司徒正美
	//  版本: 1.0.0
	//  最近更新: 2015/4/30
	//==========================================
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function(avalon) {
	    var global = window
	    var DOC = global.document
	    var encode = encodeURIComponent
	    var decode = decodeURIComponent

	    var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
	    var rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg
	    var rnoContent = /^(?:GET|HEAD)$/
	    var rprotocol = /^\/\//
	    var rhash = /#.*$/
	    var rquery = /\?/
	    var rjsonp = /(=)\?(?=&|$)|\?\?/
	    var r20 = /%20/g
	    var radd = /\+/g
	    var r5b5d = /%5B(.*?)%5D$/;

	    var originAnchor = document.createElement("a")
	    originAnchor.href = location.href
	    //告诉WEB服务器自己接受什么介质类型，*/* 表示任何类型，type/* 表示该类型下的所有子类型，type/sub-type。
	    var accepts = {
	        xml: "application/xml, text/xml",
	        html: "text/html",
	        text: "text/plain",
	        json: "application/json, text/javascript",
	        script: "text/javascript, application/javascript",
	        "*": ["*/"] + ["*"] //避免被压缩掉
	    }

	    function IE() {
	        if (window.VBArray) {
	            var mode = document.documentMode
	            return mode ? mode : window.XMLHttpRequest ? 7 : 6
	        } else {
	            return 0
	        }
	    }
	    var useOnload = IE() === 0 || IE() > 8

	    function parseJS(code) {
	        var indirect = eval
	        code = code.trim()
	        if (code) {
	            if (code.indexOf("use strict") === 1) {
	                var script = document.createElement("script")
	                script.text = code;
	                head.appendChild(script).parentNode.removeChild(script)
	            } else {
	                indirect(code)
	            }
	        }
	    }

	    if (!String.prototype.startsWith) {
	        String.prototype.startsWith = function(searchString, position) {
	            position = position || 0;
	            return this.lastIndexOf(searchString, position) === position;
	        }
	    }

	    var head = DOC.getElementsByTagName("head")[0] //HEAD元素
	    var isLocal = false
	    try {
	        //在IE下如果重置了document.domain，直接访问window.location会抛错，但用document.URL就ok了
	        //http://www.cnblogs.com/WuQiang/archive/2012/09/21/2697474.html
	        isLocal = rlocalProtocol.test(location.protocol)
	    } catch (e) {
	    }

	    new function() {
	        //http://www.cnblogs.com/rubylouvre/archive/2010/04/20/1716486.html
	        var s = ["XMLHttpRequest",
	            "ActiveXObject('MSXML2.XMLHTTP.6.0')",
	            "ActiveXObject('MSXML2.XMLHTTP.3.0')",
	            "ActiveXObject('MSXML2.XMLHTTP')",
	            "ActiveXObject('Microsoft.XMLHTTP')"
	        ]
	        s[0] = IE() < 8 && IE() !== 0 && isLocal ? "!" : s[0] //IE下只能使用ActiveXObject
	        for (var i = 0, axo; axo = s[i++];) {
	            try {
	                if (eval("new " + axo)) {
	                    avalon.xhr = new Function("return new " + axo)
	                    break;
	                }
	            } catch (e) {
	            }
	        }}
	    var supportCors = "withCredentials" in avalon.xhr()




	    function parseXML(data, xml, tmp) {
	        try {
	            var mode = document.documentMode
	            if (window.DOMParser && (!mode || mode > 8)) { // Standard
	                tmp = new DOMParser()
	                xml = tmp.parseFromString(data, "text/xml")
	            } else { // IE
	                xml = new ActiveXObject("Microsoft.XMLDOM") //"Microsoft.XMLDOM"
	                xml.async = "false";
	                xml.loadXML(data)
	            }
	        } catch (e) {
	        xml = void  0
	        }
	        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
	            avalon.error("Invalid XML: " + data)
	        }
	        return xml
	    }

	    //ajaxExtend是一个非常重要的内部方法，负责将用法参数进行规整化
	    //1. data转换为字符串
	    //2. type转换为大写
	    //3. url正常化，加querystring, 加时间戮
	    //4. 判定有没有跨域
	    //5. 添加hasContent参数
	    var defaults = {
	        type: "GET",
	        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	        async: true,
	        jsonp: "callback"
	    }
	    function ajaxExtend(opts) {
	        opts = avalon.mix({}, defaults, opts)
	        opts.type = opts.type.toUpperCase()
	        var querystring = typeof opts.data === "string" ? opts.data : avalon.param(opts.data)
	        opts.querystring = querystring || ""
	        opts.url = opts.url.replace(rhash, "").replace(rprotocol, location.protocol + "//")

	        if (typeof opts.crossDomain !== "boolean") { //判定是否跨域
	            var urlAnchor = document.createElement("a");
	            // Support: IE6-11+
	            // IE throws exception if url is malformed, e.g. http://example.com:80x/
	            try {
	                urlAnchor.href = opts.url;
	                // in IE7-, get the absolute path
	                var absUrl = !"1"[0] ? urlAnchor.getAttribute("href", 4) : urlAnchor.href;
	                urlAnchor.href = absUrl
	                opts.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
	            } catch (e) {
	            opts.crossDomain = true;
	            }
	        }
	        opts.hasContent = !rnoContent.test(opts.type) //是否为post请求
	        if (!opts.hasContent) {
	            if (querystring) { //如果为GET请求,则参数依附于url上
	                opts.url += (rquery.test(opts.url) ? "&" : "?") + querystring;
	            }
	            if (opts.cache === false) { //添加时间截
	                opts.url += (rquery.test(opts.url) ? "&" : "?") + "_time=" + (new Date() - 0)
	            }
	        }
	        return opts;
	    }
	    /**
	     * 伪XMLHttpRequest类,用于屏蔽浏览器差异性
	     * var ajax = new(self.XMLHttpRequest||ActiveXObject)("Microsoft.XMLHTTP")
	     * ajax.onreadystatechange = function(){
	     *   if (ajax.readyState==4 && ajax.status==200){
	     *        alert(ajax.responseText)
	     *   }
	     * }
	     * ajax.open("POST", url, true) 
	     * ajax.send("key=val&key1=val2") 
	     */
	    var XHRMethods = {
	        setRequestHeader: function(name, value) {
	            this.requestHeaders[name] = value;
	            return this;
	        },
	        getAllResponseHeaders: function() {
	            return this.readyState === 4 ? this.responseHeadersString : null;
	        },
	        getResponseHeader: function(name, match) {
	            if (this.readyState === 4) {
	                while ((match = rheaders.exec(this.responseHeadersString))) {
	                    this.responseHeaders[match[1]] = match[2];
	                }
	                match = this.responseHeaders[name];
	            }
	            return match === undefined ? null : match;
	        },
	        overrideMimeType: function(type) {
	            this.mimeType = type;
	            return this;
	        },
	        // 中止请求
	        abort: function(statusText) {
	            statusText = statusText || "abort";
	            if (this.transport) {
	                this.respond(0, statusText)
	            }
	            return this;
	        },
	        /**
	         * 用于派发success,error,complete等回调
	         * http://www.cnblogs.com/rubylouvre/archive/2011/05/18/2049989.html
	         * @param {Number} status 状态码
	         * @param {String} statusText 对应的扼要描述
	         */
	        dispatch: function(status, nativeStatusText) {
	            var statusText = nativeStatusText
	            // 只能执行一次，防止重复执行
	            if (!this.transport) { //2:已执行回调
	                return
	            }
	            this.readyState = 4
	            var isSuccess = status >= 200 && status < 300 || status === 304
	            if (isSuccess) {
	                if (status === 204) {
	                    statusText = "nocontent"
	                } else if (status === 304) {
	                    statusText = "notmodified"
	                } else {
	                    //如果浏览器能直接返回转换好的数据就最好不过,否则需要手动转换
	                    if (typeof this.response === "undefined") {
	                        var dataType = this.options.dataType || this.options.mimeType
	                        if (!dataType && this.responseText || this.responseXML) { //如果没有指定dataType，则根据mimeType或Content-Type进行揣测
	                            dataType = this.getResponseHeader("Content-Type") || ""
	                            dataType = dataType.match(/json|xml|script|html/i) || ["text"]
	                            dataType = dataType[0].toLowerCase()
	                        }
	                        var responseText = this.responseText || '',
	                            responseXML = this.responseXML || ''
	                        try {
	                            this.response = avalon.ajaxConverters[dataType].call(this, responseText, responseXML)
	                        } catch (e) {
	                        isSuccess = false
	                        this.error = e
	                        statusText = "parsererror"
	                        }
	                    }
	                }
	            }
	            this.status = status;
	            this.statusText = statusText + ""
	            if (this.timeoutID) {
	                clearTimeout(this.timeoutID)
	                delete this.timeoutID
	            }
	            this._transport = this.transport

	            /**
	             * global event handler
	             */
	            var that = this

	            // 到这要么成功，调用success, 要么失败，调用 error, 最终都会调用 complete
	            if (isSuccess) {
	                this._resolve([this.response, statusText, this])
	                /**
	                 * global event handler
	                 */
	                window.setTimeout(function() {
	                    avalon.ajaxGlobalEvents.success(that, that.options, that.response)
	                }, 0)
	            } else {
	                this._reject([this, statusText, this.error])
	                /**
	                 * global event handler
	                 */
	                window.setTimeout(function() {
	                    avalon.ajaxGlobalEvents.error(that, that.options, statusText)
	                }, 0)
	            }
	            delete this.transport

	            /**
	             * global event handler
	             */
	            ajaxActive--

	            window.setTimeout(function() {
	                avalon.ajaxGlobalEvents.complete(that, that.options)
	            }, 0)

	            if (ajaxActive === 0) {
	                // 最后一个
	                window.setTimeout(function() {
	                    avalon.ajaxGlobalEvents.stop()
	                }, 0)
	            }

	        }
	    }
	    /**
	     * global event handler
	     */
	    // 记录当前活跃的 ajax 数
	    var ajaxActive = 0

	    //ajax主函数
	    avalon.ajax = function(opts, promise) {
	        if (!opts || !opts.url) {
	            avalon.error("参数必须为Object并且拥有url属性")
	        }
	        opts = ajaxExtend(opts) //处理用户参数，比如生成querystring, type大写化
	        //创建一个伪XMLHttpRequest,能处理complete,success,error等多投事件
	        var XHRProperties = {
	            responseHeadersString: "",
	            responseHeaders: {},
	            requestHeaders: {},
	            querystring: opts.querystring,
	            readyState: 0,
	            uniqueID: ("" + Math.random()).replace(/0\./, ""),
	            status: 0
	        }
	        var _reject, _resolve
	        var promise = new avalon.Promise(function(resolve, reject) {
	            _resolve = resolve
	            _reject = reject
	        })

	        promise.options = opts
	        promise._reject = _reject
	        promise._resolve = _resolve

	        var doneList = [],
	            failList = []

	        Array("done", "fail", "always").forEach(function(method) {
	            promise[method] = function(fn) {
	                if (typeof fn === "function") {
	                    if (method !== "fail")
	                        doneList.push(fn)
	                    if (method !== "done")
	                        failList.push(fn)
	                }
	                return this
	            }
	        })

	        var isSync = opts.async === false
	        if (isSync) {
	            avalon.log("warnning:与jquery1.8一样,async:false这配置已经被废弃")
	            promise.async = false
	        }


	        avalon.mix(promise, XHRProperties, XHRMethods)

	        promise.then(function(value) {
	            value = Array.isArray(value) ? value : value === void 0 ? [] : [value]
	            for (var i = 0, fn; fn = doneList[i++];) {
	                fn.apply(promise, value)
	            }
	            return value
	        }, function(value) {
	            value = Array.isArray(value) ? value : value === void 0 ? [] : [value]
	            for (var i = 0, fn; fn = failList[i++];) {
	                fn.apply(promise, value)
	            }
	            return value
	        })


	        promise.done(opts.success).fail(opts.error).always(opts.complete)

	        var dataType = opts.dataType //目标返回数据类型
	        var transports = avalon.ajaxTransports

	        if ((opts.crossDomain && !supportCors || rjsonp.test(opts.url)) && dataType === "json" && opts.type === "GET") {
	            dataType = opts.dataType = "jsonp"
	        }
	        var name = opts.form ? "upload" : dataType
	        var transport = transports[name] || transports.xhr
	        avalon.mix(promise, transport) //取得传送器的request, respond, preproccess
	        if (promise.preproccess) { //这用于jsonp upload传送器
	            dataType = promise.preproccess() || dataType
	        }
	        //设置首部 1、Content-Type首部
	        if (opts.contentType) {
	            promise.setRequestHeader("Content-Type", opts.contentType)
	        }
	        //2.处理Accept首部
	        promise.setRequestHeader("Accept", accepts[dataType] ? accepts[dataType] + ", */*; q=0.01" : accepts["*"])
	        for (var i in opts.headers) { //3. 处理headers里面的首部
	            promise.setRequestHeader(i, opts.headers[i])
	        }
	        // 4.处理超时
	        if (opts.async && opts.timeout > 0) {
	            promise.timeoutID = setTimeout(function() {
	                promise.abort("timeout")
	                promise.dispatch(0, "timeout")
	            }, opts.timeout)
	        }

	        /**
	         * global event handler
	         */
	        if (ajaxActive === 0) {
	            // 第一个
	            avalon.ajaxGlobalEvents.start()
	        }
	        avalon.ajaxGlobalEvents.send(promise, opts)
	        ajaxActive++



	        promise.request()
	        return promise
	    };
	    "get,post".replace(avalon.rword, function(method) {
	        avalon[method] = function(url, data, callback, type) {
	            if (typeof data === "function") {
	                type = type || callback
	                callback = data
	                data = void 0
	            }
	            return avalon.ajax({
	                type: method,
	                url: url,
	                data: data,
	                success: callback,
	                dataType: type
	            })
	        };
	    })
	    function ok(val) {
	        return val
	    }
	    function ng(e) {
	        throw e
	    }
	    avalon.getScript = function(url, callback) {
	        return avalon.get(url, null, callback, "script")
	    }
	    avalon.getJSON = function(url, data, callback) {
	        return avalon.get(url, data, callback, "json")
	    }
	    avalon.upload = function(url, form, data, callback, dataType) {
	        if (typeof data === "function") {
	            dataType = callback;
	            callback = data;
	            data = void 0;
	        }
	        return avalon.ajax({
	            url: url,
	            type: "post",
	            dataType: dataType,
	            form: form,
	            data: data,
	            success: callback
	        });
	    }


	    /**
	     * global event handler
	     */
	    avalon.ajaxGlobalEvents = {};

	    ["start", "stop", "complete", "error", "success", "send"].forEach(function(method) {
	        avalon.ajaxGlobalEvents[method] = avalon.noop
	    })

	    avalon.ajaxConverters = { //转换器，返回用户想要做的数据
	        text: function(text) {
	            // return text || "";
	            return text;
	        },
	        xml: function(text, xml) {
	            return xml !== void 0 ? xml : parseXML(text)
	        },
	        html: function(text) {
	            return avalon.parseHTML(text) //一个文档碎片,方便直接插入DOM树
	        },
	        json: function(text) {
	            if (!avalon.parseJSON) {
	                avalon.log("avalon.parseJSON不存在,请升级到最新版")
	            }
	            return avalon.parseJSON(text)
	        },
	        script: function(text) {
	            parseJS(text)
	            return text;
	        },
	        jsonp: function() {
	            var json, callbackName;
	            if (this.jsonpCallback.startsWith('avalon.')) {
	                callbackName = this.jsonpCallback.replace(/avalon\./, '')
	                json = avalon[callbackName]
	                delete avalon[callbackName]
	            } else {
	                json = window[this.jsonpCallback]
	            }
	            return json;
	        }
	    }

	    var rbracket = /\[\]$/
	    avalon.param = function(obj) {
	        var prefix,
	            s = [],
	            add = function(key, value) {
	                // If value is a function, invoke it and return its value
	                value = typeof value === "function" ? value() : (value == null ? "" : value);
	                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	        }
	        // 处理数组与类数组的jquery对象
	        if (Array.isArray(obj)) {
	            // Serialize the form elements
	            avalon.each(obj, add)

	        } else {
	            for (prefix in obj) {
	                paramInner(prefix, obj[prefix], add);
	            }
	        }

	        // Return the resulting serialization
	        return s.join("&").replace(r20, "+");
	    }

	    function paramInner(prefix, obj, add) {
	        var name;
	        if (Array.isArray(obj)) {
	            // Serialize array item.
	            avalon.each(obj, function(i, v) {
	                if (rbracket.test(prefix)) {
	                    // Treat each array item as a scalar.
	                    add(prefix, v);
	                } else {
	                    // Item is non-scalar (array or object), encode its numeric index.
	                    paramInner(
	                        prefix + "[" + (typeof v === "object" ? i : "") + "]",
	                        v,
	                        add);
	                }
	            });
	        } else if (avalon.isPlainObject(obj)) {
	            // Serialize object item.
	            for (name in obj) {
	                paramInner(prefix + "[" + name + "]", obj[name], add);
	            }

	        } else {
	            // Serialize scalar item.
	            add(prefix, obj);
	        }
	    }
	    //将一个字符串转换为对象
	    function tryDecodeURIComponent(value) {
	        try {
	            return decodeURIComponent(value);
	        } catch (e) {
	        return value
	        }
	    }


	    //a%5B0%5D%5Bvalue%5D a%5B1%5D%5B%5D
	    function addSubObject(host, text, value) {
	        var match = text.match(r5b5d)
	        if (!match) {
	            return true
	        }

	        var steps = []
	        var first = true
	        var step, index, key
	        while (index = text.lastIndexOf("%5B")) {
	            if (index === -1) {
	                break
	            }
	            key = text.slice(index).slice(3, -3)
	            text = text.slice(0, index)
	            if (key === "") {
	                steps.unshift({
	                    action: "pushArrayElement"
	                })
	            } else if ((key >>> 0) + "" === key) {
	                steps.unshift({
	                    action: "setSubArray",
	                    value: key
	                })
	            } else {
	                if (first) {
	                    steps.unshift({
	                        action: "setObjectProperty",
	                        value: tryDecodeURIComponent(key)
	                    })
	                } else {
	                    steps.unshift({
	                        action: "setSubObjet",
	                        value: tryDecodeURIComponent(key)
	                    })
	                }
	            }
	            first = false
	        }
	        first = true
	        while (step = steps.shift()) {
	            var isObject = /Object/.test(step.action)
	            if (first) {
	                if (!(text in host)) {
	                    host[text] = isObject ? {} : []
	                }
	                first = false
	                host = host[text]
	            }
	            switch (step.action) {
	                case "pushArrayElement":
	                    host.push(value)
	                    break
	                case "setObjectProperty":
	                    host[step.value] = value
	                    break
	                case "setSubObjet":
	                    if (!(step.value in host)) {
	                        host[step.value] = {}
	                    }
	                    host = host[step.value]
	                    break
	                case "setSubArray":
	                    if (!(step.value in host)) {
	                        host[step.value] = []
	                    }
	                    host = host[step.value]
	                    break
	            }
	        }
	    }
	    //  function add
	    avalon.unparam = function(qs, sep, eq) {
	        sep = sep || '&';
	        eq = eq || '=';
	        var obj = {};
	        if ((typeof qs !== "string") || qs.length === 0) {
	            return obj;
	        }
	        if (qs.indexOf("?") !== -1) {
	            qs = qs.split("?").pop()
	        }
	        var array = qs.split(sep);
	        for (var i = 0, el; el = array[i++];) {
	            var arr = el.split("=")
	            if (arr.length === 1) { //处理只有键名没键值的情况
	                obj[arr[0]] = ""
	            } else {
	                var key = arr[0].replace(radd, '%20')
	                var v = tryDecodeURIComponent(arr.slice(1).join("=").replace(radd, ' '));
	                if (addSubObject(obj, key, v)) { //处理存在中括号的情况
	                    var k = tryDecodeURIComponent(key) //处理不存在中括号的简单的情况
	                    if (!Object.prototype.hasOwnProperty.call(obj, k)) {
	                        obj[k] = v;
	                    } else if (Array.isArray(obj[k])) {
	                        obj[k].push(v);
	                    } else {
	                        obj[k] = [obj[k], v];
	                    }
	                }
	            }
	        }

	        return obj
	    }
	    var rinput = /select|input|button|textarea/i
	    var rcheckbox = /radio|checkbox/
	    var rline = /\r?\n/g
	    function trimLine(val) {
	        return val.replace(rline, "\r\n")
	    }
	    //表单元素变字符串, form为一个元素节点
	    avalon.serialize = function(form) {
	        var json = {};
	        // 不直接转换form.elements，防止以下情况：   <form > <input name="elements"/><input name="test"/></form>
	        Array.prototype.filter.call(form.getElementsByTagName("*"), function(el) {
	            if (rinput.test(el.nodeName) && el.name && !el.disabled) {
	                return rcheckbox.test(el.type) ? el.checked : true //只处理拥有name并且没有disabled的表单元素
	            }
	        }).forEach(function(el) {
	            var val = avalon(el).val()
	            val = Array.isArray(val) ? val.map(trimLine) : trimLine(val)
	            var name = el.name
	            if (name in json) {
	                if (Array.isArray(val)) {
	                    json[name].push(val)
	                } else {
	                    json[name] = [json[name], val]
	                }
	            } else {
	                json[name] = val
	            }
	        })
	        return avalon.param(json, false) // 名值键值对序列化,数组元素名字前不加 []
	    }

	    var transports = avalon.ajaxTransports = {
	        xhr: {
	            //发送请求
	            request: function() {
	                var self = this;
	                var opts = this.options;
	                var transport = this.transport = new avalon.xhr;
	                transport.open(opts.type, opts.url, opts.async, opts.username, opts.password)
	                if (this.mimeType && transport.overrideMimeType) {
	                    transport.overrideMimeType(this.mimeType)
	                }
	                //IE6下，如果transport中没有withCredentials，直接设置会报错
	                if (opts.crossDomain && "withCredentials" in transport) {
	                    transport.withCredentials = true
	                }

	                /*
	                 * header 中设置 X-Requested-With 用来给后端做标示：
	                 * 这是一个 ajax 请求。
	                 *
	                 * 在 Chrome、Firefox 3.5+ 和 Safari 4+ 下，
	                 * 在进行跨域请求时设置自定义 header，会触发 preflighted requests，
	                 * 会预先发送 method 为 OPTIONS 的请求。
	                 *
	                 * 于是，如果跨域，禁用此功能。
	                 */
	                if (!opts.crossDomain) {
	                    this.requestHeaders["X-Requested-With"] = "XMLHttpRequest"
	                }

	                for (var i in this.requestHeaders) {
	                    transport.setRequestHeader(i, this.requestHeaders[i] + "")
	                }

	                /*
	                 * progress
	                 */
	                if (opts.progressCallback) {
	                    // 判断是否 ie6-9
	                    var isOldIE = document.all && !window.atob;
	                    if (!isOldIE) {
	                        transport.upload.onprogress = opts.progressCallback
	                    }
	                }

	                var dataType = opts.dataType
	                if ("responseType" in transport && /^(blob|arraybuffer|text)$/.test(dataType)) {
	                    transport.responseType = dataType
	                    this.useResponseType = true
	                }
	                //必须要支持 FormData 和 file.fileList 的浏览器 才能用 xhr 发送
	                //标准规定的 multipart/form-data 发送必须用 utf-8 格式， 记得 ie 会受到 document.charset 的影响
	                transport.send(opts.hasContent && (this.formdata || this.querystring) || null)
	                //在同步模式中,IE6,7可能会直接从缓存中读取数据而不会发出请求,因此我们需要手动发出请求

	                if (!opts.async || transport.readyState === 4) {
	                    this.respond()
	                } else {
	                    if (useOnload) { //如果支持onerror, onload新API
	                        transport.onload = transport.onerror = function(e) {
	                            this.readyState = 4 //IE9+
	                            this.status = e.type === "load" ? 200 : 500
	                            self.respond()
	                        }
	                    } else {
	                        transport.onreadystatechange = function() {
	                            self.respond()
	                        }
	                    }
	                }
	            },
	            //用于获取原始的responseXMLresponseText 修正status statusText
	            //第二个参数为1时中止清求
	            respond: function(event, forceAbort) {
	                var transport = this.transport
	                if (!transport) {
	                    return
	                }
	                // by zilong：避免abort后还继续派发onerror等事件
	                if (forceAbort && this.timeoutID) {
	                    clearTimeout(this.timeoutID);
	                    delete this.timeoutID
	                }
	                try {
	                    var completed = transport.readyState === 4
	                    if (forceAbort || completed) {
	                        transport.onreadystatechange = avalon.noop
	                        if (useOnload) { //IE6下对XHR对象设置onerror属性可能报错
	                            transport.onerror = transport.onload = null
	                        }
	                        if (forceAbort) {
	                            if (!completed && typeof transport.abort === "function") { // 完成以后 abort 不要调用
	                                transport.abort()
	                            }
	                        } else {
	                            var status = transport.status
	                            //设置responseText
	                            var text = transport.responseText

	                            this.responseText = typeof text === "string" ? text : void 0
	                            //设置responseXML
	                            try {
	                                //当responseXML为[Exception: DOMException]时，
	                                //访问它会抛“An attempt was made to use an object that is not, or is no longer, usable”异常
	                                var xml = transport.responseXML
	                                this.responseXML = xml.documentElement
	                            } catch (e) {
	                            }
	                            //设置response
	                            if (this.useResponseType) {
	                                this.response = transport.response
	                            }
	                            //设置responseHeadersString
	                            this.responseHeadersString = transport.getAllResponseHeaders()

	                            try { //火狐在跨城请求时访问statusText值会抛出异常
	                                var statusText = transport.statusText
	                            } catch (e) {
	                            this.error = e
	                            statusText = "firefoxAccessError"
	                            }
	                            //用于处理特殊情况,如果是一个本地请求,只要我们能获取数据就假当它是成功的
	                            if (!status && isLocal && !this.options.crossDomain) {
	                                status = this.responseText ? 200 : 404
	                            //IE有时会把204当作为1223
	                            } else if (status === 1223) {
	                                status = 204
	                            }
	                            this.dispatch(status, statusText)
	                        }
	                    }
	                } catch (err) {
	                // 如果网络问题时访问XHR的属性，在FF会抛异常
	                // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
	                if (!forceAbort) {
	                this.dispatch(500, err)
	                }
	                }
	            }
	        },
	        jsonp: {
	            preproccess: function() {
	                var opts = this.options;
	                var name = this.jsonpCallback = opts.jsonpCallback || "avalon.jsonp" + setTimeout("1")
	                if (rjsonp.test(opts.url)) {
	                    opts.url = opts.url.replace(rjsonp, "$1" + name)
	                } else {
	                    opts.url = opts.url + (rquery.test(opts.url) ? "&" : "?") + opts.jsonp + "=" + name
	                }
	                //将后台返回的json保存在惰性函数中
	                if (name.startsWith('avalon.')) {
	                    name = name.replace(/avalon\./, '')
	                    avalon[name] = function(json) {
	                        avalon[name] = json
	                    }
	                } else {
	                    window[name] = function(json) {
	                        window[name] = json
	                    }
	                }
	                return "script"
	            }
	        },
	        script: {
	            request: function() {
	                var opts = this.options;
	                var node = this.transport = DOC.createElement("script")
	                if (opts.charset) {
	                    node.charset = opts.charset
	                }
	                var self = this;
	                node.onerror = node[useOnload ? "onload" : "onreadystatechange"] = function() {
	                    self.respond()
	                };
	                node.src = opts.url
	                head.insertBefore(node, head.firstChild)
	            },
	            respond: function(event, forceAbort) {
	                var node = this.transport
	                if (!node) {
	                    return
	                }
	                // by zilong：避免abort后还继续派发onerror等事件
	                if (forceAbort && this.timeoutID) {
	                    clearTimeout(this.timeoutID);
	                    delete this.timeoutID
	                }
	                var execute = /loaded|complete|undefined/i.test(node.readyState)
	                if (forceAbort || execute) {
	                    node.onerror = node.onload = node.onreadystatechange = null
	                    var parent = node.parentNode;
	                    if (parent) {
	                        parent.removeChild(node)
	                    }
	                    if (!forceAbort) {
	                        var args;
	                        if (this.jsonpCallback) {
	                            var jsonpCallback = this.jsonpCallback.startsWith('avalon.') ? avalon[this.jsonpCallback.replace(/avalon\./, '')] : window[this.jsonpCallback]
	                            args = typeof jsonpCallback === "function" ? [500, "error"] : [200, "success"]
	                        } else {
	                            args = [200, "success"]
	                        }

	                        this.dispatch.apply(this, args)
	                    }
	                }
	            }
	        },
	        upload: {
	            preproccess: function() {
	                var opts = this.options, formdata
	                if (typeof opts.form.append === "function") { //简单判断opts.form是否为FormData
	                    formdata = opts.form;
	                    opts.contentType = '';
	                } else {
	                    formdata = new FormData(opts.form) //将二进制什么一下子打包到formdata
	                }
	                avalon.each(opts.data, function(key, val) {
	                    formdata.append(key, val) //添加客外数据
	                })
	                this.formdata = formdata
	            }
	        }
	    }


	    avalon.mix(transports.jsonp, transports.script)
	    avalon.mix(transports.upload, transports.xhr)

	    if (!window.FormData) {
	        var str = 'Function BinaryToArray(binary)\r\n\
	                 Dim oDic\r\n\
	                 Set oDic = CreateObject("scripting.dictionary")\r\n\
	                 length = LenB(binary) - 1\r\n\
	                 For i = 1 To length\r\n\
	                     oDic.add i, AscB(MidB(binary, i, 1))\r\n\
	                 Next\r\n\
	                 BinaryToArray = oDic.Items\r\n\
	              End Function'
	        execScript(str, "VBScript");
	        avalon.fixAjax = function() {
	            avalon.ajaxConverters.arraybuffer = function() {
	                var body = this.tranport && this.tranport.responseBody
	                if (body) {
	                    return new VBArray(BinaryToArray(body)).toArray();
	                }
	            };
	            function createIframe(ID) {
	                var iframe = avalon.parseHTML("<iframe " + " id='" + ID + "'" +
	                    " name='" + ID + "'" + " style='position:absolute;left:-9999px;top:-9999px;'/>").firstChild;
	                return (DOC.body || DOC.documentElement).insertBefore(iframe, null);
	            }
	            function addDataToForm(form, data) {
	                var ret = [],
	                    d, isArray, vs, i, e;
	                for (d in data) {
	                    isArray = Array.isArray(data[d]);
	                    vs = isArray ? data[d] : [data[d]];
	                    // 数组和原生一样对待，创建多个同名输入域
	                    for (i = 0; i < vs.length; i++) {
	                        e = DOC.createElement("input");
	                        e.type = 'hidden';
	                        e.name = d;
	                        e.value = vs[i];
	                        form.appendChild(e);
	                        ret.push(e);
	                    }
	                }
	                return ret;
	            }
	            //https://github.com/codenothing/Pure-Javascript-Upload/blob/master/src/upload.js
	            avalon.ajaxTransports.upload = {
	                request: function() {
	                    var self = this;
	                    var opts = this.options;
	                    var ID = "iframe-upload-" + this.uniqueID;
	                    var form = opts.form;
	                    var iframe = this.transport = createIframe(ID);
	                    //form.enctype的值
	                    //1:application/x-www-form-urlencoded   在发送前编码所有字符（默认）
	                    //2:multipart/form-data 不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。
	                    //3:text/plain  空格转换为 "+" 加号，但不对特殊字符编码。
	                    var backups = {
	                        target: form.target || "",
	                        action: form.action || "",
	                        enctype: form.enctype,
	                        method: form.method
	                    };
	                    var fields = opts.data ? addDataToForm(form, opts.data) : [];
	                    //必须指定method与enctype，要不在FF报错
	                    //表单包含文件域时，如果缺少 method=POST 以及 enctype=multipart/form-data，
	                    // 设置target到隐藏iframe，避免整页刷新
	                    form.target = ID;
	                    form.action = opts.url;
	                    form.method = "POST";
	                    form.enctype = "multipart/form-data";
	                    this.uploadcallback = avalon.bind(iframe, "load", function(event) {
	                        self.respond(event);
	                    });
	                    form.submit();
	                    //还原form的属性
	                    for (var i in backups) {
	                        form[i] = backups[i];
	                    }
	                    //移除之前动态添加的节点
	                    fields.forEach(function(input) {
	                        form.removeChild(input);
	                    });
	                },
	                respond: function(event) {
	                    var node = this.transport, child
	                    // 防止重复调用,成功后 abort
	                    if (!node) {
	                        return;
	                    }
	                    if (event && event.type === "load") {
	                        var doc = node.contentWindow.document;
	                        this.responseXML = doc;
	                        if (doc.body) { //如果存在body属性,说明不是返回XML
	                            this.responseText = doc.body.innerHTML;
	                            //当MIME为'application/javascript' 'text/javascript",浏览器会把内容放到一个PRE标签中
	                            if ((child = doc.body.firstChild) && child.nodeName.toUpperCase() === 'PRE' && child.firstChild) {
	                                this.responseText = child.firstChild.nodeValue;
	                            }
	                        }
	                        this.dispatch(200, "success");
	                    }
	                    this.uploadcallback = avalon.unbind(node, "load", this.uploadcallback);
	                    delete this.uploadcallback;
	                    setTimeout(function() { // Fix busy state in FF3
	                        node.parentNode.removeChild(node);
	                    });
	                }
	            };
	            delete avalon.fixAjax;
	        };
	        avalon.fixAjax()
	    }
	    return avalon
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	/**
	 2011.8.31
	 将会传送器的abort方法上传到avalon.XHR.abort去处理
	 修复serializeArray的bug
	 对XMLHttpRequest.abort进行try...catch
	 2012.3.31 v2 大重构,支持XMLHttpRequest Level2
	 2013.4.8 v3 大重构 支持二进制上传与下载
	 http://www.cnblogs.com/heyuquan/archive/2013/05/13/3076465.html
	 2014.12.25  v4 大重构 
	 2015.3.2   去掉mmPromise
	 2014.3.13  使用加强版mmPromise
	 2014.3.17  增加 xhr 的 onprogress 回调
	 */

/***/ }
]);