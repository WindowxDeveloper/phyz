function Class () {}

Class.prototype.init = function () {};

Class.extend = function (p) {
    var i,
        _class = new Function('return function(){ var i; this.super = {}; for (i in this._super) { if (i !== "_super") { this.super[i] = this._super[i].bind(this); } } this.init.apply(this, arguments); };')();

    _class.extend = this.extend;

    for (i in this.prototype) {
        _class.prototype[i] = this.prototype[i];
    }

    for (i in p) {
        _class.prototype[i] = p[i];
    }

    _class.prototype._super = this.prototype;

    return _class;
}

module.exports = Class;
