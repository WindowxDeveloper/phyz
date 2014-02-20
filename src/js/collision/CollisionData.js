var V2 = require('../V2');

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

module.exports = CollisionData;
