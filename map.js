(function(){
  const { Illustration, Group, Anchor, Rect, TAU, Ellipse, Dragger } = Zdog;
  var Map = window.Map = function(param){
    /**
     * 地图放大缩小
     * 地图拖动
     * 地图移动动画
     * 地图关卡锚点
     * 关卡图片  300* 247
     * 
     */
    this.canvas = document.getElementById(param.canvasId);  // 4852 X 2930
    this.ctx = this.canvas.getContext('2d');
    this.screen = null;
    this.scale = 1;
    this.minScale = 0.3;
    this.maxScale = 1;
    this.mapReady = false;

    // 地图位置
    this.render(param);
  }
  

  // 画地图上的点位位置
  Map.prototype.drawLevels = function(point,k){
    // 画圆点
    // this.ctx.beginPath();
    // this.ctx.fillStyle = 'red';
    // this.ctx.arc(point.po_x,point.po_y,10,0,Math.PI *2,);
    // this.ctx.closePath();
    // this.ctx.fill();

    // 画小图标
    // // 移动坐标
    this.ctx.save();
    this.ctx.translate(point.po_x,point.po_y);
    this.ctx.drawImage(Game.R.point_icon,0,0,300,247,-75,-124,150,124);
    this.ctx.restore();

    this.ctx.fillStyle = '#ffc107';
    this.ctx.shadowColor = '#9f2125';
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.shadowBlur = 2;
    this.ctx.font = '32px STheiti, SimHei';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(point.po_id + point.po_name,point.po_x,point.po_y - 144);
  }


  Map.prototype.zoom = function(){
    // 获取当前地图屏幕中心点坐标
    var centerX = this.canvas.offsetLeft,
        centerY = this.canvas.offsetTop;
   
    // 重置地图位置
    this.move(centerX,centerY,'zoom');
    $(this.canvas).css({"transform" :"scale("+this.scale+")"});
    // 判断缩放后  canvas高度不高1.2 视口  锁定
    if(this.canvas.height * this.scale <= $(Game.screen)[0].clientHeight * 1.2){
      $('.zoom-down').addClass('disabled');
    }else if(this.scale >= this.maxScale){
      $('.zoom-up').addClass('disabled');
    }
  }

  // 定位当前点位
  Map.prototype.location = function(point){
    // 在当前层 直接移动过去
    if(point.floot == Game.currentLevel.floot){
      $(this.canvas).css({"transition-duration":"2s"});
      this.move(point.po_x,point.po_y,'location');
    }else{
      // 不在当前层  切换层  移动
      // Game.initMap(point.floot);
      // $(this.canvas).css({"transition-duration":"2s"});
      // this.move(point.X,point.Y,'location');
    }
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
      moveX = minX;
    }else if(moveX < -maxX){
      moveX = -maxX;
    }

    if(moveY >= minY){
      moveY = minY;
    }else if(moveY < -maxY){
       moveY = -maxY;
    }
    $(this.canvas).css({"left":moveX,"top":moveY});
  }

  Map.prototype.render = function(param){
    let _levels = [];
    // 设置地图的初始大小 宽 | 高
    this.canvas.width = $(Game.R[param.canvasId])[0].width;
    this.canvas.height = $(Game.R[param.canvasId])[0].height;

    // 填充背景
    this.ctx.drawImage(Game.R[param.canvasId],0,0);
    
    if(param.canvasId == 'map-B1'){
      _levels = Game.levels[1];
    }else if(param.canvasId == 'map-B2'){
      _levels = Game.levels[0];
    }
    // 地图上画关卡 
    for(let key in _levels){
      this.drawLevels(_levels[key],key);
    }

    // 地图展示最小概览
    this.minScale = this.scale = ($(Game.screen)[0].clientHeight / this.canvas.height).toFixed(1);
    console.log(this.scale);
    this.zoom();

    // 重置地图数据
    let sc = $(this.canvas)[0].style.transform;
    if(sc){
      this.scale = Number(sc.slice(6,sc.length-1));
      this.zoom();
    }
    if(this.scale >= this.maxScale){
      $('.zoom-down').removeClass('disabled')
      $('.zoom-up').addClass('disabled')
    }else if(this.scale <= this.minScale){
      $('.zoom-up').removeClass('disabled')
      $('.zoom-down').addClass('disabled')
    }
  }
})()