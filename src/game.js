import Boot from './boot.js';
import End from './end.js';
import Level from './level.js';
import Main from './main_menu.js';
import Full_Screen  from './full_screen.js';
import HudIshi from './hudplayer.js';
import Pause from './pause_menu.js';
import Galery from './galery_menu.js'; 
import Phaser from 'phaser'; 
import Nivel_1 from './nivel1.js'
import Nivel_2 from './nivel2.js'
import Nivel_3 from './nivel3.js'

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    scene: [Boot, Main, Full_Screen, HudIshi, Pause, Galery, Level, Nivel_1, Nivel_2, Nivel_3, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    }
};




new Phaser.Game(config);


