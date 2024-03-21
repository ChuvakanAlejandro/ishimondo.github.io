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
        this.add.image(1000,1000,'background');
        this.stars = 10;
        this.bases = this.add.group();
        this.player = new Player(this, 150, 200);
        this.seta1= new Poison_Seta(this, 200,100, false);

      
        

        this.enemies= this.physics.add.group(); 
        this.enemies.add(this.seta1);

        this.physics.add.collider(this.enemies, this.player, recibirDanyo); 
        function recibirDanyo(obj1, obj2) {
            
            //Comprobar que el personaje esta pisando al enemigo 
            if((obj1.body.blocked.down|| obj2.body.blocked.up) && obj2.aplastable){
                obj2.morir(); 
            }
            else obj1.restarVida();
        }

        new Platform(this, this.player, this.seta1, this.bases, 150, 350);
        new Wall (this, this.player, 500,350);
        new Wall (this, this.player, 500,250); 
        new Platform(this, this.player, this.seta1, this.bases, 700, 150);
        new Platform(this, this.player, this.seta1, this.bases, 1500, 150);

        //Sirve para que la camara siga al jugador 
        this.cameras.main.startFollow(this.player);
    
    }
  

    climbWall(wall){
        if((this.player.body.blocked.left || this.player.body.blocked.right)){
            if(this.player.keyW.isDown){ this.player.body.setVelocityY(this.player.jumpSpeed/3);}
            else if(Phaser.Input.Keyboard.JustDown(this.player.keySpace)){ 
                this.player.body.setVelocityY(this.player.jumpSpeed/2);
                this.player.body.setVelocityX(-this.player.jumpSpeed/2);
            }
            else{this.player.body.setVelocityY(0);}
        }
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

    


}
