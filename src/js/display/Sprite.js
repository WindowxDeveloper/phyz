var Container   = require('./Container'),
    Collisions  = require('../collision/Collisions'),
    V2          = require('../V2');

var Sprite = function (type, sensor) {
    Container.apply(this);

    this._view          = null;
    this._debug         = null;
    this._world         = null;

    this.type           = type || 'static';
    this.sensor         = sensor || false;

    this.cache          = {};
    this.cache.x        = this.x = 0;
    this.cache.y        = this.y = 0;
    this.cache.width    = this._width = 0;
    this.cache.height   = this._height = 0;

    this.velocity       = new V2(0, 0);
    this.acceleration   = new V2(0, 0);
    this.resistance     = new V2(0, 0);

    this.config = {
        minVelocity     : new V2(-99999, -99999),
        maxVelocity     : new V2(99999, 99999),
        plataform       : false //Enabled only collisions at the top
    };

    this.collisions     = new Collisions();
    this.tiles          = [];

    this.tick           = null;

    Object.defineProperty(this, 'view', {
        get: function(){ return this._view; },
        set: function(v){
            if (this._view) {
                this.layer.removeChild(this._view);
            }

            this._view = v;
            this.layer.addChild(this._view);
        }
    });

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

    Object.defineProperty(this, 'global', {
        get: function(){
            var pos = new V2(this.x, this.y),
                p   = this.parent;

            if (p) {
                pos.x += p.global.x;
                pos.y += p.global.y;
            }

            return pos;
        }
    });

    Object.defineProperty(this, 'root', {
        get: function(){
            var r = this,
                p = this.parent;

            if (p) {
                r = p.root;
            }

            return r;
        }
    });

    Object.defineProperty(this, 'world', {
        get: function(){
            return this.root._world;
        }
    });

    Object.defineProperty(this, 'all_childrens_tiles', {
        get: function(){
            var t = this.tiles;

            for(var i = 0; i < this.childs.length; i++){
                for(var j = 0; j < this.childs[i].tiles.length; j++){
                    t.push(this.childs[i].tiles[j]);
                }
            }

            return t;
        }
    });
};

Sprite.prototype = new Container();

Sprite.prototype.debugDraw = function () {
    if (!this._debug) {
        this._debug = new createjs.Shape();
        this.layer.addChild(this._debug);
    }

    this._debug.graphics.c().f('#000000').dr(0, 0, this.width, this.height);
    this._debug.alpha = 0.5;
    this._debug.cache(0, 0, this.width, this.height);
};

Sprite.prototype.setCache = function () {
    this.cache.x        = this.x;
    this.cache.y        = this.y;
    this.cache.width    = this.width;
    this.cache.height   = this.height;
};

module.exports = Sprite;
