/**
 * Created by asim on 4/8/17.
 */
function TileGround(ctx) {

    var _this;
    this._init = function() {

        _this = this;
        this.ctx = ctx;
        this.totalNoOfTiles = Math.round(this.ctx.canvas.width / TILE_SIZE);
        this.mapArray = [];

        this._createMapPart(Array.apply(null, {length: 8}).map(Number.call, Number), this.totalNoOfTiles, 0, [], 0);

        this._createMapPart([8], Math.round(this.totalNoOfTiles / 4), 0, [], 0);
        this._createMapPart([8], Math.round(this.totalNoOfTiles / 4), 1, [0, 1], 2);
        this._createMapPart([8], this.totalNoOfTiles / 2, 0, [], 0);

        this._createMapPart([9, 10, 11, 12, 13, 14], Math.round(this.totalNoOfTiles / 4), 0, [], 0);
        this._createMapPart([9, 10, 11, 12, 13, 14], 1, 3, [0, 2], 1);
        this._createMapPart([9, 10, 11, 12, 13, 14], Math.round(this.totalNoOfTiles / 4) - 2, 2, [1, 2], 0);
        this._createMapPart([9, 10, 11, 12, 13, 14], 1, 5, [0, 2], 1);
        this._createMapPart([9, 10, 11, 12, 13, 14], Math.round(this.totalNoOfTiles / 2), 0, [], 0);

        // this._createMapPart([15], Math.round(this.totalNoOfTiles / 6 - this.totalNoOfTiles / 8), 3, [0, 1], 2);

        this._createMapPart([15], Math.round(this.totalNoOfTiles / 4), 1, [0, 1], 2);
        this._createMapPart([15], Math.round(this.totalNoOfTiles / 4), 2, [1, 2], 0);
        this._createMapPart([15], Math.round(this.totalNoOfTiles / 2), 1, [0, 1], 2);

        this._createMapPart([16, 17, 18, 19], this.totalNoOfTiles, 2, [1, 2], 0);

        // console.log(_this.mapArray);
        this._createObstacle({x: 600, y: 435}, 205, 125);
        this._createObstacle({x: 2600, y: 435}, 205, 125);

        this.grass = new Image();
        this.sand = new Image();
        this.verticalSand = new Image();
        this.verticalSandRight = new Image();
        this.background = new Image();
        this.bigStone = new Image();
        this.tree = new Image();

        this.grass.src = 'images/grass.png';
        this.sand.src = 'images/sand.png';
        this.verticalSand.src = 'images/vertical_sand.png';
        this.verticalSandRight.src = 'images/vertical_sand_right.png';
        this.background.src = 'images/background.png';
        this.bigStone.src = 'images/big_stones.png';
        this.tree.src = 'images/tree.png';
    };

    this._createMapPart = function (rows, noOfColumns, tileType, randomFrames, defaultFrame) {

        var randomFI = defaultFrame;

        for(var i = 0; i < rows.length; i++){

            if(!_this.mapArray.hasOwnProperty(rows[i]))
                _this.mapArray.push([]);
            for(var j = 0; j < noOfColumns; j++){

                randomFI = defaultFrame;
                for(var k in randomFrames){
                    if(_this._getRandomInt(0, 30) == 3){

                        randomFI = randomFrames[k];
                        break;
                    }
                }
                _this.mapArray[rows[i]].push({fi: randomFI, tileType: tileType});
            }
        }
    };

    this._createObstacle = function (obstaclePosition, obstacleWidth, obstacleHeight) {

        var fromY =  Math.round(obstaclePosition.y / TILE_SIZE) - 2;
        var fromX = Math.round(obstaclePosition.x / TILE_SIZE) - 2;
        var toY = Math.round((obstaclePosition.y + obstacleHeight) / TILE_SIZE) - 3;
        var toX = Math.round((obstaclePosition.x + obstacleWidth) / TILE_SIZE) - 2;

        for(i = fromY; i < toY; i++){

            for(j = fromX; j < toX; j++){

                _this.mapArray[i][j].tileType = 4;
                // console.log('y = ' + i + ', x = ' + j);
            }
        }
    };

    this.drawGround = function() {

        this.ctx.drawImage(this.background, 0, 0, 280, 220, 200, 230, 280, 260);
        this.ctx.drawImage(this.tree, 0, 0, 550, 625, 2300, 100, 350, 398);
        this.ctx.drawImage(this.bigStone, 0, 0, 205, 125, 600, 400, 205, 125);  //image, sx, sy, sw, sh, dx, dy, dw, dh
        this.ctx.drawImage(this.bigStone, 0, 0, 205, 125, 2600, 400, 205, 125);  //image, sx, sy, sw, sh, dx, dy, dw, dh
        for (var i = 0; i < _this.mapArray.length; i++) {

            for (var j = 0; j < _this.mapArray[i].length; j++) {

                if (_this.mapArray[i][j].tileType == 1) {

                    _this._drawGrass(_this.mapArray[i][j].fi * 100, {x: j * TILE_SIZE, y: i * TILE_SIZE}, {w: 100, h: 100}, {w: TILE_SIZE, h: TILE_SIZE});
                } else if (_this.mapArray[i][j].tileType == 2) {

                    _this._drawSand(_this.mapArray[i][j].fi * 100, {x: j * TILE_SIZE, y: i * TILE_SIZE}, {w: 100, h: 100}, {w: TILE_SIZE, h: TILE_SIZE});
                } else if (_this.mapArray[i][j].tileType == 3){

                    _this._drawVerticalSand(_this.mapArray[i][j].fi * 44, {x: j * TILE_SIZE, y: i * TILE_SIZE}, {w: 44, h: 44}, {w: TILE_SIZE, h: TILE_SIZE});
                } else if (_this.mapArray[i][j].tileType == 5){

                    _this._drawVerticalSandRight(_this.mapArray[i][j].fi * 44, {x: j * TILE_SIZE, y: i * TILE_SIZE}, {w: 44, h: 44}, {w: TILE_SIZE, h: TILE_SIZE});
                }
            }
        }
    };
    this._drawVerticalSand = function (fi, position, sizeFrom, sizeTo) {

        _this.ctx.drawImage(_this.verticalSand, fi, 0, sizeFrom.w, sizeFrom.h, position.x, position.y, sizeTo.w, sizeTo.h);
    };

    this._drawVerticalSandRight = function (fi, position, sizeFrom, sizeTo) {

        _this.ctx.drawImage(_this.verticalSandRight, fi, 0, sizeFrom.w, sizeFrom.h, position.x, position.y, sizeTo.w, sizeTo.h);
    };

    this._drawSand = function (fi, position, sizeFrom, sizeTo) {

        _this.ctx.drawImage(_this.sand, fi, 0, sizeFrom.w, sizeFrom.h, position.x, position.y, sizeTo.w, sizeTo.h);
    };

    this._drawGrass = function (fi, position, sizeFrom, sizeTo) {

        _this.ctx.drawImage(_this.grass, fi, 0, sizeFrom.w, sizeFrom.h, position.x, position.y, sizeTo.w, sizeTo.h);
    };

    this._getRandomInt = function(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this._init();
}
