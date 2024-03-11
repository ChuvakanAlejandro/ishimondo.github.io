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
    this.body.setCollideWorldBounds(false);


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
      frameRate: 20,
      repeat: -1 
  });

  
  //Por defecto se ejecuta la animación de idle
   this.play('idle_ishi', true);

    this.body.setSize(35, 90);
    this.body.setOffset(46, 30);
    this.speed = 300;
    this.speed_actual = 0;
    this.jumpSpeed = -600;
    this.modo= "LEVANTADO";
    this.modo_ant= "LEVANTADO"; 
    
    // Esta label es la UI en la que pondremos la puntuación del jugador
    this.label = this.scene.add.text(10, 10, "");
    this.mapeoTeclas(); 
    

    //Interface de vida 
    const vida= this.scene.add.image(900,450,'hud_vida'); 
    vida.setDepth(1000); 
    //Inteface de habilidad
    const barra= this.scene.add.image(950,430,'hud_skill_bar'); 

    barra.setDepth(1000); 
    this.trepable = false;
    this.bloqueadoIz = false;
    this.bloqueadoDr = false;
    
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

    /*Tecla para ir hacia arriba*/ 

    this.keyW= this.scene.input.keyboard.addKey('W'); 

    /*Tecla para ir hacia abajo*/ 

    this.keyS= this.scene.input.keyboard.addKey('S'); 

    /*Tecla de salto*/ 

    this.keySpace= this.scene.input.keyboard.addKey('SPACE'); 
    this.keySpace.on('down', event=> {
    }); 

    /*Tecla cambio a 4 patas*/
    this.keyShift= this.scene.input.keyboard.addKey('SHIFT'); 

    //Impide que al pulsar ciertas teclas, el navegador interrumpa el gameplay
    this.scene.input.keyboard.addCapture([this.keyD, this.keyA, this.keyW, this.keyS, this.keySpace, this.keyShift]); 
  }

  paredTrepable(trepable){
    this.trepable = trepable;
  }
  cambiaModo(actual){
    switch(actual) {
      case "AGACHADO": 
        this.speed= 300; 
        this.modo= 'LEVANTADO'; 
        this.body.setSize(35, 90);
        this.body.setOffset(46, 30);
        this.cambioVelocidad(); 
        this.play('idle_ishi',true); 
        break; 
      case "LEVANTADO": 
        this.speed= 500;
        this.modo= 'AGACHADO'; 
        this.cambioVelocidad(); 
        this.body.setSize(45, 60);
        this.body.setOffset(42, 60);
        this.play('ishi_crouch',true);
        break;    
    }
  }

  /**
   * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
   * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
   * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
   * @override
   */
  preUpdate(t,dt) {
    super.preUpdate(t,dt);
    if(this.body.onFloor() && (this.modo=="LEVANTADO" || this.modo=="AGACHADO")){
      if(Phaser.Input.Keyboard.JustDown(this.keyShift)) { //De base, SHIFT cambiara de modo
        if(this.trepable && (this.bloqueadoDr || this.bloqueadoIz)){//CAMBIANDO A MODO COLGANDO si encuentro una pared trepable y estoy bloqueado por ella
          this.modo = "COLGANDO";
          this.body.setAllowGravity(false);//Con esto ya no estare tocando el suelo (al parecer)
        
        }else{
          console.log("Se pulso la tecla shift"); 
          this.modo_ant = this.modo;
          this.cambiaModo(this.modo);
        }
      }else if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {//Cambiando a SALTANDO
        this.body.setVelocityY(this.jumpSpeed);
        this.modo_ant = this.modo;
        this.modo = "SALTANDO";
      }
      if (this.keyA.isDown && !this.bloqueadoIz) { //Moviendo me a la izquierda
        console.log("Se pulso la tecla A"); 
        this.bloqueadoDr = false;
        if(this.body.blocked.left){//Estoy bloqueado
          this.bloqueadoIz = true;
        }else{
          this.play('ishi_running', true);
          this.setFlip(true); 
          this.body.setVelocityX(-this.speed);
          this.speed_actual = -this.speed;
        }
      }
      else if (this.keyD.isDown && !this.bloqueadoDr) {//Moviendome a la derecha
        console.log("Se pulso la tecla D");
        this.bloqueadoIz = false;
        if(this.body.blocked.right){//Estoy bloqueado
          this.bloqueadoDr = true;
        }else{//No estoy bloqueado
          this.play('ishi_running', true);
          this.setFlip(false);  
          this.body.setVelocityX(this.speed);
          this.speed_actual = this.speed;
        }
      }
      else {//Estoy quieto
        this.body.setVelocityX(0);
        this.speed_actual = 0;
        switch(this.modo) {
          case 'AGACHADO': 
            this.play('ishi_crouch', true);
            break; 
          case 'LEVANTADO': 
              this.play('idle_ishi', true);
              break; 
        }
      }
    }else if(!this.body.onFloor() && this.modo=="SALTANDO"){//HE SALTADO Y ESTOY EN EL AIRE
      this.play('ishi_jumping', true); 
      if(Phaser.Input.Keyboard.JustDown(this.keyShift) && (this.bloqueadoDr || this.bloqueadoIz) && this.trepable){//CAMBIANDO A MODO COLGANDO si encuentro una pared trepable
        this.modo = "COLGANDO";
        this.body.setAllowGravity(false);//Con esto ya no estare tocando la pared (al parecer)
      }
      if (this.keyA.isDown) {
        console.log("Se pulso la tecla A en el aire");
        this.bloqueadoDr = false;
        if(this.body.blocked.left){//Estoy bloqueado
          this.bloqueadoIz = true;
        }else{
            if(this.speed_actual > -this.speed){
            this.speed_actual = this.speed_actual-50;
            if(this.speed_actual < -this.speed)
              this.speed_actual = this.speed_actual + 10;
          }
        }
      }
      else if (this.keyD.isDown) {
        console.log("Se pulso la tecla D en el aire");
        this.bloqueadoIz = false;
        if(this.body.blocked.right){//Estoy bloqueado
          this.bloqueadoDr = true;
        }else{
          if(this.speed_actual < this.speed){
            this.speed_actual = this.speed_actual+50;
            if(this.speed_actual > this.speed)
              this.speed_actual = this.speed_actual - 10;
          }
        }
      }
      else{
        if(this.speed_actual > 0)
          this.speed_actual = this.speed_actual-10; 
        else if(this.speed_actual < 0)
          this.speed_actual = this.speed_actual+10; 
      }
      this.body.setVelocityX(this.speed_actual);
    }else if(this.body.onFloor() && this.modo=="SALTANDO"){//Si, en mi salto, toco el suelo, vuelvo a mi modo anterior
      if(this.modo_ant == "LEVANTADO"){
        this.cambiaModo("AGACHADO");
      }else if(this.modo_ant == "AGACHADO"){
        this.cambiaModo("LEVANTADO");
      }else{
        this.cambiaModo("AGACHADO");
      }
    }else if(!this.body.onFloor() && this.modo=="COLGANDO"){
      console.log('Trepando');
      if(Phaser.Input.Keyboard.JustDown(this.keyShift)){
        this.cambiaModo("AGACHADO");
        this.modo_ant = "LEVANTADO";
        this.bloqueadoDr = false;
        this.bloqueadoIz = false;
        this.body.setAllowGravity(true);
      }
      if(this.keyW.isDown){
        console.log('Arriba voy');
        this.body.setVelocityY(this.jumpSpeed/3);
      }else if(this.keyS.isDown){
        let aux = this.body.onFloor();
        //TRATAR S CUANDO SE LLEGA AL SUELO
        console.log('Abajo voy');
        this.body.setVelocityY(-this.jumpSpeed/2);
      }else {//Estoy quieto trepando la pared.
        this.body.setVelocityY(0);
        this.speed_actual = 0;
      }if(Phaser.Input.Keyboard.JustDown(this.keySpace)){
        if(this.bloqueadoDr){
          this.bloqueadoDr = false;
          this.modo="SALTANDO";
          this.modo_ant = "COLGANDO";
          this.speed = 600;
          this.body.setVelocityX(-this.speed);
          this.body.setVelocityY(-700);
          this.body.setAllowGravity(true);
        }
        else if(this.bloqueadoIz){
          this.bloqueadoIz = false;
          this.modo="SALTANDO";
          this.modo_ant = "COLGANDO";
          this.speed = 600;
          this.body.setVelocityX(this.speed);
          this.body.setVelocityY(-700);
          this.body.setAllowGravity(true);
        }
      }
    }else{
      this.play('idle_ishi', true);
      if (this.keyA.isDown) {
        console.log("Se pulso la tecla A en el aire");
        if(this.body.blocked.left && Phaser.Input.Keyboard.JustDown(this.keyShift) && this.trepable){//Estoy bloqueado
          this.bloqueadoIz = true;
          this.modo = "COLGANDO";
          this.body.setAllowGravity(false);//Con esto ya no estare tocando el suelo (al parecer)
        }else{
            this.speed_actual = -100;
        }
      }else if (this.keyD.isDown) {
        console.log("Se pulso la tecla D en el aire");
        if(this.body.blocked.right && Phaser.Input.Keyboard.JustDown(this.keyShift) && this.trepable){//Estoy bloqueado
          this.bloqueadoDr = true;
          this.modo = "COLGANDO";
          this.body.setAllowGravity(false);//Con esto ya no estare tocando el suelo (al parecer)
        }else{
          if(this.speed_actual < this.speed){
            this.speed_actual = 100;
          }
        }
      }else{
        this.speed_actual = 0;
      }
      this.body.setVelocityX(this.speed_actual);
    }
  }
}
/**
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
      
      else {
        this.play('ishi_jumping', true); 
      }

      
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
              this.body.setSize(35, 90);
              this.body.setOffset(46, 30);
              this.cambioVelocidad(); 
              this.play('idle_ishi'); 
              break; 
            
            case "LEVANTADO": 
              this.speed= 500;
              this.modo= 'AGACHADO'; 
              this.cambioVelocidad(); 
              this.body.setSize(45, 60);
              this.body.setOffset(42, 60);
              this.play('ishi_crouch');
              break; 
              
        }
        
      }
   


  }
*/
