import Phaser from 'phaser'


/**
 * Clase que representa las paredes que Ishi puede escalar si entra en contacto con ellas 
 * @extends Phaser.GameObjects.Sprite
 */


export default class Wall extends Phaser.GameObjects.Sprite {

     /**
   * Constructor de la pared
   * @param {Phaser.Scene} scene Escena a la que pertenece la pared
   * @param {Phaser.Scene} player
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */

    constructor(scene, player, x, y) {
        super(scene, x-5, y-400); 
        this.scene.add.existing(this); 
        this.scene.physics.add.existing(this,true); 
        this.body.setSize(30,1000);
        this.body.debugBodyColor = 1676690;
        //Colisionador entre la pared y el personaje 
        this.scene.physics.add.collider(this, player, () => {this.handleCollision()}); 
    }

    handleCollision() {
        console.log("Se toco la pared")
        this.scene.canClimbWall();
    }

}