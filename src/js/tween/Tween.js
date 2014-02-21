var Easings = require('./Easings');

/*
 * Params
 * o => Object
 * p => params
 * f => from
 * t => to
 */
function TweenData (o, p, f, t) {
    this.dt = -p.delay;
    this.o = o;
    this.p = p;
    this.from = f;
    this.to = t;
}

function Tween () {
    this._tweens = [];
    this.defaults = {
        time: 0.6,
        delay: 0,
        ease: 'linear',
    }
}

Tween.prototype.to = function (o, props, params) {
    this.create(o, props, params, false);
};

Tween.prototype.from = function (o, props, params) {
    this.create(o, props, params, true);
};

Tween.prototype.create = function (o, props, params, isFrom) {
     if (typeof params === 'number') {
        params = {time: params};
    } else if (typeof params === 'undefined') {
        params = {};
    }

    params.time     = params.time || this.defaults.time;
    params.delay    = params.delay || this.defaults.delay;
    params.ease     = params.ease || this.defaults.ease;

    var from = {},
        to = {},
        t, i;

    for (i in props) {
        if (isFrom) {
            from[i] = props[i];
            to[i]   = o[i];
        } else {
            to[i]   = props[i];
            from[i] = o[i];
        }
    }

    t = new TweenData(o, params, from, to);

    this._tweens.push(t);
};

Tween.prototype.stop = function (o) {
    var i, tweens = this._tweens, len = tweens.length, t;

    for (i = 0; i < len; i++) {
        t = tweens[i];
        if (t.o === o) {
            this._tweens.remove(t);
        }
    }
};

module.exports = Tween;
