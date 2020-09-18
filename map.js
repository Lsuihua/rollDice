(function(){
  const { Illustration, Group, Anchor, Rect, TAU, Ellipse, Dragger } = Zdog;
  var Map = window.Map = function(){
    /**
     * 地图放大缩小
     * 地图拖动
     * 地图移动动画
     * 地图关卡锚点
     * 
     */
    this.canvas = document.getElementById('map');
    this.ctx = this.canvas.getContext('2d');
    this.screen = null;
    this.scale = 1;
    this.minScale = 0.6;
    this.maxScale = 1;
    this.mapReady = false;

    // 地图位置

    this.render();

  }
  

  // 画地图上的官咖位置
  Map.prototype.drawLevels = function(point){
    console.log(point.X,point.Y)
    this.ctx.beginPath();
    this.ctx.fillStyle = 'red';
    this.ctx.arc(point.X,point.Y,10,0,Math.PI *2,);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.font = '20px STheiti, SimHei';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(point.name,point.X,point.Y-20)
  }

  Map.prototype.updated = function(){

  }

  // 地图点位切换显示  当前点 | 结束点
  Map.prototype.transLatePoint = function(){
    var targetX = Ganme.currentLevel.X - Game.targetLevel.X - Game.screen.clientWidth/2,
        targetY = Ganme.currentLevel.Y - Game.targetLevel.Y - Game.screen.clientHeight/2;
  }

  Map.prototype.zoom = function(){
    // 获取当前地图屏幕中心点坐标
    var centerX = this.canvas.offsetLeft + Game.screen.clientWidth/2,
        centerY = this.canvas.offsetTop + Game.screen.clientHeight/2;
    // console.log(centerX,centerY);
    console.log(this.scale)
    // 缩放地图
    $('.map').css({"transform" :"scale("+this.scale+")"})
    
    // 重置地图位置
    this.move(centerX,centerY);
  }

  // 地图拖动
  Map.prototype.move = function(x,y,type){
    var minX = (this.canvas.width * this.scale - this.canvas.width)/2,
        maxX = this.canvas.width + (this.canvas.width * this.scale - this.canvas.width)/2 - Game.screen.clientWidth,
        minY = (this.canvas.height * this.scale - this.canvas.height)/2,
        maxY = this.canvas.height + (this.canvas.height * this.scale - this.canvas.height)/2 - Game.screen.clientHeight;

    console.log(minX,minY,maxX,maxY)
    var moveX = 0,moveY = 0;
    if(type == 'drag'){
      moveX = this.canvas.offsetLeft + x;
      moveY = this.canvas.offsetTop + y;
    }else{
      console.log(Game.currentLevel)
      console.log(Game.currentLevel.X,Game.targetLevel.X)
      moveX = Game.currentLevel.X - Game.targetLevel.X - Game.screen.clientWidth/2;
      moveY = Game.currentLevel.Y - Game.targetLevel.Y - Game.screen.clientHeight/2;
    }
    //判断地图拖动的边界值 
    if(moveX >= minX){
      moveX = minX
    }else if(moveX < -maxX){
      moveX = -maxX;
    }

    if(moveY >= minY){
      moveY = minY;
    }else if(moveY < -maxY){
       moveY = -maxY
    }
    $('.map').css({"left":moveX,"top":moveY});
  }

  Map.prototype.animated = function(){

  }

  Map.prototype.render = function(){
    // 设置地图的初始大小 宽 | 高
    this.img = Game.R.map;
    this.canvas.width = $(this.img)[0].width;
    this.canvas.height = $(this.img)[0].height;
    // 填充背景
    this.ctx.drawImage(this.img,0,0);
    // 地图上画关卡
    for(let item of Game.levels){
      this.drawLevels(item)
    }
  }

})()