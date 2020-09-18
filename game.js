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
    
    this.ready = false;
    this.R = {};
    this.loadDownNumber = 0;
    //游戏关卡
    this.levels = [
      {
        "name":"关卡一",
        "key":1,
        "X":200,
        "Y":200
      },
      {
        "name":"关卡2",
        "key":2,
        "X":100,
        "Y":800
      },
      {
        "name":"关卡3",
        "key":3,
        "X":1000,
        "Y":800
      },
      {
        "name":"关卡4",
        "key":4,
        "X":1800,
        "Y":1800
      },
      {
        "name":"关卡5",
        "key":5,
        "X":1000,
        "Y":1200
      }
    ],
    // 关卡路径
    this.levelsPath = [];

    // 当前关卡 | 目标关卡
    this.currentLevel = this.levels[0];
    this.targetLevel = this.levels[4];

    // 游戏步数
    this.steps = 0;

    // 屏幕视口
    this.screen = document.querySelector('.main');

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
  // 屏幕拖动
  Game.prototype.watchScreenDrap = function(){
    var self = this;
    var startX = startY = endX = endY = 0;
    // 阻力系数
    var obstruction = 0.7;
    window.addEventListener('touchstart',function(event){
      var touch = event.targetTouches[0];
      //滑动起点的坐标
      startX = touch.pageX;
      startY = touch.pageY;
    },false);
    window.addEventListener('touchmove',function(event){
      var touch = event.targetTouches[0];
      endX = touch.pageX;
      endY = touch.pageY;
      var disX = (endX - startX) * obstruction,
          disY = (endY - startY) * obstruction;
      self.map.move(disX,disY,'drag');
    },false)
  }

  Game.prototype.updated = function(){

  }

  Game.prototype.start = function(){
    console.log("开始游戏")
    // 实例化地图
    this.map = new Map();

    // 实例化骰子
    this.rollDice = new RollDice({"canvasId":'RollDice'});

    this.watchScreenDrap();
  }
})()