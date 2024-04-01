import Star from './star.js';
import Phaser from 'phaser'
import game from './game.js'; 

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
    this.setOrigin(0,0.5);
    this.score = 0;
    this.vida= 4; 
    console.log("Vida actual:  " + this.vida); 
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    // Queremos que el jugador no se salga de los límites del mundo
    this.body.setCollideWorldBounds(true);


    this.body.setSize(35, 90);
    this.body.setOffset(46, 30);

    /*Declaracion e inicializacion de parametros*/ 
    this.vida= 4;  //Vida
    this.speed = 300; //Velocidad (en modo Levantado por defecto)
    this.speed_actual = 0;
    this.jumpSpeed = -600; //Velocidad del salto
    this.modo= "LEVANTADO"; //Modo del personaje (Levantado por defecto)
    
    // Esta label es la UI en la que pondremos la puntuación del jugador
    this.label = this.scene.add.text(10, 10, "");


    //Mapeo de controles
    this.mapeoTeclas(); 

    //Creamos las animaciones
    this.setAnimaciones(); 

    //Interface de vida 
    const vida= this.scene.add.image(900,450,'hud_vida'); 
    vida.setDepth(1000);

    //Inteface de habilidad
    const barra= this.scene.add.image(950,430,'hud_skill_bar'); 

    barra.setDepth(1000); 
    
    this.cambioVelocidad();
    

    /*TODO Collider con grupo de enemigos
        this.scene.physics.add.collider(this, this.scene.enemies, (o1, o2) => {
              if(o1.modo=== "ATACANDO") {
                  o2.morir(); 
              }          
        })
    */
  }


  /*
    CREA LAS ANIMACIONES CORRESPONDIENTES DEL PERSONAJE 
  */
  
  setAnimaciones(){
      
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

  /*
    Animacion de trepar
  */


    this.anims.create({
      key: 'ishi_climbing',
      frames: this.anims.generateFrameNumbers('ishi', {start: 70, end: 77}),
      frameRate: 15,
      repeat: -1 
  });
    /*
    Animacion de idle trepar
  */


    this.anims.create({
      key: 'ishi_climb_idle',
      frames: this.anims.generateFrameNumbers('ishi', {start: 78, end: 81}),
      frameRate: 5,
      repeat: -1 
  });

  /*
    Animacion de caer
  */


    this.anims.create({
      key: 'ishi_falling',
      frames: this.anims.generateFrameNumbers('ishi', {start: 68, end: 71}),
      frameRate: 10,
      repeat: 0 
  });
  /*
    Animacion de ataque 
  */
    this.anims.create({
      key: 'ishi_preparaGolpe1',
      frames: this.anims.generateFrameNames('ishi', {start: 49, end:  50 }), //Principio 49, fin 65
      frameRate: 20, 
      repeat: 0
   });
   
   this.anims.create({
      key: 'ishi_Golpe1',
      frames: this.anims.generateFrameNumbers('ishi', {start: 51, end: 55 }),
      frameRate: 20,
      repeat: 0
   }); 


   this.on('animationcomplete-ishi_Golpe1', () => {
     switch(this.flipX){
       case true: 
         this.hitboxAttack= this.scene.add.zone(this.x - 50, this.y+15, 20,40); 
       break; 

       case false: 
         this.hitboxAttack= this.scene.add.zone(this.x + 50, this.y-10, 20,40); 
       break; 
    }

    this.scene.physics.add.existing(this.hitboxAttack, true); 
    this.scene.physics.overlap(this.hitboxAttack, this.scene.enemies, procesarAtaque); 

    function procesarAtaque(o1, o2){
       o2.morir(); 
    }
   }, this); 


   this.anims.create({
     key: 'ishi_preparaGolpe2',
     frames: this.anims.generateFrameNumbers('ishi', {start: 56, end: 60 }),
     frameRate: 20,
     repeat: 0
  }); 

  this.on('animationcomplete-ishi_preparaGolpe2', () => {this.hitboxAttack.destroy()}, this); 


  this.anims.create({
   key: 'ishi_Golpe2',
   frames: this.anims.generateFrameNumbers('ishi', {start: 61, end: 63 }),
   frameRate: 20,
   repeat: 0
}); 


 //Callback para el segundo arañazo que hace ishi 

  this.on('animationcomplete-ishi_Golpe2', ()=> {

    switch(this.flipX){
       case true: 
         this.hitboxAttack= this.scene.add.zone(this.x - 50, this.y+15, 20,40); 
       break; 

       case false: 
         this.hitboxAttack= this.scene.add.zone(this.x + 50, this.y+15, 20,40); 
       break; 
    }

    this.scene.physics.add.existing(this.hitboxAttack, true); 
    this.scene.physics.overlap(this.hitboxAttack, this.scene.enemies, procesarAtaque); 

    function procesarAtaque(o1, o2){
       o2.morir(); 
    }

  }, this); 



 this.anims.create({
   key: 'ishi_finAtaque',
   frames: this.anims.generateFrameNumbers('ishi', {start: 64, end: 65 }),
   frameRate: 20,
   repeat: 0
 }); 

 //Callback para cuando Ishi termina de atacar 
 this.on('animationcomplete-ishi_finAtaque', ()=> {
    this.atacando= false;
    this.hitboxAttack.destroy(); 
 }, this); 
  
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
    this.label = this.scene.add.text(this.x, this.y, "");
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
    this.yParedTop = 0;
    this.yParedBottom = 0;
    
    this.cambioVelocidad();
    
  }

  /*
   PROVISIONAL
 */

 restarVida(){
  this.vida--;
     console.log("Vida actual " + this.vida); 
     this.x-= 75; 
     if(this.vida== 0){ //PANTALLA DE GAMEOVER
     }

  }

  
  /**
   * Actualiza la UI con la puntuación actual
   */
  cambioVelocidad() {
    this.label.text= 'Velocidad actual: ' + this.speed; 
  }

  /*
    SET DE LAS TECLAS DE MOVIMIENTO DEL PERSONAJE 
  */

  mapeoTeclas() {

    /*Tecla para el ataque básico*/ 
    this.keyP= this.scene.input.keyboard.addKey('P'); 

    /*Tecla para trepar paredes especiales*/ 
    this.keyW= this.scene.input.keyboard.addKey('W'); 

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

  paredTrepable(trepable, ytop, ybottom){
    this.trepable = trepable;
    this.yParedTop = ytop;
    this.yParedBottom = ybottom;
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
        this.body.setSize(35, 60);
        this.body.setOffset(46, 60);
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
  meAgarroPared(){
    this.trepable = !this.trepable;
    this.modo = "COLGANDO";
    this.body.setSize(35, 90);
    this.body.setOffset(46, 30);
    this.body.setAllowGravity(false);//Con esto ya no estare tocando el suelo (al parecer)
  }
  voyTreapando(){
    if(this.keyW.isDown && this.y > this.yParedTop){
      this.suboPared();
    }else if(Phaser.Input.Keyboard.JustDown(this.keyW) && this.y <= this.yParedTop){
      let subiendoEncima  = this.scene.add.timeline({
        
        target: this,
        ease: 'Linear',
        duration: 2,
        run: () => {
          console.log("pasa")
      },
        tweens: [
            { y: this.yParedTop-this.height },
            { x: this.x + this.width }
        ]
      });
      subiendoEncima.play();
    }else if(this.keyS.isDown && this.y < this.yParedBottom){
      this.bajoPared();
    }else {//Estoy quieto trepando la pared.
      this.play('ishi_climb_idle',true);
      this.body.setVelocityY(0);
      this.speed_actual = 0;
    }
  }

  suboPared(){
    console.log('Arriba voy');
    this.play('ishi_climbing',true);
    this.body.setVelocityY(this.jumpSpeed/3);
  }

  bajoPared(){
    console.log('Abajo voy');
    this.body.setVelocityY(-this.jumpSpeed/2);
  }
  wallJump(){
    if(this.bloqueadoDr){
      this.bloqueadoDr = false;
      this.modo="SALTANDO";
      this.modo_ant = "COLGANDO";
      this.speed = 600;
      this.speed_actual = -this.speed;
      this.body.setVelocityX(-this.speed);
      this.body.setVelocityY(-400);
      this.body.setAllowGravity(true);
    }
    else if(this.bloqueadoIz){
      this.bloqueadoIz = false;
      this.modo="SALTANDO";
      this.modo_ant = "COLGANDO";
      this.speed = 600;
      this.speed_actual = this.speed;
      this.body.setVelocityX(this.speed);
      this.body.setVelocityY(-400);
      this.body.setAllowGravity(true);
    }
    this.trepable = !this.trepable;
  }

  movimientoSuelo(){
    if (this.keyA.isDown && !this.bloqueadoIz) { //Moviendo me a la izquierda
      this.voyIzquierdaSuelo();
    }
    else if(this.keyD.isDown && !this.bloqueadoDr) { //Moviendo me a la derecha
      this.voyDerechaSuelo();
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
  }
  voyDerechaSuelo(){
    console.log("Se pulso la tecla D");
    this.bloqueadoIz = false; //Si me muevo a la derecha, ya no tengo nada bloqueando my moviemiento a mi izquierda
    if(this.body.blocked.right){//Estoy bloqueado
      this.bloqueadoDr = true;
    }else{//No estoy bloqueado
      this.play('ishi_running', true);
      this.setFlip(false);  
      this.body.setVelocityX(this.speed);
      this.speed_actual = this.speed;
    }
  }
  voyIzquierdaSuelo(){
    console.log("Se pulso la tecla A"); 
    this.bloqueadoDr = false;//Si me muevo a la izquierda, ya no tengo nada bloqueando my moviemiento a mi derecha
    if(this.body.blocked.left){//Estoy bloqueado
      this.bloqueadoIz = true;
    }else{
      this.play('ishi_running', true);
      this.setFlip(true); 
      this.body.setVelocityX(-this.speed);
      this.speed_actual = -this.speed;
    }
  }

  movimientoAire(){
    if(this.modo == "SALTANDO"){
      if (this.keyA.isDown){
        this.voyIzquierdaAire();
      }
      else if(this.keyD.isDown){
        this.voyDerechaAire();
      }
      else{
        if(this.speed_actual > 0)
          this.speed_actual = this.speed_actual-10; 
        else if(this.speed_actual < 0)
          this.speed_actual = this.speed_actual+10; 
      }
    }
    else{
      this.play('ishi_falling',true);
      if (this.keyA.isDown){
        this.caigoIzquierda();
      }
      else if(this.keyD.isDown){
        this.caigoDerecha();
      }
      else{
        if(this.speed_actual > 0){
          this.speed_actual = this.speed_actual-10;
          if(this.speed_actual > 0){
            this.speed_actual = 0;
          }
        } 
        else if(this.speed_actual < 0){
          this.speed_actual = this.speed_actual+10; 
          if(this.speed_actual > 0){
            this.speed_actual = 0;
          }
        }
      }
    }
    this.body.setVelocityX(this.speed_actual);
  }
  voyDerechaAire(){
    console.log("Se pulso la tecla D en el aire");
    if(this.body.blocked.right && Phaser.Input.Keyboard.JustDown(this.keyShift) && this.trepable){//Estoy bloqueado
      this.bloqueadoDr = true;
      if(this.flipX){
        this.setFlip(false); 
      }
      this.meAgarroPared();
    }else{
      if(this.speed_actual < this.speed){
        this.speed_actual = this.speed_actual+50;
        if(this.speed_actual > this.speed)
          this.speed_actual = this.speed_actual - 10;
      }
    }
  }
  voyIzquierdaAire(){
    console.log("Se pulso la tecla A en el aire");
    if(this.body.blocked.left && Phaser.Input.Keyboard.JustDown(this.keyShift) && this.trepable){//Estoy bloqueado
      this.bloqueadoIz = true;
      if(!this.flipX){
        this.setFlip(true); 
      }
      this.meAgarroPared();
    }else{
        if(this.speed_actual > -this.speed){
        this.speed_actual = this.speed_actual-50;
        if(this.speed_actual < -this.speed)
          this.speed_actual = this.speed_actual + 10;
      }
    }
  }
  caigoDerecha(){
    console.log("Se pulso la tecla D en el aire");
    this.play('ishi_falling',true);
    this.setFlip(false); 
    if(this.body.blocked.right && Phaser.Input.Keyboard.JustDown(this.keyShift) && this.trepable){//Estoy bloqueado
      this.bloqueadoDr = true;
      this.meAgarroPared();
    }else{
      this.setFlip(false);
      if(this.speed_actual > 150){
        this.speed_actual -= 1;
      }
      else{
        this.speed_actual = 150;
      }
    }
  }
  caigoIzquierda(){
    console.log("Se pulso la tecla A en el aire");
    this.play('ishi_falling',true);
    this.setFlip(false); 
    if(this.body.blocked.left && Phaser.Input.Keyboard.JustDown(this.keyShift) && this.trepable){//Estoy bloqueado
      this.bloqueadoIz = true;
      this.meAgarroPared();
    }else{
      this.setFlip(true);
      if(this.speed_actual < -150){
        this.speed_actual += -1;
      }
      else{
        this.speed_actual = -150;
      }
    }
  }

  /*
    LOGICA DEL ATAQUE DE ISHI (FALTAN COSAS)
  */

  logicaAtaque(){
    //Flag de ataque 
    this.atacando= true; 
    this.body.setVelocityX(0); 
    // TODO Insertar animacion de ataque     
    
    this.play('ishi_preparaGolpe1').chain('ishi_Golpe1').chain('ishi_preparaGolpe2').chain('ishi_Golpe2').chain('ishi_finAtaque'); 
  }

  preUpdate(t,dt) {
    super.preUpdate(t,dt);
    if(this.body.onFloor() && (this.modo=="LEVANTADO" || this.modo=="AGACHADO")){
      if(!this.atacando){
        if(Phaser.Input.Keyboard.JustDown(this.keyShift)) { //De base, SHIFT cambiara de modo
          console.log("Se pulso la tecla shift"); 
          if(this.trepable && (this.bloqueadoDr || this.bloqueadoIz)){//CAMBIANDO A MODO COLGANDO si encuentro una pared trepable y estoy bloqueado por ella
            this.meAgarroPared();
          
          }else if(! (this.bloqueadoDr || this.bloqueadoIz)){
            this.modo_ant = this.modo;
            this.cambiaModo(this.modo);
          }
        }else if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {//Cambiando a SALTANDO
          this.body.setVelocityY(this.jumpSpeed);
          this.modo_ant = this.modo;
          this.modo = "SALTANDO";
        }
        this.movimientoSuelo();
        if(Phaser.Input.Keyboard.JustDown(this.keyP)) {
          this.logicaAtaque();
        }
      }
    }else if(!this.body.onFloor() && this.modo=="SALTANDO"){//HE SALTADO Y ESTOY EN EL AIRE
      this.body.setSize(35, 60);
      this.body.setOffset(46, 60);
      this.play('ishi_jumping', true); 
      this.movimientoAire();
    }else if(this.body.onFloor() && (this.modo=="SALTANDO" || this.modo=="COLGANDO") ){//Si, en mi salto, toco el suelo, vuelvo a mi modo anterior
      this.body.setAllowGravity(true);
      if(this.modo_ant == "LEVANTADO"){
        this.cambiaModo("AGACHADO");
      }else if(this.modo_ant == "AGACHADO"){
        this.cambiaModo("LEVANTADO");
      }else{
        this.cambiaModo("AGACHADO");
      }
      this.trepable = false;
    }else if(!this.body.onFloor() && this.modo=="COLGANDO"){
      console.log('Trepando');
      if(Phaser.Input.Keyboard.JustDown(this.keyShift)){//Me dejo caer
        this.cambiaModo("AGACHADO");
        this.modo_ant = "LEVANTADO";
        this.body.setAllowGravity(true);
      }
      this.voyTreapando();
      if(Phaser.Input.Keyboard.JustDown(this.keySpace)){
        this.wallJump();
      }
    }else{
      this.play('idle_ishi', true);//Animacion caida
      this.movimientoAire();
    }
  }
}

