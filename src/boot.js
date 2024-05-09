import Phaser from 'phaser'
import wall from '../assets/sprites/wall.png'
import platform from '../assets/sprites/platform.png'
import moving_platform from '../assets/sprites/moving_platform.png'
import base from '../assets/sprites/base.png'
import star from '../assets/sprites/star.png'
import player from '../assets/sprites/Ishi.png'
import planta_jefe from '../assets/animations/flora.png'
import full_screen_img from '../assets/sprites/full_screen.png'
import no_full_screen_img from '../assets/sprites/no_full_screen.png'
import barra from '../assets/sprites/barra.png'
import vt from '../assets/sprites/vt_assets.png'
import esfera_vt from '../assets/sprites/esfera_Vt.png'
import en from '../assets/sprites/en_assets.png'
import i_face from '../assets/sprites/ishi_face.png'
import ishi from '../assets/animations/Ishi_sprites.png'
import mush from '../assets/animations/mushmi.png'
import bug from '../assets/animations/bug.png'
import proyectil from '../assets/animations/proyectil.png'
import background_menu from '../assets/sprites/background_menu.png'
import background_world from '../assets/sprites/background_world.png'

import back_w1 from '../assets/sprites/fondo.png'
import middle_w1 from '../assets/sprites/gordos.png'
import front_w1 from '../assets/sprites/frente.png'
import Button from '../assets/sprites/button.png'
import Bosque from '../assets/maps/mundo1.png'

import coleccionable from '../assets/animations/coleccionable.png'
import img_locked from '../assets/sprites/imagen_oculta.png'
import boceto1 from '../assets/sprites/boceto1.png'
import boceto2 from '../assets/sprites/boceto2.png'
import boceto3 from '../assets/sprites/boceto3.png'

import tilemapTutorial from '../assets/maps/tutorial.json'
import tilemapN1 from '../assets/maps/nivel1.json'
import tilemapN2 from '../assets/maps/nivel2.json'
import tilemapN3 from '../assets/maps/nivel3.json'
import RetroFont from 'url:../assets/fonts/Retro_Computer.ttf'
import Main_Theme from 'url:../assets/audio/main_theme.wav'
import Forest_Theme from 'url:../assets/audio/forest_born.mp3'
import Boss_Theme from 'url:../assets/audio/from_the_roots.mp3'
import GameOver_Theme from 'url:../assets/audio/musica_gameover.mp3'
import Galery_Theme from 'url:../assets/audio/galery_theme.mp3'
import Sonido_Danio from 'url:../assets/audio/hitHurt.wav'
import Jump from 'url:../assets/audio/jump.wav'
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
    
    this.load.image('background_menu', background_menu);
    this.load.image('background_world', background_world); 
    this.load.image('back_w1', back_w1);
    this.load.image('middle_w1', middle_w1);
    this.load.image('front_w1', front_w1);

    this.load.image('button', Button); 
    this.load.image('platform', platform);
    this.load.image('moving_platform', moving_platform); 
    this.load.image('base', base);
    this.load.image('star', star);
    this.load.image('player', player);
    this.load.image('wall', wall); 
    this.load.image('barra', barra );
    this.load.image('full_screen', full_screen_img); 
    this.load.image('img_locked', img_locked); 
    this.load.image('boceto1', boceto1);
    this.load.image('boceto2', boceto2); 
    this.load.image('boceto3', boceto3); 

    this.load.image('no_full_screen', no_full_screen_img); 
    this.load.image('esfera_vt',esfera_vt); 
    this.load.spritesheet('vt', vt,{frameWidth:32,frameHeight:16});
    this.load.spritesheet('en', en,{frameWidth:18,frameHeight:10});
    this.load.spritesheet('ishi_face', i_face,{frameWidth:96,frameHeight:96});    
    this.load.image('bala_seta', proyectil);


    this.load.spritesheet('coleccionable', coleccionable, {frameWidth:32,frameHeight:32}); 
    this.load.spritesheet('ishi', ishi,{frameWidth:128,frameHeight:128});
    this.load.spritesheet('planta_jefe', planta_jefe, {frameWidth: 256, frameHeight: 256}); 
    this.load.spritesheet('mushmi', mush,{frameWidth:96,frameHeight:96});
    this.load.spritesheet('bug', bug, {frameWidth: 128 ,frameHeight: 128}); 
    this.load.spritesheet('proyectil_seta', proyectil, {frameWidth: 38  ,frameHeight: 14}); 


    /*Carga del archivo del tilemap*/
    this.load.tilemapTiledJSON('tutorial', tilemapTutorial); 
    this.load.tilemapTiledJSON('nivel1', tilemapN1); 
    this.load.tilemapTiledJSON('nivel2', tilemapN2); 
    this.load.tilemapTiledJSON('nivel3', tilemapN3); 
    this.load.image('forest' , Bosque); //CARGA DEL ATLAS DE PATRONES 

    /*Carga de fuentes*/ 
    this.loadFont("RetroFont", RetroFont); 
    

    /*Carga de audios*/ 
    this.load.audio("main_theme", Main_Theme); 
    this.load.audio("forest_theme", Forest_Theme);
    this.load.audio("boss_theme", Boss_Theme); 
    this.load.audio("galery_theme", Galery_Theme);
    this.load.audio("gameover_theme", GameOver_Theme);  
    this.load.audio("sonido_danio", Sonido_Danio); 
    this.load.audio("sonido_jump", Jump); 
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('main');
  }
}