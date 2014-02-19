/*  Authors: RVAZ (Renan Vaz) && Wormwood (Márcio Laubstein)
 *	Version: 4.0
*/

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

function World (el){
    this._sprites   = [];
    this._stage     = null;
    this._paused    = false;

    this.camera     = new Camera(el);

    this.Settings   = {
        DEBUG_DRAW: true,
        FPS_METER: true
    };

    this.Physics = {
        acceleration: new V2(0, 800),
        resistance: new V2(0, 200)
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

World.prototype.remove = function (s) {
    this._sprites.remove(sprite);
    this.Stage.removeChild(sprite);
};

World.prototype.add = function (sprite) {
    _sprites.push(s);
    s._world = this;

    this.Stage.addChild(s);
};

World.prototype.start = function () {
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
        fpsmeter = this.Settings.FPS_METER ? new FPSMeter({decimals: 0, graph: true, theme: 'dark', heat:  true, left: 'auto', top: '5px', right: '5px', bottom: 'auto'}) : null;

    this.TiledIndex = new TiledIndex();

    if (fpsmeter) fpsmeter.tickStart();
    requestAnimationFrame(frame);
};

var _update = function(dt){
    var sprites = _sprites, s, acceleration, resistance, others, o, i, j, cMax;

    for (i = 0; i < sprites.length; i++) {
        s = sprites[i];

        s.setCache();

        if (s.type === 'dynamic') {

            acceleration = new V2(
                (this.Physics.acceleration.x + s.acceleration.x) * dt,
                (this.Physics.acceleration.y + s.acceleration.y) * dt
            );

            resistance = new V2(
                (this.Physics.resistance.x + s.resistance.x) * dt,
                (this.Physics.resistance.y + s.resistance.y) * dt
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

            others = this.TiledIndex.getOthers(s);

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

    if (this.Camera.following) {
        cMax = new V2(this.Stage.width - this.Camera.width, this.Stage.height - this.Camera.height);
        this.Camera.x = this.Camera.following.x + (this.Camera.following.width/2) - (this.Camera.width/2);
        this.Camera.y = this.Camera.following.y + (this.Camera.following.height/2) - (this.Camera.height/2);

        if (this.Camera.x < 0) {
            this.Camera.x = 0;
        } else if (this.Camera.x > cMax.x) {
            this.Camera.x = cMax.x;
        }

        if (this.Camera.y < 0) {
            this.Camera.y = 0;
        } else if (this.Camera.y > cMax.y) {
            this.Camera.y = cMax.y;
        }
    }

    this.Stage.x = -this.Camera.x;
    this.Stage.y = -this.Camera.y;
};

var _render = function(){
    var s, i;

    for (i = 0; i < _sprites.length; i++) {
        s = _sprites[i];

        s.container.x = Math.round(s.x);
        s.container.y = Math.round(s.y);
    }

    this.Stage.container.x = Math.round(this.Stage.x);
    this.Stage.container.y = Math.round(this.Stage.y);

    _stage.update();
};

EventHandler.init(World.prototype);

Phyz.Stage.addLayer('main', new Container());

module.exports = Phyz;
