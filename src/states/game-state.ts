import { NinePatch } from "../lib/nine-patch";

export class GameState extends Phaser.State {
  public create(): void {
    super.create();

    const config = {
      frame: "frame1",
      width: 500,
      height: 500,
      data: {
        top: 70,
        bottom: 70,
        right: 70,
        left: 70
      }
    };

    const frame = new NinePatch(this.game, config);
    // frame.anchor.set(0.5, 0.5);
    frame.position.set(250, 250);
    this.game.world.add(frame);
  }
}
