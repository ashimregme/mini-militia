/**
 * Created by asim on 4/10/17.
 */
function RobotUnit(id, ctx, startPosition, shyame, robotUnits, mapArray, collisionHandler, game, resources) {

    var _this;

    this._init = function() {

        _this = this;
        this.mapArray = mapArray;
        this.id = id;
        this.ctx = ctx;
        this.sprite = [];
        this.shyame = shyame;
        this.robotUnits = robotUnits;
        this.game = game;
        this.resources = resources;

        this.collisionHandler = collisionHandler;

        this.safeDistance = 100;

        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 1;

        this.noOfFrames = 1;
        this.spriteWidth = 120;
        this.actorHeight = 110;
        this.actorWidth = this.spriteWidth / this.noOfFrames;
        this.spriteHeight = 220;
        this.position = { x: startPosition.x, y: startPosition.y };
        this.moveId = false;
        this.speed = 2;
        this.ctx = ctx;
        this.bounceDistance = 10;
        this.commands = {};
        this.commands['M'] = false;
        this.commandsCount = {};
        this.executingCommands = {};
        this.executingCommands['A'] = false;
        this.executingCommands['S'] = false;
        this.executingCommands['D'] = false;
        this.executingCommands['F'] = false;
        this.commandsCount['A'] = 0;
        this.commandsCount['S'] = 0;
        this.commandsCount['D'] = 0;
        this.commandsCount['W'] = 0;
        this.gravity = 1;
        this.faceSide = 'right';
        this.sideChange = true;
        this.hitCount = 0;
        this.maxRobotHit = Util.getRandomInt(2, 5);

        this.maxSafeDistance = 700;
        this.minSafeDistance = 400;

        this.weapon = new Weapon(this.ctx, this.collisionHandler, 'robot-unit', this.resources);

        var bulletsFireInterval = Util.getRandomInt(2, 5);

        this.aiInterval = setInterval(function () {

            _this.safeDistance = Util.getRandomInt(_this.minSafeDistance, _this.maxSafeDistance);
            _this.speed = Util.getRandomInt(0.25, 2.25);

            _this.moveRight = _this.shyame.actor.position.x < _this.position.x;

            var positionToFireX = _this.shyame.actor.position.x + _this.shyame.actor.actorWidth / 2;
            var positionToFireY = _this.shyame.actor.position.y + _this.shyame.actor.actorHeight / 2;

            var distanceToShyame = Util.calculateDistance(positionToFireX, positionToFireY, _this.position.x, _this.position.y);
            if(distanceToShyame < _this.maxSafeDistance)
                _this.game.gameBullets[Object.size(_this.gameBullets)] = _this.weapon.fireBullet(_this.position, {x: positionToFireX, y: positionToFireY});

            bulletsFireInterval = Util.getRandomInt(5, 10);
        }, bulletsFireInterval * 1000);
    };

    this.move = function() {

        _this.sideChange = _this.shyame.actor.position.x > _this.position.x;
        if(_this.sideChange)
            _this.faceSide = 'right';
        else
            _this.faceSide = 'left';

        if(( _this.shyame.actor.position.y - _this.position.y )/ (_this.shyame.actor.position.x - _this.position.x) > 0){
            _this.commandsCount['D'] += 1;
        }else{
            _this.commandsCount['A'] += 1;
        }

        if((_this.shyame.actor.position.y - _this.safeDistance + _this.shyame.actor.actorHeight) > _this.position.y) {
            _this.commandsCount['S'] += 1;
        }else
            _this.commandsCount['W'] += 1;
        _this._stepFilter();
    };

    this.drawHealthOverHead = function () {

        _this.ctx.beginPath();
        var padding = {x: 3, y: 8};
        var length = 20;
        _this.ctx.lineWidth = 1;
        _this.ctx.moveTo(_this.position.x - padding.x, _this.position.y - padding.y);
        _this.ctx.lineTo(_this.position.x - padding.x, _this.position.y + padding.y);
        _this.ctx.lineTo(_this.position.x + _this.maxRobotHit * length + padding.x, _this.position.y + padding.y);
        _this.ctx.lineTo(_this.position.x + _this.maxRobotHit * length + padding.x, _this.position.y - padding.y);
        _this.ctx.lineTo(_this.position.x - padding.x, _this.position.y - padding.y);
        _this.ctx.strokeStyle = '#fff';
        _this.ctx.stroke();
        _this.ctx.closePath();

        _this.ctx.beginPath();
        _this.ctx.lineWidth = 8;

        _this.ctx.moveTo(_this.position.x, _this.position.y);
        _this.ctx.lineTo(_this.position.x +  (_this.maxRobotHit - _this.hitCount) * length, _this.position.y);
        _this.ctx.strokeStyle = '#2daf00';
        _this.ctx.stroke();
        _this.ctx.closePath();
    };

    this._stepFilter = function () {

        for(var c in _this.commandsCount){

            if(_this.commandsCount[c] > _this.bounceDistance || _this.executingCommands[c]){

                _this.commands[c] = true;
                _this.commandsCount[c] -= 1;
                _this.executingCommands[c] = true;
            }
            if(_this.commandsCount[c] == 0)
                _this.executingCommands[c] = false;
        }

        _this.step();
    };

    this.step = function() {

        if (_this.commands['W']){
            _this.frameIndex = 0;
            _this._drawActorWithJetPack();
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
        if (_this.commands['W']) {
            if(_this.position.y > (_this.speed))
                _this.position.y -= _this.speed;
        }
        if (_this.commands['S']) {
            if (_this.position.y < _this.ctx.canvas.height - _this.actorHeight) {
                var stop = false;
                if(_this.collisionHandler.hasReachedGround(_this)){
                    _this.commands['G'] = true;
                    stop = true;
                }
                if(!stop)
                    _this.position.y += _this.speed;
            }
        }
        if (_this.commands['D'] && !_this.collisionHandler.pushingAgainstWall(_this, 'D')) {
            if (_this.position.x < _this.ctx.canvas.width - _this.actorWidth - _this.speed) {
                if(_this.moveRight)
                    _this.position.x -= _this.speed;
                else
                    _this.position.x += _this.speed;
            }
        }
        if (_this.commands['A'] && !_this.collisionHandler.pushingAgainstWall(_this, 'A')) {
            if(_this.position.x > (_this.speed)) {
                if(_this.moveRight)
                    _this.position.x -= _this.speed;
                else
                    _this.position.x += _this.speed;
            }
        }
        _this._stop();
        if (!_this.commands['W']) {

            _this._fall();
        }
    };

    this.setFaceDirection = function(side) {

        _this.faceSide = side;
    };

    this._fall = function() {

        var y =  Math.round((_this.position.y + _this.actorHeight) / TILE_SIZE) - 1;
        var x = Math.round((_this.position.x + _this.actorHeight) / TILE_SIZE) - 1;

        // console.log('y = ' + y + ', x = ' + x);
        if(_this.mapArray[y] !== undefined) {
            if(_this.mapArray[y][x] !== undefined) {
                if (_this.mapArray[y][x].tileType == 1) {
                    _this.commands['G'] = true;
                    return;
                }
            }
        }
        _this.position.y += _this.gravity;
    };

    this._drawActorWithJetPack = function() {

        _this.ctx.drawImage(
            _this.resources.getImage('Enemy-1-' + _this.faceSide),
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
            _this.resources.getImage('Enemy-1-' + _this.faceSide),
            _this.frameIndex * _this.spriteWidth / _this.noOfFrames,
            0,
            _this.spriteWidth / (_this.noOfFrames),
            _this.actorHeight,
            _this.position.x, //position to place the actor in canvas
            _this.position.y,
            _this.spriteWidth / _this.noOfFrames, //actor height and width in canvas
            _this.actorHeight);
    };

    this.drawWeapon = function () {

        var weaponTipPositionX, weaponTipPositionY, weaponBackPositionX, weaponBackPositionY;

        var pat;
        var weaponImage;
        if(_this.faceSide == 'left') {
            weaponBackPositionX = _this.position.x + _this.weapon.offset.x + 70;
            weaponBackPositionY = _this.position.y + _this.weapon.offset.y - 10;
            pat = _this.ctx.createPattern(_this.weapon.weaponImageLeft, 'no-repeat');
            weaponImage = _this.weapon.weaponImageLeft;
        }else {
            weaponBackPositionX = _this.position.x + _this.weapon.offset.x + 10;
            weaponBackPositionY = _this.position.y + _this.weapon.offset.y;
            pat = _this.ctx.createPattern(_this.weapon.weaponImageRight, 'no-repeat');
            weaponImage = _this.weapon.weaponImageRight;
        }

        var length = 100;

        var vectorX = _this.shyame.actor.position.x - weaponBackPositionX;
        var vectorY = _this.shyame.actor.position.y - weaponBackPositionY;

        var distance = Util.calculateDistance(weaponBackPositionX, weaponBackPositionY, _this.shyame.actor.position.x, _this.shyame.actor.position.y);
        vectorX = vectorX / distance;
        vectorY = vectorY / distance;

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

        _this.ctx.rotate(Math.atan(slope) * 50 * Math.PI / 180);
        _this.ctx.drawImage(weaponImage, 0, 0, 70, 41);
        _this.ctx.closePath();
        _this.ctx.restore();
    };

    this._stop = function() {

        _this.commands['A'] = false;
        _this.commands['S'] = false;
        _this.commands['D'] = false;
        _this.commands['W'] = false;
    };

    this.death = function(){

        clearInterval(_this.aiInterval);
    };

    this._init();
}