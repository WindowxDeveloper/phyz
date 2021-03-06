var Preloader   = P.Preloader,
    Tween       = P.Tween,
    Body        = P.Body,
    World       = P.World,
    Util        = P.Util;

var c = document.querySelector('#game1'), // Canvas
    l = ['bg', 'default'], // Layers
    w = new World(c, l);

w.settings.DEBUG_DRAW = true;
w.settings.FPS_METTER = true;

var s = new Body('dynamic', false);
s.width = 50;
s.height = 50;
s.x = 0;
s.y = 0;

var g = new Body('static', false);
g.width = 480;
g.height = 50;
g.x = 0;
g.y = 300;


w.camera.stage.layer('default').addChild(s);
w.camera.stage.layer('bg').addChild(g);

w.camera.width          = 480;
w.camera.height         = 320;
w.camera.stage.width    = 960;
w.camera.stage.height   = 640;
w.camera.target         = s;

w.start();

document.addEventListener(Util.events.START, function(e){
    s.velocity.y = -300;

    e.preventDefault();
});

var animPlataform = function(){
    Tween.to(g, {x: 200}, {time: 1, delay: 2, ease: 'easeOutBounce', oncomplete: function(){
        Tween.to(g, {x: 10}, {time: 1, ease: 'easeOutBounce', oncomplete: function(){
            animPlataform();
        }});
    }});
};

animPlataform();

/**/
