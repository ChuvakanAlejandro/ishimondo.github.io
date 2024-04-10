import Phaser from 'phaser'

export default class HudIshi extends Phaser.Scene {
    /** 
      Constructor de la escena 
    */

    constructor() {
        super({key: "hudIshi"});
    }
    
    init(data){
        this.player = data.player;
    }

    create() {
        //this.healthBar = this.makeBar(0x2ecc71);
        this.hudIshi = this.add.image(10,10,'barra');
        this.hudIshi.setOrigin(0,0);
        class Vt extends Phaser.GameObjects.Sprite
        {
            constructor (scene,x,y,player,num)
            {
                super(scene, x, y, 'vt');
                this.player = scene.player
                scene.add.existing(this)
                this.num = num;
            }

            lleno(){
                this.setTexture('vt',0);
            }

            rojo()
            {
                this.setTexture('vt',1);
            }
            vacio()
            {
                this.setTexture('vt',2);
            }
            preUpdate(t,dt) {
                super.preUpdate(t,dt);
                if(this.player.health() < this.num){
                    this.vacio();
                }
                else{
                    this.lleno();
                }
            }
        }
        this.vida1 = new Vt (this,82,66,this.player,1);
        this.vida2 = new Vt (this,112,66,this.player,2);
        this.vida3 = new Vt (this,142,66,this.player,3);  
        this.vida4 = new Vt (this,172,66,this.player,4);  
       
    }

    makeBar(color){ 
        let bar = this.add.graphics();

        bar.fillStyle(color);

        bar.fillRect(68,58,122,16);

        bar.x = 0;
        bar.y = 0;

        return bar;
    }

    update(time, delta) {
    }

}