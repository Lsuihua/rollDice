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

    this.init(() => {
      this.render();
    });

  }

  Map.prototype.init = function(){
    // 设置地图的初始大小 宽 | 高
    this.img = Game.R.map;
    this.canvas.width = $(this.img)[0].width;
    this.canvas.height = $(this.img)[0].height;
    // 填充背景
    this.ctx.drawImage(this.img,0,0);

    // this.screen = new Illustration({
    //   element: '.map',
    //   dragRotate: false
    // })
    
    this.drawLevels()
  }
  

  // 画地图上的官咖位置
  Map.prototype.drawLevels = function(point){
    //point  ===>  关卡点位

  }

  Map.prototype.updated = function(){

  }

  Map.prototype.animated = function(){

  }

  Map.prototype.render = function(){

  }

})()