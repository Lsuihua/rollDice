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
    this.integral = 0;

    this.ready = false;
    this.R = {};
    this.loadDownNumber = 0;
    //游戏关卡
    this.levels = [
      {
        "name":"关卡一",
        "key":1,
        "X":200,
        "Y":200,
        "floot":'b1'
      },
      {
        "name":"关卡2",
        "key":2,
        "X":100,
        "Y":800,
        "floot":'b1'
      },
      {
        "name":"关卡3",
        "key":3,
        "X":1000,
        "Y":800,
        "floot":'b1'
      },
      {
        "name":"关卡4",
        "key":4,
        "X":1800,
        "Y":1800,
        "floot":'b1'
      },
      {
        "name":"关卡5",
        "key":5,
        "X":1000,
        "Y":1200,
        "floot":'b1'
      }
    ],
    // 关卡路径
    this.levelsPath = [];

    // 当前关卡 | 目标关卡
    this.currentLevel = this.levels[0];
    this.targetLevel = this.levels[4];

    // 游戏步数
    this.steps = 0;
    this.floot = 'B1'

    // 屏幕视口
    this.screen = document.querySelector('.main');
  }

  // 游戏初始化
  Game.prototype.init = function(callBack){
    //获取点位信息
    // 渲染地图
    this.loadData().then(res => {
      this.start();
      if(this.floot == 'B1'){
        $('#map-B1').addClass('show')
        $('#map-B2').removeClass('show')
      }else if(this.floot == 'B2'){
        $('#map-B1').removeClass('show')
        $('#map-B2').addClass('show')
      }
      callBack && callBack();
    })
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
                resolve(true);
              },600);
            }
          }
        }
      })
    })
  }

  // 监听屏幕拖动
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


  // 弹窗
  Game.prototype.dialog = function(data){
    const self = this;
    const closeDia = function(){
      $('.dialog').removeClass('animate__zoomIn').addClass('animate__zoomOut')
      var gt = setTimeout(function(){
        $('.dialog').css({"display":"none"})
      },300)
    };
    $('.dialog').css({"display":"block"}).addClass('animate__zoomIn');
    $('.dialog .'+data.type).show().siblings().hide();
    // 积分类型
    if(data.type == 'integral'){  
      $('.content .title .value').html(data.data.integral);
      $('.content .spec').html(data.data.detail);
    }else if(data.type == 'confirm' || data.type == 'alert'){
      $('.dialog-box .hd').html(data.title);
      $('.dialog-box .content').html(data.detail);
      $('.dialog').on('click','.cf',function(){
        console.log("去做什么 ==>  关闭弹窗")
        // 去下一关
        self.map.location(self.targetLevel);
        // 获取积分
        closeDia();
      })
    }else if(data.type == 'alert'){
      $('.dialog').on('click','.cf',function(){
        console.log("去做什么 ==>  关闭弹窗")
        // 去登陆
        closeDia();
      })
    }

    // 关闭
    $('.dialog').on('click','.close,.submit,.cc',function(){
      closeDia()
    })
  }
  // 随机数
  Game.prototype.randomNum = function(minNum,maxNum){
    switch(arguments.length){ 
      case 1: 
          return parseInt(Math.random()*minNum+1,10); 
      break; 
      case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
      break; 
          default: 
              return 0; 
          break; 
    }
  }

  Game.prototype.initMap = function(floot){
    // 实例化地图
    this.map = new Map({"canvasId":floot});
    //  控制地图显示
    $('#'+floot).show().siblings().hide();
  }

  Game.prototype.start = function(){
    console.log("开始游戏")
    this.initMap('map-'+ this.floot);
    // 实例化骰子
    this.rollDice = new RollDice({"canvasId":'RollDice'});
    this.watchScreenDrap();
  }
})()