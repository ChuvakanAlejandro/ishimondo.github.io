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

    constructor(scene, player, x, y, trepable, width, height) {
        super(scene, x, y);
        this.label = this.scene.add.text(this.x, this.y, "WALL");
        //this.setOrigin(0,0);
        this.scene.add.existing(this); 
        this.altura= width;
        this.anchura= height;
        this.scene.physics.add.existing(this,true);

        if(trepable){
            this.body.debugBodyColor = 0xFFFF00;
        }
        this.trepable = trepable;
        this.body.setSize(width, height);
        this.setTint= 0x66ff7f; 
        this.label = this.scene.add.text(this.x, this.y+this.height, "BOTTOM WALL");
        this.label = this.scene.add.text(this.x, this.y-this.height, "TOP WALL");
        //Colisionador entre la pared y el personaje 
        this.scene.physics.add.collider(this, player, () => {this.handleCollision()}); 
    }

    handleCollision() {
        console.log("Se toco la pared")
        this.scene.player.paredTrepable(this.trepable,this.y-this.height,this.y+this.height);
    }

}