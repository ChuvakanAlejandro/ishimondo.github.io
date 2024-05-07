import Phaser from 'phaser'; 
import Player from './player.js';
import Poison_Seta from './poison_seta.js';
import Bug  from './bug.js';
import Coleccionable from './coleccionable.js';

export default class Nivel2 extends Phaser.Scene {

    constructor(){
        super({key: 'nivel2'}); 

    }

    init(datos){
        this.image_data= datos.imagenes;
        this.enter_key= this.input.keyboard.addKey('Enter'); 
        this.bso= this.sound.add("forest_theme", {mute: true}); 
        this.sonido_golpe= this.sound.add("sonido_daño"); 
        this.nombre_escena= 'nivel2'; 
        this.bso.play(); 
        this.bso.setLoop(true);
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
        this.ramaLayer= this.map.createLayer('Rama', tileset); 

        this.decoracionLayer= this.map.createLayer('Decoracion', tileset);  
        this.groundLayer.setCollisionByProperty({colisiona: true});  
        this.ramaLayer.setCollisionByProperty({traspasable: true}); 

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
        this.falling_Cliff = this.add.zone(0,3336, 20040, 500);
        this.physics.world.enable(this.final_nivel); 
        this.final_nivel.body.setAllowGravity(false);
        this.final_nivel.body.setImmovable(false);
        this.physics.add.existing(this.falling_Cliff);
        this.falling_Cliff.body.setAllowGravity(false);
        this.falling_Cliff.body.setImmovable(false);
        eventAux.destroy();   


        //Creando a los enemigos 
        for (const objeto of this.map.getObjectLayer('Sprites').objects) {
            if(objeto.type === 'Seta') {
                let enemy= new Poison_Seta(this, objeto.x, objeto.y -100, true, this.enemies);
            } 

            else if(objeto.type ==='Cucaracho'){
                let enemy= new Bug(this, objeto.x, objeto.y -100, true, this.enemies); 
            }
        }

        //Creamos el coleccionable
        if(!this.image_data[1].desbloqueda){
            this.coleccionable= this.map.createFromObjects('Sprites', {
                type: 'Coleccionable',
                classType: Coleccionable
            }) [0]; 

            this.physics.add.overlap(this.player, this.coleccionable, ()=>{
                this.coleccionable.destroy(); 
            }); 
        }

        //Callback para empezar la escalada 
        this.groundLayer.setTileIndexCallback([11,13,27,28], this.empiezaEscalada,this); 


        //Collider del suelo con el jugador 
        this.physics.add.collider(this.groundLayer, this.player); 
        this.physics.add.collider(this.ramaLayer, this.player, null, (player) =>
            {
                if(player.body.velocity.y>= 0){
                    return true; 
                }
                else return false;
            });

        //Collider del suelo con los enemigos 
        this.physics.add.collider(this.groundLayer,this.enemies); 
        this.physics.add.collider(this.ramaLayer, this.enemies); 

        this.physics.add.overlap(this.player, this.falling_Cliff, ()=>{
            this.player.fellFromACliff();
        });

         //Terminar el nivel 
         this.physics.add.overlap(this.player, this.final_nivel, ()=>{
            if(!this.coleccionable.active) {
                this.image_data[1].desbloqueda= true;
                this.image_data[1].texto= 'Boceto inicial de los enemigos';
                this.image_data[1].imagen= 'boceto2';  
            }
            this.bso.destroy();
            this.scene.stop('hudIshi') 
            this.scene.start('nivel3', {imagenes: this.image_data}); 

        });



        //Camara del juego
        this.cameras.main.setBounds(0,0,8512, 3136);
        this.physics.world.setBounds(0,0,8512,3136);
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
            this.scene.launch('pause', {nombre_escena: this.nombre_escena, imagenes: this.image_data}).pause;  
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



    gameover(){
        this.sound.stopAll();
        this.scene.stop('hudIshi'); 
        this.scene.start('end', {imagenes: this.image_data, nombre_escena: this.nombre_escena}); 
    }
}