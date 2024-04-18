import Phaser from "phaser"

export default class Hface extends Phaser.GameObjects.Sprite{
    constructor (scene,x,y,nombre)
    {
        super(scene, x, y, nombre);
        this.asset = nombre;
        this.target = scene.target;
        scene.add.existing(this);
    }

    iAmOkay(){
        this.setTexture(this.asset,0);
    }
    iAmHurt()
    {
        this.setTexture(this.asset,1);
    }
    iAmNotOkay()
    {
        this.setTexture(this.asset,2);
    }
    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        if(this.target.mode() == 'GOLPEADO'){
            this.iAmHurt();
        }
        else if(this.target.health() < 2){
            this.iAmNotOkay();
        }else{
            this.iAmOkay();
        }
    }
}