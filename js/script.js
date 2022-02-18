let game = {};
class Game extends Phaser.Scene {
  constructor(key) {
    super(key);
  }
  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("virus", "assets/virus.png");
  }
  create() {
    // Add my own game engine
    game.engine = new Engine(this);

    // Keyboard input
    game.keyboard = this.input.keyboard.createCursorKeys();

    // Create player
    game.player = this.physics.add.sprite(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "player").setGravityY(-1500).setScale(8).setDrag(1500).setCollideWorldBounds(true).setSize(6, 5).setOffset(1, 2);

    // Shoot viruses
    game.viruses = this.physics.add.group();
    game.virusInterval = this.time.addEvent({
      delay: 3000,
      callback: () => {
        let virus = game.viruses.create(game.player.x, game.player.y, "virus").setBounce(1).setCollideWorldBounds(true).setScale(8).setGravityY(-1500);
        this.physics.velocityFromAngle(Math.random() * 360, 200, virus.body.velocity);
      },
      callbackScope: this,
      repeat: -1
    });

    // ---------- Colliders ----------
    this.physics.add.collider(game.viruses, game.viruses);
    this.physics.add.collider(game.player, game.viruses);
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
