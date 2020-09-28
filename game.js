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
    this.levels = [],
    // 关卡路径
    this.levelsPath = [];

    this.playerInfo = {};
    // 当前关卡 | 目标关卡
    this.currentLevel ={};
    this.targetLevel = {};

    // 游戏步数
    this.steps = 0;
    this.floot = 'B1'

    // 屏幕视口
    this.screen = document.querySelector('.main');
  }

  // 游戏初始化
  Game.prototype.init = function(callBack){
    //获取点位信息
    Zepto.getJSON('//wbt.zflb.cc/mp/youyuan2020/game/init',res =>{
      if(res.code === 1){
        this.levels = res.body;
      }
    });
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
            $('.open-load .load-down-num').html(`正在加载资源 ${self.loadDownNumber}/${r.images.length} 请稍后...`);
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
  Game.prototype.dialog = function(data,callBack){
    const self = this,
    closeDia = function(){
      $('.dialog').css({"background":"rgba(0,0,0,0)"});
      $('.dialog').removeClass('animate__zoomIn').addClass('animate__zoomOut')
      var gt = setTimeout(function(){
        $('.dialog').css({"display":"none"});
      },300)
    };
    // 重启弹窗 
    if($('.dialog').hasClass('animate__zoomOut')){
      $('.dialog').removeClass('animate__zoomOut');
    }
    $('.dialog').css({"display":"block"}).addClass('animate__zoomIn');
    $('.dialog .'+data.type).show().siblings().hide();
    // 遮罩
    var bt = setTimeout(function(){
      $('.dialog').css({"background":"rgba(0,0,0,.5)"});
      clearTimeout(bt);
    },1000);
      // 积分类型
    if(data.type == 'integral'){  
      document.getElementById('prize_bgm').play();
      $('.integral .content .title .value').html(data.data.integral);
      $('.integral .content .title .text').html(data.data.title);
      $('.integral .content .spec').html(data.data.detail);
    }else if(data.type == 'confirm' || data.type == 'alert'){
      $('.dialog-box .hd').html(data.title);
      $('.dialog-box.alert .content,.dialog-box.confirm .content').html(data.detail);
      // 优惠券
    }else if(data.type == 'coupon'){
      $('.coupon .cp .title').html(data.content.data[0].full_name);
      $('.coupon .cp .spec').html(data.content.data[0].remark);
      $('.coupon .footer .title').html(data.title);
      $('.coupon .footer .date').html(data.content.data[0].valid_tip);
    }
    // 关闭
    $('.dialog').on('click','.close,.cc',function(){
      closeDia();
    })
    $('.dialog').on('click','.cf',function(){
      closeDia();
      callBack && callBack(data.type);
    });
    $('.dialog').on('click','.submit',function(){
      closeDia();
    });
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
    console.log("开始游戏");
    this.initMap('map-'+ this.floot);
    // 实例化骰子
    this.rollDice = new RollDice({"canvasId":'RollDice'});
    this.watchScreenDrap();
  }
})()