var preloader = new P.Preloader(),
    w = new P.World(document.querySelector('canvas'));

preloader.add('square', 'http://placehold.it/50');
preloader.add('ground', 'http://placehold.it/480x50');

preloader.on('complete', function(){
    console.log('LOAD COMPLETE');

    w.camera.width = 480;
    w.camera.height = 320;
    w.camera.stage.width = 960;
    w.camera.stage.height = 640;

    var s = new P.Sprite('dynamic', false);
    s.view = new createjs.Bitmap(preloader.get('square'));
    w.addChild(s);
    s.width = 50;
    s.height = 50;
    s.x = 100;
    s.y = 0;

    var g = new P.Sprite('static', false);
    g.view = new createjs.Bitmap(preloader.get('ground'));
    w.addChild(g);
    g.width = 480;
    g.height = 50;
    g.x = 0;
    g.y = 300;


    /*
    var animPlataform = function(){
        Tween.to(s, {x: 100}, {time: 1, oncomplete: function(){
            Tween.to(s, {x: 0}, {time: 1, oncomplete: function(){
                animPlataform();
            }});
        }});
    };

    animPlataform();
    */


    document.addEventListener(P.util.events.START, function(e){
        s.velocity.x = 200;

        e.preventDefault();
    });

    w.camera.following = s;
    w.start();

    P.Tween.to(g, {x: 110}, {time: 1, delay: 2, ease: 'easeOutBounce', oncomplete: function(){ console.log('complete ' + this.x); }});
});

preloader.start();
