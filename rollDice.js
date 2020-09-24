(function(){
    const { Illustration, Group, Anchor, Rect, TAU, Ellipse, Dragger } = Zdog;
    // 创建中间者
    var RollDice = window.RollDice = function(param){
        var self = this;
        self.canvas = document.getElementById(param.canvasId);
        self.ctx = self.canvas.getContext('2d');

        // 场景参数  画布背景色 | 骰子颜色 | 点数颜色
        self.colors = ['#f44336','#ffffff','#f44336'];

        // 游戏角色  ==> 骰子 | 数量
        self.player = null;
        self.num = param.unm || 1;

        // 时间参数
        this.timer = null;

        // 动画参数
        self.ticker = 0;
        self.cycleCount = 150;

        self.bgm = document.getElementById('rollDice_bgm');
        
        // 点数角度参数 ====> 幅面
        self.angleArrs = {
            "1":[
                    {x:TAU/8,z:TAU/8},          //<2,3>
                    {x:TAU/8,z:TAU * 3/8},      //<3,5>
                    {x:TAU/8,z:TAU * 5/8},      //<5,4>
                    {x:TAU/8,z:TAU * 7/8}       //<4,2>
                ],
            "2":[
                    {x:TAU * 3/8,y:TAU/8,z:0},          //<4,6>
                    {x:TAU * 3/8,y:TAU* 3/8,z:0},       //<1,4>
                    {x:TAU * 3/8,y:TAU* 5/8,z:0},       //<3,1>
                    {x:TAU * 3/8,y:TAU* 7/8,z:0}        //<6,3>
                ],
            "3":[
                    {x:TAU * 3/8,y:TAU * 1/8,z:TAU * 2/8},  //<2,6>
                    {x:TAU * 3/8,y:TAU * 5/8,z:TAU * 2/8},  //<5,1>
                    {x:TAU * 3/8,y:TAU * 3/8,z:TAU * 2/8},  //<1,2>
                    {x:TAU * 3/8,y:TAU * 7/8,z:TAU * 2/8}   //<6,5>
                ],
            "4":[
                    {x:TAU* 3/8,y:TAU * 1/8,z:-TAU * 2/8},   //<5,6>
                    {x:TAU* 3/8,y:TAU * 3/8,z:-TAU * 2/8},   //<1,5>
                    {x:TAU* 3/8,y:TAU * 5/8,z:-TAU * 2/8},   //<2,1>
                    {x:TAU* 3/8,y:TAU * 7/8,z:-TAU * 2/8}    //<6,2>
                ],
            "5":[
                    {x: -TAU/8,y:TAU/8,z:0},            //<1,3>
                    {x: -TAU/8,y:TAU* 3/8,z:0},         //<3,6>
                    {x: -TAU/8,y:TAU* 5/8,z:0},         //<6,4>
                    {x: -TAU/8,y:TAU* 7/8,z:0}          //<4,1>
                ],
            "6":[
                    {x:TAU* 5/8,z:TAU *5/8},            //<3,2>
                    {x:TAU * 5/8,y:0,z:TAU/8},          //<4,5>
                    {x:TAU* 5/8,z:TAU *7/8},            //<5,3>
                    {x:TAU* 5/8,z:TAU *3/8}             //<2,4>
                ]
        };

        self.init();
        self.loadResources().then(res => {
            self.render();
        })
    }

    // 初始化配置
    RollDice.prototype.init = function(){
        let _winW = window.outerWidth,
            _winH = window.outerHeight;
        this.canvas.width = _winW;
        this.canvas.height = _winH;
        // this.canvas.style.backgroundColor = this.colors[0];
    }

    // 加载资源
    RollDice.prototype.loadResources = function(){
        return new Promise((resolve,reject) => {
            resolve();
            // reject();
        });
    }

    RollDice.prototype.install = function(){
        this.draw();
    };

    // 画骰子
    RollDice.prototype.draw = function(){

        // 创建班级
        const illo = this.canvas = new Illustration({
            element: '.zdog-rolldice',
            dragRotate: true
        });
        // 创建描点  //设置点数1随机初始角度
        const dice = this.player = new Anchor({
            addTo: illo,
            rotate: this.angleArrs[this.num][Math.floor(Math.random() *4)]  //随机点数角度参数
        });

        // 创建面组
        const faces = new Group({
            addTo: dice
        });
        //front
        const face = new Rect({
            addTo: faces,
            width: 50,
            height:50,
            color: this.colors[1],
            fill: true,
            stroke:50,
            translate:{z:-25}
        });
        // back
        face.copy({
            translate: {
              z: 25,
            }
        });
        // right
        face.copy({
            rotate: {
                x: Zdog.TAU / 4,
            },
            translate: {
                y: 25,
            }
        });
        // left
        face.copy({
            rotate: {
                x: Zdog.TAU / 4,
            },
            translate: {
                y: -25,
            }
        });
        // top
        face.copy({
            rotate: {
                x: Zdog.TAU / 4,
            },
            translate: {
                y: -25,
            }
        });
        // bottom
        face.copy({
            rotate: {
                x: Zdog.TAU / 4,
            },
            translate: {
                y: 25,
            }
        });

        // 创建数组点
        // 1====> front
        const One = new Ellipse({
            addTo:dice,
            diameter:15,
            stroke:false,
            fill:true,
            color:this.colors[0],
            translate:{
                z:50
            }
        })
        // 2====> top
        const Two = new Group({
            addTo:dice,
            rotate:{
                x:TAU/4
            },
            translate:{
                y:50
            }
        });

        One.copy({
            addTo:Two,
            translate:{
                y:-20
            }
        });

        One.copy({
            addTo:Two,
            translate:{
                y:20
            }
        });

        //  3===> right
        const Three = new Group({
            addTo:dice,
            rotate:{
                y:TAU/4
            },
            translate:{
                x:50
            }
        });

        One.copy({
            addTo: Three,
            translate: {
                z: 0
            },
        });

        One.copy({
            addTo:Three,
            translate: {
                x: 20,
                y: -20,
                z: 0
            }
        });
        One.copy({
            addTo:Three,
            translate: {
                x: -20,
                y: 20,
                z: 0
            }
        });

        // 4 ===> left
        const Four = new Group({
            addTo:dice,
            rotate:{
                y:TAU/4
            },
            translate:{
                x:-50
            }
        });

        Two.copyGraph({
            addTo:Four,
            rotate: {
                x: 0,
            },
            translate:{
                y:0,
                x:20
            }
        });

        Two.copyGraph({
            addTo:Four,
            rotate: {
                x: 0,
            },
            translate:{
                y:0,
                x:-20
            }
        });

        // 5 ==> bottom
        const Five = new Group({
            addTo:dice,
            rotate:{
                x:TAU/4
            },
            translate: {
                y: -50,
            }
        });

        One.copy({
            addTo:Five,
            translate: {
                z: 0,
            }
        })

        Four.copyGraph({
            addTo:Five,
            rotate: {
                y: 0,
            },
            translate: {
                x: 0,
            }
        })

        // 6 ===> back
        const Six = new Group({
            addTo:dice,
            translate:{
                z:-50
            }
        })

        Four.copyGraph({
            addTo:Six,
            rotate: {
                y: 0,
            },
            translate: {
                x: 0,
            }
        });
        Two.copyGraph({
            addTo:Six,
            rotate: {
                x: 0,
                z: TAU / 4,
            },
            translate: {
                x: 0,
                y: 0,
            }
        })

        // 渲染到canvas画布
        illo.updateRenderGraph();
    }

    // 动画
    RollDice.prototype.animation = function(){
        this.bgm.play();
        // 骰子转动
        this.player.rotate.x += 0.4;
        this.player.rotate.y -= 0.4;
        this.canvas.updateRenderGraph();
        this.timer = requestAnimationFrame( this.animation.bind(this));
    }

    // 出现结果
    RollDice.prototype.diceResult = function(num,callBack){
        var self = this,
            _rotate =  self.angleArrs[num][Game.randomNum(0,3)];
        self.animation();    
        var dt = setTimeout(function(){
            clearTimeout(dt);
            cancelAnimationFrame(self.timer);
            self.player.rotate.set(_rotate);
            self.canvas.updateRenderGraph();
            self.bgm.pause();
            self.bgm.currentTime = 0.0;
            callBack && callBack();
        },1500)  
    }

    // 渲染
    RollDice.prototype.render = function(){
        this.draw();
    }
})()