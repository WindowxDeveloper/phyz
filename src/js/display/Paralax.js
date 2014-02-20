function Paralax (view, factor) {
    var w           = image.width + window.Phyz.Camera.width,
        h           = image.height;

    this.layer      = new createjs.Container();
    this.view       = new createjs.Shape();

    this.view.graphics.clear().beginBitmapFill(image, 'repeat').drawRect(0, 0, w, h);

    this.x          = 0;
    this.y          = 0;
    this.width      = view.image.width;
    this.height     = h;

    this.factor     = factor;

    this.layer.addChild(this.view);
}

module.exports = Paralax;