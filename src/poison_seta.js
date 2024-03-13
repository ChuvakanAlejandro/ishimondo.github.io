import Phaser from 'phaser'
import game from './game.js'

export default class Poison_Seta extends Phaser.GameObjects.Sprite{
    /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */

    constructor(scene, x, y) {
        super(scene,x,y,'seta_bosque');
        this.scene.add.existing(this); 
        this.scene.physics.add.existing(this); 
        this.body.setCollideWorldBounds(); 

        //Animacion por defecto
        this.anims.create({
            key: 'idle_seta',
            frames: this.anims.generateFrameNumbers('seta_bosque', {start: 0, end: 0}),
            frameRate: 5,
            repeat: -1 
        });

        this.body.setSize(32, 32);
        this.body.setOffset(34, 55);

        this.play('idle_seta', true); 
        
    }


    preUpdate(t,dt){
        super.preUpdate(t,dt); 
        this.body.setVelocityX(-25);
    }


}