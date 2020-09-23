(function(){
  const { Illustration, Group, Anchor, Rect, TAU, Ellipse, Dragger } = Zdog;
  var Map = window.Map = function(param){
    /**
     * 地图放大缩小
     * 地图拖动
     * 地图移动动画
     * 地图关卡锚点
     * 
     */
    this.canvas = document.getElementById(param.canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.screen = null;
    this.scale = 1;
    this.minScale = 0.6;
    this.maxScale = 1;
    this.mapReady = false;

    // 地图位置

    this.render(param);

  }
  

  // 画地图上的官咖位置
  Map.prototype.drawLevels = function(point){
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

  // 修改楼层显示
  Map.prototype.setFloot = function(floot){
    if(Game.floot == floot) return;

  }


  Map.prototype.zoom = function(){
    console.log(this.scale)
    console.log(this.canvas.offsetLeft)
    // 获取当前地图屏幕中心点坐标
    var centerX = this.canvas.offsetLeft,
        centerY = this.canvas.offsetTop;
    // var centerX = this.canvas.offsetLeft + Game.screen.clientWidth/2,
    //     centerY = this.canvas.offsetTop + Game.screen.clientHeight/2;
    // console.log(centerX,centerY);
    $(this.canvas).css({"transform" :"scale("+this.scale+")"})
    // 重置地图位置
    this.move(centerX,centerY,'zoom');
  }

  // 定位当前点位
  Map.prototype.location = function(point){
    // 在当前层 直接移动过去
    if(point.floot == Game.currentLevel.floot){
      console.log("定位当前点")
      $(this.canvas).css({"transition-duration":"2s"});
      this.move(point.X,point.Y,'location');
    }else{

    }
    // 不在当前层  切换层  移动
    
  }

  // 地图拖动
  Map.prototype.move = function(x,y,type){
    // x ,y ===> 拖动的坐标   type ===> 移动类型
    var minX = (this.canvas.width * this.scale - this.canvas.width)/2,
        maxX = this.canvas.width + (this.canvas.width * this.scale - this.canvas.width)/2 - Game.screen.clientWidth,
        minY = (this.canvas.height * this.scale - this.canvas.height)/2,
        maxY = this.canvas.height + (this.canvas.height * this.scale - this.canvas.height)/2 - Game.screen.clientHeight,
        moveX = 0,
        moveY = 0;
    if(type == 'drag'){
      moveX = this.canvas.offsetLeft + x;
      moveY = this.canvas.offsetTop + y;
    }else if(type == 'zoom'){
      console.log(x,y)
      // 缩放===>  在当前视口缩放
      moveX = (x + minX) * this.scale;
      moveY = (y + minY) * this.scale;
    }else if(type == 'location'){
      moveX = -(x - Game.screen.clientWidth/2);
      moveY = -(y - Game.screen.clientHeight/2);
      var t = setTimeout(()=>{
        $(this.canvas).css({"transition-duration":".1s"});
        clearTimeout(t);
      },2000)
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
    $(this.canvas).css({"left":moveX,"top":moveY});
    
  }

  Map.prototype.animated = function(){

  }

  Map.prototype.render = function(param){
    // 设置地图的初始大小 宽 | 高
    this.canvas.width = $(Game.R[param.canvasId])[0].width;
    this.canvas.height = $(Game.R[param.canvasId])[0].height;

    // 填充背景
    this.ctx.drawImage(Game.R[param.canvasId],0,0);
    
    // 地图上画关卡 
    for(let item of Game.levels){
      this.drawLevels(item)
    }

    // 重置地图数据
    let sc = $(this.canvas)[0].style.transform;
    if(sc){
      this.scale = Number(sc.slice(6,sc.length-1));
      this.zoom();
    }
    if(this.scale>= this.maxScale){
      $('.zoom-down').removeClass('disabled')
      $('.zoom-up').addClass('disabled')
    }else if(this.scale<= this.minScale){
      $('.zoom-up').removeClass('disabled')
      $('.zoom-down').addClass('disabled')
    }
    // 默认显示关卡
  }

})()