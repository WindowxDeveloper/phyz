var Container   = require('./Container'),
    Layer       = require('./Layer');
    // TiledIndex  = require('../TiledIndex');

var Stage = Container.extend({
    init: function(world, layers){
        var i, l;
        layers = layers || ['default'];

        Stage.super(this).init();

        this.world = world;
        this.layers = {};

        for (i = 0; i < layers.length; i++) {
            this.layers[layers[i]] = new Layer(layers[i]);
            this.addChild(this.layers[layers[i]]);
        }
    },
    layer: function(name){
        return this.layers[name];
    }
});

module.exports = Stage;
