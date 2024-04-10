import Phaser from "phaser"

export default class Vt extends Phaser.GameObjects.Sprite{
    constructor (scene,x,y,num)
    {
        super(scene, x, y, 'vt');
        this.target = scene.target;
        scene.add.existing(this);
        this.num = num;
    }

    lleno(){
        this.setTexture('vt',0);
    }

    rojo()
    {
        this.setTexture('vt',1);
    }
    vacio()
    {
        this.setTexture('vt',2);
    }
    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        if(this.target.health() < this.num){
            this.vacio();
        }
        else{
            this.lleno();
        }
    }
}