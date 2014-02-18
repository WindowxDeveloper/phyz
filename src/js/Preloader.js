var Preloader = (function(){
    function Preloader(){
        this.order = [];
        this.queue = {};
        this.loaded = {};
        this.index = 0;
    }

    EventHandler.init(Preloader.prototype);

    /*
    * Get Img DOM element
    * @param name
    */
    Preloader.prototype.get = function(name){
        if (this.loaded[name]) {
            return this.loaded[name];
        } else {
            return false;
        }
    };

    /*
    * Add to a queue
    * @param filename
    */
    Preloader.prototype.add = function(name, filename){
        if(typeof this.queue[name] === 'undefined' && typeof this.loaded[name] === 'undefined'){
            this.order.push(name);
            this.queue[name] = filename;
            this.trigger('add');
        }
    };

    /*
    * Clear the queue
    * @param
    */
    Preloader.prototype.clear = function(){
        this.order = [];
        this.queue = {};
        this.index = 0;
        this.trigger('clear');
    };

    /*
    * Load to the next file
    * @param
    */
    Preloader.prototype.next = function(){
        if(this.order.length > this.index){
            var self        = this,
                img         = new Image(),
                i           = this.index++,
                filename    = this.queue[this.order[i]];

            img.onload = function(){
                self.loaded[self.order[i]] = this;

                self.trigger('itemComplete', {order: i, filename: filename, progress: i/self.order.length});
                self.next();
            };

            img.src = filename;
        }else{
            this.trigger('complete');
        }
    };

    /*
    * Start to load the queue
    * @param
    */
    Preloader.prototype.start = function(){
        this.trigger('start');
        this.next();
    };

    return Preloader;
})();
