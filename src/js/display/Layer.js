var Container = require('./Container');

var Layer = Container.extend({
    init: function(layers){
        this.super.init();

        this.on('add', function (child) {
            if (child._world !== 'undefined') {
                child._world = this._world;
            }
        });
    }
});

module.exports = Layer;
