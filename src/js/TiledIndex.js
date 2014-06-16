function TiledIndex(world){
    var limitX, limitY;

    this.indexes    = [];
    this.limitX     = 0;
    this.limitY     = 0;
    this.limit      = 0;
    this.width      = 200;
    this.height     = 200;

    this.limitX     = ~~(world.camera.stage.width / this.width);
    this.width      = Math.ceil(world.camera.stage.width / this.limitX);

    this.limitY     = ~~(world.camera.stage.height / this.height);
    this.height     = Math.ceil(world.camera.stage.height / this.limitY);

    this.limit      = this.limitX * this.limitY;

    if(world.camera.settings.DEBUG_DRAW){
        var n;
        for(var i = 0; i < this.limit; i++){
            n = i + 1;
            n = (n < 100 ? n < 10 ? '00' + n : '0' + n : n);
        }
    }
};

/*
* Add a body in a list of index
* @param body
*/
TiledIndex.prototype.add = function (body) {
    var _index = 0;
    var numTilesX = body.width / this.width;
    var numTilesY = body.height / this.height;
    var _position = body.global;
    var tileX = Math.ceil((_position.x - (body.width/2)) / this.width);
    var tileY = Math.ceil((_position.y - (body.height/2)) / this.height);

    var _posX = (_position.x - (body.width/2)) % this.width;
    var _posY = (_position.y - (body.height/2)) % this.height;
    numTilesX = 1 + (_posX === 0 || _posX > (this.width - body.width % this.width) - 1 ? Math.ceil(numTilesX) : Math.floor(numTilesX));
    numTilesY = 1 + (_posY === 0 || _posY > (this.height - body.height % this.height) - 1 ? Math.ceil(numTilesY) : Math.floor(numTilesY));

    this.remove(body);

    for(var iX = 0; iX < numTilesX; iX++){
        for(var iY = 0; iY < numTilesY; iY++){
            _index = ((tileY + iY - 1) * this.limitX) + tileX + iX;
            body.tiles.push(_index);

            if(typeof this.indexes[_index] === 'undefined'){
                this.indexes[_index] = [];
            }

            this.indexes[_index].push(body);
        }
    }
};

TiledIndex.prototype.remove = function (body) {
    for(var i = 0; i < body.tiles.length; i++){
        this.indexes[body.tiles[i]].remove(body);
    }

    body.tiles = [];
};

/*
* Get iniq bodys in a list of index
* @param body
* $return Array
*/
TiledIndex.prototype.getOthers = function (body) {
    var a = [], t = body.root.all_childrens_tiles, s;
    for (var i = 0; i < t.length; i++) {
        s = this.indexes[t[i]];
        for (var j = 0; j < s.length; j++){
            if (a.indexOf(s) == -1 && s[j].root != body.root) {
                a.push(s[j]);
            }
        }
    }

    return a;
};

module.exports = TiledIndex;
