import Phaser from 'phaser'
import Orbe from './orbe.js';

export default class Flora extends Phaser.GameObjects.Sprite{
    /**
   * Constructor de la seta 
   * @param {Phaser.Scene} scene Escena a la que pertenece la seta 
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {boolean} aplastable Indica si es posible matar al enemigo saltando encima de el 
   */

    constructor(scene, x, y, aplastable = true) {
        super(scene, x, y, 'planta_jefe'); 
        this.setOrigin(0.5,0.5); 
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false); 
        this.body.pushable= false; 
        this.golpes_recibidos= 0; 
    }


    setAnimaciones(){
        this.anims.create({
            key: 'stand_by',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 0, end: 4}),
            frameRate: 3,
            repeat: -1 
        });


        this.anims.create({
            key: 'dañada',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 5, end: 8}),
            frameRate: 3,
            repeat: -1 
        })

        this.anims.create({
            key: 'esconder',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 9, end: 14}),
            frameRate: 3,
            repeat: -1 
        })


        this.anims.create({
            key: 'aparecer',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 17, end: 23}),
            frameRate: 3,
            repeat: -1 
        })

        this.anims.create({
            key: 'morir',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 24, end: 27}),
            frameRate: 3,
            repeat: -1 
        })

        this.on("animationcomplete-morir", this.morir,
         this); 

    }

    preUpdate(t,dt){
        super.preUpdate(t,dt); 
    }


    meAplastan(){
        this.stop(); 
        this.golpes_recibidos++; 
        if(this.golpes_recibidos===3){
            this.play('morir'); 
        }
        else {

            
        }
    }

    mePegan(){
        /*Lo ignora porque es un pro*/ 
    }

    morir(){
        this.destroy();
        
        /*Spawnear coleccionable*/ 
     }
}