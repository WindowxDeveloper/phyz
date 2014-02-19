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

// Util
var EventHandler        = require('./util/EventHandler');
var Device              = require('./util/Device');
var Events              = require('./util/Events');
var V2                  = require('./util/V2');

// Display
var Container           = require('./display/Container');
var Sprite              = require('./display/Sprite');
var Camera              = require('./display/Camera');
var Stage               = require('./display/Stage');
var Paralax             = require('./display/Paralax');

// Tween
var Tween               = require('./tween/Tween');

// Preloader
var Preloader           = require('./preloader/Preloader');

var Phyz = {
    utils: {
        Device: Device,
        Events: Events,
        EventHandler: EventHandler
    },

    V2: V2,
    Sprite: Sprite,
    Paralax: Paralax,
    Tween: Tween
};

window.P = window.Phyz = Phyz;

module.exports = Phyz;