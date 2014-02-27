var Container = require('./Container');
var Layer = require('./Layer');

var Stage = Container.extend({
    init: function(layers){
        var i, l;
        layers = layers || ['default'];

        this.super.init();

        this.layers = {};

        for (i = 0; i < layers.length; i++) {
            l = new Layer();
            this.layers[layers[i]] = ;
        }
    },
    layer: function(name){
        return this.layers[name];
    }
});

module.exports = Stage;
