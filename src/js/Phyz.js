/*  Authors: RVAZ (Renan Vaz) && Wormwood (Márcio Laubstein)
 *	Version: 4.0
*/

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

if(!Array.prototype.remove) {
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
}

var EventHandler        = require('./util/EventHandler'),
    Device              = require('./util/Device'),
    Events              = require('./util/Events'),
    Container           = require('./display/Container'),
    Sprite              = require('./display/Sprite'),
    Camera              = require('./display/Camera'),
    Stage               = require('./display/Stage'),
    Paralax             = require('./display/Paralax'),
    Tween               = require('./tween/Tween'),
    Preloader           = require('./preloader/Preloader'),
    V2                  = require('./V2'),
    World               = require('./World');

var Phyz = {
    util: {
        device: Device,
        events: Events,
        EventHandler: EventHandler
    },

    V2: V2,
    Sprite: Sprite,
    Paralax: Paralax,
    Preloader: Preloader,
    Tween: Tween,
    World: World
};

window.P = window.Phyz = Phyz;