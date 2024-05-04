import Phaser from "phaser";

/*
    Clase que representa a las plataformas las cuales Flora va creando a lo largo de la batalla y a las cuales
    es posible subirse. 

*/

export default  class Moving_Platform extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y ){
        super(scene,x,y,'moving_platform'); 
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);
    }


    preUpdate(t,dt){
        super.preUpdate(t,dt); 
    }
}