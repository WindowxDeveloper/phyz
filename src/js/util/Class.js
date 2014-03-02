function Class () {}

Class.prototype.init = function () {};

Class.extend = function (p) {
    var i,
        _class = new Function('return function(){ this.init.apply(this, arguments); };')();

    _class.extend = this.extend;

    for (i in this.prototype) {
        _class.prototype[i] = this.prototype[i];
    }

    for (i in p) {
        _class.prototype[i] = p[i];
    }

    _class._super = this.prototype;

    _class.super = function (scope) {
        var i, _super = {};
        for (i in this._super) {
            _super[i] = this._super[i].bind(scope);
        }

        return _super;
    }

    return _class;
}

module.exports = Class;
