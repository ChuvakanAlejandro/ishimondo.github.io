import Phaser from 'phaser'
import Vt from './vt.js'
import En from './en.js'
import Hface from './hface.js'

export default class HudIshi extends Phaser.Scene {
    /** 
      Constructor de la escena 
    */

    constructor() {
        super({key: "hudIshi"});
    }
    
    init(data){
        this.target = data.target;
    }

    create() {
        //this.healthBar = this.makeBar(0x2ecc71);
        this.hudIshi = this.add.image(10,10,'barra');
        this.hudIshi.setOrigin(0,0);
        this.loadVida(); 
        this.loadEnergia(); 
        this.face = new Hface(this,48,48,'ishi_face');
       
    }

    loadVida(){
        this.vida1 = new Vt (this,82,66,1);
        this.vida2 = new Vt (this,112,66,2);
        this.vida3 = new Vt (this,142,66,3);  
        this.vida4 = new Vt (this,172,66,4);  
    }

    loadEnergia(){
        this.en1 = new En (this,96,49,1);
        this.en2 = new En (this,112,49,2);
        this.en3 = new En (this,128,49,3);  
        this.en4 = new En (this,144,49,4);
        this.en5 = new En (this,160,49,5);
    }

    update(time, delta) {
    }

}