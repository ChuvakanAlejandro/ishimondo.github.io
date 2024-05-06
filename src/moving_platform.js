import Phaser from "phaser";

/*
    Clase que representa a las plataformas las cuales Flora va creando a lo largo de la batalla y a las cuales
    es posible subirse. 

*/

export default class Moving_Platform extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, plataformas ){
        super(scene,x,y,'moving_platform'); 
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(100,10);
        this.body.setOffset(20, 20);  
        this.setDepth(-5); 
        this.body.setAllowGravity(false); 
        plataformas.add(this); 
    }


    preUpdate(t,dt){
        super.preUpdate(t,dt); 
    }
}