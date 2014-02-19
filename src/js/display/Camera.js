var Stage = require('./Stage');

function Camera (el){
    this.el         = el;
    this.stage      = new Stage();
    this.following  = null;
    this._x         = 0;
    this._y         = 0;
    this._width     = 0;
    this._height    = 0;

    Object.defineProperty(this, 'x', {
        get: function(){ return this._x; },
        set: function(v){
            this._x = v;
            this.stage.x = -this._x;
        }
    });

    Object.defineProperty(this, 'y', {
        get: function(){ return this._y; },
        set: function(v){
            this._y = v;
            this.stage.y = -this._y;
        }
    });

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

module.exports = Camera;
