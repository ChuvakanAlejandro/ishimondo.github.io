import Phaser from 'phaser'


export default class Galery_Menu extends Phaser.Scene{

    constructor(){
        super({key:'galery'}); 
    }

    init(datos){
        /*Banda de sonora del menu*/ 
        this.bso= this.sound.add('galery_theme'); 
        this.bso.play();
        this.bso.setLoop(true);
        
        const {width, height} = this.scale;
        this.image_data= datos.imagenes; //Vamos pasando como array todos los coleccionables que se han conseguido durante los niveles


        /*Mapeo de teclas*/ 

        this.cursorKeys= this.input.keyboard.createCursorKeys(); 
        this.enterKey=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        this.act_img= 0;
        this.descriptionText= this.add.text(width* 0.25, height*0.7, '' ,{fontFamily: "RetroFont", fontSize: 30}); 
        this.locationText=  this.add.text(width*0.25, height*0.8, ''  ,{fontFamily: "RetroFont", fontSize: 20}); 
        this.imagenValue= this.add.image(width * 0.5, height* 0.4, 'img_locked'); 
        this.imagenValue.scale= 0.25; 
        this.onFullView= false; 
    }


    create(){
       this.mostrarBoceto(0); 
    }

    update(){
        super.update(); 


        if(!this.onFullView){
            if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)){ //Siguiente imagen 
                this.act_img-=1; 
                this.mostrarBoceto(this.act_img); 
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.right) ){ //Anterior imagen 
                this.act_img+= 1;
                this.mostrarBoceto(this.act_img); 
            }
        }
     

        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){ //Ampliar imagen 
            this.ampliarBoceto(); 
        }

        else if(this.enterKey.isDown){ //Volver al menu principal 
            this.bso.stop(); 
            this.scene.start('main'); 
        }
        
        
    }

    mostrarBoceto(index){
       
        if(index===6){ 
            index= 0; //Primera imagen 
            this.act_img= 0; 
        }
        else if(index===-1){
            index= 5; //Ultima imagen 
            this.act_img= 5; 
        }
        //this.imagenValue.image= this.image_data[index].imagen; 
        this.descriptionText.text= this.image_data[index].texto; 
        this.imagenValue.setTexture(this.image_data[index].imagen); 
        this.locationText.text='Se encuentra en: Nivel ' + (index + 1); 
    }



    ampliarBoceto(){
     
        if(this.image_data[this.act_img].desbloqueda){
            if(this.onFullView){
                this.imagenValue.setScale(0.25);
                this.descriptionText.setVisible(true); 
                this.locationText.setVisible(true); 
                this.onFullView= false;  
            }
           
            else{
                this.imagenValue.setScale(0.75); 
                this.descriptionText.setVisible(false); 
                this.locationText.setVisible(false); 
                this.onFullView= true; 
            } 
        }
      
    }
}