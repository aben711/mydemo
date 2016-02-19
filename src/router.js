define(["mmState", "mmRequest"], function() {
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
                        require.ensure([], function(tt) {
                            rs(require("text!./web/common/common.html"))
                        })
                    })
                },
                controllerProvider: function() {
                    return new Promise(function(rs) {
                        require.ensure([], function(tt) {
                            rs(require("./web/common/common"))
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
                        require.ensure([], function(tt) {
                            rs(require("text!./web/home/home.html"))
                        })
                    })
                },
                controllerProvider: function() {
                    return new Promise(function(rs) {
                        require.ensure([], function(tt) {
                            rs(require("./web/home/home"))
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
                        require.ensure([], function(tt) {
                            rs(require("text!./web/aaa/aaa.html"))
                        })
                    })
                },
                controllerProvider: function() {
                    return new Promise(function(rs) {
                        require.ensure([], function(tt) {
                            rs(require("./web/aaa/aaa"))
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
                        require.ensure([], function(tt) {
                            rs(require("text!./web/bbb/bbb.html"))
                        })
                    })
                },
                controllerProvider: function() {
                    return new Promise(function(rs) {
                        require.ensure([], function(tt) {
                            rs(require("./web/bbb/bbb"))
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
})
