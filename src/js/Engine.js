/*  Authors: RVAZ (Renan Vaz) && Wormwood (Márcio Laubstein)
 *	Version: 4.0
*/

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

if(!Array.prototype.remove) {
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
}


var EventHandler        = require('./util/EventHandler'),
    Device              = require('./util/Device'),
    Events              = require('./util/Events'),
    V2                  = require('./util/V2'),
    Collisions          = require('./collision/Collisions'),
    Collide             = require('./collision/Collide'),
    Container           = require('./display/Container'),
    Sprite              = require('./display/Sprite'),
    Camera              = require('./display/Camera'),
    Stage               = require('./display/Stage'),
    Paralax             = require('./display/Paralax'),
    Tween               = require('./tween/Tween'),
    Preloader           = require('./preloader/Preloader'),
    TiledIndex          = require('./TiledIndex');

var _sprites    = [],
    _stage      = null;

var _update = function(dt){
    var sprites = _sprites, s, acceleration, resistance, others, o, i, j, cMax;

    for (i = 0; i < sprites.length; i++) {
        s = sprites[i];

        s.setCache();

        if (s.type === 'dynamic') {

            acceleration = new V2(
                (window.Phyz.Physics.acceleration.x + s.acceleration.x) * dt,
                (window.Phyz.Physics.acceleration.y + s.acceleration.y) * dt
            );

            resistance = new V2(
                (window.Phyz.Physics.resistance.x + s.resistance.x) * dt,
                (window.Phyz.Physics.resistance.y + s.resistance.y) * dt
            );

            s.velocity.add(acceleration);

            if (Math.abs(s.velocity.x) > resistance.x) {
                s.velocity.x += (s.velocity.x > 0) ? -resistance.x : resistance.x;
            } else {
                s.velocity.x = 0;
            }

            if (Math.abs(s.velocity.y) > resistance.y) {
                s.velocity.y += (s.velocity.y > 0) ? -resistance.y : resistance.y;
            } else {
                s.velocity.y = 0;
            }

            s.velocity.x = (s.velocity.x < s.config.minVelocity.x) ? s.config.minVelocity.x : s.velocity.x;
            s.velocity.y = (s.velocity.y < s.config.minVelocity.y) ? s.config.minVelocity.y : s.velocity.y;
            s.velocity.x = (s.velocity.x > s.config.maxVelocity.x) ? s.config.maxVelocity.x : s.velocity.x;
            s.velocity.y = (s.velocity.y > s.config.maxVelocity.y) ? s.config.maxVelocity.y : s.velocity.y;

            s.y += s.velocity.y * dt;
            s.x += s.velocity.x * dt;

            others = window.Phyz.TiledIndex.getOthers(s);

            for (j = 0; j < sprites.length; j++) {
                o = sprites[j];
                if (s !== o) {
                    Collide.check(s, o);
                }
            }

            if (s.tick) {
                s.tick(dt);
            }
        }
    }

    if (window.Phyz.Camera.following) {
        cMax = new V2(window.Phyz.Stage.width - window.Phyz.Camera.width, window.Phyz.Stage.height - window.Phyz.Camera.height);
        window.Phyz.Camera.x = window.Phyz.Camera.following.x + (window.Phyz.Camera.following.width/2) - (window.Phyz.Camera.width/2);
        window.Phyz.Camera.y = window.Phyz.Camera.following.y + (window.Phyz.Camera.following.height/2) - (window.Phyz.Camera.height/2);

        if (window.Phyz.Camera.x < 0) {
            window.Phyz.Camera.x = 0;
        } else if (window.Phyz.Camera.x > cMax.x) {
            window.Phyz.Camera.x = cMax.x;
        }

        if (window.Phyz.Camera.y < 0) {
            window.Phyz.Camera.y = 0;
        } else if (window.Phyz.Camera.y > cMax.y) {
            window.Phyz.Camera.y = cMax.y;
        }
    }

    window.Phyz.Stage.x = -window.Phyz.Camera.x;
    window.Phyz.Stage.y = -window.Phyz.Camera.y;
};

var _render = function(){
    var s, i;

    for (i = 0; i < _sprites.length; i++) {
        s = _sprites[i];

        s.container.x = Math.round(s.x);
        s.container.y = Math.round(s.y);
    }

    window.Phyz.Stage.container.x = Math.round(window.Phyz.Stage.x);
    window.Phyz.Stage.container.y = Math.round(window.Phyz.Stage.y);

    _stage.update();
};

var Phyz = {
    Settings: {
        DEBUG_DRAW: true
    },
    Physics: {
        acceleration: new V2(0, 800),
        resistance: new V2(0, 200)
    },
    TiledIndex: null,
    Stage: new Stage(),
    Camera: new Camera(),
    Preloader: new Preloader(),
    Entity: {}, //Helper of instance Objects
    paused: false,

    start: function () {
        var timestamp = function () {
            return ((window.performance && window.performance.now) ? window.performance.now() : new Date().getTime());
        };

        var frame = function () {
            now = timestamp();
            time = time + Math.min(1, (now - last) / 1000);
            dt = Math.min(1, (now - last) / 1000);
            _update(dt);
            _render();
            last = now;
            if (fpsmeter) fpsmeter.tick();
            requestAnimationFrame(frame);
        };

        var now,
            dt       = 0,
            time     = 0,
            last     = timestamp(),
            fpsmeter = window.Phyz.Settings.DEBUG_DRAW ? new FPSMeter({decimals: 0, graph: true, theme: 'dark', heat:  true, left: 'auto', top: '5px', right: '5px', bottom: 'auto'}) : null;

        this.TiledIndex = new TiledIndex();

        _stage = new createjs.Stage(this.Camera.el);
        _stage.addChild(this.Stage.container);

        if (fpsmeter) fpsmeter.tickStart();
        requestAnimationFrame(frame);
    },

    remove: function (sprite) {
        _sprites = Arr.remove(_sprites, sprite);
        this.Stage.getLayer('main').removeChild(sprite);
    },

    add: function (sprite) {
        _sprites.push(sprite);
        this.Stage.getLayer('main').addChild(sprite);
    },

    get sprites(){
        return _sprites;
    }
};

EventHandler.init(Phyz);

Phyz.Stage.addLayer('main', new Container());

module.exports = window.Phyz;
