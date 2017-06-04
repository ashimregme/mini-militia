/**
 * Created by Asim on 4/6/2017.
 */
function Game(canvas, resources) {

    var _this;
    this._init = function() {
        
        _this = this;
        this.resources = resources;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.messageBox = document.getElementById('messageBox');
        this.ground = new TileGround(this.ctx);
        this.collisionHandler = new CollisionHandler(this.ctx, this.camera, this.ground.mapArray);
        this.gameBullets = [];
        this.shyame = new Shyame(this.ctx, { x: 600, y: 200 }, this.canvas, this.camera, this.collisionHandler, this.resources);
        this.camera = new Camera(this.ctx, this.shyame);
        this.robotUnits = {};

        this.introAudio = this.resources.getAudio('intro');
        this.introAudio.play();

        var randomNoOfRobotUnits = 6;
        this.robotUnitsGenerateInterval = setInterval(
            function() {
                if(Object.size(_this.robotUnits) < randomNoOfRobotUnits)
                    _this.generateRobotUnit();
            }, 3000
        );

        this.addControls();

        this.gameAnimationFrame = requestAnimationFrame(this.drawGame);
    };

    this.showEnemyDirection = function () {

        var offsetY = 100;
        var directionCount = 0;
        for(var i = 0; i < Object.size(_this.robotUnits); i++){

            // console.log(Object.size(_this.gameBullets));
            // console.log(Object.size(_this.shyame.actor.gameBullets));
            // console.log(Object.size(_this.robotUnits[i].gameBullets));

            var distX = _this.robotUnits[i].position.x - _this.shyame.actor.position.x;
            var distY = _this.robotUnits[i].position.y - _this.shyame.actor.position.y;
            var cOffset = 200;
            var distance = Util.calculateDistance(_this.robotUnits[i].position.x, _this.robotUnits[i].position.y, _this.shyame.actor.position.x,  _this.shyame.actor.position.y);
            if(distance < 600 || directionCount == 2) {
                directionCount = 0;
                break;
            }
            var vectorX = distX / distance;
            var vectorY = distY / distance;

            var tBaseX = _this.shyame.actor.position.x + vectorX * cOffset;
            var tBaseY = _this.shyame.actor.position.y + vectorY * cOffset;
            var tDistance = Util.calculateDistance(_this.robotUnits[i].position.x, _this.robotUnits[i].position.y, tBaseX,  tBaseY);

            var tDistX = _this.robotUnits[i].position.x - tBaseX;
            var tDistY = _this.robotUnits[i].position.y - tBaseY;
            var tVectorX = tDistX / tDistance;
            var tVectorY = tDistY / tDistance;
            var tOffset = 20;

            var xPerp = tOffset * tVectorX;
            var yPerp = tOffset * tVectorY;

            var cx = tBaseX - yPerp;
            var cy = tBaseY + xPerp;
            var dx = tBaseX + yPerp;
            var dy = tBaseY - xPerp;

            _this.ctx.beginPath();
            _this.ctx.lineWidth = 3;

            _this.ctx.moveTo(tBaseX + tVectorX * tOffset, tBaseY + tVectorY * tOffset);
            _this.ctx.lineTo(cx, cy);
            _this.ctx.lineTo(dx, dy);
            _this.ctx.lineTo(tBaseX + tVectorX * tOffset, tBaseY + tVectorY * tOffset);

            _this.ctx.strokeStyle = '#ff0000';
            _this.ctx.stroke();
            _this.ctx.strokeStyle = '#fff';
            _this.ctx.closePath();
            _this.ctx.beginPath();
            // _this.ctx.arc(_this.shyame.actor.position.x, _this.shyame.actor.position.y, cOffset, 0, Math.PI * 2);
            _this.ctx.stroke();
            _this.ctx.closePath();
            directionCount++;
        }
    };

    this.generateRobotUnit = function () {

        var rx = Util.getRandomInt(0, _this.canvas.width/3);
        var ry = Util.getRandomInt(-_this.canvas.height, 0);
        var robotUnit = new RobotUnit(Object.size(_this.robotUnits), _this.ctx, {x: rx, y: ry}, _this.shyame, _this.robotUnits, _this.ground.mapArray, _this.collisionHandler, _this, _this.resources);
        _this.robotUnits[Object.size(_this.robotUnits)] = robotUnit;
    };

    this.drawRobotUnits = function () {

        for(var i = 0; i < Object.size(_this.robotUnits); i++) {
            _this.robotUnits[i].move();
            _this.robotUnits[i].drawWeapon();
            _this.robotUnits[i].drawHealthOverHead();
        }
    };

    this.drawGame = function() {

        _this.gameAnimationFrame = requestAnimationFrame(_this.drawGame);
        _this.ctx.clearRect(0, 0, _this.ctx.canvas.width, _this.ctx.canvas.height);
        _this.ground.drawGround();
        _this.camera.move();
        _this.drawRobotUnits();
        _this.showEnemyDirection();
        _this.shyame.actor.move();
        _this.shyame.actor.drawWeapon();
        _this.shyame.actor._drawShyameStatus();
        _this.drawFire();
        _this.checkShot();
    };

    this.drawFire = function () {

        var refreshedGameBullets = {};
        var count = 0;
        if(Object.size(_this.gameBullets) > 0){
            // console.log(_this.gameBullets);
        }
        for(var i in _this.gameBullets){

            if(_this.gameBullets[i].toPosition.x > _this.ctx.canvas.width
                || _this.gameBullets[i].toPosition.y > _this.ctx.canvas.height
                || _this.gameBullets[i].toPosition.x < 0
                || _this.gameBullets[i].toPosition.y < 0
                || _this.collisionHandler.objectIsOutBound(_this.gameBullets[i].toPosition)){

                _this.gameBullets[i] = null;
            }else if(!_this.gameBullets[i].hit){
                refreshedGameBullets[count] = _this.gameBullets[i];
                _this.gameBullets[i].fire();
                count += 1;
            }
        }

        _this.gameBullets = refreshedGameBullets;
    };

    this.checkShot = function () {

        if(_this.shyame.actor.health == 0){

            if(_this.shyame.actor.noOfLifes > 1) {
                _this.respawn();
            }else{
                _this.gameOver();
            }
        }
        var refreshedBullets = {};
        var refreshedBulletsCount = 0;
        for(var i = 0; i < Object.size(_this.gameBullets); i++){
            if(_this.gameBullets[i].actorType == 'shyame') {
                var refreshedRobotUnitsCount = 0;
                var refreshedRobotUnits = {};
                for (var j = 0; j < Object.size(_this.robotUnits); j++) {
                    if (_this.rectCircleColliding(_this.gameBullets[i], _this.robotUnits[j])) {

                        _this.gameBullets[i].hit = true;
                        _this.robotUnits[j].hitCount += 1;
                        if(_this.robotUnits[j].hitCount == _this.robotUnits[j].maxRobotHit) {
                            _this.shyame.actor.score += 100;
                            _this.shyame.actor.kills += 1;
                            _this.robotUnits[j].death();
                            // delete _this.robotUnits[j];
                        }else{
                            refreshedRobotUnits[refreshedRobotUnitsCount] = _this.robotUnits[j];
                            refreshedRobotUnitsCount += 1;
                        }
                        for (j = j + 1; j < Object.size(_this.robotUnits); j++) {

                            refreshedRobotUnits[refreshedRobotUnitsCount] = _this.robotUnits[j];
                            refreshedRobotUnitsCount += 1;
                        }
                        break;
                    } else {
                        refreshedRobotUnits[refreshedRobotUnitsCount] = _this.robotUnits[j];
                        refreshedRobotUnitsCount += 1;
                    }
                }
                _this.robotUnits = refreshedRobotUnits;
            }else if(_this.gameBullets[i].actorType == 'robot-unit'){

                if (_this.rectCircleColliding(_this.gameBullets[i], _this.shyame.actor)) {

                    if (_this.shyame.actor.health >= 50){

                        _this.shyame.actor.health -= 50;
                    }else if(_this.shyame.actor.health > 0) {

                        _this.shyame.actor.health = 0;
                    }

                    _this.gameBullets[i].hit = true;
                }
            }
            if (!refreshedBullets.hasOwnProperty(i) && !_this.gameBullets[i].hit) {
                refreshedBullets[refreshedBulletsCount] = _this.gameBullets[i];
                refreshedBulletsCount += 1;
            }
        }
        _this.gameBullets = refreshedBullets;
    };

    // returns true if the actor and bullet are colliding
    this.rectCircleColliding = function(bullet, actor) {
        var distX = Math.abs(bullet.toPosition.x - actor.position.x - actor.actorWidth / 2);
        var distY = Math.abs(bullet.toPosition.y - actor.position.y - actor.actorHeight / 2);

        if (distX > (actor.actorWidth / 2 + 5)) {
            return false;
        }
        if (distY > (actor.actorHeight / 2 + 5)) {
            return false;
        }
        if (distX <= (actor.actorWidth / 2)) {
            return true;
        }
        if (distY <= (actor.actorHeight / 2)) {
            return true;
        }

        var dx = distX - actor.actorWidth / 2;
        var dy = distY - actor.actorHeight / 2;
        return (dx * dx + dy * dy <= 25);
    };

    this.respawn = function () {

        _this.respawnTime = 6;
        _this.pauseGame();
        _this.messageBox.style.opacity = 1;
        document.getElementById('score').innerHTML = _this.shyame.actor.score;
        document.getElementById('kills').innerHTML = _this.shyame.actor.kills;
        document.getElementById('respawn-value').innerHTML = _this.respawnTime;

        _this.respawnInterval = setInterval(function () {

            if(_this.respawnTime == 0){

                _this.resumeGame();
                _this.shyame.actor.noOfLifes -= 1;
                _this.shyame.actor.health = _this.shyame.actor.maxHealth;
                clearInterval(_this.respawnInterval);
            }else {
                _this.respawnTime -= 1;
                document.getElementById('respawn-value').innerHTML = _this.respawnTime;
            }
        }, 1000);

        _this.shyame.actor.position = {x: 1400, y: 10};
    };

    this.pauseGame = function () {

        cancelAnimationFrame(_this.gameAnimationFrame);
    };

    this.resumeGame = function () {

        _this.messageBox.style.opacity = 0;
        _this.gameAnimationFrame = requestAnimationFrame(_this.drawGame);
    };

    this.gameOver = function () {

        _this.messageBox.style.opacity = 1;
        document.getElementById('messageHeading').innerHTML = 'GAME OVER';
        document.getElementById('score').innerHTML = _this.shyame.actor.score;
        document.getElementById('kills').innerHTML = _this.shyame.actor.kills;
        document.getElementById('respawn').innerHTML = '';
        document.getElementById('retryButton').style.display = 'block';

        _this.pauseGame();
        _this.removeControls();
        _this.messageBox.style.opacity = 1;
        // _this._init();
    };

    this.addMovements = function(e) {

        _this.shyame.actor.commands['G'] = false;
        _this.shyame.actor.commands['O'] = false;
        switch (e.which) {

            case 87:
                _this.shyame.actor.commands['W'] = true;
                break;
            case 83:
                _this.shyame.actor.commands['S'] = true;
                break;
            case 68:
                _this.shyame.actor.commands['D'] = true;
                break;
            case 65:
                _this.shyame.actor.commands['A'] = true;
                break;
        }
    };

    this.removeMovements = function(e) {

        switch (e.which) {

            case 87:
                _this.shyame.actor.commands['W'] = false;
                break;
            case 83:
                _this.shyame.actor.commands['S'] = false;
                break;
            case 68:
                _this.shyame.actor.commands['D'] = false;
                break;
            case 65:
                _this.shyame.actor.commands['A'] = false;
                break;
        }
    };

    this.updateFaceSideEvent = function(e) {

        _this.shyame.actor.mousePos = _this.getMousePos(_this.canvas, e);
        _this.shyame.actor._updateFaceSide();
    };

    this.fireBulletEvent = function(e){

        _this.resources.getAudio('gun_shot').currentTime = 0;
        _this.gameBullets[Object.size(_this.gameBullets)] = _this.shyame.actor.weapon.fireBullet(_this.shyame.actor.position, _this.getMousePos(_this.canvas, e));
        _this.resources.getAudio('gun_shot').play();
    };

    this.addControls = function() {

        document.addEventListener('keydown', _this.addMovements);
        document.addEventListener('keyup', _this.removeMovements);
        document.addEventListener('mousemove', _this.updateFaceSideEvent);
        document.addEventListener('click', _this.fireBulletEvent);
    };

    this.removeControls = function () {

        document.removeEventListener('keydown', _this.addMovements);
        document.removeEventListener('keyup', _this.removeMovements);
        document.removeEventListener('mousemove', _this.updateFaceSideEvent);
        document.removeEventListener('click', _this.fireBulletEvent);
    };

    this.getMousePos = function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    this._init();
}
