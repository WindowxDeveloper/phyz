var EventHandler = (function(){
    var EventHandler = function(context){
        this.context = context;
        this.events = {};
    };

    EventHandler.prototype.on = function(name, fn){
        if (!this.events[name]) {
            this.events[name] = [fn];
        } else {
            this.events[name].push(fn);
        }
    };

    EventHandler.prototype.trigger = function(name, params){
        if (this.events[name]) {
            for (var i = 0; i < this.events[name].length; i++) {
                this.events[name][i].apply(this.context, [params || null]);
            }
        }
    };

    return {
        init: function (O) {
            O.on = function (name, fn) {
                if(!this.event) this.event = new EventHandler(this);
                this.event.on(name, fn);
            };

            O.trigger = function (name, params, retroative) {
                if(!this.event) this.event = new EventHandler(this);
                this.event.trigger(name, params);

                if(retroative && this.parent){
                    this.parent.trigger(name, params);
                }
            };
        }
    };
})();

module.exports = EventHandler;
