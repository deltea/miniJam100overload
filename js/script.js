let game = {};
class Game extends Phaser.Scene {
  constructor(key) {
    super(key);
  }
  preload() {
    this.load.image("player", "assets/player.png");
  }
  create() {
    // Add my own game engine
    game.engine = new Engine(this);

    // Keyboard input
    game.keyboard = this.input.keyboard.createCursorKeys();

    // Create player
    game.player = this.physics.add.sprite(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "player").setGravityY(-1500).setScale(8).setDrag(1500).setCollideWorldBounds(true).setSize(6, 5).setOffset(1, 2);
  }
  update() {
    // Player movement
    if (game.keyboard.left.isDown) {
      game.player.setVelocityX(-500);
    }
    if (game.keyboard.right.isDown) {
      game.player.setVelocityX(500);
    }
    if (game.keyboard.down.isDown) {
      game.player.setVelocityY(500);
    }
    if (game.keyboard.up.isDown) {
      game.player.setVelocityY(-500);
    }
  }
}
