/**
 * Created by Asim on 4/15/2017.
 */
function CollisionHandler(ctx, camera, mapArray){

    var _this;
    this._init = function () {

        _this = this;
        this.ctx = ctx;
        this.camera = camera;
        this.mapArray = mapArray;
    };

    this.hasReachedGround = function (actor) {

        var y = Math.round((actor.position.y + actor.actorHeight) / TILE_SIZE) - 1;
        var x = Math.round((actor.position.x + actor.actorWidth) / TILE_SIZE) - 2;

        if (_this.mapArray[y] !== undefined){
            if (_this.mapArray[y][x] !== undefined) {
                if(_this.mapArray[y][x].tileType == 1){
                    return true;
                }
            }
            if(_this.mapArray[y][x] !== undefined){
                if(_this.mapArray[y][x].tileType == 4) {
                    return true;
                }
            }
        }

        return false;
    };

    this.pushingAgainstWall = function (actor, direction) {

        var fromY = Math.round((actor.position.y) / TILE_SIZE) - 1;
        var x;
        if(direction == 'D')
            x = Math.round((actor.position.x + actor.actorWidth) / TILE_SIZE);
        else if(direction == 'A')
            x = Math.round(actor.position.x / TILE_SIZE);
        x = x - 3;
        var toY = Math.round((actor.position.y + actor.actorHeight) / TILE_SIZE) - 1;

        for(var i = fromY; i < toY; i++) {
            if (_this.mapArray[i] !== undefined) {
                if (_this.mapArray[i][x] !== undefined) {
                    if(_this.mapArray[i][x].tileType == 1 || _this.mapArray[i][x].tileType == 2 || _this.mapArray[i][x].tileType == 4) {
                        return true;
                    }
                    if(_this.mapArray[i][x + 2] !== undefined)
                        if(_this.mapArray[i][x + 2].tileType == 3 || _this.mapArray[i][x + 2].tileType == 5)
                            return true;
                }
            }
        }

        return false;
    };

    this.objectIsOutBound = function (position) {

        var y = Math.round(position.y / TILE_SIZE);
        var x = Math.round(position.x / TILE_SIZE);

        if (_this.mapArray[y] !== undefined) {
            if (_this.mapArray[y][x] !== undefined) {
                if(_this.mapArray[y][x].tileType == 1 || _this.mapArray[y][x].tileType == 4 || _this.mapArray[y][x].tileType == 2) {
                    return true;
                }
            }
        }
        return false;
    };

    this._init();
}