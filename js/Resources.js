/**
 * Created by Asim on 4/20/2017.
 */
function Resources(){

    var _this;

    this._init = function () {

        _this = this;
        this.images = [];
        this.audios = [];
        this.imageLoadedCount = 0;
        this.audioLoadedCount = 0;
    };

    this.addImage = function (name, src) {

        var image = new Image();
        image.onload = function () {

            _this.imageLoadedCount += 1;
        };
        image.src = src;
        _this.images[name] = image;
    };

    this.getImage = function (name) {

        return _this.images[name];
    };

    this.addAudio = function (name, src) {

        var audio = new Audio(src);
        _this.audios[name] = audio;
    };

    this.getAudio = function (name) {

        return _this.audios[name];
    };

    this._init();
}