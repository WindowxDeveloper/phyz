var preloader, w, c, arrow, ground;

preloader = new P.Preloader();
preloader.add('arrow', 'img/arrow.png');

preloader.on('complete', function(){
    w = new P.World(document.querySelector('canvas'), ['bg', 'bodies']);
    w.settings.DEBUG_DRAW = false;
    w.settings.FPS_METER = true;

    w.camera.width = 480;
    w.camera.height = 480;

    w.camera.stage.width = 480;
    w.camera.stage.height = 480;

    c = new P.Sprite();
    c.x = 0;
    c.y = 0;

    ground = new P.Body('static', false);
    ground.width = w.camera.width;
    ground.height = 50;
    ground.x = 0;
    ground.y = w.camera.height - ground.height;

    arrow = new P.Body('dynamic', false);
    arrow.view = new createjs.Bitmap(preloader.get('arrow'));
    arrow.width = 50;
    arrow.height = 50;
    arrow.x = 0;
    arrow.y = ground.y - arrow.height;
    arrow.velocity.x = 300;
    arrow.velocity.y = -500;
    arrow.tick = function(){
        this.view.rotation = (Math.atan2(this.velocity.y, this.velocity.x) / Math.PI) * 180;
    }

    ground.on('collision.begin', function(c){
        console.log('Collide begin');
    });

    ground.on('collision.end', function(c){
        console.log('Collide end');
    });

    w.camera.stage.layers.bodies.addChild(c);

    c.addChild(arrow);
    c.addChild(ground);

    w.start();
});

preloader.start();



















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
