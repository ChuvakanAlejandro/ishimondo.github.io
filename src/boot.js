import Phaser from 'phaser'

import wall from '../assets/sprites/wall.png'
import platform from '../assets/sprites/platform.png'
import base from '../assets/sprites/base.png'
import star from '../assets/sprites/star.png'
import player from '../assets/sprites/Ishi.png'
import hud_vida from '../assets/sprites/hud_vida.png'
import hud_skill_bar from '../assets/sprites/hud_skill_bar.png'
import ishi from '../assets/animations/Ishi_sprites.png'
import background from '../assets/sprites/background.jpg'
import seta_poison from '../assets/animations/seta_venenosa.png'
import proyectil from '../assets/animations/proyectil.png'
import playButton from '../assets/sprites/playButton.jpg'

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
    this.load.setPath('assets/sprites/');
    this.load.image('background', background);
    this.load.image('playButton', playButton); 
    this.load.image('platform', platform);
    this.load.image('base', base);
    this.load.image('star', star);
    this.load.image('player', player);
    this.load.image('wall', wall)
    this.load.image('hud_vida', hud_vida ); 
    this.load.image('hud_skill_bar', hud_skill_bar ); 
    this.load.image('bala_seta', proyectil);
    this.load.spritesheet('ishi', ishi,{frameWidth:128,frameHeight:128});
    this.load.spritesheet('seta_bosque', seta_poison, {frameWidth: 96 ,frameHeight: 96}); 
    this.load.spritesheet('proyectil_seta', proyectil, {frameWidth: 38  ,frameHeight: 14}); 
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('main');
  }
}