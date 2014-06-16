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

Tween.prototype.clear = function (o) {
    var i, tweens = o.world._tweens, len = tweens.length, t;

    for (i = 0; i < len; i++) {
        t = tweens[i];
        if (t.o === o) {
            o.world._tweens.remove(t);
        }
    }
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

    o.world._tweens.push(t);
};

var t = new Tween();

t.tick = function (dt, world) {
    var i, j, t, tweens = world._tweens, len = tweens.length;

    for (i = 0; i < len; i++) {
        t = tweens[i];

        if (t.dt === t.p.time) {
            if (t.from.x !== undefined) { t.o.velocity.x = 0; }
            if (t.from.y !== undefined) { t.o.velocity.y = 0; }

            if (t.p.oncomplete) {
                t.p.oncomplete.apply(t.o);
            }

            world._tweens.remove(t);
        } else {
            t.dt += dt;
            t.dt = (t.dt > t.p.time ? t.p.time : t.dt);

            if (t.dt > 0) {
                if (t.from.x !== undefined) { t.o.velocity.x = t.o.x; }
                if (t.from.y !== undefined) { t.o.velocity.y = t.o.y; }

                for (j in t.from) {
                    t.o[j] = Easings[t.p.ease](t.dt, t.from[j], t.to[j] - t.from[j], t.p.time);
                }

                if (t.from.x !== undefined) { t.o.velocity.x = (t.o.x - t.o.velocity.x) / dt; }
                if (t.from.y !== undefined) { t.o.velocity.y = (t.o.y - t.o.velocity.y) / dt; }
            }
        }
    }
}

module.exports = t;
