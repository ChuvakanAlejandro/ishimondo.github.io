import Phaser from "phaser"

export default class En extends Phaser.GameObjects.Sprite{
    constructor (scene,x,y,num)
    {
        super(scene, x, y, 'en');
        this.target = scene.target;
        scene.add.existing(this);
        this.num = num;
    }

    lleno(){
        this.setTexture('en',0);
    }
    vacio()
    {
        this.setTexture('en',1);
    }
    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        if(this.target.energy() < this.num){
            this.vacio();
        }
        else{
            this.lleno();
        }
    }

    recargarEnergia(){

    }
}