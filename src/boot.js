import Phaser from 'phaser'

import wall from '../assets/sprites/wall.png'
import platform from '../assets/sprites/platform.png'
import base from '../assets/sprites/base.png'
import star from '../assets/sprites/star.png'
import player from '../assets/sprites/Ishi.png'
import hud_vida from '../assets/sprites/hud_vida.png'
import hud_skill_bar from '../assets/sprites/hud_skill_bar.png'
import ishi from '../assets/animations/Ishi_sprites.png'

/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    this.load.setPath('assets/');
    this.load.image('sprites/platform', platform);
    this.load.image('sprites/base', base);
    this.load.image('sprites/star', star);
    this.load.image('sprites/player', player);
    this.load.image('sprites/wall', wall)
    this.load.image('sprites/hud_vida', hud_vida ); 
    this.load.image('sprites/hud_skill_bar', hud_skill_bar ); 
    this.load.spritesheet('animations/shi', ishi,{frameWidth:256,frameHeight:256});

  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('level');
  }
}