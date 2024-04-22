import Phaser from 'phaser'


export default class Galery_Menu extends Phaser.Scene{

    constructor(){
        super({key:'galery'}); 
    }

    init(datos){
        this.imgs_desbloq= datos.imagenes; //Vamos pasando como array todos los coleccionables que se han conseguido durante los niveles
        this.spaceKey= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escapeKey=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }


    create(){
        /*Necesito: 
            1)Botones 'triangulo' para pasar entre imagenes
            2)Marco en todo el centro donde aparaceran los bocetos 
                2.1) Si no se ha recogido el coleccionable, imagen de interrogacion
                2.2) Si si que se ha conseguido, se dara la opcion de ponerla en toda la pantalla
        */

    }

    update(){
        
    }

    sigBoceto(){

    }

    antBoceto(){

    }
}