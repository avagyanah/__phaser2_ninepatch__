export class NinePatch extends PIXI.DisplayObjectContainer {
  // eslint-disable-next-line class-methods-use-this
  public update() {}

  // eslint-disable-next-line class-methods-use-this
  public postUpdate() {}

  constructor(game, config) {
    const { frame, width, height, data } = config;
    const { top: t, bottom: b, left: l, right: r } = data;

    super();

    this.game = game;
    this._parts = {};
    this._config = config;

    const frameData = this.game.cache.getBaseTexture(frame);
    const { width: w, height: h } = frameData;

    // TOP
    const topArea = this.getArea(l, 0, w - (l + r), t);
    const top = this.getImage();
    top.crop(topArea);

    // BOTTOM
    const bottomArea = this.getArea(l, h - b, w - (l + r), b);
    const bottom = this.getImage();
    bottom.crop(bottomArea);

    // LEFT
    const leftArea = this.getArea(0, t, l, h - (t + b));
    const left = this.getImage();
    left.crop(leftArea);

    // RIGHT
    const rightArea = this.getArea(w - r, t, r, h - (t + b));
    const right = this.getImage();
    right.crop(rightArea);

    // LEFT TOP
    const leftTopArea = this.getArea(0, 0, l, t);
    const leftTop = this.getImage();
    leftTop.crop(leftTopArea);

    // RIGHT TOP
    const rightTopArea = this.getArea(w - r, 0, r, t);
    const rightTop = this.getImage();
    rightTop.crop(rightTopArea);

    // LEFT BOTTOM
    const leftBottomArea = this.getArea(0, h - b, l, b);
    const leftBottom = this.getImage();
    leftBottom.crop(leftBottomArea);

    // RIGHT BOTTOM
    const rightBottomArea = this.getArea(w - r, h - b, r, b);
    const rightBottom = this.getImage();
    rightBottom.crop(rightBottomArea);

    // RIGHT BOTTOM
    const centerArea = this.getArea(l, t, w - (l + r), h - (t + b));
    const center = this.getImage();
    center.crop(centerArea);

    this.addChild((this._parts.top = top));
    this.addChild((this._parts.bottom = bottom));
    this.addChild((this._parts.left = left));
    this.addChild((this._parts.right = right));
    this.addChild((this._parts.leftTop = leftTop));
    this.addChild((this._parts.rightTop = rightTop));
    this.addChild((this._parts.leftBottom = leftBottom));
    this.addChild((this._parts.rightBottom = rightBottom));
    this.addChild((this._parts.center = center));

    this.resize(width, height);
    this._testMovement();
  }

  resize(width, height) {
    this._config.width = width;
    this._config.height = height;

    const { width: w, height: h, data } = this._config;
    const { top: t, bottom: b, left: l, right: r } = data;
    const { top, bottom, left, right, center } = this._parts;

    const sx = (w - (l + r)) / top.width;
    const sy = (h - (t + b)) / right.height;

    top.scale.x *= sx;
    bottom.scale.x *= sx;
    center.scale.x *= sx;
    right.scale.y *= sy;
    left.scale.y *= sy;
    center.scale.y *= sy;

    this._positionParts();
    this._centralize();
  }

  _positionParts() {
    const { top, bottom, left, right, leftTop, rightTop, leftBottom, rightBottom, center } = this._parts;
    const { width: w, height: h, data } = this._config;
    const { top: t, bottom: b, left: l, right: r } = data;

    top.position.set(l, 0);
    bottom.position.set(l, h - b);
    left.position.set(0, t);
    right.position.set(w - r, t);
    center.position.set(l, t);

    leftTop.position.set(0, 0);
    rightTop.position.set(w - r, 0);
    leftBottom.position.set(0, h - b);
    rightBottom.position.set(w - r, h - b);
  }

  _centralize() {
    const { width: w, height: h } = this._config;
    this.pivot.set(w / 2, h / 2);
  }

  _testMovement() {
    this.game.add.tween(this).to({ rotation: 2 * Math.PI }, 3000, null, true, 0, -1);
    this.game.add.tween(this.scale).to({ x: 2, y: 2 }, 1000, null, true, 0, -1, true);

    const tweenData = { a: 196, b: 196 };
    const tween = this.game.add.tween(tweenData).to({ a: 300, b: 300 }, 1000, null, true, 0, -1, true);
    tween.onUpdateCallback((tween, progress, tweenData) => {
      const { a, b } = tween.target;
      this.resize(a, b);
    });
  }

  getImage() {
    return this.game.add.image(0, 0, this._config.frame);
  }

  getArea(x, y, width, height) {
    return new Phaser.Rectangle(x, y, width, height);
  }
}
