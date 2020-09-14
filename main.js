(function(){
    // 创建中间者
    var RollDice = window.RollDice = function(param){
        var self = this;
        self.canvas = document.getElementById(param.canvasId);
        self.ctx = self.canvas.getContext('2d');

        self.canvas.size = {};

        self.init();
        self.loadResources().then(res => {
            self.render();
        })
    }

    // 初始化配置
    RollDice.prototype.init = function(){
        var _winW = window.outerWidth,
            _winH = window.outerHeight;
        this.canvas.width = _winW;
        this.canvas.height = _winH;

    }

    // 加载资源
    RollDice.prototype.loadResources = function(){
        return new Promise((resolve,reject) => {
            resolve();
            // reject();
        });
    }

    RollDice.prototype.setAngle = function(point){
        switch(point){
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            default: break;                        
        }
    };


    // 画骰子
    RollDice.prototype.draw = function(){
        const { Illustration, Group, Anchor, Rect, TAU, Ellipse, Dragger } = Zdog;

        /**
         * 骰子点数的角度
         * 1 ===>   { x: TAU/8,z: TAU/8,y:0}
         * 2 ===>   { x: TAU/8,z: TAU/8,y:0}
         * 3 ===>   { x: TAU/8,z: TAU/8,y:0}
         * 4 ===>   { x: TAU/8,z: TAU/8,y:0}
         * 5 ===>   { x: -TAU/8,z:0,y:TAU/8}
         * 6 ===>   { x: TAU/8,z: TAU/8,y:0}
         **/
        

        console.log("画骰子")
        // 创建班级
        const illo = new Illustration({
            element: '.zdog-rolldice',
            dragRotate: true
        });
        // 创建描点
        const dice = new Anchor({
            addTo: illo,
            rotate:{x:TAU/8}
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
            color: 'white',
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
            color:'red',
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

    }

    // 更新
    RollDice.prototype.updated = function(){

    }

    // 渲染
    RollDice.prototype.render = function(){
        console.log("渲染");
        this.draw();
    }
})()