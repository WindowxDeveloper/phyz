//(function(){var e = 'sprite,shape,spritesheet,player'.split(','), i=e.length; while(i--){document.createElement(e[i])}})();

var DisplayObject = (function(){
    function DisplayObject () {
        this.container    = new createjs.Container();
        this.parent       = null;
        this.event        = null;
        this.childs       = [];
    }

    DisplayObject.prototype.addChild = function(child){
        child.parent = this;

        if (this.container && child.container) {
            this.container.addChild(child.container);
        }

        this.childs.push(child);

        this.trigger('add', child);
        child.trigger('added', this);
    };

    DisplayObject.prototype.removeChild = function(child){
        if (this.container && child.container) {
            this.container.removeChild(child.container);
        }

        this.childs.remove(child);

        this.trigger('remove', child);
        child.trigger('removed', this);
    };

    EventHandler.init(DisplayObject.prototype);

    return DisplayObject;
})();

/*
* Sprite
* @param el (DOM element)
*/
var Sprite = (function(){
    var Sprite = function (type, sensor) {
        DisplayObject.apply(this);

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
                    this.container.removeChild(this._view);
                }

                this._view = v;
                this.container.addChild(this._view);
            }
        });

        Object.defineProperty(this, 'width', {
            get: function(){ return this._width; },
            set: function(v){
                this._width = v;

                if (Engine.Settings.DEBUG_DRAW) this.debugDraw();
            }
        });

        Object.defineProperty(this, 'height', {
            get: function(){ return this._height; },
            set: function(v){
                this._height = v;

                if (Engine.Settings.DEBUG_DRAW) this.debugDraw();
            }
        });
    };

    Sprite.prototype = new DisplayObject();

    Sprite.prototype.debugDraw = function () {
        if (!this._debug) {
            this._debug = new createjs.Shape();
            this.container.addChild(this._debug);
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

    return Sprite;
})();

var Camera = (function(){
    function Camera (){
        this.el = null;
        this.following = null;
        this.x = 0;
        this.y = 0;
        this._width = 0;
        this._height = 0;

        Object.defineProperty(this, 'width', {
            get: function(){ return this._width; },
            set: function(v){
                this._width = v;
                this.el.width = this._width;
            }
        });

        Object.defineProperty(this, 'height', {
            get: function(){ return this._height; },
            set: function(v){
                this._height = v;
                this.el.height = this._height;
            }
        });
    }

    Camera.prototype.init = function(canvas){
        this.el = canvas;
    };


    return Camera;
})();


var Stage = (function(){
    function Stage () {
        DisplayObject.apply(this);

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.layers = {};
    }

    Stage.prototype = new DisplayObject();

    Stage.prototype.addLayer = function(name, l){
        this.addChild(l);
        this.layers[name] = l;
    };

    Stage.prototype.removeLayer = function(name){
        this.removeChild(this.layers[name]);
        delete this.layers[name];
    };

    Stage.prototype.getLayer = function(name){
        return this.layers[name];
    };

    return Stage;
})();

var Paralax = (function(){
    function Paralax (view, factor) {
        var w           = image.width + Engine.Camera.size.width,
            h           = image.height;

        this.container  = new createjs.Container();
        this.view       = new createjs.Shape();

        this.view.graphics.clear().beginBitmapFill(image, 'repeat').drawRect(0, 0, w, h);
        container.addChild(this.view);

        this.x          = 0;
        this.y          = 0;
        this.factor     = factor;

        this.view.width = view.image.width;
        this.view.height = h;
    }

    return Paralax;
})();


var Layer = (function(){
    function Layer () {
        DisplayObject.apply(this);
    }

    Layer.prototype = new DisplayObject();

    return Layer;
})();
