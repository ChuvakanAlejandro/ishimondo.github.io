import Platform from './platform.js';
import Player from './player.js';
import Poison_Seta  from './poison_seta.js';
import Phaser from 'phaser'
import Wall from './wall.js'; 

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * @abstract Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */

export default class Level extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
        super({ key: 'level' });
    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
        /*AHORA SI CREAMOS EL TILEMAP */

        this.mapa= this.make.tilemap({ 
            key: 'tilemap',
            tileWidth: 16  ,
            tileHeight: 16
        }); 
        
        const tileset1= this.mapa.addTilesetImage('Bosque', 'Bosque'); 

        this.backgroundLayer= this.mapa.createLayer('Fondo', tileset1); 
        this.groundLayer= this.mapa.createLayer('Ground', tileset1);
        this.foregroundLayer= this.mapa.createLayer('Frente', tileset1); 
        this.decoracionLayer= this.mapa.createLayer('Decoracion', tileset1);
        
      
        this.groundLayer.setCollisionByProperty({colisiona: true}); 


        //Grupos 
        this.enemies= this.physics.add.group(); 
        this.climbableWalls = this.add.group();

        //Sacamos al personaje 

        for (const objeto of this.mapa.getObjectLayer('Sprites').objects) {
            // `objeto.name` u `objeto.type` nos llegan de las propiedades del
            // objeto en Tiled
            if (objeto.type === 'jugador') {
              this.player= new Player(this,objeto.x, objeto.y -100);
              this.player.setScale(0.5); 
            }
            
            else if(objeto.type === 'Seta') {
                let seta_aux= new Poison_Seta(this, objeto.x, objeto.y -100, true);
                seta_aux.setScale(0.5); 
                this.enemies.add(seta_aux);
            }

            else if(objeto.type === 'Pared_escalable'){
                let pared_aux= new Wall(this, this.player, objeto.x, objeto.y + 50, true, objeto.width, objeto.height)
            }
        }

        this.physics.add.collider(this.groundLayer, this.player); 
        this.physics.add.collider(this.groundLayer, this.enemies); 
        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setZoom(2); 
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);



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

        this.enter_key= this.input.keyboard.addKey('Enter'); 

        /*
        const {width, height}= this.scale; 

        

        this.add.image(1000,1000,'background');
        this.stars = 10;
        this.bases = this.add.group();
        
      
       



        this.textoVida= this.add.text(width*0.5, height*0.5, "Vida actual: 4");  
        this.textoVida.setScrollFactor(1,1); 
        this.textoVida.setOrigin(0.5,0.5); 



        this.physics.world.setBounds(0, 0, 2000, 2000);


        this.player = new Player(this, this.cameras.main.centerX, 600);
        this.seta1= new Poison_Seta(this, 600, 1000, true);
        
        

        

        new Platform(this, this.player, this.seta1, this.bases, 0, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 250, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 500, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 750, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1000, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1250, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1500, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1750, 1250);
        new Wall(this, this.player, 1850, 1050, true);
        new Platform(this, this.player, this.seta1, this.bases, 1750, 50);
        new Platform(this, this.player, this.seta1, this.bases, 2050, 150);
       

        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);
      */
    }
    
   




    /**
     * Genera una estrella en una de las bases del escenario
     * @param {Array<Base>} from Lista de bases sobre las que se puede crear una estrella
     * Si es null, entonces se crea aleatoriamente sobre cualquiera de las bases existentes
     */
    spawn(from = null) {
        Phaser.Math.RND.pick(from || this.bases.children.entries).spawn();
    }

    recibirGolpe(){
        console.log("Recibiendo daño"); 
    }


    /*
      Metodo que se encarga de reducir la gravedad simulando que el personaje sube por la pared 
      Solo funcionara si se pulsa la tecla W estando pegado a una pared 
    */
    climbWall(){
        if((this.player.body.blocked.right || this.player.body.blocked.left) && (this.player.keyW.isDown)){
            this.player.body.setVelocityY(this.player.jumpSpeed/2); 
        }
        
    }

    update(t,dt){
        super.update(t,dt);
        
        if(this.physics.collide(this.foregroundLayer, this.player)){
            this.foregroundLayer.destroy(); 
        }
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter 
            this.scene.pause();
            this.scene.launch('pause', {nombre_escena: 'level'}).pause;  
            this.scene.bringToTop('pause'); 
        }
    }


}
