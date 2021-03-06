/*  Authors: RVAZ (Renan Vaz) && Wormwood (Márcio Laubstein)
 *	Version: 4.0
*/

if (!Array.prototype.indexOf) {
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

if (!Array.prototype.remove) {
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

var Device              = require('./util/Device'),
    Events              = require('./util/Events'),
    Sprite              = require('./display/Sprite'),
    Body                = require('./display/Body'),
    // Paralax             = require('./display/Paralax'),
    Preloader           = require('./preloader/Preloader'),
    Tween               = require('./tween/Tween'),
    V2                  = require('./V2'),
    World               = require('./World');

var Phyz = {
    util: {
        device: Device,
        events: Events
    },
    V2        : V2,
    Preloader : Preloader,
    Tween     : Tween,
    Sprite    : Sprite,
    Body      : Body,
    // Paralax   : Paralax,
    World     : World
};

window.P = window.Phyz = Phyz;
