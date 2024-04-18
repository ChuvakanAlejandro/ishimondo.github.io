import Phaser from 'phaser'
import Base from './base.js';
import Poison_Seta from './poison_seta.js';
/**
 * Clase que representa las plataformas que aparecen en el escenario de juego.
 * Cada plataforma es responsable de crear la base que aparece sobre ella y en la 
 * que, durante el juego, puede aparecer una estrella
 */
export default class Platform extends Phaser.GameObjects.Sprite {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {Player} player Jugador del juego
   * @param {Phaser.GameObjects.Group} enemigos
   * @param {Phaser.GameObjects.Group} baseGroup Grupo en el que se incluirá la base creada por la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  constructor(scene, player, enemigos, baseGroup, x, y) {
    super(scene, x, y, 'platform');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this, true);
    this.scene.physics.add.collider(this, player);
    this.scene.physics.add.collider(this, enemigos);
  }

}
