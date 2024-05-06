import Phaser from 'phaser'; 
import Player from './player.js';
import Poison_Seta from './poison_seta.js';
import Bug from './bug.js';
import Coleccionable from './coleccionable.js';



export default class Tutorial extends Phaser.Scene{

    constructor(){
        super({key: 'tutorial'});
    }

    init(datos) {
        this.image_data= datos.imagenes;
        this.enter_key= this.input.keyboard.addKey('Enter'); 
        this.bso= this.sound.add("forest_theme", {mute:true}); 
        this.sonido_golpe= this.sound.add("sonido_daño"); 
        this.bso.play(); 
    }

    create(){
        const {width, height}= this.scale; 
        //Creacion del mapa y de las capas 
        this.map= this.make.tilemap({
            key: 'tutorial',
            tileWidth:  64,
            tileHeight: 64
        });
        
        const tileset= this.map.addTilesetImage('forest', 'forest');
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
        this.physics.world.enable(this.final_nivel); 
        this.final_nivel.body.setAllowGravity(false);
        this.final_nivel.body.setImmovable(false);
        eventAux.destroy();   
       
        //Creando a los enemigos 
        for (const objeto of this.map.getObjectLayer('Sprites').objects) {
            if(objeto.type === 'Seta') {
                let enemy= new Poison_Seta(this, objeto.x, objeto.y -100, true, this.enemies);
            } 
        }

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


        //Terminar el nivel 
        this.physics.add.overlap(this.player, this.final_nivel, ()=>{
            this.sound.stopAll();
            this.scene.stop('hudIshi') 
            this.scene.start('main', {imagenes: this.image_data}); 

        });

        
        //Callback para empezar la escalada 
        this.groundLayer.setTileIndexCallback([11,13,27,28], this.empiezaEscalada,this); 

        //Camara del juego
        this.cameras.main.setBounds(0,0,8960, 1792);
        this.physics.world.setBounds(0,0,8960,1792);
       
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);


        /*Fondo del nivel*/ 

        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background_world').setDepth(-1000);
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);
        
        /*HUD de vida */
        this.scene.run('hudIshi',{target: this.player});
        this.scene.bringToTop('hudIshi');
    }

    update(){
        super.update(); 
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter  
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'tutorial', imagenes: this.image_data}).pause;  
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