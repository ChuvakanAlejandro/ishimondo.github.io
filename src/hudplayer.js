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
        let healthBar = this.makeBar(0x2ecc71);
        let hudIshi = this.add.image(10,10,'barra');
        hudIshi.setOrigin(0,0);
       
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