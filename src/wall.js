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
   * @param {boolean} trepable
   */

    constructor(scene, player, x, y, trepable) {
        super(scene, x, y);
        this.label = this.scene.add.text(this.x, this.y, "WALL");
        this.setOrigin(0,0);
        this.scene.add.existing(this); 
        this.altura= 250;
        this.anchura= 32;
        this.scene.physics.add.existing(this,true);

        if(trepable){
            this.body.debugBodyColor = 0xFFFF00;
        }
        this.trepable = trepable;
        this.body.setSize(32, 500);
        this.label = this.scene.add.text(this.x, this.y+this.altura, "BOTTOM WALL");
        this.label = this.scene.add.text(this.x, this.y-this.altura, "TOP WALL");
        //Colisionador entre la pared y el personaje 
        this.scene.physics.add.collider(this, player, () => {this.handleCollision()}); 
    }

    handleCollision() {
        console.log("Se toco la pared")
        this.scene.player.paredTrepable(this.trepable,this.y-this.altura,this.y+this.altura);
    }

}