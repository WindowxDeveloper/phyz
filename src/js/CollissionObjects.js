
var CollisionData = (function(){
    function CollisionData (s, o){
        this.self = {
            sprite: s,
            point: new V2(s.x, s.y)
        };

        this.other = {
            sprite: o,
            point: new V2(o.x, o.y)
        };
    }

    return CollisionData;
})();

var Collisions = (function(){
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

    return Collisions;
})();

var Collision = (function(){
    function Collision () {}

    Collision.prototype.check = function(s, o){
        if (!s instanceof Sprite || !o instanceof Sprite) return false;

        var collided = false, overlap = new V2(0, 0), a, b, x, y, c;

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
            c = new CollisionData(s, o);

            if(!s.sensor && !o.sensor){
                if(!o.config.plataform || (o.config.plataform && s.cache.y < s.cache.y)) {
                    if (overlap.x < overlap.y) {
                        s.y += overlap.y;
                    } else {
                        s.x += overlap.x;
                    }

                    if(s.type === 'dynamic' && o.type === 'dynamic'){
                        this.elastic(c);
                    }else{
                        this.normal(c);

                        if(overlap.x < 0)
                            s.velocity.x = 0;

                        if(overlap.y < 0)
                            s.velocity.y = 0;
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

    Collision.prototype.normal = function(collision){
        var s = collision.self.sprite,
            o = collision.other.sprite;

        o.velocity.x = o.x - o.cache.x;
        o.velocity.y = o.y - o.cache.y;

        s.x += o.velocity.x;
        s.y += o.velocity.y;
    };

    Collision.prototype.elastic = function (collision) {
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

    return new Collision();
})();