var CollisionData = require('./CollisionData');

function Collisions (data) {
    this.data = data || [];
}

Collisions.prototype.add = function (collision) {
    if (this.get(collision.other.body) === false) {
        this.data.push(collision);
        collision.self.body.trigger('collision.begin', collision);
        collision.other.body.trigger('collision.begin', new CollisionData(collision.other.body, collision.self.body));
    }
};

Collisions.prototype.remove = function (collision) {
    collision.self.body.trigger('collision.end', collision);
    collision.other.body.trigger('collision.end', collision.other.body.collisions.get(collision.self.body));

    this.data.remove(collision);
};

Collisions.prototype.get = function (body) {
    var i;

    for (i = 0; i < this.data.length; i++) {
        if (this.data[i].other.body === body) {
            return this.data[i];
        }
    }

    return false;
};

Collisions.prototype.clear = function(){
    this.data = [];
};

module.exports = Collisions;
