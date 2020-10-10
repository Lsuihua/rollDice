$(()=>{
    var clickBgm = document.getElementById('click_bgm');
    // 骰子开关按钮
    anmateInOut('.attach-view .dice','.dice-box','animate__zoomInDown','animate__zoomOut');


    $('.dice-btn').click(function(){
        console.log("摇骰子")
        // 出现点数
        // 概率  1-3 ===>  70%
        // 概率  4-5 ===>  20%
        // 概率  6 ===>  10%
        var r = Math.random(),
            num = 0;
        if(r<0.7){
            num = Game.randomNum(1,3);
        }else if(r>=0.7 || r < 0.9){
            num = Game.randomNum(4,5);
        }else{
            num = Game.randomNum(6);
        }
        console.log(num)
        Game.rollDice.diceResult(num,function(){
            console.log("摇骰子结束");
        });
        clickBgm.play();
    })

    // 封装一个公告弹窗动画
    function anmateInOut(control,targetBox,inClass,outClass){
        //控制开关 | 目标盒子 | 显示动画 | 关闭动画  |  弹窗类型
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
            clickBgm.play();
        })
    }
})