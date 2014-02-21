var CollisionData   = require('./CollisionData'),
    Collisions      = require('./Collisions'),
    V2              = require('../V2');

function Collide () {}

Collide.prototype.check = function(s, o){
    var collided = false, overlap = new V2(0, 0), a, b, x, y, c, collideY;

    if (s.x <= o.x) { a = s; b = o; } else { a = o; b = s; }
    x = b.x - (a.x + a.width);

    if (s.y <= o.y) { a = s; b = o; } else { a = o; b = s; }
    y = b.y - (a.y + a.height);

    if (x < 0 && y < 0) {
        collided = true;
        overlap.x = x;
        overlap.y = y;
    }

    if(collided){
        console.log(overlap);
        c = new CollisionData(s, o);

        if(!s.sensor && !o.sensor){
            if(!o.config.plataform || (o.config.plataform && s.cache.y < s.cache.y)) {
                collideY = overlap.x < overlap.y;
                if (collideY) {
                    s.y += overlap.y;
                } else {
                    s.x += overlap.x;
                }

                if(s.type === 'dynamic' && o.type === 'dynamic'){
                    this.elastic(c);
                }else{
                    this.normal(c);

                    if (collideY) {
                        s.velocity.y = 0;
                    } else {
                        s.velocity.x = 0;
                    }
                }

                s.collisions.add(c);
            }
        }else{
            s.collisions.add(c);
        }
    }else{
        c = s.collisions.get(o);
        if (c) {
            s.collisions.remove(c);
        }
    }
};

Collide.prototype.normal = function(collision){
    var s = collision.self.sprite,
        o = collision.other.sprite;

    o.velocity.x = o.x - o.cache.x;
    o.velocity.y = o.y - o.cache.y;

    s.x += o.velocity.x;
    s.y += o.velocity.y;
};

Collide.prototype.elastic = function (collision) {
    var s = collision.self.sprite,
    o = collision.other.sprite;

    s.velocity = new V2(
        ((s.velocity.x * (s.mass - o.mass)) + (2 * o.mass * o.velocity.x)) / (s.mass + o.mass),
        ((s.velocity.y * (s.mass - o.mass)) + (2 * o.mass * o.velocity.y)) / (s.mass + o.mass)
    );

    o.velocity = new V2(
        ((o.velocity.x * (o.mass - s.mass)) + (2 * s.mass * s.velocity.x)) / (o.mass + s.mass),
        ((o.velocity.y * (o.mass - s.mass)) + (2 * s.mass * s.velocity.y)) / (o.mass + s.mass)
    );
};

module.exports = new Collide;