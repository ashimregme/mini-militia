/**
 * Created by Asim on 4/6/2017.
 */
function Shyame(ctx, startPosition, canvas, camera, collisionHandler, resources){

    this._init = function () {
        this.actor = new Actor(ctx, startPosition, canvas, camera, collisionHandler, resources);
    };

    this._init();
}