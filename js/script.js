let game = {
  virusAmount: 0,
  currentRound: 1,
  virusCooldown: 0
};
class Game extends Phaser.Scene {
  constructor(key) {
    super(key);
  }
  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("virus", "assets/virus.png");
    this.load.image("0", "assets/0.png");
    this.load.image("1", "assets/1.png");
    this.load.image("2", "assets/2.png");
    this.load.image("3", "assets/3.png");
    this.load.image("4", "assets/4.png");
    this.load.image("5", "assets/5.png");
    this.load.image("6", "assets/6.png");
    this.load.image("7", "assets/7.png");
    this.load.image("8", "assets/8.png");
    this.load.image("9", "assets/9.png");
  }
  create() {
    let phaser = this;
    game.virusAmount = 0;

    // Add my own game engine
    game.engine = new Engine(this);

    // Create player
    game.player = this.physics.add.sprite(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "player").setGravityY(-1500).setScale(8).setDrag(1500).setCollideWorldBounds(true).setSize(6, 5).setOffset(1, 2).setImmovable(true);

    // Shoot viruses
    game.viruses = this.physics.add.group();
    this.input.on("pointerdown", (pointer) => {
      if (game.virusCooldown <= 0) {
        // Reset cooldown
        game.virusCooldown = 300;

        // Update virus amount
        if (game.virusAmount >= 10) {
          this.scene.start(`Round${game.currentRound + 1}`);
          game.currentRound++;
        }
        game.virusAmount++;
        let numberArray = String(game.virusAmount).split("");
        for (var i = 0; i < game.virusAmountNumbers.getChildren().length; i++) {
          game.virusAmountNumbers.getChildren()[i].visible = false;
        }
        for (var x = 0; x < numberArray.length; x++) {
          game.virusAmountNumbers.create((x * 40) + 40, 50, numberArray[x]).setScale(8).setScrollFactor(0);
        }

        // Create virus
        let virus = game.viruses.create(pointer.x, pointer.y, "virus").setBounce(1).setCollideWorldBounds(true).setScale(8).setGravityY(-1500).setAngularVelocity(250);
        this.physics.velocityFromAngle(Math.random() * 360, 200, virus.body.velocity);
      }
    });

    // Virus cooldown
    this.time.addEvent({
      delay: 1,
      callback: () => {
        if (game.virusCooldown > 0) {
          game.virusCooldown--;
        }
      },
      callbackScope: this,
      repeat: -1
    });

    // Show amount of viruses
    game.virusAmountNumbers = this.physics.add.staticGroup();
    let numberArray = String(game.virusAmount).split("");
    for (var i = 0; i < numberArray.length; i++) {
      game.virusAmountNumbers.create((i * 40) + 40, 50, numberArray[i]).setScale(8).setScrollFactor(0);
    }

    // ---------- Colliders ----------
    this.physics.add.collider(game.viruses, game.viruses);
    this.physics.add.collider(game.player, game.viruses, () => {
      phaser.scene.start("GameOver");
    });
  }
  update() {
    // Player movement
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
      game.player.setVelocityX(-300);
    }
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
      game.player.setVelocityX(300);
    }
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
      game.player.setVelocityY(300);
    }
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
      game.player.setVelocityY(-300);
    }
  }
}

// Die scene
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }
  preload() {

  }
  create() {
    this.cameras.main.backgroundColor.setTo(255, 255, 255);
  }
  update() {

  }
}

// ---------- Rounds ----------
class Round1 extends Game {
  constructor() {
    super("Round1");
  }
}
class Round2 extends Game {
  constructor() {
    super("Round2");
  }
}
class Round3 extends Game {
  constructor() {
    super("Round3");
  }
}
class Round4 extends Game {
  constructor() {
    super("Round4");
  }
}
