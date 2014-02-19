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

var EventHandler        = require('./util/EventHandler');
var Device              = require('./util/Device');
var Events              = require('./util/Events');
var V2                  = require('./util/V2');
var Container           = require('./display/Container');
var Sprite              = require('./display/Sprite');
var Camera              = require('./display/Camera');
var Stage               = require('./display/Stage');
var Paralax             = require('./display/Paralax');
var Tween               = require('./tween/Tween');
var Preloader           = require('./preloader/Preloader');
var World               = require('./World');

var Phyz = {
    utils: {
        Device: Device,
        Events: Events,
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

module.exports = Phyz;















var w = new P.World(el);
w.camera.width = 480;
w.camera.height = 320;
w.camera.stage.width = 960;
w.camera.stage.height = 640;

var type = 'dynamic', // static
    isSensor =  false; // true;

var s = new P.Sprite('dynamic', false);
s.view = new createjs.Bitmap(img);
s.width = 200;
s.height = 200;
s.x = 0;
s.y = 0;

w.layers.push(new Layer('default'));

w.add(s, 'default');
w.remove(s);


var animPlataform = function(){
    Tween.to(s, {x: 100}, {time: 1, oncomplete: function(){
        Tween.to(s, {x: 0}, {time: 1, oncomplete: function(){
            animPlataform();
        }});
    }});
};

animPlataform();

