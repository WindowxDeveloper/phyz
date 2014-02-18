var Device = {
    isStandAlone:       (('standalone' in window.navigator) && window.navigator.standalone === true),
    isRetinaDisplay:    (window.devicePixelRatio === 2),
    get isPortrait()    { return (window.orientation === 0 || window.orientation === 180); },
    get isTablet()      { return window.innerWidth > 480; },
    isAndroid:          (/android/gi).test(navigator.appVersion),
    isIDevice:          (/iphone|ipad/gi).test(navigator.appVersion),
    isTouchPad:         (/hp-tablet/gi).test(navigator.appVersion)
};

var Events = {
    RESIZE:         'onorientationchange' in window ? 'orientationchange' : 'resize',
    START:          'ontouchstart' in window ? 'touchstart' : 'mousedown',
    MOVE:           'ontouchstart' in window ? 'touchmove' : 'mousemove',
    END:            'ontouchstart' in window ? 'touchend' : 'mouseup',
    CANCEL:         'ontouchstart' in window ? 'touchcancel' : 'mouseup',
    CLICK:          'ontap' in window ? 'tap' : 'click'
};

String.prototype.toNumber = function(){
    return Number(this.replace('px', ''));
};

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

var Arr = {
    remove: function(array, remove){
        var _return = [];

        for(var i = 0; i < array.length; i++){
            if(array[i] != remove){
                _return.push(array[i]);
            }
        }

        return _return;
    },

    merge: function(/* variable number of arrays */){
        var _return = [];

        for(var i = 0; i < arguments.length; i++){
            var array = arguments[i];
            for(var j = 0; j < array.length; j++){
                if(_return.indexOf(array[j]) === -1) {
                    _return.push(array[j]);
                }
            }
        }

        return _return;
    }
};