import Platform from './platform.js';
import Player from './player.js';
import Poison_Seta  from './poison_seta.js';
import Wall from './wall.js';
import Phaser from 'phaser'
 

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
        const {width, height}= this.scale; 

        this.enter_key= this.input.keyboard.addKey('Enter'); 
        this.enemies= this.add.group();

        this.stars = 10;
        this.bases = this.add.group();
        this.player = new Player(this, 900, 1000);
        this.seta1= new Poison_Seta(this, 600, 1000, true, this.enemies);
        this.cameras.main.setBounds(0, 0, 20000, 1250);
        this.physics.world.setBounds(0, 0, 20000, 3000);


        new Platform(this, this.player, this.seta1, this.bases, 0, 11250);
        new Platform(this, this.player, this.seta1, this.bases, 250, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 500, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 750, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1000, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1250, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1500, 1250);
        new Platform(this, this.player, this.seta1, this.bases, 1750, 1250);
        new Wall(this, this.player, 1850, 950, true);
        new Platform(this, this.player, this.seta1, this.bases, 1350, 1000);
        new Wall(this, this.player, 1150, 600, true);
        new Wall(this, this.player, 1450, 600, true);
        new Platform(this, this.player, this.seta1, this.bases, 1950, 500);
        new Platform(this, this.player, this.seta1, this.bases, 2200, 500);
        new Platform(this, this.player, this.seta1, this.bases, 2650, 500);
        new Platform(this, this.player, this.seta1, this.bases, 2950, 500);
        new Platform(this, this.player, this.seta1, this.bases, 100, 100);
       
        this.cameras.main.startFollow(this.player,true, 0.2, 0.2);

        this.scene.run('hudIshi',{target: this.player});
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


    update(t,dt){
        super.update(t,dt);
        
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter 
            this.scene.stop(); 
        }
    }


}
