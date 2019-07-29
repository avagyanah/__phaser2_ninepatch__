import { PreloadState } from "./states/preload-state";
import { GameState } from "./states/game-state";

export class Game extends Phaser.Game {
  constructor() {
    super("100%", "100%", Phaser.CANVAS);

    this.state.add("preload", PreloadState, true);
    this.state.add("game", GameState, false);
  }
}
