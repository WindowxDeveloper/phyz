var Stage = require('./Stage');

function Camera (el, layers){
    this.el         = el;
    this.stage      = new Stage(layers);
    this.target     = null;
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

Camera.tick = function (dt, c) {
    var limit;
    if (c.target) {
        limit = new V2(c.stage.width - c.width, c.stage.height - c.height);
        c.x = c.target.x + (c.target.width/2) - (c.width/2);
        c.y = c.target.y + (c.target.height/2) - (c.height/2);

        if (c.x < 0) {
            c.x = 0;
        } else if (c.x > limit.x) {
            c.x = limit.x;
        }

        if (c.y < 0) {
            c.y = 0;
        } else if (c.y > limit.y) {
            c.y = limit.y;
        }
    }
};

module.exports = Camera;
