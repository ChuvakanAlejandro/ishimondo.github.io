import Star from './star.js';
import Phaser from 'phaser'

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Player extends Phaser.GameObjects.Sprite {
  
  /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'ishi');
    this.score = 0;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    // Queremos que el jugador no se salga de los límites del mundo
    this.body.setCollideWorldBounds();


    /*
      Animacion de idle
    */

    this.anims.create({
        key: 'idle_ishi',
        frames: this.anims.generateFrameNumbers('ishi', {start: 0, end: 5}),
        frameRate: 5,
        repeat: -1 
    });
    
    /*
      Animacion de agacharse
    */

    this.anims.create({
      key: 'ishi_crouch',
      frames: this.anims.generateFrameNumbers('ishi', {start: 6, end: 11}),
      frameRate: 10,
      repeat: -1 
  });

  /*
    Animacion de correr 
  */


  this.anims.create({
    key: 'ishi_running',
    frames: this.anims.generateFrameNumbers('ishi', {start: 43, end: 48}),
    frameRate: 10,
    repeat: -1 
  });
  
  /*
    Animacion de saltar 
  */


  this.anims.create({
      key: 'ishi_jumping',
      frames: this.anims.generateFrameNumbers('ishi', {start: 27, end: 30}),
      frameRate: 15,
      repeat: -1 
  });

  
  //Por defecto se ejecuta la animación de idle
   this.play('idle_ishi', true);

    this.body.setSize(40, 110, true);
    this.speed = 300;
    this.jumpSpeed = -400;
    this.modo= "LEVANTADO"; 
    
    // Esta label es la UI en la que pondremos la puntuación del jugador
    this.label = this.scene.add.text(10, 10, "");
    this.mapeoTeclas(); 
    

    //Interface de vida 
    const vida= this.scene.add.image(900,450,'hud_vida'); 
    vida.setDepth(1000); 
    //Inteface de habilidad
    const barra= this.scene.add.image(950,430,'hud_skill_bar'); 

    barra.setDepth(1000); 
    
    this.cambioVelocidad();
    
  }

  
  /**
   * Actualiza la UI con la puntuación actual
   */
  cambioVelocidad() {
    this.label.text= 'Velocidad actual: ' + this.speed; 
  }


  mapeoTeclas() {

    /*Tecla para ir hacia la derecha*/ 
    this.keyD= this.scene.input.keyboard.addKey('D'); 
   
    /*Tecla para ir hacia la izquierda*/ 

    this.keyA= this.scene.input.keyboard.addKey('A'); 

    /*Tecla de salto*/ 

    this.keySpace= this.scene.input.keyboard.addKey('SPACE'); 
    this.keySpace.on('down', event=> {this.play('ishi_jumping')}); 

    /*Tecla cambio a 4 patas*/
    this.keyShift= this.scene.input.keyboard.addKey('SHIFT'); 

    //Impide que al pulsar ciertas teclas, el navegador interrumpa el gameplay
    this.scene.input.keyboard.addCapture([this.keyD, this.keyA, this.keySpace, this.keyShift]); 
  }


  /**
   * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
   * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
   * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
   * @override
   */
  preUpdate(t,dt) {
    super.preUpdate(t,dt);
    
    
    if (Phaser.Input.Keyboard.JustDown(this.keySpace) && this.body.onFloor()) {
      this.body.setVelocityY(this.jumpSpeed);
      this.play('ishi_jumping'); 

    }

    if (this.keyA.isDown) {
      console.log("Se pulso la tecla A"); 

      if(this.body.onFloor())
        this.play('ishi_running', true);
      
      else this.play('ishi_jumping', true); 

      
      this.setFlip(true); 
      
      this.body.setVelocityX(-this.speed);

    }

    else if (this.keyD.isDown) {
      if(this.body.onFloor())
        this.play('ishi_running', true);

      else this.play('ishi_jumping', true); 

      console.log("Se pulso la tecla D");
      this.setFlip(false);  
      this.body.setVelocityX(this.speed);
      
    }

    else {
      this.body.setVelocityX(0);



      if(this.body.onFloor()){
        switch(this.modo) {
          case 'AGACHADO': 
              this.play('ishi_crouch', true);
            
              break; 
          
          case 'LEVANTADO': 
              this.play('idle_ishi', true);
              break; 
        }

       
      }
       else this.play('ishi_jumping', true); 
    }

    if(Phaser.Input.Keyboard.JustDown(this.keyShift)) { 
        console.log("Se pulso la tecla shift"); 

        switch(this.modo) {

            case "AGACHADO": 
              this.speed= 300; 
              this.modo= 'LEVANTADO'; 

              this.cambioVelocidad(); 
              /*Cambio de animacion*/ 
              this.play('idle_ishi'); 
              break; 
            
            case "LEVANTADO": 
              this.speed= 500;
              this.modo= 'AGACHADO'; 
              this.cambioVelocidad(); 

              /*Cambio de animacion*/ 
              this.play('ishi_crouch');
              break; 
        }
        
    }


   


  }
  
}
