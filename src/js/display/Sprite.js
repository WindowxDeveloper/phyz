var Container   = require('./Container'),
    Collisions  = require('../collision/Collisions'),
    V2          = require('../V2');

var Sprite = Container.extend({
    init: function (type, sensor) {
        this.super.init();

        this._view          = null;
        this._world         = null;
        this._stage         = null;
        this._layer         = null;

        // Define setter and getter
        Object.defineProperty(this, 'view', {
            get: function(){ return this._view; },
            set: function(v){
                if (this._view) {
                    this._container.removeChild(this._view);
                }

                this._view = v;
                this._container.addChild(this._view);
            }
        });
    }
});

module.exports = Sprite;
