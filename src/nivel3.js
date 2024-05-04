import Phaser from 'phaser'; 
import Player from './player.js';
import Flora from './Flora.js';

import Coleccionable from './coleccionable.js';

export default class Nivel3 extends Phaser.Scene {

    constructor(){
        super({key: 'nivel3'}); 

    }

    init(datos){
        this.image_data= datos.imagenes;
        this.enter_key= this.input.keyboard.addKey('Enter'); 
        this.bso= this.sound.add("boss_theme"); 
        this.sonido_golpe= this.sound.add("sonido_daño"); 
        this.bso.play(); 
        this.bso.setLoop(true); 
    }

    create(){
        this.map= this.make.tilemap({
            key: 'nivel3',
            tileWidth:  64,
            tileHeight: 64
        });
        
        const tileset= this.map.addTilesetImage('forest', 'forest');

        /*this.backgroundLayer= this.map.createLayer('Fondo', tileset); */
        this.groundLayer= this.map.createLayer('Suelo', tileset); 
       
        /*this.decoracionLayer= this.map.createLayer('Decoracion', tileset);*/  
        this.groundLayer.setCollisionByProperty({colisiona: true});  

        //Grupos 
        this.enemies= this.physics.add.group(); 

        //Creando al jugador 
        this.player= this.map.createFromObjects('Sprites', {
            name: 'Ishi', 
            classType: Player
        } )[0];


        //Creando al jefe 

        this.boss= this.map.createFromObjects('Sprites',{
            type: 'Jefe',
            classType: Flora
        })[0]; 


        /*Creamos el coleccionable
        if(!this.image_data[2].desbloqueda){
            this.coleccionable= this.map.createFromObjects('Sprites', {
                type: 'Coleccionable',
                classType: Coleccionable
            }) [0]; 

            this.physics.add.overlap(this.player, this.coleccionable, ()=>{
                this.coleccionable.destroy(); 
            }); 
        } */

        //Callback para empezar la escalada 
        this.groundLayer.setTileIndexCallback([11,13,27,28], this.empiezaEscalada,this); 


        //Collider del suelo con el jugador 
        this.physics.add.collider(this.groundLayer, this.player); 
        
        //Collider del suelo con los enemigos 
        this.physics.add.collider(this.groundLayer,this.enemies); 

        //Camara del juego
        this.cameras.main.setBounds(0,0,3328, 1536);
        this.physics.world.setBounds(0,0,3328,1536);
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);
        
        /*Fondo del nivel*/ 
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background_world').setDepth(-1000);
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        //HUD de vida 
        this.scene.run('hudIshi',{target: this.player});
        this.scene.bringToTop('hudIshi'); 
    }

    update(t,dt){
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter  
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'nivel3'}).pause;  
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
                if(tile3.index=== 10 || tile3.index=== 12 || tile3.index=== 19 || tile3.index=== 21){
                    return true; 
                }
                else return false; 
        }
    }

    empiezaEscalada(){
        this.player.paredTrepable(true,100,100); 
    }
}