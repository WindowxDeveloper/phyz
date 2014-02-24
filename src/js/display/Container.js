var EventHandler = require('../util/EventHandler');
var Class = require('../util/Class');

var Container = Class.extend({
    init: function(){
        // Draw/View properties
        this._container     = new createjs.Container();
        this._view          = null;

        // Container properties
        this.parent         = null;
        this.childs         = [];

        // Position properties
        this.x              = 0;
        this.y              = 0;
        this.width          = 0;
        this.height         = 0;

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
    },
    addChild: function(child){
        child.parent = this;

        if (this._container && child._container) {
            this._container.addChild(child._container);
        }

        this.childs.push(child);

        this.trigger('add', child);
        child.trigger('added', this);
    },
    removeChild: function(child){
        if (this._container && child._container) {
            this._container.removeChild(child._container);
        }

        this.childs.remove(child);

        this.trigger('remove', child);
        child.trigger('removed', this);
    },
    remove: function(){
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
});

EventHandler.init(Container.prototype);

module.exports = Container;
