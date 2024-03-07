import Platform from './platform.js';
import Player from './player.js';
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
        this.stars = 10;
        this.bases = this.add.group();
        this.player = new Player(this, 500, 500);

        this.plataforms = this.physics.add.staticGroup(); 
        this.plataforms.addMultiple([new Platform(this, this.player, this.bases, 700, 200)]); 
        
        this.walls= this.physics.add.staticGroup(); 
        this.walls.addMultiple([new Wall (this, this.player,  900, 550), new Wall(this,this.player, 200,350)]); 

        this.physics.add.collider(this.player, this.walls); 
        this.spawn();

    }

    /**
     * Genera una estrella en una de las bases del escenario
     * @param {Array<Base>} from Lista de bases sobre las que se puede crear una estrella
     * Si es null, entonces se crea aleatoriamente sobre cualquiera de las bases existentes
     */
    spawn(from = null) {
        Phaser.Math.RND.pick(from || this.bases.children.entries).spawn();
    }

    /**
     * Método que se ejecuta al coger una estrella. Se pasa la base
     * sobre la que estaba la estrella cogida para evitar repeticiones
     * @param {Base} base La base sobre la que estaba la estrella que se ha cogido
     */
    starPickt(base) {
      
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
