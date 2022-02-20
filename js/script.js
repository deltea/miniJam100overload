let game = {
  virusAmount: 0,
  currentRound: 1,
  virusCooldown: 0,
  sfx: {}
};
class Game extends Phaser.Scene {
  constructor(key) {
    super(key);
  }
  preload() {
    this.load.image("player", "assets/guy.png");
    this.load.image("virus1", "assets/virus1.png");
    this.load.image("virus1-1", "assets/virus1-1.png");
    this.load.image("virus1-2", "assets/virus1-2.png");
    this.load.image("virus1-3", "assets/virus1-3.png");
    this.load.image("virus2", "assets/virus2.png");
    this.load.image("virus2-1", "assets/virus2-1.png");
    this.load.image("virus2-2", "assets/virus2-2.png");
    this.load.image("virus2-3", "assets/virus2-3.png");
    this.load.image("cannonVirus", "assets/cannonVirus.png");
    this.load.image("cannonVirus-1", "assets/cannonVirus-1.png");
    this.load.image("cannonVirus-2", "assets/cannonVirus-2.png");
    this.load.image("cannonVirus-3", "assets/cannonVirus-3.png");
    this.load.image("cannonVirusShoot", "assets/cannonVirusShoot.png");
    this.load.image("virusBullet", "assets/virusBullet.png");
    this.load.image("duplicationVirus", "assets/duplicationVirus.png");
    this.load.image("duplicationVirus-1", "assets/duplicationVirus-1.png");
    this.load.image("duplicationVirus-2", "assets/duplicationVirus-2.png");
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
    this.load.audio("talk1", "assets/talk1.wav");
    this.load.audio("talk2", "assets/talk2.wav");
    this.load.audio("talk3", "assets/talk3.wav");
    this.load.audio("talk4", "assets/talk4.wav");
    this.load.audio("talk5", "assets/talk5.wav");
    this.load.audio("talk6", "assets/talk6.wav");
    this.load.audio("talk7", "assets/talk7.wav");
  }
  create() {
    let phaser = this;
    game.virusAmount = 0;
    game.virusCooldown = 0;
    game.scrollAmount = 0;
    game.scrollFactor = 0;

    // Add my own game engine
    game.engine = new Engine(this);

    // "Music"
    game.sfx["talk1"] = this.sound.add("talk1").setLoop(true);
    game.sfx["talk2"] = this.sound.add("talk2").setLoop(true);
    game.sfx["talk3"] = this.sound.add("talk3").setLoop(true);
    game.sfx["talk4"] = this.sound.add("talk4").setLoop(true);
    game.sfx["talk5"] = this.sound.add("talk5").setLoop(true);
    game.sfx["talk6"] = this.sound.add("talk6").setLoop(true);
    game.sfx["talk7"] = this.sound.add("talk7").setLoop(true);

    // Scrolling background
    game.background1 = this.add.tileSprite(0, 0, game.engine.gameWidth, game.engine.gameHeight, "news1").setOrigin(0);
    game.background2 = this.add.tileSprite(0, 0, game.engine.gameWidth / 2, game.engine.gameHeight, "news2").setOrigin(0);

    // Create player
    game.player = this.physics.add.sprite(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "player").setGravityY(-1500).setScale(8).setDrag(1500).setCollideWorldBounds(true).setSize(5, 8).setOffset(2, 0).setImmovable(true);

    // Spawn viruses
    game.viruses = this.physics.add.group();
    this.input.on("pointerdown", (pointer) => {
      if (game.virusCooldown <= 0) {
        // Reset cooldown
        game.virusCooldown = 300;
        game.cooldownIndicator.width = 0;

        // Update virus amount
        if (game.virusAmount >= 10) {
          game.sfx["talk1"].stop();
          game.sfx["talk2"].stop();
          game.sfx["talk3"].stop();
          game.sfx["talk4"].stop();
          game.sfx["talk5"].stop();
          game.sfx["talk6"].stop();
          game.sfx["talk7"].stop();
          if (game.currentRound <= 3) {
            this.scene.start(`Cutscene${game.currentRound + 1}`);
            game.currentRound++;
          } else {
            this.scene.start("Win");
          }
        }
        game.virusAmount++;
        game.scrollAmount = 0.5 * 1.3 ** game.scrollFactor;
        game.scrollFactor += 1;
        if (game.virusAmount <= 7) {
          game.sfx[`talk${game.virusAmount}`].play({volume: game.virusAmount === 1 ? 20 : 0.8});
        }
        let numberArray = String(game.virusAmount).split("");
        for (var i = 0; i < game.virusAmountNumbers.getChildren().length; i++) {
          game.virusAmountNumbers.getChildren()[i].visible = false;
        }
        for (var x = 0; x < numberArray.length; x++) {
          game.virusAmountNumbers.create((x * 40) + 40, 50, numberArray[x]).setScale(8).setScrollFactor(0);
        }

        // Create virus
        if (game.currentRound === 1) {
          let virus = game.viruses.create(pointer.x, pointer.y, "virus1").setBounce(1).setCollideWorldBounds(true).setScale(8).setGravityY(-1500);
          virus.type = "virus1";
          virus.anims.play("spawnVirus1");
          this.time.addEvent({
            delay: 800,
            callback: () => {
              virus.setAngularVelocity(250);
              phaser.physics.velocityFromAngle(Math.random() * 360, 200, virus.body.velocity);
            },
            callbackScope: this,
            repeat: 0
          });
        } else if (game.currentRound === 2) {
          let virus = game.viruses.create(pointer.x, pointer.y, "cannonVirus").setCollideWorldBounds(true).setScale(8).setGravityY(-1500).setBounce(1);
          virus.type = "cannonVirus";
          virus.timer = 250;
          virus.anims.play("spawnCannonVirus");
          this.time.addEvent({
            delay: 800,
            callback: () => {
              virus.setAngularVelocity(20);
              phaser.physics.velocityFromAngle(Math.random() * 360, 50, virus.body.velocity);
            },
            callbackScope: this,
            repeat: 0
          });
        } else if (game.currentRound === 3) {
          let virus = game.viruses.create(pointer.x, pointer.y, "virus2").setBounce(1).setCollideWorldBounds(true).setScale(8).setGravityY(-1500);
          virus.type = "virus2";
          virus.anims.play("spawnVirus2");
          this.time.addEvent({
            delay: 800,
            callback: () => {
              virus.setAngularVelocity(500);
              phaser.physics.velocityFromAngle(Math.random() * 360, 300, virus.body.velocity);
            },
            callbackScope: this,
            repeat: 0
          });
        } else if (game.currentRound === 4) {
          let virus = game.viruses.create(pointer.x, pointer.y, "duplicationVirus").setCollideWorldBounds(true).setScale(8).setGravityY(-1500).setBounce(1).setSize(4, 3).setOffset(0, 0).setOrigin(0.25);
          virus.type = "duplicationVirus";
          virus.anims.play("spawnDuplicationVirus");
          this.time.addEvent({
            delay: 800,
            callback: () => {
              virus.setAngularVelocity(5);
              phaser.physics.velocityFromAngle(Math.random() * 360, 30, virus.body.velocity);
            },
            callbackScope: this,
            repeat: 0
          });
        }
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

    // Virus actions
    game.virusBullet = this.physics.add.group();
    this.time.addEvent({
      delay: 8000,
      callback: () => {
        game.viruses.getChildren().forEach(virus => {
          if (virus.type === "duplicationVirus") {
            virus = game.viruses.create(virus.x, virus.y, "duplicationVirus").setCollideWorldBounds(true).setScale(8).setGravityY(-1500).setAngularVelocity(5).setBounce(1).setSize(4, 3).setOffset(0, 0).setOrigin(0.25);
            virus.anims.play("spawnDuplicationVirus");
            virus.type = "duplicationVirus";
            setTimeout(function () {
              phaser.physics.velocityFromAngle(Math.random() * 360, 25, virus.body.velocity);
            }, 800);
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

    // ---------- Some animation ----------
    game.engine.addAnimation("spawnVirus1", 10, false, false, "virus1-1", "virus1-2", "virus1-3", "virus1");
    game.engine.addAnimation("spawnVirus2", 10, false, false, "virus2-1", "virus2-2", "virus2-3", "virus2");
    game.engine.addAnimation("spawnCannonVirus", 10, false, false, "cannonVirus-1", "cannonVirus-2", "cannonVirus-3", "cannonVirus");
    game.engine.addAnimation("spawnDuplicationVirus", 10, false, false, "duplicationVirus-1", "duplicationVirus-2", "duplicationVirus");

    // ---------- Colliders ----------
    this.physics.add.collider(game.viruses, game.viruses);
    this.physics.add.collider(game.player, game.viruses, () => {
      game.sfx["talk1"].stop();
      game.sfx["talk2"].stop();
      game.sfx["talk3"].stop();
      game.sfx["talk4"].stop();
      game.sfx["talk5"].stop();
      game.sfx["talk6"].stop();
      game.sfx["talk7"].stop();
      phaser.scene.start("GameOver");
    });
    this.physics.add.collider(game.virusBullet, game.player, () => {
      game.sfx["talk1"].stop();
      game.sfx["talk2"].stop();
      game.sfx["talk3"].stop();
      game.sfx["talk4"].stop();
      game.sfx["talk5"].stop();
      game.sfx["talk6"].stop();
      game.sfx["talk7"].stop();
      phaser.scene.start("GameOver");
    });
  }
  update() {
    // Player movement
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
      game.player.setVelocityX(-300);
      game.background1.tilePositionY += game.scrollAmount;
      game.background2.tilePositionY += game.scrollAmount;
    }
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
      game.player.setVelocityX(300);
      game.background1.tilePositionY -= game.scrollAmount;
      game.background2.tilePositionY -= game.scrollAmount;
    }
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
      game.player.setVelocityY(300);
      game.background1.tilePositionX += game.scrollAmount;
      game.background2.tilePositionX += game.scrollAmount;
    }
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
      game.player.setVelocityY(-300);
      game.background1.tilePositionX -= game.scrollAmount;
      game.background2.tilePositionX -= game.scrollAmount;
    }

    // Move cooldown indicator too
    game.cooldownIndicator.x = game.player.x + 5;
    game.cooldownIndicator.y = game.player.y - 45;

    // Cannon virus action
    game.viruses.getChildren().forEach(virus => {
      if (virus.type === "cannonVirus") {
        if (virus.timer > 0) {
          virus.timer--;
        } else {
          let bullet = game.virusBullet.create(virus.x, virus.y, "virusBullet").setScale(8).setGravityY(-1500).setSize(2, 2).setOffset(3, 3);
          this.physics.velocityFromAngle(virus.angle, 500, bullet.body.velocity);
          virus.timer = 250;
        }
      }
    });
  }
}

// Die scene
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }
  preload() {
    this.load.image("chaos", "assets/chaos.png");
    this.load.image("news1", "assets/news1.jpg");
    this.load.image("news2", "assets/news2.jpg");
    this.load.audio("talk1", "assets/talk1.wav");
    this.load.audio("talk2", "assets/talk2.wav");
    this.load.audio("talk3", "assets/talk3.wav");
    this.load.audio("talk4", "assets/talk4.wav");
    this.load.audio("talk5", "assets/talk5.wav");
    this.load.audio("talk6", "assets/talk6.wav");
    this.load.audio("talk7", "assets/talk7.wav");
  }
  create() {
    let phaser = this;
    // Sound
    game.talk1 = this.sound.add("talk1").setLoop(true);
    game.talk1.play({rate: 2});
    game.talk2 = this.sound.add("talk2").setLoop(true);
    game.talk2.play({rate: 2});
    game.talk3 = this.sound.add("talk3").setLoop(true);
    game.talk3.play({rate: 2});
    game.talk4 = this.sound.add("talk4").setLoop(true);
    game.talk4.play({rate: 2});
    game.talk5 = this.sound.add("talk5").setLoop(true);
    game.talk5.play({rate: 2});
    game.talk6 = this.sound.add("talk6").setLoop(true);
    game.talk6.play({rate: 2});
    game.talk7 = this.sound.add("talk7").setLoop(true);
    game.talk7.play({rate: 2});

    // Fade in to the scene
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Scrolling background
    game.gameOverBackground1 = this.add.tileSprite(0, 0, game.engine.gameWidth, game.engine.gameHeight, "news1").setOrigin(0);
    game.gameOverBackground2 = this.add.tileSprite(0, 0, game.engine.gameWidth / 2, game.engine.gameHeight, "news2").setOrigin(0);

    // Text
    game.chaosText = this.add.image(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "chaos").setScale(8);
    this.tweens.add({
      targets: game.chaosText,
      scaleX: 16,
      scaleY: 16,
      duration: 500,
      repeat: -1,
      yoyo: true
    });
    this.input.on("pointerdown", function () {
      game.talk1.stop();
      game.talk2.stop();
      game.talk3.stop();
      game.talk4.stop();
      game.talk5.stop();
      game.talk6.stop();
      game.talk7.stop();
      phaser.cameras.main.fadeOut(1000, 0, 0, 0);
      phaser.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
        phaser.scene.start(`Cutscene${game.currentRound}`);
      });
    });
  }
  update() {
    game.gameOverBackground1.tilePositionY += 50;
    game.gameOverBackground2.tilePositionY += 50;
    game.gameOverBackground1.tilePositionX += 50;
    game.gameOverBackground2.tilePositionX += 50;
  }
}

// Win scene
class Win extends Phaser.Scene {
  constructor() {
    super("Win");
  }
  preload() {
    this.load.image("finally", "assets/finally.png");
    this.load.image("peace", "assets/peace.png");
  }
  create() {
    // Fade in to the scene
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Text
    game.engine = new Engine(this);
    game.finallyText = this.add.image(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "finally").setScale(8).setAlpha(0);
    game.peaceText = this.add.image(game.engine.gameWidth / 2, game.engine.gameHeight / 2, "peace").setScale(8).setAlpha(0);

    // Fade in text
    this.tweens.add({
      targets: game.finallyText,
      delay: 1000,
      alpha: 1,
      duration: 2000,
      repeat: 0,
      onComplete: () => {
        this.tweens.add({
          targets: game.finallyText,
          alpha: 0,
          duration: 2000,
          repeat: 0
        });
        this.tweens.add({
          targets: game.peaceText,
          delay: 3000,
          alpha: 1,
          duration: 2000,
          repeat: 0,
          onComplete: () => {
            this.tweens.add({
              targets: game.peaceText,
              alpha: 0,
              duration: 2000,
              repeat: 0
            });
          }
        });
      }
    });
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
    super("Cutscene1", "assets/guy.png", "assets/virus1.png", "assets/vs.png", "Round1");
  }
}
class Cutscene2 extends Cutscene {
  constructor() {
    super("Cutscene2", "assets/guy.png", "assets/cannonVirus.png", "assets/vs.png", "Round2");
  }
}
class Cutscene3 extends Cutscene {
  constructor() {
    super("Cutscene3", "assets/guy.png", "assets/virus2.png", "assets/vs.png", "Round3");
  }
}
class Cutscene4 extends Cutscene {
  constructor() {
    super("Cutscene4", "assets/guy.png", "assets/duplicationVirus.png", "assets/vs.png", "Round4");
  }
}
