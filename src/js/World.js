/*  Authors: RVAZ (Renan Vaz) && Wormwood (Márcio Laubstein)
 *	Version: 4.0
*/

var EventHandler        = require('./util/EventHandler'),
    Device              = require('./util/Device'),
    Events              = require('./util/Events'),
    Collisions          = require('./collision/Collisions'),
    Collide             = require('./collision/Collide'),
    Container           = require('./display/Container'),
    Sprite              = require('./display/Sprite'),
    Camera              = require('./display/Camera'),
    Stage               = require('./display/Stage'),
    Paralax             = require('./display/Paralax'),
    Tween               = require('./tween/Tween'),
    Easings             = require('./tween/Easings'),
    Preloader           = require('./preloader/Preloader'),
    V2                  = require('./V2'),
    TiledIndex          = require('./TiledIndex');

function World (el){
    this._sprites   = [];
    this._stage     = null;
    this._paused    = false;

    this.camera     = new Camera(el);
    this.tween      = new Tween();

    this.settings   = {
        DEBUG_DRAW: true,
        FPS_METER: true
    };

    this.physics = {
        acceleration: new V2(0, 800),
        resistance: new V2(200, 0)
    };

    Object.defineProperty(this, 'paused', {
        get: function(){ return this._paused; },
        set: function(v){
            this._vi_pausedew = v;
        }
    });

    this._stage = new createjs.Stage(this.camera.el);
    this._stage.addChild(this.camera.stage.layer);
}

World.prototype.removeChild = function (s) {
    this._sprites.remove(s);
    this.camera.stage.layer.removeChild(s.layer);
};

World.prototype.addChild = function (s) {
    s._world = this;

    this.camera.stage.layer.addChild(s.layer);

    this._sprites.push(s);
    if (this.settings.DEBUG_DRAW) s.debugDraw();
};

World.prototype.start = function () {
    var _this = this;

    var timestamp = function () {
        return ((window.performance && window.performance.now) ? window.performance.now() : new Date().getTime());
    };

    var frame = function () {
        now = timestamp();
        time = time + Math.min(1, (now - last) / 1000);
        dt = Math.min(1, (now - last) / 1000);
        _this._update(dt);
        _this._render();
        last = now;
        if (fpsmeter) fpsmeter.tick();
        requestAnimationFrame(frame);
    };

    var now,
        dt       = 0,
        time     = 0,
        last     = timestamp(),
        fpsmeter = this.settings.FPS_METER ? new FPSMeter({decimals: 0, graph: true, theme: 'dark', heat:  true, left: 'auto', top: '5px', right: '5px', bottom: 'auto'}) : null;

    // this.TiledIndex = new TiledIndex();

    if (fpsmeter) fpsmeter.tickStart();
    requestAnimationFrame(frame);
};

World.prototype._update = function(dt){
    // Tween
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

    // Sprites
    var sprites = this._sprites, s, acceleration, resistance, others, o, i, j, cMax;

    for (i = 0; i < sprites.length; i++) {
        s = sprites[i];

        s.setCache();

        if (s.tick) {
            s.tick(dt);
        }

        if (s.type === 'dynamic') {
            acceleration = new V2(
                (this.physics.acceleration.x + s.acceleration.x) * dt,
                (this.physics.acceleration.y + s.acceleration.y) * dt
            );

            resistance = new V2(
                (this.physics.resistance.x + s.resistance.x) * dt,
                (this.physics.resistance.y + s.resistance.y) * dt
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

            // others = this.TiledIndex.getOthers(s);

            for (j = 0; j < sprites.length; j++) {
                o = sprites[j];
                if (s !== o) {
                    Collide.check(s, o);
                }
            }
        }
    }

    // Camera
    if (this.camera.following) {
        cMax = new V2(this.camera.stage.width - this.camera.width, this.camera.stage.height - this.camera.height);
        this.camera.x = this.camera.following.x + (this.camera.following.width/2) - (this.camera.width/2);
        this.camera.y = this.camera.following.y + (this.camera.following.height/2) - (this.camera.height/2);

        if (this.camera.x < 0) {
            this.camera.x = 0;
        } else if (this.camera.x > cMax.x) {
            this.camera.x = cMax.x;
        }

        if (this.camera.y < 0) {
            this.camera.y = 0;
        } else if (this.camera.y > cMax.y) {
            this.camera.y = cMax.y;
        }
    }
};

World.prototype._render = function(){
    var s, i;

    for (i = 0; i < this._sprites.length; i++) {
        s = this._sprites[i];

        s.layer.x = Math.round(s.x);
        s.layer.y = Math.round(s.y);
    }

    this.camera.stage.layer.x = Math.round(this.camera.stage.x);
    this.camera.stage.layer.y = Math.round(this.camera.stage.y);

    this._stage.update();
};

EventHandler.init(World.prototype);

module.exports = World;
