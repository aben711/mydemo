webpackJsonp([9],{

/***/ 11:
/***/ function(module, exports) {

	module.exports = "<div ms-controller=\"home\">\r\n    <div ms-repeat-el = \"menus\">\r\n        <div class=\"col-md-12\" >\r\n            <div class=\"col-md-1 col-lg-1 col-xs-12 col-sm-12\">\r\n                <h3>{{el.name}}</h3> \r\n            </div>\r\n            <div ms-repeat-item =\"el.items\" class=\"col-md-2 col-lg-2 col-xs-6 col-sm-3\">\r\n                <div class=\"top-news\">\r\n                    <a ms-attr-href=\"#!/{{item.no}}\" class=\"btn blue-madison\" >\r\n                        <div>\r\n                            {{item.name}}\r\n                        </div>\r\n                    </a>\r\n                </div> \r\n            </div>\r\n        </div>\r\n        <hr>\r\n    </div>\r\n</div>"

/***/ }

});