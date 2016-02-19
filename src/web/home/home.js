define([], function() {
    var vm = avalon.define({
        $id: "home",
        menus: []
    });
    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {
            avalon.ajax({
                type:"GET",
                url:"mock/menu.json",
                success:function(data){
                    vm.menus = data;
                },
                error:function(){
                    avalon.log("menu data error");
                }
            })
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
})
