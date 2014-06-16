var EventHandler    = require('../util/EventHandler'),
    Class           = require('../util/Class');

var Container = Class.extend({
    init: function () {
        // Draw/View properties
        this._container     = new createjs.Container();

        // Container properties
        this.parent         = null;
        this.childs         = [];

        this._rotation      = 0;
        this._x             = 0;
        this._y             = 0;

        this.cache          = {};

        // Position properties
        Object.defineProperty(this, 'x', {
            get: function(){ return this._x; },
            set: function(v){
                this.cache.x = this._x;
                this._x = v;
                this._container.x = v;
            }
        });

        Object.defineProperty(this, 'y', {
            get: function(){ return this._y; },
            set: function(v){
                this.cache.y = this._y;
                this._y = v;
                this._container.y = v;
            }
        });

        Object.defineProperty(this, 'rotation', {
            get: function(){ return this._rotation; },
            set: function(v){
                this.cache.rotation = this._rotation;
                this._rotation = v;
                this._container.rotation = v;
            }
        });

        // Set default values and cache
        this.rotation   = this._rotation;
        this.x          = this._x;
        this.y          = this._y;
    },
    addChild: function (child) {
        child.parent = this;

        if (this._container && child._container) {
            this._container.addChild(child._container);
        }

        this.childs.push(child);

        this.trigger('add', child);
        child.trigger('added', this);
    },
    removeChild: function (child) {
        if (this._container && child._container) {
            this._container.removeChild(child._container);
        }

        this.childs.remove(child);

        this.trigger('remove', child);
        child.trigger('removed', this);
    },
    remove: function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
});

EventHandler.init(Container.prototype);

module.exports = Container;
