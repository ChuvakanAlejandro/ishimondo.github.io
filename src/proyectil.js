import Phaser from "phaser";
import game from './game.js'; 

export default class Proyectil_Seta extends Phaser.GameObjects.Sprite{
     /**
   * Constructor de la bala
   * @param {Phaser.Scene} scene Escena a la que pertenece la bala
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {String} direction Direccion a donde va la bala s
   */

    constructor(scene, x, y, direction) {
        super(scene,x,y,'proyectil_seta');
        this.direccion= direction; 
        this.setOrigin(0.5,0.5);
        this.scene.add.existing(this); 
        this.scene.physics.add.existing(this); 
        this.body.setAllowGravity(false); 
        
        this.body.setSize(14, 14);
        //this.body.setOffset(, 62);

        
        switch (this.direccion){
            case 'Izquierda': 
                this.setFlipX(true);
                this.velocity= +500; 
                break; 

            case 'Derecha':
                this.setFlipX(false);
                this.velocity= -500;  
                break; 
        }

        this.anims.create({
            key: "mov_bala",
            frames: this.anims.generateFrameNames('proyectil_seta', {start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        }); 
    }

    preUpdate(t,dt){
        super.preUpdate(t,dt); 
        this.body.setVelocityX(this.velocity);
        this.play('mov_bala', true); 
        if(this.scene.physics.overlap(this.scene.player, this)){
            this.scene.player.damagedIshi(this.x,this.y); 
            this.destroy(); 
        }

    }

}