var Container = require('./Container');

var Sprite = function (type, sensor) {
    Container.apply(this);

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
        plataform       : false, //Enabled only collisions at the top
        collide         : false //Enabled only collisions at the top
    };

    this.tiles          = [];
    this.collisions     = new Collisions();

    this.tick           = null;

    this._view          = null;
    this._debug         = null;

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

            if (Phyz.Settings.DEBUG_DRAW) this.debugDraw();
        }
    });

    Object.defineProperty(this, 'height', {
        get: function(){ return this._height; },
        set: function(v){
            this._height = v;

            if (Phyz.Settings.DEBUG_DRAW) this.debugDraw();
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
    // this.debug.cache(-25, -25, 50, 50);
};

Sprite.prototype.getGlobalPosition = function () {
    var pos = new V2(this.x, this.y),
        p   = this.parent;

    if (p) {
        pos.x += p.getGlobalPosition().x;
        pos.y += p.getGlobalPosition().y;
    }

    return pos;
};

Sprite.prototype.getRoot = function () {
    var p = this,
        s = this.parent;

    if (s) {
        p = s.getRoot();
    }

    return p;
};

Sprite.prototype.getTiles = function () {
    var t = this.tiles;

    for(var i = 0; i < this.childs.length; i++){
        for(var j = 0; j < this.childs[i].tiles.length; j++){
            t.push(this.childs[i].tiles[j]);
        }
    }

    return t;
};

Sprite.prototype.setCache = function () {
    this.cache.x        = this.x;
    this.cache.y        = this.y;
    this.cache.width    = this.width;
    this.cache.height   = this.height;
};

module.exports = Sprite;
