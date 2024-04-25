import Phaser from 'phaser'; 
import Player from './player.js';
import Poison_Seta from './poison_seta.js';
import Bug from './bug.js';
import Coleccionable from './coleccionable.js';



export default class Nivel1 extends Phaser.Scene{

    constructor(){
        super({key: 'nivel1'});
    }

    init(datos) {
        this.image_data= datos.imagenes;
        this.enter_key= this.input.keyboard.addKey('Enter'); 
        this.bso= this.sound.add("forest_theme"); 
        this.sonido_golpe= this.sound.add("sonido_daño"); 
        this.bso.play(); 
       
        this.bso.setLoop(true); 
    }

    create(){

        //Creacion del mapa y de las capas 
        this.map= this.make.tilemap({
            key: 'nivel1',
            tileWidth:  64,
            tileHeight: 64
        });
        
        const tileset= this.map.addTilesetImage('forest', 'forest');
        this.backgroundLayer= this.map.createLayer('Fondo', tileset); 
        this.groundLayer= this.map.createLayer('Suelo', tileset); 
       
        this.decoracionLayer= this.map.createLayer('Decoracion', tileset);  
        this.groundLayer.setCollisionByProperty({colisiona: true}); 

        //this.decoracionLayer.setCollisionByProperty({daña: true});  

        //Grupos 
        this.enemies= this.physics.add.group(); 

        //Creando al jugador 
        this.player= this.map.createFromObjects('Sprites', {
            name: 'Ishi', 
            classType: Player
        } )[0];
        //Creando la zona para el 'final del nivel' 

        let eventAux= this.map.createFromObjects('Sprites', {name: 'fin_nivel'}) [0]; 
        this.final_nivel= this.add.zone(eventAux.x, eventAux.y,eventAux.displayWidth, eventAux.displayHeight);
        this.physics.world.enable(this.final_nivel); 
        this.final_nivel.body.setAllowGravity(false);
        this.final_nivel.body.setImmovable(false);
        eventAux.destroy();   
       
        //Creando a los enemigos 
        for (const objeto of this.map.getObjectLayer('Sprites').objects) {
            if(objeto.type === 'Seta') {
                let enemy= new Bug(this, objeto.x, objeto.y -100, true, this.enemies);
            } 
        }

        //Collider del suelo con el jugador 
        this.physics.add.collider(this.groundLayer, this.player); 

        /*this.physics.add.collider(this.decoracionLayer, this.player, (o1, o2)=>{
            if(!o1.invecibilidad) 
                this.player.damagedIshi(o2.x,o2.y); 
        }) */


        //Collider del suelo con los enemigos 
        this.physics.add.collider(this.groundLayer,this.enemies); 


        //Terminar el nivel 
        this.physics.add.overlap(this.player, this.final_nivel, ()=>{
            if(!this.coleccionable.active) {
                this.image_data[0].desbloqueda= true;
                this.image_data[0].texto= 'Boceto inicial de Ishi';  
            }
            this.bso.destroy();
            this.scene.stop('hudIshi') 
            this.scene.start('main', {imagenes: this.image_data}); 

        });

        //Creamos el coleccionable
        if(!this.image_data[0].desbloqueda){
            this.coleccionable= this.map.createFromObjects('Sprites', {
                type: 'Coleccionable',
                classType: Coleccionable
            }) [0]; 
            this.physics.add.overlap(this.player, this.coleccionable, ()=>{
                this.coleccionable.destroy(); 
            }); 
        }
        

        //Callback para empezar la escalada 
        this.groundLayer.setTileIndexCallback([11,13], this.empiezaEscalada,this); 

        //Camara del juego
        this.cameras.main.setBounds(0,0,4480, 2550);
        this.physics.world.setBounds(0,0,4480,2550);
        this.add.image(0,0,4480, 2550, 'background').setOrigin(0,0); 
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);

        /*HUD de vida 
        this.scene.run('hudIshi',{target: this.player});
        this.scene.bringToTop('hudIshi');*/ 
    }

    update(){
        super.update(); 
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter  
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'nivel1', imagenes: this.image_data}).pause;  
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