webpackJsonp([6],{

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    var vm = avalon.define({
	        $id: "aaa"
	    });
	    return avalon.controller(function($ctrl) {
	        // 进入视图
	        $ctrl.$onEnter = function() {
	        };
	        // 视图渲染后，意思是avalon.scan完成
	        $ctrl.$onRendered = function() {
	            avalon.log("-------" + vm.$id + " is success--------");
	        };
	        // 对应的视图销毁前
	        $ctrl.$onBeforeUnload = function() {};
	        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
	        $ctrl.$vmodels = [];
	    });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }

});