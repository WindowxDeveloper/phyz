var Container = require('./Container');


var Stage = Container.extend({
    init: function(layers){
        var i;
        layers = layers || ['default'];

        this.super.init();

        this.layers = {};

        for (i = 0; i < layers.length; i++) {
            this.layers[layers[i]] = new Container();
        }
    },
    layer: function(name){
        return this.layers[name];
    }
});

module.exports = Stage;
