import Phaser from 'phaser'; 
import Player from './player.js';
import Flora from './Flora.js';
import Coleccionable from './coleccionable.js';
import Moving_Platform from './moving_platform.js';

export default class Nivel3 extends Phaser.Scene {

    constructor(){
        super({key: 'nivel3'}); 

    }

    init(datos){
        this.image_data= datos.imagenes;
        this.enter_key= this.input.keyboard.addKey('Enter'); 
        this.bso= this.sound.add("boss_theme", {mute: true}); 
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

  
        this.groundLayer= this.map.createLayer('Suelo', tileset); 
        this.ramaLayer= this.map.createLayer('Rama', tileset); 

        this.decoracionLayer= this.map.createLayer('Decoracion', tileset);  
        this.groundLayer.setCollisionByProperty({colisiona: true});  
        this.ramaLayer.setCollisionByProperty({traspasable:true}); 
        //Grupos 
        this.enemies= this.physics.add.group(); 
        this.platforms= this.physics.add.group({allowGravity: false,
            immovable: true
        });

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


        //Creando al jefe 
        this.boss= this.map.createFromObjects('Sprites',{
            type: 'Jefe',
            classType: Flora
        })[0]; 

        for (const objeto of this.map.getObjectLayer('Sprites').objects) {
            if(objeto.type === 'Plataforma') {
                let aux= new Moving_Platform(this, objeto.x, objeto.y, this.platforms);
            } 
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

        this.physics.add.collider(this.player, this.platforms, this.callbackPlataforma, (player)=>{
            if(player.body.velocity.y>= 0){
                return true; 
            }
            else return false;
        }); 

        //Collider del suelo con los enemigos 
        this.physics.add.collider(this.groundLayer,this.boss); 


        //Terminar el nivel 
        this.physics.add.overlap(this.player, this.final_nivel, ()=>{
            if(!this.coleccionable.active) {
                this.image_data[2].desbloqueda= true;
                this.image_data[2].texto= 'Boceto de nivel en papel';
                this.image_data[2].imagen= 'boceto3';  
            }
            this.bso.destroy();
            this.scene.stop('hudIshi'); 
            this.scene.start('main', {imagenes: this.image_data}); 

        }, () => {
            //Solo te puedes pasar el nivel si el jefe ya está muerto 
            return !this.boss.active; 
        });

        //Camara del juego
        this.cameras.main.setBounds(0,0,5952, 1536);
        this.physics.world.setBounds(0,0,5952,1536);
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


        //Tweens para que se muevan las hoja-plataformas
        this.movimientoPlataformas(); 
    }

    /*Al derrotar al jefe aparece el coleccionable de este nivel si no se ha cogido ya*/ 
    spawnearColeccionable(){
        if(!this.image_data[2].desbloqueda){
            this.coleccionable= this.map.createFromObjects('Sprites', {
                type: 'Coleccionable',
                classType: Coleccionable
            }) [0]; 

            this.physics.add.overlap(this.player, this.coleccionable, ()=>{
                this.coleccionable.destroy(); 
            }); 
        } 
    }

    callbackPlataforma(player, plataforma){
        if (plataforma.body.touching.up && player.body.touching.down) {
            player.isOnPlatform = true;
            player.currentPlatform = plataforma;      
        }
    }

    movimientoPlataformas(){
        let i = 1;
        let mov = true;

        this.platforms.children.iterate(child => {

            if(mov){

                this.tweens.add({
                    targets: child,
                    y: child.y + 250,
                    yoyo: true,
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                });
            }
            else{
                this.tweens.add({
                    targets: child,
                    y: child.y - 250,
                    yoyo: true,
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                });
            }

            i++;

            if (i % 2 === 0)
            {
                i = 0;
                mov = false;
            }
            else{
                mov = true;
            }

        });
    }


    plantaGolpeada(player,jefe){
        console.log("Pisaste a Flora"); 
      jefe.meAplastan(); 
    }

    update(t,dt){
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter  
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'nivel3', imagenes: this.image_data}).pause;  
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