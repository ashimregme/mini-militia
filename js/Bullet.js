/**
 * Created by asim on 4/11/17.
 */
function Bullet(ctx, startPosition, endPosition, mapArray, gunOffset, actorType) {

    var _this;
    this._init = function () {

        _this = this;
        this.hit = false;
        this.ctx = ctx;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.speed = 20;
        this.gunOffset = gunOffset;
        this.actorType = actorType;
        this.bulletColor = 'red';
        if(this.actorType == 'shyame'){

            this.bulletColor = '#fffb42';
        }
        var vectorX = this.startPosition.x - this.endPosition.x  + this.gunOffset.x;
        var vectorY = this.startPosition.y - this.endPosition.y + this.gunOffset.y;
        var distance = this.calculateDistance(_this.startPosition.x + _this.gunOffset.x, _this.startPosition.y + _this.gunOffset.y, _this.endPosition.x, _this.endPosition.y);
        vectorX = -vectorX / distance;
        vectorY = -vectorY / distance;

        this.fromPosition = {x: _this.startPosition.x + _this.gunOffset.x, y: _this.startPosition.y + _this.gunOffset.y};
        this.toPosition = {x: 0, y: 0};
        
        this.vector = {x: vectorX, y: vectorY};
    };

    this.fire = function () {

        _this.ctx.beginPath();
        _this.ctx.lineWidth = 5;

        var toPositionX = _this.fromPosition.x + _this.vector.x * _this.speed;
        var toPositionY = _this.fromPosition.y + _this.vector.y * _this.speed;
        _this.toPosition = {x: toPositionX, y: toPositionY};
        _this.ctx.moveTo(_this.fromPosition.x, _this.fromPosition.y);
        _this.ctx.lineTo(_this.toPosition.x, _this.toPosition.y);
        _this.ctx.strokeStyle = _this.bulletColor;
        _this.ctx.stroke();
        _this.ctx.closePath();
        _this.fromPosition = _this.toPosition;
    };

    this.calculateDistance = function (x1, y1, x2, y2) {

        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };

    this._init();
}