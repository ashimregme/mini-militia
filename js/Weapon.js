/**
 * Created by asim on 4/11/17.
 */
function Weapon(ctx, collisionHandler, actorType, resources){

    var _this;
    this._init = function () {

        _this = this;
        this.resources = resources;
        this.ctx = ctx;
        this.collisionHandler = collisionHandler;
        this.offset = {x: 20, y: 60};

        this.actorType = actorType;
        if(actorType == 'shyame') {

            this.weaponImageRight = this.resources.getImage('hand_with_gun');
            this.weaponImageLeft = this.resources.getImage('hand_with_gun_left');
        }else if(actorType == 'robot-unit'){

            this.weaponImageRight = this.resources.getImage('enemy_gun');
            this.weaponImageLeft = this.resources.getImage('enemy_gun_left');
        }
    };
    
    this.fireBullet = function (startPosition, endPosition) {

        return new Bullet(_this.ctx, startPosition, endPosition, collisionHandler, _this.offset, _this.actorType);
    };

    this._init();
}