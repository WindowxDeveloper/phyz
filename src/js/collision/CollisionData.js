var V2 = require('../V2');

function CollisionData (b, o){
    this.self = {
        body: b,
        point: new V2(b.x, b.y)
    };

    this.other = {
        body: o,
        point: new V2(o.x, o.y)
    };
}

module.exports = CollisionData;
