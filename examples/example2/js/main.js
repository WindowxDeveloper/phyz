var preloader = new P.Preloader(),
    w = new P.World(document.querySelector('#game1')),
    w2 = new P.World(document.querySelector('#game2'));

preloader.add('square', 'http://placehold.it/50');
preloader.add('ground', 'http://placehold.it/480x50');

preloader.on('complete', function(){
    console.log('LOAD COMPLETE');

    w.settings.DEBUG_DRAW = false;
    w.settings.FPS_METTER = false;
    w.camera.width = 480;
    w.camera.height = 320;
    w.camera.stage.width = 960;
    w.camera.stage.height = 640;

    var s = new P.Sprite('dynamic', false);
    s.view = new createjs.Bitmap(preloader.get('square'));
    s.width = 50;
    s.height = 50;
    s.x = 0;
    s.y = 0;

    var g = new P.Sprite('static', false);
    g.view = new createjs.Bitmap(preloader.get('ground'));
    g.width = 480;
    g.height = 50;
    g.x = 0;
    g.y = 300;

    w.addChild(s);
    w.addChild(g);

    document.addEventListener(P.util.events.START, function(e){
        s.velocity.y = -300;

        e.preventDefault();
    });

    var animPlataform = function(){
        w.tween.to(g, {x: 200}, {time: 1, delay: 2, ease: 'easeOutBounce', oncomplete: function(){
            w.tween.to(g, {x: 10}, {time: 1, ease: 'easeOutBounce', oncomplete: function(){
                animPlataform();
            }});
        }});
    };

    animPlataform();

    w.camera.following = s;
    w.start();


    // Game2
    w2.camera.width = 480;
    w2.camera.height = 320;
    w2.camera.stage.width = 960;
    w2.camera.stage.height = 640;

    var s2 = new P.Sprite('dynamic', false);
    s2.view = new createjs.Bitmap(preloader.get('square'));
    s2.width = 50;
    s2.height = 50;
    s2.x = 0;
    s2.y = 0;

    var g2 = new P.Sprite('static', false);
    g2.view = new createjs.Bitmap(preloader.get('ground'));
    g2.width = 480;
    g2.height = 50;
    g2.x = 0;
    g2.y = 300;

    w2.addChild(s2);
    w2.addChild(g2);

    document.addEventListener(P.util.events.START, function(e){
        s2.velocity.x = 150;

        e.preventDefault();
    });

    var animPlataform2 = function(){
        w.tween.to(g2, {x: 200}, {time: 1, delay: 2, ease: 'easeInBounce', oncomplete: function(){
            w.tween.to(g2, {x: 10}, {time: 1, ease: 'easeInBounce', oncomplete: function(){
                animPlataform2();
            }});
        }});
    };

    animPlataform2();

    w2.camera.following = s2;
    w2.start();

});

preloader.start();
