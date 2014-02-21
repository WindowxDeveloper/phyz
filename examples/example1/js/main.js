var preloader = new P.Preloader(),
    w = new P.World(document.querySelector('canvas'));

preloader.add('square', 'http://placehold.it/50');
preloader.add('ground', 'http://placehold.it/480x50');

preloader.on('complete', function(){
    console.log('LOAD COMPLETE');

    w.settings.DEBUG_DRAW = false;
    w.settings.FPS_METTER = false;
    w.camera.width = 960;
    w.camera.height = 640;
    w.camera.stage.width = 960;
    w.camera.stage.height = 640;

    var s = new P.Sprite('dynamic', false);
    s.view = new createjs.Bitmap(preloader.get('square'));
    s.width = 50;
    s.height = 50;
    s.x = 150;
    s.y = 0;

    var g = new P.Sprite('static', false);
    g.view = new createjs.Bitmap(preloader.get('ground'));
    g.width = 480;
    g.height = 50;
    g.x = 0;
    g.y = 300;

    w.addChild(s);
    w.addChild(g);

    var animPlataform = function(){
        w.tween.to(g, {x: 300}, {time: 1, delay: 2, ease: 'easeOutBounce', oncomplete: function(){
            w.tween.to(g, {x: 10}, {time: 1, ease: 'easeOutBounce', oncomplete: function(){
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
