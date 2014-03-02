var Container = require('./Container');

var Layer = Container.extend({
    init: function(name){
        Layer.super(this).init();

        this.name = name;
    }
});

module.exports = Layer;
