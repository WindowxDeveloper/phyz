var Container = require('./Container');

function Stage () {
    Container.apply(this);

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.layers = {};
}

Stage.prototype = new Container();

Stage.prototype.createLayer = function(name){
    var l = new Container();
    this.addChild(l);
    this.layers[name] = l;
};

Stage.prototype.removeLayer = function(name){
    this.removeChild(this.layers[name]);
    delete this.layers[name];
};

Stage.prototype.getLayer = function(name){
    return this.layers[name];
};

module.exports = Stage;
