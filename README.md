# Phyz

Phyz is a lightweight, fast and simple game engine for use in desktops and mobile devices.

## Features
- Ow physics engine, "Physics" made easy.
- Collision detection based in retangles.
- Display list based. Easy to use with pixijs or easeljs renderers.
- Stage and Camera based.
- Simple event handler.
- Preload API, simple and minimalist.
- Tween API.

## Todo
- Add TiledIndex (and integrate with automate Stage size changes)
- Collide adjusts
- Paralax
- Create Drivers for easeljs and pixijs (eg: DisplayObject.prototype.container = new createjs.Container;)
- Layers display object
    - Defaults
        - bg
        - defaut
        - fg
        - debug
- Add plataform type param (top, right, bottom or left)
- Tiled map editor


Phyz
    World
        Camera
            Stage
                Layers
                    Sprites

Preloader
    add
    get (after loaded)
    load

Tween
    to (s, props, params)
    from (s, props, params)

Camera
    folow (sprite)

Container
    addChild
    removeChild
    on
    trigger

    > Sprite
        extends
        remove

    > Stage
        _index
        layers
            add (new Layer)

        addChild (sprite, layer)
        removeChild (sprite)

Paralax

World
    sprites
    paralax
    tweens

    camera
        stage


var Player = P.Sprite.extends({
    init: function(){
        this.view =

        this.tick = function(){

        }
    }
});

var p = new Player();

W.camera.stage.layer['bg'].addChild(sprite);
W.camera.stage.layer['bg'].removeChild(sprite);


