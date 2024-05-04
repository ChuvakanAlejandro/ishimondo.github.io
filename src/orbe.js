


export default class Orbe extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, tipo){

        super(scene, x, y, tipo); 
       
        this.target= this.scene.player;
        this.scene.add.existing(this); 
        this.scene.physics.add.existing(this); 
        this.body.setAllowGravity(false); 
        this.body.setImmovable(true); 

        this.scene.physics.add.overlap(this.target, this, ()=>{
            switch (tipo) {
                case 'esfera_vt':
                    if(this.target.health() < 4){
                        this.target.vida++;
                        this.destroy(); 
                    }
                    break;  
                
                case 'esfera_en': 
                    if(this.target.energy() < 5){
                        this.target.energia++; 
                        this.destroy(); 
                    } 
                    break; 
            }
        }
    )
    }
}