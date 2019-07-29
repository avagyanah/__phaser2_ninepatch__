import { INinePatchCacheData, INinePatchGame } from "./NinePatchPlugin";

export class NinePatch extends PIXI.DisplayObjectContainer {
  public game: Phaser.Game;

  /**
   * The eventual sizes of the container
   */
  private localWidth: number;
  private localHeight: number;

  /**
   * The sizes of the edges
   */
  private leftSize: number;
  private topSize: number;
  private rightSize: number;
  private bottomSize: number;

  /**
   * The original texture, unmodified
   */
  private baseTexture: PIXI.BaseTexture;
  private baseFrame: Phaser.Rectangle;

  private patches: Phaser.Image[];
  private anchor: Phaser.Point;

  constructor(
    game: INinePatchGame,
    x: number,
    y: number,
    key: string,
    frame: string,
    width: number,
    height: number,
    data?: INinePatchCacheData
  ) {
    super();
    this.game = game;
    this.x = x;
    this.y = y;
    this.anchor = new Phaser.Point();
    this.internalLoadTexture(key, frame);
    if (frame !== null && !data) {
      data = game.cache.getNinePatch(frame);
    } else if (!data) {
      data = game.cache.getNinePatch(key);
    }

    if (undefined === data) {
      return;
    }

    this.topSize = data.top;
    this.leftSize = data.left || this.topSize;
    this.rightSize = data.right || this.leftSize;
    this.bottomSize = data.bottom || this.topSize;
    this.patches = [];
    this.resize(width, height);
  }

  // eslint-disable-next-line class-methods-use-this
  public update() {}

  // eslint-disable-next-line class-methods-use-this
  public postUpdate() {}

  public loadTexture(key: string, frame?: string): void {
    this.internalLoadTexture(key, frame);
    this.flushPatches();
    this.drawPatches();
  }

  public set frameName(frame: string) {
    this.internalSetFrame(this.baseTexture.source.name, frame);
    this.flushPatches();
    this.drawPatches();
  }

  public resize(width: number, height: number): void {
    this.localWidth = Math.round(width);
    this.localHeight = Math.round(height);
    this.drawPatches();
  }

  public setAnchor(x: number, y: number) {
    this.anchor.set(x, y);
    this.drawPatches();
  }

  public destroy(): void {
    this.parent.removeChild(this);
    this.baseTexture = null;
    this.baseFrame = null;
  }

  private flushPatches() {
    this.patches.forEach(p => {
      p.destroy();
      p.texture.destroy(false);
    });
    this.patches.length = 0;
  }

  private internalLoadTexture(key: string, frame: string) {
    this.baseTexture = this.game.cache.getBaseTexture(key);
    this.internalSetFrame(key, frame);
  }

  private internalSetFrame(key: string, frame: string) {
    this.baseFrame = frame
      ? this.game.cache.getFrameByName(key, frame).getRect()
      : new Phaser.Rectangle(0, 0, this.baseTexture.width, this.baseTexture.height);
  }

  private drawPatches(): void {
    // The positions we want from the base texture
    const textureXs: number[] = [0, this.leftSize, this.baseFrame.width - this.rightSize, this.baseFrame.width];
    const textureYs: number[] = [0, this.topSize, this.baseFrame.height - this.bottomSize, this.baseFrame.height];

    // These are the positions we need the eventual texture to have
    const finalXs: number[] = [0, this.leftSize, this.localWidth - this.rightSize, this.localWidth];
    const finalYs: number[] = [0, this.topSize, this.localHeight - this.bottomSize, this.localHeight];

    for (let yi: number = 0; yi < 3; yi++) {
      for (let xi: number = 0; xi < 3; xi++) {
        const s: Phaser.Image = this.createPatch(
          xi + yi * 3,
          textureXs[xi], // x
          textureYs[yi], // y
          textureXs[xi + 1] - textureXs[xi], // width
          textureYs[yi + 1] - textureYs[yi] // height,
        );

        s.width = finalXs[xi + 1] - finalXs[xi];
        s.height = finalYs[yi + 1] - finalYs[yi];
        s.x = finalXs[xi] - this.localWidth * this.anchor.x;
        s.y = finalYs[yi] - this.localHeight * this.anchor.y;
        this.addChild(s);
      }
    }
  }

  private createPatch(index: number, x: number, y: number, width: number, height: number): Phaser.Image {
    let patch = this.patches[index];
    if (patch) {
      return patch;
    }
    const frame: PIXI.Rectangle = new PIXI.Rectangle(
      this.baseFrame.x + x,
      this.baseFrame.y + y,
      Math.max(width, 1),
      Math.max(height, 1)
    );
    const t = new PIXI.Texture(this.baseTexture, frame);
    patch = new Phaser.Image(this.game, 0, 0, t);
    this.patches.push(patch);
    return patch;
  }
}
