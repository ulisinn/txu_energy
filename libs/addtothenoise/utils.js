/**
 * Created with JetBrains WebStorm.
 * User: ulrichsinn
 * Date: 11/09/2012
 * Time: 8:06
 * To change this template use File | Settings | File Templates.
 */

var ADDTOTHENOISE_UTILS = ADDTOTHENOISE_UTILS || {};

ADDTOTHENOISE_UTILS.getRelative = function (val, max, min) {
    var percent;
    percent = (val - min) / (max - min);
    return percent;
};
//
ADDTOTHENOISE_UTILS.getAbsolute = function (perc, max_abs, min_abs) {
    var absolute;
    absolute = (perc * (max_abs - min_abs)) + min_abs;
    return absolute;
};

//GET FORMATTED TIME

ADDTOTHENOISE_UTILS.getFormattedTime = function (_elapsedTime) {
    var formattedTime = "",
        _ms,
        _sec,
        _min,
        _hr,
        _currentDate = new Date(null, null, null, null, null, null, _elapsedTime);

    _ms = (_currentDate.getMilliseconds() < 100) ? "0" + _currentDate.getMilliseconds().toString() : _currentDate.getMilliseconds().toString();
    _ms = (_currentDate.getMilliseconds() < 10) ? "00" + _currentDate.getMilliseconds().toString() : _currentDate.getMilliseconds().toString();
    _sec = (_currentDate.getSeconds() < 10) ? "0" + _currentDate.getSeconds().toString() : _currentDate.getSeconds().toString();
    _min = (_currentDate.getMinutes() < 10) ? "0" + _currentDate.getMinutes().toString() : _currentDate.getMinutes().toString();
    _hr = (_currentDate.getHours() < 10) ? "0" + _currentDate.getHours().toString() : _currentDate.getHours().toString();
    formattedTime = _hr + ":" + _min + ":" + _sec + ":" + _ms;
    //
    return formattedTime;
}

ADDTOTHENOISE_UTILS.getFormattedTimeInSeconds = function (_elapsedTime) {
    var formattedTime = "",
        _ms,
        _sec,
        _min = 0,
        _hr,
        _currentDate = new Date(null, null, null, null, null, null, _elapsedTime);
    _sec = _currentDate.getSeconds();
    if (_currentDate.getMinutes() > 0) {
        _sec += (_currentDate.getMinutes() * 60)
    }
    _sec = (_sec < 10) ? "0" + _sec.toString() : _sec.toString();
    formattedTime = _sec;
    //
    return formattedTime;
}
ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds = function (_elapsedTime) {
    var formattedTime = "",
        _ms,
        _sec,
        _min = 0,
        _hr,
        _currentDate = new Date(null, null, null, null, null, null, _elapsedTime);
    _sec = _currentDate.getSeconds();

    if (_currentDate.getMinutes() > 0) {
        _min  = _currentDate.getMinutes()
    }
    _min = (_min < 10) ? "0" + _min : _min;
    _sec = (_sec < 10) ? "0" + _sec.toString() : _sec.toString();
    formattedTime = _min + ":" + _sec;
    //
    return formattedTime;
}

ADDTOTHENOISE_UTILS.windowToCanvas = function (element, x, y, rounded) {
    rounded = (rounded == undefined) ? true : rounded;
    var pos,
        w,
        h,
        bbox;

    w = (element.width) ? element.width : element.clientWidth;
    h = (element.height) ? element.height : element.clientHeight;

    bbox = element.getBoundingClientRect();

//    window.log("w", w, "h", h, "bboxLeft", bbox.left, "bboxTop", bbox.top);
    pos = { x: x - bbox.left * (w / bbox.width),
        y: y - bbox.top * (h / bbox.height)
    };

    if (rounded == true) {
        pos.x = parseInt(pos.x.toFixed());
        pos.y = parseInt(pos.y.toFixed());
    }
    return pos;
};

ADDTOTHENOISE_UTILS.getWindowSize = function () {
    var obj = {width: window.innerWidth, height: window.innerHeight};
    return obj;
}

ADDTOTHENOISE_UTILS.getWindowCenter = function () {
    var obj = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    return obj;
}

ADDTOTHENOISE_UTILS.drawBox = function (ctx, x, y, w, h, rgb, alpha, clockwise) {
    var topLeftX, topRightX, bottomRightX, bottomLeftX, topLeftY, topRightY, bottomRightY, bottomLeftY;

    topLeftX = x;
    topRightX = x + w;
    bottomRightX = x + w;
    bottomLeftX = x;
    topLeftY = y;
    topRightY = y;
    bottomRightY = y + h;
    bottomLeftY = y + h;
    clockwise = (clockwise == true) ? clockwise : false;

    var o = {};

    o.topLeftX = topLeftX;
    o.topRightX = topRightX;
    o.bottomRightX = bottomRightX;
    o.bottomLeftX = bottomLeftX;

    o.topLeftY = topLeftX;
    o.topRightY = topRightX;
    o.bottomRightY = bottomRightX;
    o.bottomLeftY = bottomLeftX;

    o.width = w;
    o.height = h;
    o.fillStyle = rgb;
    o.alpha = alpha;
    o.clockwise = clockwise;


    if (ctx) {
        ctx.save();
        ctx.fillStyle = rgb;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.moveTo(topLeftX, topLeftY);
        if (clockwise) {
            ctx.lineTo(topRightX, topRightY);
            ctx.lineTo(bottomRightX, bottomRightY);
            ctx.lineTo(bottomLeftX, bottomLeftY);
            ctx.lineTo(topLeftX, topLeftY);
        } else {
            ctx.lineTo(bottomLeftX, bottomLeftY);
            ctx.lineTo(bottomRightX, bottomRightY);
            ctx.lineTo(topRightX, topRightY);
            ctx.lineTo(topLeftX, topLeftY);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    //
    return o;
};

//window.log("ADDTOTHENOISE_UTILS", ADDTOTHENOISE_UTILS);

window.requestNextAnimationFrame =
    (function () {
        var originalWebkitRequestAnimationFrame = undefined,
            wrapper = undefined,
            callback = undefined,
            geckoVersion = 0,
            userAgent = navigator.userAgent,
            index = 0,
            self = this;

        // Workaround for Chrome 10 bug where Chrome
        // does not pass the time to the animation function

        if (window.webkitRequestAnimationFrame) {
            // Define the wrapper

            wrapper = function (time) {
                if (time === undefined) {
                    time = +new Date();
                }
                self.callback(time);
            };

            // Make the switch

            originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

            window.webkitRequestAnimationFrame = function (callback, element) {
                self.callback = callback;

                // Browser calls the wrapper and wrapper calls the callback

                originalWebkitRequestAnimationFrame(wrapper, element);
            }
        }

        // Workaround for Gecko 2.0, which has a bug in
        // mozRequestAnimationFrame() that restricts animations
        // to 30-40 fps.

        if (window.mozRequestAnimationFrame) {
            // Check the Gecko version. Gecko is used by browsers
            // other than Firefox. Gecko 2.0 corresponds to
            // Firefox 4.0.

            index = userAgent.indexOf('rv:');

            if (userAgent.indexOf('Gecko') != -1) {
                geckoVersion = userAgent.substr(index + 3, 3);

                if (geckoVersion === '2.0') {
                    // Forces the return statement to fall through
                    // to the setTimeout() function.

                    window.mozRequestAnimationFrame = undefined;
                }
            }
        }

        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||

            function (callback, element) {
                var start,
                    finish;

                window.setTimeout(function () {
                    start = +new Date();
                    callback(start);
                    finish = +new Date();

                    self.timeout = 1000 / 60 - (finish - start);

                }, self.timeout);
            };
    })();
