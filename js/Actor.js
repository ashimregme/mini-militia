/**
 * Created by Asim on 4/6/2017.
 */

function Actor(ctx, startPosition, canvas, camera, collisionHandler, resources) {
    var _this = this;

    this._init = function() {
        this.camera = camera;
        this.canvas = canvas;
        this.dynamicUp = 0;
        this.collisionHandler = collisionHandler;
        this.frameIndex = 0;

        this.tickCount = 0;
        this.ticksPerFrame = 10;
        this.noOfFrames = 4;

        this.spriteWidth = 380;
        this.actorHeight = 153;
        this.actorWidth = this.spriteWidth / this.noOfFrames;
        this.spriteHeight = 335;
        this.position = startPosition;
        this.speed = 5;
        this.ctx = ctx;
        this.commands = {};
        this.commands['M'] = false;
        this.commands['O'] = false;
        this.gravity = 0.1;
        this.faceSide = 'right';
        this.jetPackUsable = true;
        this.maxHealth = 600;
        this.maxJetFuel = 600;
        this.health = this.maxHealth;
        this.jetFuel = this.maxJetFuel;
        this.velocity = 0;
        this.noOfLifes = 3;
        this.mousePos = startPosition;
        this.resources = resources;

        this.score = 0;
        this.kills = 0;

        this.weapon = new Weapon(this.ctx, this.collisionHandler, 'shyame', this.resources);

        this.characterHead = new Image();
        this.noOfLifesImage = new Image();
        this.statusIconsImage = new Image();
        this.characterHead.src = 'images/character/head.png';
        this.noOfLifesImage.src = 'images/no_of_lifes.PNG';
        this.statusIconsImage.src = 'images/status_icons.png';
    };

    this.move = function() {

        if(!_this.commands['O'])
            _this.step();
        if (_this.jetFuel < _this.maxJetFuel)
            _this.jetFuel += 0.5;
        if(_this.health < _this.maxHealth && _this._health > 0)
            _this.health += 0.2;
    };

    this.step = function() {

        if(_this.jetFuel < 0){

            _this.jetPackUsable = false;
        }else if(_this.jetFuel > 50){

            _this.jetPackUsable = true;
        }

        if (_this.commands['W'] && _this.jetPackUsable){
            _this._drawActorWithJetPack();
            _this.frameIndex = 0;

            _this.jetFuel -= 3;
        } else if(_this.commands['G'] && !(_this.commands['A'] || _this.commands['D'])){

            _this.frameIndex = 0;
            _this._drawActor();
        }else {
            _this.tickCount += 1;
            if (_this.tickCount > _this.ticksPerFrame) {
                _this.tickCount = 0;

                // If the current frame index is in range
                _this.frameIndex = ( _this.frameIndex + 1 ) % _this.noOfFrames;
            }
            _this._drawActor();
        }
        if (_this.commands['W'] && _this.jetPackUsable) {
            if(_this.position.y > (_this.speed)) {
                _this.position.y -= _this.speed;
                _this.dynamicUp += _this.speed;
                _this.canvas.style.marginBottom = this.dynamicUp + 'px';
            }
        }
        if (_this.commands['S']) {
            if (_this.position.y < _this.ctx.canvas.height - _this.actorHeight) {
                if(_this.collisionHandler.hasReachedGround(_this)) {
                    _this.commands['G'] = true;
                }else {
                    _this.position.y += _this.speed;
                    _this.dynamicUp -= _this.speed;
                    _this.canvas.style.marginBottom = this.dynamicUp + 'px';
                }
            }
        }
        if (_this.commands['D'] && !_this.collisionHandler.pushingAgainstWall(_this, 'D')) {
            if (_this.position.x < _this.ctx.canvas.width - _this.actorWidth - _this.speed) {
                _this.position.x += _this.speed;
            }
        }
        if (_this.commands['A'] && !_this.collisionHandler.pushingAgainstWall(_this, 'A')) {
            if(_this.position.x > (_this.speed)) {
                _this.position.x -= _this.speed;
            }
        }
        if (!_this.commands['W'] || !_this.jetPackUsable) {

            _this._fall();
        }
    };

    this.setFaceDirection = function(side) {

        _this.faceSide = side;
    };

    this._fall = function() {

        if(_this.collisionHandler.hasReachedGround(_this)){
            _this.commands['G'] = true;
            _this.velocity = 0;
            return;
        }
        _this.velocity += _this.gravity;
        _this.position.y += _this.velocity;
    };

    this._drawActorWithJetPack = function() {

        _this.ctx.drawImage(
            _this.resources.getImage('character_sprite1_' + _this.faceSide),
            _this.frameIndex * _this.spriteWidth / _this.noOfFrames, //start position of actor in sprite
            _this.actorHeight, //offset for second row
            _this.spriteWidth / (_this.noOfFrames), //width of actor
            (_this.spriteHeight - _this.actorHeight), //height of actor with jet pack
            _this.position.x, //position to place the actor in canvas
            _this.position.y,
            _this.spriteWidth / _this.noOfFrames, //actor height and width in canvas
            (_this.spriteHeight - _this.actorHeight));
    };

    this._drawActor = function() {

        _this.ctx.drawImage(
            _this.resources.getImage('character_sprite1_' + _this.faceSide),
            _this.frameIndex * _this.spriteWidth / _this.noOfFrames,
            0,
            _this.spriteWidth / (_this.noOfFrames),
            _this.actorHeight,
            _this.position.x, //position to place the actor in canvas
            _this.position.y,
            _this.spriteWidth / _this.noOfFrames, //actor height and width in canvas
            _this.actorHeight);
    };

    this._drawShyameStatus = function () {

        this._jetFuelStatus();
        this._health();
        this._statusBox();
        this._drawNoOfLifesRemaining();
    };

    this._drawNoOfLifesRemaining = function () {

        var marginLeft = Math.abs(parseInt(_this.ctx.canvas.style.marginLeft));
        marginLeft = isNaN(marginLeft) ? 0 : marginLeft;
        _this.ctx.drawImage(_this.characterHead, 0, 0, 62, 62, marginLeft + 1050, 40, 62, 62);
        _this.ctx.drawImage(_this.noOfLifesImage, 0, this.noOfLifes * 35 - 35, 80, 35, marginLeft + 1120, 50, 80, 35);
    };

    this._statusBox = function () {

        _this.ctx.beginPath();
        var marginLeft = Math.abs(parseInt(_this.ctx.canvas.style.marginLeft));
        if(isNaN(marginLeft)){
            marginLeft = 0;
        }
        _this.ctx.moveTo(marginLeft + 60, 30);
        _this.ctx.lineTo(marginLeft + 60, 140);
        _this.ctx.lineTo(marginLeft + 60 + _this.maxJetFuel / 3.5, 140);
        _this.ctx.lineTo(marginLeft + 60 + _this.maxJetFuel / 2.5, 100);
        _this.ctx.lineTo(marginLeft + 60 + _this.maxJetFuel / 2.5, 30);
        _this.ctx.lineTo(marginLeft + 52.5, 30);
        _this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        _this.ctx.stroke();
        _this.ctx.closePath();

        _this.ctx.drawImage(_this.statusIconsImage, 0, 0, 35, 90, marginLeft + 70, 50, 25, 68);
        // _this.ctx.drawImage(_this.statusIconsImage, 0, 90, 35, 30, marginLeft + 250, 45, 35, 30);
    };

    this._jetFuelStatus = function() {

        _this.ctx.beginPath();
        _this.ctx.lineWidth = 15;
        var marginLeft = Math.abs(parseInt(_this.ctx.canvas.style.marginLeft));
        if(isNaN(marginLeft)){
            marginLeft = 0;
        }
        _this.ctx.moveTo(marginLeft + 100, 100);
        _this.ctx.lineTo(marginLeft + (_this.jetFuel / 4) + 100, 100);
        _this.ctx.strokeStyle = '#0000ff';
        _this.ctx.stroke(); 
    };

    this._health = function() {

        _this.ctx.beginPath();
        _this.ctx.lineWidth = 15;
        var marginLeft = Math.abs(parseInt(_this.ctx.canvas.style.marginLeft));
        if(isNaN(marginLeft)){
            marginLeft = 0;
        }
        _this.ctx.moveTo(marginLeft + 100, 60);
        _this.ctx.lineTo(marginLeft + (_this.health / 4) + 100, 60);
        _this.ctx.strokeStyle = '#ce00ce';
        _this.ctx.stroke();
    };

    this.drawWeapon = function () {

        var weaponTipPositionX, weaponTipPositionY, weaponBackPositionX, weaponBackPositionY;

        var pat;
        if(_this.faceSide == 'left') {
            weaponBackPositionX = _this.position.x + _this.weapon.offset.x + 25;
            weaponBackPositionY = _this.position.y + _this.weapon.offset.y + 15;
            pat = _this.ctx.createPattern(_this.weapon.weaponImageLeft, 'no-repeat');
        }else {
            weaponBackPositionX = _this.position.x + _this.weapon.offset.x + 5;
            weaponBackPositionY = _this.position.y + _this.weapon.offset.y + 15;
            pat = _this.ctx.createPattern(_this.weapon.weaponImageRight, 'no-repeat');
        }

        var length = 100;

        var vectorX = _this.mousePos.x - weaponBackPositionX;
        var vectorY = _this.mousePos.y - weaponBackPositionY;

        var distance = Util.calculateDistance(weaponBackPositionX, weaponBackPositionY, _this.mousePos.x, _this.mousePos.y);
        vectorX = vectorX / distance;
        vectorY = vectorY / distance;

        if(_this.faceSide == 'left'){

            vectorX = -Math.abs(vectorX);
        }

        weaponTipPositionX = weaponBackPositionX + vectorX * length;
        weaponTipPositionY = weaponBackPositionY + vectorY * length;

        var slope = (weaponBackPositionY - weaponTipPositionY) / (weaponBackPositionX - weaponTipPositionX);

        _this.ctx.save();

        _this.ctx.beginPath();
        _this.ctx.lineWidth = 3;
        if(_this.faceSide == 'left') {
            _this.ctx.translate( weaponTipPositionX, weaponTipPositionY);
        }else {
            _this.ctx.translate(weaponBackPositionX, weaponBackPositionY);
        }
        // console.log(weaponBackPositionX);
        // console.log(weaponBackPositionY);
        // console.log(weaponTipPositionX);
        // console.log(weaponTipPositionY);
        _this.ctx.rotate(Math.atan(slope) * 50 * Math.PI / 180);
        _this.ctx.rect(0, 0, 120, 30);
        _this.ctx.fillStyle = pat;
        _this.ctx.fill();
        _this.ctx.closePath();
        _this.ctx.restore();
    };

/*    this.getPerpendicularToLine = function (l1, l2, l3, l4, length) {

        var distX = l3 - l1;
        var distY = l4 - l2;
        var distance = _this.calculateDistance(l3, l4, l1, l2);

        var vectorX = distX / distance;
        var vectorY = distY / distance;

        var cx = l3 - length * vectorY;
        var cy = l4 + length * vectorX;

        return {x: cx, y: cy};
    };*/

    

    this._updateFaceSide = function () {

        if(_this.mousePos === undefined)
            _this.mousePos = {x: _this.position.x + 500, y: _this.position.y};
        if (_this.mousePos.x >= _this.position.x && _this.faceSide == 'left')
            _this.faceSide = 'right';
        else if (_this.mousePos.x < _this.position.x && _this.faceSide == 'right')
            _this.faceSide = 'left';
    };

    this._init();
}