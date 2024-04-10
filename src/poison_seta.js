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
   * @param {boolean} aplastable Indica si es posible matar al enemigo saltando encima de el 
   */

    constructor(scene, x, y, aplastable = false) {

        //super(scene,x,y,'seta_bosque');
        super(scene,x,y,'seta_bosque',aplastable);
        this.in_delay= false; 
        //this.aplastable= aplastable; 
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false); 
        this.body.pushable= false;

        //Animacion por defecto
        this.setAnimaciones();

      
        this.body.setSize(32, 32);
        this.body.setOffset(34, 55);

        this.play('idle_seta', true); 

    }

    setAnimaciones(){
        //Animacion por defecto
        this.anims.create({
            key: 'idle_seta',
            frames: this.anims.generateFrameNumbers('seta_bosque', {start: 0, end: 0}),
            frameRate: 5,
            repeat: -1 
        });

        this.anims.create({
            key: "seta_dispara",
            frames: this.anims.generateFrameNames('seta_bosque', {start: 0, end: 6}),
            frameRate: 8,
            repeat: 0
        }); 
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
        
        else {
            this.stop(); 
            this.play('idle_seta'); 
            this.in_delay= false;
        }

        
    }

    /*
       Metodo que se ejecuta cuando el jugador esta cerca de la seta
    */

    dispara(){
        if(this.flipX){
            new Proyectil_Seta(this.scene, this.x - 5 , this.y+ 26, 'Izquierda');    
         }
        else new Proyectil_Seta(this.scene, this.x - 5, this.y+ 26, 'Derecha');

        this.in_delay= false; 
    } 

    morir(){
        /*
            -Falta animacion de muerte 
        */
       this.destroy(); 
    }

}