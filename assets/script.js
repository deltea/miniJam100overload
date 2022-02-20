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
    this.load.image("player", "assets/guy.png");
    this.load.image("virus1", "assets/virus1.png");
    this.load.image("virus2", "assets/virus2.png");
    this.load.image("cannonVirus", "assets/cannonVirus.png");
    this.load.image("virusBullet", "assets/virusBullet.png");
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
    this.load.image("news1", "assets/news1.jpg");
    this.load.image("news2", "assets/news2.jpg");
  }
  create() {
    let phaser = this;
    game.virusAmount = 0;

    // Add my own game engine
    game.engine = new Engine(this);

    // Scrolling background
    game.background1 = this.add.tileSprite(0, 0, game.engine.gameWidth, game.engine.gameHeight, "news1").setOrigin(0);
    game.background2 = this.add.tileSprite(0, 0, game.engine.gameWidth / 2, game.engine.gameHeight, "news2").setOrigin(0);

    // Create player
    game.player = this.physics.add.sprite(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "player").setGravityY(-1500).setScale(8).setDrag(1500).setCollideWorldBounds(true).setSize(6, 5).setOffset(1, 2).setImmovable(true);

    // Shoot viruses
    game.viruses = this.physics.add.group();
    this.input.on("pointerdown", (pointer) => {
      if (game.virusCooldown <= 0) {
        // Reset cooldown
        game.virusCooldown = 300;
        game.cooldownIndicator.width = 0;

        // Update virus amount
        if (game.virusAmount >= 10) {
          this.scene.start(`Cutscene${game.currentRound}`);
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
        let type;
        let virus;
        switch (game.currentRound) {
          case 2:
            type = "cannonVirus";
            virus = game.viruses.create(pointer.x, pointer.y, type).setCollideWorldBounds(true).setScale(8).setGravityY(-1500).setAngularVelocity(20).setBounce(1);
            this.physics.velocityFromAngle(Math.random() * 360, 50, virus.body.velocity);
            break;
          case 1:
            type = "virus2";
            virus = game.viruses.create(pointer.x, pointer.y, type).setBounce(1).setCollideWorldBounds(true).setScale(8).setGravityY(-1500).setAngularVelocity(500);
            this.physics.velocityFromAngle(Math.random() * 360, 400, virus.body.velocity);
            break;
          default:
            type = "virus1";
            virus = game.viruses.create(pointer.x, pointer.y, type).setBounce(1).setCollideWorldBounds(true).setScale(8).setGravityY(-1500).setAngularVelocity(250);
            this.physics.velocityFromAngle(Math.random() * 360, 200, virus.body.velocity);
        }
        virus.type = type;
      }
    });

    // Virus cooldown
    this.time.addEvent({
      delay: 1,
      callback: () => {
        if (game.virusCooldown > 0) {
          game.virusCooldown--;
          game.cooldownIndicator.width += 0.16;
        }
      },
      callbackScope: this,
      repeat: -1
    });

    // Cannon viruses
    game.virusBullet = this.physics.add.group();
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        game.viruses.getChildren().forEach(virus => {
          if (virus.type === "cannonVirus") {
            let bullet = game.virusBullet.create(virus.x, virus.y, "virusBullet").setScale(8).setGravityY(-1500);
            this.physics.velocityFromAngle(virus.angle, 500, bullet.body.velocity);
          }
        });
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

    // Show virus cooldown
    game.cooldownIndicator = this.add.rectangle(game.player.x + 5, game.player.y - 45, 50, 10, 0xff1100);

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

    // Move cooldown indicator too
    game.cooldownIndicator.x = game.player.x + 5;
    game.cooldownIndicator.y = game.player.y - 45;

    // Scroll background image
    game.background1.tilePositionY += 0.5;
    game.background2.tilePositionY += 0.5;
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

// ---------- Cutscenes ----------
class Cutscene1 extends Cutscene {
  constructor() {
    super("Cutscene1", {path: "assets/guy.png"}, {path: "assets/cannonVirus.png"}, {path: "assets/vs.png"}, "Round2");
  }
}
class Cutscene2 extends Cutscene {
  constructor() {
    super("Cutscene2", {path: "assets/guy.png"}, {path: "assets/virus2.png"}, {path: "assets/vs.png"}, "Round3");
  }
}
class Cutscene3 extends Cutscene {
  constructor() {
    super("Cutscene3", {path: "assets/guy.png"}, {path: "assets/virus1.png"}, {path: "assets/vs.png"}, "Round4");
  }
}
