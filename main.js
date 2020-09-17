$(()=>{
  // 骰子开关按钮
  anmateInOut('.attach-view .dice','.dice-box','animate__zoomInDown','animate__zoomOut');

  // 规则开关
  anmateInOut('.attach-view .rule,.dialog .close ','.dialog','animate__bounceInDown','animate__bounceOutUp');

  // 封装一个公告弹窗动画
  function anmateInOut(control,targetBox,inClass,outClass){
      //控制开关 | 目标盒子 | 显示动画 | 关闭动画
      $(control).click(function(){
          if($(targetBox).hasClass(inClass)){
              $(targetBox).removeClass(inClass).addClass(outClass)
              var st = setTimeout(() => {
                  $(targetBox).css({"display":"none"}).removeClass(outClass);
                  clearTimeout(st);
              }, 500);
          }else{
              $(targetBox).css({"display":"block"}).addClass(inClass);
          }
      })
  }
})