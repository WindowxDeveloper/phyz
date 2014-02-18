/*  Authors: RVAZ (Renan Vaz) && Wormwood (Márcio Laubstein)
 *	Version: 4.0
*/


var Engine = (function(){
    var _sprites    = [],
        _stage      = null;

    var _update = function(dt){
        var sprites = _sprites, s, acceleration, resistance, others, o, i, j, cMax;

        for (i = 0; i < sprites.length; i++) {
            s = sprites[i];

            s.setCache();

            if (s.type === 'dynamic') {

                acceleration = new V2(
                    (Engine.Physics.acceleration.x + s.acceleration.x) * dt,
                    (Engine.Physics.acceleration.y + s.acceleration.y) * dt
                );

                resistance = new V2(
                    (Engine.Physics.resistance.x + s.resistance.x) * dt,
                    (Engine.Physics.resistance.y + s.resistance.y) * dt
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

                others = Engine.TiledIndex.getOthers(s);

                for (j = 0; j < sprites.length; j++) {
                    o = sprites[j];
                    if (s !== o) {
                        Collision.check(s, o);
                    }
                }

                if (s.tick) {
                    s.tick(dt);
                }
            }
        }

        if (Engine.Camera.following) {
            cMax = new V2(Engine.Stage.width - Engine.Camera.width, Engine.Stage.height - Engine.Camera.height);
            Engine.Camera.x = Engine.Camera.following.x + (Engine.Camera.following.width/2) - (Engine.Camera.width/2);
            Engine.Camera.y = Engine.Camera.following.y + (Engine.Camera.following.height/2) - (Engine.Camera.height/2);

            if (Engine.Camera.x < 0) {
                Engine.Camera.x = 0;
            } else if (Engine.Camera.x > cMax.x) {
                Engine.Camera.x = cMax.x;
            }

            if (Engine.Camera.y < 0) {
                Engine.Camera.y = 0;
            } else if (Engine.Camera.y > cMax.y) {
                Engine.Camera.y = cMax.y;
            }
        }

        Engine.Stage.x = -Engine.Camera.x;
        Engine.Stage.y = -Engine.Camera.y;
    };

    var _render = function(){
        var s, i;

        for (i = 0; i < _sprites.length; i++) {
            s = _sprites[i];

            s.container.x = Math.round(s.x);
            s.container.y = Math.round(s.y);
        }

        Engine.Stage.container.x = Math.round(Engine.Stage.x);
        Engine.Stage.container.y = Math.round(Engine.Stage.y);

        _stage.update();
    };

    var Engine = {
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
                fpsmeter = Engine.Settings.DEBUG_DRAW ? new FPSMeter({decimals: 0, graph: true, theme: 'dark', heat:  true, left: 'auto', top: '5px', right: '5px', bottom: 'auto'}) : null;

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

    EventHandler.init(Engine);

    Engine.Stage.addLayer('main', new Layer());

    return Engine;
})();
