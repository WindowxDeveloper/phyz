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

module.exports = Camera;