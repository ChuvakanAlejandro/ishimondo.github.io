import Phaser from 'phaser'

/**
 * Escena de fin de juego. Cuando se han recogido todas las estrellas, se presenta un
 * texto que indica que el juego se ha acabado.
 * Si se pulsa cualquier tecla, se vuelve a iniciar el juego.
 */
export default class End extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'end' });
  }

  init(datos){
    this.ant_escena= datos.nombre_escena;  
    this.image_data= datos.imagenes; 
    this.salir= false; 
    this.bso= this.sound.add('gameover_theme'); 
  }

  /**
   * Creación de la escena. Tan solo contiene el texto que indica que el juego se ha acabado
   */
  create() {
    this.add.text(500, 250, 'Se acabo!\nPulsa cualquier tecla para volver a jugar', {fontFamily:  "RetroFont", fontSize: 30})
        .setOrigin(0.5, 0.5)  // Colocamos el pivote en el centro de cuadro de texto 
        .setAlign('center');  // Centramos el texto dentro del cuadro de texto


    /*Temporizador para la pantalla de gameover*/ 

    this.bso.on("complete", (music)=> {
      this.salir= true; 
    })
    this.bso.play(); 


    
    // Añadimos el listener para cuando se haya pulsado una tecla. Es probable que no
    // lleguemos a ver el mensaje porque veníamos con una tecla pulsada del juego (al 
    // ir moviendo al jugador). Se puede mejorar añadiendo un temporizador que 
    // añada este listener pasado un segundo
    this.input.keyboard.on('keydown', function (event) {
      if(this.salir===true){
        this.scene.start(this.ant_escena, {imagenes: this.image_data});
      } 
    }, this);
  }

}