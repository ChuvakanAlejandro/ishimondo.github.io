import Phaser from 'phaser'


export default class Pause_Menu extends Phaser.Scene {

    /** 
      Constructor de la escena 
    */

    constructor() {
        super({key: 'pause'});
    }


    init(datos){
        this.ant_escena= datos.nombre_escena;  
        this.cursors= this.input.keyboard.createCursorKeys(); 
        this.enter_key= this.input.keyboard.addKey('Enter'); 

        this.indiceBotonAct= 0; 
    }


    create() {

        const {width, height} = this.scale;
        this.labelPausa= this.add.text(width* 0.4, height*0.3, 'PAUSA',{fontFamily: "RetroFont", fontSize:50}); 

        const exitOption= this.add.image(width* 0.3, height*0.7, 'button').setDisplaySize(250,100); 
        
        const restartOption= this.add.image(width - (width * 0.3)  ,exitOption.y, 'button').setDisplaySize(250,100); 


        this.add.text(exitOption.x, exitOption.y, 'SALIR DEL NIVEL', {fontFamily: "RetroFont", fontSize: 20}).setOrigin(0.5); 
        this.add.text(restartOption.x, restartOption.y, 'VOLVER A EMPEZAR', {fontFamily: "RetroFont", fontSize: 20}).setOrigin(0.5); 

        exitOption.on('pulsado', () => {
            this.scene.stop(this.ant_escena); 
            this.scene.stop('hudIshi'); 
            this.scene.start('main'); 
        }); 

        restartOption.on('pulsado', () => {
            this.scene.stop();
            this.scene.start(this.ant_escena); 
        }); 


        let timer = this.time.addEvent( {
            delay: 750, 
            callback: this.toggleText,
            callbackScope: this,  
            loop: true
        });
        
        this.buttons= [
            exitOption,
            restartOption
        ]; 

        this.seleccionarBoton(0); 
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){ //Si se pulsa la tecla enter 
            this.scene.stop(); 
            this.scene.resume(this.ant_escena); //Volvemos al gameplay
        }


        if(Phaser.Input.Keyboard.JustDown(this.cursors.left)){
            this.siguienteBoton(); 
        }

        else if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
            this.siguienteBoton();
        }

        else if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){ //El jugador presiona un boton 
            this.escoger(); 
        }

    }


    toggleText(){
        this.labelPausa.setVisible(!this.labelPausa.visible);
    }

    siguienteBoton(c = 1) {
        let index= this.indiceBotonAct + c;

        if(index >= this.buttons.length){
            index= 0; 
        }

        else if(index < 0){
            index= this.buttons.length - 1; 
        }

        this.seleccionarBoton(index); 

    }

    seleccionarBoton(indice) {
        const botonAct= this.buttons[this.indiceBotonAct]; 
        
        botonAct.setTint(0xffffff); 

        const boton= this.buttons[indice]; 

        boton.setTint(0x66ff7f); 


        this.indiceBotonAct= indice; 
    }

    escoger() {
        const boton= this.buttons[this.indiceBotonAct]; 
        boton.emit('pulsado'); 
    }



}