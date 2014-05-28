var Sprite      = require('./Sprite'),
    Collisions  = require('../collision/Collisions'),
    Collide     = require('../collision/Collide'),
    V2          = require('../V2');

var Body = Sprite.extend({
    init: function (type, sensor) {
        Body.super(this).init();

        this._debug         = null; // Debug view
        this._tiles         = []; // Aux for collision detection

        // body type properties
        this.type           = type || 'static'; // Values: dynamic or static
        this.sensor         = sensor || false;

        // Position and size (and cache) properties
        this.cache          = {};
        this.cache.x        = this.x;
        this.cache.y        = this.y;
        this.cache.width    = this._width = 0;
        this.cache.height   = this._height = 0;

        // Physics properties
        this.mass           = 0;
        this.bounce         = 0; // Percent value: 0 to 1
        this.velocity       = new V2(0, 0);
        this.acceleration   = new V2(0, 0);
        this.resistance     = new V2(0, 0);

        this.config = {
            minVelocity     : new V2(-99999, -99999),
            maxVelocity     : new V2(99999, 99999),
            plataform       : false //Enabled only collisions at the top
        };

        // Collision properties
        this.collisions     = new Collisions();

        // Game loop function
        this.tick           = null;

        this.__set_x = function(v){
            this._x = v;
        }

        this.__set_y = function(v){
            this._y = v;
        }

        Object.defineProperty(this, 'width', {
            get: function(){ return this._width; },
            set: function(v){
                this._width = v;

                if (this.world && this.world.settings.DEBUG_DRAW) this.debugDraw();
            }
        });

        Object.defineProperty(this, 'height', {
            get: function(){ return this._height; },
            set: function(v){
                this._height = v;

                if (this.world && this.world.settings.DEBUG_DRAW) this.debugDraw();
            }
        });

        Object.defineProperty(this, 'tiles', {
            get: function(){
                var t = this._tiles;

                for(var i = 0; i < this.childs.length; i++){
                    for(var j = 0; j < this.childs[i]._tiles.length; j++){
                        t.push(this.childs[i]._tiles[j]);
                    }
                }

                return t;
            }
        });

        Object.defineProperty(this, 'main', {
            get: function(){
                var p = this, c, main;

                do {
                    c = p;

                    // Verify if is a body
                    if (typeof c.type !== 'undefined') {
                        main = c;
                    }

                    p = c.parent;
                } while (p);

                return main;
            }
        });

        this.on('added', function () {
            if (this.world.settings.DEBUG_DRAW) {
                this.debugDraw();
            }

            this.world._bodies.push(this);
        });

        this.on('removed', function () {
            this.world._bodies.remove(this);
        });
    },
    setCache: function () {
        this.cache.x        = this.x;
        this.cache.y        = this.y;
        this.cache.width    = this.width;
        this.cache.height   = this.height;
    },
    debugDraw: function () {
        if (!this._debug) {
            this._debug = new createjs.Shape();
            this._container.addChild(this._debug);
        }

        this._debug.graphics.c().f('#000000').dr(0, 0, this.width, this.height);
        this._debug.alpha = 0.5;
        this._debug.cache(0, 0, this.width, this.height);
    }
});

Body.tick = function (dt, world) {
    var s, acceleration, resistance, others, o, i, j, bodies = world._bodies;

    for (i = 0; i < bodies.length; i++) {
        s = bodies[i];

        s.setCache();

        if (s.tick) {
            s.tick(dt);
        }

        if (s.type === 'dynamic') {
            acceleration = new V2(
                (s.world.physics.acceleration.x + s.acceleration.x) * dt,
                (s.world.physics.acceleration.y + s.acceleration.y) * dt
            );

            resistance = new V2(
                (s.world.physics.resistance.x + s.resistance.x) * dt,
                (s.world.physics.resistance.y + s.resistance.y) * dt
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

            // others = s.world.camera.stage.tiles.getOthers(s);

            for (j = 0; j < bodies.length; j++) {
                o = bodies[j];
                if (s !== o) {
                    Collide.check(s, o);
                }
            }
        }
    }
}

module.exports = Body;
