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
    return this.create(o, props, params, false);
};

Tween.prototype.from = function (o, props, params) {
    return this.create(o, props, params, true);
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

    return t;
};

Tween.tick = function () {
    var i, j, tweens = this.tween._tweens, len = tweens.length, t;

    for (i = 0; i < len; i++) {
        t = tweens[i];

        t.dt += dt;
        t.dt = (t.dt > t.p.time ? t.p.time : t.dt);

        if (t.dt > 0) {
            for (j in t.from) {
                t.o[j] = Easings[t.p.ease](t.dt, t.from[j], t.to[j] - t.from[j], t.p.time);
            }
        }

        if (t.dt === t.p.time) {
            if (t.p.oncomplete) {
                t.p.oncomplete.apply(t.o);
            }
            this.tween._tweens.remove(t);
        }
    }
}

module.exports = Tween;
