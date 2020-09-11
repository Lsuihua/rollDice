(function(){
    // 创建中间者
    var RollDice = window.RollDice = function(param){
        var self = this;
        self.canvas = document.getElementById(param.canvasId);
        self.ctx = self.canvas.getContext('2d');

        self.canvas.size = {};

        self.init();
        self.loadResources().then(res => {
            self.render();
        })
    }

    // 初始化配置
    RollDice.prototype.init = function(){
        var _winW = window.outerWidth,
            _winH = window.outerHeight;
        this.canvas.size.width = _winW;
        this.canvas.size.height = _winH;
    }

    // 加载资源
    RollDice.prototype.loadResources = function(){
        return new Promise((resolve,reject) => {
            resolve();
            // reject();
        });
    }

    // 画骰子
    RollDice.prototype.draw = function(){
        
    }

    // 动画
    RollDice.prototype.animation = function(){

    }

    // 更新
    RollDice.prototype.updated = function(){

    }

    // 渲染
    RollDice.prototype.render = function(){

    }
})()