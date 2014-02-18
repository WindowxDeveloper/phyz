var p = Phyz.Preloader;

p.add('square', 'http://placehold.it/50');
p.add('ground', 'http://placehold.it/480x50');

p.on('complete', function(){
    console.log('LOAD COMPLETE');
    Phyz.Settings.DEBUG_DRAW = true;
    Phyz.Camera.init(document.querySelector('canvas'));
    Phyz.Camera.width = 480;
    Phyz.Camera.height = 320;

    Phyz.Stage.width = 960;
    Phyz.Stage.height = 640;

    var a = new Sprite('dynamic');
    a.view = new createjs.Bitmap(p.get('square'));
    a.x = 100;
    a.y = 0;
    a.width = 50;
    a.height = 50;
    Phyz.add(a);

    Phyz.Camera.following = a;

    var ground = new Sprite();
    ground.view = new createjs.Bitmap(p.get('ground'));
    // ground.config.plataform = true;
    ground.x = 0;
    ground.y = 320 - 25;
    ground.width = 480;
    ground.height = 50;

    TweenLite.to(ground, 3, {x: 200});

    Phyz.add(ground);

    document.addEventListener(Events.START, function(e){
        a.velocity.y = -300;

        e.preventDefault();
    });

    Phyz.start();
});

p.start();
