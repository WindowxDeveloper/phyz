module.exports.Device = {
    isStandAlone:       (('standalone' in window.navigator) && window.navigator.standalone === true),
    isRetinaDisplay:    (window.devicePixelRatio === 2),
    get isPortrait()    { return (window.orientation === 0 || window.orientation === 180); },
    get isTablet()      { return window.innerWidth > 480; },
    isAndroid:          (/android/gi).test(navigator.appVersion),
    isIDevice:          (/iphone|ipad/gi).test(navigator.appVersion),
    isTouchPad:         (/hp-tablet/gi).test(navigator.appVersion)
};

module.exports.Events = {
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


/**
 * Represents a V2 in two dimensions.
 *
 * @param {?number=} x The x position.
 * @param {?number=} y The y position.
 * @constructor
 */
var V2 = function (x, y) {
    this.x = Number(x || 0);
    this.y = Number(y || 0);
};

/**
 * Print vaues into formated string
 *
 * @return {String} Formated values.
 */
V2.prototype.toString = function () {
    return '['+this.x+', '+this.y+']';
};

/**
 * Clone the values of V2.
 *
 * @return {V2} This for chaining.
 */
V2.prototype.clone = function () {
    return new V2(this.x, this.y);
};

/**
 * Copy the values of another V2 into this one.
 *
 * @param {V2} other The other V2.
 * @return {V2} This for chaining.
 */
V2.prototype.copy = function (other) {
    this.x = other.x;
    this.y = other.y;
    return this;
};

/**
 * Rotate this V2 by 90 degrees
 *
 * @return {V2} This for chaining.
 */
V2.prototype.perp = function () {
    var x = this.x;
    this.x = this.y;
    this.y = -x;
    return this;
};

/**
 * Reverse this V2.
 *
 * @return {V2} This for chaining.
 */
V2.prototype.reverse = function () {
    this.x = -this.x;
    this.y = -this.y;
    return this;
};

/**
 * Normalize (make unit length) this V2.
 *
 * @return {V2} This for chaining.
 */
V2.prototype.normalize = function () {
    var d = this.len();
    if (d > 0) {
        this.x = this.x / d;
        this.y = this.y / d;
    }
    return this;
};

/**
 * Add another V2 to this one.
 *
 * @param {V2} other The other V2.
 * @return {V2} This for chaining.
 */
V2.prototype.add = function (other) {
    this.x += other.x;
    this.y += other.y;
    return this;
};

/**
 * Subtract another V2 from this one.
 *
 * @param {V2} other The other V2.
 * @return {V2} This for chaiing.
 */
V2.prototype.sub = function (other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
};

/**
 * Scale this V2.
 *
 * @param {number} x The scaling factor in the x direction.
 * @param {?number=} y The scaling factor in the y direction.  If this
 *   is not specified, the x scaling factor will be used.
 * @return {V2} This for chaining.
 */
V2.prototype.scale = function (x, y) {
    this.x *= x;
    this.y *= y || x;
    return this;
};

/**
 * Project this V2 on to another V2.
 *
 * @param {V2} other The V2 to project onto.
 * @return {V2} This for chaining.
 */
V2.prototype.project = function (other) {
    var amt = this.dot(other) / other.len2();
    this.x = amt * other.x;
    this.y = amt * other.y;
    return this;
};

/**
 * Project this V2 onto a V2 of unit length.
 *
 * @param {V2} other The unit V2 to project onto.
 * @return {V2} This for chaining.
 */
V2.prototype.projectN = function (other) {
    var amt = this.dot(other);
    this.x = amt * other.x;
    this.y = amt * other.y;
    return this;
};

/**
 * Reflect this V2 on an arbitrary axis.
 *
 * @param {V2} axis The V2 representing the axis.
 * @return {V2} This for chaining.
 */
V2.prototype.reflect = function (axis) {
    var x = this.x;
    var y = this.y;
    this.project(axis).scale(2);
    this.x -= x;
    this.y -= y;
    return this;
};

/**
 * Reflect this V2 on an arbitrary axis (represented by a unit V2)
 *
 * @param {V2} axis The unit V2 representing the axis.
 * @return {V2} This for chaining.
 */
V2.prototype.reflectN = function (axis) {
    var x = this.x;
    var y = this.y;
    this.projectN(axis).scale(2);
    this.x -= x;
    this.y -= y;
    return this;
};

/**
 * Get the dot product of this V2 against another.
 *
 * @param {V2}  other The V2 to dot this one against.
 * @return {number} The dot product.
 */
V2.prototype.dot = function (other) {
    return this.x * other.x + this.y * other.y;
};

/**
 * Get the length^2 of this V2.
 *
 * @return {number} The length^2 of this V2.
 */
V2.prototype.len2 = function () {
    return this.dot(this);
};

/**
 * Get the length of this V2.
 *
 * @return {number} The length of this V2.
 */
V2.prototype.len = function () {
    return Math.sqrt(this.len2());
};

module.exports.V2 = V2;
