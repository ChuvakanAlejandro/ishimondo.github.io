import Phaser from 'phaser'; 
import Player from './player.js';
import Poison_Seta from './poison_seta.js';



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
        this.decoracionLayer.setCollisionByProperty({daña:true}); 
        
        this.player= this.map.createFromObjects('Sprites', {
            name: 'Ishi', 
            classType: Player
        } )[0]; 


        //Grupos 
        this.enemies= this.physics.add.group(); 

        for (const objeto of this.map.getObjectLayer('Sprites').objects) {
            // `objeto.name` u `objeto.type` nos llegan de las propiedades del
            // objeto en Tiled
            
            if(objeto.type === 'Seta') {
                let seta_aux= new Poison_Seta(this, objeto.x, objeto.y -100, true);
                this.enemies.add(seta_aux);
            } 

        }



        this.physics.add.collider(this.groundLayer, this.player); 
        this.physics.add.collider(this.decoracionLayer, this.player, () => {
            this.player.restarVida(); 
        }); 

        this.physics.add.collider(this.groundLayer,this.enemies); 
        this.physics.add.collider(this.enemies, this.player, recibirDanyo); 
        function recibirDanyo(obj1, obj2) {
            
            //Comprobar que el personaje esta pisando al enemigo 
            if((obj1.body.blocked.down && obj2.body.blocked.up) && obj2.aplastable){
                obj2.morir(); 
            }
            else{
            
                obj1.restarVida();
            } 
        }

        this.groundLayer.setTileIndexCallback([11,13], this.escalada,this); 

        //Camara del juego 
        this.cameras.main.setBounds(0,0,4480, 2550);
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);

        //HUD de vida 
        this.scene.run('hudIshi',{target: this.player});
        this.scene.bringToTop('hudIshi'); 
    }

    update(){
        super.update(); 
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter 
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'nivel1'}).pause;  
            this.scene.bringToTop('pause'); 
        }
        

        if(this.player.estaTrepando()){
            const tile= this.groundLayer.getTileAtWorldXY(this.player.x+32, this.player.y+58) ?? this.groundLayer.getTileAtWorldXY(this.player.x-32, this.player.y+58); 
            if(tile.index=== 10 || tile.index=== 12){
                this.player.paraDeTrepar(); 
            }
        }
    }


    escalada(){
        this.player.paredTrepable(true,100,100); 
    }
}