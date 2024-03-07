import Phaser from 'phaser'


export default  class  Dummy extends Phaser.GameObjects.Sprite{
    /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */


    constructor(scene, x, y) {
        super.constructor(scene,x,y,'dummy');
        this.scene.add.existing(this); 
        this.scene.physics.add.existing(this); 
        
    }


    preUpdate(t,dt){
        super.preUpdate(t,dt); 
    

    }


}