var Container   = require('./Container'),
    Layer       = require('./Layer'),
    V2          = require('../V2');

var Sprite = Container.extend({
    init: function () {
        Sprite.super(this).init();

        this._view = null;

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

        Object.defineProperty(this, 'layer', {
            get: function(){
                var p = this, c;

                do {
                    c = p;
                    p = c.parent;
                } while (p && !(p instanceof Layer));

                return p;
            }
        });

        Object.defineProperty(this, 'stage', {
            get: function(){
                var stage = false, layer = this.layer;

                if (layer) {
                    stage = layer.parent;
                }

                return stage;
            }
        });

        Object.defineProperty(this, 'world', {
            get: function(){
                var world = false;

                if (this.stage) {
                    world = this.stage.world;
                }

                return world;
            }
        });

        Object.defineProperty(this, 'global', {
            get: function(){
                var pos = new V2(this.x, this.y),
                    p   = this.parent,
                    c;

                do {
                    c = p;

                    pos.x += c.x;
                    pos.y += c.y;

                    p = c.parent;
                } while (!(p instanceof Layer));

                return pos;
            }
        });
    }
});

module.exports = Sprite;
