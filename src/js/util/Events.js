var Events = {
    RESIZE:         'onorientationchange' in window ? 'orientationchange' : 'resize',
    START:          'ontouchstart' in window ? 'touchstart' : 'mousedown',
    MOVE:           'ontouchstart' in window ? 'touchmove' : 'mousemove',
    END:            'ontouchstart' in window ? 'touchend' : 'mouseup',
    CANCEL:         'ontouchstart' in window ? 'touchcancel' : 'mouseup',
    CLICK:          'ontap' in window ? 'tap' : 'click'
};

module.exports = Events;
