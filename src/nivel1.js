import Phaser from 'phaser'; 
import Player from './player.js';

export default class Nivel1 extends Phaser.Scene{

    constructor(){
        super({key: 'nivel1'});
    }

    init() {
        this.enter_key= this.input.keyboard.addKey('Enter'); 
    }

    create(){
        this.map= this.make.tilemap({
            key: 'tilemap',
            tileWidth:  64,
            tileHeight: 64
        });
        
        const tileset= this.map.addTilesetImage('forest', 'forest');
        this.backgroundLayer= this.map.createLayer('Fondo', tileset); 
        this.groundLayer= this.map.createLayer('Suelo', tileset); 
       
        this.decoracionLayer= this.map.createLayer('Decoracion', tileset);  

        this.groundLayer.setCollisionByProperty({colisiona: true}); 


        //Grupos 
        this.enemies= this.physics.add.group(); 
        this.climbableWalls = this.add.group();

        for (const objeto of this.map.getObjectLayer('Sprites').objects) {
            // `objeto.name` u `objeto.type` nos llegan de las propiedades del
            // objeto en Tiled
            if (objeto.type === 'Jugador') {
              this.player= new Player(this,objeto.x, objeto.y -100); 
            }
            
             if(objeto.type === 'Seta') {
                let seta_aux= new Poison_Seta(this, objeto.x, objeto.y -100, true);
                seta_aux.setScale(0.5); 
                this.enemies.add(seta_aux);
            }

            else if(objeto.type === 'Pared_escalable'){
                let pared_aux= new Wall(this, this.player, objeto.x, objeto.y + 50, true, objeto.width, objeto.height)
            }
        }

        this.physics.add.collider(this.groundLayer, this.player); 
        //this.cameras.main.setBounds(this.player.x, this.player.y, this.map.width, this.map.height);
        this.cameras.main.setBounds(this.map.x,this.map.y,this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);


        this.scene.run('hudIshi',{target: this.player});

    }

    update(){
        super.update(); 
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter 
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'nivel1'}).pause;  
            this.scene.bringToTop('pause'); 
        }
    }

}