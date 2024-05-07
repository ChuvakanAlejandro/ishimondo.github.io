import Phaser from 'phaser'
import Proyectil_Seta from './proyectil.js';
import Orbe from './orbe.js';

export default class Bug extends Phaser.GameObjects.Sprite{
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
        super(scene,x,y,'bug');
        this.setOrigin(0.5,0.5); 
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false); 
        this.body.pushable= false;

        enemies.add(this);

        //Parametros de bicho
        this.aplastable= aplastable;
        this.vida = 2;
        this.velocidad = 150;
        this.muriendo = false;
        this.golpeado = false;
        //Animacion por defecto
        this.setAnimaciones();

        this.body.setSize(56, 28);
        this.body.setOffset(40, 92);

        this.scene.physics.add.collider(this,enemies);


        this.play('bug_idle', true); 

    }

    setAnimaciones(){
        this.anims.create({
            key: 'bug_idle',
            frames: this.anims.generateFrameNumbers('bug', {start: 0, end: 6}),
            frameRate: 10,
            repeat: -1 
        });
        this.anims.create({
            key: 'bug_walks',
            frames: this.anims.generateFrameNumbers('bug', {start: 7, end: 12}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'bug_squeezed',
            frames: this.anims.generateFrameNumbers('bug', {start: 13, end: 16}),
            frameRate: 15,
            repeat: 0 
        });
        this.anims.create({
            key: 'bug_scratched',
            frames: this.anims.generateFrameNumbers('bug', {start: 21, end: 23}),
            frameRate: 10,
            repeat: 0 
        });
        this.on("animationcomplete-bug_scratched", ()=>{this.golpeado = false;}, this); 
        this.anims.create({
            key: 'bug_dies',
            frames: this.anims.generateFrameNumbers('bug', {start: 17, end: 20}),
            frameRate: 15,
            repeat: 0 
        });
        this.on("animationcomplete-bug_dies", ()=>{this.muriendo = true;}, this); 

    }
        


    preUpdate(t,dt){
        super.preUpdate(t,dt); 
        if (this.vida >0){
            if(!this.golpeado){
                if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 750) {
                    if(this.body.blocked.left && this.scene.groundLayer){
                        this.setFlip(false);
                        this.velocidad *=-1;
                    }else if (this.body.blocked.right){
                        this.setFlip(true);
                        this.velocidad *=-1;
                    }
                    this.play('bug_walks',true);
                    this.body.setVelocityX(this.velocidad);
                    /*this.play('bug_idle',true);
                    this.body.setVelocityX(0);*/
                }
                else{
                    this.play('bug_idle',true);
                    this.body.setVelocityX(0);
                }
            }
            else{
                this.body.setVelocityX(0);
            }
        }
        
        else{
            if(this.muriendo){
                this.setAlpha(this.alpha - 0.05);
                if(this.alpha == 0){
                    this.morir();
                }
            }
        }
        
    }

    meAplastan(){
        this.stop();
        this.vida = 0;
        this.body.destroy();
        this.play('bug_squeezed').chain('bug_dies');
    }
    mePegan(){
        this.stop();
        this.vida--;
        this.golpeado = true;
        if(this.vida == 0){
            this.body.destroy();
            this.play('bug_scratched').chain('bug_dies');
        }
        else{
            this.play('bug_scratched');
        }
    }

    stepedOn(){
        return this.aplastable;
    }

    morir(){
       new Orbe(this.scene, this.x, this.y, 'esfera_vt');
       this.destroy(); 
    }

}