(function(){
  var Game = window.Game = function(){
    /**
     * 游戏资源下载
     * 加载动画
     * 关卡提示
     * 
     * 摇骰子选择关卡
     * 下一关卡寻路
     * 
     * 弹窗交互
     * 积分获取
     * 
     * 判断用户是否登录
     * 小程序跳转
     */
    //游戏关卡
    this.ready = false;
    this.R = {};
    this.loadDownNumber = 0;

    this.levels = [

    ],
    // 当前关卡 | 目标关卡
    this.currentLevels = null;
    this.targetLevels = null;

    // 游戏步数
    this.steps = 0;

    this.init();

    this.loadData().then(res => {
      this.start();
    })

  }

  Game.prototype.init = function(){

  }

  Game.prototype.loadData = function(){
    var self = this;
    // 加载资源 | 数量
    return new Promise((resolve,reject)=> {
      $.get('r.json',(r)=>{
        for(let item of r.images){
          self.R[item.name] = new Image();
          self.R[item.name].src = item.url;
          self.R[item.name].onload = function(){
            self.loadDownNumber ++;
            // 更改进度条
            $('.open-load .value').css({"width":self.loadDownNumber / r.images.length * 100 +'%'});
            $('.open-load .load-down-num').html(`正在加载资源 ${self.loadDownNumber}/${r.images.length} 请稍后...`)
            // 加载完成
            if(self.loadDownNumber == r.images.length){
              self.ready = true;
              var t = setTimeout(function(){
                $('.open-load').addClass('animate__fadeOut')
                $('.open-load').hide();
              },500);
              resolve(true);
            }
          }
        }
      })
    })
  }

  Game.prototype.updated = function(){

  }

  Game.prototype.start = function(){
    console.log("开始游戏")
    // 实例化地图
    this.map = new Map();

    // 实例化骰子
    this.rollDice = new RollDice({"canvasId":'RollDice'});
  }
})()