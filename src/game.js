import Boot from './boot.js';
import End from './end.js';
import Level from './level.js';
import Main from './main_menu.js';
import HudIshi from './hudplayer.js';
import Phaser from 'phaser'

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    backgroundColor: 0xFFFFFF,
    scale: {
        // mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [Boot, Main, HudIshi, Level, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true
        }
    }
};

new Phaser.Game(config);
