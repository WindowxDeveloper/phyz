var w = new P.World(document.querySelector('canvas'));

w.settings.DEBUG_DRAW = true;
w.settings.FPS_METER = true;

w.physics.resistance.x = 0;

w.camera.width = 320;
w.camera.height = 480;

w.camera.stage.width = 960;
w.camera.stage.height = 640;

var c = new P.Sprite();
c.x = 100;
c.y = 0;

var b = new P.Body('dynamic', false);
b.width = 50;
b.height = 50;
b.x = 0;
b.y = 0;
b.velocity.x = 100;

var b2 = new P.Body('static', false);
b2.width = w.camera.width;
b2.height = 50;
b2.x = 0;
b2.y = w.camera.height - b2.height;

var b3 = new P.Body('static', true);
b3.width = 50;
b3.height = 50;
b3.x = 300;
b3.y = w.camera.height - b3.height - b3.height;

b3.on('collision.begin', function(c){
    console.log('Collide begin');
});

b3.on('collision.end', function(c){
    console.log('Collide end');
});

w.camera.stage.layers.default.addChild(c);

w.camera.target = b;

c.addChild(b);
c.addChild(b2);
c.addChild(b3);

w.start();





















/*





    w.settings.DEBUG_DRAW = true;
    w.settings.FPS_METER = true;

    w.camera.width = 300;
    w.camera.height = 640;
    w.camera.stage.width = 960;
    w.camera.stage.height = 640;

    bg = new P.Sprite();
    bg.view = new createjs.Bitmap(preloader.get('bg'));
    bg.x = 0;

    c = new P.Sprite();
    c.view = new createjs.Bitmap(preloader.get('square'));
    c.x = 50;

    s = new P.Body('dynamic', false);
    s.view = new createjs.Bitmap(preloader.get('square'));
    s.view.x = -10;
    s.view.y = 10;
    s.width = 50;
    s.height = 50;
    s.x = 150;
    s.y = 0;

    g = new P.Body('static', false);
    g.view = new createjs.Bitmap(preloader.get('ground'));
    g.width = 480;
    g.height = 50;
    g.x = 0;
    g.y = 300;

    w.camera.stage.layers.bodies.addChild(c);
    w.camera.stage.layers.bg.addChild(bg);

    c.addChild(s);
    c.addChild(g);

    var animPlataform = function(){
        P.Tween.to(g, {x: 300}, {time: 1, delay: 2, ease: 'easeOutBounce', oncomplete: function(){
            P.Tween.to(g, {x: 10}, {time: 1, ease: 'easeOutBounce', oncomplete: function(){
                animPlataform();
            }});
        }});
    };

    animPlataform();

    document.addEventListener(P.util.events.START, function(e){
        s.velocity.y = -300;

        e.preventDefault();
    });

    w.camera.following = s;
    w.start();

});

preloader.start();
*/
