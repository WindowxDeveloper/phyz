
function Container () {
    this.layer        = new createjs.Container();
    this.parent       = null;
    this.event        = null;
    this.childs       = [];
}

Container.prototype.addChild = function(child){
    child.parent = this;

    if (this.layer && child.layer) {
        this.layer.addChild(child.layer);
    }

    this.childs.push(child);

    this.trigger('add', child);
    child.trigger('added', this);
};

Container.prototype.removeChild = function(child){
    if (this.layer && child.layer) {
        this.layer.removeChild(child.layer);
    }

    this.childs.remove(child);

    this.trigger('remove', child);
    child.trigger('removed', this);
};

EventHandler.init(Container.prototype);

module.exports = Container;
