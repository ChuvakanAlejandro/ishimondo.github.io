import Phaser from "phaser";



export default class Full_Screen extends Phaser.Scene {

    constructor(){
        super('full_screen');
    }


    create(){
        const {width, height}= this.scale; 
     
        let button_fscreen= this.add.image(0.98 * width, 0.05 * height, 'full_screen'); 
        button_fscreen.setInteractive();
        button_fscreen.on('pointerup', ()=>{
            if(!this.scale.isFullscreen){
                button_fscreen.setTexture('no_full_screen'); 
                this.scale.startFullscreen(); 

            } 


            else{
                button_fscreen.setTexture('full_screen'); 
                this.scale.stopFullscreen(); 
            } 
        })
    }


}