/**
 * Created by asim on 4/5/17.
 */
function Util() {}

Util.calculateDistance = function (x1, y1, x2, y2) {

    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

Util.getRandomInt = function(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
};
