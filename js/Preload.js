/**
 * Created by Asim on 4/20/2017.
 */
function Preload(){

    var _this;
    this._init = function () {

        _this = this;
        this.canvasWrapper = document.getElementsByClassName('wrapper')[0];
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.splashImage = new Image();
        this.splashImage.src = 'images/splash.png';

        this.splashImage.onload = function () {

            _this.ctx.drawImage(_this.splashImage, 0, 0, _this.canvasWrapper.clientWidth, _this.canvasWrapper.clientHeight);
        };

        this.splashAudio = new Audio('audio/splash.aac');
        this.splashAudio.play();

        this.resources = new Resources();

        this.resources.addImage('character_sprite1_left', 'images/character/character_sprite1_left.png');
        this.resources.addImage('character_sprite1_right', 'images/character/character_sprite1_right.png');

        this.resources.addImage('Enemy-1-left', 'images/character/Enemy-1-left.png');
        this.resources.addImage('Enemy-1-right', 'images/character/Enemy-1-right.png');

        this.resources.addImage('hand_with_gun', 'images/hand_with_gun.png');
        this.resources.addImage('hand_with_gun_left', 'images/hand_with_gun_left.png');
        this.resources.addImage('enemy_gun', 'images/enemy_gun.PNG');
        this.resources.addImage('enemy_gun_left', 'images/enemy_gun_left.PNG');

        this.resources.addAudio('intro', 'audio/intro.mp3');
        this.resources.addAudio('background_music', 'audio/background_music.mp3');
        this.resources.addAudio('gun_shot', 'audio/gun_shot.mp3');

        this.preloadInterval = setInterval(function () {
            if(_this.resources.imageLoadedCount == Object.size(_this.resources.images)) {
                _this.splashAudio.pause();
                delete _this.splashAudio;
                clearInterval(_this.preloadInterval);
                new Game(_this.canvas, _this.resources);
            }else{
                // console.log('here');
            }
        }, 5000);
    }

    this._init();
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

window.onload = function () {

    new Preload();
}