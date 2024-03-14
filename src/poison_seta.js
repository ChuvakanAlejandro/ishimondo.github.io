import Phaser from 'phaser'
import game from './game.js'
import Player from './player.js';
import Proyectil_Seta from './proyectil.js';
import Enemigo from './Enemigo.js';
export default class Poison_Seta extends Enemigo{
    /**
   * Constructor de la seta 
   * @param {Phaser.Scene} scene Escena a la que pertenece la seta 
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */

    constructor(scene, x, y) {
        
        super(scene,x,y,'seta_bosque');
        this.in_delay= false; 
       
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

        //dthis.morir(); 
        this.on("animationcomplete-seta_dispara", ()=>{this.dispara()}, this); 
    }


    preUpdate(t,dt){
        super.preUpdate(t,dt);   
        if(Phaser.Math.Distance.Between(this.body.x, this.scene.player.body.y, this.scene.player.body.x, this.body.y) < 350){
            
            if(!this.in_delay){
                this.playAfterDelay('seta_dispara',1500); 
                this.in_delay=true;
            }  
            
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
        this.in_delay= false; 
    } 

    morir(){
        /*
            -Falta animacion de muerte 
        */
    }

}