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

var timestamp = function () {
    return ((window.performance && window.performance.now) ? window.performance.now() : new Date().getTime());
};

function World (el, layers){
    this._sprites   = [];
    this._tweens    = [];
    this._stage     = null;
    this._paused    = false;

    this.camera     = new Camera(el, layers);

    this.settings   = {
        DEBUG_DRAW: true,
        FPS_METER: true
    };

    this.physics = {
        acceleration: new V2(0, 800),
        resistance: new V2(200, 0)
    };

    this.time = {
        now:    0,
        dt:     0,
        time:   0,
        last:   timestamp()
    };

    Object.defineProperty(this, 'paused', {
        get: function(){ return this._paused; },
        set: function(v){
            this._paused = v;

            if (!this._paused) {
                this.time.last = this.time.now;
            }
        }
    });

    this._fpsmeter = this.settings.FPS_METER ? new FPSMeter({decimals: 0, graph: true, theme: 'dark', heat:  true, left: 'auto', top: '5px', right: '5px', bottom: 'auto'}) : null;
    this._stage = new createjs.Stage(this.camera.el);
    this._stage.addChild(this.camera.stage._container);
}

World.prototype.removeChild = function (s) {
    this._sprites.remove(s);
    this.camera.stage._container.removeChild(s._container);
};

World.prototype.addChild = function (s) {
    s._world = this;

    this.camera.stage._container.addChild(s._container);

    this._sprites.push(s);
    if (this.settings.DEBUG_DRAW) s.debugDraw();
};

World.prototype.addTween = function (t) {
    this._tweens.push(t);
};

World.prototype.removeTween = function (t) {
    this._tweens.remove(t);
};

World.prototype.removeTweensOf = function (o) {
    var i, tweens = this._tweens, len = tweens.length, t;

    for (i = 0; i < len; i++) {
        t = tweens[i];
        if (t.o === o) {
            this._tweens.remove(t);
        }
    }
};

World.prototype.start = function () {
    var _this = this;

    var _frame = function(){
        if (!_this.paused) {
            _this.time.now = timestamp();
            _this.time.dt = Math.min(1, (_this.time.now - _this.time.last) / 1000);
            _this.time.time = _this.time.time + _this.time.dt;
            _this._update(_this.time.dt);
            _this._render();
            _this.time.last = _this.time.now;
            if (_this._fpsmeter) _this._fpsmeter.tick();
        }
        requestAnimationFrame(_frame);
    }

    if (this._fpsmeter) this._fpsmeter.tickStart();
    requestAnimationFrame(_frame);
};

World.prototype._update = function(dt){

    Tween.tick(dt, this._tweens);
    Sprite.tick(dt, this._sprites);
    Camera.tick(dt, this.camera);
};

World.prototype._render = function(){
    var s, i;

    for (i = 0; i < this._sprites.length; i++) {
        s = this._sprites[i];

        s._container.x = Math.round(s.x);
        s._container.y = Math.round(s.y);
    }

    this.camera.stage._container.x = Math.round(this.camera.stage.x);
    this.camera.stage._container.y = Math.round(this.camera.stage.y);

    this._stage.update();
};

EventHandler.init(World.prototype);

module.exports = World;
