import Phaser from 'phaser'
import wall from '../assets/sprites/wall.png'
import platform from '../assets/sprites/platform.png'
import base from '../assets/sprites/base.png'
import star from '../assets/sprites/star.png'
import player from '../assets/sprites/Ishi.png'
import hud_vida from '../assets/sprites/hud_vida.png'
import hud_skill_bar from '../assets/sprites/hud_skill_bar.png'
import full_screen_img from '../assets/sprites/full_screen.png'
import no_full_screen_img from '../assets/sprites/no_full_screen.png'
import barra from '../assets/sprites/barra.png'
import vt from '../assets/sprites/vt_assets.png'
import en from '../assets/sprites/en_assets.png'
import i_face from '../assets/sprites/ishi_face.png'
import ishi from '../assets/animations/Ishi_sprites.png'
import mush from '../assets/animations/mushmi.png'
import bug from '../assets/animations/bug.png'
import proyectil from '../assets/animations/proyectil.png'
import background from '../assets/sprites/background.png'
import Button from '../assets/sprites/button.png'
import Bosque from '../assets/maps/mundo1.png'
import tilemap from '../assets/maps/nivel1.json'
import RetroFont from 'url:../assets/fonts/Retro_Computer.ttf'

import Forest_Theme from 'url:../assets/audio/musica_bosque.mp3'
import Sonido_Daño from 'url:../assets/audio/golpe_jugador.mp3'
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


  loadFont(name,url) {
    let newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
  }


  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    this.load.setPath('assets/sprites/');
    this.load.image('background', background);
    this.load.image('button', Button); 
    this.load.image('platform', platform);
    this.load.image('base', base);
    this.load.image('star', star);
    this.load.image('player', player);
    this.load.image('wall', wall)
    this.load.image('hud_vida', hud_vida ); 
    this.load.image('hud_skill_bar', hud_skill_bar ); 
    this.load.image('barra', barra );
    this.load.image('full_screen', full_screen_img); 
    this.load.image('no_full_screen', no_full_screen_img); 
    this.load.spritesheet('vt', vt,{frameWidth:32,frameHeight:16});
    this.load.spritesheet('en', en,{frameWidth:18,frameHeight:10});
    this.load.spritesheet('ishi_face', i_face,{frameWidth:96,frameHeight:96});    
    this.load.image('bala_seta', proyectil);
    this.load.spritesheet('ishi', ishi,{frameWidth:128,frameHeight:128});
    this.load.spritesheet('mushmi', mush,{frameWidth:96,frameHeight:96});
    this.load.spritesheet('bug', bug, {frameWidth: 128 ,frameHeight: 128}); 
    this.load.spritesheet('proyectil_seta', proyectil, {frameWidth: 38  ,frameHeight: 14}); 


    /*Carga del archivo del tilemap*/

    this.load.tilemapTiledJSON('tilemap', tilemap); //CARGA DEL ARCHIVO DEL TILEMAP (NO LO CREA) 
    this.load.image('forest' , Bosque); //CARGA DEL ATLAS DE PATRONES 

    /*Carga de fuentes*/ 
    this.loadFont("RetroFont", RetroFont); 
    

    /*Carga de audios*/ 
    this.load.audio("forest_theme", Forest_Theme); 
    this.load.audio("sonido_daño", Sonido_Daño); 
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('main');
  }
}