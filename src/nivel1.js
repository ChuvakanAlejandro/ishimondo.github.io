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

        this.groundLayer.setTileIndexCallback([11,13], this.empiezaEscalada,this); 

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
        
    }

    compruebaTileEscalada(x, y, direccion){
       
        switch(direccion){
            case 'bajada': 
                let tile1= this.groundLayer.getTileAtWorldXY(x+32, y+32, true); 
                if(tile1.index==-1){
                    tile1=this.groundLayer.getTileAtWorldXY(x-1,y+32,true); 
                    if(tile1.index=== -1 || tile1.index=== 4 || tile1.index=== 6)  return false; 
                    else return true; 
                } 
                if(tile1.index=== 4 || tile1.index=== 6) return false;
                else return true;

            case 'subida': 
                let tile2= this.groundLayer.getTileAtWorldXY(x+32, y-32, true);  

                if(tile2.index== -1){
                    this.groundLayer.getTileAtWorldXY(x-16, y-58, true); 
                    if(tile2.index=== -1 || tile2.index=== 4 || tile2.index=== 6) return false; 
                    else return true; 
                }
                if(tile2.index=== 4 || tile2.index=== 6) return false;
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