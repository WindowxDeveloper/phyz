/*  Authors: RVAZ (Renan Vaz) && Wormwood (Márcio Laubstein)
 *	Version: 4.0
*/

var EventHandler        = require('./util/EventHandler'),
    Camera              = require('./display/Camera'),
    Paralax             = require('./display/Paralax'),
    Tween               = require('./tween/Tween'),
    V2                  = require('./V2');

var timestamp = function () {
    return ((window.performance && window.performance.now) ? window.performance.now() : new Date().getTime());
};

function World (el, layers){
    this._bodies   = [];
    this._tweens    = [];
    this._stage     = null;
    this._paused    = false;

    this.camera     = new Camera(this, el, layers);

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
    Tween.tick(dt, this);
    Body.tick(dt, this);
    Camera.tick(dt, this);
};

World.prototype._render = function(){
    var s, i;

    for (i = 0; i < this._bodies.length; i++) {
        s = this._bodies[i];

        s._container.x = Math.round(s.x);
        s._container.y = Math.round(s.y);
    }

    this.camera.stage._container.x = Math.round(this.camera.stage.x);
    this.camera.stage._container.y = Math.round(this.camera.stage.y);

    this._stage.update();
};

EventHandler.init(World.prototype);

module.exports = World;
