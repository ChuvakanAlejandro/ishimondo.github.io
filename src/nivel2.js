import Phaser from 'phaser'; 
import Player from './player.js';
import Poison_Seta from './poison_seta.js';
import Bug  from './bug.js';


export default class Nivel2 extends Phaser.Scene {

    constructor(){
        super({key: 'nivel2'}); 
    }

    init(){
        this.enter_key= this.input.keyboard.addKey('Enter'); 
    }

    create(){
        this.map= this.make.tilemap({
            key: 'nivel2',
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

        //Creando al jugador 
        this.player= this.map.createFromObjects('Sprites', {
            name: 'Ishi', 
            classType: Player
        } )[0];



        //Collider del suelo con el jugador 
        this.physics.add.collider(this.groundLayer, this.player); 

        //Camara del juego
        this.cameras.main.setBounds(0,0,4480, 2550);
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);
 
        //HUD de vida 
        this.scene.run('hudIshi',{target: this.player});
        this.scene.bringToTop('hudIshi'); 
    }

    update(t,dt){
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter  
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'nivel1'}).pause;  
            this.scene.bringToTop('pause'); 
        }
    }


    compruebaTileEscalada(x, y, direccion){
       
        switch(direccion){
            case 'bajada': 
                let tile1= this.groundLayer.getTileAtWorldXY(x+32, y+32, true); 
                if(tile1.index==-1){
                    tile1=this.groundLayer.getTileAtWorldXY(x-32,y+32,true); 
        
                    if(!tile1.properties['escalable'])  return false; 
                    else return true; 
                } 

                if(!tile1.properties['escalable']) return false;
                else return true;

            case 'subida': 
                let tile2= this.groundLayer.getTileAtWorldXY(x+32, y-32, true);  

                if(tile2.index== -1){
                    tile2= this.groundLayer.getTileAtWorldXY(x-32, y-32, true); 
                    if(!tile2.properties['escalable']) return false; 
                    else return true; 
                }
        
                if(!tile2.properties['escalable']) return false;
                else return true;  
            
            case 'fin':     
                let tile3= this.groundLayer.getTileAtWorldXY(x+32,y) ?? this.groundLayer.getTileAtWorldXY(x-20, y); 
                if(tile3.index=== 10 || tile3.index=== 12){
                    return true; 
                }
                else return false; 
        }
    }

    empiezaEscalada(){
        this.player.paredTrepable(true,100,100); 
    }
}