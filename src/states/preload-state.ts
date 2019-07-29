import { NineSlicePlugin } from "@koreez/phaser3-ninepatch";

export class PreloadState extends Phaser.State {
  public init(): void {
    super.init();

    this.game.stage.backgroundColor = "#ffffff";
    this.game.renderer.renderSession.roundPixels = true;
    // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.game.scale.pageAlignHorizontally = true;
    // this.game.scale.pageAlignVertically = true;
  }

  public preload(): void {
    this.game.load.image("frame1", "./frame1.png");
    this.game.load.image("frame2", "./frame2.png");
  }

  public create(): void {
    super.create();

    this.game.state.start("game");
  }
}
