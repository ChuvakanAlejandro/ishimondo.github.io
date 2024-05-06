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
        this.body.setAllowGravity(false); 
        this.body.pushable= false; 

        this.pos_actual= 0; 
        this.posiciones= []; //Posiciones a las que se va moviendo Flora al ser golpeada 

        this.vida= 3; //Golpes que lleva Flora hasta el momento 

        this.setAnimaciones(); //Sus animaciones 
        this.setScale(1.5);

        /*Hitbox donde va a ser golpeada*/ 
        this.body.setSize(150,55); 
        this.body.setOffset(40,100);

        this.scene.physics.add.collider(this.scene.player, this, (o1, o2) => {
            if((o1.body.touching.down || o2.body.blocked.up)){
              o1.stepingOnEnemie();
              o2.meAplastan();
            }
            else if(!o1.invecibilidad && !(o1.body.touching.down || o2.body.blocked.up))
              this.damagedIshi(o2.x,o2,y);         
        });

        this.play('stand_by', true); 
    }


    setAnimaciones(){
        this.anims.create({
            key: 'stand_by',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1 
        });

        this.anims.create({
            key: 'stand_by_enfadada',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start:29, end: 34 }),
            frameRate: 10,
            repeat: -1 
        });


        this.anims.create({
            key: 'dañada',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 6, end: 9}),
            frameRate: 5,
            repeat: 0 
        })

        this.anims.create({
            key: 'esconder',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 35, end: 41}),
            frameRate: 10,
            repeat: 0
        })


        this.anims.create({
            key: 'aparecer',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 17, end: 24}),
            frameRate: 10,
            repeat: 0 
        })

        this.anims.create({
            key: 'aparecer_enfadada',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 41, end:48}), 
            frameRate: 10, 
            repeat: 0
        })


        this.anims.create({
            key: 'morir',
            frames: this.anims.generateFrameNumbers('planta_jefe', {start: 25, end: 28}),
            frameRate: 3,
            repeat: -1 
        })


        //Callback para cuando termina la animacion de morir 
        this.on("animationcomplete-morir", this.morir,
         this); 

    }

    preUpdate(t,dt){
        super.preUpdate(t,dt); 
    }


    meAplastan(){
        this.stop(); 
        this.vida--;
        this.body.destroy(); 
        if(this.vida===0){
            this.play('morir', true); 
        }
        else {
            this.play('dañada').chain('esconder'); 
        }
    }

    mePegan(){
        /*Lo ignora porque es un pro*/ 
    }

    morir(){
        /*Spawnear coleccionable*/ 
        this.scene.spawnColeccionable(); 
     }
}