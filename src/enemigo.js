import Phaser from "phaser";
import { Game } from "phaser";

export default class Enemigo extends Phaser.GameObjects.Sprite{

    constructor(scene, x ,y, nombre) {
        super(scene,x,y,nombre); 
        this.scene.add.existing(this); 
        this.scene.physics.add.existing(this);  
        this.body.setCollideWorldBounds(); 
    }


    preUpdate(t,dt){
        super.preUpdate(t,dt); 
    }




    morir(){
        this.destroy(); 
    }

}