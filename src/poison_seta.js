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
   * @param {boolean} aplastable Indica si es posible matar al enemigo saltando encima de el 
   * @param {Phaser.GameObjects.Group} enemies
   */

    constructor(scene, x, y, aplastable = false, enemies) {

        //super(scene,x,y,'seta_bosque');
        super(scene,x,y,'mushmi');
        this.setOrigin(0,0.5); 
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false); 
        this.body.pushable= false;

        enemies.add(this);

        //Parametros de seta
        this.modo = "OCULTA";
        this.aplastable= aplastable; 
        this.in_cooldown= false;
        this.attacking = false;
        this.detection = 500;
        this.range = 480;
        this.resting = true;
        this.check = true;
        this.delay_idle = 100;
        //Animacion por defecto
        this.setAnimaciones();

      
        this.body.setSize(32, 32);
        this.body.setOffset(34, 55);
        
        //TIMERS
        this.shootsCooldown = this.scene.time.addEvent({
            delay: 2000,
            callback: this.sporeCooldwn,
            callbackScope: this,
            repeat: -1
        });
        this.shootsCooldown.paused = true;


        this.play('stand_by', true); 

    }

    setAnimaciones(){
        this.anims.create({
            key: 'stand_by',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 0, end: 3}),
            frameRate: 3,
            repeat: -1 
        });
        this.anims.create({
            key: 'shows_up',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 5, end: 9}),
            frameRate: 10,
            repeat: 0 
        });
        this.on("animationcomplete-shows_up", ()=>{this.cambiaModo();}, this);
        this.anims.create({
            key: 'mush_idle',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 9, end: 10}),
            frameRate: 10,
            repeat: -1 
        });
        this.anims.create({
            key: 'mush_looks',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 10, end: 15}),
            frameRate: 7,
            repeat: 0 
        });
        this.on("animationcomplete-mush_looks", ()=>{this.delay_idle = 100;}, this);
        this.anims.create({
            key: 'mush_prepares',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 16, end: 18}),
            frameRate: 7,
            repeat: 0 
        });
        this.anims.create({
            key: 'mush_inhales',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 19, end: 20}),
            frameRate: 10,
            repeat: 2 
        });
        this.anims.create({
            key: 'mush_shoots',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 21, end: 22}),
            frameRate: 15,
            repeat: 0 
        });
        this.on("animationcomplete-mush_shoots", ()=>{
            if(this.flipX){
                new Proyectil_Seta(this.scene, this.x - 5 , this.y+ 26, 'Izquierda');
            }else{
                new Proyectil_Seta(this.scene, this.x - 5, this.y+ 26, 'Derecha');
            }
            this.in_cooldown = true;
            this.shootsCooldown.paused = false;

        }, this);
        this.anims.create({
            key: 'mush_recovers',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 22, end: 23}),
            frameRate: 15,
            repeat: 0 
        });
        this.on("animationcomplete-mush_recovers", ()=>{this.attacking = false; this.delay_idle = 100;}, this);
        this.anims.create({
            key: 'mush_squeezed',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 24, end: 27}),
            frameRate: 15,
            repeat: 0 
        });
        this.anims.create({
            key: 'mush_scratched',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 25, end: 31}),
            frameRate: 15,
            repeat: 0 
        });
        this.anims.create({
            key: 'mush_dies_scratched',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 32, end: 35}),
            frameRate: 15,
            repeat: 0 
        });
        this.anims.create({
            key: 'mush_dies_squeezed',
            frames: this.anims.generateFrameNumbers('mushmi', {start: 36, end: 39}),
            frameRate: 15,
            repeat: 0 
        });       
    }

    cambiaModo(){
        switch(this.modo){
            case "MOSTRADA":
                this.modo = 'OCULTA';
                this.resting = true;
                break;
            case "OCULTA":
                this.modo = 'MOSTRADA';
                this.resting = false;
                break;
        }
    }

    detecting(detection){
        let aux = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
        return aux < detection;
    }

    sporeCooldwn(){
        this.in_cooldown = false;
        this.shootsCooldown.paused = true;
    }

    aLaCarga(){
        let r = this.detecting(this.range);
        if(!this.flipX){
            r = r && (this.scene.player.x < this.x);
        }else{
            r = r && (this.scene.player.x > this.x)
        }
        if(r){
            console.log("Ishi esta cerca");
        }
        return r && !this.in_cooldown && !this.attacking;
    }
        


    preUpdate(t,dt){
        super.preUpdate(t,dt);  
        if(this.modo == 'OCULTA'){
            if(this.detecting(this.detection)){
                if(this.x < this.scene.player.x){
                    this.setFlip(true); 
                }else{
                    this.setFlip(false);
                }
                this.play('shows_up',true);
            }else{
                this.play('stand_by',true);
            }
        }else if(this.modo == 'MOSTRADA'){
            if(!this.resting){
                if(this.aLaCarga()){
                    this.dispara();
                }else if(this.detecting(this.detection) && !this.attacking){ 
                    this.attacking = false;
                    if(this.delay_idle > 0){
                        this.play('mush_idle',true);
                        this.delay_idle--;                    }else{
                        this.play('mush_looks',true);
                    }
                }
            }
            if(!this.detecting(this.detection) && !this.attacking){
                this.playReverse('shows_up',true);
                this.resting = true;
            }
        } 
    }

    /*
       Metodo que se ejecuta cuando el jugador esta cerca de la seta
    */

    dispara(){
        this.attacking = true;
        this.play('mush_prepares').chain('mush_inhales')
            .chain('mush_shoots').chain('mush_recovers').chain('mush_idle');
    } 

    morir(){
        /*
            -Falta animacion de muerte 
        */
       this.destroy(); 
    }

}