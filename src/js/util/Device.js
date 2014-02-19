var Device = {
    isStandAlone:       (('standalone' in window.navigator) && window.navigator.standalone === true),
    isRetinaDisplay:    (window.devicePixelRatio === 2),
    get isPortrait()    { return (window.orientation === 0 || window.orientation === 180); },
    get isTablet()      { return window.innerWidth > 480; },
    isAndroid:          (/android/gi).test(navigator.appVersion),
    isIDevice:          (/iphone|ipad/gi).test(navigator.appVersion),
    isTouchPad:         (/hp-tablet/gi).test(navigator.appVersion)
};

module.exports = Device;