import Phaser from 'phaser'


export default class Main_Menu extends Phaser.Scene {

    /** 
      Constructor de la escena 
    */

    constructor() {
        super({key: 'main'});
    }

    init(){
      
        this.cursors= this.input.keyboard.createCursorKeys(); 
        this.indiceBotonAct= 0; 
    }



    create() {

        const {width, height} = this.scale;

        /*Texto con el nombre del juego */
        this.add.text(width* 0.35, height*0.3, 'ISHIMONDO',{fontFamily: "RetroFont", fontSize:50}); 

        /*Botones de opcion*/ 
        const playOption= this.add.image(width* 0.3, height*0.7, 'button').setDisplaySize(250,100); 
        const galeryOption= this.add.image( width - (width * 0.3)  ,playOption.y, 'button').setDisplaySize(250,100); 
        this.add.text(playOption.x, playOption.y, 'JUGAR', {fontFamily: "RetroFont", fontSize: 30}).setOrigin(0.5); 
        this.add.text(galeryOption.x,galeryOption.y, 'GALERIA', {fontFamily: "RetroFont", fontSize: 30 }).setOrigin(0.5); 

        playOption.on('pulsado', () => {
            this.scene.start('nivel1'); 
        }); 

        galeryOption.on('pulsado', () => {
            this.scene.start('galery'); 
        });

        this.buttons = [
            playOption,
            galeryOption
        ]; 


        this.seleccionarBoton(0); 
        this.scene.launch('full_screen'); 
        this.scene.bringToTop('full_screen'); 
    }

    update() {
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