
import Phaser from "phaser";

export default class Coleccionable extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, 'coleccionable'); 
        
        this.scene.add.existing(this); 
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false); 
        this.body.setImmovable(true); 


        this.anims.create({
            key: 'idle_coleccionable',
            frames: this.anims.generateFrameNumbers('coleccionable', {start: 0, end:5 }),
            frameRate: 10,
            repeat: -1
        })
    }


    preUpdate(d,dt){
        super.preUpdate(d,dt); 
        this.play('idle_coleccionable', true); 
    }
}