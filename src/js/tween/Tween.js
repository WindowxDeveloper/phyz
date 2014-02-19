var EventHandler = require('../util/EventHandler');
var Easings = require('./Easings');

/*
 * Params
 * o => Object
 * p => params
 * f => from
 * t => to
 */
function TweenData (o, p, f, t) {
    this.dt = 0;
    this.o = o;
    this.p = p;
    this.from = f;
    this.to = t;
}

EventHandler.init(TweenData.prototype);

function Tween () {
    this.tweens = [];
    this.ease = 'default';
}


Tween.prototype.to = function (o, props, params) {
    if (typeof params === 'number') {
        params = {time: params};
    }

    params.delay    = p.delay || 0;
    params.ease     = p.ease || this.ease;

    var from = {},
        to = {},
        t, i;

    for (i in props) {
        from[i] = o[i];
        to[i] = props[i];
    }

    t = new TweenData(o, from, to);

    if (params.onComplete) t.on('complete', params.onComplete);

    this.tweens.push(t);
};

Tween.prototype.from = function (o, props, params) {
    if (typeof params === 'number') {
        params = {time: params};
    }

    params.delay    = p.delay || 0;
    params.ease     = p.ease || this.ease;

    var from = {},
        to = {},
        t, i;

    for (i in props) {
        from[i] = props[i];
        to[i] = o[i];
    }

    t = new TweenData(o, from, to);

    if (params.onComplete) t.on('complete', params.onComplete);

    this.tweens.push(t);
};

Ticker.add(function(){

});

module.exports = Tween;