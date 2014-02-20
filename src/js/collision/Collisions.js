var CollisionData = require('./CollisionData');

function Collisions (data) {
    this.data = data || [];
}

Collisions.prototype.add = function (collision) {
    if (this.get(collision.other.sprite) === false) {
        this.data.push(collision);
        collision.self.sprite.trigger('collision.begin', collision);
        collision.other.sprite.trigger('collision.begin', new CollisionData(collision.other.sprite, collision.self.sprite));
    }
};

Collisions.prototype.remove = function (collision) {
    collision.self.sprite.trigger('collision.end', collision);
    collision.other.sprite.trigger('collision.end', collision.other.sprite.collisions.get(collision.self.sprite));

    this.data.remove(collision);
};

Collisions.prototype.get = function (sprite) {
    var i;

    for (i = 0; i < this.data.length; i++) {
        if (this.data[i].other.sprite === sprite) {
            return this.data[i];
        }
    }

    return false;
};

Collisions.prototype.clear = function(){
    this.data = [];
};

module.exports = Collisions;
