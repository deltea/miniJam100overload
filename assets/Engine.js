/*^*^*^*^*^*^*^*
Engine.js
A phaser-based game engine with tools.
*^*^*^*^*^*^*^*/

class Engine {
  constructor(phaser) {
    this.phaser = phaser;
    this.mouseDown = false;
    this.gameWidth = phaser.sys.game.canvas.width;
    this.gameHeight = phaser.sys.game.canvas.height;
  }

  // ---------- Tools ----------
  randomBetween(min, max) {
    // Returns a random number between min and max
    return Math.random() * (max - min) + min;
  }
  roundRandomBetween(min, max) {
    // Same thing as randomBetween but rounded
    // WARNING: INCLUDES BOTH MIN AND MAX
    return Math.round(Math.random() * (max - min) + min);
  }
  randomPercentage() {
    // Returns a random number between 1 and 100
    return Math.round(Math.random() * 100);
  }
  percentageCheck(percentages, percentage) {
    // Checks which range the random percentage is in, and return the index of the range
    for (var i = 0; i < percentages.length; i++) {
      if (percentage >= percentages[i][0] && percentage < percentages[i][1]) {
        return percentages.indexOf(percentages[i]);
      }
    }
  }

  // ---------- Phaser ----------
  mouseInput() {
    // Checks whether the mouse is down
    let engine = this;
    this.phaser.input.on("pointerdown", function () {
      engine.mouseDown = true;
    });
    this.phaser.input.on("pointerup", function () {
      engine.mouseDown = false;
    });
  }
  addAnimation(name, frameRate, repeat, yoyo, ...keys) {
    // Adds a animation
    let keyArray = [];
    for (var i = 0; i < keys.length; i++) {
      keyArray.push({key: keys[i]});
    }
    this.phaser.anims.create({
      key: name,
      frames: keyArray,
      frameRate: frameRate,
      repeat: repeat ? -1 : 0,
      yoyo: yoyo
    });
  }
}

// ---------- Common scenes ----------
class Cutscene extends Phaser.Scene {
  constructor(key, sprite1, sprite2, vs, nextScene) {
    super(key);
    this.sprite1 = sprite1;
    this.sprite2 = sprite2;
    this.vs = vs;
    this.nextScene = nextScene;
  }
  preload() {
    this.load.image("sprite1", this.sprite1.path);
    this.load.image("sprite2", this.sprite2.path);
    this.load.image("vs", this.vs.path);
  }
  create() {
    let phaser = this;
    game.engine = new Engine(this);
    game.sprite1 = this.physics.add.staticSprite(-128, (game.engine.gameHeight / 2) - 64, "sprite1").setScale(16);
    game.sprite2 = this.physics.add.staticSprite(game.engine.gameWidth + 128, (game.engine.gameHeight / 2) - 64, "sprite2").setScale(16);
    game.vs = this.physics.add.staticSprite(game.engine.gameWidth / 2, -128, "vs").setScale(16);
    game.sprite1.moveTween = this.tweens.add({
      targets: game.sprite1,
      x: game.sprite1.x + (game.engine.gameWidth / 2) - (game.engine.gameWidth / 6),
      ease: "Back.easeInOut",
      duration: 500,
      onComplete: () => {
        game.vs.moveTween.play();
      }
    });
    game.sprite2.moveTween = this.tweens.add({
      targets: game.sprite2,
      x: game.sprite2.x - (game.engine.gameWidth / 2) + (game.engine.gameWidth / 6),
      ease: "Back.easeInOut",
      duration: 500,
      paused: true
    });
    game.vs.moveTween = this.tweens.add({
      targets: game.vs,
      y: game.vs.y + (game.engine.gameHeight / 2) + 64,
      ease: "Back.easeInOut",
      duration: 500,
      paused: true,
      onComplete: () => {
        game.sprite2.moveTween.play();
      }
    });
    this.input.on("pointerdown", () => {
      phaser.scene.start(this.nextScene);
    });
  }
  update() {

  }
}
