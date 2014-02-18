var TiledIndex = (function(){
    function TiledIndex(){
        var limitX, limitY;

        this.indexes    = [];
        this.limitX     = 0;
        this.limitY     = 0;
        this.limit      = 0;
        this.width      = 200;
        this.height     = 200;

        this.limitX     = ~~(Engine.Stage.width / this.width);
        this.width      = Math.ceil(Engine.Stage.width / this.limitX);

        this.limitY     = ~~(Engine.Stage.height / this.height);
        this.height     = Math.ceil(Engine.Stage.height / this.limitY);

        this.limit      = this.limitX * this.limitY;

        if(Engine.Settings.DEBUG_DRAW){
            var n;
            for(var i = 0; i < this.limit; i++){
                n = i + 1;
                n = (n < 100 ? n < 10 ? '00' + n : '0' + n : n);
                // $(Engine.Stage.el).append('<div style="outline: 1px solid rgba(0, 0, 0, .5); width:'+this.width+'px; height:'+this.height+'px; position: absolute; top:'+(~~(i/this.limitX) * this.height)+'px; left:'+(i%this.limitX * this.width)+'px; font-weight: bold; text-indent: 3px; text-shadow: 1px 1px 0 #fff;">'+n+'</div>')
            }
        }
    }

    /*
    * Add a Sprite in a list of index
    * @param sprite
    */
    TiledIndex.prototype.add = function (sprite) {
        var _index = 0;
        var numTilesX = sprite.width / this.width;
        var numTilesY = sprite.height / this.height;
        var _position = sprite.getPositionForCollision();
        var tileX = Math.ceil((_position.x - (sprite.width/2)) / this.width);
        var tileY = Math.ceil((_position.y - (sprite.height/2)) / this.height);

        var _posX = (_position.x - (sprite.width/2)) % this.width;
        var _posY = (_position.y - (sprite.height/2)) % this.height;
        numTilesX = 1 + (_posX === 0 || _posX > (this.width - sprite.width % this.width) - 1 ? Math.ceil(numTilesX) : Math.floor(numTilesX));
        numTilesY = 1 + (_posY === 0 || _posY > (this.height - sprite.height % this.height) - 1 ? Math.ceil(numTilesY) : Math.floor(numTilesY));

        this.remove(sprite);

        for(var iX = 0; iX < numTilesX; iX++){
            for(var iY = 0; iY < numTilesY; iY++){
                _index = ((tileY + iY - 1) * this.limitX) + tileX + iX;
                sprite.tiles.push(_index);

                if(typeof this.indexes[_index] === 'undefined'){
                    this.indexes[_index] = [];
                }

                this.indexes[_index].push(sprite);
            }
        }
    };

    TiledIndex.prototype.remove = function (sprite) {
        for(var i = 0; i < sprite.tiles.length; i++){
            this.indexes[sprite.tiles[i]].remove(sprite);
        }

        sprite.tiles = [];
    };

    /*
    * Get iniq sprites in a list of index
    * @param sprite
    * $return Array
    */
    TiledIndex.prototype.getOthers = function (sprite) {
        var a = [], t = sprite.getTiles(), s;
        for (var i = 0; i < t.length; i++) {
            s = this.indexes[t[i]];
            for (var j = 0; j < s.length; j++){
                if (a.indexOf(s) == -1 && s[j].getLastParent() != sprite.getLastParent()) {
                    a.push(s[j]);
                }
            }
        }

        return a;
    };

    return TiledIndex;
})();
