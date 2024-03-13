import Phaser from 'phaser'
import game from './game.js'
import Player from './player.js';
import Proyectil_Seta from './proyectil.js';

export default class Poison_Seta extends Phaser.GameObjects.Sprite{
    /**
   * Constructor de la seta 
   * @param {Phaser.Scene} scene Escena a la que pertenece la seta 
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

        this.anims.create({
            key: "seta_dispara",
            frames: this.anims.generateFrameNames('seta_bosque', {start: 0, end: 7}),
            frameRate: 8,
            repeat: 0
        }); 

        this.body.setSize(32, 32);
        this.body.setOffset(34, 55);

        this.play('idle_seta', true); 

        
        this.on("animationcomplete-seta_dispara", ()=>{this.dispara()}, this); 
    }


    preUpdate(t,dt){
        super.preUpdate(t,dt);   
        if(Phaser.Math.Distance.Between(this.body.x, this.scene.player.body.y, this.scene.player.body.x, this.body.y) < 350){
            this.play('seta_dispara',true); 
        }
    }

    /*
       Metodo que se ejecuta cuando el jugador esta cerca de la seta
    */

    dispara(){
        console.log("Esta disparando");
       
            if(this.flipX){
                new Proyectil_Seta(this.scene, this.x, this.y+ 23, 'Izquierda');    
            }
            else new Proyectil_Seta(this.scene, this.x, this.y+ 23, 'Derecha'); 
        
    }

}