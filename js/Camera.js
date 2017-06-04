/**
 * Created by Asim on 4/15/2017.
 */
function Camera(ctx, shyame) {

    var _this;
    this._init = function () {

        _this = this;
        this.ctx = ctx;
        this.shyame = shyame;
        this.canvasMarginLeft = 0;
        this.cameraSpeed = _this.shyame.actor.speed;
    };

    this.move = function () {

        // console.log(_this.shyame.actor.position.x);
        // console.log(_this.canvasMarginLeft );
        var diffCurrPos = _this.shyame.actor.position.x - Math.abs(_this.canvasMarginLeft);
        if(diffCurrPos != 600) {
            if (diffCurrPos > 600) {

                _this.moveRight();
            } else {
                _this.moveLeft();
            }
        }
    };

    this.moveRight = function () {

        // console.log('camera is moving right');
        // console.log(_this.ground.groundOffsets.x);
        if (_this.canvasMarginLeft <= 0 && _this.canvasMarginLeft >= -2635.0001)
            _this.canvasMarginLeft -= _this.cameraSpeed;
        _this.ctx.canvas.style.marginLeft = _this.canvasMarginLeft + 'px';
    };

    this.moveLeft = function () {

        // console.log('camera is moving left');
        // console.log(_this.ground.groundOffsets.x);
        if (_this.canvasMarginLeft < -_this.cameraSpeed && _this.canvasMarginLeft >= (-2635 - _this.cameraSpeed))
            _this.canvasMarginLeft += _this.cameraSpeed;
        _this.ctx.canvas.style.marginLeft = _this.canvasMarginLeft + 'px';
    };

    this._init();
};